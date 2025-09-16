const OrderService = require('../services/orderService');
const { validateRequest, orderSchemas } = require('../middleware/validation');

class OrdersController {
  constructor() {
    this.orderService = new OrderService();
  }

  getOrders = async (req, res) => {
    try {
      const orders = await this.orderService.getAllOrders();

      res.json({
        message: 'Pedidos obtidos com sucesso',
        data: orders
      });
    } catch (error) {
      res.status(500).json({
        message: error.message || 'Erro ao buscar pedidos'
      });
    }
  };

  getOrdersByUser = async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Usuário não autenticado' });
      }

      const orders = await this.orderService.getOrdersByUser(req.user.userId);

      res.json({
        message: 'Pedidos do usuário obtidos com sucesso',
        data: orders
      });
    } catch (error) {
      res.status(500).json({
        message: error.message || 'Erro ao buscar pedidos do usuário'
      });
    }
  };

  getOrder = async (req, res) => {
    try {
      const { id } = req.params;
      const orderWithItems = await this.orderService.getOrderWithItems(id);
      
      if (!orderWithItems) {
        return res.status(404).json({ message: 'Pedido não encontrado' });
      }
      
      res.json({
        message: 'Pedido obtido com sucesso',
        data: orderWithItems
      });
    } catch (error) {
      res.status(500).json({
        message: error.message || 'Erro ao buscar pedido'
      });
    }
  };

  createOrder = async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Usuário não autenticado' });
      }

      const orderData = {
        ...req.body,
        user_id: req.user.userId
      };
      
      const order = await this.orderService.createOrder(orderData);
      
      res.status(201).json({
        message: 'Pedido criado com sucesso',
        data: order
      });
    } catch (error) {
      res.status(400).json({
        message: error.message || 'Erro ao criar pedido'
      });
    }
  };

  updateOrder = async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      const order = await this.orderService.updateOrder(id, updateData);
      
      if (!order) {
        return res.status(404).json({ message: 'Pedido não encontrado' });
      }
      
      res.json({
        message: 'Pedido atualizado com sucesso',
        data: order
      });
    } catch (error) {
      res.status(500).json({
        message: error.message || 'Erro ao atualizar pedido'
      });
    }
  };

  deleteOrder = async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await this.orderService.deleteOrder(id);
      
      if (!deleted) {
        return res.status(404).json({ message: 'Pedido não encontrado' });
      }
      
      res.json({
        message: 'Pedido excluído com sucesso'
      });
    } catch (error) {
      res.status(500).json({
        message: error.message || 'Erro ao excluir pedido'
      });
    }
  };

  getOrderStats = async (req, res) => {
    try {
      const stats = await this.orderService.getOrderStats();
      
      res.json({
        message: 'Estatísticas de pedidos obtidas com sucesso',
        data: stats
      });
    } catch (error) {
      res.status(500).json({
        message: error.message || 'Erro ao buscar estatísticas de pedidos'
      });
    }
  };
}

module.exports = OrdersController;
