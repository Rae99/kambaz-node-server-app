import mongoose from 'mongoose';
import quizAttemptSchema from './schema.js';

const QuizAttemptModel = mongoose.model('QuizAttempt', quizAttemptSchema);

export default QuizAttemptModel;
