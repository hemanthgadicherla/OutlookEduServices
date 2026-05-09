import React from "react";
import { Link, useLocation } from "react-router-dom";

const AdminSidebar = () => {

  const location = useLocation();

  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
    },

    {
      name: "Courses",
      path: "/admin/courses",
    },

    {
      name: "Blogs",
      path: "/admin/blogs",
    },

    {
      name: "Leads",
      path: "/admin/leads",
    },
  ];

  return (
    <div
      className="bg-dark text-white p-3"
      style={{
        width: "250px",
        minHeight: "100vh",
      }}
    >

      <h3 className="mb-4 text-white">
        Admin Panel
      </h3>

      {
        menuItems.map((item) => (

          <Link
            key={item.path}
            to={item.path}
            className={`d-block p-2 mb-2 text-decoration-none rounded ${
              location.pathname === item.path
                ? "bg-primary text-white"
                : "text-light"
            }`}
          >
            {item.name}
          </Link>

        ))
      }

    </div>
  );
};

export default AdminSidebar;