# Educational Consultancy Website

A modern, production-ready educational services website built with React, Node.js, Supabase, and Razorpay integration.

## Tech Stack

### Frontend
- React.js (Vite)
- Bootstrap 5
- React Router DOM
- Axios
- Framer Motion
- React Hook Form
- React Toastify

### Backend
- Node.js + Express.js
- Supabase (Database & Auth)
- Razorpay (Payments)
- JWT Authentication

### Deployment
- Frontend: Vercel
- Backend: Render/Railway
- Database: Supabase

## Features

- ✅ Modern responsive design
- ✅ Course catalog with enrollment
- ✅ Razorpay payment integration
- ✅ Admin dashboard
- ✅ User registration system
- ✅ Blog management
- ✅ SEO optimized
- ✅ Mobile-first approach
- ✅ Secure authentication

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Supabase account
- Razorpay account (for payments)

### 1. Clone and Install Dependencies

```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

### 2. Environment Setup

#### Frontend (.env in frontend/)
```env
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
REACT_APP_RAZORPAY_KEY_ID=your_razorpay_key_id
REACT_APP_API_BASE_URL=http://localhost:5000/api
```

#### Backend (.env in backend/)
```env
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000

SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key

RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

JWT_SECRET=your_jwt_secret_key

ADMIN_EMAIL=admin@educonsult.com
ADMIN_PASSWORD=admin123
```

### 3. Supabase Setup

1. Create a new Supabase project
2. Go to SQL Editor and run the `database-schema.sql` file
3. Copy your project URL and anon key to environment variables

### 4. Razorpay Setup

1. Create a Razorpay account
2. Get your API keys from the dashboard
3. Add them to environment variables
4. Use test mode for development

### 5. Run the Application

```bash
# Start backend server
cd backend
npm run dev

# Start frontend (in new terminal)
cd frontend
npm run dev
```

### 6. Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Admin Dashboard: http://localhost:3000/admin

## Database Tables

The application uses the following Supabase tables:

- `users` - User accounts
- `courses` - Course catalog
- `registrations` - Student registrations
- `payments` - Payment records
- `blogs` - Blog posts

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login

### Courses
- `GET /api/courses` - Get all courses
- `POST /api/courses` - Create course (admin)
- `PUT /api/courses/:id` - Update course (admin)
- `DELETE /api/courses/:id` - Delete course (admin)

### Registrations
- `POST /api/registrations` - Create registration
- `GET /api/registrations` - Get registrations (admin)

### Payments
- `POST /api/payments/create-order` - Create Razorpay order
- `POST /api/payments/verify` - Verify payment
- `GET /api/payments` - Get payments (admin)

### Blogs
- `GET /api/blogs` - Get all blogs
- `POST /api/blogs` - Create blog (admin)
- `PUT /api/blogs/:id` - Update blog (admin)
- `DELETE /api/blogs/:id` - Delete blog (admin)

### Admin
- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/registrations` - Manage registrations
- `GET /api/admin/payments` - Manage payments
- `GET /api/admin/courses` - Manage courses

## Deployment

### Frontend (Vercel)
1. Push frontend code to GitHub
2. Connect to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

### Backend (Render/Railway)
1. Push backend code to GitHub
2. Connect to Render/Railway
3. Set environment variables
4. Set build command: `npm install`
5. Set start command: `npm start`
6. Deploy

### Database
- Supabase handles database hosting
- No additional deployment needed

## Admin Access

Default admin credentials:
- Email: admin@educonsult.com
- Password: admin123

**Important:** Change these credentials in production!

## File Structure

```
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── context/
│   │   ├── utils/
│   │   └── assets/
│   ├── public/
│   └── package.json
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── services/
│   ├── config/
│   ├── utils/
│   ├── models/
│   └── server.js
├── database-schema.sql
└── .env.example
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, email support@educonsult.com or create an issue in the repository."# OutlookEduServices" 
