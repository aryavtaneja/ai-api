const { Router } = require('express');
const {
  createUser,
  getUserProfile,
  getUserQuestions,
} = require('../controllers/user.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');

const router = Router();

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *     responses:
 *       201:
 *         description: Returns newly created user
 * /api/users/{userId}:
 *   get:
 *     summary: Get user profile by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *     responses:
 *       200:
 *         description: Returns user profile
 * /api/users/{userId}/questions:
 *   get:
 *     summary: Get user questions
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *     responses:
 *       200:
 *         description: Returns list of questions
 */

router.post('/', createUser);
router.get('/:userId', authenticateToken, getUserProfile);
router.get('/:userId/questions', authenticateToken, getUserQuestions);

module.exports = router;
