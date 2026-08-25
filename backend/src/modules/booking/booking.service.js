import { bookingRepository } from './booking.repository.js';

const SERVICE_TYPES = ['HVAC Installation', 'HVAC Repair', 'Electrical Installation', 'Electrical Repair', 'Maintenance', 'Inspection'];

export const bookingService = {
  async list(userId) {
    return bookingRepository.findAllByUser(userId);
  },

  async getById(userId, bookingId) {
    const booking = await bookingRepository.findById(bookingId);
    if (!booking || booking.userId !== userId) {
      throw Object.assign(new Error('Booking not found'), { statusCode: 404 });
    }
    return booking;
  },

  async create(userId, data) {
    if (!SERVICE_TYPES.includes(data.serviceType)) {
      throw Object.assign(new Error('Invalid service type'), { statusCode: 400 });
    }

    const preferredDate = new Date(data.preferredDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (preferredDate < today) {
      throw Object.assign(new Error('Preferred date cannot be in the past'), { statusCode: 400 });
    }

    return bookingRepository.create(userId, data);
  },

  async cancel(userId, bookingId) {
    const booking = await bookingRepository.findById(bookingId);
    if (!booking || booking.userId !== userId) {
      throw Object.assign(new Error('Booking not found'), { statusCode: 404 });
    }
    if (['Completed', 'Cancelled'].includes(booking.status)) {
      throw Object.assign(new Error('Cannot cancel this booking'), { statusCode: 409 });
    }
    return bookingRepository.cancel(bookingId);
  },
};