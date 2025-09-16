const pool = require('../utils/database');

class CourseService {
  async getAllCourses() {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM courses WHERE is_active = true ORDER BY created_at DESC'
      );
      return result.rows;
    } finally {
      client.release();
    }
  }
  
  async getCourseById(id) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM courses WHERE id = $1',
        [id]
      );
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }
  
  async getCoursesByCategory(category) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM courses WHERE category = $1 AND is_active = true ORDER BY created_at DESC',
        [category]
      );
      return result.rows;
    } finally {
      client.release();
    }
  }
  
  async createCourse(courseData) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `INSERT INTO courses (title, description, price, image_url, category, content_url, duration, instructor, level, is_active)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         RETURNING *`,
        [
          courseData.title,
          courseData.description,
          courseData.price,
          courseData.image_url,
          courseData.category,
          courseData.content_url,
          courseData.duration,
          courseData.instructor || 'Bruna',
          courseData.level || 'Básico',
          courseData.is_active !== undefined ? courseData.is_active : true
        ]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }
  
  async updateCourse(id, updateData) {
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
        `UPDATE courses SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
        values
      );
      
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }
  
  async deleteCourse(id) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'DELETE FROM courses WHERE id = $1',
        [id]
      );
      return result.rowCount > 0;
    } finally {
      client.release();
    }
  }
  
  async searchCourses(query) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `SELECT * FROM courses 
         WHERE is_active = true 
         AND (title ILIKE $1 OR description ILIKE $1 OR category ILIKE $1)
         ORDER BY created_at DESC`,
        [`%${query}%`]
      );
      return result.rows;
    } finally {
      client.release();
    }
  }
}

module.exports = CourseService;
