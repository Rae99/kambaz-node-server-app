import * as dao from './dao.js';

export default function EnrollmentRoutes(app) {
  const findAllEnrollments = async (req, res) => {
    try {
      const enrollments = await dao.findAllEnrollments();
      res.json(enrollments);
    } catch (error) {
      console.error('Find all enrollments error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  const findEnrollmentsForUser = async (req, res) => {
    try {
      const { userId } = req.params;
      const enrollments = await dao.findEnrollmentsForUser(userId);
      res.json(enrollments);
    } catch (error) {
      console.error('Find enrollments for user error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  const findEnrollmentsForCourse = async (req, res) => {
    try {
      const { courseId } = req.params;
      const enrollments = await dao.findEnrollmentsForCourse(courseId);
      res.json(enrollments);
    } catch (error) {
      console.error('Find enrollments for course error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  const findUsersForCourse = async (req, res) => {
    try {
      const { courseId } = req.params;
      const users = await dao.findUsersForCourse(courseId);
      res.json(users);
    } catch (error) {
      console.error('Find users for course error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  // enrollUserInCourse and unenrollUserFromCourse functions moved to Users/routes.js

  const checkEnrollmentStatus = async (req, res) => {
    try {
      const { userId, courseId } = req.params;
      const isEnrolled = await dao.isUserEnrolledInCourse(userId, courseId);
      res.json({ enrolled: isEnrolled });
    } catch (error) {
      console.error('Check enrollment status error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  // Route definitions
  app.get('/api/enrollments', findAllEnrollments);
  app.get('/api/users/:userId/enrollments', findEnrollmentsForUser);
  app.get('/api/courses/:courseId/enrollments', findEnrollmentsForCourse);
  app.get('/api/courses/:courseId/users', findUsersForCourse);

  // Enrollment operations moved to Users/routes.js
  // app.post('/api/users/:uid/courses/:cid', enrollUserInCourse);
  // app.delete('/api/users/:uid/courses/:cid', unenrollUserFromCourse);
  app.get(
    '/api/courses/:courseId/users/:userId/enrollment',
    checkEnrollmentStatus
  );
}
