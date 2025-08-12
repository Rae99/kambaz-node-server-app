// API point for quizzes
// GET /api/quizzes/:qid
// PUT /api/quizzes/:qid
// DELETE /api/quizzes/:qid

import * as dao from './dao.js';

export default function QuizRoutes(app) {
  const updateQuiz = async (req, res) => {
    try {
      const { qid } = req.params;
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
      const result = await dao.deleteQuiz(qid);

      if (result && result.deletedCount > 0) {
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
      const quiz = await dao.findQuizById(qid);

      if (quiz) {
        res.json(quiz);
      } else {
        res.status(404).json({ error: 'Quiz not found' });
      }
    } catch (error) {
      console.error('Find quiz route error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  app.get('/api/quizzes/:qid', findQuizById);
  app.put('/api/quizzes/:qid', updateQuiz);
  app.delete('/api/quizzes/:qid', deleteQuiz);
}
