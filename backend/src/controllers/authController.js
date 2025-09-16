const AuthService = require('../services/authService');
const { validateRequest, authSchemas } = require('../middleware/validation');
const { generateToken } = require('../utils/jwt');

class AuthController {
  constructor() {
    this.authService = new AuthService();
  }

  register = async (req, res) => {
    try {
      const { email, password, full_name, phone } = req.body;
      
      // Generate a simple user_id (in production, use a proper UUID generator)
      const user_id = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const result = await this.authService.register({
        user_id,
        email,
        password,
        full_name,
        phone
      });

      res.status(201).json({
        message: 'Usuário criado com sucesso',
        data: result
      });
    } catch (error) {
      res.status(400).json({
        message: error.message || 'Erro ao criar usuário'
      });
    }
  };

  login = async (req, res) => {
    try {
      const { email, password } = req.body;
      
      const result = await this.authService.login(email, password);

      res.json({
        message: 'Login realizado com sucesso',
        data: result
      });
    } catch (error) {
      res.status(401).json({
        message: error.message || 'Erro ao fazer login'
      });
    }
  };

  getProfile = async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Usuário não autenticado' });
      }

      const user = await this.authService.getUserById(req.user.userId);
      
      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }

      res.json({
        message: 'Perfil obtido com sucesso',
        data: { user }
      });
    } catch (error) {
      res.status(500).json({
        message: error.message || 'Erro ao obter perfil'
      });
    }
  };

  updateProfile = async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Usuário não autenticado' });
      }

      const { full_name, phone, avatar_url } = req.body;
      
      const updatedUser = await this.authService.updateUser(req.user.userId, {
        full_name,
        phone,
        avatar_url
      });

      if (!updatedUser) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }

      res.json({
        message: 'Perfil atualizado com sucesso',
        data: { user: updatedUser }
      });
    } catch (error) {
      res.status(500).json({
        message: error.message || 'Erro ao atualizar perfil'
      });
    }
  };

  refreshToken = async (req, res) => {
    try {
      const { refreshToken } = req.body;
      
      if (!refreshToken) {
        return res.status(400).json({ message: 'Refresh token necessário' });
      }

      // In a real app, you would verify the refresh token here
      // For now, we'll generate a new token based on the current user
      if (!req.user) {
        return res.status(401).json({ message: 'Usuário não autenticado' });
      }

      const newToken = generateToken({
        userId: req.user.userId,
        email: req.user.email,
        isAdmin: req.user.isAdmin
      });

      res.json({
        message: 'Token renovado com sucesso',
        data: { token: newToken }
      });
    } catch (error) {
      res.status(401).json({
        message: error.message || 'Erro ao renovar token'
      });
    }
  };

  logout = async (req, res) => {
    try {
      // In a real app, you would invalidate the token here
      // For now, we'll just return a success message
      res.json({
        message: 'Logout realizado com sucesso'
      });
    } catch (error) {
      res.status(500).json({
        message: error.message || 'Erro ao fazer logout'
      });
    }
  };
}

module.exports = AuthController;
