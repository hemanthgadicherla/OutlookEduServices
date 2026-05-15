import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaUniversity, FaGraduationCap, FaPlane } from 'react-icons/fa';
import { studyAbroadCountries } from '../data/studyAbroad';

const StudyAbroad = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const countries = studyAbroadCountries;

  const process = [
    {
      step: 1,
      title: 'Choose Your Destination',
      description: 'Research countries, universities, and programs that align with your goals.',
      icon: <FaMapMarkerAlt />
    },
    {
      step: 2,
      title: 'University Selection',
      description: 'Get personalized recommendations based on your profile and preferences.',
      icon: <FaUniversity />
    },
    {
      step: 3,
      title: 'Application Process',
      description: 'Complete documentation, SOP writing, and application submission assistance.',
      icon: <FaGraduationCap />
    },
    {
      step: 4,
      title: 'Visa & Departure',
      description: 'Visa application guidance and pre-departure orientation.',
      icon: <FaPlane />
    }
  ];

  return (
    <div className="study-abroad-page">
    {/* Premium Study Abroad Hero Section */}

      <section
        className="position-relative overflow-hidden d-flex align-items-center py-5"
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
          background: "linear-gradient(135deg,rgba(0,0,0,0.78),rgba(17,24,39,0.88))", zIndex: 2,
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

                STUDY ABROAD DESTINATIONS

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

                Explore World-Class

                <span style={{ color: "#ffc107" }}>
                  {" "}Education Destinations
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

                Discover globally recognized universities,
                diverse cultures, and endless career
                opportunities in top study destinations
                around the world. Your journey toward
                international excellence starts here.

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

                  Get Free Consultation

                </Link>

                <Link

                  to="/courses"

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

                  Explore Courses

                </Link>

              </motion.div>

              {/* FLOATING DESTINATION TAGS */}

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

                    "🇺🇸 USA",

                    "🇬🇧 UK",

                    "🇨🇦 Canada",

                    "🇦🇺 Australia",

                    "🇳🇿 New Zealand",
                    
                    "🇮🇪 Ireland",

                    "🇪🇺 Europe",

                  ].map((country, index) => (

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

                      {country}

                    </motion.div>

                  ))
                }

              </motion.div>

            </div>

          </motion.div>

        </div>

      </section>

      {/* Premium Countries Section */}
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
              TOP DESTINATIONS
            </span>

            <h2
              className="fw-bold text-white"
              style={{
                fontSize:
                  "clamp(2rem,5vw,4rem)",

                lineHeight: "1.2",
              }}
            >

              Popular Study

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
              Explore globally recognized education
              destinations offering world-class
              universities, career opportunities,
              and international exposure.
            </p>

          </motion.div>

          {/* COUNTRIES GRID */}

          <div className="row g-4">

            {

              countries.map((country, index) => (

                <div
                  key={index}
                  className="col-lg-6"
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

                    className="position-relative overflow-hidden h-100"

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

                    <div className="row g-0 h-100">

                      {/* IMAGE */}

                      <div className="col-md-5 position-relative">

                        <motion.img

                          src={country.image}

                          alt={country.name}

                          whileHover={{
                            scale: 1.08,
                          }}

                          transition={{
                            duration: 0.5,
                          }}

                          className="w-100 h-100"

                          style={{

                            objectFit: "cover",

                            minHeight: "320px",

                          }}
                        />

                        {/* DARK OVERLAY */}

                        <div
                          style={{
                            position: "absolute",

                            inset: 0,

                            background:
                              "linear-gradient(to top, rgba(0,0,0,0.55), transparent)",
                          }}
                        />

                        {/* FLAG */}

                        <div
                          className="position-absolute"

                          style={{
                            top: "20px",
                            left: "20px",

                            fontSize: "45px",

                            background:
                              "rgba(255,255,255,0.12)",

                            width: "80px",

                            height: "80px",

                            borderRadius: "50%",

                            display: "flex",

                            alignItems: "center",

                            justifyContent: "center",

                            backdropFilter:
                              "blur(12px)",

                            border:
                              "1px solid rgba(255,255,255,0.12)",
                          }}
                        >

                          <img
                            src={country.flag}
                            alt={country.name}
                            style={{
                              width: "80%",
                              height: "80%",
                              objectFit: "cover",
                              borderRadius: "50%",
                            }}
                          />
                        </div>
                      </div>

                      {/* CONTENT */}

                      <div className="col-md-7">

                        <div className="p-4 d-flex flex-column h-100">

                          {/* COUNTRY NAME */}

                          <h3
                            className="fw-bold text-white mb-3"
                          >
                            {country.name}
                          </h3>

                          {/* DESCRIPTION */}

                          <p
                            style={{

                              color:
                                "rgba(255,255,255,0.72)",

                              lineHeight: "1.9",

                              fontSize: "15px",

                            }}
                          >

                            {country.description}

                          </p>

                          {/* BUTTON */}

                          <div className="mt-auto">

                            <Link

                              to={`/study-abroad/${country.slug}`}

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

                              Learn More

                            </Link>

                          </div>

                        </div>

                      </div>

                    </div>

                  </motion.div>

                </div>

              ))
            }

          </div>

        </div>

      </section>

      {/* Premium Process Section */}
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
              OUR PROCESS
            </span>

            <h2
              className="fw-bold text-white"
              style={{
                fontSize:
                  "clamp(2rem,5vw,4rem)",

                lineHeight: "1.2",
              }}
            >

              Your Journey To

              <span style={{ color: "#ffc107" }}>
                {" "}Study Abroad
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
              We simplify your international education
              journey with a smooth step-by-step process
              from consultation to visa approval.
            </p>

          </motion.div>

          {/* PROCESS TIMELINE */}

          <div className="position-relative mt-5">

            {/* FLIGHT LINE */}

            <div
              className="d-none d-lg-block"
              style={{

                position: "absolute",

                top: "80px",

                left: "8%",

                right: "8%",

                height: "4px",

                background:
                  "linear-gradient(90deg,#ffc107,#ffb300)",

                borderRadius: "20px",

                zIndex: 1,

              }}
            />

            {/* MOVING FLIGHT */}

            <motion.div

              className="d-none d-lg-block"

              animate={{
                left: ["8%", "88%"],
              }}

              transition={{
                duration: 8,
                repeat: Infinity,
                repeatDelay: 1,
                ease: "easeInOut",
              }}

              style={{

                position: "absolute",

                top: "45px",

                zIndex: 3,

                fontSize: "40px",

                color: "#ffc107",

                transform: "translateX(-50%)",

              }}
            >

              ✈️

            </motion.div>

            <div className="row g-4 position-relative" style={{ zIndex: 2 }}>

              {

                process.map((step, index) => (

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

                      className="position-relative text-center h-100 p-4"

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

                      {/* GLOW */}

                      <div
                        style={{
                          position: "absolute",

                          width: "100px",

                          height: "100px",

                          background:
                            "rgba(255,193,7,0.15)",

                          borderRadius: "50%",

                          filter: "blur(70px)",

                          top: "-30px",

                          right: "-30px",
                        }}
                      />

                      {/* STEP NUMBER */}

                      <motion.div

                        animate={{
                          scale: [1, 1.08, 1],
                        }}

                        transition={{
                          duration: 3,
                          repeat: Infinity,
                        }}

                        className="mx-auto mb-4 d-flex align-items-center justify-content-center"

                        style={{

                          width: "85px",

                          height: "85px",

                          borderRadius: "50%",

                          background:
                            "linear-gradient(135deg,#ffc107,#ffb300)",

                          color: "#111",

                          fontSize: "28px",

                          fontWeight: "700",

                          boxShadow:
                            "0 10px 25px rgba(255,193,7,0.35)",

                        }}
                      >

                        {step.step}

                      </motion.div>

                      {/* ICON */}

                      <motion.div

                        whileHover={{
                          rotate: 10,
                          scale: 1.1,
                        }}

                        transition={{
                          duration: 0.3,
                        }}

                        className="mb-4"

                        style={{

                          fontSize: "45px",

                          color: "#ffc107",

                        }}
                      >

                        {step.icon}

                      </motion.div>

                      {/* TITLE */}

                      <h4
                        className="fw-bold text-white mb-3"
                      >
                        {step.title}
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

                        {step.description}

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
              START YOUR JOURNEY
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

              Ready To Achieve Your

              <span style={{ color: "#ffc107" }}>
                {" "}Study Abroad Dream?
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
              Get expert guidance from our experienced
              counselors and take the first step toward
              your international education journey with
              complete support at every stage.
            </p>

            {/* BUTTONS */}

            <div
              className="d-flex flex-wrap justify-content-center gap-3"
            >

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
                      "15px 36px",

                    borderRadius: "18px",

                    fontWeight: "700",

                    border: "none",

                    boxShadow:
                      "0 10px 25px rgba(255,193,7,0.35)",

                  }}
                >

                  Free Consultation

                </Link>

              </motion.div>

              <motion.div

                whileHover={{
                  scale: 1.05,
                }}

                whileTap={{
                  scale: 0.95,
                }}
              >

                <Link

                  to="/courses"

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

                  View Courses

                </Link>

              </motion.div>

            </div>

            {/* STATS */}

            <div className="row mt-5 g-4">

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
                    label: "Visa Success Rate",
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

export default StudyAbroad;