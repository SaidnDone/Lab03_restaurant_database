const express = require('express');
const mongoose = require('mongoose');

// Import the Restaurant model correctly
const Restaurant = require('./restaurantModel');

const app = express();
const PORT = 3000;

// Connect to MongoDB Atlas
mongoose.connect('mongodb+srv://warstander45:comp3123@cluster0.djpgvtv.mongodb.net/w2024_comp3133?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });


// Route to get all restaurants
//http://localhost:3000/restaurants
app.get('/restaurants', async (req, res) => {
    try {
        const restaurants = await Restaurant.find();
        res.json(restaurants);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to get restaurants by cuisine
app.get('/restaurants/cuisine/:cuisine', async (req, res) => {
    const { cuisine } = req.params;
    try {
        const restaurants = await Restaurant.find({ cuisine });
        res.json(restaurants);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to get restaurants with selected columns and sorting by restaurant_id
// http://localhost:3000/restaurants/sorted/ASC
// http://localhost:3000/restaurants/sorted/DESC
app.get('/restaurants/sorted/:sortOrder', async (req, res) => {
    const { sortOrder } = req.params;

    try {
        const validSortOrders = ['ASC', 'DESC'];

        if (!validSortOrders.includes(sortOrder)) {
            return res.status(400).json({ error: 'Invalid sortOrder parameter. Use ASC or DESC.' });
        }

        const restaurants = await Restaurant.find()
            .select('id cuisine name city restaurant_id')
            .sort({ restaurant_id: sortOrder === 'DESC' ? -1 : 1 });

        res.json(restaurants);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



// Route to get restaurants where all cuisines are Delicatessen and city is not Brooklyn
app.get('/restaurants/:cuisine', async (req, res) => {
    const { cuisine } = req.params;

    try {
        const restaurants = await Restaurant.find({ cuisine, city: { $ne: 'Brooklyn' } })
            .select('cuisines name city -_id')
            .sort({ name: 1 });
        res.json(restaurants);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
