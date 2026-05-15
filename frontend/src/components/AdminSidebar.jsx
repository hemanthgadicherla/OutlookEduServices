import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";

const AdminSidebar = () => {

  const location = useLocation();

  const navigate = useNavigate();

  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
    },

    {
      name: "Registrations",
      path: "/admin/registrations",
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
    {
      name: "Subscribers",
      path: "/admin/subscribers",
    },
  ];

  const handleLogout =
    async () => {

    try {

      // SIGN OUT
      await supabase.auth
        .signOut();

      // CLEAR STORAGE
      localStorage.clear();

      sessionStorage.clear();

      // REDIRECT
      window.location.href =
        "/login";

    }

    catch (error) {

      console.log(error);

    }

  };

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

      <button className="btn btn-danger w-100 mt-4" onClick={handleLogout}>
        Logout
      </button>

    </div>
  );
};

export default AdminSidebar;