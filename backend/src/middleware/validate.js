import { validate, createOrderSchema, addFundsSchema } from '../shared/schemas.js';

export const validateOrder = validate(createOrderSchema);
export const validateBalance = validate(addFundsSchema);