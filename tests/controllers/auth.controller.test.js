const chai = require('chai');
const sinon = require('sinon');
const { expect } = chai;
const authService = require('../../src/services/auth.service');
const authController = require('../../src/controllers/auth.controller');

describe('Auth Controller', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('login', () => {
    it('should return tokens if login is successful', async () => {
      const req = { body: { email: 'test@example.com', password: 'secret' } };
      const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };
      sinon.stub(authService, 'login').resolves({ accessToken: 'abc', refreshToken: 'xyz' });

      await authController.login(req, res);
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.args[0][0]).to.deep.equal({ accessToken: 'abc', refreshToken: 'xyz' });
    });

    it('should return 401 if login fails', async () => {
      const req = { body: { email: 'bad@example.com', password: 'secret' } };
      const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };
      sinon.stub(authService, 'login').throws(new Error('User not found'));

      await authController.login(req, res);
      expect(res.status.calledWith(401)).to.be.true;
      expect(res.json.args[0][0].error).to.equal('User not found');
    });
  });

  describe('logout', () => {
    it('should return 200 and success message', async () => {
      const req = {};
      const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };

      await authController.logout(req, res);
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.args[0][0].message).to.equal('Logged out successfully');
    });
  });

  describe('refresh', () => {
    it('should return new tokens if refresh token is valid', async () => {
      const req = { body: { token: 'validRefresh' } };
      const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };

      sinon.stub(authService, 'refresh').resolves({ accessToken: 'newAccess', refreshToken: 'newRefresh' });
      await authController.refresh(req, res);
      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWith({ accessToken: 'newAccess', refreshToken: 'newRefresh' })).to.be.true;
    });

    it('should return 403 if refresh token is invalid', async () => {
      const req = { body: { token: 'invalidRefresh' } };
      const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };

      sinon.stub(authService, 'refresh').throws(new Error('Invalid or expired refresh token'));
      await authController.refresh(req, res);
      expect(res.status.calledWith(403)).to.be.true;
    });
  });
});