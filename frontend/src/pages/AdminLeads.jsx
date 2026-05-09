import React, { useEffect, useState } from "react";

import { supabase } from "../services/supabase";

import AdminSidebar from "../components/AdminSidebar";

const AdminLeads = () => {

  const [leads, setLeads] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {

    fetchLeads();

}, []);

    const filteredLeads = leads.filter((lead) => {

  return (

    lead.name
      ?.toLowerCase()
      .includes(search.toLowerCase())

    ||

    lead.email
      ?.toLowerCase()
      .includes(search.toLowerCase())

    ||

    lead.phone
      ?.includes(search)

  );
});

    const handleDelete = async (id) => {

  const confirmDelete =
    window.confirm(
      "Are you sure you want to delete this lead?"
    );

  if (!confirmDelete) return;

  const { error } = await supabase
    .from("leads")
    .delete()
    .eq("id", id);

  if (error) {

    console.log(error);

    return;
  }

  fetchLeads();
};

  const fetchLeads = async () => {

    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.log(error);
      return;
    }

    setLeads(data);
  };

  return (

  <div className="d-flex">

    <AdminSidebar />

    <div className="flex-grow-1 p-4">

      <h1 className="mb-4">
        Leads
      </h1>

      <input
        type="text"
        placeholder="Search leads..."
        className="form-control mb-4"
        value={search}
        onChange={(e) =>
        setSearch(e.target.value)
        }
        />

      <table className="table">

        <thead>

          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Subject</th>
            <th>Action</th>
          </tr>

        </thead>

        <tbody>

          {
            filteredLeads.map((lead) => (

              <tr key={lead.id}>

                <td>{lead.name}</td>

                <td>{lead.phone}</td>

                <td>{lead.subject}</td>

                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(lead.id)}
                  >
                    Delete
                  </button>
                </td>

              </tr>

            ))
          }

        </tbody>

      </table>

    </div>

  </div>
    );
};

export default AdminLeads;