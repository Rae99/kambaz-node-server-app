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

export async function findUsersForCourse(courseId) {
  const enrollments = await model.find({ course: courseId }).populate('user');
  return enrollments.map((enrollment) => enrollment.user);
}

export async function findCoursesForUser(userId) {
  const enrollments = await model.find({ user: userId }).populate('course');
  return enrollments.map((enrollment) => enrollment.course);
}

export function isUserEnrolledInCourse(userId, courseId) {
  return model.exists({ user: userId, course: courseId });
}

export async function enrollUserInCourse(userId, courseId) {
  // Check if already enrolled
  const existingEnrollment = await model.findOne({
    user: userId,
    course: courseId,
  });
  if (existingEnrollment) {
    return {
      success: false,
      message: 'User already enrolled in this course',
      enrollment: existingEnrollment,
    };
  }

  try {
    const enrollment = await model.create({
      user: userId,
      course: courseId,
      _id: `${userId}-${courseId}`,
    });
    return { success: true, enrollment };
  } catch (error) {
    if (error.code === 11000) {
      // Duplicate key error
      return {
        success: false,
        message: 'User already enrolled in this course',
      };
    }
    throw error;
  }
}

export function unenrollUserFromCourse(userId, courseId) {
  return model.deleteOne({ user: userId, course: courseId });
}
