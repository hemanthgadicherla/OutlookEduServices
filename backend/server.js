const dashboardRoutes =
  require('./routes/dashboard');

const express =
  require('express');

const cors =
  require('cors');

const helmet =
  require('helmet');

const rateLimit =
  require('express-rate-limit');

const dotenv =
  require('dotenv');

const hpp =
  require('hpp');

require(
  'express-async-errors'
);

const morgan =
  require('morgan');

const xss =
  require('xss-clean');

const mongoSanitize =
  require(
    'express-mongo-sanitize'
  );


// LOAD ENV
dotenv.config();


// ENV VALIDATION
if (!process.env.JWT_SECRET) {

  throw new Error(
    'JWT_SECRET missing'
  );

}

if (!process.env.SUPABASE_URL) {

  throw new Error(
    'SUPABASE_URL missing'
  );

}

if (
  !process.env.SUPABASE_SERVICE_ROLE_KEY
) {

  throw new Error(

    'SUPABASE_SERVICE_ROLE_KEY missing'

  );

}


console.log(
  'Server initialized'
);


const app = express();


// TRUST PROXY
app.set('trust proxy', 1);


// DISABLE EXPRESS HEADER
app.disable('x-powered-by');


// =========================
// CORS FIRST
// =========================
app.use(

  cors({

    origin: [

      'http://localhost:5173',

      'http://127.0.0.1:5173',

      process.env.FRONTEND_URL

    ].filter(Boolean),

    credentials: true

  })

);


// =========================
// BODY PARSER
// =========================
app.use(

  express.json({
    limit: '10mb'
  })

);

app.use(

  express.urlencoded({

    extended: true

  })

);


// =========================
// SECURITY
// =========================

// HELMET
app.use(helmet());


// HPP
app.use(hpp());


// NOSQL SANITIZE
app.use(
  mongoSanitize()
);


// XSS PROTECTION
app.use(
  xss()
);


// =========================
// LOGGER
// =========================
if (
  process.env.NODE_ENV ===
  'development'
) {

  app.use(
    morgan('dev')
  );

}


// =========================
// RATE LIMITER
// =========================
const limiter =
  rateLimit({

    windowMs:
      15 * 60 * 1000,

    max: 100,

    message:

      'Too many requests from this IP, please try again later.'

  });

app.use(
  '/api/',
  limiter
);


// =========================
// ROUTES
// =========================

app.use(

  '/api/auth',

  require('./routes/auth')

);

app.use(

  '/api/courses',

  require('./routes/courses')

);

app.use(

  '/api/registrations',

  require('./routes/registrations')

);

app.use(

  '/api/blogs',

  require('./routes/blogs')

);

app.use(

  '/api/admin',

  require('./routes/admin')

);

app.use(

  '/api/upload',

  require('./routes/upload')

);

app.use(

  '/api/dashboard',

  require('./routes/dashboard')

);

app.use(

  '/api/leads',

  require('./routes/leads')

);

app.use(

  '/api/subscribers',

  require('./routes/subscribers')

);

app.use(

  '/api/user-auth',

  require('./routes/userAuth')

);

app.use(
  '/api/lms',
  require('./routes/lms')
);


// =========================
// HEALTH CHECK
// =========================
app.get(
  '/api/health',
  (req, res) => {

    res.status(200).json({

      success: true,

      message:
        'API is running',

      timestamp:
        new Date().toISOString()

    });

  }
);

app.use(
  '/api/dashboard',
  dashboardRoutes
);

// =========================
// 404 HANDLER
// =========================
app.use('*', (req, res) => {

  res.status(404).json({

    success: false,

    message:
      'API endpoint not found'

  });

});


// =========================
// GLOBAL ERROR HANDLER
// =========================
app.use(

  (
    err,
    req,
    res,
    next
  ) => {

    console.error(err);

    res.status(
      err.statusCode || 500
    ).json({

      success: false,

      message:

        process.env.NODE_ENV ===
        'development'

          ? err.message

          : 'Internal Server Error'

    });

  }

);


// =========================
// START SERVER
// =========================
const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {

  console.log(

    `Server running on port ${PORT}`

  );

  console.log(

    `Environment: ${

      process.env.NODE_ENV ||

      'development'

    }`

  );

});