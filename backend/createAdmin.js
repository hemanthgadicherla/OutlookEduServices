require('dotenv').config();

const bcrypt = require('bcryptjs');

const supabase =
  require('./config/supabase');

async function createAdmin() {

  try {

    const email =
      'admin@gmail.com';

    const password =
      '123456';

    // Hash Password
    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );

    console.log(
      'HASH:',
      hashedPassword
    );

    // Insert Admin
    const {
      data,
      error
    } = await supabase

      .from('admins')

      .insert([{

        email,

        password:
          hashedPassword,

        role: 'admin'

      }])

      .select();

    if (error) {

      console.error(error);

      return;

    }

    console.log(
      'Admin created successfully'
    );
    console.log(data);

  }

  catch (error) {

    console.error(error);

  }

}

createAdmin();