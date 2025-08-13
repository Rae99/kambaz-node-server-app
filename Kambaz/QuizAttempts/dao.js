import model from './model.js';

// Get all attempts for a specific quiz (for faculty)
export async function findAttemptsByQuiz(quizId) {
  return model
    .find({ quizId })
    .populate('studentId', 'firstName lastName username');
}

// Get all attempts for a specific student on a specific quiz
export async function findAttemptsByStudentAndQuiz(studentId, quizId) {
  return model.find({ studentId, quizId }).sort({ attemptNumber: 1 });
}

// Get all attempts for a specific student (across all quizzes)
export async function findAttemptsByStudent(studentId) {
  return model.find({ studentId }).populate('quizId', 'title courseId');
}

// Get all attempts for a specific course
export async function findAttemptsByCourse(courseId) {
  // First find all quizzes in the course, then find attempts for those quizzes
  const quizModel = (await import('../Quizzes/model.js')).default;
  const quizzes = await quizModel.find({ courseId }, { _id: 1 });
  const quizIds = quizzes.map((quiz) => quiz._id);

  return model
    .find({ quizId: { $in: quizIds } })
    .populate('studentId', 'firstName lastName username')
    .populate('quizId', 'title');
}

// Get the latest attempt for a student on a quiz
export async function findLatestAttempt(studentId, quizId) {
  return model.findOne({ studentId, quizId }).sort({ attemptNumber: -1 });
}

// Get attempt count for a student on a quiz
export async function getAttemptCount(studentId, quizId) {
  return model.countDocuments({ studentId, quizId });
}

// Create a new quiz attempt
export async function createAttempt(attemptData) {
  // Auto-increment attempt number
  const attemptCount = await getAttemptCount(
    attemptData.studentId,
    attemptData.quizId
  );
  const newAttempt = {
    ...attemptData,
    attemptNumber: attemptCount + 1,
    startedAt: new Date(),
  };

  return model.create(newAttempt);
}

// Update an existing attempt (for saving progress)
export async function updateAttempt(attemptId, updates) {
  return model.findByIdAndUpdate(attemptId, updates, { new: true });
}

// Submit an attempt (mark as completed)
export async function submitAttempt(attemptId, finalAnswers, score) {
  return model.findByIdAndUpdate(
    attemptId,
    {
      answers: finalAnswers,
      score: score,
      isCompleted: true,
      submittedAt: new Date(),
    },
    { new: true }
  );
}

// Delete an attempt
export async function deleteAttempt(attemptId) {
  return model.findByIdAndDelete(attemptId);
}

// Find attempt by ID
export async function findAttemptById(attemptId) {
  return model
    .findById(attemptId)
    .populate('studentId', 'firstName lastName username')
    .populate('quizId', 'title courseId');
}
