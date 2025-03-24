const userService = require('../services/user.service');

exports.createUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userService.createUser(email, password);
    return res.status(201).json({ user });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await userService.getUserById(parseInt(userId, 10));
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.status(200).json({ user });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

exports.getUserQuestions = async (req, res) => {
  try {
    const { userId } = req.params;
    const questions = await userService.getUserQuestions(parseInt(userId, 10));
    return res.status(200).json({ questions });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};
