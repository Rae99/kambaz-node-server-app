// findAllQuizzes, findQuizzesByCourse, createQuiz, updateQuiz, deleteQuiz 等

import model from './model.js';
import { v4 as uuidv4 } from 'uuid';

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
  const newQuiz = {
    ...quiz,
    _id: quiz._id || uuidv4()
  };
  return model.create(newQuiz);
}

export async function updateQuiz(quizId, quiz) {
  return model.findByIdAndUpdate(quizId, quiz, { new: true });
}

export async function deleteQuiz(quizId) {
  return model.findByIdAndDelete(quizId);
}
