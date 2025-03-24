const { Router } = require('express');
const {
  createQuestion,
  getQuestionById,
} = require('../controllers/question.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');

const router = Router();

/**
 * @swagger
 * /api/questions:
 *   post:
 *     summary: Create a question and return the AI answer
 *     tags: [Questions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *     responses:
 *       201:
 *         description: Returns newly created question with answer
 * /api/questions/{questionId}:
 *   get:
 *     summary: Get question by ID
 *     tags: [Questions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: questionId
 *         in: path
 *         required: true
 *     responses:
 *       200:
 *         description: Question found
 */

router.post('/', authenticateToken, createQuestion);
router.get('/:questionId', authenticateToken, getQuestionById);

module.exports = router;
