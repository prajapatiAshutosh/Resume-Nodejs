import Joi from 'joi';

export const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const errors = {};
      error.details.forEach((detail) => {
        errors[detail.path[0]] = detail.message;
      });

      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors,
      });
    }

    next();
  };
};

export const registerSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email',
    'any.required': 'Email is required',
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters',
    'any.required': 'Password is required',
  }),
  confirmPassword: Joi.string().optional(), // Frontend sends this for validation
  name: Joi.string().optional(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email',
    'any.required': 'Email is required',
  }),
  password: Joi.string().required().messages({
    'any.required': 'Password is required',
  }),
});

export const resumeSchema = Joi.object({
  title: Joi.string().required().messages({
    'any.required': 'Title is required',
  }),
  template: Joi.string().valid('classic', 'modern', 'minimal').default('classic'),
  content: Joi.object({
    contact: Joi.object({
      name: Joi.string().allow(''),
      email: Joi.string().allow(''),
      phone: Joi.string().allow(''),
      linkedin: Joi.string().allow(''),
      website: Joi.string().allow(''),
    }).optional(),
    summary: Joi.string().allow(''),
    experience: Joi.array().items(
      Joi.object({
        company: Joi.string().allow(''),
        title: Joi.string().allow(''),
        from: Joi.string().allow(''),
        to: Joi.string().allow(''),
        html: Joi.string().allow(''),
      })
    ),
    education: Joi.array().items(
      Joi.object({
        institution: Joi.string().allow(''),
        degree: Joi.string().allow(''),
        from: Joi.string().allow(''),
        to: Joi.string().allow(''),
        html: Joi.string().allow(''),
      })
    ),
    skills: Joi.array().items(Joi.string()),
    projects: Joi.array().items(
      Joi.object({
        name: Joi.string().allow(''),
        description: Joi.string().allow(''),
        html: Joi.string().allow(''),
      })
    ),
  }).required(),
});
