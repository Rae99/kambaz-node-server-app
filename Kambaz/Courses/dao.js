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
