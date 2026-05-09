import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getCountryBySlug } from '../data/studyAbroad';

const CountryDetail = () => {
  const { countryName } = useParams();
  const country = getCountryBySlug(countryName?.toLowerCase());

  const fadeInUp = {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  if (!country) {
    return (
      <div className="container py-5">
        <motion.div {...fadeInUp} className="text-center">
          <h1 className="display-5 fw-bold mb-3">Country not found</h1>
          <p className="lead text-muted mb-4">Please choose a destination from our study abroad page.</p>
          <Link to="/study-abroad" className="btn btn-primary btn-lg">
            Back to Destinations
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="country-detail-page">
      <section className="hero-section bg-primary text-white py-5">
        <div className="container">
          <motion.div {...fadeInUp} className="row align-items-center">
            <div className="col-lg-7">
              <span className="fs-1 d-inline-block mb-3">{country.flag}</span>
              <h1 className="display-4 fw-bold mb-3">Study in {country.name}</h1>
              <p className="lead mb-4">{country.heroText}</p>
              <p className="mb-4">{country.description}</p>
              <div className="d-flex gap-3 flex-wrap">
                <Link to="/study-abroad" className="btn btn-light btn-lg">
                  Back to Destinations
                </Link>
                <Link to="/contact" className="btn btn-outline-light btn-lg">
                  Book a Consultation
                </Link>
              </div>
            </div>
            <div className="col-lg-5 mt-4 mt-lg-0">
              <img
                src={country.image}
                alt={country.name}
                className="img-fluid rounded shadow"
                style={{ maxHeight: '420px', objectFit: 'cover', width: '100%' }}
              />
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-5">
        <div className="container">
          <motion.div {...fadeInUp} className="row gy-4">
            <div className="col-lg-4">
              <div className="card border-0 shadow-sm h-100 p-4">
                <h5 className="fw-bold mb-3">At a Glance</h5>
                <p className="text-muted mb-2">Universities</p>
                <strong className="d-block mb-3">{country.universities}</strong>
                <p className="text-muted mb-2">Average Cost</p>
                <strong className="d-block mb-3">{country.avgCost}</strong>
                <p className="text-muted mb-2">Popular Courses</p>
                <strong className="d-block text-primary">{country.popularCourses}</strong>
              </div>
            </div>
            <div className="col-lg-8">
              <div className="card border-0 shadow-sm h-100 p-4">
                <h5 className="fw-bold mb-3">Why {country.name}?</h5>
                <ul className="list-unstyled mb-0">
                  {country.whyStudy && (
                    <li className="mb-3">
                      <span className="fw-bold me-2">•</span>
                      <span>{country.whyStudy}</span>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    

    {/* Top Reasons */}
      <section className="py-5">
        <div className="container">
          <motion.div {...fadeInUp}>
            <h2 className="fw-bold text-center mb-5">
              Top Reasons to Study in {country.name}
            </h2>

            <div className="row">
              {country.reasons?.map((reason, index) => (
                <div
                  key={index}
                  className="col-lg-6 mb-4"
                >
                  <div className="card border-0 shadow-sm h-100 p-4">
                    <h4 className="fw-bold mb-3">
                      {reason.title}
                    </h4>

                    <p className="text-muted mb-0">
                      {reason.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>


    {/* Top Universities */}
      <section className="bg-light py-5">
        <div className="container">
          <motion.div {...fadeInUp}>
            <h2 className="fw-bold text-center mb-5">
              Top Universities in {country.name}
            </h2>

            <div className="row">
              {country.topUniversities?.map((uni, index) => (
                <div key={index} className="col-md-4 mb-4">
                  <div className="card border-0 shadow-sm h-100 p-4 text-center">
                    <h5 className="fw-bold">{uni}</h5>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

    {/* Eligibility */}
      <section className="py-5">
        <div className="container">
          <motion.div {...fadeInUp}>
            <h2 className="fw-bold mb-4">
              Eligibility Criteria
            </h2>

            <div className="card border-0 shadow-sm p-4">
              <ul className="mb-0">
                {country.eligibility?.map((item, index) => (
                  <li key={index} className="mb-3">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </section>



    {/* CTA */}
      <section className="bg-primary text-white py-5">
        <div className="container text-center">
          <motion.div {...fadeInUp}>
            <h2 className="display-6 fw-bold mb-3">
              Start Your Journey to {country.name}
            </h2>

            <p className="lead mb-4">
              Get expert guidance from Outlook Edu Services.
            </p>

            <Link
              to="/contact"
              className="btn btn-light btn-lg"
            >
              Book Free Consultation
            </Link>
          </motion.div>
        </div>
      </section>


    </div>
  );
};

export default CountryDetail;
