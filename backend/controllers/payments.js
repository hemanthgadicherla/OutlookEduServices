const razorpay = require('../config/razorpay');
const supabase  = require('../config/supabase');
const crypto    = require('crypto');

// ─────────────────────────────────────────────────────────────
// POST /api/payments/create-order
// Creates a Razorpay order and stores it in the payments table.
// Amount is validated server-side against the course price in DB.
// ─────────────────────────────────────────────────────────────
const createOrder = async (req, res) => {
  if (!razorpay) {
    return res.status(503).json({
      success: false,
      message: 'Payment gateway is not configured. Please contact support.'
    });
  }

  const { registrationId } = req.body;

  if (!registrationId) {
    return res.status(400).json({ success: false, message: 'registrationId is required' });
  }

  // Fetch registration + course price from DB — never trust frontend amount
  const { data: registration, error: regError } = await supabase
    .from('registrations')
    .select('id, email, selected_course, payment_status, course_id')
    .eq('id', registrationId)
    .single();

  if (regError || !registration) {
    return res.status(404).json({ success: false, message: 'Registration not found' });
  }

  if (registration.payment_status === 'paid') {
    return res.status(400).json({ success: false, message: 'This registration is already paid' });
  }

  // Get authoritative price from courses table
  let amount = 0;
  if (registration.course_id) {
    const { data: course } = await supabase
      .from('courses')
      .select('price')
      .eq('id', registration.course_id)
      .single();
    if (course) amount = Number(course.price);
  }

  // Fallback: look up by title if course_id is null
  if (!amount && registration.selected_course) {
    const { data: course } = await supabase
      .from('courses')
      .select('price')
      .eq('title', registration.selected_course)
      .single();
    if (course) amount = Number(course.price);
  }

  if (!amount || amount <= 0) {
    return res.status(400).json({ success: false, message: 'Could not determine course price' });
  }

  // Check for an existing unpaid order for this registration (prevent duplicate orders)
  const { data: existingPayment } = await supabase
    .from('payments')
    .select('razorpay_order_id, amount, status')
    .eq('registration_id', registrationId)
    .eq('status', 'created')
    .maybeSingle();

  if (existingPayment) {
    // Reuse the existing Razorpay order instead of creating a new one
    return res.json({
      success: true,
      order: {
        id:       existingPayment.razorpay_order_id,
        amount:   existingPayment.amount * 100,
        currency: 'INR'
      }
    });
  }

  // Create Razorpay order
  const order = await razorpay.orders.create({
    amount:          Math.round(amount * 100), // paisa
    currency:        'INR',
    receipt:         `rcpt_${registrationId}_${Date.now()}`,
    payment_capture: 1
  });

  // Persist order in payments table
  const { error: insertError } = await supabase
    .from('payments')
    .insert([{
      razorpay_order_id: order.id,
      amount:            amount,
      currency:          'INR',
      status:            'created',
      registration_id:   registrationId,
      created_at:        new Date().toISOString()
    }]);

  if (insertError) throw insertError;

  return res.json({
    success: true,
    order: {
      id:       order.id,
      amount:   order.amount,
      currency: order.currency
    }
  });
};


// ─────────────────────────────────────────────────────────────
// POST /api/payments/verify
// Verifies Razorpay HMAC-SHA256 signature.
// On success: marks payment completed, registration paid,
// and grants LMS access.
// ─────────────────────────────────────────────────────────────
const verifyPayment = async (req, res) => {
  const {
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature,
    registrationId
  } = req.body;

  if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature || !registrationId) {
    return res.status(400).json({ success: false, message: 'Missing payment verification fields' });
  }

  // HMAC-SHA256 signature verification — never trust frontend
  const expectedSign = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  if (razorpay_signature !== expectedSign) {
    // Mark payment as failed
    await supabase
      .from('payments')
      .update({ status: 'failed' })
      .eq('razorpay_order_id', razorpay_order_id);

    await supabase
      .from('registrations')
      .update({ payment_status: 'failed' })
      .eq('id', registrationId);

    return res.status(400).json({ success: false, message: 'Payment verification failed. Invalid signature.' });
  }

  // Idempotency: check if already processed
  const { data: existingPayment } = await supabase
    .from('payments')
    .select('status')
    .eq('razorpay_order_id', razorpay_order_id)
    .single();

  if (existingPayment?.status === 'completed') {
    return res.json({ success: true, message: 'Payment already verified' });
  }

  // Update payments table
  const { data: paymentData, error: paymentError } = await supabase
    .from('payments')
    .update({
      razorpay_payment_id: razorpay_payment_id,
      razorpay_signature:  razorpay_signature,
      status:              'completed'
    })
    .eq('razorpay_order_id', razorpay_order_id)
    .select()
    .single();

  if (paymentError) throw paymentError;

  // Update registration
  const { data: regData, error: regError } = await supabase
    .from('registrations')
    .update({
      payment_status: 'paid',
      payment_id:     razorpay_payment_id
    })
    .eq('id', registrationId)
    .select()
    .single();

  if (regError) throw regError;

  // Grant LMS access
  await grantLmsAccess(regData);

  return res.json({
    success: true,
    message: 'Payment verified successfully',
    payment: paymentData
  });
};


