
// findAllQuizzes, findQuizzesByCourse, createQuiz, updateQuiz, deleteQuiz 等

import model from './model.js';

export async function findAllQuizzes() {
  return model.find();
}

export async function findQuizzesByCourse(courseId) {
  return model.find({ courseId });
}

export async function findQuizById(qid) {
  return model.findById(qid);
}

export async function createQuizForCourse(courseId, quiz) {
  const newQuiz = { ...quiz, courseId: courseId };
  return model.create(newQuiz);
}

export async function updateQuiz(quizId, quiz) {
  return model.findByIdAndUpdate(quizId, quiz, { new: true });
}

export async function deleteQuiz(quizId) {
  return model.findByIdAndDelete(quizId);
}
