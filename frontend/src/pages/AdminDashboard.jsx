import React, {
  useEffect,
  useState
} from "react";

import {
  motion
} from "framer-motion";

import {

  FaUsers,

  FaBookOpen,

  FaNewspaper,

  FaMoneyBillWave,

  FaClock,

  FaCheckCircle

} from "react-icons/fa";

import AdminSidebar
  from "../components/AdminSidebar";

import {
  dashboardAPI
} from "../services/api";


const AdminDashboard = () => {

  const [stats, setStats] =
    useState({

      totalRegistrations: 0,

      totalCourses: 0,

      totalBlogs: 0,

      paidRegistrations: 0,

      pendingRegistrations: 0,

      recentRegistrations: []

    });

  const [loading, setLoading] =
    useState(true);


  useEffect(() => {

    fetchDashboardData();

  }, []);


  // FETCH DASHBOARD
  const fetchDashboardData =
    async () => {

    try {

      const response =
        await dashboardAPI
          .getStats();

      if (response.success) {

        setStats(
          response.data
        );

      }

    }

    catch (error) {

      console.error(error);

    }

    finally {

      setLoading(false);

    }

  };


  const statCards = [

    {

      title:
        "Total Registrations",

      value:
        stats.totalRegistrations,

      icon:
        <FaUsers />,

      color:
        "primary"

    },

    {

      title:
        "Total Courses",

      value:
        stats.totalCourses,

      icon:
        <FaBookOpen />,

      color:
        "success"

    },

    {

      title:
        "Total Blogs",

      value:
        stats.totalBlogs,

      icon:
        <FaNewspaper />,

      color:
        "info"

    },

    {

      title:
        "Paid Registrations",

      value:
        stats.paidRegistrations,

      icon:
        <FaCheckCircle />,

      color:
        "success"

    },

    {

      title:
        "Pending Registrations",

      value:
        stats.pendingRegistrations,

      icon:
        <FaClock />,

      color:
        "warning"

    }

  ];


  return (

    <div className="d-flex">

      <AdminSidebar />

      <div
        className="flex-grow-1 bg-light p-4"
        style={{
          minHeight: "100vh"
        }}
      >

        <motion.div

          initial={{
            opacity: 0,
            y: 30
          }}

          animate={{
            opacity: 1,
            y: 0
          }}

        >

          <h1 className="fw-bold mb-4">

            Admin Dashboard

          </h1>

        </motion.div>


        {/* STATS */}
        <div className="row mb-5">

          {
            statCards.map(
              (
                stat,
                index
              ) => (

                <motion.div

                  key={index}

                  className="col-lg-3 col-md-6 mb-4"

                  initial={{
                    opacity: 0,
                    y: 40
                  }}

                  animate={{
                    opacity: 1,
                    y: 0
                  }}

                  transition={{
                    delay:
                      index * 0.1
                  }}

                >

                  <div className="card border-0 shadow-sm h-100">

                    <div className="card-body text-center p-4">

                      <div

                        className={`text-${stat.color} mb-3`}

                        style={{
                          fontSize: "2.2rem"
                        }}

                      >

                        {stat.icon}

                      </div>


                      <h2 className="fw-bold">

                        {stat.value}

                      </h2>


                      <p className="text-muted mb-0">

                        {stat.title}

                      </p>

                    </div>

                  </div>

                </motion.div>

              )
            )
          }

        </div>


        {/* RECENT REGISTRATIONS */}
        <motion.div

          initial={{
            opacity: 0,
            y: 40
          }}

          animate={{
            opacity: 1,
            y: 0
          }}

          transition={{
            delay: 0.4
          }}

        >

          <div className="card border-0 shadow-sm">

            <div className="card-header bg-white">

              <h5 className="fw-bold mb-0">

                Recent Registrations

              </h5>

            </div>


            <div className="card-body">

              {
                loading ? (

                  <div className="text-center p-4">

                    Loading...

                  </div>

                ) : (

                  <div className="table-responsive">

                    <table className="table table-hover">

                      <thead>

                        <tr>

                          <th>Name</th>

                          <th>Email</th>

                          <th>Course</th>

                          <th>Status</th>

                          <th>Date</th>

                        </tr>

                      </thead>


                      <tbody>

                        {
                          stats.recentRegistrations
                            .map(
                              (
                                reg
                              ) => (

                                <tr
                                  key={reg.id}
                                >

                                  <td>

                                    {
                                      reg.student_name
                                    }

                                  </td>


                                  <td>

                                    {
                                      reg.email
                                    }

                                  </td>


                                  <td>

                                    {
                                      reg.selected_course
                                    }

                                  </td>


                                  <td>

                                    <span

                                      className={`badge ${

                                        reg.payment_status
                                          === "paid"

                                          ? "bg-success"

                                          : reg.payment_status
                                          === "failed"

                                          ? "bg-danger"

                                          : "bg-warning"

                                      }`}

                                    >

                                      {
                                        reg.payment_status
                                      }

                                    </span>

                                  </td>


                                  <td>

                                    {

                                      new Date(

                                        reg.created_at

                                      ).toLocaleDateString()

                                    }

                                  </td>

                                </tr>

                              )
                            )
                        }

                      </tbody>

                    </table>

                  </div>

                )
              }

            </div>

          </div>

        </motion.div>

      </div>

    </div>

  );

};

export default AdminDashboard;