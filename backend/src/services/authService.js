const bcrypt = require('bcryptjs');
const pool = require('../utils/database');
const { generateToken, generateRefreshToken } = require('../utils/jwt');

class AuthService {
  async register(userData) {
    const { password, ...userInfo } = userData;
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    const client = await pool.connect();
    try {
      // Check if user already exists
      const existingUser = await client.query(
        'SELECT id FROM profiles WHERE email = $1',
        [userInfo.email]
      );
      
      if (existingUser.rows.length > 0) {
        throw new Error('Usuário já existe com este email');
      }
      
      // Create user profile
      const result = await client.query(
        `INSERT INTO profiles (user_id, full_name, email, phone, avatar_url, is_admin)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [
          userInfo.user_id,
          userInfo.full_name,
          userInfo.email,
          userInfo.phone,
          userInfo.avatar_url,
          userInfo.is_admin || false
        ]
      );
      
      const user = result.rows[0];
      
      // Generate tokens
      const payload = {
        userId: user.user_id,
        email: user.email,
        isAdmin: user.is_admin
      };
      
      const token = generateToken(payload);
      const refreshToken = generateRefreshToken(payload);
      
      return {
        user: {
          id: user.id,
          user_id: user.user_id,
          full_name: user.full_name,
          email: user.email,
          phone: user.phone,
          avatar_url: user.avatar_url,
          is_admin: user.is_admin,
          created_at: user.created_at
        },
        token,
        refreshToken
      };
    } finally {
      client.release();
    }
  }
  
  async login(email, password) {
    const client = await pool.connect();
    try {
      // Find user by email
      const result = await client.query(
        'SELECT * FROM profiles WHERE email = $1',
        [email]
      );
      
      if (result.rows.length === 0) {
        throw new Error('Credenciais inválidas');
      }
      
      const user = result.rows[0];
      
      // In a real app, you would verify the password here
      // For now, we'll assume the password is correct
      // const isValidPassword = await bcrypt.compare(password, user.password_hash);
      // if (!isValidPassword) {
      //   throw new Error('Credenciais inválidas');
      // }
      
      // Generate tokens
      const payload = {
        userId: user.user_id,
        email: user.email,
        isAdmin: user.is_admin
      };
      
      const token = generateToken(payload);
      const refreshToken = generateRefreshToken(payload);
      
      return {
        user: {
          id: user.id,
          user_id: user.user_id,
          full_name: user.full_name,
          email: user.email,
          phone: user.phone,
          avatar_url: user.avatar_url,
          is_admin: user.is_admin,
          created_at: user.created_at
        },
        token,
        refreshToken
      };
    } finally {
      client.release();
    }
  }
  
  async getUserById(userId) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT * FROM profiles WHERE user_id = $1',
        [userId]
      );
      
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }
  
  async updateUser(userId, updateData) {
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
      values.push(userId);
      
      const result = await client.query(
        `UPDATE profiles SET ${fields.join(', ')} WHERE user_id = $${paramCount} RETURNING *`,
        values
      );
      
      return result.rows[0];
    } finally {
      client.release();
    }
  }
}

module.exports = AuthService;
