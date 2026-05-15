import React, {
  useEffect,
  useState
} from "react";

import {
  Navigate
} from "react-router-dom";

import {
  supabase
} from "../services/supabase";

import {
  userAuthAPI
} from "../services/api";


const AdminProtectedRoute = ({
  children
}) => {

  const [loading, setLoading] =
    useState(true);

  const [isAdmin, setIsAdmin] =
    useState(false);


  useEffect(() => {

    checkAdmin();

  }, []);


  const checkAdmin =
    async () => {

    try {

      // GET SESSION
      const {

        data: { session }

      } = await supabase.auth
        .getSession();


      if (!session) {

        setLoading(false);

        return;

      }


      const user =
        session.user;


      // CHECK ACCESS
      const response =
        await userAuthAPI
          .checkAccess({

            id: user.id,

            email: user.email,

            full_name:

              user.user_metadata
                ?.full_name ||

              user.user_metadata
                ?.name ||

              ''

          });


      // ADMIN CHECK
      if (
        response.role ===
        'admin'
      ) {

        setIsAdmin(true);

      }

    }

    catch (error) {

      console.error(error);

    }

    finally {

      setLoading(false);

    }

  };


  if (loading) {

    return (

      <h3 className="text-center py-5">

        Loading...

      </h3>

    );

  }


  return isAdmin

    ? children

    : <Navigate to="/login" />;

};

export default
  AdminProtectedRoute;