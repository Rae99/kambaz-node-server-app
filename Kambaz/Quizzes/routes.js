// API point for quizzes
// GET /api/quizzes/course/:courseId
// POST /api/quizzes
// PUT /api/quizzes/:id
// DELETE /api/quizzes/:id

import * as dao from './dao.js';

export default function QuizRoutes(app) {
  const updateQuiz = async (req, res) => {
    const { id } = req.params;
    const quiz = req.body;
    const status = await dao.updateQuiz(id, quiz);
    res.json(status);
  };

  const deleteQuiz = async (req, res) => {
    const { id } = req.params;
    const status = await dao.deleteQuiz(id);
    res.json(status);
  };

  const findQuizById = async (req, res) => {
    const { qid } = req.params;
    const quiz = await dao.findQuizById(qid);
    res.json(quiz);
  };

  app.get('/api/quizzes/:qid', findQuizById);
  app.put('/api/quizzes/:qid', updateQuiz);
  app.delete('/api/quizzes/:qid', deleteQuiz);
}
