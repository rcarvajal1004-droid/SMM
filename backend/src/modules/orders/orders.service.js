import { ordersRepository } from './orders.repository.js';

export const ordersService = {
  list() { return ordersRepository.findAll(); },
  create(input) { return ordersRepository.create(input); }
};