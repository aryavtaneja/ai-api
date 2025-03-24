const chai = require('chai');
const sinon = require('sinon');
const { expect } = chai;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const authService = require('../../src/services/auth.service');

describe('Auth Service', () => {
  beforeEach(() => {
    sinon.stub(PrismaClient.prototype, 'user').get(() => ({
      findUnique: sinon.stub(),
    }));
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('login', () => {
    it('should throw error if user is not found', async () => {
      PrismaClient.prototype.user.findUnique.resolves(null);
      try {
        await authService.login('notfound@example.com', 'pass');
      } catch (err) {
        expect(err.message).to.equal('User not found');
      }
    });

    it('should throw error if password does not match', async () => {
      PrismaClient.prototype.user.findUnique.resolves({ id: 2, email: 'test@example.com', password: 'hashed' });
      sinon.stub(bcrypt, 'compare').resolves(false);
      try {
        await authService.login('test@example.com', 'wrongpassword');
      } catch (err) {
        expect(err.message).to.equal('Invalid credentials');
      }
    });

    it('should return tokens if login is successful', async () => {
      PrismaClient.prototype.user.findUnique.resolves({ id: 2, email: 'test@example.com', password: 'hashed' });
      sinon.stub(bcrypt, 'compare').resolves(true);
      sinon.stub(jwt, 'sign')
        .onFirstCall().returns('accessToken')
        .onSecondCall().returns('refreshToken');

      const tokens = await authService.login('test@example.com', 'valid');
      expect(tokens).to.deep.equal({ accessToken: 'accessToken', refreshToken: 'refreshToken' });
    });
  });

  describe('refresh', () => {
    it('should throw error if no refresh token is provided', async () => {
      try {
        await authService.refresh();
      } catch (err) {
        expect(err.message).to.equal('No refresh token provided');
      }
    });

    it('should return new tokens if refresh is valid', async () => {
      sinon.stub(jwt, 'verify').returns({ id: 3, email: 'someone@example.com' });
      sinon.stub(jwt, 'sign')
        .onFirstCall().returns('newAccessToken')
        .onSecondCall().returns('newRefreshToken');

      const result = await authService.refresh('someValidToken');
      expect(result).to.deep.equal({
        accessToken: 'newAccessToken',
        refreshToken: 'newRefreshToken'
      });
    });

    it('should throw error if token is invalid', async () => {
      sinon.stub(jwt, 'verify').throws(new Error('Invalid token'));
      try {
        await authService.refresh('invalidRefreshToken');
      } catch (err) {
        expect(err.message).to.equal('Invalid or expired refresh token');
      }
    });
  });
});