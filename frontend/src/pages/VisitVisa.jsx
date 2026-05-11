import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaPassport, FaClock, FaCheckCircle, FaFileAlt } from 'react-icons/fa';

const VisitVisa = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const visaTypes = [
    {
      type: 'Tourist Visa',
      description: 'For leisure travel, sightseeing, and short visits.',
      duration: '30-90 days',
      processing: '2-4 weeks',
      validity: '6 months to 1 year',
      icon: <FaPassport />
    },
    {
      type: 'Business Visa',
      description: 'For business meetings, conferences, and short-term work.',
      duration: '30-90 days',
      processing: '1-3 weeks',
      validity: '3-6 months',
      icon: <FaFileAlt />
    },
    {
      type: 'Student Visa',
      description: 'For pursuing education and academic programs abroad.',
      duration: 'Course duration',
      processing: '4-8 weeks',
      validity: '1-5 years',
      icon: <FaCheckCircle />
    },
    {
      type: 'Work Visa',
      description: 'For employment and long-term professional opportunities.',
      duration: '1-5 years',
      processing: '6-12 weeks',
      validity: '2-10 years',
      icon: <FaClock />
    }
  ];

  const countries = [
    { name: 'USA', flag: '🇺🇸', processingTime: '2-4 weeks', successRate: '95%' },
    { name: 'UK', flag: '🇬🇧', processingTime: '3-5 weeks', successRate: '92%' },
    { name: 'Canada', flag: '🇨🇦', processingTime: '2-6 weeks', successRate: '94%' },
    { name: 'Australia', flag: '🇦🇺', processingTime: '4-8 weeks', successRate: '91%' },
    { name: 'New Zealand', flag: '🇳🇿', processingTime: '2-4 weeks', successRate: '96%' },
    { name: 'Ireland', flag: '🇮🇪', processingTime: '1-2 weeks', successRate: '98%' },
    { name: 'Europe', flag: '🇪🇺', processingTime: '1-2 weeks', successRate: '93%' }
  ];

  const process = [
    'Document verification and preparation',
    'Application form completion',
    'Biometric data submission',
    'Embassy interview scheduling',
    'Visa fee payment',
    'Collection and travel planning'
  ];

  return (
    <div className="visit-visa-page">
      {/* Premium Visa Hero Section */}
      <section
        className="position-relative overflow-hidden d-flex align-items-center"
        style={{
          minHeight: "90vh",
          background:
            "linear-gradient(135deg,#050505,#111827)",
        }}
      >
        {/* DARK OVERLAY */}

        <div
          className="position-absolute w-100 h-100"
          style={{
            background:
              "linear-gradient(135deg,rgba(0,0,0,0.78),rgba(17,24,39,0.88))",

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
            width: "320px",
            height: "320px",
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

            className="row justify-content-center"

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

            <div className="col-lg-10 text-center">

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
                    "blur(12px)",

                }}
              >

                VISA SERVICES

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
                    "clamp(2.8rem,7vw,6rem)",

                  lineHeight: "1.15",
                }}
              >

                Expert Guidance For

                <span style={{ color: "#ffc107" }}>
                  {" "}Global Visa Success
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

                className="mx-auto mb-5"

                style={{

                  maxWidth: "850px",

                  color:
                    "rgba(255,255,255,0.75)",

                  fontSize: "20px",

                  lineHeight: "2",

                }}
              >

                Expert visa assistance for all your
                international travel needs. From tourist
                visas to student and work permits, our
                consultants ensure a smooth and successful
                application process.

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
                      "15px 36px",

                    borderRadius: "18px",

                    fontWeight: "700",

                    border: "none",

                    boxShadow:
                      "0 10px 25px rgba(255,193,7,0.35)",

                  }}
                >

                  Get Visa Consultation

                </Link>

                <Link

                  to="/study-abroad"

                  className="btn"

                  style={{

                    background:
                      "rgba(255,255,255,0.08)",

                    color: "#fff",

                    padding:
                      "15px 36px",

                    borderRadius: "18px",

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

              {/* FLOATING VISA TAGS */}

              <motion.div

                initial={{
                  opacity: 0,
                  y: 20,
                }}

                animate={{
                  opacity: 1,
                  y: 0,
                }}

                transition={{
                  delay: 1,
                }}

                className="d-flex flex-wrap justify-content-center gap-3 mt-5"
              >

                {

                  [

                    "🎓 Student Visa",

                    "✈️ Tourist Visa",

                    "💼 Work Permit",

                    "🌍 Immigration",

                    "📄 Documentation",

                  ].map((item, index) => (

                    <motion.div

                      key={index}

                      whileHover={{
                        y: -5,
                        scale: 1.05,
                      }}

                      className="px-4 py-2"

                      style={{

                        background:
                          "rgba(255,255,255,0.08)",

                        borderRadius: "40px",

                        color: "#fff",

                        border:
                          "1px solid rgba(255,255,255,0.1)",

                        backdropFilter:
                          "blur(10px)",

                        fontWeight: "500",

                      }}
                    >

                      {item}

                    </motion.div>

                  ))
                }

              </motion.div>

            </div>

          </motion.div>

        </div>

      </section>

      {/* Premium Visa Categories Section */}
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
              VISA SERVICES
            </span>

            <h2
              className="fw-bold text-white"
              style={{
                fontSize:
                  "clamp(2rem,5vw,4rem)",

                lineHeight: "1.2",
              }}
            >

              Visa Categories For

              <span style={{ color: "#ffc107" }}>
                {" "}Every Journey
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
              Professional visa assistance tailored to
              your travel, education, career, and
              immigration needs worldwide.
            </p>

          </motion.div>

          {/* VISA CARDS */}

          <div className="row g-4">

            {

              visaTypes.map((visa, index) => (

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
                      delay: index * 0.12,
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

                      {visa.icon}

                    </motion.div>

                    {/* VISA TYPE */}

                    <h4
                      className="fw-bold text-white mb-3"
                    >
                      {visa.type}
                    </h4>

                    {/* DESCRIPTION */}

                    <p
                      style={{

                        color:
                          "rgba(255,255,255,0.72)",

                        lineHeight: "1.9",

                        fontSize: "15px",

                      }}
                    >

                      {visa.description}

                    </p>

                    {/* DETAILS */}

                    <div className="mt-4 mb-4">

                      {/* DURATION */}

                      <div
                        className="p-3 mb-3"

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
                          Stay Duration
                        </small>

                        <h6
                          className="fw-bold mt-1 mb-0"
                          style={{
                            color: "#ffc107",
                          }}
                        >
                          {visa.duration}
                        </h6>

                      </div>

                      {/* PROCESSING */}

                      <div
                        className="p-3 mb-3"

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
                          Processing Time
                        </small>

                        <h6
                          className="fw-bold mt-1 mb-0"
                          style={{
                            color: "#ffc107",
                          }}
                        >
                          {visa.processing}
                        </h6>

                      </div>

                      {/* VALIDITY */}

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
                          Validity
                        </small>

                        <h6
                          className="fw-bold mt-1 mb-0"
                          style={{
                            color: "#ffc107",
                          }}
                        >
                          {visa.validity}
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
                    >

                      <Link

                        to="/contact"

                        className="btn"

                        style={{

                          background:
                            "#ffc107",

                          color: "#111",

                          padding:
                            "12px 28px",

                          borderRadius: "16px",

                          fontWeight: "700",

                          border: "none",

                          boxShadow:
                            "0 10px 25px rgba(255,193,7,0.3)",

                        }}
                      >

                        Apply Now

                      </Link>

                    </motion.div>

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

      {/* Premium Popular Destinations Section */}

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
              GLOBAL DESTINATIONS
            </span>

            <h2
              className="fw-bold text-white"
              style={{
                fontSize:
                  "clamp(2rem,5vw,4rem)",

                lineHeight: "1.2",
              }}
            >

              Popular Visa

              <span style={{ color: "#ffc107" }}>
                {" "}Destinations
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
              Explore top countries with fast visa
              processing, high approval rates, and
              excellent international opportunities.
            </p>

          </motion.div>

          {/* DESTINATION CARDS */}

          <div className="row g-4">

            {

              countries.map((country, index) => (

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
                      delay: index * 0.12,
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
                          "rgba(255,193,7,0.15)",

                        borderRadius: "50%",

                        filter: "blur(70px)",

                        top: "-40px",

                        right: "-40px",
                      }}
                    />

                    {/* FLAG */}

                    <motion.div

                      animate={{
                        y: [0, -8, 0],
                      }}

                      transition={{
                        duration: 4,
                        repeat: Infinity,
                      }}

                      className="mx-auto mb-4 d-flex align-items-center justify-content-center"

                      style={{

                        width: "110px",

                        height: "110px",

                        borderRadius: "50%",

                        background:
                          "linear-gradient(135deg,#ffc107,#ffb300)",

                        color: "#111",

                        fontSize: "52px",

                        fontWeight: "700",

                        boxShadow:
                          "0 10px 25px rgba(255,193,7,0.35)",

                      }}
                    >

                      {country.flag}

                    </motion.div>

                    {/* COUNTRY NAME */}

                    <h3
                      className="fw-bold text-white mb-4"
                    >
                      {country.name}
                    </h3>

                    {/* DETAILS */}

                    <div className="row g-3 mb-4">

                      {/* PROCESSING */}

                      <div className="col-6">

                        <motion.div

                          whileHover={{
                            scale: 1.05,
                          }}

                          className="p-3 h-100"

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
                            Processing
                          </small>

                          <h6
                            className="fw-bold mt-2 mb-0"
                            style={{
                              color: "#ffc107",
                            }}
                          >
                            {country.processingTime}
                          </h6>

                        </motion.div>

                      </div>

                      {/* SUCCESS RATE */}

                      <div className="col-6">

                        <motion.div

                          whileHover={{
                            scale: 1.05,
                          }}

                          className="p-3 h-100"

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
                            Success Rate
                          </small>

                          <h6
                            className="fw-bold mt-2 mb-0"
                            style={{
                              color: "#28c76f",
                            }}
                          >
                            {country.successRate}
                          </h6>

                        </motion.div>

                      </div>

                    </div>

                    {/* APPLY BUTTON */}

                    <motion.div

                      whileHover={{
                        scale: 1.05,
                      }}

                      whileTap={{
                        scale: 0.95,
                      }}
                    >

                      <Link

                        to="/contact"

                        className="btn"

                        style={{

                          background:
                            "#ffc107",

                          color: "#111",

                          padding:
                            "12px 28px",

                          borderRadius: "16px",

                          fontWeight: "700",

                          border: "none",

                          boxShadow:
                            "0 10px 25px rgba(255,193,7,0.3)",

                        }}
                      >

                        Apply Visa

                      </Link>

                    </motion.div>

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

      {/* Premium Visa Process Section */}

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
            width: "320px",
            height: "320px",
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

          <div className="row align-items-center g-5">

            {/* LEFT SIDE */}

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
                VISA PROCESS
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

                Smooth & Guided

                <span style={{ color: "#ffc107" }}>
                  {" "}Visa Process
                </span>

              </h2>

              {/* DESCRIPTION */}

              <p
                className="mb-5"
                style={{

                  color:
                    "rgba(255,255,255,0.75)",

                  fontSize: "18px",

                  lineHeight: "2",

                }}
              >

                Our experienced consultants simplify
                the visa application journey with
                professional guidance, documentation
                support, and interview preparation.

              </p>

              {/* PROCESS STEPS */}

              <div className="position-relative">

                {/* VERTICAL LINE */}

                <div
                  style={{
                    position: "absolute",

                    left: "22px",

                    top: "10px",

                    bottom: "10px",

                    width: "3px",

                    background:
                      "linear-gradient(to bottom,#ffc107,#ffb300)",

                    borderRadius: "20px",

                  }}
                />

                {

                  process.map((step, index) => (

                    <motion.div

                      key={index}

                      initial={{
                        opacity: 0,
                        x: -40,
                      }}

                      whileInView={{
                        opacity: 1,
                        x: 0,
                      }}

                      transition={{
                        delay: index * 0.15,
                        duration: 0.6,
                      }}

                      whileHover={{
                        x: 10,
                      }}

                      viewport={{
                        once: true,
                      }}

                      className="d-flex align-items-start position-relative mb-4"
                    >

                      {/* NUMBER */}

                      <motion.div

                        animate={{
                          scale: [1, 1.08, 1],
                        }}

                        transition={{
                          duration: 3,
                          repeat: Infinity,
                        }}

                        className="d-flex align-items-center justify-content-center me-4"

                        style={{

                          width: "45px",

                          height: "45px",

                          borderRadius: "50%",

                          background:
                            "linear-gradient(135deg,#ffc107,#ffb300)",

                          color: "#111",

                          fontWeight: "700",

                          fontSize: "18px",

                          flexShrink: 0,

                          boxShadow:
                            "0 10px 25px rgba(255,193,7,0.35)",

                          zIndex: 2,

                        }}
                      >

                        {index + 1}

                      </motion.div>

                      {/* STEP CARD */}

                      <div

                        className="p-4 w-100"

                        style={{

                          background:
                            "rgba(255,255,255,0.06)",

                          backdropFilter:
                            "blur(14px)",

                          borderRadius: "22px",

                          border:
                            "1px solid rgba(255,255,255,0.08)",

                        }}
                      >

                        <h5
                          className="fw-bold mb-2"
                          style={{
                            color: "#ffc107",
                          }}
                        >
                          Step {index + 1}
                        </h5>

                        <p
                          className="mb-0"
                          style={{

                            color:
                              "rgba(255,255,255,0.72)",

                            lineHeight: "1.8",

                          }}
                        >

                          {step}

                        </p>

                      </div>

                    </motion.div>

                  ))
                }

              </div>

            </motion.div>

            {/* RIGHT SIDE */}

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

                  src="https://images.unsplash.com/photo-1554224155-6726b3ff858f"

                  alt="Visa Processing"

                  className="img-fluid"

                  whileHover={{
                    scale: 1.03,
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

                {/* TOP SMALL IMAGE */}

                <motion.img

                  src="https://images.unsplash.com/photo-1521791136064-7986c2920216"

                  alt="Consultation"

                  animate={{
                    y: [0, -10, 0],
                  }}

                  transition={{
                    duration: 4,
                    repeat: Infinity,
                  }}

                  className="position-absolute d-none d-md-block"

                  style={{

                    width: "170px",

                    height: "170px",

                    objectFit: "cover",

                    borderRadius: "24px",

                    top: "-40px",

                    left: "-40px",

                    border:
                      "2px solid rgba(255,193,7,0.3)",

                    boxShadow:
                      "0 15px 40px rgba(0,0,0,0.35)",

                  }}
                />

                {/* BOTTOM SMALL IMAGE */}

                <motion.img

                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644"

                  alt="Students"

                  animate={{
                    y: [0, 10, 0],
                  }}

                  transition={{
                    duration: 5,
                    repeat: Infinity,
                  }}

                  className="position-absolute d-none d-md-block"

                  style={{

                    width: "190px",

                    height: "190px",

                    objectFit: "cover",

                    borderRadius: "28px",

                    bottom: "-50px",

                    right: "-40px",

                    border:
                      "2px solid rgba(255,193,7,0.3)",

                    boxShadow:
                      "0 15px 40px rgba(0,0,0,0.35)",

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

                    bottom: "30px",

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
                    98%
                  </h3>

                  <small className="text-white">
                    Visa Success Rate
                  </small>

                </motion.div>

                {/* SECOND CARD */}

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
                    Fast
                  </h5>

                  <small className="text-white">
                    Documentation Support
                  </small>

                </motion.div>

              </div>

            </motion.div>

          </div>

        </div>

      </section>

      {/* Premium Visa CTA Section */}

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

            top: "-120px",

            left: "-120px",

            zIndex: 1,
          }}
        />

        <div
          style={{
            position: "absolute",
            width: "320px",
            height: "320px",

            background:
              "rgba(255,193,7,0.1)",

            borderRadius: "50%",

            filter: "blur(120px)",

            bottom: "-100px",

            right: "-100px",

            zIndex: 1,
          }}
        />

        <div className="container position-relative" style={{ zIndex: 2 }}>

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

              maxWidth: "1100px",

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
              VISA CONSULTATION
            </span>

            {/* HEADING */}

            <h2
              className="fw-bold text-white mb-4"
              style={{
                fontSize:
                  "clamp(2rem,5vw,4.2rem)",

                lineHeight: "1.2",
              }}
            >

              Start Your

              <span style={{ color: "#ffc107" }}>
                {" "}Visa Application
              </span>

            </h2>

            {/* DESCRIPTION */}

            <p
              className="mx-auto mb-5"
              style={{

                maxWidth: "760px",

                color:
                  "rgba(255,255,255,0.75)",

                fontSize: "18px",

                lineHeight: "1.9",

              }}
            >
              Get expert assistance with your visa
              application process. From documentation
              to interview preparation, our team ensures
              a smooth and successful journey.
            </p>

            {/* BUTTON */}

            <motion.div

              whileHover={{
                scale: 1.05,
              }}

              whileTap={{
                scale: 0.95,
              }}
            >

              <Link

                to="/contact"

                className="btn"

                style={{

                  background:
                    "#ffc107",

                  color: "#111",

                  padding:
                    "15px 38px",

                  borderRadius: "18px",

                  fontWeight: "700",

                  border: "none",

                  boxShadow:
                    "0 10px 25px rgba(255,193,7,0.35)",

                }}
              >

                Free Visa Consultation

              </Link>

            </motion.div>

            {/* STATS */}

            <div className="row mt-5 g-4">

              {

                [

                  {
                    number: "98%",
                    label: "Visa Success Rate",
                  },

                  {
                    number: "15+",
                    label: "Countries Supported",
                  },

                  {
                    number: "24/7",
                    label: "Expert Assistance",
                  },

                ].map((item, index) => (

                  <div
                    key={index}
                    className="col-md-4"
                  >

                    <motion.div

                      whileHover={{
                        y: -8,
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

export default VisitVisa;