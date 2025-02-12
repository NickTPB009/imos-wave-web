import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import albatrossBayData from '../wavedata/AlbatrossBay.json';
import capeSorellData from '../wavedata/CapeSorell.json';
import portKemblaData from '../wavedata/PortKembla.json';
import capeduCouedicData from '../wavedata/CapeduCouedic.json';
import hayPointData from '../wavedata/HayPoint.json';
import wideBayData from '../wavedata/WideBay.json';
import rottnestIslandData from '../wavedata/RottnestIsland.json';
import cottesloeData from '../wavedata/Cottesloe.json';
import mandurahData from '../wavedata/Mandurah.json';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import HighchartsWindbarb from 'highcharts/modules/windbarb';
import { formatDate } from './formatDate'; 

HighchartsWindbarb(Highcharts);

// Mapbox access token
mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

const createPopupContent = (landmark) => {
  const container = document.createElement('div');

  container.innerHTML = `
    <h2 style="text-align: center; font-weight: bold;">${landmark.site_name}</h2>
    <p>Time: ${formatDate(landmark.TIME)}</p>
    <p>Latitude: ${landmark.LATITUDE}</p>
    <p>Longitude: ${landmark.LONGITUDE}</p>
    <p>Wave Direction (WPDI): ${landmark.WPDI}°</p>
    <p>Wave Height (WHTH): ${landmark.WHTH} meters</p>
    <div style="text-align: center;">
      <button class="detail-graph-btn bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2">Detail Graph</button>
    </div>
  `;

  const button = container.querySelector('.detail-graph-btn');
  if (button) {
    button.addEventListener('click', () => {
      window.dispatchEvent(new CustomEvent('detailGraph', { detail: landmark.site_name }));
    });
  }

  return container;
};

