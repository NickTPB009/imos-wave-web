const mongoose = require('mongoose');

const siteSchema = new mongoose.Schema({
  site_name: { type: String, required: true, unique: true },
  LATITUDE: Number,
  LONGITUDE: Number,
});

module.exports = mongoose.model('Site', siteSchema);
