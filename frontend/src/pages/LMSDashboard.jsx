import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { lmsAPI } from '../services/api';
import { getUser } from '../utils/auth';

const LMSDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const user = getUser();

    if (!user) {
      navigate('/login');
      return;
    }

    lmsAPI.getCourses(user.id)
      .then((response) => {
        if (response.success) setCourses(response.data || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h1 className="mb-4">My Courses</h1>

      {courses.length === 0 ? (
        <div className="alert alert-info">
          No purchased courses found.{' '}
          <Link to="/courses">Browse courses</Link>
        </div>
      ) : (
        <div className="row">
          {courses.map((item) => {
            const course = item.courses;
            return (
              <div key={course.id} className="col-md-4 mb-4">
                <div className="card h-100 shadow border-0">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="card-img-top"
                    style={{ height: '220px', objectFit: 'cover' }}
                  />
                  <div className="card-body">
                    <h5>{course.title}</h5>
                    <p>{course.description}</p>
                    <Link to={`/lms/course/${course.id}`} className="btn btn-primary">
                      Start Learning...
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LMSDashboard;
