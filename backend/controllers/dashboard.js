const supabase =
  require('../config/supabase');


// GET DASHBOARD STATS
const getDashboardStats =
  async (req, res) => {

  try {

    // REGISTRATIONS COUNT
    const {
      count: registrationsCount
    } = await supabase

      .from('registrations')

      .select('*', {
        count: 'exact',
        head: true
      });


    // COURSES COUNT
    const {
      count: coursesCount
    } = await supabase

      .from('courses')

      .select('*', {
        count: 'exact',
        head: true
      });


    // BLOGS COUNT
    const {
      count: blogsCount
    } = await supabase

      .from('blogs')

      .select('*', {
        count: 'exact',
        head: true
      });


    // PAID REGISTRATIONS
    const {
      count: paidRegistrations
    } = await supabase

      .from('registrations')

      .select('*', {
        count: 'exact',
        head: true
      })

      .eq(
        'payment_status',
        'paid'
      );


    // PENDING REGISTRATIONS
    const {
      count: pendingRegistrations
    } = await supabase

      .from('registrations')

      .select('*', {
        count: 'exact',
        head: true
      })

      .eq(
        'payment_status',
        'pending'
      );


    // RECENT REGISTRATIONS
    const {
      data: recentRegistrations
    } = await supabase

      .from('registrations')

      .select('*')

      .order(
        'created_at',
        {
          ascending: false
        }
      )

      .limit(5);


    res.json({

      success: true,

      data: {

        totalRegistrations:
          registrationsCount || 0,

        totalCourses:
          coursesCount || 0,

        totalBlogs:
          blogsCount || 0,

        paidRegistrations:
          paidRegistrations || 0,

        pendingRegistrations:
          pendingRegistrations || 0,

        recentRegistrations:
          recentRegistrations || []

      }

    });

  }

  catch (error) {

    console.error(
      'Dashboard stats error:',
      error
    );

    res.status(500).json({

      success: false,

      message:
        'Failed to fetch dashboard stats'

    });

  }

};


module.exports = {

  getDashboardStats

};