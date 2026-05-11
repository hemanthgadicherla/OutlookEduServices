import React, { useEffect, useState } from "react";
import { supabase } from "../services/supabase";
import AdminSidebar from "../components/AdminSidebar";

const AdminRegistrations = () => {

  const [registrations,
  setRegistrations] = useState([]);

  useEffect(() => {

    fetchRegistrations();

  }, []);

  const fetchRegistrations =
    async () => {

    const { data, error } =
      await supabase
        .from("registrations")
        .select("*")
        .order("created_at", {
          ascending: false,
        });

    if (error) {

      console.log(error);

      return;
    }

    setRegistrations(data);
  };

  return (

    <div className="d-flex">

      <AdminSidebar />

      <div className="flex-grow-1 p-4">

        <h1 className="mb-4">
          Registrations
        </h1>

        <table className="table table-bordered">

          <thead>

            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Course</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Payment ID</th>
            </tr>

          </thead>

          <tbody>

            {
              registrations.map(
                (registration) => (

                <tr
                  key={registration.id}
                >

                  <td>
                    {registration.name}
                  </td>

                  <td>
                    {registration.email}
                  </td>

                  <td>
                    {registration.phone}
                  </td>

                  <td>
                    {registration.course_name}
                  </td>

                  <td>
                    ₹{registration.amount}
                  </td>

                  <td>

                    <span
                      className={`badge ${
                        registration.payment_status
                        === "completed"
                          ? "bg-success"
                          : "bg-warning"
                      }`}
                    >
                      {
                        registration.payment_status
                      }
                    </span>

                  </td>

                  <td>
                    {registration.payment_id}
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

export default AdminRegistrations;