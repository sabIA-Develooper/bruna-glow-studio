const express = require('express');
const AuthController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');
const { validateRequest, authSchemas } = require('../middleware/validation');

const router = express.Router();
const authController = new AuthController();

// Public routes
router.post('/register', validateRequest(authSchemas.register), authController.register);
router.post('/login', validateRequest(authSchemas.login), authController.login);
router.post('/refresh', authController.refreshToken);

// Protected routes
router.get('/me', authenticateToken, authController.getProfile);
router.put('/profile', authenticateToken, authController.updateProfile);
router.post('/logout', authenticateToken, authController.logout);

module.exports = router;
