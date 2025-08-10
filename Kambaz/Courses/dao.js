import model from './model.js';
import enrollmentModel from '../Enrollments/model.js';

export function findAllCourses() {
  return model.find();
}

export async function findCoursesForEnrolledUser(userId) {
  // First find all enrollments for this user
  const enrollments = await enrollmentModel.find({ user: userId });
  // Extract course IDs
  const courseIds = enrollments.map((enrollment) => enrollment.course);
  // Find all courses with those IDs
  return model.find({ _id: { $in: courseIds } });
}

export function createCourse(course) {
  return model.create(course);
}

export function deleteCourse(courseId) {
  return model.deleteOne({ _id: courseId });
}

export function updateCourse(courseId, courseUpdates) {
  return model.updateOne({ _id: courseId }, { $set: courseUpdates });
}

// Object.assign(target, source)
// •	Mutates the target object in place.
// •	Copies all properties from source to target.
// •	So the object in the original array (and “database”) is updated in place.

// “normal” assign (=)
// You are replacing the reference to the course object, not updating the original course in the array.
// •	This means the original courses array still points to the old object, so the update is NOT reflected in the array/database.

// let course = courses.find(c => c._id === '2');  // points to { _id: '2', name: 'Science' }
// course = { _id: '2', name: 'Biology' };         // <-- THIS ONLY changes the local variable

// so it's like course is a pointer
// after the assignment, it will point to { _id: '2', name: 'Biology' };
