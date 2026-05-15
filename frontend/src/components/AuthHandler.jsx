import {
  useEffect
} from "react";

import {
  useNavigate
} from "react-router-dom";

import {
  supabase
} from "../services/supabase";

import {
  userAuthAPI
} from "../services/api";


const AuthHandler = () => {

  const navigate =
    useNavigate();

  useEffect(() => {

    handleSession();

  }, []);


  const handleSession =
    async () => {

    // ONLY HANDLE OAUTH CALLBACK
    if (
      !window.location.hash
        .includes(
          'access_token'
        )
    ) {

      return;

    }


    try {

      // GET SESSION
      const {

        data: { session }

      } = await supabase.auth
        .getSession();


      if (!session?.user) {

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


      // CLEAN URL
      window.history.replaceState(
        {},
        document.title,
        window.location.pathname
      );


      // REDIRECT
      navigate(
        response.redirect
      );

    }

    catch (error) {

      console.error(error);

    }

  };


  return null;

};

export default AuthHandler;