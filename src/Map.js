import React, { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import './Map.css';

mapboxgl.accessToken = 'pk.eyJ1IjoiY3RpYW45OTYiLCJhIjoiY2x5Z3UwMXhzMGVlZDJpcHM5Zmc5aDVhNSJ9.kFPfW-ljJhVjhBZKTmkDdg'; // 替换为你的Mapbox访问令牌

const Map = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const lng = 133.7751; 
  const lat = -25.2744; 
  const zoom = 3.5; 

  useEffect(() => {
    if (map.current) return; 
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11', 
      center: [lng, lat],
      zoom: zoom,
    });

    // 添加Perth的Marker
    new mapboxgl.Marker({ color: "red" })
      .setLngLat([115.8575, -31.9505]) // Perth的经纬度
      .addTo(map.current);

    // 添加Hobart的Marker
    new mapboxgl.Marker({ color: "blue" })
      .setLngLat([147.3257, -42.8821]) // Hobart的经纬度
      .addTo(map.current);

  }, []); // 注意添加依赖数组以确保仅在初次加载时运行

  return <div ref={mapContainer} className="map-container" />;
};

export default Map;
