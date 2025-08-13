import * as dao from './dao.js';

// Helper function to check if user is faculty/admin/TA
function isFaculty(user) {
  return user && ['FACULTY', 'ADMIN', 'TA'].includes(user.role);
}

// Helper function to check if user is student or user
function isStudentOrUser(user) {
  return user && (user.role === 'STUDENT' || user.role === 'USER');
}

export default function QuizAttemptRoutes(app) {
  // Get all attempts for a specific quiz (Faculty only)
  const findAttemptsByQuiz = async (req, res) => {
    try {
      const { quizId } = req.params;
      const currentUser = req.session?.currentUser;

      if (!currentUser || !isFaculty(currentUser)) {
        return res.status(403).json({ error: 'Access denied. Faculty only.' });
      }

      const attempts = await dao.findAttemptsByQuiz(quizId);
      res.json(attempts);
    } catch (error) {
      console.error('Find attempts by quiz error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  // Get attempts for a specific student on a specific quiz
  const findAttemptsByStudentAndQuiz = async (req, res) => {
    try {
      const { quizId, studentId } = req.params;
      const currentUser = req.session?.currentUser;

      if (!currentUser) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      // Students can only see their own attempts, faculty can see all
      if (isStudentOrUser(currentUser) && currentUser._id !== studentId) {
        return res
          .status(403)
          .json({ error: 'Access denied. Can only view your own attempts.' });
      }

      const attempts = await dao.findAttemptsByStudentAndQuiz(
        studentId,
        quizId
      );
      res.json(attempts);
    } catch (error) {
      console.error('Find attempts by student and quiz error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  // Get all attempts for a specific course (Faculty only)
  const findAttemptsByCourse = async (req, res) => {
    try {
      const { courseId } = req.params;
      const currentUser = req.session?.currentUser;

      if (!currentUser || !isFaculty(currentUser)) {
        return res.status(403).json({ error: 'Access denied. Faculty only.' });
      }

      const attempts = await dao.findAttemptsByCourse(courseId);
      res.json(attempts);
    } catch (error) {
      console.error('Find attempts by course error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  // Start a new quiz attempt
  const startAttempt = async (req, res) => {
    try {
      const { quizId } = req.params;
      const currentUser = req.session?.currentUser;

      if (!currentUser) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      // Check if quiz exists and is available
      const quizModel = (await import('../Quizzes/model.js')).default;
      const quiz = await quizModel.findById(quizId);

      if (!quiz) {
        return res.status(404).json({ error: 'Quiz not found' });
      }

      // Students can only take published quizzes
      if (isStudentOrUser(currentUser) && !quiz.isPublished) {
        return res.status(403).json({ error: 'Quiz is not published' });
      }

      // Check attempt limits
      if (quiz.multipleAttempts === false) {
        const existingAttempts = await dao.getAttemptCount(
          currentUser._id,
          quizId
        );
        if (existingAttempts > 0) {
          return res
            .status(400)
            .json({ error: 'Multiple attempts not allowed' });
        }
      } else if (quiz.attemptsAllowed) {
        const existingAttempts = await dao.getAttemptCount(
          currentUser._id,
          quizId
        );
        if (existingAttempts >= quiz.attemptsAllowed) {
          return res.status(400).json({ error: 'Attempt limit reached' });
        }
      }

      // Calculate total points
      const totalPoints = quiz.questions.reduce((sum, q) => sum + q.points, 0);

      const attemptData = {
        studentId: currentUser._id,
        quizId: quizId,
        totalPoints: totalPoints,
        answers: new Map(),
      };

      const attempt = await dao.createAttempt(attemptData);
      res.status(201).json(attempt);
    } catch (error) {
      console.error('Start attempt error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  // Save attempt progress (auto-save)
  const saveAttemptProgress = async (req, res) => {
    try {
      const { attemptId } = req.params;
      const { answers, timeSpent } = req.body;
      const currentUser = req.session?.currentUser;

      if (!currentUser) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const attempt = await dao.findAttemptById(attemptId);
      if (!attempt) {
        return res.status(404).json({ error: 'Attempt not found' });
      }

      // Students can only update their own attempts
      if (
        isStudentOrUser(currentUser) &&
        attempt.studentId.toString() !== currentUser._id
      ) {
        return res.status(403).json({ error: 'Access denied' });
      }

      // Don't allow updates to completed attempts
      if (attempt.isCompleted) {
        return res
          .status(400)
          .json({ error: 'Cannot modify completed attempt' });
      }

      const updates = {
        answers: answers,
        timeSpent: timeSpent || attempt.timeSpent,
      };

      const updatedAttempt = await dao.updateAttempt(attemptId, updates);
      res.json(updatedAttempt);
    } catch (error) {
      console.error('Save attempt progress error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  // Submit quiz attempt
  const submitAttempt = async (req, res) => {
    try {
      const { attemptId } = req.params;
      const { answers } = req.body;
      const currentUser = req.session?.currentUser;

      if (!currentUser) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const attempt = await dao.findAttemptById(attemptId);
      if (!attempt) {
        return res.status(404).json({ error: 'Attempt not found' });
      }

      // Students can only submit their own attempts
      if (
        isStudentOrUser(currentUser) &&
        attempt.studentId.toString() !== currentUser._id
      ) {
        return res.status(403).json({ error: 'Access denied' });
      }

      // Don't allow resubmission
      if (attempt.isCompleted) {
        return res.status(400).json({ error: 'Attempt already submitted' });
      }

      // Get quiz for scoring
      const quizModel = (await import('../Quizzes/model.js')).default;
      const quiz = await quizModel.findById(attempt.quizId);

      // Calculate score
      let score = 0;
      quiz.questions.forEach((question) => {
        const userAnswer = answers[question._id];
        if (userAnswer && userAnswer === question.correctAnswer) {
          score += question.points;
        }
      });

      const submittedAttempt = await dao.submitAttempt(
        attemptId,
        answers,
        score
      );
      res.json(submittedAttempt);
    } catch (error) {
      console.error('Submit attempt error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  // Get attempt by ID
  const findAttemptById = async (req, res) => {
    try {
      const { attemptId } = req.params;
      const currentUser = req.session?.currentUser;

      if (!currentUser) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const attempt = await dao.findAttemptById(attemptId);
      if (!attempt) {
        return res.status(404).json({ error: 'Attempt not found' });
      }

      // Students can only view their own attempts
      if (
        isStudentOrUser(currentUser) &&
        attempt.studentId._id !== currentUser._id
      ) {
        return res.status(403).json({ error: 'Access denied' });
      }

      res.json(attempt);
    } catch (error) {
      console.error('Find attempt by ID error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  // Simplified API for frontend - auto-handle attempt creation
  const saveQuizProgress = async (req, res) => {
    try {
      const { quizId } = req.params;
      const { answers, timeSpent } = req.body;
      const currentUser = req.session?.currentUser;

      if (!currentUser) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      // Find or create current attempt for this user and quiz
      let attempt = await dao.findLatestAttempt(currentUser._id, quizId);

      if (!attempt || attempt.isCompleted) {
        // Need to start a new attempt
        const quizModel = (await import('../Quizzes/model.js')).default;
        const quiz = await quizModel.findById(quizId);

        if (!quiz) {
          return res.status(404).json({ error: 'Quiz not found' });
        }

        // Students can only take published quizzes
        if (isStudentOrUser(currentUser) && !quiz.isPublished) {
          return res.status(403).json({ error: 'Quiz is not published' });
        }

        // Check attempt limits
        if (quiz.multipleAttempts === false) {
          const existingAttempts = await dao.getAttemptCount(
            currentUser._id,
            quizId
          );
          if (existingAttempts > 0) {
            return res
              .status(400)
              .json({ error: 'Multiple attempts not allowed' });
          }
        } else if (quiz.attemptsAllowed) {
          const existingAttempts = await dao.getAttemptCount(
            currentUser._id,
            quizId
          );
          if (existingAttempts >= quiz.attemptsAllowed) {
            return res.status(400).json({ error: 'Attempt limit reached' });
          }
        }

        // Calculate total points
        const totalPoints = quiz.questions.reduce(
          (sum, q) => sum + q.points,
          0
        );

        // Convert answers to Map format for database storage
        let answersForDB = answers || {};
        if (Array.isArray(answers)) {
          answersForDB = {};
          answers.forEach((answerData) => {
            const { questionIndex, userAnswer } = answerData;
            answersForDB[`question_${questionIndex}`] = userAnswer;
          });
        }

        const attemptData = {
          studentId: currentUser._id,
          quizId: quizId,
          totalPoints: totalPoints,
          answers: answersForDB,
          timeSpent: timeSpent || 0,
          isCompleted: false, // do not mark as completed when saving progress
          submittedAt: null, // do not set submitted time when saving progress
        };

        attempt = await dao.createAttempt(attemptData);
      } else {
        // Update existing attempt
        // Convert answers to Map format for database storage
        let answersForDB = answers;
        if (Array.isArray(answers)) {
          answersForDB = {};
          answers.forEach((answerData) => {
            const { questionIndex, userAnswer } = answerData;
            answersForDB[`question_${questionIndex}`] = userAnswer;
          });
        }

        const updates = {
          answers: answersForDB,
          timeSpent: timeSpent || attempt.timeSpent,
        };
        attempt = await dao.updateAttempt(attempt._id, updates);
      }

      res.json(attempt);
    } catch (error) {
      console.error('Save quiz progress error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  // Register routes
  app.get('/api/quiz-attempts/quiz/:quizId', findAttemptsByQuiz);
  app.get(
    '/api/quiz-attempts/quiz/:quizId/student/:studentId',
    findAttemptsByStudentAndQuiz
  );
  app.get('/api/quiz-attempts/course/:courseId', findAttemptsByCourse);
  app.get('/api/quiz-attempts/:attemptId', findAttemptById);

  app.post('/api/quiz-attempts/quiz/:quizId/start', startAttempt);
  app.put('/api/quiz-attempts/:attemptId/save', saveAttemptProgress);
  app.put('/api/quiz-attempts/:attemptId/submit', submitAttempt);

  // Submit quiz (finalize the attempt)
  const submitQuizAttempt = async (req, res) => {
    try {
      const { quizId } = req.params;
      const { answers } = req.body;
      const currentUser = req.session?.currentUser;

      if (!currentUser) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      // Find current attempt
      const attempt = await dao.findLatestAttempt(currentUser._id, quizId);

      if (!attempt) {
        return res.status(404).json({
          error: 'No active attempt found. Please start the quiz first.',
        });
      }

      if (attempt.isCompleted) {
        return res.status(400).json({ error: 'Attempt already submitted' });
      }

      // Students and users can only submit their own attempts
      if (
        isStudentOrUser(currentUser) &&
        attempt.studentId.toString() !== currentUser._id
      ) {
        return res.status(403).json({ error: 'Access denied' });
      }

      // Get quiz for scoring
      const quizModel = (await import('../Quizzes/model.js')).default;
      const quiz = await quizModel.findById(quizId);

      if (!quiz) {
        return res.status(404).json({ error: 'Quiz not found' });
      }

      // Calculate score
      let score = 0;

      // Check if answers is an array (new format) or object (old format)
      if (Array.isArray(answers)) {
        // New format: answers is an array with questionIndex
        answers.forEach((answerData) => {
          const { questionIndex, userAnswer } = answerData;
          const question = quiz.questions[questionIndex];

          if (question && userAnswer === question.correctAnswer) {
            score += question.points;
          }
        });
      } else {
        // Old format: answers is an object with question IDs
        quiz.questions.forEach((question, index) => {
          const userAnswer =
            answers[question._id] || answers[`question_${index}`];

          if (userAnswer && userAnswer === question.correctAnswer) {
            score += question.points;
          }
        });
      }

      // Convert answers to Map format for database storage
      let answersForDB = answers;
      if (Array.isArray(answers)) {
        // Convert array format to Map format
        answersForDB = {};
        answers.forEach((answerData) => {
          const { questionIndex, userAnswer } = answerData;
          answersForDB[`question_${questionIndex}`] = userAnswer;
        });
      }

      // Submit the attempt
      const submittedAttempt = await dao.submitAttempt(
        attempt._id,
        answersForDB,
        score
      );
      res.json(submittedAttempt);
    } catch (error) {
      console.error('Submit quiz attempt error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  // Simplified API for frontend
  app.put('/api/quiz-attempts/quiz/:quizId', saveQuizProgress);
  app.post('/api/quiz-attempts/quiz/:quizId/submit', submitQuizAttempt);
}
