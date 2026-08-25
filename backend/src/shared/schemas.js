import { z } from 'zod';

export const registerSchema = z.object({
  username: z.string().min(3).max(80).regex(/^[a-zA-Z0-9_-]+$/),
  email: z.string().email().max(254),
  password: z.string().min(8).max(128).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/),
});

export const loginSchema = z.object({
  identifier: z.string().min(1),
  password: z.string().min(1),
});

export const createOrderSchema = z.object({
  serviceId: z.number().int().positive(),
  link: z.string().url().max(2048),
  quantity: z.number().int().positive().max(1000000),
});

const serviceBaseSchema = z.object({
  name: z.string().min(1).max(160),
  category: z.string().min(1).max(80),
  ratePerThousand: z.number().nonnegative().max(999999.9999),
  minimumQuantity: z.number().int().positive(),
  maximumQuantity: z.number().int().positive(),
  description: z.string().max(500).optional(),
});

export const createServiceSchema = serviceBaseSchema.refine(
  data => data.maximumQuantity >= data.minimumQuantity,
  { message: 'maximumQuantity must be >= minimumQuantity', path: ['maximumQuantity'] }
);

export const updateServiceSchema = serviceBaseSchema.partial().refine(
  data => data.maximumQuantity === undefined || data.minimumQuantity === undefined || data.maximumQuantity >= data.minimumQuantity,
  { message: 'maximumQuantity must be >= minimumQuantity', path: ['maximumQuantity'] }
);

export const addFundsSchema = z.object({
  amount: z.number().positive().max(999999.9999),
  provider: z.string().min(1).max(40).optional().default('manual'),
  providerReference: z.string().max(160).optional(),
});

export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    return res.status(400).json({
      error: 'Validation failed',
      details: errors,
      requestId: req.requestId,
    });
  }
  req.validated = result.data;
  next();
};