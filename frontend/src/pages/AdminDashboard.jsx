import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUsers, FaBookOpen, FaCreditCard, FaChartLine, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalRegistrations: 0,
    totalCourses: 0,
    totalRevenue: 0,
    completedPayments: 0
  });

  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    // Mock data - in real app, fetch from API
    setStats({
      totalRegistrations: 1250,
      totalCourses: 6,
      totalRevenue: 250000,
      completedPayments: 890
    });
  }, []);

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

  const mockRegistrations = [
    { id: 1, name: 'John Doe', email: 'john@example.com', course: 'Digital Marketing', status: 'completed', date: '2024-01-15' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', course: 'IELTS Preparation', status: 'pending', date: '2024-01-14' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', course: 'SAP FICO', status: 'completed', date: '2024-01-13' }
  ];

  const mockCourses = [
    { id: 1, title: 'Digital Marketing Mastery', price: 25000, students: 150 },
    { id: 2, title: 'SAP FICO Certification', price: 35000, students: 89 },
    { id: 3, title: 'IELTS Preparation', price: 15000, students: 210 }
  ];

  return (
    <div className="admin-dashboard py-5 bg-light">
      <div className="container">
        <motion.div
          className="mb-4"
          {...fadeInUp}
        >
          <h1 className="display-4 fw-bold mb-4">Admin Dashboard</h1>

          {/* Navigation Tabs */}
          <div className="nav nav-tabs mb-4">
            <button
              className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              Dashboard
            </button>
            <button
              className={`nav-link ${activeTab === 'registrations' ? 'active' : ''}`}
              onClick={() => setActiveTab('registrations')}
            >
              Registrations
            </button>
            <button
              className={`nav-link ${activeTab === 'courses' ? 'active' : ''}`}
              onClick={() => setActiveTab('courses')}
            >
              Courses
            </button>
            <button
              className={`nav-link ${activeTab === 'blogs' ? 'active' : ''}`}
              onClick={() => setActiveTab('blogs')}
            >
              Blogs
            </button>
          </div>
        </motion.div>

        {activeTab === 'dashboard' && (
          <>
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
                      {mockRegistrations.map((reg) => (
                        <tr key={reg.id}>
                          <td>{reg.name}</td>
                          <td>{reg.email}</td>
                          <td>{reg.course}</td>
                          <td>
                            <span className={`badge bg-${reg.status === 'completed' ? 'success' : 'warning'}`}>
                              {reg.status}
                            </span>
                          </td>
                          <td>{reg.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          </>
        )}

        {activeTab === 'registrations' && (
          <motion.div
            className="card border-0 shadow-sm"
            {...fadeInUp}
          >
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0 fw-bold">All Registrations</h5>
              <button className="btn btn-primary">
                <FaPlus className="me-2" />
                Export Data
              </button>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Course</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockRegistrations.map((reg) => (
                      <tr key={reg.id}>
                        <td>{reg.id}</td>
                        <td>{reg.name}</td>
                        <td>{reg.email}</td>
                        <td>{reg.course}</td>
                        <td>
                          <span className={`badge bg-${reg.status === 'completed' ? 'success' : 'warning'}`}>
                            {reg.status}
                          </span>
                        </td>
                        <td>{reg.date}</td>
                        <td>
                          <button className="btn btn-sm btn-outline-primary me-2">
                            <FaEdit />
                          </button>
                          <button className="btn btn-sm btn-outline-danger">
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'courses' && (
          <motion.div
            className="card border-0 shadow-sm"
            {...fadeInUp}
          >
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0 fw-bold">Course Management</h5>
              <button className="btn btn-primary">
                <FaPlus className="me-2" />
                Add Course
              </button>
            </div>
            <div className="card-body">
              <div className="row">
                {mockCourses.map((course) => (
                  <div key={course.id} className="col-lg-4 mb-4">
                    <div className="card h-100">
                      <div className="card-body">
                        <h6 className="card-title fw-bold">{course.title}</h6>
                        <p className="text-muted small mb-2">₹{course.price.toLocaleString()}</p>
                        <p className="text-muted small mb-3">{course.students} students enrolled</p>
                        <div className="d-flex gap-2">
                          <button className="btn btn-sm btn-outline-primary">
                            <FaEdit />
                          </button>
                          <button className="btn btn-sm btn-outline-danger">
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'blogs' && (
          <motion.div
            className="card border-0 shadow-sm"
            {...fadeInUp}
          >
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0 fw-bold">Blog Management</h5>
              <button className="btn btn-primary">
                <FaPlus className="me-2" />
                Add Blog
              </button>
            </div>
            <div className="card-body">
              <p className="text-muted">Blog management functionality would be implemented here.</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;