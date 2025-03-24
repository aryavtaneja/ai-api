const chai = require('chai');
const sinon = require('sinon');
const { expect } = chai;
const userService = require('../../src/services/user.service');
const userController = require('../../src/controllers/user.controller');

describe('User Controller', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('createUser', () => {
    it('should create a user and return 201', async () => {
      const req = { body: { email: 'test@example.com', password: 'password123' } };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub()
      };

      sinon.stub(userService, 'createUser').resolves({ id: 1, email: 'test@example.com' });
      await userController.createUser(req, res);

      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledWith({ user: { id: 1, email: 'test@example.com' } })).to.be.true;
    });

    it('should return 400 if user creation fails', async () => {
      const req = { body: { email: 'invalid', password: '' } };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub()
      };

      sinon.stub(userService, 'createUser').throws(new Error('Validation error'));
      await userController.createUser(req, res);

      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.args[0][0].error).to.equal('Validation error');
    });
  });

  describe('getUserProfile', () => {
    it('should return user profile if user exists', async () => {
      const req = { params: { userId: '1' } };
      const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };
      sinon.stub(userService, 'getUserById').resolves({ id: 1, email: 'test@example.com' });

      await userController.getUserProfile(req, res);
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith({ user: { id: 1, email: 'test@example.com' } })).to.be.true;
    });

    it('should return 404 if user is not found', async () => {
      const req = { params: { userId: '999' } };
      const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };
      sinon.stub(userService, 'getUserById').resolves(null);

      await userController.getUserProfile(req, res);
      expect(res.status.calledWith(404)).to.be.true;
    });
  });

  describe('getUserQuestions', () => {
    it('should return a list of questions for a valid user', async () => {
      const req = { params: { userId: '1' } };
      const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };
      sinon.stub(userService, 'getUserQuestions').resolves([{ id: 101, content: 'Sample Q' }]);

      await userController.getUserQuestions(req, res);
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.args[0][0].questions).to.have.lengthOf(1);
    });

    it('should return 400 on error', async () => {
      const req = { params: { userId: '1' } };
      const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };
      sinon.stub(userService, 'getUserQuestions').throws(new Error('Something went wrong'));

      await userController.getUserQuestions(req, res);
      expect(res.status.calledWith(400)).to.be.true;
    });
  });
});