// ─────────────────────────────────────────────────────────────
// POST /api/payments/webhook
// Razorpay webhook — secondary verification layer.
// Handles: payment.captured, payment.failed, order.paid
// Body is raw Buffer (parsed before express.json middleware).
// ─────────────────────────────────────────────────────────────
const handleWebhook = async (req, res) => {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.warn('RAZORPAY_WEBHOOK_SECRET not set — skipping webhook verification');
    return res.status(200).json({ received: true });
  }

  const signature = req.headers['x-razorpay-signature'];
  if (!signature) {
    return res.status(400).json({ success: false, message: 'Missing webhook signature' });
  }

  // Verify webhook signature using raw body
  const rawBody = req.body; // Buffer from express.raw()
  const expectedSign = crypto
    .createHmac('sha256', webhookSecret)
    .update(rawBody)
    .digest('hex');

  if (signature !== expectedSign) {
    return res.status(400).json({ success: false, message: 'Invalid webhook signature' });
  }

  let event;
  try {
    event = JSON.parse(rawBody.toString());
  } catch {
    return res.status(400).json({ success: false, message: 'Invalid JSON payload' });
  }

  const eventType = event.event;
  console.log(`Razorpay webhook received: ${eventType}`);

  try {
    if (eventType === 'payment.captured' || eventType === 'order.paid') {
      const payment = event.payload?.payment?.entity;
      if (!payment) return res.status(200).json({ received: true });

      const orderId   = payment.order_id;
      const paymentId = payment.id;

      // Idempotency check
      const { data: existing } = await supabase
        .from('payments')
        .select('status, registration_id')
        .eq('razorpay_order_id', orderId)
        .maybeSingle();

      if (!existing || existing.status === 'completed') {
        return res.status(200).json({ received: true });
      }

      // Update payment
      await supabase
        .from('payments')
        .update({ razorpay_payment_id: paymentId, status: 'completed' })
        .eq('razorpay_order_id', orderId);

      // Update registration
      const { data: regData } = await supabase
        .from('registrations')
        .update({ payment_status: 'paid', payment_id: paymentId })
        .eq('id', existing.registration_id)
        .select()
        .single();

      if (regData) await grantLmsAccess(regData);
    }

    if (eventType === 'payment.failed') {
      const payment = event.payload?.payment?.entity;
      if (!payment) return res.status(200).json({ received: true });

      await supabase
        .from('payments')
        .update({ status: 'failed' })
        .eq('razorpay_order_id', payment.order_id);

      await supabase
        .from('registrations')
        .update({ payment_status: 'failed' })
        .eq('id', (await supabase
          .from('payments')
          .select('registration_id')
          .eq('razorpay_order_id', payment.order_id)
          .single()
        ).data?.registration_id);
    }
  } catch (err) {
    console.error('Webhook processing error:', err);
    // Always return 200 to Razorpay to prevent retries for non-critical errors
  }

  return res.status(200).json({ received: true });
};


// ─────────────────────────────────────────────────────────────
// INTERNAL: Grant LMS access after successful payment
// Creates user_courses row if not already present.
// ─────────────────────────────────────────────────────────────
const grantLmsAccess = async (registration) => {
  try {
    if (!registration?.email || !registration?.selected_course) return;

    // Find user by email
    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('email', registration.email)
      .maybeSingle();

    if (!user) return;

    // Find course
    let courseId = registration.course_id;
    if (!courseId) {
      const { data: course } = await supabase
        .from('courses')
        .select('id')
        .eq('title', registration.selected_course)
        .maybeSingle();
      courseId = course?.id;
    }

    if (!courseId) return;

    // Upsert — safe to call multiple times
    await supabase
      .from('user_courses')
      .upsert([{
        user_id:        user.id,
        course_id:      courseId,
        payment_status: 'paid',
        created_at:     new Date().toISOString()
      }], { onConflict: 'user_id,course_id' });

    // Upgrade user role to 'student' if currently 'user'
    await supabase
      .from('users')
      .update({ role: 'student' })
      .eq('id', user.id)
      .eq('role', 'user');

  } catch (err) {
    console.error('grantLmsAccess error:', err);
  }
};


// ─────────────────────────────────────────────────────────────
// GET /api/payments  (admin only — protected in route)
// ─────────────────────────────────────────────────────────────
const getPayments = async (req, res) => {
  const { data, error } = await supabase
    .from('payments')
    .select(`
      *,
      registrations (
        student_name,
        email,
        selected_course,
        phone
      )
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return res.json({ success: true, data });
};


// ─────────────────────────────────────────────────────────────
// GET /api/payments/stats  (admin only — protected in route)
// ─────────────────────────────────────────────────────────────
const getPaymentStats = async (req, res) => {
  const { data, error } = await supabase
    .from('payments')
    .select('amount, status, created_at');

  if (error) throw error;

  const stats = {
    totalRevenue:       data.reduce((s, p) => s + (p.status === 'completed' ? Number(p.amount) : 0), 0),
    totalPayments:      data.length,
    completedPayments:  data.filter(p => p.status === 'completed').length,
    pendingPayments:    data.filter(p => p.status === 'created').length,
    failedPayments:     data.filter(p => p.status === 'failed').length
  };

  return res.json({ success: true, data: stats });
};


module.exports = {
  createOrder,
  verifyPayment,
  handleWebhook,
  getPayments,
  getPaymentStats
};
