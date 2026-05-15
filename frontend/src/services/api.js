const API_BASE_URL =

  import.meta.env.VITE_API_URL ||

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

  // GET BLOGS
  getBlogs: async () => {

    const response =
      await fetch(
        `${API_BASE_URL}/blogs`
      );

    return await response.json();

  },


  // CREATE BLOG
  createBlog: async (
    blogData
  ) => {

    const response =
      await fetch(

        `${API_BASE_URL}/blogs`,

        {

          method: 'POST',

          headers:
            getHeaders(),

          body: JSON.stringify(
            blogData
          )

        }

      );

    return await response.json();

  },


  // UPDATE BLOG
  updateBlog: async (
    id,
    blogData
  ) => {

    const response =
      await fetch(

        `${API_BASE_URL}/blogs/${id}`,

        {

          method: 'PUT',

          headers:
            getHeaders(),

          body: JSON.stringify(
            blogData
          )

        }

      );

    return await response.json();

  },


  // DELETE BLOG
  deleteBlog: async (
    id
  ) => {

    const response =
      await fetch(

        `${API_BASE_URL}/blogs/${id}`,

        {

          method: 'DELETE',

          headers:
            getHeaders()

        }

      );

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

    const response =
      await fetch(

        `${API_BASE_URL}/dashboard/stats`,

        {

          headers:
            getHeaders()

        }

      );

    return await response.json();

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

  checkAccess: async (
    userData
  ) => {

    const response =
      await fetch(

        `${API_BASE_URL}/user-auth/check-access`,

        {

          method: 'POST',

          headers: {

            'Content-Type':
              'application/json'

          },

          body: JSON.stringify(
            userData
          )

        }

      );

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