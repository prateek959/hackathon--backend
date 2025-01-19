import mongoose from 'mongoose';

const foodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  calories: { type: Number, required: true },
  category: { type: String, required: true },  // Category like 'Pizza', 'Burger', etc.
  imageUrl: { type: String }, // Optional URL for food image
});

const Food = mongoose.model('food', foodSchema);

export default Food;
