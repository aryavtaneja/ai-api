const chai = require('chai');
const sinon = require('sinon');
const { expect } = chai;
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const userService = require('../../src/services/user.service');

describe('User Service', () => {
  beforeEach(() => {
    sinon.stub(PrismaClient.prototype, 'user').get(() => ({
      create: sinon.stub(),
      findUnique: sinon.stub(),
    }));
    sinon.stub(PrismaClient.prototype, 'question').get(() => ({
      findMany: sinon.stub(),
    }));
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('createUser', () => {
    it('should create a user with a hashed password', async () => {
      sinon.stub(bcrypt, 'hash').resolves('hashedPassword');
      sinon.stub(prisma.user, 'create').resolves({ id: 1, email: 'test@example.com', password: 'hashedPassword' });

      const user = await userService.createUser('test@example.com', 'plaintext');
      expect(user.password).to.equal('hashedPassword');
    });
  });

  describe('getUserById', () => {
    it('should retrieve user by ID', async () => {
      PrismaClient.prototype.user.findUnique.resolves({ id: 2, email: 'some@example.com' });
      const user = await userService.getUserById(2);
      expect(user).to.deep.equal({ id: 2, email: 'some@example.com' });
    });
  });

  describe('getUserQuestions', () => {
    it('should retrieve user questions', async () => {
      PrismaClient.prototype.question.findMany.resolves([
        { id: 11, content: 'Q1' },
        { id: 22, content: 'Q2' }
      ]);
      const questions = await userService.getUserQuestions(1);
      expect(questions).to.have.lengthOf(2);
    });
  });
});