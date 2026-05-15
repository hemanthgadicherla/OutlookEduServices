const supabase =
  require('../config/supabase');


// GET SUBSCRIBERS
const getSubscribers =
  async (req, res) => {

  try {

    const {
      data,
      error
    } = await supabase

      .from('blog_subscribers')

      .select('*')

      .order(
        'created_at',
        {
          ascending: false
        }
      );


    if (error) {

      throw error;

    }


    res.json({

      success: true,

      data

    });

  }

  catch (error) {

    console.error(
      'Get subscribers error:',
      error
    );

    res.status(500).json({

      success: false,

      message:
        'Failed to fetch subscribers'

    });

  }

};


// DELETE SUBSCRIBER
const deleteSubscriber =
  async (req, res) => {

  try {

    const { id } =
      req.params;


    const {
      error
    } = await supabase

      .from('blog_subscribers')

      .delete()

      .eq('id', id);


    if (error) {

      throw error;

    }


    res.json({

      success: true,

      message:
        'Subscriber deleted successfully'

    });

  }

  catch (error) {

    console.error(
      'Delete subscriber error:',
      error
    );

    res.status(500).json({

      success: false,

      message:
        'Failed to delete subscriber'

    });

  }

};


module.exports = {

  getSubscribers,

  deleteSubscriber

};