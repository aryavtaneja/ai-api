const chai = require('chai');
const sinon = require('sinon');
const { expect } = chai;
const jwt = require('jsonwebtoken');
const { authenticateToken } = require('../../src/middlewares/auth.middleware');

describe('Auth Middleware', () => {
  afterEach(() => {
    sinon.restore();
  });

  it('should return 401 if no authorization header provided', () => {
    const req = { headers: {} };
    const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };
    const next = sinon.stub();
    authenticateToken(req, res, next);
    expect(res.status.calledWith(401)).to.be.true;
    expect(next.called).to.be.false;
  });

  it('should return 403 if token is invalid', () => {
    const req = { headers: { authorization: 'Bearer invalidToken' } };
    const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };
    const next = sinon.stub();
    sinon.stub(jwt, 'verify').callsFake((token, secret, cb) => cb(new Error('Invalid token')));
    authenticateToken(req, res, next);
    expect(res.status.calledWith(403)).to.be.true;
    expect(next.called).to.be.false;
  });

  it('should call next if token is valid', () => {
    const req = { headers: { authorization: 'Bearer validToken' } };
    const res = {};
    const next = sinon.stub();
    sinon.stub(jwt, 'verify').callsFake((token, secret, cb) => cb(null, { id: 1, email: 'test@example.com' }));
    authenticateToken(req, res, next);
    expect(next.called).to.be.true;
  });
});