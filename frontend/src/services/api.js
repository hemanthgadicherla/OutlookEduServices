const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  'http://localhost:5000/api';


// HEADERS
const getHeaders = () => {

  const token =
    localStorage.getItem(
      'adminToken'
    );

  return {

    'Content-Type':
      'application/json',

    Authorization:
      `Bearer ${token}`

  };

};


// BLOG API
export const blogAPI = {

  // GET ALL BLOGS
  getBlogs: async () => {
    const response = await fetch(`${API_BASE_URL}/blogs`);
    return await response.json();
  },

  // GET SINGLE BLOG BY SLUG
  getSingleBlog: async (slug) => {
    const response = await fetch(`${API_BASE_URL}/blogs/${slug}`);
    return await response.json();
  },

  // CREATE BLOG
  createBlog: async (blogData) => {
    const response = await fetch(`${API_BASE_URL}/blogs`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(blogData)
    });
    return await response.json();
  },

  // UPDATE BLOG
  updateBlog: async (id, blogData) => {
    const response = await fetch(`${API_BASE_URL}/blogs/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(blogData)
    });
    return await response.json();
  },

  // DELETE BLOG
  deleteBlog: async (id) => {
    const response = await fetch(`${API_BASE_URL}/blogs/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return await response.json();
  }

};


// COURSE API
export const courseAPI = {

  // Get Courses
  getCourses: async () => {

    const response =
      await fetch(
        `${API_BASE_URL}/courses`
      );

    return await response.json();

  },


  // Create Course
  createCourse: async (
    courseData
  ) => {

    const response =
      await fetch(

        `${API_BASE_URL}/courses`,

        {

          method: 'POST',

          headers:
            getHeaders(),

          body: JSON.stringify(
            courseData
          )

        }

      );

    return await response.json();

  },


  // Update Course
  updateCourse: async (
    id,
    courseData
  ) => {

    const response =
      await fetch(

        `${API_BASE_URL}/courses/${id}`,

        {

          method: 'PUT',

          headers:
            getHeaders(),

          body: JSON.stringify(
            courseData
          )

        }

      );

    return await response.json();

  },


  // Toggle Active / Upcoming
  toggleStatus: async (id, is_published) => {
    const response = await fetch(`${API_BASE_URL}/courses/${id}/status`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ is_published })
    });
    return await response.json();
  },

  // Delete Course
  deleteCourse: async (
    id
  ) => {

    const response =
      await fetch(

        `${API_BASE_URL}/courses/${id}`,

        {

          method: 'DELETE',

          headers:
            getHeaders()

        }

      );

    return await response.json();

  }

};


// UPLOAD API
export const uploadAPI = {

  uploadImage: async (
    file
  ) => {

    const token =
      localStorage.getItem(
        'adminToken'
      );

    const formData =
      new FormData();

    formData.append(
      'image',
      file
    );

    const response =
      await fetch(

        `${API_BASE_URL}/upload/image`,

        {

          method: 'POST',

          headers: {

            Authorization:
              `Bearer ${token}`

          },

          body: formData

        }

      );

    return await response.json();

  }

};

