
// import logo from './assets/logo.png';

//I add  an import here. 
import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import './App.css';
// import mapboxgl from 'react-map-gl';

mapboxgl.accessToken = 'pk.eyJ1IjoiY3RpYW45OTYiLCJhIjoiY2x5Z3UwMXhzMGVlZDJpcHM5Zmc5aDVhNSJ9.kFPfW-ljJhVjhBZKTmkDdg';

export default function App() {

  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(133.7751);
  const [lat, setLat] = useState(-25.2744);
  const [zoom, setZoom] = useState(3.5);

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [lng, lat],
      zoom: zoom
    });
  });

  return (
    <div>
      <div ref={mapContainer} className="map-container" />
    </div>
  );

}

