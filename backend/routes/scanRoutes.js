import express from 'express';
import QRCode from 'qrcode';
import Food from '../models/food.js';  // Assuming Food model is in models folder

const scanRoutes = express.Router();

scanRoutes.post('/generate', async (req, res) => {
  try {
    const { foodItems } = req.body.qrData;  // Expecting an array of food items with name and quantity
    console.log('Received food items:', foodItems);  // Log the received food items for debugging

    if (!foodItems || !Array.isArray(foodItems) || foodItems.length === 0) {
      return res.status(400).json({ error: 'No food items provided' });
    }

    // Fetch details of the food items from the database and calculate total calories
    const foodDetails = [];
    let totalCalories = 0;

    // Loop through the foodItems array
    for (const item of foodItems) {
      const { foodName, quantity } = item;

      // Validate that foodName and quantity are provided
      if (!foodName || quantity == null || quantity <= 0) {
        return res.status(400).json({ error: 'Each item must have a valid foodName and quantity' });
      }

      // Fetch the food item from the database using foodName
      const food = await Food.findOne({ name: foodName }); // Find food by name
      if (!food) {
        return res.status(404).json({ error: `Food item not found: ${foodName}` });
      }

      // Calculate the total calories for this food item
      const caloriesForItem = food.calories * quantity; // calories * quantity
      totalCalories += caloriesForItem;

      foodDetails.push({
        foodName: food.name,
        quantity,
        caloriesForItem,  // Add calories for this specific item
        category: food.category,
      });
    }

    // Log the total calories after processing all food items
    console.log('Total Calories:', totalCalories);

    // Generate the QR code data with item details and total calories
    const qrData = {
      totalCalories,
      itemCount: foodItems.length,
      foodItems: foodDetails,  // Send the array of food items with foodName, quantity, and calories
    };

    // Increase the QR Code version to handle more data
    const qrCodeImage = await QRCode.toDataURL(JSON.stringify(qrData), {
      version: 11,  // Increase the QR code version to 11 or higher
    });

    res.json({ qrData: qrCodeImage });  // Return QR code image URL
  } catch (error) {
    console.error('Error generating QR code:', error);
    res.status(500).json({ error: 'Failed to generate QR code' });
  }
});

export default scanRoutes;
