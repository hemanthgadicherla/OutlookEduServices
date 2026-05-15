const cloudinary =
  require('../config/cloudinary');


// Upload Image
exports.uploadImage = async (
  req,
  res
) => {

  try {

    if (!req.file) {

      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });

    }


    const base64 =
      `data:${
        req.file.mimetype
      };base64,${
        req.file.buffer.toString(
          'base64'
        )
      }`;


    const result =
      await cloudinary.uploader.upload(
        base64,
        {
          folder:
            'outlook-edu-services'
        }
      );


    res.status(200).json({

      success: true,

      imageUrl:
        result.secure_url

    });

  }

  catch (error) {

    console.error(
      'Upload error:',
      error
    );

    res.status(500).json({

      success: false,

      message:
        'Image upload failed'

    });

  }

};