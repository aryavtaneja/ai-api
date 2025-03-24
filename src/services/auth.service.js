const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

exports.login = async (email, password) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error('User not found');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  const accessToken = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: process.env.TOKEN_EXPIRATION || '15m',
  });

  const refreshToken = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRATION || '7d',
  });

  return { accessToken, refreshToken };
};

exports.refresh = async (refreshToken) => {
  if (!refreshToken) throw new Error('No refresh token provided');
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const accessToken = jwt.sign({ id: decoded.id, email: decoded.email }, process.env.JWT_SECRET, {
      expiresIn: process.env.TOKEN_EXPIRATION || '15m',
    });
    const newRefreshToken = jwt.sign({ id: decoded.id, email: decoded.email }, process.env.JWT_SECRET, {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRATION || '7d',
    });
    return { accessToken, refreshToken: newRefreshToken };
  } catch (err) {
    throw new Error('Invalid or expired refresh token');
  }
};
