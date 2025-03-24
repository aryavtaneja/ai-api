const { ChatOpenAI } = require('@langchain/openai');

const chat = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  modelName: 'gpt-4o',
  temperature: 0.7,
});

exports.generateAIAnswer = async (content) => {
  try {
    const response = await chat.call([
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content },
    ]);
    return response.text.trim();
  } catch (error) {
    console.error('Error generating AI answer:', error);
    return 'Error generating answer, please try again.';
  }
};
