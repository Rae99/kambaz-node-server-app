import * as dao from './dao.js';
import * as courseDao from '../Courses/dao.js';

export default function UserRoutes(app) {
  const createUser = (req, res) => {};
  const deleteUser = (req, res) => {};
  const findAllUsers = (req, res) => {};
  const findUserById = (req, res) => {};

  const updateUser = (req, res) => {
    const userId = req.params.userId;
    const userUpdates = req.body; //  a JavaScript object, not necessarily a user object — it's just the properties sent in the request (maybe { email: "new@example.com" } or something).
    dao.updateUser(userId, userUpdates);
    const currentUser = dao.findUserById(userId); // After the update, you fetch the fresh user(new object) from the DAO:
    req.session['currentUser'] = currentUser; // Then you overwrite the session's copy, making session.currentUser point to the new object.
    res.json(currentUser);
  };

  const signup = (req, res) => {
    const user = dao.findUserByUsername(req.body.username);
    if (user) {
      res.status(400).json({ message: 'Username already in use' });
      return;
    }
    const newUser = dao.createUser(req.body);
    req.session['currentUser'] = newUser;
    res.json(newUser);
  };

  const signin = (req, res) => {
    const { username, password } = req.body;
    const user = dao.findUserByCredentials(username, password);
    if (user) {
      req.session['currentUser'] = user;
      res.json(user);
    } else {
      res.status(400).json({ message: 'Unable to login. Try again later.' });
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

  const findCoursesForEnrolledUser = (req, res) => {
    let { userId } = req.params;
    if (userId === 'current') {
      const currentUser = req.session['currentUser'];
      if (!currentUser) {
        res.sendStatus(401);
        return;
      }
      userId = currentUser._id;
    }
    const courses = courseDao.findCoursesForEnrolledUser(userId);
    res.json(courses);
  };

  // Route definitions - more specific routes first
  app.get('/api/users/:userId/courses', findCoursesForEnrolledUser);
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
