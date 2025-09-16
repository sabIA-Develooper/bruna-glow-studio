const express = require('express');
const AppointmentsController = require('../controllers/appointmentsController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { validateRequest, appointmentSchemas } = require('../middleware/validation');

const router = express.Router();
const appointmentsController = new AppointmentsController();

// Protected routes
router.get('/', authenticateToken, appointmentsController.getAppointments);
router.get('/my', authenticateToken, appointmentsController.getAppointmentsByUser);
router.get('/:id', authenticateToken, appointmentsController.getAppointment);
router.post('/', authenticateToken, validateRequest(appointmentSchemas.create), appointmentsController.createAppointment);
router.put('/:id', authenticateToken, validateRequest(appointmentSchemas.update), appointmentsController.updateAppointment);
router.delete('/:id', authenticateToken, appointmentsController.deleteAppointment);

// Public route for available time slots
router.get('/services/:serviceId/available-slots', appointmentsController.getAvailableTimeSlots);

// Admin routes
router.get('/admin/all', authenticateToken, requireAdmin, appointmentsController.getAppointments);

module.exports = router;
