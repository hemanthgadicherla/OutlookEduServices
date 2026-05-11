import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../services/supabase";

const BlogDetail = () => {

  const { id } = useParams();

  const [blog, setBlog] =
    useState(null);

  const [otherBlogs,
  setOtherBlogs] = useState([]);

  useEffect(() => {

    fetchBlog();

    fetchOtherBlogs();

  }, []);

  const fetchBlog = async () => {

    const { data, error } =
      await supabase
        .from("blogs")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {

      console.log(error);

      return;
    }

    setBlog(data);
  };

  const fetchOtherBlogs =
    async () => {

    const { data, error } =
      await supabase
        .from("blogs")
        .select("*")
        .neq("id", id)
        .limit(3);

    if (!error) {

      setOtherBlogs(data);
    }
  };

  if (!blog) {

    return (
      <h1 className="text-center py-5">
        Loading...
      </h1>
    );
  }

  return (

    <div className="container text-center py-5">

      <img
        src={blog.image}
        alt={blog.title}
        className="img-fluid rounded mb-4"
        style={{
          width: "100%",
          maxHeight: "500px",
          objectFit: "cover",
        }}
      />

      <h1 className="mb-3">
        {blog.title}
      </h1>

      <div className="mb-4 text-muted">

        By {blog.author}
        {" • "}
        {
          blog.date
        ? new Date(blog.date).toLocaleDateString() : "No Date"
        }

        {" • "}

        {blog.readTime}

      </div>

      <div
        style={{
          whiteSpace: "pre-line",
          lineHeight: "1.9",
          fontSize: "18px",
        }}
      >
        {blog.full_content || blog.content}
      </div>

      <hr className="my-5" />

        <div className="text-center">

        <Link
            to="/blogs"
            className="btn btn-primary px-4 py-2"
        >
            ← Other Blogs
        </Link>

        </div>

    </div>
  );
};

export default BlogDetail;