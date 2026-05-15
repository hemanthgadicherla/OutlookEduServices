import React, { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import { courseAPI, uploadAPI } from "../services/api";

const AdminCourses = () => {

  const [courses, setCourses] =
    useState([]);

  const [title, setTitle] =
    useState("");

  const [
    description,
    setDescription
  ] = useState("");

  const [
    fullDescription,
    setFullDescription
  ] = useState("");

  const [price, setPrice] =
    useState("");

  const [image, setImage] =
    useState("");

  const [
    imageFile,
    setImageFile
  ] = useState(null);

  const [loading, setLoading] =
    useState(false);

  const [preview, setPreview] =
    useState("");

  const [editingId, setEditingId] =
    useState(null);


  useEffect(() => {

    fetchCourses();

  }, []);


  // FETCH COURSES
  const fetchCourses = async () => {

    try {

      const response =
        await courseAPI.getCourses();

      if (response.success) {

        setCourses(
          response.data
        );

      }

    }

    catch (error) {

      console.error(error);

    }

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


  // SUBMIT FORM
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

        } else {

          alert(
            "Image upload failed"
          );

          setLoading(false);

          return;

        }

      }


      const courseData = {

        title,

        description,

        fullDescription,

        price,

        image: imageUrl,

      };


      let response;


      // UPDATE
      if (editingId) {

        response =
          await courseAPI.updateCourse(

            editingId,

            courseData

          );

      }

      // CREATE
      else {

        response =
          await courseAPI.createCourse(
            courseData
          );

      }


      if (response.success) {

        alert(

          editingId
            ? "Course updated successfully"
            : "Course added successfully"

        );

        resetForm();

        fetchCourses();

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


  // EDIT COURSE
  const handleEdit = (
    course
  ) => {

    setEditingId(
      course.id
    );

    setTitle(
      course.title
    );

    setDescription(
      course.description
    );

    setFullDescription(
      course.full_description
    );

    setPrice(
      course.price
    );

    setImage(
      course.image
    );

    setPreview(
      course.image
    );

  };


  // DELETE COURSE
  const handleDelete = async (
    id
  ) => {

    const confirmDelete =
      window.confirm(
        "Delete this course?"
      );

    if (!confirmDelete)
      return;

    try {

      const response =
        await courseAPI.deleteCourse(
          id
        );

      if (response.success) {

        alert(
          "Course deleted successfully"
        );

        fetchCourses();

      }

    }

    catch (error) {

      console.error(error);

    }

  };


  // RESET FORM
  const resetForm = () => {

    setEditingId(null);

    setTitle("");

    setDescription("");

    setFullDescription("");

    setPrice("");

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
          Course Management
        </h1>


        {/* FORM */}
        <div className="card p-4 mb-4">

          <form
            onSubmit={handleSubmit}
          >

            <input

              type="text"

              placeholder="Course Title"

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

              placeholder="Description"

              className="form-control mb-3"

              value={description}

              onChange={(e) =>
                setDescription(
                  e.target.value
                )
              }

              required

            />


            <textarea

              placeholder="Full Course Details"

              className="form-control mb-3"

              rows="8"

              value={
                fullDescription
              }

              onChange={(e) =>
                setFullDescription(
                  e.target.value
                )
              }

            />


            <input

              type="number"

              placeholder="Price"

              className="form-control mb-3"

              value={price}

              onChange={(e) =>
                setPrice(
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


            {/* IMAGE PREVIEW */}
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


            <button
              className="btn btn-primary"
              disabled={loading}
            >

              {
                loading
                  ? "Processing..."
                  : editingId
                  ? "Update Course"
                  : "Add Course"
              }

            </button>

          </form>

        </div>


        {/* COURSE LIST */}
        <div className="row">

          {
            courses.map(
              (course) => (

                <div

                  key={course.id}

                  className="col-md-4 mb-4"

                >

                  <div
                    className="card h-100 shadow-sm"
                  >

                    {
                      course.image && (

                        <img

                          src={course.image}

                          alt={course.title}

                          className="card-img-top"

                          style={{

                            height: "220px",

                            objectFit:
                              "cover",

                          }}

                        />

                      )
                    }


                    <div className="card-body">

                      <h5>
                        {course.title}
                      </h5>

                      <p>
                        {
                          course.description
                        }
                      </p>

                      <h6>
                        ₹{course.price}
                      </h6>


                      <div className="d-flex gap-2 mt-3">

                        <button

                          className="btn btn-warning btn-sm"

                          onClick={() =>
                            handleEdit(
                              course
                            )
                          }

                        >
                          Edit
                        </button>


                        <button

                          className="btn btn-danger btn-sm"

                          onClick={() =>
                            handleDelete(
                              course.id
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

export default AdminCourses;