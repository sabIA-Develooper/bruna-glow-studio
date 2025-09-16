const express = require('express');
const OrdersController = require('../controllers/ordersController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { validateRequest, orderSchemas } = require('../middleware/validation');

const router = express.Router();
const ordersController = new OrdersController();

// Protected routes
router.get('/my', authenticateToken, ordersController.getOrdersByUser);
router.get('/:id', authenticateToken, ordersController.getOrder);
router.post('/', authenticateToken, validateRequest(orderSchemas.create), ordersController.createOrder);
router.put('/:id', authenticateToken, validateRequest(orderSchemas.update), ordersController.updateOrder);
router.delete('/:id', authenticateToken, ordersController.deleteOrder);

// Admin routes
router.get('/', authenticateToken, requireAdmin, ordersController.getOrders);
router.get('/stats', authenticateToken, requireAdmin, ordersController.getOrderStats);

module.exports = router;
