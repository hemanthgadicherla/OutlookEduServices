import React, {
  useEffect,
  useState
} from "react";

import AdminSidebar
  from "../components/AdminSidebar";

import {
  subscriberAPI
} from "../services/api";


const AdminSubscribers = () => {

  const [
    subscribers,
    setSubscribers
  ] = useState([]);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(false);


  useEffect(() => {

    fetchSubscribers();

  }, []);


  // FETCH
  const fetchSubscribers =
    async () => {

    try {

      setLoading(true);

      const response =
        await subscriberAPI
          .getSubscribers();

      if (response.success) {

        setSubscribers(
          response.data
        );

      }

    }

    catch (error) {

      console.log(error);

    }

    finally {

      setLoading(false);

    }

  };


  // DELETE
  const handleDelete =
    async (id) => {

    const confirmDelete =
      window.confirm(
        "Delete subscriber?"
      );

    if (!confirmDelete)
      return;


    try {

      const response =
        await subscriberAPI
          .deleteSubscriber(
            id
          );

      if (response.success) {

        alert(
          "Subscriber deleted"
        );

        fetchSubscribers();

      }

    }

    catch (error) {

      console.log(error);

    }

  };


  // FILTER
  const filteredSubscribers =
    subscribers.filter(
      (item) =>

        item.email
          ?.toLowerCase()

          .includes(
            search.toLowerCase()
          )

    );


  return (

    <div className="d-flex">

      <AdminSidebar />

      <div
        className="flex-grow-1 p-4 bg-light"
        style={{
          minHeight: "100vh"
        }}
      >

        <h1 className="mb-4">
          Blog Subscribers
        </h1>


        {/* SEARCH */}
        <div className="row mb-4">

          <div className="col-md-6">

            <input

              type="text"

              placeholder="Search subscriber email"

              className="form-control"

              value={search}

              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }

            />

          </div>

        </div>


        {/* TABLE */}
        <div className="card shadow-sm">

          <div className="table-responsive">

            <table className="table table-bordered mb-0">

              <thead className="table-dark">

                <tr>

                  <th>Email</th>

                  <th>Subscribed Date</th>

                  <th>Actions</th>

                </tr>

              </thead>


              <tbody>

                {
                  loading ? (

                    <tr>

                      <td
                        colSpan="3"
                        className="text-center p-4"
                      >
                        Loading...
                      </td>

                    </tr>

                  ) : filteredSubscribers.length === 0 ? (

                    <tr>

                      <td
                        colSpan="3"
                        className="text-center p-4"
                      >
                        No subscribers found
                      </td>

                    </tr>

                  ) : (

                    filteredSubscribers.map(
                      (item) => (

                        <tr
                          key={item.id}
                        >

                          <td>
                            {item.email}
                          </td>


                          <td>

                            {

                              new Date(

                                item.created_at

                              ).toLocaleDateString()

                            }

                          </td>


                          <td>

                            <button

                              className="btn btn-danger btn-sm"

                              onClick={() =>
                                handleDelete(
                                  item.id
                                )
                              }

                            >
                              Delete
                            </button>

                          </td>

                        </tr>

                      )
                    )

                  )
                }

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </div>

  );

};

export default AdminSubscribers;