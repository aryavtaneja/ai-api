const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { generateAIAnswer } = require('../utils/aiClient');

exports.createQuestion = async (userId, content) => {
  return prisma.question.create({
    data: {
      userId,
      content,
    },
  });
};

exports.generateAnswer = async (content) => {
  return generateAIAnswer(content);
};

exports.updateQuestionAnswer = async (questionId, answer) => {
  return prisma.question.update({
    where: { id: questionId },
    data: { answer },
  });
};

exports.getQuestionById = async (id) => {
  return prisma.question.findUnique({ where: { id } });
};
