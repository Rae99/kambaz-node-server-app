import * as dao from './dao.js';
import * as modulesDao from '../Modules/dao.js';

export default function CourseRoutes(app) {
  const findAllCourses = async (req, res) => {
    const courses = await dao.findAllCourses();
    res.send(courses);
  };

  const deleteCourse = async (req, res) => {
    const { courseId } = req.params;
    const status = await dao.deleteCourse(courseId);
    if (status.success) {
      res.status(200).send(status);
    } else {
      res.status(404).send(status);
    }
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
    
  app.post('/api/courses/:courseId/modules', createModuleForCourse);
  app.get('/api/courses/:courseId/modules', findModulesForCourse);
  app.put('/api/courses/:courseId', updateCourse);
  app.delete('/api/courses/:courseId', deleteCourse);
  app.get('/api/courses', findAllCourses);
}
