import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv' 
import authRoutes from './routes/authRoutes.js';
import foodRoutes from './routes/foodRoutes.js';
import scanRoutes from './routes/scanRoutes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Error connecting to MongoDB", err);
  }
};

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/foods', foodRoutes);
app.use('/api/scan', scanRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
