import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FaClock, FaUsers, FaRupeeSign} from "react-icons/fa";
import { supabase } from "../services/supabase";

const CourseDetail = () => {

  const { id } =
    useParams();

  const [course,
  setCourse] =
    useState(null);

  useEffect(() => {

    fetchCourse();

  }, []);

  const fetchCourse =
    async () => {

    const { data, error } =
      await supabase
        .from("courses")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {

      console.log(error);

      return;
    }

    setCourse(data);
  };

  if (!course) {

    return (
      <h1 className="text-center py-5">
        Loading...
      </h1>
    );
  }

  return (

    <div className="container py-5">

      <img
        src={course.image}
        alt={course.title}
        className="img-fluid rounded mb-4"
        style={{
          width: "100%",
          maxHeight: "500px",
          objectFit: "cover",
        }}
      />

      <h1 className="mb-3">
        {course.title}
      </h1>

      <p
        className="text-muted mb-4"
        style={{
          lineHeight: "1.9",
          fontSize: "18px",
        }}
      >
        {course.full_description || course.description}
      </p>

      <div className="mb-4">

        <p>

          <FaClock
            className="me-2"
          />

          {course.duration}

        </p>

        <p>

          <FaUsers
            className="me-2"
          />

          {course.students}
          {" "}Students

        </p>

        <h3 className="text-success">

          <FaRupeeSign />

          {
            course.price
            ?.toLocaleString()
          }

        </h3>

      </div>

      {
        course.course_document && (

            <a
            href={course.course_document}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-success mb-4"
            >
            View Course Brochure
            </a>

        )
        }    

      <div className="d-flex gap-3">

        <Link
          to={`/registration?course=${course.id}`}
          className="btn btn-primary"
        >
          Enroll Now
        </Link>

        <Link
          to="/courses"
          className="btn btn-outline-dark"
        >
          ← Back to Courses
        </Link>

      </div>

    </div>
  );
};

export default CourseDetail;