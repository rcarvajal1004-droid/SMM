import { paymentsRepository } from './payments.repository.js';
import { userRepository } from '../users/user.repository.js';

export const paymentsService = {
  async list(userId) {
    return paymentsRepository.findAllByUser(userId);
  },

  async create(userId, { amount, provider, providerReference }) {
    const payment = await paymentsRepository.create(userId, { amount, provider, providerReference });
    return payment;
  },

  async approve(paymentId) {
    const payment = await paymentsRepository.findById(paymentId);
    if (!payment) throw new Error('Payment not found');
    if (payment.status !== 'Pending') throw new Error('Payment already processed');

    const updated = await paymentsRepository.updateStatus(paymentId, 'Approved');

    await userRepository.addBalanceTransaction(payment.userId, payment.amount, 'Credit', `payment-${payment.id}`);

    return updated;
  },

  async reject(paymentId) {
    const payment = await paymentsRepository.findById(paymentId);
    if (!payment) throw new Error('Payment not found');
    if (payment.status !== 'Pending') throw new Error('Payment already processed');

    return paymentsRepository.updateStatus(paymentId, 'Rejected');
  },

  async refund(paymentId) {
    const payment = await paymentsRepository.findById(paymentId);
    if (!payment) throw new Error('Payment not found');
    if (payment.status !== 'Approved') throw new Error('Only approved payments can be refunded');

    const updated = await paymentsRepository.updateStatus(paymentId, 'Refunded');

    await userRepository.addBalanceTransaction(payment.userId, payment.amount, 'Debit', `refund-${payment.id}`);

    return updated;
  },
};