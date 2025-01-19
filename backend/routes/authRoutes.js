import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/user.js';
const authRoutes = express.Router();

// Register User
authRoutes.post('/register', async (req, res) => {
  const { email, password } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) return res.status(400).json({ message: 'User already exists' });

  const user = new User({ email, password });
  await user.save();
  res.status(201).json({ message: 'User registered successfully' });
});

// Login User
authRoutes.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'User not found' });

  const isPasswordCorrect = await user.matchPassword(password);
  if (!isPasswordCorrect) return res.status(400).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

export default authRoutes;
