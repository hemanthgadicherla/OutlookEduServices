const supabase = require('../config/supabase');

const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

const validator = require('validator');


// Admin Login
exports.login = async (req, res) => {

  try {

    let { email, password } = req.body;

    email = email.trim().toLowerCase();


    // Validate Input
    if (!email || !password) {

      return res.status(400).json({

        success: false,

        message: 'Email and password are required'

      });

    }


    // Validate Email
    if (!validator.isEmail(email)) {

      return res.status(400).json({

        success: false,

        message: 'Invalid email format'

      });

    }


    // Find Admin
    const { data: admin, error } = await supabase

      .from('admins')

      .select('*')

      .eq('email', email)

      .single();


    if (error || !admin) {

      return res.status(401).json({

        success: false,

        message: 'Invalid credentials'

      });

    }


    // Compare Password
    const isMatch = await bcrypt.compare(

      password,

      admin.password

    );


    if (!isMatch) {

      return res.status(401).json({

        success: false,

        message: 'Invalid credentials'

      });

    }


    // Generate JWT
    const token = jwt.sign(

      {

        id: admin.id,

        email: admin.email,

        role: admin.role || "admin"

      },

      process.env.JWT_SECRET,

      {

        expiresIn: process.env.JWT_EXPIRES || '7d'

      }

    );


    // Success Response
    res.status(200).json({

      success: true,

      message: 'Login successful',

      token,

      admin: {

        id: admin.id,

        email: admin.email,

        role: admin.role

      }

    });

  }

  catch (error) {

    console.error(error);
    res.status(500).json({

      success: false,

      message: 'Server error'

    });

  }

};

exports.verifyAdmin = async ( req, res ) => {
  res.status(200).json({
    success: true,
    admin: req.user
  });
};
