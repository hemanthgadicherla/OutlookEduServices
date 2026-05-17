import React, {
  useEffect,
  useState
} from "react";

import AdminSidebar
  from "../components/AdminSidebar";

import {
  blogAPI,
  uploadAPI
} from "../services/api";


const AdminBlogs = () => {

  const [blogs, setBlogs] =
    useState([]);

  const [title, setTitle] =
    useState("");

  const [content, setContent] =
    useState("");

  const [
    fullContent,
    setFullContent
  ] = useState("");

  const [author, setAuthor] =
    useState("");

  const [date, setDate] =
    useState("");

  const [
    readTime,
    setReadTime
  ] = useState("");

  const [
    category,
    setCategory
  ] = useState("");

  const [image, setImage] =
    useState("");

  const [
    imageFile,
    setImageFile
  ] = useState(null);

  const [preview, setPreview] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [editingId, setEditingId] =
    useState(null);


  useEffect(() => {

    fetchBlogs();

  }, []);


  // FETCH BLOGS
  const fetchBlogs = async () => {

    try {

      const response =
        await blogAPI.getBlogs();

      if (response.success) {

        setBlogs(
          response.data
        );

      }

    }

    catch (error) {

      console.error(error);

    }

  };


  // GENERATE SLUG
  const generateSlug = (
    text
  ) => {

    return text

      .toLowerCase()

      .trim()

      .replace(
        /[^\w\s-]/g,
        ""
      )

      .replace(
        /\s+/g,
        "-"
      );

  };


  // IMAGE PREVIEW
  const handleImageChange = (
    e
  ) => {

    const file =
      e.target.files[0];

    setImageFile(file);

    if (file) {

      setPreview(
        URL.createObjectURL(
          file
        )
      );

    }

  };


  // SUBMIT
  const handleSubmit = async (
    e
  ) => {

    e.preventDefault();

    try {

      setLoading(true);

      let imageUrl = image;


      // Upload Image
      if (imageFile) {

        const uploadResponse =
          await uploadAPI.uploadImage(
            imageFile
          );

        if (
          uploadResponse.success
        ) {

          imageUrl =
            uploadResponse.imageUrl;

        }

        else {

          alert(
            "Image upload failed"
          );

          return;

        }

      }


      const slug =
        generateSlug(title);


      const blogData = {

        title,

        slug,

        excerpt:
          content.slice(0, 140),

        content:
          fullContent,

        image:
          imageUrl,

        author,

        read_time:
          readTime,

        date,

        category

      };


      let response;


      // UPDATE
      if (editingId) {

        response =
          await blogAPI.updateBlog(

            editingId,

            blogData

          );

      }

      // CREATE
      else {

        response =
          await blogAPI.createBlog(
            blogData
          );

      }


      if (response.success) {

        alert(

          editingId
            ? "Blog updated successfully"
            : "Blog created successfully"

        );

        resetForm();

        fetchBlogs();

      }

      else {

        alert(
          response.message
        );

      }

    }

    catch (error) {

      console.error(error);

      alert(
        "Something went wrong"
      );

    }

    finally {

      setLoading(false);

    }

  };


  // EDIT
  const handleEdit = (blog) => {
    setEditingId(blog.id);
    setTitle(blog.title || '');
    setContent(blog.excerpt || '');
    setFullContent(blog.content || '');
    setAuthor(blog.author || '');
    setDate(blog.date || '');
    setReadTime(blog.read_time || '');
    setCategory(blog.category || '');
    setImage(blog.image || '');
    setPreview(blog.image || '');
  };


  // DELETE
  const handleDelete = async (
    id
  ) => {

    const confirmDelete =
      window.confirm(
        "Delete this blog?"
      );

    if (!confirmDelete)
      return;


    try {

      const response =
        await blogAPI.deleteBlog(
          id
        );

      if (response.success) {

        alert(
          "Blog deleted successfully"
        );

        fetchBlogs();

      }

    }

    catch (error) {

      console.error(error);

    }

  };


  // RESET
  const resetForm = () => {

    setEditingId(null);

    setTitle("");

    setContent("");

    setFullContent("");

    setAuthor("");

    setDate("");

    setReadTime("");

    setCategory("");

    setImage("");

    setImageFile(null);

    setPreview("");

  };


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
          Blog Management
        </h1>


        {/* FORM */}
        <div className="card p-4 mb-4">

          <form
            onSubmit={handleSubmit}
          >

            <input

              type="text"

              placeholder="Blog Title"

              className="form-control mb-3"

              value={title}

              onChange={(e) =>
                setTitle(
                  e.target.value
                )
              }

              required

            />


            <textarea

              placeholder="Short Description"

              className="form-control mb-3"

              value={content}

              onChange={(e) =>
                setContent(
                  e.target.value
                )
              }

              required

            />


            <textarea

              placeholder="Full Blog Content"

              className="form-control mb-3"

              rows="10"

              value={fullContent}

              onChange={(e) =>
                setFullContent(
                  e.target.value
                )
              }

              required

            />


            <input

              type="file"

              className="form-control mb-3"

              accept="image/*"

              onChange={
                handleImageChange
              }

            />


            {
              preview && (

                <img

                  src={preview}

                  alt="Preview"

                  className="mb-3 rounded"

                  style={{
                    width: "220px",
                    height: "160px",
                    objectFit: "cover"
                  }}

                />

              )
            }


            <input

              type="text"

              placeholder="Author"

              className="form-control mb-3"

              value={author}

              onChange={(e) =>
                setAuthor(
                  e.target.value
                )
              }

              required

            />


            <input

              type="date"

              className="form-control mb-3"

              value={date}

              onChange={(e) =>
                setDate(
                  e.target.value
                )
              }

              required

            />


            <input

              type="text"

              placeholder="Read Time"

              className="form-control mb-3"

              value={readTime}

              onChange={(e) =>
                setReadTime(
                  e.target.value
                )
              }

              required

            />


            <input

              type="text"

              placeholder="Category"

              className="form-control mb-3"

              value={category}

              onChange={(e) =>
                setCategory(
                  e.target.value
                )
              }

              required

            />


            <button
              className="btn btn-primary"
              disabled={loading}
            >

              {
                loading
                  ? "Processing..."
                  : editingId
                  ? "Update Blog"
                  : "Add Blog"
              }

            </button>

          </form>

        </div>


        {/* BLOG LIST */}
        <div className="row">

          {
            blogs.map(
              (blog) => (

                <div

                  key={blog.id}

                  className="col-md-4 mb-4"

                >

                  <div className="card h-100 shadow-sm">

                    {
                      blog.image && (

                        <img

                          src={blog.image}

                          alt={blog.title}

                          className="card-img-top"

                          style={{
                            height: "220px",
                            objectFit: "cover"
                          }}

                        />

                      )
                    }


                    <div className="card-body">

                      <h5>
                        {blog.title}
                      </h5>

                      <p>
                        {blog.excerpt}
                      </p>


                      <div className="d-flex gap-2 mt-3">

                        <button

                          className="btn btn-warning btn-sm"

                          onClick={() =>
                            handleEdit(blog)
                          }

                        >
                          Edit
                        </button>


                        <button

                          className="btn btn-danger btn-sm"

                          onClick={() =>
                            handleDelete(
                              blog.id
                            )
                          }

                        >
                          Delete
                        </button>

                      </div>

                    </div>

                  </div>

                </div>

              )
            )
          }

        </div>

      </div>

    </div>

  );

};

export default AdminBlogs;