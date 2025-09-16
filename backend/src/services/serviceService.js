const pool = require('../utils/database');

class ServiceService {
  async getAllServices() {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM services WHERE is_active = true ORDER BY created_at DESC'
      );
      return result.rows;
    } finally {
      client.release();
    }
  }
  
  async getServiceById(id) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM services WHERE id = $1',
        [id]
      );
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }
  
  async createService(serviceData) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `INSERT INTO services (name, description, price, duration, image_url, is_active)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [
          serviceData.name,
          serviceData.description,
          serviceData.price,
          serviceData.duration,
          serviceData.image_url,
          serviceData.is_active !== undefined ? serviceData.is_active : true
        ]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }
  
  async updateService(id, updateData) {
    const client = await pool.connect();
    try {
      const fields = [];
      const values = [];
      let paramCount = 1;
      
      Object.entries(updateData).forEach(([key, value]) => {
        if (value !== undefined && key !== 'id' && key !== 'created_at') {
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
        `UPDATE services SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
        values
      );
      
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }
  
  async deleteService(id) {
    const client = await pool.connect();
    try {
      // Check if service has appointments
      const appointmentsResult = await client.query(
        'SELECT id FROM appointments WHERE service_id = $1',
        [id]
      );
      
      if (appointmentsResult.rows.length > 0) {
        throw new Error('Não é possível excluir serviço com agendamentos ativos');
      }
      
      const result = await client.query(
        'DELETE FROM services WHERE id = $1',
        [id]
      );
      return result.rowCount > 0;
    } finally {
      client.release();
    }
  }
  
  async searchServices(query) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `SELECT * FROM services 
         WHERE is_active = true 
         AND (name ILIKE $1 OR description ILIKE $1)
         ORDER BY created_at DESC`,
        [`%${query}%`]
      );
      return result.rows;
    } finally {
      client.release();
    }
  }
}

module.exports = ServiceService;
