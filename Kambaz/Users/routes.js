import * as dao from './dao.js';
import * as courseDao from '../Courses/dao.js';
import * as enrollmentsDao from '../Enrollments/dao.js';

export default function UserRoutes(app) {
  const createUser = async (req, res) => {
    try {
      const newUser = await dao.createUser(req.body);
      res.json(newUser);
    } catch (error) {
      console.error('Create user error:', error);
      res
        .status(500)
        .json({ message: 'Internal server error', error: error.message });
    }
  };

  const deleteUser = async (req, res) => {
    try {
      const userId = req.params.userId;
      const status = await dao.deleteUser(userId);
      res.json(status);
    } catch (error) {
      console.error('Delete user error:', error);
      res
        .status(500)
        .json({ message: 'Internal server error', error: error.message });
    }
  };

  const findAllUsers = async (req, res) => {
    try {
      const { role, name } = req.query;

      if (name && role) {
        // Both name and role filters
        const users = await dao.findUsersByNameAndRole(name, role);
        res.json(users);
        return;
      }

      if (role) {
        const users = await dao.findUsersByRole(role);
        res.json(users);
        return;
      }

      if (name) {
        const users = await dao.findUsersByPartialName(name);
        res.json(users);
        return;
      }

      const users = await dao.findAllUsers();
      res.json(users);
    } catch (error) {
      console.error('Find all users error:', error);
      res
        .status(500)
        .json({ message: 'Internal server error', error: error.message });
    }
  };

  const findUserById = async (req, res) => {
    try {
      const userId = req.params.userId;
      const user = await dao.findUserById(userId);
      if (user) {
        res.json(user);
      } else {
        res.sendStatus(404);
      }
    } catch (error) {
      console.error('Find user by ID error:', error);
      res
        .status(500)
        .json({ message: 'Internal server error', error: error.message });
    }
  };

  const updateUser = async (req, res) => {
    try {
      const userId = req.params.userId;
      const userUpdates = req.body;

      const updatedUser = await dao.updateUser(userId, userUpdates);

      if (updatedUser) {
        req.session['currentUser'] = updatedUser;
        res.json(updatedUser);
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      console.error('Update user error:', error);
      res
        .status(500)
        .json({ message: 'Internal server error', error: error.message });
    }
  };

  const signup = async (req, res) => {
    try {
      const user = await dao.findUserByUsername(req.body.username);
      if (user) {
        res.status(400).json({ message: 'Username already in use' });
        return;
      }
      const newUser = await dao.createUser(req.body);
      req.session['currentUser'] = newUser;
      res.json(newUser);
    } catch (error) {
      console.error('Signup error:', error);
      res
        .status(500)
        .json({ message: 'Internal server error', error: error.message });
    }
  };

  const signin = async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await dao.findUserByCredentials(username, password);
      if (user) {
        req.session['currentUser'] = user;
        res.json(user);
      } else {
        res.status(401).json({ message: 'Invalid username or password' });
      }
    } catch (error) {
      console.error('Signin error:', error);
      res
        .status(500)
        .json({ message: 'Internal server error', error: error.message });
    }
  };

  const profile = async (req, res) => {
    const currentUser = req.session['currentUser'];
    if (!currentUser) {
      res.sendStatus(401); //  status code 401 Unauthorized.
      return;
    }
    res.json(currentUser);
  };

  const signout = (req, res) => {
    req.session.destroy();
    res.sendStatus(200);
  };

  const findCoursesForEnrolledUser = async (req, res) => {
    try {
      let { userId } = req.params;
      if (userId === 'current') {
        const currentUser = req.session['currentUser'];
        if (!currentUser) {
          res.sendStatus(401);
          return;
        }
        userId = currentUser._id;
      }
      const courses = await courseDao.findCoursesForEnrolledUser(userId);
      res.json(courses);
    } catch (error) {
      console.error('Find courses for user error:', error);
      res
        .status(500)
        .json({ message: 'Internal server error', error: error.message });
    }
  };

  const createCourse = async (req, res) => {
    try {
      const currentUser = req.session['currentUser'];
      if (!currentUser) {
        return res.status(401).json({ error: 'Not logged in' });
      }
      const newCourse = await courseDao.createCourse(req.body);
      const enrollResult = await enrollmentsDao.enrollUserInCourse(
        currentUser._id,
        newCourse._id
      );
      if (!enrollResult.success) {
        console.warn('Enrollment warning:', enrollResult.message);
      }
      res.json(newCourse);
    } catch (error) {
      console.error('Create course error:', error);
      res
        .status(500)
        .json({ message: 'Internal server error', error: error.message });
    }
  };

  const enrollUserInCourse = async (req, res) => {
    try {
      const { uid, cid } = req.params; // uid = userId, cid = courseId
      const result = await enrollmentsDao.enrollUserInCourse(uid, cid);

      if (result.success) {
        res.status(201).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error('Enrollment error:', error);
      res
        .status(500)
        .json({ success: false, message: 'Internal server error' });
    }
  };

  const unenrollUserFromCourse = async (req, res) => {
    try {
      const { uid, cid } = req.params; // uid = userId, cid = courseId
      const result = await enrollmentsDao.unenrollUserFromCourse(uid, cid);

      if (result.deletedCount > 0) {
        res
          .status(200)
          .json({ success: true, message: 'Unenrolled successfully' });
      } else {
        res
          .status(404)
          .json({ success: false, message: 'Enrollment not found' });
      }
    } catch (error) {
      console.error('Unenroll error:', error);
      res
        .status(500)
        .json({ success: false, message: 'Internal server error' });
    }
  };

  // Route definitions - more specific routes first
  app.post('/api/users/current/courses', createCourse);
  app.get('/api/users/:userId/courses', findCoursesForEnrolledUser);

  // Enrollment routes with semantic URLs
  app.post('/api/users/:uid/courses/:cid', enrollUserInCourse);
  app.delete('/api/users/:uid/courses/:cid', unenrollUserFromCourse);

  app.post('/api/users', createUser);
  app.get('/api/users', findAllUsers);
  app.get('/api/users/:userId', findUserById);
  app.put('/api/users/:userId', updateUser);
  app.delete('/api/users/:userId', deleteUser);
  app.post('/api/users/signup', signup);
  app.post('/api/users/signin', signin);
  app.post('/api/users/signout', signout);
  app.post('/api/users/profile', profile);
}
