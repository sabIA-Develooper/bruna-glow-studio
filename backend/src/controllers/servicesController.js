const ServiceService = require('../services/serviceService');
const { validateRequest, serviceSchemas } = require('../middleware/validation');

class ServicesController {
  constructor() {
    this.serviceService = new ServiceService();
  }

  getServices = async (req, res) => {
    try {
      const { search } = req.query;
      
      let services;
      if (search) {
        services = await this.serviceService.searchServices(search);
      } else {
        services = await this.serviceService.getAllServices();
      }

      res.json({
        message: 'Serviços obtidos com sucesso',
        data: services
      });
    } catch (error) {
      res.status(500).json({
        message: error.message || 'Erro ao buscar serviços'
      });
    }
  };

  getService = async (req, res) => {
    try {
      const { id } = req.params;
      const service = await this.serviceService.getServiceById(id);
      
      if (!service) {
        return res.status(404).json({ message: 'Serviço não encontrado' });
      }
      
      res.json({
        message: 'Serviço obtido com sucesso',
        data: service
      });
    } catch (error) {
      res.status(500).json({
        message: error.message || 'Erro ao buscar serviço'
      });
    }
  };

  createService = async (req, res) => {
    try {
      const serviceData = req.body;
      const service = await this.serviceService.createService(serviceData);
      
      res.status(201).json({
        message: 'Serviço criado com sucesso',
        data: service
      });
    } catch (error) {
      res.status(500).json({
        message: error.message || 'Erro ao criar serviço'
      });
    }
  };

  updateService = async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      const service = await this.serviceService.updateService(id, updateData);
      
      if (!service) {
        return res.status(404).json({ message: 'Serviço não encontrado' });
      }
      
      res.json({
        message: 'Serviço atualizado com sucesso',
        data: service
      });
    } catch (error) {
      res.status(500).json({
        message: error.message || 'Erro ao atualizar serviço'
      });
    }
  };

  deleteService = async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await this.serviceService.deleteService(id);
      
      if (!deleted) {
        return res.status(404).json({ message: 'Serviço não encontrado' });
      }
      
      res.json({
        message: 'Serviço excluído com sucesso'
      });
    } catch (error) {
      res.status(500).json({
        message: error.message || 'Erro ao excluir serviço'
      });
    }
  };
}

module.exports = ServicesController;
