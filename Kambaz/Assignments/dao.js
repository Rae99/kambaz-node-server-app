import Database from '../Database/index.js';
import { v4 as uuidv4 } from 'uuid';

export function findAllAssignments() {
  return Database.assignments;
}

export function findAssignmentById(assignmentId) {
  const { assignments } = Database;
  return assignments.find((assignment) => assignment._id === assignmentId);
}

export function findAssignmentsForCourse(courseId) {
  const { assignments } = Database;
  return assignments.filter((assignment) => assignment.course === courseId);
}

export function createAssignment(assignment) {
  const newAssignment = { ...assignment, _id: uuidv4() };
  Database.assignments = [...Database.assignments, newAssignment];
  return newAssignment;
}

export function updateAssignment(assignmentId, assignmentUpdates) {
  const { assignments } = Database;
  const assignment = assignments.find(
    (assignment) => assignment._id === assignmentId
  );
  if (assignment) {
    Object.assign(assignment, assignmentUpdates);
    return assignment;
  }
  return null;
}

export function deleteAssignment(assignmentId) {
  const { assignments } = Database;
  const beforeCount = assignments.length;
  Database.assignments = assignments.filter(
    (assignment) => assignment._id !== assignmentId
  );
  const afterCount = Database.assignments.length;
  if (afterCount < beforeCount) {
    return { success: true, deleted: 1 };
  } else {
    return { success: false, deleted: 0, error: 'Assignment not found' };
  }
}
