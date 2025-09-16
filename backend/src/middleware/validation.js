const Joi = require('joi');

const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      const errorMessage = error.details.map(detail => detail.message).join(', ');
      return res.status(400).json({ 
        message: 'Dados inválidos', 
        errors: errorMessage 
      });
    }
    
    next();
  };
};

// Validation schemas
const authSchemas = {
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
  }),
  
  register: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    full_name: Joi.string().min(2).max(100).optional(),
    phone: Joi.string().optional()
  })
};

const courseSchemas = {
  create: Joi.object({
    title: Joi.string().min(3).max(200).required(),
    description: Joi.string().max(1000).optional(),
    price: Joi.number().positive().required(),
    image_url: Joi.string().uri().optional(),
    category: Joi.string().min(2).max(50).required(),
    content_url: Joi.string().uri().optional(),
    duration: Joi.string().optional(),
    instructor: Joi.string().max(100).optional(),
    level: Joi.string().max(50).optional(),
    is_active: Joi.boolean().optional()
  }),
  
  update: Joi.object({
    title: Joi.string().min(3).max(200).optional(),
    description: Joi.string().max(1000).optional(),
    price: Joi.number().positive().optional(),
    image_url: Joi.string().uri().optional(),
    category: Joi.string().min(2).max(50).optional(),
    content_url: Joi.string().uri().optional(),
    duration: Joi.string().optional(),
    instructor: Joi.string().max(100).optional(),
    level: Joi.string().max(50).optional(),
    is_active: Joi.boolean().optional()
  })
};

const serviceSchemas = {
  create: Joi.object({
    name: Joi.string().min(3).max(200).required(),
    description: Joi.string().max(1000).optional(),
    price: Joi.number().positive().required(),
    duration: Joi.number().positive().required(),
    image_url: Joi.string().uri().optional(),
    is_active: Joi.boolean().optional()
  }),
  
  update: Joi.object({
    name: Joi.string().min(3).max(200).optional(),
    description: Joi.string().max(1000).optional(),
    price: Joi.number().positive().optional(),
    duration: Joi.number().positive().optional(),
    image_url: Joi.string().uri().optional(),
    is_active: Joi.boolean().optional()
  })
};

const appointmentSchemas = {
  create: Joi.object({
    service_id: Joi.string().uuid().required(),
    appointment_date: Joi.date().greater('now').required(),
    client_name: Joi.string().min(2).max(100).required(),
    client_email: Joi.string().email().required(),
    client_phone: Joi.string().required(),
    notes: Joi.string().max(500).optional()
  }),
  
  update: Joi.object({
    service_id: Joi.string().uuid().optional(),
    appointment_date: Joi.date().greater('now').optional(),
    client_name: Joi.string().min(2).max(100).optional(),
    client_email: Joi.string().email().optional(),
    client_phone: Joi.string().optional(),
    notes: Joi.string().max(500).optional(),
    status: Joi.string().valid('pending', 'confirmed', 'cancelled', 'completed').optional()
  })
};

const orderSchemas = {
  create: Joi.object({
    total_amount: Joi.number().positive().required(),
    payment_method: Joi.string().optional(),
    items: Joi.array().items(
      Joi.object({
        course_id: Joi.string().uuid().required(),
        price: Joi.number().positive().required()
      })
    ).min(1).required()
  }),
  
  update: Joi.object({
    payment_method: Joi.string().optional(),
    status: Joi.string().valid('pending', 'paid', 'cancelled', 'refunded').optional()
  })
};

module.exports = {
  validateRequest,
  authSchemas,
  courseSchemas,
  serviceSchemas,
  appointmentSchemas,
  orderSchemas
};
