const express = require('express');
const Site = require('../models/Site');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const sites = await Site.find().sort({ site_name: 1 });
    res.json(sites);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch sites' });
  }
});

module.exports = router;
