const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createUser = async (email, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return prisma.user.create({
    data: {
      email,
      password: hashedPassword,
    },
  });
};

exports.getUserById = async (id) => {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
    },
  });
};

exports.getUserQuestions = async (userId) => {
  return prisma.question.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
};
