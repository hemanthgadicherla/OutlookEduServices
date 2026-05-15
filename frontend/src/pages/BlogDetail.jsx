import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { blogAPI } from "../services/api";

const BlogDetail = () => {

  const { slug } = useParams();

  const [blog, setBlog] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [otherBlogs,
  setOtherBlogs] = useState([]);

  useEffect(() => {

    fetchBlog();

  }, [slug]);

  const fetchBlog = async () => {
    try {

      setLoading(true);

      const response =
        await blogAPI.getSingleBlog(
          slug
        );

      if (response.success) {

        setBlog(response.data);

      }

      else {

        setError(
          "Blog not found"
        );

      }

    }

    catch (err) {

      console.error(err);

      setError(
        "Failed to load blog"
      );

    }

    finally {

      setLoading(false);

    }

  };

  if (loading) {
    return (
      <div
        className="
          text-center
          text-white
          py-5
        "
      >
        Loading blog...
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="
          text-center
          text-danger
          py-5
        "
      >
        {error}
      </div>
    );
  }


  if (!blog) {

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

      {/* Background Glow */}

      <div
        style={{
          position: "absolute",
          top: "-100px",
          left: "-100px",
          width: "260px",
          height: "260px",
          background: "rgba(255,193,7,0.12)",
          borderRadius: "50%",
          filter: "blur(120px)",
          zIndex: -1,
        }}
      />

      {/* Main Blog Card */}

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

        className="p-4 p-lg-5 text-center position-relative overflow-hidden"

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

        }}
      >

        {/* Gold Glow */}

        <div
          style={{
            position: "absolute",
            top: "-50px",
            right: "-50px",
            width: "180px",
            height: "180px",
            background:
              "rgba(255,193,7,0.12)",
            borderRadius: "50%",
            filter: "blur(70px)",
          }}
        />

        {/* Blog Image */}

        <motion.img

          src={blog.image}

          alt={blog.title}

          className="img-fluid mb-5"

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

            maxHeight: "550px",

            objectFit: "cover",

            borderRadius: "30px",

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
          EDUCATIONAL BLOG
        </span>

        {/* Blog Title */}

        <h1
          className="fw-bold mb-4"
          style={{
            color: "#fff",
            fontSize:
              "clamp(2rem,5vw,4rem)",
            lineHeight: "1.3",
          }}
        >
          {blog.title}
        </h1>

        {/* Meta Info */}

        <div
          className="d-flex justify-content-center flex-wrap gap-3 mb-5"

          style={{
            color:
              "rgba(255,255,255,0.65)",
            fontSize: "15px",
          }}
        >

          <div
            className="px-3 py-2"

            style={{
              background:
                "rgba(255,255,255,0.05)",
              borderRadius: "14px",
              border:
                "1px solid rgba(255,255,255,0.08)",
            }}
          >
            ✍️ By {blog.author}
          </div>

          <div
            className="px-3 py-2"

            style={{
              background:
                "rgba(255,255,255,0.05)",
              borderRadius: "14px",
              border:
                "1px solid rgba(255,255,255,0.08)",
            }}
          >
            📅 {
              blog.created_at
                ? new Date(
                    blog.created_at
                  ).toLocaleDateString()
                : "No Date"
            }
          </div>

          <div
            className="px-3 py-2"

            style={{
              background:
                "rgba(255,255,255,0.05)",
              borderRadius: "14px",
              border:
                "1px solid rgba(255,255,255,0.08)",
            }}
          >
            ⏱️ {blog.read_time}
          </div>

        </div>

        {/* Blog Content */}

        <motion.div

          initial={{
            opacity: 0,
          }}

          animate={{
            opacity: 1,
          }}

          transition={{
            delay: 0.3,
          }}

          className="mx-auto text-start"

          style={{

            maxWidth: "950px",

            whiteSpace: "pre-line",

            lineHeight: "2.2",

            fontSize: "18px",

            color:
              "rgba(255,255,255,0.78)",

          }}
        >
          {blog.full_content ||
            blog.content}
        </motion.div>

        {/* Divider */}

        <div
          className="my-5"

          style={{
            height: "1px",
            background:
              "linear-gradient(to right,transparent,rgba(255,193,7,0.4),transparent)",
          }}
        />

        {/* Buttons */}

        <div className="d-flex justify-content-center gap-3 flex-wrap">

          <Link
            to="/blogs"
            className="btn"

            style={{
              background:
                "linear-gradient(135deg,#ffc107,#ffb300)",

              color: "#111",

              padding: "14px 34px",

              borderRadius: "16px",

              fontWeight: "700",

              border: "none",

              boxShadow:
                "0 10px 25px rgba(255,193,7,0.35)",

            }}
          >
            ← Other Blogs
          </Link>

        </div>

      </motion.div>

    </div>
  );
};

export default BlogDetail;