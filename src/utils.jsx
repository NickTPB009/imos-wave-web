// src/utils.js
export function replaceSpacesWithHyphens(str) {
  return str.replace(/\s+/g, "-");
}

export async function fetchLatestWaveData(siteName) {
  const baseUrl = "https://geoserver-123.aodn.org.au/geoserver/ows";
  const params = new URLSearchParams({
    typeName: "aodn:aodn_wave_nrt_v2_timeseries_data",
    SERVICE: "WFS",
    outputFormat: "application/json",
    REQUEST: "GetFeature",
    VERSION: "1.0.0",
    PropertyName: "TIME,WHTH,WPDI,site_name,LATITUDE,LONGITUDE",
    cql_filter: `site_name='${siteName}'`,
    // maxFeatures: 100
  });

  try {
    const response = await fetch(`${baseUrl}?${params.toString()}`);
    const geojson = await response.json();

    if (!geojson.features || geojson.features.length === 0) {
      throw new Error("No data found for this site.");
    }

    const parsed = geojson.features.map((feature) => ({
      site_name: feature.properties.site_name,
      LATITUDE: feature.properties.LATITUDE,
      LONGITUDE: feature.properties.LONGITUDE,
      TIME: feature.properties.TIME,
      WPDI: feature.properties.WPDI,
      WHTH: feature.properties.WHTH,
    }));

    console.log(`Parsed data for site ${siteName}:`, parsed);

    parsed.sort((a, b) => new Date(a.TIME) - new Date(b.TIME));

    return parsed;
  } catch (error) {
    console.error("GeoServer data fetch failed:", error);
    return null;
  }
}

export async function fetchAllSitesFromGeoServer() {
  const url = "https://geoserver-123.aodn.org.au/geoserver/ows?typeName=aodn:aodn_wave_nrt_v2_timeseries_data&SERVICE=WFS&outputFormat=application/json&REQUEST=GetFeature&VERSION=1.0.0&PropertyName=site_name,LATITUDE,LONGITUDE";

  try {
    const response = await fetch(url);
    const geojson = await response.json();

    const uniqueSiteMap = new Map();

    geojson.features.forEach((feature) => {
      const props = feature.properties;
      const lat = props.LATITUDE;
      const lon = props.LONGITUDE;
      const name = props.site_name;

      if (name && lat && lon && !uniqueSiteMap.has(name)) {
        uniqueSiteMap.set(name, {
          site_name: name,
          LATITUDE: lat,
          LONGITUDE: lon,
        });
      }
    });

    return Array.from(uniqueSiteMap.values());
  } catch (error) {
    console.error("Failed to fetch site list:", error);
    return [];
  }
}
export const fetchSiteNamesFromGeoServer = fetchAllSitesFromGeoServer;