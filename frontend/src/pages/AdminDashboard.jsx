import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUsers, FaBookOpen, FaCreditCard, FaChartLine, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import AdminSidebar from "../components/AdminSidebar";
import { supabase } from "../services/supabase";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalRegistrations: 0,
    totalCourses: 0,
    totalRevenue: 0,
    completedPayments: 0
  });

  const [
  recentRegistrations,
  setRecentRegistrations
] = useState([]);


  useEffect(() => {

  fetchDashboardStats();

  fetchRecentRegistrations();

}, []);

const fetchDashboardStats = async () => {

  // Registrations Count
  const { count: registrationsCount } =
    await supabase
      .from("registrations")
      .select("*", {
        count: "exact",
        head: true,
      });

  // Courses Count
  const { count: coursesCount } =
    await supabase
      .from("courses")
      .select("*", {
        count: "exact",
        head: true,
      });

  // Completed Payments
  const { count: completedPayments } =
    await supabase
      .from("registrations")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("payment_status", "completed");

  // Revenue
  const { data: revenueData } =
    await supabase
      .from("registrations")
      .select("amount")
      .eq("payment_status", "completed");

  let totalRevenue = 0;

  revenueData?.forEach((item) => {

    totalRevenue +=
      Number(item.amount);

  });

  setStats({
    totalRegistrations:
      registrationsCount || 0,

    totalCourses:
      coursesCount || 0,

    totalRevenue,

    completedPayments:
      completedPayments || 0,
  });
};


  const fetchRecentRegistrations =
  async () => {

  const { data, error } =
    await supabase
      .from("registrations")
      .select("*")
      .order("created_at", {
        ascending: false,
      })
      .limit(5);

  if (error) {

    console.log(error);

    return;
  }

  setRecentRegistrations(data);
};

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const statCards = [
    {
      title: 'Total Registrations',
      value: stats.totalRegistrations,
      icon: <FaUsers />,
      color: 'primary'
    },
    {
      title: 'Total Courses',
      value: stats.totalCourses,
      icon: <FaBookOpen />,
      color: 'success'
    },
    {
      title: 'Total Revenue',
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      icon: <FaCreditCard />,
      color: 'info'
    },
    {
      title: 'Completed Payments',
      value: stats.completedPayments,
      icon: <FaChartLine />,
      color: 'warning'
    }
  ];


  return (
    <div className="d-flex">
      <AdminSidebar />
      <div className="flex-grow-1 admin-dashboard py-5 bg-light"
        style={{ minHeight: "100vh" }}
      >
        <div className="container">
          <motion.div
            className="mb-4"
            {...fadeInUp}
        >
          <h1 className="display-4 fw-bold mb-4">Admin Dashboard</h1>

          
        </motion.div>
            {/* Stats Cards */}
            <div className="row mb-5">
              {statCards.map((stat, index) => (
                <motion.div
                  key={index}
                  className="col-lg-3 col-md-6 mb-4"
                  {...fadeInUp}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-body text-center p-4">
                      <div className={`text-${stat.color} mb-3`} style={{ fontSize: '2rem' }}>
                        {stat.icon}
                      </div>
                      <h3 className="fw-bold mb-2">{stat.value}</h3>
                      <p className="text-muted mb-0">{stat.title}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Recent Activity */}
            <motion.div
              className="card border-0 shadow-sm"
              {...fadeInUp}
            >
              <div className="card-header bg-white">
                <h5 className="mb-0 fw-bold">Recent Registrations</h5>
              </div>
              <div className="card-body">
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
                      {recentRegistrations.map((reg) => (
                        <tr key={reg.id}>
                          <td>{reg.name}</td>
                          <td>{reg.email}</td>
                          <td>{reg.course_name}</td>
                          <td>
                            <span className={`badge bg-${reg.payment_status === 'completed' ? 'success' : 'warning'}`}>
                              {reg.payment_status}
                            </span>
                          </td>
                          <td>{ new Date(reg.created_at).toLocaleDateString() }</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
        

          </div>
        </div>
      </div>
  );
};

export default AdminDashboard;