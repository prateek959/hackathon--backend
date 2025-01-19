import express from 'express';
import Food from '../models/food.js';
import jwt from 'jsonwebtoken';
const foodRoutes = express.Router();

// Add new food item (Admin Only)
foodRoutes.post('/add', async (req, res) => {
  const { name, calories, category, imageUrl } = req.body;
  // const token = req.headers.authorization;

  try {
    // const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // if (!decoded.isAdmin) return res.status(403).json({ message: 'Access denied' });

    const newFood = new Food({ name, calories, category, imageUrl });
    await newFood.save();
    res.status(201).json({ message: 'Food item added successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all food items
foodRoutes.get('/', async (req, res) => {
  try {
    const foods = await Food.find();
    res.json(foods);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default foodRoutes;
