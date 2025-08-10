import { v4 as uuidv4 } from 'uuid';
import model from './model.js';

export function findAllEnrollments() {
  return model.find();
}

export function findEnrollmentsForUser(userId) {
  return model.find({ user: userId });
}

export function findEnrollmentsForCourse(courseId) {
  return model.find({ course: courseId });
}

export function findUsersForCourse(courseId) {
  const enrollments = model.find({ course: courseId }).populate('user');
  return enrollments.map((enrollment) => enrollment.user);
}

export function findCoursesForUser(userId) {
  const enrollments = model.find({ user: userId }).populate('course');
  return enrollments.map((enrollment) => enrollment.course);
}

export function isUserEnrolledInCourse(userId, courseId) {
  return model.exists({ user: userId, course: courseId });
}

export function enrollUserInCourse(userId, courseId) {
  return model.create({
    user: userId,
    course: courseId,
    _id: `${userId}-${courseId}`,
  });
}

export function unenrollUserFromCourse(userId, courseId) {
  return model.deleteOne({ user: userId, course: courseId });
}
