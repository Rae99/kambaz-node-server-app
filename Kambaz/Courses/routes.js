import * as dao from './dao.js';
export default function CourseRoutes(app) {
  const findAllCourses = (req, res) => {
    const courses = dao.findAllCourses();
    res.send(courses);
  };

  const deleteCourse = (req, res) => {
    const { courseId } = req.params;
    const status = dao.deleteCourse(courseId);
    if (status.success) {
      res.status(200).send(status);
    } else {
      res.status(404).send(status);
    }
  };

  app.delete('/api/courses/:courseId', deleteCourse);
  app.get('/api/courses', findAllCourses);
}
