const { Router } = require('express');
const { login, logout, refresh } = require('../controllers/auth.controller');
const router = Router();

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Log in the user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *     responses:
 *       200:
 *         description: Returns access and refresh tokens
 * /api/auth/logout:
 *   post:
 *     summary: Log out the user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Successful logout
 * /api/auth/refresh:
 *   post:
 *     summary: Refresh access token using refresh token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *     responses:
 *       200:
 *         description: Returns new tokens
 */

router.post('/login', login);
router.post('/logout', logout);
router.post('/refresh', refresh);

module.exports = router;
