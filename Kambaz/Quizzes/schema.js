import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['multiple-choice', 'true-false', 'fill-in-the-blank'],
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  points: {
    type: Number,
    required: true,
  },
  options: [String],
  correctAnswer: {
    type: String,
    required: true,
  },
  explanation: String,
});

const quizSchema = new mongoose.Schema(
  {
    _id: String,
    title: { type: String, required: true },
    description: String,
    courseId: { type: String, required: true },
    timeLimit: Number, // in minutes
    availableDate: Date, // when quiz becomes available
    dueDate: Date,
    isPublished: { type: Boolean, default: false },
    questions: [questionSchema],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    quizType: String,
    shuffleAnswers: { type: Boolean, default: false },
    allowMultipleAttempts: { type: Boolean, default: false },
    showCorrectAnswers: { type: String, default: 'immediately' },
  },
  { collection: 'quizzes' }
);

export default quizSchema;
