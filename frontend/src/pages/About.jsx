import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay} from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { FaGraduationCap, FaPassport, FaBookOpen, FaUsers, FaHandshake, FaPlaneDeparture, FaMoneyCheckAlt, FaUserGraduate, FaWpforms, FaUniversity, FaMedal, } from "react-icons/fa";

const About = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const stats = [
    { number: '5000+', label: 'Students Guided', icon: <FaUserGraduate /> },
    { number: '50+', label: 'Partner Universities', icon: <FaGraduationCap /> },
    { number: '98%', label: 'Visa Success Rate', icon: <FaPassport /> },
    { number: '15+', label: 'Years Experience', icon: <FaMedal /> }
  ];

  const team = [
    {
      name: 'Khaja Nadeemuddin',
      role: 'Founder & CEO',
      image: 'https://res.cloudinary.com/du1lrb3ng/image/upload/v1778246829/Nadeem_pb3abd.jpg',
      bio: 'PhD in Education with 15+ years in international admissions.'
    },
    {
      name: 'Jeelani',
      role: 'Head of Visa Services',
      image: 'https://res.cloudinary.com/du1lrb3ng/image/upload/v1778246935/Jeelani_jhjvqf.jpg',
      bio: 'Former immigration officer with expertise in global visa processes.'
    },
    {
      name: 'Noman',
      role: 'Consultant & Career Advisor',
      image: 'https://res.cloudinary.com/du1lrb3ng/image/upload/v1778246886/Noman_txa66z.jpg',
      bio: 'Masters from Oxford University, specializes in career guidance.'
    }
  ];

  return (
    <div className="about-page">
      {/* Premium About Hero Section */}
      <section
        className="position-relative overflow-hidden d-flex align-items-center py-5"
        style={{
          minHeight: "85vh",
          background:
            "linear-gradient(135deg,#050505,#111827)",
        }}
      >

        {/* BACKGROUND GLOW */}

        <div
          style={{
            position: "absolute",
            width: "400px",
            height: "400px",
            background:
              "rgba(255,193,7,0.15)",

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
            width: "350px",
            height: "350px",
            background:
              "rgba(255,193,7,0.12)",

            borderRadius: "50%",

            filter: "blur(120px)",

            bottom: "-100px",

            right: "-100px",

            zIndex: 1,
          }}
        />

        {/* GRID BACKGROUND EFFECT */}

        <div
          style={{
            position: "absolute",
            inset: 0,

            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",

            backgroundSize: "40px 40px",

            zIndex: 1,
          }}
        />

        <div className="container position-relative" style={{ zIndex: 2 }}>

          <motion.div

            className="row align-items-center g-5"

            initial={{
              opacity: 0,
            }}

            animate={{
              opacity: 1,
            }}

            transition={{
              duration: 1,
            }}
          >

            {/* LEFT CONTENT */}

            <div className="col-lg-7">

              <motion.div

                initial={{
                  opacity: 0,
                  x: -60,
                }}

                animate={{
                  opacity: 1,
                  x: 0,
                }}

                transition={{
                  duration: 0.8,
                }}
              >

                {/* BADGE */}

                <motion.span

                  initial={{
                    opacity: 0,
                    y: -20,
                  }}

                  animate={{
                    opacity: 1,
                    y: 0,
                  }}

                  transition={{
                    delay: 0.2,
                  }}

                  className="px-4 py-2 mb-4 d-inline-block"

                  style={{
                    borderRadius: "40px",
                    background:
                      "rgba(255,193,7,0.12)",
                    color: "#ffc107",
                    border:
                      "1px solid rgba(255,193,7,0.3)",
                    letterSpacing: "1px",
                    fontWeight: "600",
                    backdropFilter:
                      "blur(10px)",
                    margin: "0 0 20px 0",
                  }}
                >

                  ABOUT OUTLOOK EDU SERVICES

                </motion.span>

                {/* TITLE */}

                <motion.h1

                  className="fw-bold text-white mb-4"

                  initial={{
                    opacity: 0,
                    y: 40,
                  }}

                  animate={{
                    opacity: 1,
                    y: 0,
                  }}

                  transition={{
                    delay: 0.3,
                    duration: 0.8,
                  }}

                  style={{
                    fontSize:
                      "clamp(2.5rem,6vw,5rem)",

                    lineHeight: "1.15",
                  }}
                >

                  Your Trusted Partner For

                  <span style={{ color: "#ffc107" }}>
                    {" "}Global Opportunities
                  </span>

                </motion.h1>

                {/* DESCRIPTION */}

                <motion.p

                  initial={{
                    opacity: 0,
                    y: 30,
                  }}

                  animate={{
                    opacity: 1,
                    y: 0,
                  }}

                  transition={{
                    delay: 0.5,
                    duration: 0.8,
                  }}

                  style={{

                    color:
                      "rgba(255,255,255,0.75)",

                    fontSize: "18px",

                    lineHeight: "2",

                    maxWidth: "750px",

                  }}
                >

                  Outlook Edu Services is your reliable
                  partner in securing visas for the
                  United States and other countries,
                  helping students achieve their
                  international education and career goals.

                  <br />
                  <br />

                  We understand that studying or working
                  abroad is a life-changing decision filled
                  with opportunities and challenges. Our
                  expert consultants simplify the entire
                  process by providing personalized support
                  for admissions, documentation, and visas.

                </motion.p>

                {/* BUTTONS */}

                <motion.div

                  initial={{
                    opacity: 0,
                    y: 30,
                  }}

                  animate={{
                    opacity: 1,
                    y: 0,
                  }}

                  transition={{
                    delay: 0.7,
                  }}

                  className="d-flex flex-wrap gap-3 mt-5"
                >

                  <Link

                    to="/contact"

                    className="btn"

                    style={{

                      background:
                        "#ffc107",

                      color: "#111",

                      padding:
                        "14px 34px",

                      borderRadius: "16px",

                      fontWeight: "700",

                      border: "none",

                      boxShadow:
                        "0 10px 25px rgba(255,193,7,0.3)",

                    }}
                  >

                    Contact Us

                  </Link>

                  <Link

                    to="/study-abroad"

                    className="btn"

                    style={{

                      background:
                        "rgba(255,255,255,0.08)",

                      color: "#fff",

                      padding:
                        "14px 34px",

                      borderRadius: "16px",

                      fontWeight: "600",

                      border:
                        "1px solid rgba(255,255,255,0.12)",

                      backdropFilter:
                        "blur(12px)",

                    }}
                  >

                    Explore Destinations

                  </Link>

                </motion.div>

              </motion.div>

            </div>

            {/* RIGHT SIDE IMAGE */}

            <div className="col-lg-5">

              <motion.div

                initial={{
                  opacity: 0,
                  x: 60,
                }}

                animate={{
                  opacity: 1,
                  x: 0,
                }}

                transition={{
                  delay: 0.4,
                  duration: 0.8,
                }}

                className="position-relative"
              >

                {/* MAIN IMAGE */}

                <motion.img

                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644"

                  alt="Students"

                  className="img-fluid"

                  whileHover={{
                    scale: 1.02,
                  }}

                  transition={{
                    duration: 0.4,
                  }}

                  style={{

                    borderRadius: "35px",

                    width: "100%",

                    objectFit: "cover",

                    border:
                      "2px solid rgba(255,193,7,0.25)",

                    boxShadow:
                      "0 20px 60px rgba(0,0,0,0.45)",

                  }}
                />

                {/* FLOATING EXPERIENCE CARD */}

                <motion.div

                  animate={{
                    y: [0, -10, 0],
                  }}

                  transition={{
                    duration: 4,
                    repeat: Infinity,
                  }}

                  className="position-absolute p-4"

                  style={{

                    bottom: "20px",

                    left: "-20px",

                    borderRadius: "24px",

                    background:
                      "rgba(255,255,255,0.08)",

                    backdropFilter:
                      "blur(14px)",

                    border:
                      "1px solid rgba(255,255,255,0.1)",

                  }}
                >

                  <h3
                    className="fw-bold mb-1"
                    style={{
                      color: "#ffc107",
                    }}
                  >
                    5+
                  </h3>

                  <small className="text-white">
                    Years Experience
                  </small>

                </motion.div>

                {/* SECOND FLOATING CARD */}

                <motion.div

                  animate={{
                    y: [0, 10, 0],
                  }}

                  transition={{
                    duration: 5,
                    repeat: Infinity,
                  }}

                  className="position-absolute p-3"

                  style={{

                    top: "30px",

                    right: "-10px",

                    borderRadius: "20px",

                    background:
                      "rgba(255,255,255,0.08)",

                    backdropFilter:
                      "blur(14px)",

                    border:
                      "1px solid rgba(255,255,255,0.1)",

                  }}
                >

                  <h5
                    className="fw-bold mb-1"
                    style={{
                      color: "#ffc107",
                    }}
                  >
                    98%
                  </h5>

                  <small className="text-white">
                    Visa Success
                  </small>

                </motion.div>

              </motion.div>

            </div>

          </motion.div>

        </div>

      </section>



      {/* Premium Mission Section */}

      <section
        className="py-5 position-relative overflow-hidden"
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

        <div className="container position-relative" style={{ zIndex: 2 }}>

          <div className="row align-items-center g-5">

            {/* LEFT CONTENT */}

            <motion.div

              className="col-lg-6"

              initial={{
                opacity: 0,
                x: -60,
              }}

              whileInView={{
                opacity: 1,
                x: 0,
              }}

              transition={{
                duration: 0.8,
              }}

              viewport={{
                once: true,
              }}
            >

              {/* BADGE */}

              <span
                className="px-4 py-2 mb-4 d-inline-block"
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
                OUR MISSION
              </span>

              {/* HEADING */}

              <h2
                className="fw-bold text-white mb-4"
                style={{
                  fontSize:
                    "clamp(2rem,5vw,4rem)",

                  lineHeight: "1.2",
                }}
              >

                Empowering Students For

                <span style={{ color: "#ffc107" }}>
                  {" "}Global Success
                </span>

              </h2>

              {/* DESCRIPTION */}

              <p
                className="mb-4"
                style={{

                  color:
                    "rgba(255,255,255,0.75)",

                  fontSize: "18px",

                  lineHeight: "2",

                }}
              >

                To democratize access to quality
                international education by providing
                personalized, transparent, and
                comprehensive guidance to students
                worldwide.

              </p>

              <p
                style={{

                  color:
                    "rgba(255,255,255,0.65)",

                  lineHeight: "2",

                  fontSize: "16px",

                }}
              >

                We believe every student deserves the
                opportunity to study at world-class
                institutions and build a successful
                global career. Our mission is to bridge
                the gap between aspirations and
                achievements through expert guidance
                and unwavering support.

              </p>

              {/* FEATURE POINTS */}

              <div className="row mt-5 g-4">

                {

                  [

                    "Personalized Guidance",

                    "Transparent Process",

                    "Visa & Admission Support",

                    "Global Opportunities",

                  ].map((item, index) => (

                    <div
                      key={index}
                      className="col-md-6"
                    >

                      <motion.div

                        whileHover={{
                          y: -6,
                        }}

                        transition={{
                          duration: 0.3,
                        }}

                        className="p-3 h-100"

                        style={{

                          background:
                            "rgba(255,255,255,0.06)",

                          backdropFilter:
                            "blur(14px)",

                          borderRadius: "20px",

                          border:
                            "1px solid rgba(255,255,255,0.08)",

                        }}
                      >

                        <div className="d-flex align-items-center gap-3">

                          <div
                            className="d-flex align-items-center justify-content-center"

                            style={{

                              width: "45px",

                              height: "45px",

                              borderRadius: "14px",

                              background:
                                "linear-gradient(135deg,#ffc107,#ffb300)",

                              color: "#111",

                              fontWeight: "700",

                            }}
                          >
                            ✓
                          </div>

                          <span
                            className="fw-semibold"
                            style={{
                              color: "#fff",
                            }}
                          >
                            {item}
                          </span>

                        </div>

                      </motion.div>

                    </div>

                  ))
                }

              </div>

            </motion.div>

            {/* RIGHT IMAGE */}

            <motion.div

              className="col-lg-6"

              initial={{
                opacity: 0,
                x: 60,
              }}

              whileInView={{
                opacity: 1,
                x: 0,
              }}

              transition={{
                duration: 0.8,
                delay: 0.2,
              }}

              viewport={{
                once: true,
              }}
            >

              <div className="position-relative">

                {/* MAIN IMAGE */}

                <motion.img

                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f"

                  alt="Students collaborating"

                  className="img-fluid"

                  whileHover={{
                    scale: 1.02,
                  }}

                  transition={{
                    duration: 0.4,
                  }}

                  style={{

                    borderRadius: "35px",

                    width: "100%",

                    objectFit: "cover",

                    border:
                      "2px solid rgba(255,193,7,0.25)",

                    boxShadow:
                      "0 20px 60px rgba(0,0,0,0.45)",

                  }}
                />

                {/* FLOATING CARD */}

                <motion.div

                  animate={{
                    y: [0, -10, 0],
                  }}

                  transition={{
                    duration: 4,
                    repeat: Infinity,
                  }}

                  className="position-absolute p-4"

                  style={{

                    bottom: "20px",

                    left: "-20px",

                    borderRadius: "24px",

                    background:
                      "rgba(255,255,255,0.08)",

                    backdropFilter:
                      "blur(14px)",

                    border:
                      "1px solid rgba(255,255,255,0.1)",

                  }}
                >

                  <h3
                    className="fw-bold mb-1"
                    style={{
                      color: "#ffc107",
                    }}
                  >
                    250+
                  </h3>

                  <small className="text-white">
                    Students Guided
                  </small>

                </motion.div>

              </div>

            </motion.div>

          </div>

        </div>

      </section>

      {/* Premium Stats Section */}
      <section
        className="py-5 position-relative overflow-hidden"
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

          {/* HEADING */}

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
              OUR IMPACT
            </span>

            <h2
              className="fw-bold text-white"
              style={{
                fontSize:
                  "clamp(2rem,5vw,4rem)",

                lineHeight: "1.2",
              }}
            >

              Numbers That Reflect

              <span style={{ color: "#ffc107" }}>
                {" "}Our Success
              </span>

            </h2>

            <p
              className="mx-auto mt-3"
              style={{

                maxWidth: "700px",

                color:
                  "rgba(255,255,255,0.7)",

                lineHeight: "1.9",

                fontSize: "17px",

              }}
            >
              Our achievements showcase the trust students
              place in Outlook Edu Services for their
              international education journey.
            </p>

          </motion.div>

          {/* STATS GRID */}

          <div className="row g-4">

            {

              stats.map((stat, index) => (

                <div
                  key={index}
                  className="col-lg-3 col-md-6"
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
                      delay: index * 0.15,
                      duration: 0.6,
                    }}

                    whileHover={{
                      y: -12,
                      scale: 1.03,
                    }}

                    viewport={{
                      once: true,
                    }}

                    className="position-relative overflow-hidden h-100 p-4 text-center"

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

                    {/* TOP GLOW */}

                    <div
                      style={{
                        position: "absolute",

                        width: "120px",

                        height: "120px",

                        background:
                          "rgba(255,193,7,0.18)",

                        borderRadius: "50%",

                        filter: "blur(70px)",

                        top: "-40px",

                        right: "-40px",
                      }}
                    />

                    {/* ICON CIRCLE */}

                    <motion.div

                      animate={{
                        rotate: [0, 5, -5, 0],
                      }}

                      transition={{
                        duration: 6,
                        repeat: Infinity,
                      }}

                      className="mx-auto mb-4 d-flex align-items-center justify-content-center"

                      style={{

                        width: "100px",

                        height: "100px",

                        borderRadius: "50%",

                        background:
                          "linear-gradient(135deg,#ffc107,#ffb300)",

                        color: "#111",

                        fontSize: "42px",

                        boxShadow:
                          "0 10px 25px rgba(255,193,7,0.35)",

                      }}
                    >

                      {stat.icon}

                    </motion.div>

                    {/* NUMBER */}

                    <motion.h3

                      initial={{
                        opacity: 0,
                        scale: 0.8,
                      }}

                      whileInView={{
                        opacity: 1,
                        scale: 1,
                      }}

                      transition={{
                        delay: index * 0.2,
                      }}

                      viewport={{
                        once: true,
                      }}

                      className="fw-bold mb-3"

                      style={{
                        color: "#ffc107",

                        fontSize:
                          "clamp(2.2rem,4vw,3.5rem)",
                      }}
                    >

                      {stat.number}

                    </motion.h3>

                    {/* LABEL */}

                    <p
                      className="mb-0"
                      style={{

                        color:
                          "rgba(255,255,255,0.75)",

                        fontSize: "17px",

                        lineHeight: "1.7",

                        fontWeight: "500",

                      }}
                    >

                      {stat.label}

                    </p>

                    {/* BOTTOM LINE */}

                    <motion.div

                      initial={{
                        width: 0,
                      }}

                      whileInView={{
                        width: "70%",
                      }}

                      transition={{
                        delay: index * 0.2,
                        duration: 0.8,
                      }}

                      viewport={{
                        once: true,
                      }}

                      className="mx-auto mt-4"

                      style={{

                        height: "4px",

                        borderRadius: "10px",

                        background:
                          "linear-gradient(90deg,#ffc107,#ffb300)",

                      }}
                    />

                  </motion.div>

                </div>

              ))
            }

          </div>

        </div>

      </section>



      {/* Premium Team Section */}

      <section
        className="py-5 position-relative overflow-hidden"
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

            right: "-120px",

            zIndex: 1,
          }}
        />

        <div className="container position-relative" style={{ zIndex: 2 }}>

          {/* HEADING */}

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
              OUR TEAM
            </span>

            <h2
              className="fw-bold text-white"
              style={{
                fontSize:
                  "clamp(2rem,5vw,4rem)",

                lineHeight: "1.2",
              }}
            >

              Meet The Experts Behind

              <span style={{ color: "#ffc107" }}>
                {" "}Your Success
              </span>

            </h2>

            <p
              className="mx-auto mt-3"
              style={{

                maxWidth: "700px",

                color:
                  "rgba(255,255,255,0.7)",

                lineHeight: "1.9",

                fontSize: "17px",

              }}
            >
              Our experienced consultants and advisors
              are committed to helping students achieve
              their international education goals.
            </p>

          </motion.div>

          {/* TEAM SLIDER */}

          <Swiper

            modules={[
              Pagination,
              Autoplay
            ]}

            spaceBetween={30}

            slidesPerView={1}

            autoplay={{
              delay: 3500,
            }}

            pagination={{
              clickable: true,
            }}

            breakpoints={{

              768: {
                slidesPerView: 2,
              },

              1200: {
                slidesPerView: 3,
              },

            }}
          >

            {

              team.map((member, index) => (

                <SwiperSlide key={index}>

                  <motion.div

                    initial={{
                      opacity: 0,
                      y: 40,
                    }}

                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}

                    transition={{
                      delay: index * 0.15,
                    }}

                    whileHover={{
                      y: -12,
                      scale: 1.02,
                    }}

                    viewport={{
                      once: true,
                    }}
                  >

                    <div

                      className="position-relative overflow-hidden h-100 p-4 text-center"

                      style={{

                        background:
                          "rgba(255,255,255,0.06)",

                        backdropFilter:
                          "blur(14px)",

                        borderRadius: "32px",

                        border:
                          "1px solid rgba(255,255,255,0.08)",

                        boxShadow:
                          "0 10px 35px rgba(0,0,0,0.25)",

                      }}
                    >

                      {/* TOP GLOW */}

                      <div
                        style={{
                          position: "absolute",

                          width: "120px",

                          height: "120px",

                          background:
                            "rgba(255,193,7,0.15)",

                          borderRadius: "50%",

                          filter: "blur(70px)",

                          top: "-40px",

                          right: "-40px",
                        }}
                      />

                      {/* IMAGE */}

                      <motion.div

                        whileHover={{
                          rotate: 3,
                          scale: 1.05,
                        }}

                        transition={{
                          duration: 0.3,
                        }}

                        className="mb-4"
                      >

                        <img

                          src={member.image}

                          alt={member.name}

                          className="rounded-circle"

                          style={{

                            width: "140px",

                            height: "140px",

                            objectFit: "cover",

                            border:
                              "4px solid #ffc107",

                            boxShadow:
                              "0 10px 25px rgba(255,193,7,0.35)",

                          }}
                        />

                      </motion.div>

                      {/* NAME */}

                      <h4
                        className="fw-bold text-white mb-2"
                      >
                        {member.name}
                      </h4>

                      {/* ROLE */}

                      <p
                        className="mb-3 fw-semibold"
                        style={{
                          color: "#ffc107",
                          fontSize: "16px",
                        }}
                      >
                        {member.role}
                      </p>

                      {/* BIO */}

                      <p
                        style={{

                          color:
                            "rgba(255,255,255,0.72)",

                          lineHeight: "1.9",

                          fontSize: "15px",

                        }}
                      >

                        {member.bio}

                      </p>

                      {/* BOTTOM LINE */}

                      <motion.div

                        initial={{
                          width: 0,
                        }}

                        whileInView={{
                          width: "70%",
                        }}

                        transition={{
                          delay: index * 0.2,
                          duration: 0.8,
                        }}

                        viewport={{
                          once: true,
                        }}

                        className="mx-auto mt-4"

                        style={{

                          height: "4px",

                          borderRadius: "10px",

                          background:
                            "linear-gradient(90deg,#ffc107,#ffb300)",

                        }}
                      />

                    </div>

                  </motion.div>

                </SwiperSlide>

              ))
            }

          </Swiper>

        </div>

      </section>


      {/* Premium Values Section */}
      <section
        className="py-5 position-relative overflow-hidden"
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

          {/* HEADING */}

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
              OUR VALUES
            </span>

            <h2
              className="fw-bold text-white"
              style={{
                fontSize:
                  "clamp(2rem,5vw,4rem)",

                lineHeight: "1.2",
              }}
            >

              The Principles That

              <span style={{ color: "#ffc107" }}>
                {" "}Drive Us
              </span>

            </h2>

            <p
              className="mx-auto mt-3"
              style={{

                maxWidth: "700px",

                color:
                  "rgba(255,255,255,0.7)",

                lineHeight: "1.9",

                fontSize: "17px",

              }}
            >
              Our values shape every interaction,
              decision, and success story at Outlook
              Edu Services.
            </p>

          </motion.div>

          {/* VALUES CARDS */}

          <div className="row g-4">

            {

              [

                {
                  icon: "🤝",
                  title: "Integrity",
                  description:
                    "Transparent processes, honest guidance, and ethical practices in every student journey.",
                },

                {
                  icon: "💡",
                  title: "Innovation",
                  description:
                    "Modern solutions and personalized strategies to help students achieve global success.",
                },

                {
                  icon: "🌍",
                  title: "Community",
                  description:
                    "Building strong relationships and supporting students throughout their international journey.",
                },

              ].map((item, index) => (

                <div
                  key={index}
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
                      delay: index * 0.15,
                      duration: 0.6,
                    }}

                    whileHover={{
                      y: -12,
                      scale: 1.03,
                    }}

                    viewport={{
                      once: true,
                    }}

                    className="position-relative overflow-hidden h-100 p-5 text-center"

                    style={{

                      background:
                        "rgba(255,255,255,0.06)",

                      backdropFilter:
                        "blur(14px)",

                      borderRadius: "32px",

                      border:
                        "1px solid rgba(255,255,255,0.08)",

                      boxShadow:
                        "0 10px 35px rgba(0,0,0,0.25)",

                    }}
                  >

                    {/* TOP GLOW */}

                    <div
                      style={{
                        position: "absolute",

                        width: "120px",

                        height: "120px",

                        background:
                          "rgba(255,193,7,0.15)",

                        borderRadius: "50%",

                        filter: "blur(70px)",

                        top: "-40px",

                        right: "-40px",
                      }}
                    />

                    {/* ICON */}

                    <motion.div

                      animate={{
                        rotate: [0, 6, -6, 0],
                      }}

                      transition={{
                        duration: 6,
                        repeat: Infinity,
                      }}

                      className="mx-auto mb-4 d-flex align-items-center justify-content-center"

                      style={{

                        width: "100px",

                        height: "100px",

                        borderRadius: "50%",

                        background:
                          "linear-gradient(135deg,#ffc107,#ffb300)",

                        color: "#111",

                        fontSize: "42px",

                        fontWeight: "700",

                        boxShadow:
                          "0 10px 25px rgba(255,193,7,0.35)",

                      }}
                    >

                      {item.icon}

                    </motion.div>

                    {/* TITLE */}

                    <h3
                      className="fw-bold text-white mb-3"
                    >
                      {item.title}
                    </h3>

                    {/* DESCRIPTION */}

                    <p
                      style={{

                        color:
                          "rgba(255,255,255,0.72)",

                        lineHeight: "1.9",

                        fontSize: "16px",

                      }}
                    >

                      {item.description}

                    </p>

                    {/* BOTTOM LINE */}

                    <motion.div

                      initial={{
                        width: 0,
                      }}

                      whileInView={{
                        width: "70%",
                      }}

                      transition={{
                        delay: index * 0.2,
                        duration: 0.8,
                      }}

                      viewport={{
                        once: true,
                      }}

                      className="mx-auto mt-4"

                      style={{

                        height: "4px",

                        borderRadius: "10px",

                        background:
                          "linear-gradient(90deg,#ffc107,#ffb300)",

                      }}
                    />

                  </motion.div>

                </div>

              ))
            }

          </div>

        </div>

      </section>
    </div>
  );
};

export default About;