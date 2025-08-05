import * as dao from './dao.js';

export default function EnrollmentRoutes(app) {
  const findAllEnrollments = (req, res) => {
    const enrollments = dao.findAllEnrollments();
    res.json(enrollments);
  };

  const findEnrollmentsForUser = (req, res) => {
    const { userId } = req.params;
    const enrollments = dao.findEnrollmentsForUser(userId);
    res.json(enrollments);
  };

  const findEnrollmentsForCourse = (req, res) => {
    const { courseId } = req.params;
    const enrollments = dao.findEnrollmentsForCourse(courseId);
    res.json(enrollments);
  };

  const findUsersForCourse = (req, res) => {
    const { courseId } = req.params;
    const users = dao.findUsersForCourse(courseId);
    res.json(users);
  };

  const enrollUserInCourse = (req, res) => {
    const { userId, courseId } = req.params;
    const result = dao.enrollUserInCourse(userId, courseId);

    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(400).json(result);
    }
  };

  const unenrollUserFromCourse = (req, res) => {
    const { userId, courseId } = req.params;
    const result = dao.unenrollUserFromCourse(userId, courseId);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(404).json(result);
    }
  };

  const checkEnrollmentStatus = (req, res) => {
    const { userId, courseId } = req.params;
    const isEnrolled = dao.isUserEnrolledInCourse(userId, courseId);
    res.json({ enrolled: isEnrolled });
  };

  // Route definitions
  app.get('/api/enrollments', findAllEnrollments);
  app.get('/api/users/:userId/enrollments', findEnrollmentsForUser);
  app.get('/api/courses/:courseId/enrollments', findEnrollmentsForCourse);
  app.get('/api/courses/:courseId/users', findUsersForCourse);

  // Enrollment operations
  app.post('/api/courses/:courseId/enroll/:userId', enrollUserInCourse);
  app.delete('/api/courses/:courseId/unenroll/:userId', unenrollUserFromCourse);
  app.get(
    '/api/courses/:courseId/users/:userId/enrollment',
    checkEnrollmentStatus
  );
}
