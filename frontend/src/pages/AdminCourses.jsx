import React, { useEffect, useState } from "react";
import { supabase } from "../services/supabase";
import AdminSidebar from "../components/AdminSidebar";

const AdminCourses = () => {

  const [courses, setCourses] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {

    fetchCourses();

  }, []);

  const fetchCourses = async () => {

    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) {
      setCourses(data);
    }
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (editingId) {

      await supabase
        .from("courses")
        .update({
          title,
          description,
          price,
          image,
        })
        .eq("id", editingId);

    } else {

      const { data, error } =
  await supabase
    .from("courses")
    .insert([
      {
        title,
        description,
        price,
        image,
      },
    ]);

    console.log(data);

    console.log(error);
    }

    resetForm();

    fetchCourses();
  };

  const handleEdit = (course) => {

    setEditingId(course.id);

    setTitle(course.title);
    setDescription(course.description);
    setPrice(course.price);
    setImage(course.image);
  };

  const handleDelete = async (id) => {

    const confirmDelete =
      window.confirm("Delete this course?");

    if (!confirmDelete) return;

    await supabase
      .from("courses")
      .delete()
      .eq("id", id);

    fetchCourses();
  };

  const resetForm = () => {

    setEditingId(null);

    setTitle("");
    setDescription("");
    setPrice("");
    setImage("");
  };

  return (

    <div className="d-flex">

      <AdminSidebar />

      <div
        className="flex-grow-1 p-4 bg-light"
        style={{ minHeight: "100vh" }}
      >

        <h1 className="mb-4">
          Course Management
        </h1>

        <div className="card p-4 mb-4">

          <form onSubmit={handleSubmit}>

            <input
              type="text"
              placeholder="Course Title"
              className="form-control mb-3"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              required
            />

            <textarea
              placeholder="Description"
              className="form-control mb-3"
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
            />

            <input
              type="text"
              placeholder="Price"
              className="form-control mb-3"
              value={price}
              onChange={(e) =>
                setPrice(e.target.value)
              }
            />

            <input
              type="text"
              placeholder="Image URL"
              className="form-control mb-3"
              value={image}
              onChange={(e) =>
                setImage(e.target.value)
              }
            />

            <button className="btn btn-primary">

              {editingId
                ? "Update Course"
                : "Add Course"}

            </button>

          </form>

        </div>

        <div className="row">

          {courses.map((course) => (

            <div
              key={course.id}
              className="col-md-4 mb-4"
            >

              <div className="card h-100">

                {
                  course.image && (
                    <img
                      src={course.image}
                      alt={course.title}
                      className="card-img-top"
                      style={{
                        height: "200px",
                        objectFit: "cover",
                      }}
                    />
                  )
                }

                <div className="card-body">

                  <h5>
                    {course.title}
                  </h5>

                  <p>
                    {course.description}
                  </p>

                  <p>
                    ₹{course.price}
                  </p>

                  <button
                    className="btn btn-warning me-2"
                    onClick={() =>
                      handleEdit(course)
                    }
                  >
                    Edit
                  </button>

                  <button
                    className="btn btn-danger"
                    onClick={() =>
                      handleDelete(course.id)
                    }
                  >
                    Delete
                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
};

export default AdminCourses;