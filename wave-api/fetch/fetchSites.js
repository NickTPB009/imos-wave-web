// wave-api/fetch/fetchSites.js

const axios = require('axios');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Site = require('../models/Site');

const fetchAndUpdateSites = async () => {
  try {
    const url = 'https://geoserver-123.aodn.org.au/geoserver/ows';
    const params = {
      typeName: 'aodn:aodn_wave_nrt_v2_timeseries_data',
      SERVICE: 'WFS',
      outputFormat: 'application/json',
      REQUEST: 'GetFeature',
      VERSION: '1.0.0',
      PropertyName: 'site_name,LATITUDE,LONGITUDE',
    };

    const response = await axios.get(url, { params });
    const features = response.data.features || [];

    const uniqueMap = new Map();

    for (const feature of features) {
      const props = feature.properties;
      if (props.site_name && props.LATITUDE && props.LONGITUDE) {
        uniqueMap.set(props.site_name, {
          site_name: props.site_name,
          LATITUDE: props.LATITUDE,
          LONGITUDE: props.LONGITUDE,
        });
      }
    }

    const siteArray = Array.from(uniqueMap.values());

    for (const site of siteArray) {
      await Site.findOneAndUpdate(
        { site_name: site.site_name },
        site,
        { upsert: true, new: true }
      );
    }

    console.log(`✅ Updated ${siteArray.length} sites from GeoServer`);
  } catch (err) {
    console.error('❌ Failed to fetch sites:', err.message);
  }
};

// ⬇️ 如果直接运行这个文件，就先连接 MongoDB 然后执行 fetch 函数
if (require.main === module) {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log('✅ Connected to MongoDB');
      return fetchAndUpdateSites();
    })
    .then(() => {
      console.log('✅ Finished updating sites');
      process.exit(0);
    })
    .catch((err) => {
      console.error('❌ MongoDB connection failed:', err.message);
      process.exit(1);
    });
}

module.exports = fetchAndUpdateSites;