// Map Component
const Map = ({ location }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const chartComponentRef = useRef(null); // Reference for the chart component
  const [landmarks, setLandmarks] = useState([]);
  const [selectedLandmark, setSelectedLandmark] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const markerRef = useRef([]);

  useEffect(() => {
    // Extract site_name, LATITUDE, LONGITUDE, TIME, WPDI, and WHTH from each JSON file
    const extractLandmarks = (data) => {
      return data.features.map((feature) => ({
        site_name: feature.properties.site_name,
        LATITUDE: feature.properties.LATITUDE,
        LONGITUDE: feature.properties.LONGITUDE,
        TIME: feature.properties.TIME,
        WPDI: feature.properties.WPDI,
        WHTH: feature.properties.WHTH,
      }));
    };

    const albatrossBayLandmarks = extractLandmarks(albatrossBayData);
    const capeSorellLandmarks = extractLandmarks(capeSorellData);
    const portKemblaLandmarks = extractLandmarks(portKemblaData);
    const capeduCouedicLandmarks = extractLandmarks(capeduCouedicData);
    const hayPointLandmarks = extractLandmarks(hayPointData);
    const wideBayLandmarks = extractLandmarks(wideBayData);
    const rottnestIslandLandmarks = extractLandmarks(rottnestIslandData);
    const cottesloeLandmarks = extractLandmarks(cottesloeData);
    const mandurahLandmarks = extractLandmarks(mandurahData);

    setLandmarks([...albatrossBayLandmarks, ...capeSorellLandmarks, ...portKemblaLandmarks, ...capeduCouedicLandmarks, ...hayPointLandmarks, ...wideBayLandmarks, ...rottnestIslandLandmarks, ...cottesloeLandmarks, ...mandurahLandmarks ]);
  }, []);
  
  // Initialize the map
  useEffect(() => {
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/navigation-day-v1',
      center: [133.7751, -25.2744], // Australia's coordinates
      zoom: 3, 
    });

    // Add zoom and rotation controls to the map
    map.current.addControl(new mapboxgl.NavigationControl());

    // Cleanup function to remove the map instance when the component is unloaded
    return () => {
      if (map.current) {
      map.current.remove();
      }
    };
  }, []); //An empty dependency array ensures that it is run only once.

  useEffect(() => {
    //Remove past land marker
    markerRef.current.forEach((marker) => marker.remove());
    markerRef.current = [];

    // Add landmarks to the map
    landmarks.forEach((landmark) => {
      const marker = new mapboxgl.Marker()
        .setLngLat([landmark.LONGITUDE, landmark.LATITUDE])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setDOMContent(createPopupContent(landmark))
        )
        .addTo(map.current);

      // Add click event listener to zoom in and center the clicked landmark
      marker.getElement().addEventListener('click', () => {
        map.current.flyTo({
          center: [landmark.LONGITUDE, landmark.LATITUDE],
          zoom: 6, // Zoom level when clicked
          essential: true, // This ensures the animation is smooth
        });
      });
      //Save marker for future usage 
      markerRef.current.push(marker);
    });
  }, [landmarks]); // Re-run when landmarks change

  useEffect(() => {
    const handleDetailGraph = (e) => {
      const site_name = e.detail;
      const selected = landmarks.filter((landmark) => landmark.site_name === site_name);
      setSelectedLandmark(selected);
      setShowSidebar(true);
    };

    window.addEventListener('detailGraph', handleDetailGraph);
    return () => {
      window.removeEventListener('detailGraph', handleDetailGraph);
    };
  }, [landmarks]);

  useEffect(() => {
    if (location && map.current) {
      const selectedLocation = landmarks.find(
        (landmark) => landmark.site_name === location
      );
      if (selectedLocation) {
        map.current.flyTo({
          center: [selectedLocation.LONGITUDE, selectedLocation.LATITUDE],
          zoom: 6,
          essential: true,
        });
      }
    }
  }, [location, landmarks]);

  // Filter data to get only the last 24 hours (48 records assuming every half hour)
  const chartOptions = React.useMemo(() => {
    if (!selectedLandmark || selectedLandmark.length === 0) return null;
    return {
      chart: {
        type: 'line',
        zoomType: 'x', // 启用横向缩放
      },
      title: {
        text: `Observed wave data at ${selectedLandmark[0].site_name}`,
        align: 'left',
      },
      subtitle: {
        text: 'Source: <a href="https://oceancurrent.aodn.org.au/index.php" target="_blank">IMOS OceanCurrent</a>',
        align: 'left',
      },
      xAxis: {
        type: 'datetime',
        title: {
          text: 'Time (UTC)',
        },
        labels: {
          format: '{value:%e %b %Y %H:%M}', // customize time format
        },
      },
      yAxis: [{
        title: {
          text: 'Wave Height (m)',
        },
      }],
      // tooltip: {
      //   formatter: function () {
      //     // console.log(this)
      //     // 显示详细的时间、海浪高度和方向
      //     return `
      //       <b>Time:</b> ${Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x)}<br/>
      //       <b>Wave Height:</b> ${this.y} m<br/>
      //       /*<b>Wave Direction:</b> {this.point.direction ? this.point.direction + '°' : 'N/A'}*/
      //     `;
      //   },
      //   shared: true,
      // },
      series: [
        {
          type: 'line',
          name: 'Wave Height',
          data: selectedLandmark.map((landmark) => ({
            x: Date.parse(landmark.TIME),
            y: landmark.WHTH,
          })),
          tooltip: {
            valueSuffix: ' m',
          },
        },
        {
          type: 'windbarb',
          name: 'Wave Direction',
          data: selectedLandmark.map((landmark) => 
            ({
            x: Date.parse(landmark.TIME),
            value: 10,
            direction: landmark.WPDI,
          })),
          marker: {
            symbol: 'arrow',
            rotation: 0,
          },
          tooltip: {
            valueSuffix: ' °',
          },
        },
      ],
    }
  }, [selectedLandmark]); 

  // Resize chart when switching fullscreen mode
  useEffect(() => {
    if (chartComponentRef.current) {
      const chart = chartComponentRef.current.chart;
      if (chart) {
        chart.reflow();
      }
    }
  }, [isFullscreen]);

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div ref={mapContainer} className="map-container" style={{ width: showSidebar && !isFullscreen ? '75%' : '100%', height: '100%' }} />
      {showSidebar && selectedLandmark && selectedLandmark.length > 0 && (
        <div className="sidebar" style={{
          width: isFullscreen ? '100%' : '25%',
          padding: '20px',
          backgroundColor: '#f8f9fa',
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
          height: '100%',
          position: isFullscreen ? 'absolute' : 'relative',
          top: 0,
          right: 0,
          zIndex: isFullscreen ? 1000 : 'auto',
        }}>
          <HighchartsReact
              highcharts={Highcharts}
              options={chartOptions}
              ref={chartComponentRef} // Reference for resizing
              containerProps={{ style: { height: '100%', width: '100%' } }} // Ensure chart takes full container
            />
          <button
            className="bg-cyan-950 text-white font-bold py-2 px-4 rounded mt-4"
            onClick={() => setShowSidebar(false)}
          >
            Close
          </button>
          <button
            className="bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 ml-2"
            onClick={() => setIsFullscreen(!isFullscreen)}
          >
            {isFullscreen ? 'Exit Fullscreen' : 'View Full Chart'}
          </button>
        </div>
      )}
    </div>
  );
};

export default Map;
