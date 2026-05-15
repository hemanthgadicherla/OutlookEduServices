const supabase =
  require('../config/supabase');


// CREATE LEAD
const createLead = async (
  req,
  res
) => {

  try {

    const {
      name,
      email,
      phone,
      subject,
      message
    } = req.body;


    const {
      data,
      error
    } = await supabase

      .from('leads')

      .insert([{

        name,

        email,

        phone,

        subject,

        message,

        contacted: false,

        created_at:
          new Date().toISOString()

      }])

      .select()

      .single();


    if (error) {

      throw error;

    }


    res.status(201).json({

      success: true,

      message:
        'Lead submitted successfully',

      data

    });

  }

  catch (error) {

    console.error(
      'Create lead error:',
      error
    );

    res.status(500).json({

      success: false,

      message:
        'Failed to submit lead'

    });

  }

};



// GET LEADS
const getLeads = async (
  req,
  res
) => {

  try {

    const {
      data,
      error
    } = await supabase

      .from('leads')

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
      'Get leads error:',
      error
    );

    res.status(500).json({

      success: false,

      message:
        'Failed to fetch leads'

    });

  }

};


// UPDATE LEAD STATUS
const updateLead = async (
  req,
  res
) => {

  try {

    const { id } =
      req.params;


    const {
      contacted
    } = req.body;


    const {
      data,
      error
    } = await supabase

      .from('leads')

      .update({

        contacted

      })

      .eq('id', id)

      .select()

      .single();


    if (error) {

      throw error;

    }


    res.json({

      success: true,

      message:
        'Lead updated successfully',

      data

    });

  }

  catch (error) {

    console.error(
      'Update lead error:',
      error
    );

    res.status(500).json({

      success: false,

      message:
        'Failed to update lead'

    });

  }

};


// DELETE LEAD
const deleteLead = async (
  req,
  res
) => {

  try {

    const { id } =
      req.params;


    const {
      error
    } = await supabase

      .from('leads')

      .delete()

      .eq('id', id);


    if (error) {

      throw error;

    }


    res.json({

      success: true,

      message:
        'Lead deleted successfully'

    });

  }

  catch (error) {

    console.error(
      'Delete lead error:',
      error
    );

    res.status(500).json({

      success: false,

      message:
        'Failed to delete lead'

    });

  }

};


module.exports = {

  createLead,  

  getLeads,

  updateLead,

  deleteLead

};