export default function CourseRoutes(app) {
    const findAllCourses = (req, res) => {
      const courses = dao.findAllCourses();
      res.send(courses);
    }
    app.get("/api/courses", findAllCourses);
  }