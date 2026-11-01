const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

exports.register = async (req, res) => {
  try {
    const { full_name, email, password } = req.body;
    if (!full_name || !email || !password)
      return res.status(400).json({ error: 'All fields are required' });
    if (password.length < 6)
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    if (await User.findByEmail(email))
      return res.status(409).json({ error: 'Email already registered' });

    const password_hash = await bcrypt.hash(password, 10);
    const user = await User.create({ full_name, email, password_hash });
    res.status(201).json({ message: 'Account created', user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByEmail(email);
    if (!user || !user.is_active || !(await bcrypt.compare(password, user.password_hash)))
      return res.status(401).json({ error: 'Invalid email or password' });

    const token = jwt.sign(
      { user_id: user.user_id, role_id: user.role_id },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );
    res.json({
      message: 'Login successful',
      token,
      user: { user_id: user.user_id, full_name: user.full_name, email: user.email }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};