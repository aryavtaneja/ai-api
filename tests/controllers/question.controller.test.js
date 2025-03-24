const chai = require('chai');
const sinon = require('sinon');
const { expect } = chai;
const questionService = require('../../src/services/question.service');
const questionController = require('../../src/controllers/question.controller');

describe('Question Controller', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('createQuestion', () => {
    it('should create a question and AI answer, then return 201', async () => {
      const req = { user: { id: 1 }, body: { content: 'What is AI?' } };
      const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };

      sinon.stub(questionService, 'createQuestion').resolves({ id: 10, content: 'What is AI?' });
      sinon.stub(questionService, 'generateAnswer').resolves('AI stands for Artificial Intelligence.');
      sinon.stub(questionService, 'updateQuestionAnswer').resolves({
        id: 10,
        content: 'What is AI?',
        answer: 'AI stands for Artificial Intelligence.'
      });

      await questionController.createQuestion(req, res);
      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.args[0][0].answer).to.equal('AI stands for Artificial Intelligence.');
    });

    it('should return 400 on error', async () => {
      const req = { user: { id: 1 }, body: { content: 'What is AI?' } };
      const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };
      sinon.stub(questionService, 'createQuestion').throws(new Error('DB error'));

      await questionController.createQuestion(req, res);
      expect(res.status.calledWith(400)).to.be.true;
    });
  });

  describe('getQuestionById', () => {
    it('should return a question if found', async () => {
      const req = { params: { questionId: '10' } };
      const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };
      sinon.stub(questionService, 'getQuestionById').resolves({ id: 10, content: 'Q?' });

      await questionController.getQuestionById(req, res);
      expect(res.status.calledWith(200)).to.be.true;
    });

    it('should return 404 if no question is found', async () => {
      const req = { params: { questionId: '999' } };
      const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };
      sinon.stub(questionService, 'getQuestionById').resolves(null);

      await questionController.getQuestionById(req, res);
      expect(res.status.calledWith(404)).to.be.true;
    });
  });
});