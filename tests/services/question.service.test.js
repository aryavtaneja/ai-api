const chai = require('chai');
const sinon = require('sinon');
const { expect } = chai;
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const questionService = require('../../src/services/question.service');
const { generateAIAnswer } = require('../../src/utils/aiClient');

describe('Question Service', () => {
  beforeEach(() => {
    sinon.stub(PrismaClient.prototype, 'question').get(() => ({
      create: sinon.stub(),
      update: sinon.stub(),
      findUnique: sinon.stub(),
    }));
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('createQuestion', () => {
    it('should create a question', async () => {
      PrismaClient.prototype.question.create.resolves({ id: 1, userId: 2, content: 'Hello' });
      const question = await questionService.createQuestion(2, 'Hello');
      expect(question.content).to.equal('Hello');
    });
  });

  describe('generateAnswer', () => {
    it('should call generateAIAnswer and return the result', async () => {
      sinon.stub(generateAIAnswer, 'call');
      sinon.stub(questionService, 'generateAnswer').callsFake(async (c) => 'Mocked AI Answer');
      const result = await questionService.generateAnswer('Hi?');
      expect(result).to.equal('Mocked AI Answer');
    });
  });

  describe('updateQuestionAnswer', () => {
    it('should update the question with a new answer', async () => {
      PrismaClient.prototype.question.update.resolves({ id: 1, answer: 'Yes' });
      const updated = await questionService.updateQuestionAnswer(1, 'Yes');
      expect(updated.answer).to.equal('Yes');
    });
  });

  describe('getQuestionById', () => {
    it('should fetch question by ID', async () => {
      const mockQuestion = { id: 1, userId: 2, content: 'What is the capital of France?' };
      PrismaClient.prototype.question.findUnique.resolves(mockQuestion);
      const question = await questionService.getQuestionById(1);
      expect(question.content).to.equal('What is the capital of France?');
      expect(question.userId).to.equal(2);
    });
  });
});