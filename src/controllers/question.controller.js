const questionService = require('../services/question.service');

exports.createQuestion = async (req, res) => {
  try {
    const userId = req.user.id;
    const { content } = req.body;

    const question = await questionService.createQuestion(userId, content);
    const answer = await questionService.generateAnswer(content);
    const updatedQuestion = await questionService.updateQuestionAnswer(question.id, answer);

    return res.status(201).json(updatedQuestion);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

exports.getQuestionById = async (req, res) => {
  try {
    const { questionId } = req.params;
    const question = await questionService.getQuestionById(parseInt(questionId, 10));

    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }
    return res.status(200).json(question);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};
