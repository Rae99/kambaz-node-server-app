import * as dao from './dao.js';
import * as modulesDao from '../Modules/dao.js';
import * as enrollmentsDao from '../Enrollments/dao.js';
import * as quizzesDao from '../Quizzes/dao.js';

export default function CourseRoutes(app) {
  const findAllCourses = async (req, res) => {
    const courses = await dao.findAllCourses();
    res.send(courses);
  };

  const createCourse = async (req, res) => {
    const course = await dao.createCourse(req.body);
    const currentUser = req.session['currentUser'];
    if (currentUser) {
      await enrollmentsDao.enrollUserInCourse(currentUser._id, course._id);
    }
    res.json(course);
  };

  const deleteCourse = async (req, res) => {
    const { courseId } = req.params;
    const status = await dao.deleteCourse(courseId);
    res.send(status);
  };

  const updateCourse = async (req, res) => {
    const { courseId } = req.params;
    const courseUpdates = req.body;
    const status = await dao.updateCourse(courseId, courseUpdates);
    res.send(status);
  };

  const findModulesForCourse = async (req, res) => {
    const { courseId } = req.params;
    const modules = await modulesDao.findModulesForCourse(courseId);
    res.json(modules);
  };

  const createModuleForCourse = async (req, res) => {
    const { courseId } = req.params;
    const module = {
      ...req.body,
      course: courseId,
    };
    const newModule = await modulesDao.createModule(module);
    res.send(newModule);
  };

  const findUsersForCourse = async (req, res) => {
    const { cid } = req.params;
    const users = await enrollmentsDao.findUsersForCourse(cid);
    res.json(users);
  };

  const findQuizzesByCourse = async (req, res) => {
    try {
      const { courseId } = req.params;
      const currentUser = req.session?.currentUser;

      if (!currentUser) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      let quizzes = await quizzesDao.findQuizzesByCourse(courseId);

      // Students(and users) can only see published quizzes
      if (currentUser.role === 'STUDENT' || currentUser.role === 'USER') {
        quizzes = quizzes.filter((quiz) => quiz.isPublished === true);
      }

      res.json(quizzes);
    } catch (error) {
      console.error('Find quizzes by course error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  const createQuizForCourse = async (req, res) => {
    const { courseId } = req.params;
    const quiz = req.body;
    const newQuiz = await quizzesDao.createQuizForCourse(courseId, quiz);
    res.json(newQuiz);
  };

  app.get('/api/courses/:courseId/quizzes', findQuizzesByCourse);
  app.post('/api/courses/:courseId/quizzes', createQuizForCourse);

  app.post('/api/courses/:courseId/modules', createModuleForCourse);
  app.get('/api/courses/:courseId/modules', findModulesForCourse);
  app.put('/api/courses/:courseId', updateCourse);
  app.delete('/api/courses/:courseId', deleteCourse);
  app.get('/api/courses', findAllCourses);
  app.post('/api/courses', createCourse);
  app.get('/api/courses/:cid/users', findUsersForCourse);
}
