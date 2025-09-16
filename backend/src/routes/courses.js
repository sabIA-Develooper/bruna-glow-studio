const express = require('express');
const CoursesController = require('../controllers/coursesController');
const { authenticateToken, requireAdmin, optionalAuth } = require('../middleware/auth');
const { validateRequest, courseSchemas } = require('../middleware/validation');

const router = express.Router();
const coursesController = new CoursesController();

// Public routes
router.get('/', optionalAuth, coursesController.getCourses);
router.get('/:id', optionalAuth, coursesController.getCourse);

// Admin routes
router.post('/', authenticateToken, requireAdmin, validateRequest(courseSchemas.create), coursesController.createCourse);
router.put('/:id', authenticateToken, requireAdmin, validateRequest(courseSchemas.update), coursesController.updateCourse);
router.delete('/:id', authenticateToken, requireAdmin, coursesController.deleteCourse);

module.exports = router;
