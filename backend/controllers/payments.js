const razorpay = require('../config/razorpay');
const supabase = require('../config/supabase');
const crypto = require('crypto');

const createOrder = async (req, res) => {
  try {
    const { amount, registrationId } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid amount is required'
      });
    }

    // Create Razorpay order
    const options = {
      amount: amount * 100, // Razorpay expects amount in paisa
      currency: 'INR',
      receipt: `receipt_${registrationId}_${Date.now()}`,
      payment_capture: 1
    };

    const order = await razorpay.orders.create(options);

    // Save order details in database
    const { data, error } = await supabase
      .from('payments')
      .insert([{
        razorpay_order_id: order.id,
        amount: amount,
        status: 'created',
        registration_id: registrationId,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      throw error;
    }

    res.json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency
      }
    });

  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create payment order'
    });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      registrationId
    } = req.body;

    // Verify signature
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest('hex');

    if (razorpay_signature !== expectedSign) {
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed'
      });
    }

    // Update payment status in database
    const { data: paymentData, error: paymentError } = await supabase
      .from('payments')
      .update({
        razorpay_payment_id: razorpay_payment_id,
        status: 'completed'
      })
      .eq('razorpay_order_id', razorpay_order_id)
      .select()
      .single();

    if (paymentError) {
      throw paymentError;
    }

    // Update registration payment status
    const { error: regError } = await supabase
      .from('registrations')
      .update({ payment_status: 'paid', payment_id: razorpay_payment_id })
      .eq('id', registrationId);

    if (regError) {
      throw regError;
    }

    res.json({
      success: true,
      message: 'Payment verified successfully',
      payment: paymentData
    });

  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Payment verification failed'
    });
  }
};

const getPayments = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('payments')
      .select(`
        *,
        registrations (
          student_name,
          email,
          selected_course
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    res.json({
      success: true,
      data: data
    });

  } catch (error) {
    console.error('Get payments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payments'
    });
  }
};

const getPaymentStats = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('payments')
      .select('amount, status, created_at');

    if (error) {
      throw error;
    }

    const stats = {
      totalRevenue: data.reduce((sum, payment) => sum + (payment.status === 'completed' ? payment.amount : 0), 0),
      totalPayments: data.length,
      completedPayments: data.filter(p => p.status === 'completed').length,
      pendingPayments: data.filter(p => p.status === 'created').length
    };

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Get payment stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payment statistics'
    });
  }
};

module.exports = {
  createOrder,
  verifyPayment,
  getPayments,
  getPaymentStats
};