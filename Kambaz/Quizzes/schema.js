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
    type: mongoose.Schema.Types.Mixed, // Can be String or Array
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
    quizType: { type: String, default: 'graded' },
    points: { type: Number, default: 0 },
    assignmentGroup: { type: String, default: 'quizzes' },
    shuffleAnswers: { type: Boolean, default: false },
    timeLimit: Number, // in minutes
    multipleAttempts: { type: Boolean, default: false },
    attemptsAllowed: { type: Number, default: 1 },
    showCorrectAnswers: { type: String, default: 'immediately' },
    accessCode: String,
    oneQuestionAtATime: { type: Boolean, default: false },
    webcamRequired: { type: Boolean, default: false },
    lockQuestionsAfterAnswering: { type: Boolean, default: false },
    availableDate: Date, // when quiz becomes available
    dueDate: Date,
    untilDate: Date, // final cutoff date
    isPublished: { type: Boolean, default: false },
    questions: [questionSchema],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { collection: 'quizzes' }
);

export default quizSchema;
