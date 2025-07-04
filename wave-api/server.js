// wave-api/server.js
require('dotenv').config();
console.log("MONGO_URI from env:", process.env.MONGO_URI); 

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cron = require('node-cron');
const fetchAndUpdateSites = require('./fetch/fetchSites');
const siteRoutes = require('./routes/sites');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Routes
app.use('/api/sites', siteRoutes);

// runs daily at midnight
cron.schedule('0 1 * * *', async () => {
  console.log('Running scheduled GeoServer update...');
  await fetchAndUpdateSites();
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
