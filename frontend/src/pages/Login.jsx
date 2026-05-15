import React, {
  useEffect,
  useState
} from "react";

import {
  Link,
  useNavigate
} from "react-router-dom";

import {
  supabase
} from "../services/supabase";

import {
  userAuthAPI
} from "../services/api";


const Login = () => {

  const navigate =
    useNavigate();

  const [email, setEmail] =
    useState("");

  const [
    password,
    setPassword
  ] = useState("");

  const [loading, setLoading] =
    useState(false);


  // =========================
  // HANDLE USER REDIRECT
  // =========================
  const handleRedirect =
    async (user) => {

    try {

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


      if (!response.success) {

        navigate('/');

        return;

      }


      navigate(
        response.redirect
      );

    }

    catch (error) {

      console.log(error);

      navigate('/');

    }

  };


  // =========================
  // GOOGLE LOGIN HANDLER
  // =========================
  useEffect(() => {

    const {

      data: listener

    } = supabase.auth

      .onAuthStateChange(

        async (
          event,
          session
        ) => {

          // LOGIN SUCCESS
          if (

            event ===
            'SIGNED_IN'

            && session?.user

          ) {

            await handleRedirect(
              session.user
            );

          }

        }

      );


    return () => {

      listener.subscription
        .unsubscribe();

    };

  }, []);


  // =========================
  // EMAIL LOGIN
  // =========================
  const handleLogin =
    async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      const {

        data,

        error

      } = await supabase.auth

        .signInWithPassword({

          email,

          password

        });


      // INVALID LOGIN
      if (error) {

        alert(
          'Invalid email or password'
        );

        return;

      }


      await handleRedirect(
        data.user
      );

    }

    catch (error) {

      console.log(error);

    }

    finally {

      setLoading(false);

    }

  };


  // =========================
  // GOOGLE LOGIN
  // =========================
  const handleGoogleLogin =
  async () => {

  try {

    console.log(
      "Google login started"
    );

    const {

      data,

      error

    } = await supabase.auth

      .signInWithOAuth({

        provider: 'google',

        options: {

          redirectTo:
            'http://localhost:5173'

        }

      });


    console.log(
      "OAuth response:",
      data
    );

    console.log(
      "OAuth error:",
      error
    );

  }

  catch (error) {

    console.log(
      "Google login catch error:",
      error
    );

  }

};

const handleLogout =
  async () => {

  try {

    // SUPABASE LOGOUT
    await supabase.auth.signOut();

    
    // CLEAR LOCAL STORAGE
    localStorage.clear();

    sessionStorage.clear();


    // FORCE FULL RESET
    window.location.href =
      '/login';

  }

  catch (error) {

    console.log(error);

  }

};

  return (

    <div className="container py-5">

      <div className="row justify-content-center">

        <div className="col-md-5">

          <div className="card shadow border-0 p-4">

            <h2 className="text-center mb-4">

              Login

            </h2>


            {/* EMAIL LOGIN */}
            <form
              onSubmit={
                handleLogin
              }
            >

              <div className="mb-3">

                <label>
                  Email
                </label>

                <input

                  type="email"

                  className="form-control"

                  placeholder="Enter email"

                  value={email}

                  onChange={(e) =>
                    setEmail(
                      e.target.value
                    )
                  }

                  required

                />

              </div>


              <div className="mb-3">

                <label>
                  Password
                </label>

                <input

                  type="password"

                  className="form-control"

                  placeholder="Enter password"

                  value={password}

                  onChange={(e) =>
                    setPassword(
                      e.target.value
                    )
                  }

                  required

                />

              </div>


              <button

                className="btn btn-primary w-100"

                disabled={loading}

              >

                {

                  loading

                    ? "Logging in..."

                    : "Login"

                }

              </button>

            </form>


            {/* DIVIDER */}
            <div className="text-center my-3">

              <span className="text-muted">

                OR

              </span>

            </div>


            {/* GOOGLE LOGIN */}
            <button

              className="btn btn-danger w-100"

              onClick={
                handleGoogleLogin
              }

            >

              Continue with Google

            </button>


            {/* REGISTER */}
            <p className="text-center mt-3">

              Don't have an account?{" "}

              <Link to="/registration">

                Register

              </Link>

            </p>

          </div>

        </div>

      </div>

    </div>

  );

};

export default Login;