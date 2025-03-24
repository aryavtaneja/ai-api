const chai = require('chai');
const sinon = require('sinon');
const { expect } = chai;
const { ChatOpenAI } = require('@langchain/openai');
const { generateAIAnswer } = require('../../src/utils/aiClient');

describe('AI Client (generateAIAnswer)', () => {
  afterEach(() => {
    sinon.restore();
  });

  it('should return trimmed response text', async () => {
    sinon.stub(ChatOpenAI.prototype, 'call').resolves({ text: '  AI answer  ' });
    const result = await generateAIAnswer('What is AI?');
    expect(result).to.equal('AI answer');
  });

  it('should return an error message on failure', async () => {
    sinon.stub(ChatOpenAI.prototype, 'call').throws(new Error('OpenAI error'));
    const result = await generateAIAnswer('any question');
    expect(result).to.equal('Error generating answer, please try again.');
  });
});