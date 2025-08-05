import Database from '../Database/index.js';
import { v4 as uuidv4 } from 'uuid';

export function findAllEnrollments() {
  return Database.enrollments;
}

export function findEnrollmentsForUser(userId) {
  const { enrollments } = Database;
  return enrollments.filter((enrollment) => enrollment.user === userId);
}

export function findEnrollmentsForCourse(courseId) {
  const { enrollments } = Database;
  return enrollments.filter((enrollment) => enrollment.course === courseId);
}

export function findUsersForCourse(courseId) {
  const { enrollments, users } = Database;
  const enrolledUserIds = enrollments
    .filter((enrollment) => enrollment.course === courseId)
    .map((enrollment) => enrollment.user);

  return users.filter((user) => enrolledUserIds.includes(user._id));
}

export function isUserEnrolledInCourse(userId, courseId) {
  const { enrollments } = Database;
  return enrollments.some(
    (enrollment) => enrollment.user === userId && enrollment.course === courseId
  );
}

export function enrollUserInCourse(userId, courseId) {
  const { enrollments } = Database;

  // Check if already enrolled
  if (isUserEnrolledInCourse(userId, courseId)) {
    return { success: false, error: 'User already enrolled in this course' };
  }

  const newEnrollment = { _id: uuidv4(), user: userId, course: courseId };
  Database.enrollments = [...enrollments, newEnrollment];
  return { success: true, enrollment: newEnrollment };
}

export function unenrollUserFromCourse(userId, courseId) {
  const { enrollments } = Database;
  const beforeCount = enrollments.length;

  Database.enrollments = enrollments.filter(
    (enrollment) =>
      !(enrollment.user === userId && enrollment.course === courseId)
  );

  const afterCount = Database.enrollments.length;
  if (afterCount < beforeCount) {
    return { success: true, unenrolled: 1 };
  } else {
    return { success: false, error: 'Enrollment not found' };
  }
}
