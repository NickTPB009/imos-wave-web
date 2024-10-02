import Header from './Header';
import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import './App.css';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

//this token needs to put in .gitigonre
mapboxgl.accessToken = 'pk.eyJ1IjoiY3RpYW45OTYiLCJhIjoiY20xcTM4YjBxMGJnejJrcTJ3Y2NxZjZuOCJ9.IEBZ5Z7w4tu_IIL22OpJGg';

//MOCK Wave Data
const waveDataList = [
  {
    site_name: "Port Kembla",
    LATITUDE: -34.47,
    LONGITUDE: 151.02,
    WPDI: 172, // Peak wave direction in degrees
    WHTH: 2.58 // Wave height in meters
  },

  {
    site_name:"Sydney Harbour",
    LATITUDE: -33.85,
    LONGITUDE: 151.21,
    WPDI: 165,
    WHTH: 3.12 
  },

  {
    site_name:"Bondi Beach",
    LATITUDE: -33.89,
    LONGITUDE: 151.28,
    WPDI: 160,
    WHTH: 1.95 
  },
]

export default function App() {
  
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [selectedWaveData, setSelectedWaveData] = useState(null); 
  const [showGraph, setShowGraph] = useState(false); // Chart control
  // this is for chart
  const options = {
    chart: { type: 'line' },
    title: { text: `Wave Data for ${selectedWaveData?.site_name}` },
    xAxis: { categories: ['Time1', 'Time2', 'Time3'] },
    series: [
      { name: 'Wave Height (m)', data: [selectedWaveData?.WHTH, selectedWaveData?.WHTH + 1, selectedWaveData?.WHTH + 0.5] },
      { name: 'Wave Direction (°)', data: [selectedWaveData?.WPDI, selectedWaveData?.WPDI + 10, selectedWaveData?.WPDI] }
    ]
  };

  useEffect(() => {
    if (map.current) return; // Ensure the map is initialized only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [151.21, -33.85],
      zoom: 3.5
    });
  
    // Add markers and popups
    waveDataList.forEach((waveData) => {
      const marker = new mapboxgl.Marker()
        .setLngLat([waveData.LONGITUDE, waveData.LATITUDE])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 })
            .setHTML(
              `<h3>${waveData.site_name}</h3>
                <p>Wave Height: ${waveData.WHTH} meters</p>
                <p>Wave Direction: ${waveData.WPDI}°</p>
                <button id="detail-btn-${waveData.site_name.replace(/\s+/g, '-')}" 
                  class="bg-sky-900 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                  See Detail Graph
                </button>`
            )
        )
        .addTo(map.current);
  
      // Attach the event listener when the popup opens
      marker.getPopup().on('open', () => {
        const buttonId = `detail-btn-${waveData.site_name.replace(/\s+/g, '-')}`;
        const detailButton = document.getElementById(buttonId);
  
        if (detailButton) {
          detailButton.addEventListener('click', () => {
            setSelectedWaveData(waveData);
            setShowGraph(true);
          });
        }
      });
    });
  }, []);  

  return (
    
    <div className="page-container">
      <Header /> {/* Ensure the header is displayed above the map and chart */}
      <div className={`main-container ${showGraph ? 'flex-row' : 'flex-column'}`}>
        {/* Map Container */}
        <div
          ref={mapContainer}
          className={`map-container ${showGraph ? 'half-width' : 'full-width'} flex-grow`}
          style={{ height: 'calc(100vh - 80px)' }} // Adjust header height
        />

        {/* Chart Container */}
        {showGraph && (
          <div className="chart-container half-width flex-grow">
            <HighchartsReact highcharts={Highcharts} options={options} />
          </div>
        )}
      </div>
    </div>
  );
}
