import React, { useEffect, useState } from "react";
import { supabase } from "../services/supabase";
import AdminSidebar from "../components/AdminSidebar";

const AdminBlogs = () => {

  const [blogs, setBlogs] = useState([]);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [author, setAuthor] = useState("");
  const [date, setDate] = useState("");
  const [readTime, setReadTime] = useState("");
  const [category, setCategory] = useState("");

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {

    fetchBlogs();

  }, []);

  const fetchBlogs = async () => {

    const { data, error } = await supabase
      .from("blogs")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) {
      setBlogs(data);
    }
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (editingId) {

      await supabase
        .from("blogs")
        .update({
          title,
          content,
          image,
          author,
          date,
          readTime,
          category,
        })
        .eq("id", editingId);

    } else {

      const { data, error } =
        await supabase
            .from("blogs")
            .insert([
            {
                title,
                content,
                image,
                author,
                date,
                readTime,
                category,
            },
        ]);

        console.log(data);

        console.log(error);
    }

    resetForm();

    fetchBlogs();
  };

  const handleEdit = (blog) => {

    setEditingId(blog.id);

    setTitle(blog.title);
    setContent(blog.content);
    setImage(blog.image);
    setAuthor(blog.author);
    setDate(blog.date);
    setReadTime(blog.readTime);
    setCategory(blog.category);
  };

  const handleDelete = async (id) => {

    const confirmDelete =
      window.confirm("Delete this blog?");

    if (!confirmDelete) return;

    await supabase
      .from("blogs")
      .delete()
      .eq("id", id);

    fetchBlogs();
  };

  const resetForm = () => {

    setEditingId(null);

    setTitle("");
    setContent("");
    setImage("");
    setAuthor("");
    setDate("");
    setReadTime("");
    setCategory("");
  };

  return (

    <div className="d-flex">

      <AdminSidebar />

      <div
        className="flex-grow-1 p-4 bg-light"
        style={{ minHeight: "100vh" }}
      >

        <h1 className="mb-4">
          Blog Management
        </h1>

        <div className="card p-4 mb-4">

          <form onSubmit={handleSubmit}>

            <input
              type="text"
              placeholder="Blog Title"
              className="form-control mb-3"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              required
            />

            <textarea
              placeholder="Blog Content"
              className="form-control mb-3"
              value={content}
              onChange={(e) =>
                setContent(e.target.value)
              }
              required
            />

            <input
              type="text"
              placeholder="Image URL"
              className="form-control mb-3"
              value={image}
              onChange={(e) =>
                setImage(e.target.value)
              }
              required
            />

            <input
              type="text"
              placeholder="Author"
              className="form-control mb-3"
              value={author}
              onChange={(e) =>
                setAuthor(e.target.value)
              }
              required
            />

            <input
              type="date"
              className="form-control mb-3"
              value={date}
              onChange={(e) =>
                setDate(e.target.value)
              }
              required
            />

            <input
              type="text"
              placeholder="Read Time"
              className="form-control mb-3"
              value={readTime}
              onChange={(e) =>
                setReadTime(e.target.value)
              }
              required
            />

            <input
              type="text"
              placeholder="Category"
              className="form-control mb-3"
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
              required
            />

            <button className="btn btn-primary">

              {editingId
                ? "Update Blog"
                : "Add Blog"}

            </button>

          </form>

        </div>

        <div className="row">

          {blogs.map((blog) => (

            <div
              key={blog.id}
              className="col-md-4 mb-4"
            >

              <div className="card h-100">

                {
                  blog.image && (
                    <img
                      src={blog.image}
                      alt={blog.title}
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
                    {blog.title}
                  </h5>

                  <p>
                    {blog.content}
                  </p>

                  <button
                    className="btn btn-warning me-2"
                    onClick={() =>
                      handleEdit(blog)
                    }
                  >
                    Edit
                  </button>

                  <button
                    className="btn btn-danger"
                    onClick={() =>
                      handleDelete(blog.id)
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

export default AdminBlogs;