// REGISTRATION API
export const registrationAPI = {

  // CREATE
  createRegistration: async (data) => {
    // attach user token if logged in (links registration to user account)
    const token = localStorage.getItem('userToken');
    const response = await fetch(`${API_BASE_URL}/registrations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
      },
      body: JSON.stringify(data)
    });
    return await response.json();
  },

  // GET
  getRegistrations: async () => {

    const response =
      await fetch(

        `${API_BASE_URL}/registrations`,

        {

          headers:
            getHeaders()

        }

      );

    return await response.json();

  },


  // UPDATE
  updateRegistration: async (
    id,
    data
  ) => {

    const response =
      await fetch(

        `${API_BASE_URL}/registrations/${id}`,

        {

          method: 'PUT',

          headers:
            getHeaders(),

          body: JSON.stringify(
            data
          )

        }

      );

    return await response.json();

  },


  // DELETE
  deleteRegistration: async (
    id
  ) => {

    const response =
      await fetch(

        `${API_BASE_URL}/registrations/${id}`,

        {

          method: 'DELETE',

          headers:
            getHeaders()

        }

      );

    return await response.json();

  }

};

export const dashboardAPI = {

  getStats: async () => {

    try {

      const response =
        await fetch(
          `${API_BASE_URL}/dashboard`
        );

      return await response.json();

    }

    catch (error) {

      console.error(error);

      return {

        success: false

      };

    }

  }

};

export const subscriberAPI = {

  // GET
  getSubscribers: async () => {

    const response =
      await fetch(

        `${API_BASE_URL}/subscribers`,

        {

          headers:
            getHeaders()

        }

      );

    return await response.json();

  },


  // DELETE
  deleteSubscriber: async (
    id
  ) => {

    const response =
      await fetch(

        `${API_BASE_URL}/subscribers/${id}`,

        {

          method: 'DELETE',

          headers:
            getHeaders()

        }

      );

    return await response.json();

  }

};

export const leadAPI = {


  // CREATE LEAD
  createLead: async (
    leadData
  ) => {

    const response =
      await fetch(

        `${API_BASE_URL}/leads`,

        {

          method: 'POST',

          headers: {

            'Content-Type':
              'application/json'

          },

          body: JSON.stringify(
            leadData
          )

        }

      );

    return await response.json();

  },

  // GET LEADS
  getLeads: async () => {

    const response =
      await fetch(

        `${API_BASE_URL}/leads`,

        {

          headers:
            getHeaders()

        }

      );

    return await response.json();

  },


  // UPDATE LEAD
  updateLead: async (
    id,
    data
  ) => {

    const response =
      await fetch(

        `${API_BASE_URL}/leads/${id}`,

        {

          method: 'PUT',

          headers:
            getHeaders(),

          body: JSON.stringify(
            data
          )

        }

      );

    return await response.json();

  },


  // DELETE LEAD
  deleteLead: async (
    id
  ) => {

    const response =
      await fetch(

        `${API_BASE_URL}/leads/${id}`,

        {

          method: 'DELETE',

          headers:
            getHeaders()

        }

      );

    return await response.json();

  }

};

export const userAuthAPI = {

  // EMAIL / PASSWORD LOGIN
  login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/user-auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return await response.json();
  },

  // REGISTER (email, password, full_name, phone)
  register: async (email, password, full_name, phone) => {
    const response = await fetch(`${API_BASE_URL}/user-auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, full_name, phone })
    });
    return await response.json();
  },

  // GOOGLE OAUTH — get redirect URL from backend
  getGoogleOAuthUrl: async () => {
    const response = await fetch(`${API_BASE_URL}/user-auth/google`);
    return await response.json();
  },

  // GET CURRENT USER (from JWT)
  getMe: async () => {
    const token = localStorage.getItem('userToken');
    const response = await fetch(`${API_BASE_URL}/user-auth/me`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
      }
    });
    return await response.json();
  },

  // UPDATE CURRENT USER
  updateMe: async (data) => {
    const token = localStorage.getItem('userToken');
    const response = await fetch(`${API_BASE_URL}/user-auth/me`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
      },
      body: JSON.stringify(data)
    });
    return await response.json();
  },

  // LOGOUT
  logout: async () => {
    const token = localStorage.getItem('userToken');
    const response = await fetch(`${API_BASE_URL}/user-auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
      }
    });
    return await response.json();
  },

  // LEGACY
  checkAccess: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/user-auth/check-access`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return await response.json();
  }

};

export const lmsAPI = {

  getCourses: async (
    userId
  ) => {

    const response =
      await fetch(

        `${API_BASE_URL}/lms/courses?user_id=${userId}`

      );

    return await response.json();

  }

};

// ADMIN AUTH API
export const adminAuthAPI = {

  // ADMIN LOGIN
  login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return await response.json();
  },

  // ADMIN SIGNUP
  signup: async (email, password, full_name, phone, secret_key) => {
    const response = await fetch(`${API_BASE_URL}/auth/admin-signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, full_name, phone, secret_key })
    });
    return await response.json();
  },

  // VERIFY TOKEN
  verify: async () => {
    const token = localStorage.getItem('adminToken');
    const response = await fetch(`${API_BASE_URL}/auth/verify`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
      }
    });
    return await response.json();
  }

};

// PAYMENT API
// Uses userToken (not adminToken) — payment routes require user auth
export const paymentAPI = {
  // CREATE RAZORPAY ORDER
  // Amount is determined server-side from DB — only registrationId needed
  createOrder: async (registrationId) => {
    const token = localStorage.getItem('userToken');
    const response = await fetch(`${API_BASE_URL}/payments/create-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
      },
      body: JSON.stringify({ registrationId })
    });
    return await response.json();
  },

  // VERIFY PAYMENT
  verifyPayment: async (paymentData) => {
    const token = localStorage.getItem('userToken');
    const response = await fetch(`${API_BASE_URL}/payments/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
      },
      body: JSON.stringify(paymentData)
    });
    return await response.json();
  }
};