import React, {
  useEffect,
  useState
} from "react";

import AdminSidebar
  from "../components/AdminSidebar";

import {
  registrationAPI
} from "../services/api";


const AdminRegistrations = () => {

  const [
    registrations,
    setRegistrations
  ] = useState([]);

  const [search, setSearch] =
    useState("");

  const [statusFilter,
    setStatusFilter
  ] = useState("all");

  const [loading, setLoading] =
    useState(false);


  useEffect(() => {

    fetchRegistrations();

  }, []);


  // FETCH
  const fetchRegistrations =
    async () => {

    try {

      setLoading(true);

      const response =
        await registrationAPI
          .getRegistrations();

      if (response.success) {

        setRegistrations(
          response.data
        );

      }

    }

    catch (error) {

      console.error(error);

    }

    finally {

      setLoading(false);

    }

  };


  // UPDATE STATUS
  const handleStatusChange =
    async (
      id,
      payment_status
    ) => {

    try {

      const response =
        await registrationAPI
          .updateRegistration(
            id,
            {
              payment_status
            }
          );

      if (response.success) {

        fetchRegistrations();

      }

    }

    catch (error) {

      console.error(error);

    }

  };


  // DELETE
  const handleDelete =
    async (id) => {

    const confirmDelete =
      window.confirm(
        "Delete registration?"
      );

    if (!confirmDelete)
      return;


    try {

      const response =
        await registrationAPI
          .deleteRegistration(
            id
          );

      if (response.success) {

        alert(
          "Registration deleted"
        );

        fetchRegistrations();

      }

    }

    catch (error) {

      console.error(error);

    }

  };


  // FILTERED DATA
  const filteredRegistrations =
    registrations.filter(
      (registration) => {

        const matchesSearch =

          registration.student_name
            ?.toLowerCase()

            .includes(
              search.toLowerCase()
            )

          ||

          registration.email
            ?.toLowerCase()

            .includes(
              search.toLowerCase()
            );

        const matchesStatus =

          statusFilter === "all"

          ||

          registration.payment_status
            === statusFilter;

        return (
          matchesSearch
          &&
          matchesStatus
        );

      }
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
          Registrations
        </h1>


        {/* FILTERS */}
        <div className="row mb-4">

          <div className="col-md-6">

            <input

              type="text"

              placeholder="Search by name or email"

              className="form-control"

              value={search}

              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }

            />

          </div>


          <div className="col-md-3">

            <select

              className="form-select"

              value={statusFilter}

              onChange={(e) =>
                setStatusFilter(
                  e.target.value
                )
              }

            >

              <option value="all">
                All Status
              </option>

              <option value="pending">
                Pending
              </option>

              <option value="paid">
                Paid
              </option>

              <option value="failed">
                Failed
              </option>

            </select>

          </div>

        </div>


        {/* TABLE */}
        <div className="card shadow-sm">

          <div className="table-responsive">

            <table className="table table-bordered mb-0">

              <thead className="table-dark">

                <tr>

                  <th>Name</th>

                  <th>Email</th>

                  <th>Phone</th>

                  <th>Course</th>

                  <th>Status</th>

                  <th>Created</th>

                  <th>Actions</th>

                </tr>

              </thead>


              <tbody>

                {
                  loading ? (

                    <tr>

                      <td
                        colSpan="7"
                        className="text-center p-4"
                      >
                        Loading...
                      </td>

                    </tr>

                  ) : filteredRegistrations.length === 0 ? (

                    <tr>

                      <td
                        colSpan="7"
                        className="text-center p-4"
                      >
                        No registrations found
                      </td>

                    </tr>

                  ) : (

                    filteredRegistrations.map(
                      (
                        registration
                      ) => (

                        <tr
                          key={registration.id}
                        >

                          <td>
                            {
                              registration.student_name
                            }
                          </td>

                          <td>
                            {
                              registration.email
                            }
                          </td>

                          <td>
                            {
                              registration.phone
                            }
                          </td>

                          <td>
                            {
                              registration.selected_course
                            }
                          </td>


                          <td>

                            <select

                              className={`form-select form-select-sm ${

                                registration.payment_status
                                  === "paid"

                                  ? "bg-success text-white"

                                  : registration.payment_status
                                  === "failed"

                                  ? "bg-danger text-white"

                                  : "bg-warning"

                              }`}

                              value={
                                registration.payment_status
                              }

                              onChange={(e) =>
                                handleStatusChange(

                                  registration.id,

                                  e.target.value

                                )
                              }

                            >

                              <option value="pending">
                                Pending
                              </option>

                              <option value="paid">
                                Paid
                              </option>

                              <option value="failed">
                                Failed
                              </option>

                            </select>

                          </td>


                          <td>

                            {
                              new Date(
                                registration.created_at
                              ).toLocaleDateString()
                            }

                          </td>


                          <td>

                            <button

                              className="btn btn-danger btn-sm"

                              onClick={() =>
                                handleDelete(
                                  registration.id
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

export default AdminRegistrations;