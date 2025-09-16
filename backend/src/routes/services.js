const express = require('express');
const ServicesController = require('../controllers/servicesController');
const { authenticateToken, requireAdmin, optionalAuth } = require('../middleware/auth');
const { validateRequest, serviceSchemas } = require('../middleware/validation');

const router = express.Router();
const servicesController = new ServicesController();

// Public routes
router.get('/', optionalAuth, servicesController.getServices);
router.get('/:id', optionalAuth, servicesController.getService);

// Admin routes
router.post('/', authenticateToken, requireAdmin, validateRequest(serviceSchemas.create), servicesController.createService);
router.put('/:id', authenticateToken, requireAdmin, validateRequest(serviceSchemas.update), servicesController.updateService);
router.delete('/:id', authenticateToken, requireAdmin, servicesController.deleteService);

module.exports = router;
