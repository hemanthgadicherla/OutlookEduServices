import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../services/supabase";

const AdminProtectedRoute = ({ children }) => {

  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {

    checkUser();

  }, []);

  const checkUser = async () => {

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session) {
      setAuthenticated(true);
    }

    setLoading(false);
  };

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return authenticated
    ? children
    : <Navigate to="/admin" />;
};

export default AdminProtectedRoute;