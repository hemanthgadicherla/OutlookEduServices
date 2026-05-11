import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
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

    <div
      className="container py-5"
      style={{
        position: "relative",
        zIndex: 1,
      }}
    >

      {/* Top Glow */}

      <div
        style={{
          position: "absolute",
          top: "-100px",
          right: "-100px",
          width: "250px",
          height: "250px",
          background: "rgba(255,193,7,0.12)",
          borderRadius: "50%",
          filter: "blur(120px)",
          zIndex: -1,
        }}
      />

      {/* Main Card */}

      <motion.div

        initial={{
          opacity: 0,
          y: 40,
        }}

        animate={{
          opacity: 1,
          y: 0,
        }}

        transition={{
          duration: 0.7,
        }}

        className="p-4 p-lg-5"

        style={{

          background:
            "linear-gradient(135deg,#050505,#0f172a,#111827)",

          borderRadius: "35px",

          border:
            "1px solid rgba(255,255,255,0.08)",

          backdropFilter:
            "blur(14px)",

          boxShadow:
            "0 20px 45px rgba(0,0,0,0.35)",

          overflow: "hidden",

          position: "relative",

        }}
      >

        {/* Gold Glow */}

        <div
          style={{
            position: "absolute",
            top: "-50px",
            left: "-50px",
            width: "180px",
            height: "180px",
            background:
              "rgba(255,193,7,0.12)",
            borderRadius: "50%",
            filter: "blur(70px)",
          }}
        />

        {/* Course Image */}

        <motion.img

          src={course.image}

          alt={course.title}

          className="img-fluid mb-4"

          initial={{
            opacity: 0,
            scale: 0.95,
          }}

          animate={{
            opacity: 1,
            scale: 1,
          }}

          transition={{
            duration: 0.7,
          }}

          whileHover={{
            scale: 1.02,
          }}

          style={{

            width: "100%",

            maxHeight: "500px",

            objectFit: "cover",

            borderRadius: "28px",

            border:
              "2px solid rgba(255,193,7,0.18)",

            boxShadow:
              "0 20px 45px rgba(0,0,0,0.35)",

          }}
        />

        {/* Badge */}

        <span
          className="px-4 py-2 d-inline-block mb-4"
          style={{
            borderRadius: "50px",
            background:
              "rgba(255,193,7,0.12)",
            color: "#ffc107",
            border:
              "1px solid rgba(255,193,7,0.3)",
            fontWeight: "600",
            letterSpacing: "1px",
          }}
        >
          PROFESSIONAL COURSE
        </span>

        {/* Title */}

        <h1
          className="fw-bold mb-4"
          style={{
            color: "#fff",
            fontSize:
              "clamp(2rem,5vw,4rem)",
            lineHeight: "1.3",
          }}
        >
          {course.title}
        </h1>

        {/* Description */}

        <p
          className="mb-5"
          style={{
            color:
              "rgba(255,255,255,0.72)",
            lineHeight: "2",
            fontSize: "18px",
          }}
        >
          {course.full_description ||
            course.description}
        </p>

        {/* Stats */}

        <div className="row g-4 mb-5">

          {/* Duration */}

          <div className="col-md-4">

            <motion.div

              whileHover={{
                y: -6,
                scale: 1.02,
              }}

              className="h-100 p-4"

              style={{

                background:
                  "rgba(255,255,255,0.05)",

                borderRadius: "24px",

                border:
                  "1px solid rgba(255,255,255,0.08)",

                backdropFilter:
                  "blur(14px)",

              }}
            >

              <div
                className="d-flex align-items-center justify-content-center mb-3"

                style={{

                  width: "70px",

                  height: "70px",

                  borderRadius: "50%",

                  background:
                    "linear-gradient(135deg,#ffc107,#ffb300)",

                  color: "#111",

                  fontSize: "28px",

                }}
              >
                <FaClock />
              </div>

              <h5
                className="fw-bold"
                style={{
                  color: "#fff",
                }}
              >
                Duration
              </h5>

              <p
                style={{
                  color:
                    "rgba(255,255,255,0.72)",
                }}
              >
                {course.duration}
              </p>

            </motion.div>

          </div>

          {/* Students */}

          <div className="col-md-4">

            <motion.div

              whileHover={{
                y: -6,
                scale: 1.02,
              }}

              className="h-100 p-4"

              style={{

                background:
                  "rgba(255,255,255,0.05)",

                borderRadius: "24px",

                border:
                  "1px solid rgba(255,255,255,0.08)",

                backdropFilter:
                  "blur(14px)",

              }}
            >

              <div
                className="d-flex align-items-center justify-content-center mb-3"

                style={{

                  width: "70px",

                  height: "70px",

                  borderRadius: "50%",

                  background:
                    "linear-gradient(135deg,#ffc107,#ffb300)",

                  color: "#111",

                  fontSize: "28px",

                }}
              >
                <FaUsers />
              </div>

              <h5
                className="fw-bold"
                style={{
                  color: "#fff",
                }}
              >
                Students
              </h5>

              <p
                style={{
                  color:
                    "rgba(255,255,255,0.72)",
                }}
              >
                {course.students} Students
              </p>

            </motion.div>

          </div>

          {/* Price */}

          <div className="col-md-4">

            <motion.div

              whileHover={{
                y: -6,
                scale: 1.02,
              }}

              className="h-100 p-4"

              style={{

                background:
                  "rgba(255,255,255,0.05)",

                borderRadius: "24px",

                border:
                  "1px solid rgba(255,255,255,0.08)",

                backdropFilter:
                  "blur(14px)",

              }}
            >

              <div
                className="d-flex align-items-center justify-content-center mb-3"

                style={{

                  width: "70px",

                  height: "70px",

                  borderRadius: "50%",

                  background:
                    "linear-gradient(135deg,#ffc107,#ffb300)",

                  color: "#111",

                  fontSize: "28px",

                }}
              >
                <FaRupeeSign />
              </div>

              <h5
                className="fw-bold"
                style={{
                  color: "#fff",
                }}
              >
                Course Fee
              </h5>

              <h4
                className="fw-bold"
                style={{
                  color: "#ffc107",
                }}
              >
                ₹
                {course.price?.toLocaleString()}
              </h4>

            </motion.div>

          </div>

        </div>

        {/* Brochure Button */}

        {course.course_document && (

          <a
            href={course.course_document}
            target="_blank"
            rel="noopener noreferrer"
            className="btn mb-5"
            style={{
              background:
                "linear-gradient(135deg,#198754,#157347)",
              color: "#fff",
              padding: "14px 30px",
              borderRadius: "16px",
              fontWeight: "700",
              border: "none",
              boxShadow:
                "0 10px 25px rgba(25,135,84,0.35)",
            }}
          >
            View Course Brochure
          </a>

        )}

        {/* Buttons */}

        <div className="d-flex gap-3 flex-wrap">

          <Link
            to={`/registration?course=${course.id}`}
            className="btn"
            style={{
              background:
                "linear-gradient(135deg,#ffc107,#ffb300)",
              color: "#111",
              padding: "14px 36px",
              borderRadius: "16px",
              fontWeight: "700",
              border: "none",
              boxShadow:
                "0 10px 25px rgba(255,193,7,0.35)",
            }}
          >
            Enroll Now
          </Link>

          <Link
            to="/courses"
            className="btn"
            style={{
              background:
                "rgba(255,255,255,0.06)",
              color: "#fff",
              padding: "14px 36px",
              borderRadius: "16px",
              border:
                "1px solid rgba(255,255,255,0.08)",
              backdropFilter: "blur(12px)",
            }}
          >
            ← Back to Courses
          </Link>

        </div>

      </motion.div>

    </div>
  );
};

export default CourseDetail;