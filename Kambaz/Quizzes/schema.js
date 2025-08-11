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
    title: String,
    description: String,
    courseId: String,
    timeLimit: Number,
    availableDate: Date,
    dueDate: Date,
    isPublished: Boolean,
    questions: [questionSchema],
    createdAt: Date,
    updatedAt: Date,
  },
  { collection: 'quizzes' }
);

export default quizSchema;
