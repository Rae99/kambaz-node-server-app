import Database from '../Database/index.js';
import { v4 as uuidv4 } from 'uuid';

export function findAllCourses() {
  return Database.courses;
}

export function findCoursesForEnrolledUser(userId) {
  const { courses, enrollments } = Database;
  const enrolledCourses = courses.filter((course) =>
    enrollments.some(
      (enrollment) =>
        enrollment.user === userId && enrollment.course === course._id
    )
  );
  return enrolledCourses;
}

export function createCourse(course) {
  const newCourse = { ...course, _id: uuidv4() };
  Database.courses = [...Database.courses, newCourse];
  return newCourse;
}

export function deleteCourse(courseId) {
    const { courses, enrollments } = Database;
    const beforeCount = courses.length;
    Database.courses = courses.filter((course) => course._id !== courseId);
    Database.enrollments = enrollments.filter(
      (enrollment) => enrollment.course !== courseId
    );
    const afterCount = Database.courses.length;
    if (afterCount < beforeCount) {
      return { success: true, deleted: 1 };
    } else {
      return { success: false, deleted: 0, error: "Course not found" };
    }
}

export function updateCourse(courseId, courseUpdates) {
    const { courses } = Database;
    const course = courses.find((course) => course._id === courseId);
    Object.assign(course, courseUpdates);
    return course;
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