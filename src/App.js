import Header from './Header';
import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import './App.css';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { replaceSpacesWithHyphens } from './utils';

const mapboxToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

//MOCK Wave Data
const waveDataList = [
  {
    siteName: "Port Kembla",
    latitude: -34.47,
    longitude: 151.02,
    wavePeakDirectionInDegrees: 172, // Peak wave direction in degrees
    waveHeightInMesters: 2.58 // Wave height in meters
  },

  {
    siteName:"Sydney Harbour",
    latitude: -33.85,
    longitude: 151.21,
    wavePeakDirectionInDegrees: 165,
    waveHeightInMesters: 3.12
  },

  {
    siteName:"Bondi Beach",
    latitude: -33.89,
    longitude: 151.28,
    wavePeakDirectionInDegrees: 160,
    waveHeightInMesters: 1.95 
  },
]

export default function App() {

  const waveHeightIncrement_1 = 1;
  const waveHeightIncrement_2 = 0.5;
  const waveDirectionIncrement = 10;
  
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [selectedWaveData, setSelectedWaveData] = useState(null); 
  const [showGraph, setShowGraph] = useState(false); // Chart control
  // this is for chart
  const options = {
    chart: { type: 'line' },
    title: { text: `Wave Data for ${selectedWaveData?.siteName}` },
    xAxis: { categories: ['Time1', 'Time2', 'Time3'] },
    series: [
      { name: 'Wave Height (m)', data: [selectedWaveData?.waveHeightInMesters, selectedWaveData?.waveHeightInMesters + waveHeightIncrement_1, selectedWaveData?.waveHeightInMesters + waveHeightIncrement_2] },
      { name: 'Wave Direction (°)', data: [selectedWaveData?.wavePeakDirectionInDegrees, selectedWaveData?.wavePeakDirectionInDegrees + waveDirectionIncrement, selectedWaveData?.wavePeakDirectionInDegrees] }
    ]
  };

  useEffect(() => {
    if (map.current) return; // Ensure the map is initialized only once

    //I put mapbox token here.
    mapboxgl.accessToken = mapboxToken;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/navigation-day-v1',
      center: [151.21, -33.85],
      zoom: 3.5
    });
  
    // Add markers and popups
    waveDataList.forEach((waveData) => {
      const marker = new mapboxgl.Marker()
        .setLngLat([waveData.longitude, waveData.latitude])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 })
            .setHTML(
              `<h3>${waveData.siteName}</h3>
                <p>Wave Height: ${waveData.waveHeightInMesters} meters</p>
                <p>Wave Direction: ${waveData.wavePeakDirectionInDegrees}°</p>
                <button id="detail-btn-${replaceSpacesWithHyphens(waveData.siteName)}" 
                  class="bg-sky-900 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                  See Detail Graph
                </button>`
            )
        )
        .addTo(map.current);
  
      // Attach the event listener when the popup opens
      marker.getPopup().on('open', () => {
        const buttonId = `detail-btn-${replaceSpacesWithHyphens(waveData.siteName)}`;
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
            {/* add return button to back full map model */}
            <button 
              onClick={() => setShowGraph(false)} 
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">
              Back to Full Map
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
