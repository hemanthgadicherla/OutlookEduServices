import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { logout as clearTokens, getUser } from '../utils/auth';
import {
  FaTachometerAlt, FaClipboardList, FaLayerGroup,
  FaNewspaper, FaBullhorn, FaSignOutAlt
} from 'react-icons/fa';

const AdminSidebar = () => {
  const location = useLocation();
  const navigate  = useNavigate();
  const user      = getUser();

  const menuItems = [
    { name: 'Dashboard',        path: '/admin/dashboard',     icon: <FaTachometerAlt /> },
    { name: 'Registrations',    path: '/admin/registrations', icon: <FaClipboardList /> },
    { name: 'Courses & LMS',   path: '/admin/courses',       icon: <FaLayerGroup /> },
    { name: 'Blogs',            path: '/admin/blogs',         icon: <FaNewspaper /> },
    { name: 'Leads',            path: '/admin/leads',         icon: <FaBullhorn /> },
  ];

  const handleLogout = () => {
    clearTokens();
    navigate('/admin/login', { replace: true });
  };

  return (
    <>
      {/* Fixed sidebar placeholder — holds the 240px space in the flex layout */}
      <div style={{ width: 240, flexShrink: 0 }} />

      {/* Fixed sidebar */}
      <div
        className="d-flex flex-column bg-dark text-white p-3"
        style={{
          width: 240,
          height: '100vh',
          position: 'fixed',
          top: 0,
          left: 0,
          overflowY: 'auto',
          zIndex: 100,
          flexShrink: 0
        }}
      >
        {/* brand */}
        <div className="mb-4 pb-3 border-bottom border-secondary">
          <h5 className="fw-bold text-white mb-0">Admin Panel</h5>
          {user && (
            <p className="text-secondary small mb-0 mt-1" style={{ fontSize: 12 }}>
              {user.full_name || user.email}
            </p>
          )}
        </div>

        {/* nav links */}
        <nav className="flex-grow-1">
          {menuItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`d-flex align-items-center gap-2 p-2 mb-1 rounded text-decoration-none small fw-semibold
                  ${active ? 'bg-primary text-white' : 'text-light'}`}
                style={{ transition: 'background .15s' }}
              >
                <span style={{ fontSize: 14 }}>{item.icon}</span>
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* logout */}
        <button
          className="btn btn-outline-danger btn-sm d-flex align-items-center justify-content-center gap-2 mt-3"
          onClick={handleLogout}
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </>
  );
};

export default AdminSidebar;
