const AppointmentService = require('../services/appointmentService');
const { validateRequest, appointmentSchemas } = require('../middleware/validation');

class AppointmentsController {
  constructor() {
    this.appointmentService = new AppointmentService();
  }

  getAppointments = async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      
      let appointments;
      if (startDate && endDate) {
        appointments = await this.appointmentService.getAppointmentsByDateRange(
          new Date(startDate),
          new Date(endDate)
        );
      } else {
        appointments = await this.appointmentService.getAllAppointments();
      }

      res.json({
        message: 'Agendamentos obtidos com sucesso',
        data: appointments
      });
    } catch (error) {
      res.status(500).json({
        message: error.message || 'Erro ao buscar agendamentos'
      });
    }
  };

  getAppointmentsByUser = async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Usuário não autenticado' });
      }

      const appointments = await this.appointmentService.getAppointmentsByUser(req.user.userId);

      res.json({
        message: 'Agendamentos do usuário obtidos com sucesso',
        data: appointments
      });
    } catch (error) {
      res.status(500).json({
        message: error.message || 'Erro ao buscar agendamentos do usuário'
      });
    }
  };

  getAppointment = async (req, res) => {
    try {
      const { id } = req.params;
      const appointment = await this.appointmentService.getAppointmentById(id);
      
      if (!appointment) {
        return res.status(404).json({ message: 'Agendamento não encontrado' });
      }
      
      res.json({
        message: 'Agendamento obtido com sucesso',
        data: appointment
      });
    } catch (error) {
      res.status(500).json({
        message: error.message || 'Erro ao buscar agendamento'
      });
    }
  };

  createAppointment = async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Usuário não autenticado' });
      }

      const appointmentData = {
        ...req.body,
        user_id: req.user.userId
      };
      
      const appointment = await this.appointmentService.createAppointment(appointmentData);
      
      res.status(201).json({
        message: 'Agendamento criado com sucesso',
        data: appointment
      });
    } catch (error) {
      res.status(400).json({
        message: error.message || 'Erro ao criar agendamento'
      });
    }
  };

  updateAppointment = async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      const appointment = await this.appointmentService.updateAppointment(id, updateData);
      
      if (!appointment) {
        return res.status(404).json({ message: 'Agendamento não encontrado' });
      }
      
      res.json({
        message: 'Agendamento atualizado com sucesso',
        data: appointment
      });
    } catch (error) {
      res.status(500).json({
        message: error.message || 'Erro ao atualizar agendamento'
      });
    }
  };

  deleteAppointment = async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await this.appointmentService.deleteAppointment(id);
      
      if (!deleted) {
        return res.status(404).json({ message: 'Agendamento não encontrado' });
      }
      
      res.json({
        message: 'Agendamento excluído com sucesso'
      });
    } catch (error) {
      res.status(500).json({
        message: error.message || 'Erro ao excluir agendamento'
      });
    }
  };

  getAvailableTimeSlots = async (req, res) => {
    try {
      const { serviceId } = req.params;
      const { date } = req.query;
      
      if (!date) {
        return res.status(400).json({ message: 'Data é obrigatória' });
      }
      
      const timeSlots = await this.appointmentService.getAvailableTimeSlots(
        serviceId,
        new Date(date)
      );
      
      res.json({
        message: 'Horários disponíveis obtidos com sucesso',
        data: timeSlots
      });
    } catch (error) {
      res.status(500).json({
        message: error.message || 'Erro ao buscar horários disponíveis'
      });
    }
  };
}

module.exports = AppointmentsController;
