const pool = require('../utils/database');

class AppointmentService {
  async getAllAppointments() {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `SELECT a.*, s.name as service_name 
         FROM appointments a 
         JOIN services s ON a.service_id = s.id 
         ORDER BY a.appointment_date DESC`
      );
      return result.rows;
    } finally {
      client.release();
    }
  }
  
  async getAppointmentsByUser(userId) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `SELECT a.*, s.name as service_name 
         FROM appointments a 
         JOIN services s ON a.service_id = s.id 
         WHERE a.user_id = $1 
         ORDER BY a.appointment_date DESC`,
        [userId]
      );
      return result.rows;
    } finally {
      client.release();
    }
  }
  
  async getAppointmentById(id) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `SELECT a.*, s.name as service_name 
         FROM appointments a 
         JOIN services s ON a.service_id = s.id 
         WHERE a.id = $1`,
        [id]
      );
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }
  
  async createAppointment(appointmentData) {
    const client = await pool.connect();
    try {
      // Check if service exists and is active
      const serviceResult = await client.query(
        'SELECT id FROM services WHERE id = $1 AND is_active = true',
        [appointmentData.service_id]
      );
      
      if (serviceResult.rows.length === 0) {
        throw new Error('Serviço não encontrado ou inativo');
      }
      
      // Check for conflicting appointments
      const conflictResult = await client.query(
        `SELECT id FROM appointments 
         WHERE service_id = $1 
         AND appointment_date = $2 
         AND status IN ('pending', 'confirmed')`,
        [appointmentData.service_id, appointmentData.appointment_date]
      );
      
      if (conflictResult.rows.length > 0) {
        throw new Error('Já existe um agendamento para este horário');
      }
      
      const result = await client.query(
        `INSERT INTO appointments (user_id, service_id, appointment_date, client_name, client_email, client_phone, notes, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING *`,
        [
          appointmentData.user_id,
          appointmentData.service_id,
          appointmentData.appointment_date,
          appointmentData.client_name,
          appointmentData.client_email,
          appointmentData.client_phone,
          appointmentData.notes,
          appointmentData.status || 'pending'
        ]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }
  
  async updateAppointment(id, updateData) {
    const client = await pool.connect();
    try {
      const fields = [];
      const values = [];
      let paramCount = 1;
      
      Object.entries(updateData).forEach(([key, value]) => {
        if (value !== undefined && key !== 'id' && key !== 'user_id' && key !== 'created_at') {
          fields.push(`${key} = $${paramCount}`);
          values.push(value);
          paramCount++;
        }
      });
      
      if (fields.length === 0) {
        throw new Error('Nenhum campo para atualizar');
      }
      
      fields.push(`updated_at = now()`);
      values.push(id);
      
      const result = await client.query(
        `UPDATE appointments SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
        values
      );
      
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }
  
  async deleteAppointment(id) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'DELETE FROM appointments WHERE id = $1',
        [id]
      );
      return result.rowCount > 0;
    } finally {
      client.release();
    }
  }
  
  async getAppointmentsByDateRange(startDate, endDate) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `SELECT a.*, s.name as service_name 
         FROM appointments a 
         JOIN services s ON a.service_id = s.id 
         WHERE a.appointment_date BETWEEN $1 AND $2 
         ORDER BY a.appointment_date ASC`,
        [startDate, endDate]
      );
      return result.rows;
    } finally {
      client.release();
    }
  }
  
  async getAvailableTimeSlots(serviceId, date) {
    const client = await pool.connect();
    try {
      // Get service duration
      const serviceResult = await client.query(
        'SELECT duration FROM services WHERE id = $1',
        [serviceId]
      );
      
      if (serviceResult.rows.length === 0) {
        throw new Error('Serviço não encontrado');
      }
      
      const duration = serviceResult.rows[0].duration;
      
      // Get existing appointments for the date
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      
      const appointmentsResult = await client.query(
        `SELECT appointment_date FROM appointments 
         WHERE service_id = $1 
         AND appointment_date BETWEEN $2 AND $3 
         AND status IN ('pending', 'confirmed')`,
        [serviceId, startOfDay, endOfDay]
      );
      
      // Generate available time slots (simplified - every hour from 9 AM to 6 PM)
      const availableSlots = [];
      const startHour = 9;
      const endHour = 18;
      
      for (let hour = startHour; hour < endHour; hour++) {
        const slotTime = new Date(date);
        slotTime.setHours(hour, 0, 0, 0);
        
        // Check if this slot conflicts with existing appointments
        const hasConflict = appointmentsResult.rows.some(appointment => {
          const appointmentTime = new Date(appointment.appointment_date);
          return appointmentTime.getHours() === hour;
        });
        
        if (!hasConflict) {
          availableSlots.push(slotTime.toISOString());
        }
      }
      
      return availableSlots;
    } finally {
      client.release();
    }
  }
}

module.exports = AppointmentService;
