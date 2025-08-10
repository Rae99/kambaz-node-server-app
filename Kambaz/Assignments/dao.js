import { v4 as uuidv4 } from 'uuid';
import model from './model.js';

export async function findAllAssignments() {
  return model.find();
}

export async function findAssignmentById(assignmentId) {
  return model.findById(assignmentId);
}

export async function findAssignmentsForCourse(courseId) {
  return model.find({ course: courseId });
}

export async function createAssignment(assignment) {
  const newAssignment = { ...assignment, _id: uuidv4() };
  return model.create(newAssignment);
}

export async function updateAssignment(assignmentId, assignmentUpdates) {
  return model.findByIdAndUpdate(
    assignmentId,
    { $set: assignmentUpdates },
    { new: true }
  );
}

export async function deleteAssignment(assignmentId) {
  return model.deleteOne({ _id: assignmentId });
}
