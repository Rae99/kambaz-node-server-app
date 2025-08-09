import model from './model.js';

export function findAllCourses() {
  return model.find();
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
