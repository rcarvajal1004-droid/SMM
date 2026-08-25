import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env.js';
import { userRepository } from '../users/user.repository.js';

const REFRESH_SECRET = env.jwtSecret + '-refresh';
const REFRESH_EXPIRES_IN = '7d';

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password, storedHash) {
  if (!storedHash || !storedHash.includes(':')) return false;
  const [salt, hash] = storedHash.split(':');
  const derived = crypto.scryptSync(password, salt, 64).toString('hex');
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(derived, 'hex'));
}

function generateTokens(user) {
  const accessToken = jwt.sign({ sub: user.id, username: user.username }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
  const refreshToken = jwt.sign({ sub: user.id, type: 'refresh' }, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES_IN });
  return { accessToken, refreshToken };
}

export const authService = {
  async register({ username, email, password }) {
    const existing = await userRepository.findByUsernameOrEmail(username);
    if (existing) {
      const error = new Error('Username or email already exists');
      error.statusCode = 409;
      throw error;
    }
    const user = await userRepository.create({
      username,
      email,
      passwordHash: hashPassword(password)
    });
    const tokens = generateTokens(user);
    return { ...tokens, user: this.publicUser(user) };
  },

  async login(identifier, password) {
    const user = await userRepository.findByUsernameOrEmail(identifier);
    if (!user || !verifyPassword(password, user.passwordHash)) {
      const error = new Error('Invalid credentials');
      error.statusCode = 401;
      throw error;
    }
    const tokens = generateTokens(user);
    return { ...tokens, user: this.publicUser(user) };
  },

  async refresh(refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, REFRESH_SECRET);
      if (decoded.type !== 'refresh') throw new Error('Invalid token type');
      const user = await userRepository.findById(decoded.sub);
      if (!user) throw new Error('User not found');
      const tokens = generateTokens(user);
      return { ...tokens, user: this.publicUser(user) };
    } catch {
      const error = new Error('Invalid or expired refresh token');
      error.statusCode = 401;
      throw error;
    }
  },

  async logout(userId) {
    return { success: true };
  },

  async changePassword(userId, currentPassword, newPassword) {
    const user = await userRepository.findById(userId);
    if (!user || !verifyPassword(currentPassword, user.passwordHash)) {
      const error = new Error('Current password is incorrect');
      error.statusCode = 401;
      throw error;
    }
    await userRepository.updatePassword(userId, hashPassword(newPassword));
    return { success: true };
  },

  async findById(id) {
    return userRepository.findById(id);
  },

  publicUser(user) {
    return { id: user.id, username: user.username, email: user.email, balance: user.balance };
  }
};