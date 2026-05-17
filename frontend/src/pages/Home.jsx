import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
// import { FaGraduationCap, FaPassport, FaBookOpen, FaUsers } from 'react-icons/fa';
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay} from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { FaGraduationCap, FaPassport, FaBookOpen, FaUsers, FaHandshake, FaPlaneDeparture, FaMoneyCheckAlt, FaUserGraduate, FaWpforms, } from "react-icons/fa";

const Home = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const services = [
    {
      icon: <FaGraduationCap />,
      title: 'Study Abroad',
      description: 'Comprehensive guidance for international education opportunities.',
      link: '/study-abroad'
    },
    {
      icon: <FaPassport />,
      title: 'Visa Services',
      description: 'Expert assistance with visa applications and documentation.',
      link: '/visit-visa'
    },
    {
      icon: <FaBookOpen />,
      title: 'Courses',
      description: 'Professional training programs for career advancement.',
      link: '/courses'
    },
    {
      icon: <FaUsers />,
      title: 'Consultation',
      description: 'Personalized counseling for your educational journey.',
      link: '/contact'
    }
  ];

  const testimonials = [

  {
    name: "Sudha",

    image:
      "https://randomuser.me/api/portraits/women/44.jpg",

    text:
      "I truly appreciate the guidance and support provided throughout my admission process. Their team helped me secure admission in my dream university abroad.",

    role:
      "Masters Student, Canada",
  },

  {
    name: "Rahul Sharma",

    image:
      "https://randomuser.me/api/portraits/men/32.jpg",

    text:
      "The visa process became smooth and stress-free because of their expert counseling and documentation support.",

    role:
      "Engineering Student, Australia",
  },

  {
    name: "Anantha Kumari",

    image:
      "https://randomuser.me/api/portraits/women/68.jpg",

    text:
      "From university applications to visa approval, the entire process was handled professionally and efficiently.",

    role:
      "Agriculture B.Sc, India",
  },

  {
    name: "Supriya",

    image:
      "https://randomuser.me/api/portraits/women/65.jpg",

    text:
      "Their counselors are friendly, knowledgeable, and highly supportive throughout the educational journey.",

    role:
      "Veterinary Student",
  },

];

  return (
    <div>
      {/* Premium Hero Section */}
      <section
        className="position-relative overflow-hidden d-flex align-items-center"
        style={{
          minHeight: "100vh",
          background: "#000",
          marginTop: "-1px",
        }}
      >

        {/* DARK OVERLAY */}

        <div
          className="position-absolute w-100 h-100"
          style={{
            background:
              "linear-gradient(135deg,rgba(0,0,0,0.75),rgba(17,24,39,0.85))",
            zIndex: 2,
          }}
        />
        {/* GOLD GLOW */}
        <div
          style={{
            position: "absolute",
            width: "400px",
            height: "400px",
            background:
              "rgba(255,193,7,0.15)",
            borderRadius: "50%",
            filter: "blur(120px)",
            top: "-100px",
            left: "-100px",
            zIndex: 2,
          }}
        />
        <div
          style={{
            position: "absolute",
            width: "300px",
            height: "300px",
            background:
              "rgba(255,193,7,0.12)",
            borderRadius: "50%",
            filter: "blur(120px)",
            bottom: "-100px",
            right: "-100px",
            zIndex: 2,
          }}
        />
        {/* CONTENT */}
        <div className="container position-relative" style={{ zIndex: 3 }}>
          <motion.div
            className="row align-items-center g-5"
            initial={{
              opacity: 0,
              y: 40,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.8,
            }}
          >
          {/* LEFT CONTENT */}
          <div className="col-lg-6">
            <motion.div
              initial={{
              opacity: 0,
              x: -40,
            }}
             animate={{
              opacity: 1,
              x: 0,  
            }}
              transition={{
              delay: 0.2,
              duration: 0.8,
            }}
            >
            {/* BADGE */}
            <span
            className="px-4 py-2 mb-4 d-inline-block"
            style={{
              borderRadius: "40px",
              background: "rgba(255,193,7,0.12)",
              color: "#ffc107",
              border: "1px solid rgba(255,193,7,0.3)",
              letterSpacing: "1px",
              fontWeight: "600",
              backdropFilter:
              "blur(12px)",
            }}
            >
            STUDY ABROAD CONSULTANCY
            </span>
            {/* HEADING */}
              <h1
                className="fw-bold text-white mb-4"
                style={{
                fontSize: "clamp(2.5rem,6vw,5rem)", lineHeight: "1.15",
                }}
              >
              Your Gateway To
                <span style={{ color: "#ffc107" }}>
                {" "}Global Education
                </span>
              </h1>
              {/* DESCRIPTION */}
              <p
                className="mb-5"
                style={{
                  color: "rgba(255,255,255,0.75)",
                    fontSize: "18px",
                    lineHeight: "1.9",
                    maxWidth: "650px",
                  }}
              >
                Premium study abroad guidance and
                educational consultancy services to
                help students achieve international
                academic success with confidence.

              </p>
              {/* BUTTONS */}
              <div className="d-flex flex-wrap gap-3">
                <Link
                  to="/contact"
                  className="btn"
                  style={{
                    background: "#ffc107",
                    color: "#111",
                    padding:  "14px 32px",
                    borderRadius: "16px",
                    fontWeight: "700",
                    border: "none",
                    boxShadow: "0 10px 25px rgba(255,193,7,0.3)",
                  }}
                >
                  Get Free Consultation
                </Link>
                <Link
                  to="/courses"
                  className="btn"
                  style={{
                    background: "rgba(255,255,255,0.08)",
                      color: "#fff",
                      padding:  "14px 32px",
                      borderRadius: "16px",
                      fontWeight: "600",
                      border: "1px solid rgba(255,255,255,0.12)",
                      backdropFilter: "blur(12px)",
                    }}
                >
                Explore Courses
                </Link>
                </div>
                {/* STATS */}
                <div className="d-flex flex-wrap gap-4 mt-5">
                  {
                    [
                      {
                        number: "250+",
                        label: "Students",
                      },

                      {
                        number: "15+",
                        label: "Countries",
                      },

                      {
                        number: "98%",
                        label: "Visa Success",
                      },
                    ].map((item, index) => (
                    <div key={index}>
                      <h3
                        className="fw-bold mb-1"
                        style={{
                        color: "#ffc107",
                      }}
                      >
                      {item.number}
                      </h3>
                      <small
                        style={{
                        color: "rgba(255,255,255,0.7)",
                      }}
                      >
                      {item.label}
                      </small>
                    </div>
                    ))
                  }
                </div>
              </motion.div>
            </div>
            {/* RIGHT IMAGE */}
            <div className="col-lg-6">
              <motion.div
                initial={{
                  opacity: 0,
                  x: 40,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                transition={{
                  delay: 0.3,
                  duration: 0.8,
                }}
                className="position-relative"
              >
              <motion.img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f"
                alt="Students studying"
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
                border: "2px solid rgba(255,193,7,0.25)",
                boxShadow: "0 20px 60px rgba(0,0,0,0.45)",
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
                  background: "rgba(255,255,255,0.08)",
                  backdropFilter: "blur(14px)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
                >
                <h4
                  className="fw-bold mb-1"
                  style={{
                    color: "#ffc107",
                  }}
                >
                  98%
                </h4>
                  <small className="text-white">
                    Visa Success Rate
                  </small>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>



    {/* Premium Services Section */}

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
          width: "400px",
          height: "400px",
          background:
            "rgba(255,193,7,0.18)",
          borderRadius: "50%",
          filter: "blur(120px)",
          top: "-100px",
          left: "-100px",
        }}
      />

      <div
        style={{
          position: "absolute",
          width: "300px",
          height: "300px",
          background:
            "rgba(255,193,7,0.12)",
          borderRadius: "50%",
          filter: "blur(120px)",
          bottom: "-100px",
          right: "-100px",
        }}
      />

      <div className="container position-relative">

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
            duration: 0.6,
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
            OUR SERVICES
          </span>

          <h2
            className="fw-bold text-white"
            style={{
              fontSize: "clamp(2rem,5vw,3.5rem)",
            }}
          >

            Complete Support For

            <span style={{ color: "#ffc107" }}>
              {" "}Your Global Journey
            </span>

          </h2>

          <p
            className="mx-auto mt-3"
            style={{

              maxWidth: "750px",

              lineHeight: "1.9",

              fontSize: "17px",

              color:
                "rgba(255,255,255,0.7)",

            }}
          >
            At Outlook Edu Services, we bridge the gap between your local potential and global opportunities. 
            Whether you are aiming for an international degree, planning a short-term visit, 
            or looking to sharpen your professional skills, 
            we provide the expert guidance needed to navigate your journey with confidence.
          </p>

        </motion.div>

        <div className="row align-items-center g-4">

          {/* LEFT SERVICES */}

          <div className="col-lg-3 col-md-6">

            {

              [

                {
                  icon: <FaGraduationCap />,
                  title: 'Study Abroad',
                  description:
                    'Comprehensive guidance for international education opportunities.',
                  link: '/study-abroad'
                },

                {
                  icon: <FaPassport />,
                  title: 'Visa Services',
                  description:
                    'Expert assistance with visa applications and documentation.',
                  link: '/visit-visa'
                },

              ].map((item, index) => (

                <motion.div

                  key={index}

                  className="mb-4 p-4 h-100"

                  initial={{
                    opacity: 0,
                    x: -40,
                  }}

                  whileInView={{
                    opacity: 1,
                    x: 0,
                  }}

                  transition={{
                    delay: index * 0.2,
                  }}

                  whileHover={{
                    y: -10,
                    scale: 1.02,
                  }}

                  viewport={{
                    once: true,
                  }}

                  style={{

                    background:
                      "rgba(255,255,255,0.06)",

                    backdropFilter:
                      "blur(14px)",

                    borderRadius: "28px",

                    border:
                      "1px solid rgba(255,255,255,0.08)",

                    boxShadow:
                      "0 10px 35px rgba(0,0,0,0.25)",

                  }}
                >

                  <div
                    className="d-flex flex-column align-items-start"
                  >

                    <div
                      className="d-flex align-items-center justify-content-center mb-4"

                      style={{
                        width: "80px",
                        height: "80px",
                        borderRadius: "22px",

                        background:
                          "linear-gradient(135deg,#ffc107,#ffb300)",

                        color: "#111",

                        fontSize: "32px",

                        boxShadow:
                          "0 10px 25px rgba(255,193,7,0.35)",
                      }}
                    >
                      {item.icon}
                    </div>

                    <h4
                      className="fw-bold mb-3 text-white"
                      style={{
                        fontSize: "22px",
                      }}
                    >
                      {item.title}
                    </h4>

                    <p
                      style={{

                        lineHeight: "1.8",

                        fontSize: "15px",

                        color:
                          "rgba(255,255,255,0.7)",

                      }}
                    >
                      {item.description}
                    </p>

                    <Link

                      to={item.link}

                      className="btn mt-3"

                      style={{

                        background:
                          "#ffc107",

                        color: "#111",

                        borderRadius: "14px",

                        padding:
                          "10px 24px",

                        fontWeight: "700",

                        border: "none",

                      }}
                    >

                      Learn More

                    </Link>

                  </div>

                </motion.div>

              ))
            }

          </div>

          {/* CENTER IMAGE */}

          <div className="col-lg-6 text-center position-relative">

            <motion.img

              src="https://images.unsplash.com/photo-1523240795612-9a054b0db644"

              alt="Students"

              className="img-fluid shadow-lg"

              initial={{
                opacity: 0,
                scale: 0.9,
              }}

              whileInView={{
                opacity: 1,
                scale: 1,
              }}

              transition={{
                duration: 0.8,
              }}

              whileHover={{
                scale: 1.02,
              }}

              viewport={{
                once: true,
              }}

              style={{
                borderRadius: "35px",
                maxHeight: "700px",
                width: "100%",
                objectFit: "cover",

                border:
                  "2px solid rgba(255,193,7,0.25)",
              }}
            />

            {/* FLOATING BADGE */}

            <motion.div

              animate={{
                y: [0, -10, 0],
              }}

              transition={{
                duration: 4,
                repeat: Infinity,
              }}

              className="position-absolute p-3"

              style={{

                top: "8%",

                left: "0",

                borderRadius: "20px",

                minWidth: "140px",

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
                  color: "#ffc107"
                }}
              >
                250+
              </h5>

              <small className="text-white">
                Students Guided
              </small>

            </motion.div>

          </div>

          {/* RIGHT SERVICES */}

          <div className="col-lg-3 col-md-6">

            {

              [

                {
                  icon: <FaBookOpen />,
                  title: 'Courses',
                  description:
                    'Professional training programs for career advancement.',
                  link: '/courses'
                },

                {
                  icon: <FaUsers />,
                  title: 'Consultation',
                  description:
                    'Personalized counseling for your educational journey.',
                  link: '/contact'
                }

              ].map((item, index) => (

                <motion.div

                  key={index}

                  className="mb-4 p-4 h-100"

                  initial={{
                    opacity: 0,
                    x: 40,
                  }}

                  whileInView={{
                    opacity: 1,
                    x: 0,
                  }}

                  transition={{
                    delay: index * 0.2,
                  }}

                  whileHover={{
                    y: -10,
                    scale: 1.02,
                  }}

                  viewport={{
                    once: true,
                  }}

                  style={{

                    background:
                      "rgba(255,255,255,0.06)",

                    backdropFilter:
                      "blur(14px)",

                    borderRadius: "28px",

                    border:
                      "1px solid rgba(255,255,255,0.08)",

                    boxShadow:
                      "0 10px 35px rgba(0,0,0,0.25)",

                  }}
                >

                  <div
                    className="d-flex flex-column align-items-start"
                  >

                    <div
                      className="d-flex align-items-center justify-content-center mb-4"

                      style={{
                        width: "80px",
                        height: "80px",
                        borderRadius: "22px",

                        background:
                          "linear-gradient(135deg,#ffc107,#ffb300)",

                        color: "#111",

                        fontSize: "32px",

                        boxShadow:
                          "0 10px 25px rgba(255,193,7,0.35)",
                      }}
                    >
                      {item.icon}
                    </div>

                    <h4
                      className="fw-bold mb-3 text-white"
                      style={{
                        fontSize: "22px",
                      }}
                    >
                      {item.title}
                    </h4>

                    <p
                      style={{

                        lineHeight: "1.8",

                        fontSize: "15px",

                        color:
                          "rgba(255,255,255,0.7)",

                      }}
                    >
                      {item.description}
                    </p>

                    <Link

                      to={item.link}

                      className="btn mt-3"

                      style={{

                        background:
                          "#ffc107",

                        color: "#111",

                        borderRadius: "14px",

                        padding:
                          "10px 24px",

                        fontWeight: "700",

                        border: "none",

                      }}
                    >

                      Learn More

                    </Link>

                  </div>

                </motion.div>

              ))
            }

          </div>

        </div>

      </div>

    </section>


    {/* PREMIUM GLOBAL DESTINATIONS SECTION */}

    <section
      className="position-relative overflow-hidden py-5"
      style={{
        background:
          "linear-gradient(135deg,#020617,#081120,#020617)",
      }}
    >
      {/* PREMIUM GLOW EFFECTS */}

      <div
        style={{
          position: "absolute",
          width: "500px",
          height: "500px",
          background: "rgba(255,193,7,0.10)",
          borderRadius: "50%",
          filter: "blur(160px)",
          top: "-220px",
          left: "-220px",
        }}
      />

      <div
        style={{
          position: "absolute",
          width: "450px",
          height: "450px",
          background: "rgba(255,193,7,0.08)",
          borderRadius: "50%",
          filter: "blur(160px)",
          bottom: "-180px",
          right: "-180px",
        }}
      />

      <div className="container position-relative" style={{ zIndex: 2 }}>

        {/* HEADER */}

        <div className="text-center mb-5">

          <span
            className="px-4 py-2 d-inline-block mb-4"
            style={{
              borderRadius: "40px",
              background: "rgba(255,193,7,0.12)",
              color: "#ffc107",
              border:
                "1px solid rgba(255,193,7,0.25)",
              fontWeight: "600",
              letterSpacing: "1px",
            }}
          >
            GLOBAL STUDY DESTINATIONS
          </span>

          <h2
            className="fw-bold text-white"
            style={{
              fontSize: "clamp(2.5rem,5vw,5rem)",
              lineHeight: "1.2",
            }}
          >
            Your Journey From
            <span style={{ color: "#ffc107" }}>
              {" "}India To The World
            </span>
          </h2>

          <p
            className="mx-auto mt-4"
            style={{
              maxWidth: "850px",
              color: "rgba(255,255,255,0.72)",
              lineHeight: "2",
              fontSize: "18px",
            }}
          >
            Explore top global destinations with
            expert visa assistance, overseas education
            guidance, and premium admission support.
          </p>
        </div>

        {/* MAIN MAP CARD */}

        <div
          className="position-relative mx-auto premium-map-box"
        >

          {/* GRID OVERLAY */}

          <div className="map-grid"></div>

          {/* WHITE WORLD MAP */}

          <img
            src="https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg"
            alt="World Map"
            className="world-map"
          />

          {/* SVG CONNECTION ROUTES */}

          <svg
            viewBox="0 0 1400 820"
            className="routes-svg"
          >

            {/* USA */}
            <path
              d="M870 410 Q650 250 290 320"
              className="route-line"
            />

            {/* CANADA */}
            <path
              d="M870 410 Q620 170 250 200"
              className="route-line"
            />

            {/* UK */}
            <path
              d="M870 410 Q760 280 640 280"
              className="route-line"
            />

            {/* EUROPE */}
            <path
              d="M870 410 Q790 330 760 350"
              className="route-line"
            />

            {/* AUSTRALIA */}
            <path
              d="M870 410 Q980 520 1120 620"
              className="route-line"
            />

            {/* NEW ZEALAND */}
            <path
              d="M870 410 Q1080 590 1240 720"
              className="route-line"
            />

          </svg>

          {/* INDIA HUB */}

          <div className="india-hub">

            <div className="india-ring"></div>
            <div className="india-ring delay"></div>

            <div className="india-flag-box">

              <img
                src="https://flagcdn.com/w320/in.png"
                alt="India"
              />

            </div>

            <h3>India</h3>

          </div>

          {/* DESTINATION CARDS */}

          {[
            {
              name: "Canada",
              flag: "https://flagcdn.com/w320/ca.png",
              top: "20%",
              left: "18%",
            },

            {
              name: "USA",
              flag: "https://flagcdn.com/w320/us.png",
              top: "34%",
              left: "22%",
            },

            {
              name: "UK",
              flag: "https://flagcdn.com/w320/gb.png",
              top: "28%",
              left: "48%",
            },

            {
              name: "Europe",
              flag:
                "https://upload.wikimedia.org/wikipedia/commons/b/b7/Flag_of_Europe.svg",
              top: "38%",
              left: "55%",
            },

            {
              name: "Australia",
              flag: "https://flagcdn.com/w320/au.png",
              top: "72%",
              left: "82%",
            },

            {
              name: "New Zealand",
              flag: "https://flagcdn.com/w320/nz.png",
              top: "84%",
              left: "92%",
            },

          ].map((country, index) => (

            <div
              key={index}
              className="destination-card"
              style={{
                top: country.top,
                left: country.left,
                animationDelay: `${index * 0.4}s`,
              }}
            >

              <div className="destination-flag">

                <img
                  src={country.flag}
                  alt={country.name}
                />

              </div>

              <div className="destination-content">

                <h5>{country.name}</h5>

              </div>

            </div>

          ))}

          {/* MOVING AIRPLANE */}

          <div className="plane-animation">

            <i className="fas fa-plane"></i>

          </div>

          {/* FLOATING STATS */}

          <div className="stats-card">

            <h2>250+</h2>

            <p>Students Guided</p>

          </div>

          <div className="success-card">

            <h2>98%</h2>

            <p>Visa Success Rate</p>

          </div>

        </div>
      </div>

      {/* ====================== */}
      {/* CSS */}
      {/* ====================== */}

      <style>
        {`

          .premium-map-box{
            max-width:1400px;
            min-height:820px;
            border-radius:40px;
            overflow:hidden;
            background:rgba(255,255,255,0.04);
            border:1px solid rgba(255,255,255,0.08);
            backdrop-filter:blur(20px);
            box-shadow:0 30px 80px rgba(0,0,0,0.45);
          }

          .map-grid{
            position:absolute;
            inset:0;
            background-image:
              linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
            background-size:60px 60px;
            opacity:0.3;
          }

          .world-map{
            width:100%;
            height:100%;
            object-fit:cover;
            position:absolute;
            inset:0;
            filter:brightness(0) invert(1) opacity(0.22);
            transform:scale(1.05);
          }

          .routes-svg{
            position:absolute;
            inset:0;
            width:100%;
            height:100%;
            z-index:2;
          }

          .route-line{
            stroke:#ffc107;
            stroke-width:3;
            fill:none;
            stroke-linecap:round;
            opacity:0.8;
            stroke-dasharray:12 14;
            animation:moveRoute 1.2s linear infinite;
            filter:drop-shadow(0 0 8px rgba(255,193,7,0.45));
          }

          .india-hub{
            position:absolute;
            top:50%;
            left:72%;
            transform:translate(-50%,-50%);
            z-index:6;
          }

          .india-flag-box{
            width:120px;
            height:120px;
            border-radius:50%;
            overflow:hidden;
            border:5px solid rgba(255,193,7,0.7);
            background:#fff;
            position:relative;
            z-index:2;
            box-shadow:0 0 50px rgba(255,193,7,0.7);
            animation:pulse 2.5s infinite;
          }

          .india-flag-box img{
            width:100%;
            height:100%;
            object-fit:cover;
          }

          .india-hub h3{
            color:#ffc107;
            font-weight:800;
            margin-top:20px;
            text-align:center;
            letter-spacing:1px;
          }

          .india-ring{
            position:absolute;
            width:180px;
            height:180px;
            border:2px solid rgba(255,193,7,0.35);
            border-radius:50%;
            top:50%;
            left:50%;
            transform:translate(-50%,-50%);
            animation:pulseRing 3s linear infinite;
          }

          .india-ring.delay{
            animation-delay:1.5s;
          }

          .destination-card{
            position:absolute;
            transform:translate(-50%,-50%);
            z-index:5;
            display:flex;
            align-items:center;
            gap:14px;
            padding:14px 18px;
            border-radius:22px;
            background:rgba(255,255,255,0.08);
            backdrop-filter:blur(14px);
            border:1px solid rgba(255,255,255,0.08);
            box-shadow:0 15px 40px rgba(0,0,0,0.35);
            animation:float 5s ease-in-out infinite;
          }

          .destination-flag{
            width:70px;
            height:70px;
            border-radius:50%;
            overflow:hidden;
            border:3px solid rgba(255,193,7,0.6);
            flex-shrink:0;
            box-shadow:0 0 25px rgba(255,193,7,0.35);
          }

          .destination-flag img{
            width:100%;
            height:100%;
            object-fit:cover;
          }

          .destination-content h5{
            color:#fff;
            font-weight:700;
            margin-bottom:4px;
          }

          .destination-content small{
            color:#ffc107;
            font-weight:600;
          }

          .plane-animation{
            position:absolute;
            top:48%;
            left:50%;
            z-index:6;
            animation:fly 14s linear infinite;
          }

          .plane-animation i{
            color:#ffc107;
            font-size:48px;
            transform:rotate(35deg);
            filter:drop-shadow(0 0 20px rgba(255,193,7,0.7));
          }

          .stats-card,
          .success-card{
            position:absolute;
            padding:24px 30px;
            border-radius:24px;
            background:rgba(255,255,255,0.08);
            backdrop-filter:blur(14px);
            border:1px solid rgba(255,255,255,0.08);
            z-index:5;
            box-shadow:0 15px 40px rgba(0,0,0,0.35);
          }

          .stats-card{
            top:8%;
            right:5%;
          }

          .success-card{
            bottom:8%;
            left:5%;
          }

          .stats-card h2,
          .success-card h2{
            color:#ffc107;
            font-size:42px;
            font-weight:800;
            margin-bottom:8px;
          }

          .stats-card p,
          .success-card p{
            color:rgba(255,255,255,0.75);
            margin:0;
          }

          @keyframes moveRoute{

            from{
              stroke-dashoffset:0;
            }

            to{
              stroke-dashoffset:-26;
            }
          }

          @keyframes pulse{
            0%{
              transform:scale(1);
            }

            50%{
              transform:scale(1.08);
            }

            100%{
              transform:scale(1);
            }
          }

          @keyframes pulseRing{
            0%{
              transform:translate(-50%,-50%) scale(0.8);
              opacity:1;
            }

            100%{
              transform:translate(-50%,-50%) scale(1.4);
              opacity:0;
            }
          }

          @keyframes float{
            0%{
              transform:translate(-50%,-50%) translateY(0px);
            }

            50%{
              transform:translate(-50%,-50%) translateY(-12px);
            }

            100%{
              transform:translate(-50%,-50%) translateY(0px);
            }
          }

          @keyframes fly{
            0%{
              transform:translateX(-250px) translateY(0px);
            }

            50%{
              transform:translateX(380px) translateY(-180px);
            }

            100%{
              transform:translateX(-250px) translateY(0px);
            }
          }

          @media(max-width:992px){

            .destination-card{
              padding:10px 14px;
            }

            .destination-flag{
              width:55px;
              height:55px;
            }

            .destination-content h5{
              font-size:14px;
            }

            .stats-card,
            .success-card{
              display:none;
            }

          }

          @media(max-width:768px){

            .premium-map-box{
              min-height:650px;
            }

            .destination-content{
              display:none;
            }

            .destination-card{
              padding:8px;
              border-radius:50%;
            }

            .india-flag-box{
              width:90px;
              height:90px;
            }

          }

        `}
      </style>
    </section>        



      {/* Premium Testimonials Section */}

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
            top: "-100px",
            right: "-100px",
          }}
        />

        <div className="container position-relative">

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
              TESTIMONIALS
            </span>

            <h2
              className="fw-bold text-white"
              style={{
                fontSize:
                  "clamp(2rem,5vw,3.5rem)",
              }}
            >

              What Our

              <span style={{ color: "#ffc107" }}>
                {" "}Students Say
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
              Hear from students who successfully
              achieved their international education
              dreams with Outlook Edu Services.
            </p>

          </motion.div>

          {/* TESTIMONIAL SLIDER */}

          <Swiper

            modules={[
              Pagination,
              Autoplay
            ]}

            spaceBetween={30}

            slidesPerView={1}

            autoplay={{
              delay: 4000,
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

              testimonials.map(
                (testimonial, index) => (

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
                      y: -10,
                      scale: 1.02,
                    }}

                    viewport={{
                      once: true,
                    }}
                  >

                    <div

                      className="h-100 p-4 position-relative"

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

                        overflow: "hidden",

                      }}
                    >

                      {/* GOLD QUOTE */}

                      <div
                        style={{
                          position: "absolute",
                          top: "15px",
                          right: "20px",

                          fontSize: "70px",

                          color:
                            "rgba(255,193,7,0.15)",

                          fontWeight: "bold",

                          lineHeight: "1",
                        }}
                      >
                        ”
                      </div>

                      {/* IMAGE */}

                      <div className="text-center mb-4">

                        <img

                          src={testimonial.image}

                          alt={testimonial.name}

                          style={{

                            width: "90px",

                            height: "90px",

                            objectFit: "cover",

                            borderRadius: "50%",

                            border:
                              "4px solid #ffc107",

                            boxShadow:
                              "0 10px 25px rgba(255,193,7,0.25)",

                          }}
                        />

                      </div>

                      {/* TEXT */}

                      <p
                        style={{

                          color:
                            "rgba(255,255,255,0.75)",

                          lineHeight: "1.9",

                          fontSize: "15px",

                          minHeight: "140px",

                        }}
                      >

                        "{testimonial.text}"

                      </p>

                      {/* USER INFO */}

                      <div className="text-center mt-4">

                        <h5
                          className="fw-bold mb-1 text-white"
                        >
                          {testimonial.name}
                        </h5>

                        <small
                          style={{
                            color: "#ffc107",
                          }}
                        >
                          {testimonial.role}
                        </small>

                      </div>

                    </div>

                  </motion.div>

                </SwiperSlide>

              ))
            }

          </Swiper>

        </div>

      </section>

      {/* Premium CTA Section */}

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
              "rgba(255,193,7,0.15)",

            borderRadius: "50%",

            filter: "blur(120px)",

            top: "-100px",

            left: "-100px",
          }}
        />

        <div
          style={{
            position: "absolute",
            width: "300px",
            height: "300px",
            background:
              "rgba(255,193,7,0.12)",

            borderRadius: "50%",

            filter: "blur(120px)",

            bottom: "-100px",

            right: "-100px",
          }}
        />

        <div className="container position-relative">

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
              duration: 0.7,
            }}

            viewport={{
              once: true,
            }}

            className="text-center mx-auto p-4 p-lg-5"
            
            style={{

              maxWidth: "1000px",

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
              FREE CONSULTATION
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

              Ready To Start

              <span style={{ color: "#ffc107" }}>
                {" "}Your Journey?
              </span>

            </h2>

            {/* DESCRIPTION */}

            <p
              className="mx-auto mb-5"
              style={{

                maxWidth: "700px",

                color:
                  "rgba(255,255,255,0.75)",

                fontSize: "18px",

                lineHeight: "1.9",

              }}
            >
              Get personalized guidance from our expert
              consultants and take the first step toward
              achieving your international education goals.
            </p>

            {/* BUTTONS */}

            <div
              className="d-flex flex-wrap justify-content-center gap-3"
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

                Book Free Consultation

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

            </div>

            {/* STATS */}

            <div
              className="row mt-5 g-4"
            >

              {

                [

                  {
                    number: "250+",
                    label: "Students Guided",
                  },

                  {
                    number: "15+",
                    label: "Countries",
                  },

                  {
                    number: "98%",
                    label: "Visa Success",
                  },

                ].map((item, index) => (

                  <div
                    key={index}
                    className="col-md-4"
                  >

                    <motion.div

                      whileHover={{
                        y: -6,
                      }}

                      transition={{
                        duration: 0.3,
                      }}

                      className="p-4"

                      style={{

                        background:
                          "rgba(255,255,255,0.04)",

                        borderRadius: "24px",

                        border:
                          "1px solid rgba(255,255,255,0.06)",

                      }}
                    >

                      <h3
                        className="fw-bold mb-2"
                        style={{
                          color: "#ffc107",
                        }}
                      >
                        {item.number}
                      </h3>

                      <p
                        className="mb-0"
                        style={{
                          color:
                            "rgba(255,255,255,0.7)",
                        }}
                      >
                        {item.label}
                      </p>

                    </motion.div>

                  </div>

                ))
              }

            </div>

          </motion.div>

        </div>

      </section>
    </div>
  );
};

export default Home;