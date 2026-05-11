import React, { useEffect, useState } from "react";
import { supabase } from "../services/supabase";
import AdminSidebar from "../components/AdminSidebar";

const AdminSubscribers = () => {

  const [
    subscribers,
    setSubscribers
  ] = useState([]);

  useEffect(() => {

    fetchSubscribers();

  }, []);

  const fetchSubscribers =
    async () => {

    const { data, error } =
      await supabase
        .from(
          "blog_subscribers"
        )
        .select("*")
        .order(
          "created_at",
          {
            ascending: false,
          }
        );

    console.log(data);

    console.log(error);

    if (error) {

      return;
    }

    setSubscribers(data);
  };

  return (

    <div className="d-flex">

      <AdminSidebar />

      <div className="flex-grow-1 p-4">

        <h1 className="mb-4">
          Blog Subscribers
        </h1>

        <table className="table">

          <thead>

            <tr>

              <th>Email</th>

              <th>Date</th>

            </tr>

          </thead>

          <tbody>

            {
              subscribers.map(
                (item) => (

                <tr key={item.id}>

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

                </tr>

              ))
            }

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default AdminSubscribers;