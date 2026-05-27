import { motion } from 'framer-motion';
import { Link, useParams } from "react-router-dom";
import {
  FaUniversity,
  FaCheckCircle,
  FaGraduationCap,
  FaGlobe,
  FaBookOpen
} from "react-icons/fa";

import {
  studyAbroadCountries
} from "../data/studyAbroad";

const About = () => {

  const { countryName } = useParams();

  const country = studyAbroadCountries.find(
    (c) => c.slug === countryName
  );

  if (!country) {
    return (
      <div className="text-white text-center py-5">
        Country not found
      </div>
    );
  }

  return (
    <div className="bg-black text-light">
      {/* Hero Section */}
      <section
        className="position-relative py-5 overflow-hidden"
        style={{
          minHeight: "90vh",
          background:
            "linear-gradient(135deg,#050505,#0f172a,#111827)",
          display: "flex",
          alignItems: "center",
        }}
      >

        {/* Gold Glow Effects */}

        <div
          style={{
            position: "absolute",
            top: "-120px",
            left: "-120px",
            width: "350px",
            height: "350px",
            background: "rgba(255,193,7,0.15)",
            borderRadius: "50%",
            filter: "blur(120px)",
          }}
        />

        <div
          style={{
            position: "absolute",
            bottom: "-120px",
            right: "-120px",
            width: "320px",
            height: "320px",
            background: "rgba(255,193,7,0.12)",
            borderRadius: "50%",
            filter: "blur(120px)",
          }}
        />

        <div className="container position-relative">

          <div className="row align-items-center g-5">

            {/* LEFT CONTENT */}

            <div className="col-md-6 text-center text-md-start">

              <motion.div
                initial={{ opacity: 0, x: -80 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >

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
                  STUDY ABROAD PROGRAM
                </span>

                <motion.div
                  animate={{
                    y: [0, -12, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                  }}
                  style={{
                    fontSize: "5rem",
                  }}
                >
                  <img
                    src={country.flag}
                    alt={country.name}
                    style={{
                      width: "30%",
                      height: "50%",
                      objectFit: "cover",
                      borderRadius: "50%",
                    }}
                  />
                </motion.div>

                <h1
                  className="fw-bold mb-4"
                  style={{
                    color: "#fff",
                    fontSize:
                      "clamp(2.8rem,6vw,5rem)",
                    lineHeight: "1.2",
                  }}
                >
                  Study In
                  <span style={{ color: "#ffc107" }}>
                    {" "}{country.name}
                  </span>
                </h1>

                <p
                  className="mb-4"
                  style={{
                    fontSize: "1.1rem",
                    color:
                      "rgba(255,255,255,0.75)",
                    lineHeight: "2",
                  }}
                >
                  Explore top universities,
                  admissions guidance and visa
                  support in {country.name}.
                </p>

                <div className="d-flex gap-3 flex-wrap justify-content-center justify-content-md-start">

                  <Link
                    to="/contact"
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
                    Contact Advisor
                  </Link>

                  <Link
                    to="/study-abroad"
                    className="btn"
                    style={{
                      background:
                        "rgba(255,255,255,0.06)",
                      color: "#fff",
                      padding: "14px 34px",
                      borderRadius: "16px",
                      border:
                        "1px solid rgba(255,255,255,0.08)",
                      backdropFilter: "blur(12px)",
                    }}
                  >
                    Explore Countries
                  </Link>

                </div>

              </motion.div>

            </div>

            {/* RIGHT IMAGE */}

            <div className="col-md-6 text-center">

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                whileHover={{
                  scale: 1.03,
                }}
                className="position-relative"
              >

                <img
                  src={country.image}
                  alt={`Study in ${country.name}`}
                  className="img-fluid"
                  style={{
                    borderRadius: "35px",
                    border:
                      "2px solid rgba(255,193,7,0.18)",
                    boxShadow:
                      "0 25px 60px rgba(0,0,0,0.45)",
                    objectFit: "cover",
                    width: "100%",
                    height: "550px",
                  }}
                />

                {/* Floating Card */}

                <motion.div
                  animate={{
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                  }}
                  className="position-absolute p-4"
                  style={{
                    bottom: "20px",
                    left: "-20px",
                    borderRadius: "24px",
                    background:
                      "rgba(255,255,255,0.08)",
                    backdropFilter: "blur(14px)",
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

              </motion.div>

            </div>

          </div>

        </div>

      </section>

      {/* At a Glance Section */}
      <section
        className="py-5 position-relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg,#050505,#0f172a,#111827)",
        }}
      >

        {/* Background Glow */}

        <div
          style={{
            position: "absolute",
            top: "-80px",
            right: "-100px",
            width: "250px",
            height: "250px",
            background: "rgba(255,193,7,0.12)",
            borderRadius: "50%",
            filter: "blur(120px)",
          }}
        />

        <div className="container position-relative">

          {/* Heading */}

          <div className="row mb-5">

            <div className="col-lg-8 mx-auto text-center">

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                viewport={{ once: true }}
              >

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
                  QUICK OVERVIEW
                </span>

                <h2
                  className="fw-bold mb-3"
                  style={{
                    color: "#fff",
                    fontSize:
                      "clamp(2rem,5vw,4rem)",
                  }}
                >
                  At A
                  <span style={{ color: "#ffc107" }}>
                    {" "}Glance
                  </span>
                </h2>

                <p
                  style={{
                    color:
                      "rgba(255,255,255,0.72)",
                    fontSize: "1.05rem",
                  }}
                >
                  Key statistics about studying in{" "}
                  {country.name}
                </p>

              </motion.div>

            </div>

          </div>

          {/* Stats Cards — all data from studyAbroad.js */}

          <div className="row">

            {[
              {
                icon: <FaUniversity />,
                number: country.universitiesCount,
                text: (country.statsLabels && country.statsLabels[0]) || "Universities & Colleges",
              },
              {
                icon: <FaGraduationCap />,
                number: country.students,
                text: (country.statsLabels && country.statsLabels[1]) || "International Students",
              },
              {
                icon: <FaBookOpen />,
                number: country.programs,
                text: (country.statsLabels && country.statsLabels[2]) || "Study Programs",
              },
              {
                icon: <FaCheckCircle />,
                number: country.employment,
                text: (country.statsLabels && country.statsLabels[3]) || "Employment Rate",
              },
            ].map((item, index) => (

              <div
                key={index}
                className="col-lg-3 col-md-6 mb-4"
              >

                <motion.div

                  initial={{
                    opacity: 0,
                    y: 40,
                  }}

                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}

                  whileHover={{
                    y: -12,
                    scale: 1.04,
                  }}

                  transition={{
                    delay: index * 0.1,
                    duration: 0.5,
                  }}

                  viewport={{
                    once: true,
                  }}

                  className="h-100 text-center p-4"

                  style={{

                    background:
                      "rgba(255,255,255,0.05)",

                    borderRadius: "28px",

                    backdropFilter:
                      "blur(14px)",

                    border:
                      "1px solid rgba(255,255,255,0.08)",

                    boxShadow:
                      "0 15px 35px rgba(0,0,0,0.25)",

                    transition: "0.4s ease",

                  }}
                >

                  {/* Icon */}

                  <motion.div

                    animate={{
                      y: [0, -6, 0],
                    }}

                    transition={{
                      duration: 3,
                      repeat: Infinity,
                    }}

                    className="d-flex align-items-center justify-content-center mx-auto mb-4"

                    style={{

                      width: "90px",

                      height: "90px",

                      borderRadius: "50%",

                      background:
                        "linear-gradient(135deg,#ffc107,#ffb300)",

                      color: "#111",

                      fontSize: "36px",

                      boxShadow:
                        "0 10px 25px rgba(255,193,7,0.35)",

                    }}
                  >
                    {item.icon}
                  </motion.div>

                  {/* Number */}

                  <h2
                    className="fw-bold mb-2"
                    style={{
                      color: "#fff",
                    }}
                  >
                    {item.number}
                  </h2>

                  {/* Text */}

                  <p
                    className="mb-0"
                    style={{
                      color:
                        "rgba(255,255,255,0.72)",
                      lineHeight: "1.7",
                    }}
                  >
                    {item.text}
                  </p>

                </motion.div>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* Top Reasons Section */}

      <section
        className="py-5 position-relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg,#050505,#111827,#0f172a)",
        }}
      >

        {/* Background Glow */}

        <div
          style={{
            position: "absolute",
            top: "-100px",
            left: "-100px",
            width: "280px",
            height: "280px",
            background: "rgba(255,193,7,0.12)",
            borderRadius: "50%",
            filter: "blur(120px)",
          }}
        />

        <div className="container position-relative">

          {/* Heading */}

          <div className="row mb-5">

            <div className="col-lg-8 mx-auto text-center">

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                viewport={{ once: true }}
              >

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
                  WHY CHOOSE {country.name.toUpperCase()}
                </span>

                <h2
                  className="fw-bold mb-3"
                  style={{
                    color: "#fff",
                    fontSize:
                      "clamp(2rem,5vw,4rem)",
                  }}
                >
                  Top Reasons To
                  <span style={{ color: "#ffc107" }}>
                    {" "}Study Abroad
                  </span>
                </h2>

                <p
                  style={{
                    color:
                      "rgba(255,255,255,0.72)",
                    fontSize: "1.05rem",
                    lineHeight: "1.8",
                  }}
                >
                  Globally renowned universities,
                  innovation hubs and career
                  opportunities in {country.name}.
                </p>

              </motion.div>

            </div>

          </div>

          {/* Reason Cards — data from studyAbroad.js */}

          <div className="row">

            {(country.reasons || [
              {
                title: "World-Class Education",
                description: "High-ranking universities and cutting-edge academic excellence.",
              },
              {
                title: "Innovation & Research",
                description: "Access to pioneering research labs and industry partnerships.",
              },
              {
                title: "Career Prospects",
                description: "Strong job market and global corporate opportunities for graduates.",
              },
              {
                title: "Cultural Diversity",
                description: "Experience vibrant international student communities and lifestyles.",
              },
            ]).map((item, index) => (

              <div
                key={index}
                className="col-lg-3 col-md-6 mb-4"
              >

                <motion.div

                  initial={{
                    opacity: 0,
                    y: 40,
                  }}

                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}

                  whileHover={{
                    y: -12,
                    scale: 1.04,
                  }}

                  transition={{
                    delay: index * 0.1,
                    duration: 0.5,
                  }}

                  viewport={{
                    once: true,
                  }}

                  className="h-100 text-center p-4 position-relative overflow-hidden"

                  style={{

                    background:
                      "rgba(255,255,255,0.05)",

                    borderRadius: "30px",

                    backdropFilter:
                      "blur(14px)",

                    border:
                      "1px solid rgba(255,255,255,0.08)",

                    boxShadow:
                      "0 15px 35px rgba(0,0,0,0.25)",

                    transition: "0.4s ease",

                  }}
                >

                  {/* Gold Glow */}

                  <div
                    style={{
                      position: "absolute",
                      top: "-40px",
                      right: "-40px",
                      width: "120px",
                      height: "120px",
                      background:
                        "rgba(255,193,7,0.12)",
                      borderRadius: "50%",
                      filter: "blur(40px)",
                    }}
                  />

                  {/* Icon */}

                  <motion.div

                    animate={{
                      y: [0, -6, 0],
                    }}

                    transition={{
                      duration: 3,
                      repeat: Infinity,
                    }}

                    className="d-flex align-items-center justify-content-center mx-auto mb-4"

                    style={{

                      width: "90px",

                      height: "90px",

                      borderRadius: "50%",

                      background:
                        "linear-gradient(135deg,#ffc107,#ffb300)",

                      color: "#111",

                      fontSize: "36px",

                      boxShadow:
                        "0 10px 25px rgba(255,193,7,0.35)",

                    }}
                  >
                    {[<FaGraduationCap />, <FaUniversity />, <FaCheckCircle />, <FaGlobe />][index % 4]}
                  </motion.div>

                  {/* Title */}

                  <h4
                    className="fw-bold mb-3"
                    style={{
                      color: "#fff",
                    }}
                  >
                    {item.title}
                  </h4>

                  {/* Description */}

                  <p
                    className="mb-0"
                    style={{
                      color:
                        "rgba(255,255,255,0.72)",
                      lineHeight: "1.8",
                      fontSize: "15px",
                    }}
                  >
                    {item.description}
                  </p>

                </motion.div>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* Top Universities Section */}

      <section
        className="py-5 position-relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg,#050505,#0f172a,#111827)",
        }}
      >

        {/* Background Glow */}

        <div
          style={{
            position: "absolute",
            bottom: "-100px",
            right: "-100px",
            width: "300px",
            height: "300px",
            background: "rgba(255,193,7,0.12)",
            borderRadius: "50%",
            filter: "blur(120px)",
          }}
        />

        <div className="container position-relative">

          {/* Heading */}

          <div className="row mb-5">

            <div className="col-lg-8 mx-auto text-center">

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                viewport={{ once: true }}
              >

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
                  TOP RANKED UNIVERSITIES
                </span>

                <h2
                  className="fw-bold mb-3"
                  style={{
                    color: "#fff",
                    fontSize:
                      "clamp(2rem,5vw,4rem)",
                  }}
                >
                  Study At The Best
                  <span style={{ color: "#ffc107" }}>
                    {" "}Universities
                  </span>
                </h2>

                <p
                  style={{
                    color:
                      "rgba(255,255,255,0.72)",
                    fontSize: "1.05rem",
                    lineHeight: "1.8",
                  }}
                >
                  Explore globally recognized
                  universities in {country.name}
                  offering world-class education
                  and career opportunities.
                </p>

              </motion.div>

            </div>

          </div>

          {/* University Cards */}

          <div className="row">

            {country.topUniversities.map((uni, idx) => (

              <div
                key={idx}
                className="col-md-6 col-lg-4 mb-4"
              >

                <motion.div

                  initial={{
                    opacity: 0,
                    y: 40,
                  }}

                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}

                  whileHover={{
                    y: -12,
                    scale: 1.03,
                  }}

                  transition={{
                    delay: 0.2 + idx * 0.1,
                    duration: 0.5,
                  }}

                  viewport={{
                    once: true,
                  }}

                  className="h-100 p-4 text-center position-relative overflow-hidden"

                  style={{

                    borderRadius: "30px",

                    border:
                      "1px solid rgba(255,255,255,0.08)",

                    background:
                      "rgba(255,255,255,0.05)",

                    backdropFilter:
                      "blur(14px)",

                    boxShadow:
                      "0 15px 35px rgba(0,0,0,0.25)",

                  }}
                >

                  {/* Gold Glow */}

                  <div
                    style={{
                      position: "absolute",
                      top: "-40px",
                      right: "-40px",
                      width: "120px",
                      height: "120px",
                      background:
                        "rgba(255,193,7,0.12)",
                      borderRadius: "50%",
                      filter: "blur(40px)",
                    }}
                  />

                  {/* University Logo */}

                  <motion.img

                    src={uni.logo}

                    alt={`${uni.name} logo`}

                    animate={{
                      y: [0, -6, 0],
                    }}

                    transition={{
                      duration: 3,
                      repeat: Infinity,
                    }}

                    style={{

                      width: "110px",

                      height: "110px",

                      margin:
                        "0 auto 20px",

                      display: "block",

                      borderRadius: "50%",

                      padding: "10px",

                      background: "#fff",

                      objectFit: "contain",

                      boxShadow:
                        "0 10px 25px rgba(255,193,7,0.25)",

                    }}
                  />

                  {/* University Name */}

                  <h4
                    className="fw-bold mb-3"
                    style={{
                      color: "#fff",
                      lineHeight: "1.5",
                    }}
                  >
                    {uni.name}
                  </h4>

                  {/* Description */}

                  <p
                    style={{
                      color:
                        "rgba(255,255,255,0.72)",
                      lineHeight: "1.8",
                      fontSize: "15px",
                      minHeight: "80px",
                    }}
                  >
                    {uni.description}
                  </p>

                  {/* Button */}

                  <a
                    href={uni.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn mt-3"
                    style={{
                      background:
                        "linear-gradient(135deg,#ffc107,#ffb300)",
                      color: "#111",
                      padding: "12px 24px",
                      borderRadius: "14px",
                      fontWeight: "700",
                      border: "none",
                      boxShadow:
                        "0 10px 25px rgba(255,193,7,0.25)",
                    }}
                  >
                    Visit University
                  </a>

                </motion.div>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* Eligibility Criteria Section */}

      <section
        className="py-5 position-relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg,#050505,#111827,#0f172a)",
        }}
      >

        {/* Background Glow */}

        <div
          style={{
            position: "absolute",
            top: "-100px",
            right: "-100px",
            width: "280px",
            height: "280px",
            background: "rgba(255,193,7,0.12)",
            borderRadius: "50%",
            filter: "blur(120px)",
          }}
        />

        <div className="container position-relative">

          {/* Heading */}

          <div className="row mb-5">

            <div className="col-lg-8 mx-auto text-center">

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                viewport={{ once: true }}
              >

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
                  ADMISSION REQUIREMENTS
                </span>

                <h2
                  className="fw-bold mb-3"
                  style={{
                    color: "#fff",
                    fontSize:
                      "clamp(2rem,5vw,4rem)",
                  }}
                >
                  Eligibility
                  <span style={{ color: "#ffc107" }}>
                    {" "}Criteria
                  </span>
                </h2>

                <p
                  style={{
                    color:
                      "rgba(255,255,255,0.72)",
                    fontSize: "1.05rem",
                    lineHeight: "1.8",
                  }}
                >
                  Check the admission requirements
                  for studying in {country.name}.
                </p>

              </motion.div>

            </div>

          </div>

          {/* Eligibility Cards */}

          <div className="row">

            {country.eligibility.map((item, idx) => (

              <div
                key={idx}
                className="col-lg-6 mb-4"
              >

                <motion.div

                  initial={{
                    opacity: 0,
                    y: 30,
                  }}

                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}

                  whileHover={{
                    y: -6,
                    scale: 1.02,
                  }}

                  transition={{
                    delay: 0.1 + idx * 0.05,
                    duration: 0.4,
                  }}

                  viewport={{
                    once: true,
                  }}

                  className="d-flex align-items-center gap-4 p-4 position-relative overflow-hidden"

                  style={{

                    background:
                      "rgba(255,255,255,0.05)",

                    borderRadius: "24px",

                    backdropFilter:
                      "blur(14px)",

                    border:
                      "1px solid rgba(255,255,255,0.08)",

                    boxShadow:
                      "0 15px 35px rgba(0,0,0,0.25)",

                  }}
                >

                  {/* Gold Glow */}

                  <div
                    style={{
                      position: "absolute",
                      top: "-30px",
                      right: "-30px",
                      width: "100px",
                      height: "100px",
                      background:
                        "rgba(255,193,7,0.12)",
                      borderRadius: "50%",
                      filter: "blur(35px)",
                    }}
                  />

                  {/* Icon */}

                  <motion.div

                    animate={{
                      y: [0, -4, 0],
                    }}

                    transition={{
                      duration: 3,
                      repeat: Infinity,
                    }}

                    className="flex-shrink-0 d-flex align-items-center justify-content-center"

                    style={{

                      width: "65px",

                      height: "65px",

                      borderRadius: "50%",

                      background:
                        "linear-gradient(135deg,#ffc107,#ffb300)",

                      color: "#111",

                      fontSize: "24px",

                      boxShadow:
                        "0 10px 25px rgba(255,193,7,0.35)",

                    }}
                  >
                    <FaCheckCircle />
                  </motion.div>

                  {/* Text */}

                  <p
                    className="mb-0 fw-medium"

                    style={{
                      color: "#fff",
                      lineHeight: "1.8",
                      fontSize: "16px",
                    }}
                  >
                    {item}
                  </p>

                </motion.div>

              </div>

            ))}

          </div>

        </div>

      </section>


      {/* Call To Action Section */}

      <section
        className="py-5 position-relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg,#050505,#0f172a,#111827)",
        }}
      >

        {/* Background Glow */}

        <div
          style={{
            position: "absolute",
            top: "-100px",
            left: "-100px",
            width: "280px",
            height: "280px",
            background: "rgba(255,193,7,0.15)",
            borderRadius: "50%",
            filter: "blur(120px)",
          }}
        />

        <div
          style={{
            position: "absolute",
            bottom: "-100px",
            right: "-100px",
            width: "260px",
            height: "260px",
            background: "rgba(255,193,7,0.12)",
            borderRadius: "50%",
            filter: "blur(120px)",
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

            className="text-center mx-auto position-relative overflow-hidden p-5"

            style={{

              maxWidth: "950px",

              background:
                "rgba(255,255,255,0.05)",

              borderRadius: "35px",

              backdropFilter:
                "blur(14px)",

              border:
                "1px solid rgba(255,255,255,0.08)",

              boxShadow:
                "0 20px 45px rgba(0,0,0,0.35)",

            }}
          >

            {/* Gold Glow */}

            <div
              style={{
                position: "absolute",
                top: "-40px",
                right: "-40px",
                width: "160px",
                height: "160px",
                background:
                  "rgba(255,193,7,0.15)",
                borderRadius: "50%",
                filter: "blur(60px)",
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
              FREE STUDY ABROAD CONSULTATION
            </span>

            {/* Heading */}

            <h2
              className="fw-bold mb-4"
              style={{
                color: "#fff",
                fontSize:
                  "clamp(2rem,5vw,4rem)",
                lineHeight: "1.3",
              }}
            >
              Need Personalized
              <span style={{ color: "#ffc107" }}>
                {" "}Guidance?
              </span>
            </h2>

            {/* Text */}

            <p
              className="mx-auto mb-5"
              style={{
                color:
                  "rgba(255,255,255,0.72)",
                maxWidth: "700px",
                lineHeight: "2",
                fontSize: "1.05rem",
              }}
            >
              Contact our education experts
              for complete assistance with
              university applications,
              scholarships, documentation,
              and visa processing for
              studying in {country.name}.
            </p>

            {/* Buttons */}

            <div className="d-flex justify-content-center gap-3 flex-wrap">

              <Link
                to="/contact"
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
                Contact Us
              </Link>

              <Link
                to="/study-abroad"
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
                Explore More Countries
              </Link>

            </div>

          </motion.div>

        </div>

      </section>
    </div>
  );
};

export default About;





































// import React from 'react';
// import { Link, useParams } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import { getCountryBySlug } from '../data/studyAbroad';

// const CountryDetail = () => {
//   const { countryName } = useParams();
//   const country = getCountryBySlug(countryName?.toLowerCase());

//   const fadeInUp = {
//     initial: { opacity: 0, y: 50 },
//     animate: { opacity: 1, y: 0 },
//     transition: { duration: 0.6 }
//   };

//   if (!country) {
//     return (
//       <div className="container py-5">
//         <motion.div {...fadeInUp} className="text-center">
//           <h1 className="display-5 fw-bold mb-3">Country not found</h1>
//           <p className="lead text-muted mb-4">Please choose a destination from our study abroad page.</p>
//           <Link to="/study-abroad" className="btn btn-primary btn-lg">
//             Back to Destinations
//           </Link>
//         </motion.div>
//       </div>
//     );
//   }

//   return (
//     <div className="country-detail-page">
//       <section className="hero-section bg-primary text-white py-5">
//         <div className="container">
//           <motion.div {...fadeInUp} className="row align-items-center">
//             <div className="col-lg-7">
//               <span className="fs-1 d-inline-block mb-3">{country.flag}</span>
//               <h1 className="display-4 fw-bold mb-3">Study in {country.name}</h1>
//               <p className="lead mb-4">{country.heroText}</p>
//               <p className="mb-4">{country.description}</p>
//               <div className="d-flex gap-3 flex-wrap">
//                 <Link to="/study-abroad" className="btn btn-light btn-lg">
//                   Back to Destinations
//                 </Link>
//                 <Link to="/contact" className="btn btn-outline-light btn-lg">
//                   Book a Consultation
//                 </Link>
//               </div>
//             </div>
//             <div className="col-lg-5 mt-4 mt-lg-0">
//               <img
//                 src={country.image}
//                 alt={country.name}
//                 className="img-fluid rounded shadow"
//                 style={{ maxHeight: '420px', objectFit: 'cover', width: '100%' }}
//               />
//             </div>
//           </motion.div>
//         </div>
//       </section>

//       <section className="py-5">
//         <div className="container">
//           <motion.div {...fadeInUp} className="row gy-4">
//             <div className="col-lg-4">
//               <div className="card border-0 shadow-sm h-100 p-4">
//                 <h5 className="fw-bold mb-3">At a Glance</h5>
//                 <p className="text-muted mb-2">Universities</p>
//                 <strong className="d-block mb-3">{country.universities}</strong>
//                 <p className="text-muted mb-2">Average Cost</p>
//                 <strong className="d-block mb-3">{country.avgCost}</strong>
//                 <p className="text-muted mb-2">Popular Courses</p>
//                 <strong className="d-block text-primary">{country.popularCourses}</strong>
//               </div>
//             </div>
//             <div className="col-lg-8">
//               <div className="card border-0 shadow-sm h-100 p-4">
//                 <h5 className="fw-bold mb-3">Why {country.name}?</h5>
//                 <ul className="list-unstyled mb-0">
//                   {country.whyStudy && (
//                     <li className="mb-3">
//                       <span className="fw-bold me-2">•</span>
//                       <span>{country.whyStudy}</span>
//                     </li>
//                   )}
//                 </ul>
//               </div>
//             </div>
//           </motion.div>
//         </div>
//       </section>
    

//     {/* Top Reasons */}
//       <section className="py-5">
//         <div className="container">
//           <motion.div {...fadeInUp}>
//             <h2 className="fw-bold text-center mb-5">
//               Top Reasons to Study in {country.name}
//             </h2>

//             <div className="row">
//               {country.reasons?.map((reason, index) => (
//                 <div
//                   key={index}
//                   className="col-lg-6 mb-4"
//                 >
//                   <div className="card border-0 shadow-sm h-100 p-4">
//                     <h4 className="fw-bold mb-3">
//                       {reason.title}
//                     </h4>

//                     <p className="text-muted mb-0">
//                       {reason.description}
//                     </p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </motion.div>
//         </div>
//       </section>


//     {/* Top Universities */}
//       <section className="bg-light py-5">
//         <div className="container">
//           <motion.div {...fadeInUp}>
//             <h2 className="fw-bold text-center mb-5">
//               Top Universities in {country.name}
//             </h2>

//             <div className="row">
//               {country.topUniversities?.map((uni, index) => (
//                 <div key={index} className="col-md-4 mb-4">
//                   <div className="card border-0 shadow-sm h-100 p-4 text-center">
//                     <h5 className="fw-bold">{uni}</h5>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </motion.div>
//         </div>
//       </section>

//     {/* Eligibility */}
//       <section className="py-5">
//         <div className="container">
//           <motion.div {...fadeInUp}>
//             <h2 className="fw-bold mb-4">
//               Eligibility Criteria
//             </h2>

//             <div className="card border-0 shadow-sm p-4">
//               <ul className="mb-0">
//                 {country.eligibility?.map((item, index) => (
//                   <li key={index} className="mb-3">
//                     {item}
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           </motion.div>
//         </div>
//       </section>



//     {/* CTA */}
//       <section className="bg-primary text-white py-5">
//         <div className="container text-center">
//           <motion.div {...fadeInUp}>
//             <h2 className="display-6 fw-bold mb-3">
//               Start Your Journey to {country.name}
//             </h2>

//             <p className="lead mb-4">
//               Get expert guidance from Outlook Edu Services.
//             </p>

//             <Link
//               to="/contact"
//               className="btn btn-light btn-lg"
//             >
//               Book Free Consultation
//             </Link>
//           </motion.div>
//         </div>
//       </section>


//     </div>
//   );
// };

// export default CountryDetail;
