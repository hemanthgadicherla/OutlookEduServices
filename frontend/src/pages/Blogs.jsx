import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaUser, FaArrowRight } from 'react-icons/fa';
import { supabase } from "../services/supabase";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [subscriberEmail, setSubscriberEmail] = useState("");

  useEffect(() => {

  fetchBlogs();

}, []);

const fetchBlogs = async () => {

  const { data, error } =
    await supabase
      .from("blogs")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

  if (error) {

    console.log(error);

    return;
  }

  setBlogs(data);
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

      <div className="container position-relative" style={{ zIndex: 2 }}>

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

        {/* CATEGORY FILTER */}

        <motion.div

          className="d-flex justify-content-center flex-wrap gap-3 mb-5"

          initial={{
            opacity: 0,
            y: 30,
          }}

          whileInView={{
            opacity: 1,
            y: 0,
          }}

          transition={{
            duration: 0.6,
          }}

          viewport={{
            once: true,
          }}
        >

          {

            categories.map((category) => (

              <motion.button

                key={category}

                whileHover={{
                  scale: 1.05,
                }}

                whileTap={{
                  scale: 0.95,
                }}

                onClick={() =>
                  setSelectedCategory(category)
                }

                className="btn"

                style={{

                  background:

                    selectedCategory === category

                      ? "#ffc107"

                      : "rgba(255,255,255,0.08)",

                  color:

                    selectedCategory === category

                      ? "#111"

                      : "#fff",

                  border:

                    selectedCategory === category

                      ? "none"

                      : "1px solid rgba(255,255,255,0.12)",

                  borderRadius: "40px",

                  padding:
                    "12px 24px",

                  fontWeight: "600",

                  backdropFilter:
                    "blur(12px)",

                }}
              >

                {category}

              </motion.button>

            ))
          }

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

                  {/* IMAGE */}

                  <div className="position-relative overflow-hidden">

                    <motion.img

                      src={blog.image}

                      alt={blog.title}

                      whileHover={{
                        scale: 1.08,
                      }}

                      transition={{
                        duration: 0.5,
                      }}

                      className="w-100"

                      style={{

                        height: "240px",

                        objectFit: "cover",

                      }}
                    />

                    {/* OVERLAY */}

                    <div
                      style={{
                        position: "absolute",

                        inset: 0,

                        background:
                          "linear-gradient(to top, rgba(0,0,0,0.65), transparent)",
                      }}
                    />

                    {/* CATEGORY */}

                    <div
                      className="position-absolute"

                      style={{
                        top: "20px",
                        right: "20px",
                      }}
                    >

                      <span
                        style={{

                          background:
                            "#ffc107",

                          color: "#111",

                          padding:
                            "8px 14px",

                          borderRadius: "40px",

                          fontWeight: "700",

                          fontSize: "14px",

                        }}
                      >

                        {blog.category}

                      </span>

                    </div>

                  </div>

                  {/* CONTENT */}

                  <div className="p-4 d-flex flex-column flex-grow-1">

                    {/* TITLE */}

                    <h4
                      className="fw-bold text-white mb-3"
                    >
                      {blog.title}
                    </h4>

                    {/* CONTENT */}

                    <p
                      style={{

                        color:
                          "rgba(255,255,255,0.72)",

                        lineHeight: "1.9",

                        fontSize: "15px",

                      }}
                    >

                      {blog.content}

                    </p>

                    {/* META */}

                    <div className="mt-3 mb-4">

                      <div className="row g-3">

                        {/* AUTHOR */}

                        <div className="col-6">

                          <div
                            className="p-3"

                            style={{

                              background:
                                "rgba(255,255,255,0.04)",

                              borderRadius: "18px",

                              border:
                                "1px solid rgba(255,255,255,0.06)",

                            }}
                          >

                            <small
                              style={{
                                color:
                                  "rgba(255,255,255,0.6)",
                              }}
                            >
                              Author
                            </small>

                            <h6
                              className="fw-bold mt-2 mb-0"
                              style={{
                                color: "#ffc107",
                              }}
                            >

                              <FaUser className="me-1" />

                              {blog.author}

                            </h6>

                          </div>

                        </div>

                        {/* DATE */}

                        <div className="col-6">

                          <div
                            className="p-3"

                            style={{

                              background:
                                "rgba(255,255,255,0.04)",

                              borderRadius: "18px",

                              border:
                                "1px solid rgba(255,255,255,0.06)",

                            }}
                          >

                            <small
                              style={{
                                color:
                                  "rgba(255,255,255,0.6)",
                              }}
                            >
                              Published
                            </small>

                            <h6
                              className="fw-bold mt-2 mb-0"
                              style={{
                                color: "#ffc107",
                                fontSize: "14px",
                              }}
                            >

                              <FaCalendarAlt className="me-1" />

                              {new Date(
                                blog.date
                              ).toLocaleDateString()}

                            </h6>

                          </div>

                        </div>

                      </div>

                      {/* READ TIME */}

                      <div
                        className="mt-3 p-3"

                        style={{

                          background:
                            "rgba(255,255,255,0.04)",

                          borderRadius: "18px",

                          border:
                            "1px solid rgba(255,255,255,0.06)",

                        }}
                      >

                        <small
                          style={{
                            color:
                              "rgba(255,255,255,0.6)",
                          }}
                        >
                          Read Time
                        </small>

                        <h6
                          className="fw-bold mt-2 mb-0"
                          style={{
                            color: "#28c76f",
                          }}
                        >

                          {blog.readTime}

                        </h6>

                      </div>

                    </div>

                    {/* BUTTON */}

                    <motion.div

                      whileHover={{
                        scale: 1.05,
                      }}

                      whileTap={{
                        scale: 0.95,
                      }}

                      className="mt-auto"
                    >

                      <Link

                        to={`/blog/${blog.id}`}

                        className="btn w-100"

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

                          boxShadow:
                            "0 10px 25px rgba(255,193,7,0.3)",

                        }}
                      >

                        Read More →

                      </Link>

                    </motion.div>

                  </div>

                </motion.div>

              </div>

            ))
          }

        </div>

        {/* NEWSLETTER */}

        <motion.div

          className="text-center mt-5"

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

          <div

            className="mx-auto p-4 p-lg-5"

            style={{

              maxWidth: "950px",

              background:
                "rgba(255,255,255,0.06)",

              backdropFilter:
                "blur(14px)",

              borderRadius: "35px",

              border:
                "1px solid rgba(255,255,255,0.08)",

              boxShadow:
                "0 20px 60px rgba(0,0,0,0.35)",

            }}
          >

            <h3
              className="fw-bold text-white mb-3"
            >

              Stay Updated With Latest Insights

            </h3>

            <p
              className="mb-4"
              style={{
                color:
                  "rgba(255,255,255,0.72)",

                fontSize: "17px",

                lineHeight: "1.8",
              }}
            >

              Subscribe to our newsletter for study
              abroad updates, visa news, scholarship
              opportunities, and educational insights.

            </p>

            <div className="row justify-content-center">

              <div className="col-lg-7">

                <div className="d-flex flex-column flex-md-row gap-3">

                  <input

                    type="email"

                    placeholder="Enter your email"

                    className="form-control"

                    value={subscriberEmail}

                    onChange={(e) =>
                      setSubscriberEmail(
                        e.target.value
                      )
                    }

                    style={{

                      height: "58px",

                      borderRadius: "18px",

                      background:
                        "rgba(255,255,255,0.08)",

                      border:
                        "1px solid rgba(255,255,255,0.12)",

                      color: "#fff",

                      paddingLeft: "20px",

                    }}
                  />

                  <motion.button

                    whileHover={{
                      scale: 1.05,
                    }}

                    whileTap={{
                      scale: 0.95,
                    }}

                    className="btn"

                    onClick={handleSubscribe}

                    style={{

                      background:
                        "#ffc107",

                      color: "#111",

                      minWidth: "180px",

                      height: "58px",

                      borderRadius: "18px",

                      fontWeight: "700",

                      border: "none",

                      boxShadow:
                        "0 10px 25px rgba(255,193,7,0.35)",

                    }}
                  >

                    Subscribe

                  </motion.button>

                </div>

              </div>

            </div>

          </div>

        </motion.div>

      </div>

    </div>
  );
};

export default Blogs;