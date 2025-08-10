import * as dao from './dao.js';

export default function AssignmentRoutes(app) {
  const findAllAssignments = async (req, res) => {
    try {
      const assignments = await dao.findAllAssignments();
      res.json(assignments);
    } catch (error) {
      console.error('Find all assignments error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  const findAssignmentById = async (req, res) => {
    try {
      const { assignmentId } = req.params;
      const assignment = await dao.findAssignmentById(assignmentId);
      if (assignment) {
        res.json(assignment);
      } else {
        res.status(404).json({ error: 'Assignment not found' });
      }
    } catch (error) {
      console.error('Find assignment by ID error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  const findAssignmentsForCourse = async (req, res) => {
    try {
      const { courseId } = req.params;
      const assignments = await dao.findAssignmentsForCourse(courseId);
      res.json(assignments);
    } catch (error) {
      console.error('Find assignments for course error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  const updateAssignment = async (req, res) => {
    try {
      const { assignmentId } = req.params;
      const assignmentUpdates = req.body;
      const updatedAssignment = await dao.updateAssignment(
        assignmentId,
        assignmentUpdates
      );
      if (updatedAssignment) {
        res.json(updatedAssignment);
      } else {
        res.status(404).json({ error: 'Assignment not found' });
      }
    } catch (error) {
      console.error('Update assignment error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  const deleteAssignment = async (req, res) => {
    try {
      const { assignmentId } = req.params;
      const result = await dao.deleteAssignment(assignmentId);
      if (result.deletedCount > 0) {
        res
          .status(200)
          .json({ success: true, message: 'Assignment deleted successfully' });
      } else {
        res.status(404).json({ success: false, error: 'Assignment not found' });
      }
    } catch (error) {
      console.error('Delete assignment error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  const createAssignmentForCourse = async (req, res) => {
    try {
      const { courseId } = req.params;
      const assignmentData = { ...req.body, course: courseId };
      const newAssignment = await dao.createAssignment(assignmentData);
      res.status(201).json(newAssignment);
    } catch (error) {
      console.error('Create assignment error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
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
