const pool = require('../utils/database');

class OrderService {
  async getAllOrders() {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM orders ORDER BY created_at DESC'
      );
      return result.rows;
    } finally {
      client.release();
    }
  }
  
  async getOrdersByUser(userId) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC',
        [userId]
      );
      return result.rows;
    } finally {
      client.release();
    }
  }
  
  async getOrderById(id) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM orders WHERE id = $1',
        [id]
      );
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }
  
  async getOrderWithItems(id) {
    const client = await pool.connect();
    try {
      // Get order
      const orderResult = await client.query(
        'SELECT * FROM orders WHERE id = $1',
        [id]
      );
      
      if (orderResult.rows.length === 0) {
        return null;
      }
      
      // Get order items with course details
      const itemsResult = await client.query(
        `SELECT oi.*, c.title as course_title, c.image_url as course_image
         FROM order_items oi
         JOIN courses c ON oi.course_id = c.id
         WHERE oi.order_id = $1`,
        [id]
      );
      
      return {
        order: orderResult.rows[0],
        items: itemsResult.rows
      };
    } finally {
      client.release();
    }
  }
  
  async createOrder(orderData) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      // Create order
      const orderResult = await client.query(
        `INSERT INTO orders (user_id, total_amount, payment_method, status)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [
          orderData.user_id,
          orderData.total_amount,
          orderData.payment_method,
          orderData.status || 'pending'
        ]
      );
      
      const order = orderResult.rows[0];
      
      // Create order items
      for (const item of orderData.items) {
        // Verify course exists and is active
        const courseResult = await client.query(
          'SELECT id, price FROM courses WHERE id = $1 AND is_active = true',
          [item.course_id]
        );
        
        if (courseResult.rows.length === 0) {
          throw new Error(`Curso ${item.course_id} não encontrado ou inativo`);
        }
        
        // Use course price if not provided
        const itemPrice = item.price || courseResult.rows[0].price;
        
        await client.query(
          `INSERT INTO order_items (order_id, course_id, price)
           VALUES ($1, $2, $3)`,
          [order.id, item.course_id, itemPrice]
        );
      }
      
      await client.query('COMMIT');
      return order;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
  
  async updateOrder(id, updateData) {
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
        `UPDATE orders SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
        values
      );
      
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }
  
  async deleteOrder(id) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      // Delete order items first
      await client.query(
        'DELETE FROM order_items WHERE order_id = $1',
        [id]
      );
      
      // Delete order
      const result = await client.query(
        'DELETE FROM orders WHERE id = $1',
        [id]
      );
      
      await client.query('COMMIT');
      return result.rowCount > 0;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
  
  async getOrderStats() {
    const client = await pool.connect();
    try {
      const result = await client.query(`
        SELECT 
          COUNT(*) as total_orders,
          COALESCE(SUM(CASE WHEN status = 'paid' THEN total_amount ELSE 0 END), 0) as total_revenue,
          COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_orders,
          COUNT(CASE WHEN status = 'paid' THEN 1 END) as paid_orders
        FROM orders
      `);
      
      const stats = result.rows[0];
      return {
        totalOrders: parseInt(stats.total_orders),
        totalRevenue: parseFloat(stats.total_revenue),
        pendingOrders: parseInt(stats.pending_orders),
        paidOrders: parseInt(stats.paid_orders)
      };
    } finally {
      client.release();
    }
  }
}

module.exports = OrderService;
