import React, {
  useEffect,
  useState
} from "react";

import {
  supabase
} from "../services/supabase";

import {
  lmsAPI
} from "../services/api";

import {
  Link
} from "react-router-dom";


const LMSDashboard = () => {

  const [courses, setCourses] =
    useState([]);

  const [loading, setLoading] =
    useState(true);


  useEffect(() => {

    fetchCourses();

  }, []);


  const fetchCourses =
    async () => {

    try {

      // GET SESSION
      const {

        data: { session }

      } = await supabase.auth
        .getSession();


      if (!session) {

        setLoading(false);

        return;

      }


      const userId =
        session.user.id;


      // FETCH LMS COURSES
      const response =
        await lmsAPI
          .getCourses(userId);


      if (
        response.success
      ) {

        setCourses(
          response.data
        );

      }

    }

    catch (error) {

      console.error(error);

    }

    finally {

      setLoading(false);

    }

  };


  // LOADING
  if (loading) {

    return (

      <div className="container py-5">

        <h3>
          Loading LMS...
        </h3>

      </div>

    );

  }


  return (

    <div className="container py-5">

      <h1 className="mb-4">

        My Courses

      </h1>


      {

        courses.length === 0

          ? (

            <div className="alert alert-info">

              No purchased courses found.

            </div>

          )

          : (

            <div className="row">

              {

                courses.map(

                  (item) => {

                    const course =
                      item.courses;

                    return (

                      <div

                        key={course.id}

                        className="col-md-4 mb-4"

                      >

                        <div className="card h-100 shadow border-0">

                          <img

                            src={course.image}

                            alt={course.title}

                            className="card-img-top"

                            style={{

                              height: '220px',

                              objectFit: 'cover'

                            }}

                          />


                          <div className="card-body">

                            <h5>

                              {course.title}

                            </h5>

                            <p>

                              {
                                course.description
                              }

                            </p>


                            <Link

                              to={`/lms/course/${course.id}`}

                              className="btn btn-primary"

                            >

                              Open Course

                            </Link>

                          </div>

                        </div>

                      </div>

                    );

                  }

                )

              }

            </div>

          )

      }

    </div>

  );

};

export default LMSDashboard;