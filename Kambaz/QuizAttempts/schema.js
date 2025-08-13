import mongoose from 'mongoose';

const quizAttemptSchema = new mongoose.Schema(
  {
    studentId: {
      type: String,
      required: true,
      ref: 'User',
    },
    quizId: {
      type: String,
      required: true,
      ref: 'Quiz',
    },
    answers: {
      type: Map,
      of: mongoose.Schema.Types.Mixed, // Can store strings or arrays
      default: {},
    },
    score: {
      type: Number,
      default: 0,
    },
    totalPoints: {
      type: Number,
      required: true,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    submittedAt: {
      type: Date,
      default: null,
    },
    attemptNumber: {
      type: Number,
      required: true,
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    timeSpent: {
      type: Number, // in seconds
      default: 0,
    },
  },
  {
    collection: 'quiz-attempts',
    timestamps: true,
  }
);

// Compound index for finding attempts by student and quiz
quizAttemptSchema.index({ studentId: 1, quizId: 1 });

// Index for finding attempts by quiz (for faculty view)
quizAttemptSchema.index({ quizId: 1 });

export default quizAttemptSchema;
