import { quotesRepository } from './quotes.repository.js';

const SERVICE_TYPES = ['HVAC Installation', 'HVAC Repair', 'Electrical Installation', 'Electrical Repair'];
const PROPERTY_TYPES = ['Residential', 'Commercial', 'Industrial'];
const EFFICIENCY_RATINGS = ['Standard', 'High', 'Premium'];

export const quotesService = {
  async list(userId) {
    return quotesRepository.findAllByUser(userId);
  },

  async getById(userId, quoteId) {
    const quote = await quotesRepository.findById(quoteId);
    if (!quote || quote.userId !== userId) {
      throw Object.assign(new Error('Quote not found'), { statusCode: 404 });
    }
    return quote;
  },

  async create(userId, data) {
    if (!SERVICE_TYPES.includes(data.serviceType)) {
      throw Object.assign(new Error('Invalid service type'), { statusCode: 400 });
    }
    if (!PROPERTY_TYPES.includes(data.propertyType)) {
      throw Object.assign(new Error('Invalid property type'), { statusCode: 400 });
    }
    if (data.efficiencyRating && !EFFICIENCY_RATINGS.includes(data.efficiencyRating)) {
      throw Object.assign(new Error('Invalid efficiency rating'), { statusCode: 400 });
    }
    if (data.squareFootage < 100 || data.squareFootage > 100000) {
      throw Object.assign(new Error('Square footage must be between 100 and 100000'), { statusCode: 400 });
    }

    const estimatedCost = this.calculateEstimate(data);
    return quotesRepository.create(userId, { ...data, estimatedCost });
  },

  calculateEstimate(data) {
    const baseRate = data.serviceType.includes('Installation') ? 5000 : 200;
    const propertyMultiplier = { Residential: 1, Commercial: 1.5, Industrial: 2 }[data.propertyType];
    const efficiencyMultiplier = { Standard: 1, High: 1.3, Premium: 1.6 }[data.efficiencyRating] || 1;
    const sqftFactor = Math.max(1, data.squareFootage / 2000);

    return Math.round(baseRate * propertyMultiplier * efficiencyMultiplier * sqftFactor * 100) / 100;
  },

  async updateStatus(userId, quoteId, status) {
    const quote = await quotesRepository.findById(quoteId);
    if (!quote || quote.userId !== userId) {
      throw Object.assign(new Error('Quote not found'), { statusCode: 404 });
    }
    return quotesRepository.updateStatus(quoteId, status);
  },
};