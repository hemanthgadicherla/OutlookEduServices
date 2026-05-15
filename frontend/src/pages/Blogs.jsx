import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaUser, FaArrowRight } from 'react-icons/fa';
import { blogAPI } from "../services/api";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [subscriberEmail, setSubscriberEmail] = useState("");

  useEffect(() => {

  fetchBlogs();

}, []);

const fetchBlogs = async () => {

  try {

    setLoading(true);

    const response =
      await blogAPI.getBlogs();

    console.log(response.data);

    if (response.success) {

      setBlogs(response.data);

    }

    else {

      setError(
        "Failed to load blogs"
      );

    }

  }

  catch (err) {

    console.error(err);

    setError(
      "Something went wrong"
    );

  }

  finally {

    setLoading(false);

  }

};

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const categories = ['All', 'Study Abroad', 'Universities', 'Visa', 'Scholarships', 'Student Life', 'Language Tests'];

  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredBlogs = selectedCategory === 'All'
    ? blogs
    : blogs.filter(blog => blog.category === selectedCategory);

  const handleSubscribe =
  async () => {

  if (!subscriberEmail) {

    alert("Enter email");

    return;
  }

  const { error } =
    await supabase
      .from("blog_subscribers")
      .insert([
        {
          email:
            subscriberEmail,
        },
      ]);

  if (error) {

  if (
    error.message.includes(
      "duplicate key"
    )
  ) {

    alert(
      "You are already subscribed!"
    );

  }

  else {

    alert(error.message);
  }

  return;
}
  alert(
    "Subscribed Successfully!"
  );

  setSubscriberEmail("");
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

        Loading blogs...

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

  return (

    <div
      className="blogs-page py-5 position-relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg,#050505,#111827)",
      }}
    >

      {/* GOLD GLOW */}

      <div
        style={{
          position: "absolute",
          width: "350px",
          height: "350px",
          background:
            "rgba(255,193,7,0.12)",

          borderRadius: "50%",

          filter: "blur(120px)",

          top: "-120px",

          left: "-120px",

          zIndex: 1,
        }}
      />

      <div
        style={{
          position: "absolute",
          width: "300px",
          height: "300px",

          background:
            "rgba(255,193,7,0.08)",

          borderRadius: "50%",

          filter: "blur(120px)",

          bottom: "-100px",

          right: "-100px",

          zIndex: 1,
        }}
      />

      <div
        className="container position-relative"
        style={{ zIndex: 2 }}
      >

        {/* HEADER */}

        <motion.div

          className="text-center mb-5"

          initial={{
            opacity: 0,
            y: 40,
          }}

          whileInView={{
            opacity: 1,
            y: 0,
          }}

          transition={{
            duration: 0.7,
          }}

          viewport={{
            once: true,
          }}
        >

          <span
            className="px-4 py-2 mb-3 d-inline-block"
            style={{

              borderRadius: "40px",

              background:
                "rgba(255,193,7,0.12)",

              color: "#ffc107",

              border:
                "1px solid rgba(255,193,7,0.3)",

              letterSpacing: "1px",

              fontWeight: "600",

            }}
          >
            EDUCATIONAL INSIGHTS
          </span>

          <h1
            className="fw-bold text-white mb-3"
            style={{
              fontSize:
                "clamp(2.5rem,6vw,5rem)",
            }}
          >

            Explore The Latest

            <span style={{ color: "#ffc107" }}>
              {" "}Study Abroad Blogs
            </span>

          </h1>

          <p
            className="mx-auto"
            style={{

              maxWidth: "760px",

              color:
                "rgba(255,255,255,0.7)",

              lineHeight: "1.9",

              fontSize: "18px",

            }}
          >
            Stay updated with international education
            trends, visa guidance, career tips, and
            student success stories from around the world.
          </p>

        </motion.div>

        {/* BLOGS GRID */}

        <div className="row g-4">

          {

            filteredBlogs.map((blog, index) => (

              <div
                key={blog.id}
                className="col-lg-4 col-md-6"
              >

                <motion.div

                  initial={{
                    opacity: 0,
                    y: 50,
                  }}

                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}

                  transition={{
                    delay: index * 0.12,
                    duration: 0.6,
                  }}

                  whileHover={{
                    y: -12,
                    scale: 1.02,
                  }}

                  viewport={{
                    once: true,
                  }}

                  className="position-relative overflow-hidden h-100 d-flex flex-column"

                  style={{

                    background:
                      "rgba(255,255,255,0.06)",

                    backdropFilter:
                      "blur(14px)",

                    borderRadius: "30px",

                    border:
                      "1px solid rgba(255,255,255,0.08)",

                    boxShadow:
                      "0 10px 35px rgba(0,0,0,0.25)",

                  }}
                >

                  <img

                    src={blog.image}

                    alt={blog.title}

                    className="w-100"

                    style={{

                      height: "240px",

                      objectFit: "cover",

                    }}
                  />

                  <div className="p-4 d-flex flex-column flex-grow-1">

                    <h4
                      className="fw-bold text-white mb-3"
                    >
                      {blog.title}
                    </h4>

                    <p
                      style={{

                        color:
                          "rgba(255,255,255,0.72)",

                        lineHeight: "1.9",

                        fontSize: "15px",

                      }}
                    >

                      {blog.excerpt}

                    </p>

                    <div className="mt-3 mb-4">

                      <div className="d-flex justify-content-between">

                        <span
                          style={{
                            color: "#ffc107",
                          }}
                        >

                          <FaUser className="me-2" />

                          {blog.author}

                        </span>

                        <span
                          style={{
                            color: "#28c76f",
                          }}
                        >

                          {blog.read_time}

                        </span>

                      </div>

                      <div
                        className="mt-3"
                        style={{
                          color:
                            "rgba(255,255,255,0.6)",
                        }}
                      >

                        <FaCalendarAlt className="me-2" />

                        {new Date(
                          blog.created_at
                        ).toLocaleDateString()}

                      </div>

                    </div>

                    <Link

                      to={`/blog/${blog.slug || blog.id}`}

                      className="btn mt-auto"

                      style={{

                        background:
                          "#ffc107",

                        color: "#111",

                        padding:
                          "13px 16px",

                        borderRadius: "16px",

                        fontWeight: "700",

                        border: "none",

                        textDecoration: "none",

                      }}
                    >

                      Read More →

                    </Link>

                  </div>

                </motion.div>

              </div>

            ))
          }

        </div>

      </div>

    </div>

  );
};

export default Blogs;