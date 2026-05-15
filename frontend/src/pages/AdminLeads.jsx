import React, {
  useEffect,
  useState
} from "react";

import AdminSidebar
  from "../components/AdminSidebar";

import {
  leadAPI
} from "../services/api";


const AdminLeads = () => {

  const [leads, setLeads] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(false);


  useEffect(() => {

    fetchLeads();

  }, []);


  // FETCH LEADS
  const fetchLeads =
    async () => {

    try {

      setLoading(true);

      const response =
        await leadAPI
          .getLeads();

      if (response.success) {

        setLeads(
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


  // UPDATE CONTACT STATUS
  const handleContactToggle =
    async (
      id,
      contacted
    ) => {

    try {

      const response =
        await leadAPI
          .updateLead(
            id,
            {
              contacted:
                !contacted
            }
          );

      if (response.success) {

        fetchLeads();

      }

    }

    catch (error) {

      console.error(error);

    }

  };


  // DELETE LEAD
  const handleDelete =
    async (id) => {

    const confirmDelete =
      window.confirm(
        "Delete this lead?"
      );

    if (!confirmDelete)
      return;


    try {

      const response =
        await leadAPI
          .deleteLead(id);

      if (response.success) {

        alert(
          "Lead deleted successfully"
        );

        fetchLeads();

      }

    }

    catch (error) {

      console.error(error);

    }

  };


  // FILTER LEADS
  const filteredLeads =
    leads.filter(
      (lead) => {

        return (

          lead.name
            ?.toLowerCase()

            .includes(
              search.toLowerCase()
            )

          ||

          lead.email
            ?.toLowerCase()

            .includes(
              search.toLowerCase()
            )

          ||

          lead.phone
            ?.includes(search)

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
          Leads Management
        </h1>


        {/* SEARCH */}
        <div className="row mb-4">

          <div className="col-md-6">

            <input

              type="text"

              placeholder="Search leads..."

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

                  <th>Name</th>

                  <th>Email</th>

                  <th>Phone</th>

                  <th>Subject</th>

                  <th>Status</th>

                  <th>Actions</th>

                </tr>

              </thead>


              <tbody>

                {
                  loading ? (

                    <tr>

                      <td
                        colSpan="6"
                        className="text-center p-4"
                      >
                        Loading...
                      </td>

                    </tr>

                  ) : filteredLeads.length === 0 ? (

                    <tr>

                      <td
                        colSpan="6"
                        className="text-center p-4"
                      >
                        No leads found
                      </td>

                    </tr>

                  ) : (

                    filteredLeads.map(
                      (lead) => (

                        <tr
                          key={lead.id}
                        >

                          <td>
                            {lead.name}
                          </td>


                          <td>
                            {lead.email}
                          </td>


                          <td>
                            {lead.phone}
                          </td>


                          <td>
                            {lead.subject}
                          </td>


                          <td>

                            <button

                              className={`btn btn-sm ${

                                lead.contacted

                                  ? "btn-success"

                                  : "btn-warning"

                              }`}

                              onClick={() =>
                                handleContactToggle(

                                  lead.id,

                                  lead.contacted

                                )
                              }

                            >

                              {

                                lead.contacted

                                  ? "Contacted"

                                  : "Pending"

                              }

                            </button>

                          </td>


                          <td>

                            <button

                              className="btn btn-danger btn-sm"

                              onClick={() =>
                                handleDelete(
                                  lead.id
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

export default AdminLeads;