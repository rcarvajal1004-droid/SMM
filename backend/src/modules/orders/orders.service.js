import { ordersRepository } from './orders.repository.js';
import { servicesRepository } from '../services/services.repository.js';
import { userRepository } from '../users/user.repository.js';

export const ordersService = {
  async list(userId) {
    return ordersRepository.findAll(userId);
  },

  async getById(userId, orderId) {
    const order = await ordersRepository.findById(orderId);
    if (!order || order.userId !== userId) {
      throw Object.assign(new Error('Order not found'), { statusCode: 404 });
    }
    return order;
  },

  async create(user, input) {
    const service = await servicesRepository.findById(input.serviceId);
    if (!service) throw Object.assign(new Error('Service not found'), { statusCode: 404 });
    if (input.quantity < service.min || input.quantity > service.max) {
      throw Object.assign(new Error(`quantity must be between ${service.min} and ${service.max}`), { statusCode: 400 });
    }
    const charge = Math.round((input.quantity / 1000) * service.ratePer1000 * 100) / 100;

    const current = await userRepository.findById(user.id);
    if (current.balance < charge) throw Object.assign(new Error('Insufficient balance'), { statusCode: 409 });

    const order = await ordersRepository.create(user.id, {
      serviceId: service.id,
      link: input.link,
      quantity: input.quantity,
      charge
    });
    await userRepository.addBalanceTransaction(user.id, charge, 'Debit', `Order #${order.id}`);

    const updated = await userRepository.findById(user.id);
    user.balance = updated.balance;
    return order;
  },

  async cancel(userId, orderId) {
    const order = await ordersRepository.findById(orderId);
    if (!order || order.userId !== userId) {
      throw Object.assign(new Error('Order not found'), { statusCode: 404 });
    }
    if (order.status !== 'Pending') {
      throw Object.assign(new Error('Only pending orders can be cancelled'), { statusCode: 409 });
    }
    await ordersRepository.updateStatus(orderId, 'Canceled');
    await userRepository.addBalanceTransaction(userId, order.charge, 'Refund', `Cancel order #${orderId}`);
    return ordersRepository.findById(orderId);
  },
};