const authService = require('../services/auth.service');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { accessToken, refreshToken } = await authService.login(email, password);
    return res.status(200).json({ accessToken, refreshToken });
  } catch (err) {
    return res.status(401).json({ error: err.message });
  }
};

exports.logout = async (req, res) => {
  return res.status(200).json({ message: 'Logged out successfully' });
};

exports.refresh = async (req, res) => {
  try {
    const { token } = req.body;
    const newTokens = await authService.refresh(token);
    return res.status(200).json(newTokens);
  } catch (err) {
    return res.status(403).json({ error: err.message });
  }
};
