import * as dao from './dao.js';

export default function AssignmentRoutes(app) {
  const findAllAssignments = (req, res) => {
    const assignments = dao.findAllAssignments();
    res.json(assignments);
  };

  const findAssignmentById = (req, res) => {
    const { assignmentId } = req.params;
    const assignment = dao.findAssignmentById(assignmentId);
    if (assignment) {
      res.json(assignment);
    } else {
      res.status(404).json({ error: 'Assignment not found' });
    }
  };

  const findAssignmentsForCourse = (req, res) => {
    const { courseId } = req.params;
    const assignments = dao.findAssignmentsForCourse(courseId);
    res.json(assignments);
  };

  const updateAssignment = (req, res) => {
    const { assignmentId } = req.params;
    const assignmentUpdates = req.body;
    const updatedAssignment = dao.updateAssignment(
      assignmentId,
      assignmentUpdates
    );
    if (updatedAssignment) {
      res.json(updatedAssignment);
    } else {
      res.status(404).json({ error: 'Assignment not found' });
    }
  };

  const deleteAssignment = (req, res) => {
    const { assignmentId } = req.params;
    const status = dao.deleteAssignment(assignmentId);
    if (status.success) {
      res.status(200).json(status);
    } else {
      res.status(404).json(status);
    }
  };

  const createAssignmentForCourse = (req, res) => {
    const { courseId } = req.params;
    const assignmentData = { ...req.body, course: courseId };
    const newAssignment = dao.createAssignment(assignmentData);
    res.status(201).json(newAssignment);
  };

  // Route definitions
  app.get('/api/assignments', findAllAssignments);
  app.get('/api/assignments/:assignmentId', findAssignmentById);
  app.put('/api/assignments/:assignmentId', updateAssignment);
  app.delete('/api/assignments/:assignmentId', deleteAssignment);

  // Course-specific assignments routes
  app.get('/api/courses/:courseId/assignments', findAssignmentsForCourse);
  app.post('/api/courses/:courseId/assignments', createAssignmentForCourse);
}