// API point for quizzes
// GET /api/quizzes/:qid
// PUT /api/quizzes/:qid
// DELETE /api/quizzes/:qid

import * as dao from './dao.js';

// Helper function to check if user is faculty/admin/TA
function isFaculty(user) {
  return user && ['FACULTY', 'ADMIN', 'TA'].includes(user.role);
}

// Helper function to check if user is student or user
function isStudentOrUser(user) {
  return user && user.role === 'STUDENT' || user.role === 'USER';
}

export default function QuizRoutes(app) {
  const updateQuiz = async (req, res) => {
    try {
      const { qid } = req.params;
      const currentUser = req.session?.currentUser;

      if (!currentUser) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      if (!isFaculty(currentUser)) {
        return res.status(403).json({ error: 'Access denied. Faculty only.' });
      }

      const quiz = req.body;
      const result = await dao.updateQuiz(qid, quiz);

      if (result) {
        res.json(result);
      } else {
        res.status(404).json({ error: 'Quiz not found' });
      }
    } catch (error) {
      console.error('Update quiz route error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  const deleteQuiz = async (req, res) => {
    try {
      const { qid } = req.params;
      const currentUser = req.session?.currentUser;

      if (!currentUser) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      if (!isFaculty(currentUser)) {
        return res.status(403).json({ error: 'Access denied. Faculty only.' });
      }

      const result = await dao.deleteQuiz(qid);

      if (result) {
        res.json({ success: true, message: 'Quiz deleted successfully' });
      } else {
        res.status(404).json({ error: 'Quiz not found' });
      }
    } catch (error) {
      console.error('Delete quiz route error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  const findQuizById = async (req, res) => {
    try {
      const { qid } = req.params;
      const currentUser = req.session?.currentUser;

      if (!currentUser) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const quiz = await dao.findQuizById(qid);

      if (!quiz) {
        return res.status(404).json({ error: 'Quiz not found' });
      }

      // Students can only access published quizzes
      if (isStudentOrUser(currentUser) && !quiz.isPublished) {
        return res.status(403).json({ error: 'Quiz is not published' });
      }

      res.json(quiz);
    } catch (error) {
      console.error('Find quiz route error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  app.get('/api/quizzes/:qid', findQuizById);
  app.put('/api/quizzes/:qid', updateQuiz);
  app.delete('/api/quizzes/:qid', deleteQuiz);
}
