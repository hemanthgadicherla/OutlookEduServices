import React, { useEffect, useState } from "react";
import { supabase } from "../services/supabase";
import AdminSidebar from "../components/AdminSidebar";

const AdminCourses = () => {

  const [courses, setCourses] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [fullDescription, setFullDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [documentFile, setDocumentFile] = useState(null);
  const [courseDocument, setCourseDocument] = useState("");
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

    let imageUrl = image;

    if (imageFile) {

  const fileName =
    `${Date.now()}-${imageFile.name}`;

  const { error: uploadError } =
    await supabase.storage
      .from("course-images")
      .upload(
        fileName,
        imageFile
      );

    if (uploadError) {

      console.log(uploadError);

    return;
  }

  const { data } =
    supabase.storage
      .from("course-images")
      .getPublicUrl(fileName);

    imageUrl = data.publicUrl;
  }

  let documentUrl = courseDocument;

if (documentFile) {

  const fileName =
    `${Date.now()}-${documentFile.name}`;

  const { error: uploadError } =
    await supabase.storage
      .from("course-documents")
      .upload(
        fileName,
        documentFile
      );

  if (uploadError) {

    console.log(uploadError);

    return;
  }

  const { data } =
    supabase.storage
      .from("course-documents")
      .getPublicUrl(fileName);

  documentUrl =
    data.publicUrl;
}

    if (editingId) {

  const { error } =
    await supabase
      .from("courses")
      .update({
        title,
        description,
        full_description:
          fullDescription,
        price,
        image: imageUrl,
        course_document:
          documentUrl,
      })
      .eq("id", editingId);

  console.log(error);

} else {

  const { data, error } =
    await supabase
      .from("courses")
      .insert([
        {
          title,
          description,
          full_description:
            fullDescription,
          price,
          image: imageUrl,
          course_document:
            documentUrl,
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

  setDescription(
    course.description
  );

  setFullDescription(
    course.full_description
  );

  setPrice(course.price);

  setImage(course.image);

  setCourseDocument(
    course.course_document
  );
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
    setFullDescription("");
    setPrice("");
    setImage("");
    setCourseDocument("");
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

            <textarea
              placeholder="Full Course Details"
              className="form-control mb-3"
              rows="10"
              value={fullDescription}
              onChange={(e) =>
                setFullDescription(
                  e.target.value
                )
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
              type="file"
              className="form-control mb-3"
              onChange={(e) =>
                setImageFile(
                  e.target.files[0])
              }
            />

            <input
              type="file"
              className="form-control mb-3"

              accept=".pdf,.doc,.docx"

              onChange={(e) =>
                setDocumentFile(
                  e.target.files[0]
                )
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