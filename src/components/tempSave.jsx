// import React, { useEffect, useRef, useState } from 'react';
// import mapboxgl from 'mapbox-gl';
// import albatrossBayData from '../wavedata/AlbatrossBay.json';
// import capeSorellData from '../wavedata/CapeSorell.json';
// import portKemblaData from '../wavedata/PortKembla.json';
// import capeduCouedicData from '../wavedata/CapeduCouedic.json';
// import hayPointData from '../wavedata/HayPoint.json';
// import wideBayData from '../wavedata/WideBay.json';
// import rottnestIslandData from '../wavedata/RottnestIsland.json';
// import cottesloeData from '../wavedata/Cottesloe.json';
// import mandurahData from '../wavedata/Mandurah.json';
// import Highcharts from 'highcharts';
// import HighchartsReact from 'highcharts-react-official';
// import HighchartsWindbarb from 'highcharts/modules/windbarb';
// import Exporting from 'highcharts/modules/exporting';      
// import ExportData from 'highcharts/modules/export-data';     
// import { formatDate } from './formatDate'; 
// import { FaSatellite, FaMap } from 'react-icons/fa';


// HighchartsWindbarb(Highcharts);
// Exporting(Highcharts); 
// ExportData(Highcharts); 

// // Mapbox access token
// mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

// const createPopupContent = (landmark) => {
//   const container = document.createElement('div');

//   container.innerHTML = `
//     <h2 style="text-align: center; font-weight: bold;">${landmark.site_name}</h2>
//     <p>Time: ${formatDate(landmark.TIME)}</p>
//     <p>Latitude: ${landmark.LATITUDE}</p>
//     <p>Longitude: ${landmark.LONGITUDE}</p>
//     <p>Wave Direction (WPDI): ${landmark.WPDI}°</p>
//     <p>Wave Height (WHTH): ${landmark.WHTH} meters</p>
//     <div style="text-align: center;">
//       <button class="detail-graph-btn bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2">Detail Graph</button>
//     </div>
//   `;

//   const button = container.querySelector('.detail-graph-btn');
//   if (button) {
//     button.addEventListener('click', () => {
//       window.dispatchEvent(new CustomEvent('detailGraph', { detail: landmark.site_name }));
//     });
//   }

//   return container;
// };

// // Map Component
// const Map = ({ location }) => {
//   const mapContainer = useRef(null);
//   const map = useRef(null);
//   const [mapStyle, setMapStyle] = useState('mapbox://styles/mapbox/navigation-day-v1');
//   const chartComponentRef = useRef(null); 
//   const [landmarks, setLandmarks] = useState([]);
//   const [selectedLandmark, setSelectedLandmark] = useState(null);
//   const [showSidebar, setShowSidebar] = useState(false);
//   const [isFullscreen, setIsFullscreen] = useState(false);
//   const markerRef = useRef([]);
//   const [exportMenuVisible, setExportMenuVisible] = useState(false);
//   const exportButtonRef = useRef(null);
//   const exportMenuRef = useRef(null);
//   const [chartStartDate, setChartStartDate] = useState('');
//   const [chartEndDate, setChartEndDate] = useState('');

//   const handleExportClick = () => {
//     setExportMenuVisible((prev) => !prev);
//   };

//   // Add a global click listener to close the menu when the click area is not within the export button and menu
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (exportMenuVisible) {
//         if (
//           exportMenuRef.current && !exportMenuRef.current.contains(event.target) &&
//           exportButtonRef.current && !exportButtonRef.current.contains(event.target)
//           ) {
//             setExportMenuVisible(false);
//           }
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, [exportMenuVisible]);

//   //Define the processing functions for each export option
//   const exportOptions = {
//     print: () => {
//       if (chartComponentRef.current && chartComponentRef.current.chart) {
//         chartComponentRef.current.chart.print();
//       }
//       setExportMenuVisible(false);
//     },
//     png: () => {
//       if (chartComponentRef.current && chartComponentRef.current.chart) {
//         chartComponentRef.current.chart.exportChart({ type: 'image/png' });
//       }
//       setExportMenuVisible(false);
//     },
//     jpeg: () => {
//       if (chartComponentRef.current && chartComponentRef.current.chart) {
//         chartComponentRef.current.chart.exportChart({ type: 'image/jpeg' });
//       }
//       setExportMenuVisible(false);
//     },
//     svg: () => {
//       if (chartComponentRef.current && chartComponentRef.current.chart) {
//         chartComponentRef.current.chart.exportChart({ type: 'image/svg+xml' });
//       }
//       setExportMenuVisible(false);
//     },
//     csv: () => {
//       if (chartComponentRef.current && chartComponentRef.current.chart) {
//         chartComponentRef.current.chart.downloadCSV();
//       }
//       setExportMenuVisible(false);
//     },
//     xls: () => {
//       if (chartComponentRef.current && chartComponentRef.current.chart) {
//         chartComponentRef.current.chart.downloadXLS();
//       }
//       setExportMenuVisible(false);
//     },
//   };

//   useEffect(() => {
//     // Extract site_name, LATITUDE, LONGITUDE, TIME, WPDI, and WHTH from each JSON file
//     const extractLandmarks = (data) => {
//       return data.features.map((feature) => ({
//         site_name: feature.properties.site_name,
//         LATITUDE: feature.properties.LATITUDE,
//         LONGITUDE: feature.properties.LONGITUDE,
//         TIME: feature.properties.TIME,
//         WPDI: feature.properties.WPDI,
//         WHTH: feature.properties.WHTH,
//       }));
//     };

//     const albatrossBayLandmarks = extractLandmarks(albatrossBayData);
//     const capeSorellLandmarks = extractLandmarks(capeSorellData);
//     const portKemblaLandmarks = extractLandmarks(portKemblaData);
//     const capeduCouedicLandmarks = extractLandmarks(capeduCouedicData);
//     const hayPointLandmarks = extractLandmarks(hayPointData);
//     const wideBayLandmarks = extractLandmarks(wideBayData);
//     const rottnestIslandLandmarks = extractLandmarks(rottnestIslandData);
//     const cottesloeLandmarks = extractLandmarks(cottesloeData);
//     const mandurahLandmarks = extractLandmarks(mandurahData);

//     setLandmarks([
//       ...albatrossBayLandmarks, 
//       ...capeSorellLandmarks, 
//       ...portKemblaLandmarks, 
//       ...capeduCouedicLandmarks, 
//       ...hayPointLandmarks, 
//       ...wideBayLandmarks, 
//       ...rottnestIslandLandmarks, 
//       ...cottesloeLandmarks, 
//       ...mandurahLandmarks ]);
//   }, []);

//   // Initialize the map
//   useEffect(() => {
//     map.current = new mapboxgl.Map({
//       container: mapContainer.current,
//       style: mapStyle,
//       center: [133.7751, -25.2744], // Australia's coordinates
//       zoom: 3, 
//     });

//     // Add zoom and rotation controls to the map
//     map.current.addControl(new mapboxgl.NavigationControl());

//     // Cleanup function to remove the map instance when the component is unloaded
//     return () => {
//       if (map.current) {
//       map.current.remove();
//       }
//     };
//   }, []); //An empty dependency array ensures that it is run only once.

//   useEffect(() => {
//       if (map.current) {
//         map.current.setStyle(mapStyle);
//       }
//     }, [mapStyle]);

//   useEffect(() => {
//     //Remove past land marker
//     markerRef.current.forEach((marker) => marker.remove());
//     markerRef.current = [];

//     // Add landmarks to the map
//     landmarks.forEach((landmark) => {
//       const marker = new mapboxgl.Marker()
//         .setLngLat([landmark.LONGITUDE, landmark.LATITUDE])
//         .setPopup(
//           new mapboxgl.Popup({ offset: 25 }).setDOMContent(createPopupContent(landmark))
//         )
//         .addTo(map.current);

//       // Add click event listener to zoom in and center the clicked landmark
//       marker.getElement().addEventListener('click', () => {
//         map.current.flyTo({
//           center: [landmark.LONGITUDE, landmark.LATITUDE],
//           zoom: 6, // Zoom level when clicked
//           essential: true, // This ensures the animation is smooth
//         });
//       });
//       //Save marker for future usage 
//       markerRef.current.push(marker);
//     });
//   }, [landmarks]); // Re-run when landmarks change

//   useEffect(() => {
//     const handleDetailGraph = (e) => {
//       const site_name = e.detail;
//       const selected = landmarks.filter((landmark) => landmark.site_name === site_name);
//       setSelectedLandmark(selected);
//       setShowSidebar(true);
//     };

//     window.addEventListener('detailGraph', handleDetailGraph);
//     return () => {
//       window.removeEventListener('detailGraph', handleDetailGraph);
//     };
//   }, [landmarks]);

//   useEffect(() => {
//     if (location && map.current) {
//       const selectedLocation = landmarks.find(
//         (landmark) => landmark.site_name === location
//       );
//       if (selectedLocation) {
//         map.current.flyTo({
//           center: [selectedLocation.LONGITUDE, selectedLocation.LATITUDE],
//           zoom: 6,
//           essential: true,
//         });
//       }
//     }
//   }, [location, landmarks]);

//   // Filter data to get only the last 24 hours (48 records assuming every half hour)
//   const chartOptions = React.useMemo(() => {
//     if (!selectedLandmark || selectedLandmark.length === 0) return null;

//     console.log('Selected Landmark times:', selectedLandmark.map(l => Date.parse(l.TIME)));

//     return {
//       chart: {
//         type: 'line',
//         zoomType: 'x', // Enable horizontal scaling
//       },
//       title: {
//         text: `Observed wave data at ${selectedLandmark[0].site_name}`,
//         align: 'left',
//       },
//       subtitle: {
//         text: 'Source: <a href="https://oceancurrent.aodn.org.au/index.php" target="_blank">IMOS OceanCurrent</a>',
//         align: 'left',
//       },
//       xAxis: {
//         type: 'datetime',
//         title: {
//           text: 'Time (UTC)',
//         },
//         labels: {
//           format: '{value:%e %b %Y %H:%M}', // customize time format
//         },
//       },
//       yAxis: [{
//         title: {
//           text: 'Wave Height (m)',
//         },
//       }],
//       series: [
//         {
//           type: 'line',
//           name: 'Wave Height',
//           data: selectedLandmark.map((landmark) => ({
//             x: Date.parse(landmark.TIME),
//             y: landmark.WHTH,
//           })),
//           tooltip: {
//             valueSuffix: ' m',
//           },
//         },
//         {
//           type: 'windbarb',
//           name: 'Wave Direction',
//           data: selectedLandmark.map((landmark) => 
//             ({
//             x: Date.parse(landmark.TIME),
//             value: 10,
//             direction: landmark.WPDI,
//           })),
//           marker: {
//             symbol: 'arrow',
//             rotation: 0,
//           },
//           tooltip: {
//             valueSuffix: ' °',
//           },
//         },
//       ],
//     }
//   }, [selectedLandmark]); 

//   // Resize chart when switching fullscreen mode
//   useEffect(() => {
//     if (chartComponentRef.current) {
//       const chart = chartComponentRef.current.chart;
//       if (chart) {
//         chart.reflow();
//       }
//     }
//   }, [isFullscreen]);

//   // Define a function that updates the chart xAxis range when the user clicks the Apply button
//   const applyDateRange = () => {
//     const minTimestamp = Date.parse(chartStartDate);
//     const maxTimestamp = Date.parse(chartEndDate);

//     // Filter data within the selected range
//     const filteredData = selectedLandmark.filter((landmark) => {
//       const t = Date.parse(landmark.TIME);
//       return t >= minTimestamp && t <= maxTimestamp;
//     });

//     if (filteredData.length === 0) {
//       alert("No data available for the selected time range.");
//       return; // Do not update the chart
//     }

//     if (chartComponentRef.current && chartComponentRef.current.chart) {
//       chartComponentRef.current.chart.xAxis[0].update({
//         min: minTimestamp,
//         max: maxTimestamp,
//       });
//     } else {
//       console.log('Chart ref is not ready!!');
//     }
//   };

//   // Define a reset function to clear the input and reset the chart to display all data when the user clicks the Reset button
//   const resetDateRange = () => {
//     setChartStartDate('');
//     setChartEndDate('');
//     if (chartComponentRef.current && chartComponentRef.current.chart) {
//       chartComponentRef.current.chart.xAxis[0].update({
//         min: null,
//         max: null,
//       });
//     }
//   };


//   return (
//     <div style={{ position: 'relative',display: 'flex', height: '100vh' }}>
//       <div 
//         ref={mapContainer} 
//         className="map-container" 
//         style={{ width: showSidebar && !isFullscreen ? '75%' : '100%', height: '100%' }} 
//       />

//       {/* Map Layer Switch Button */}
//       <div style={{ position: 'absolute', bottom: 10, left: 10, zIndex: 10 }}>
//         <button
//           onClick={() => setMapStyle('mapbox://styles/mapbox/standard-satellite')}
//           className="bg-blue-900 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
//         >
//           <FaSatellite size={20} />
//         </button> <br></br> <br></br>
//         <button
//           onClick={() => setMapStyle('mapbox://styles/mapbox/navigation-day-v1')}
//           className="bg-blue-900 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
//         >
//           <FaMap size={20} />
//         </button>
//       </div>

//       {showSidebar && selectedLandmark && selectedLandmark.length > 0 && (
//         <div 
//           className="sidebar" 
//           style={{
//             width: isFullscreen ? '100%' : '25%',
//             padding: '20px',
//             backgroundColor: '#f8f9fa',
//             boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
//             height: '100%',
//             position: isFullscreen ? 'absolute' : 'relative',
//             top: 0,
//             right: 0,
//             zIndex: isFullscreen ? 1000 : 'auto',
//             }}
//         >
//           {/* Date Range Selection Control */}
//           <div style={{ marginBottom: '1rem' }}>
//             <label>
//               Start Date:{' '}
//               <input
//                 type="date"
//                 value={chartStartDate}
//                 onChange={(e) => setChartStartDate(e.target.value)}
//               />
//             </label> 
//             <label style={{ marginLeft: '1rem' }}>
//               End Date:{' '}
//               <input
//                 type="date"
//                 value={chartEndDate}
//                 onChange={(e) => setChartEndDate(e.target.value)}
//               />
//             </label><br></br>
//             {/* Apply Button */}
//             <button
//               onClick={applyDateRange}
//               className="
//               ml-4 bg-transparent 
//             hover:bg-blue-500 
//             text-blue-700 font-semibold 
//             hover:text-white py-2 px-4 border 
//             border-blue-500 
//               hover:border-transparent rounded"
//             >
//               Apply
//             </button>
//             {/* Reset Button */}
//             <button
//               onClick={resetDateRange}
//               className="
//               ml-4 bg-transparent 
//             hover:bg-blue-500 
//             text-blue-700 font-semibold 
//             hover:text-white py-2 px-4 border 
//             border-blue-500 
//               hover:border-transparent rounded"
//             >
//               Reset
//             </button>
//             {/* Export Button */}
//             {/* Wrap the Export button and drop-down menu */}
//           <div style={{ position: 'relative', display: 'inline-block', marginLeft: '1rem' }}>
//             <button
//               ref={exportButtonRef}
//               onClick={handleExportClick}
//               className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
//             >
//              Export
//             </button>
//             {exportMenuVisible && (
//               <div
//               ref={exportMenuRef}
//                 style={{
//                 position: 'absolute',
//                 top: 'calc(100% + 0.5rem)', 
//                 left: 0,
//                 width: '250px',
//                 backgroundColor: '#fff',
//                 border: '1px solid #ccc',
//                 borderRadius: '4px',
//                 boxShadow: '0 2px 5px rgba(0,0,0,0.15)',
//                 zIndex: 1001,
//                 }}
//               >
//               <button
//                 onClick={exportOptions.print}
//                 style={{
//                   display: 'block',
//                   width: '100%',
//                   padding: '0.5rem 1rem',
//                   border: 'none',
//                   background: 'none',
//                   textAlign: 'left',
//                   cursor: 'pointer',
//                 }}
//               >
//                 Print chart
//               </button>
//               <button
//                 onClick={exportOptions.png}
//                 style={{
//                   display: 'block',
//                   width: '100%',
//                   padding: '0.5rem 1rem',
//                   border: 'none',
//                   background: 'none',
//                   textAlign: 'left',
//                   cursor: 'pointer',
//                 }}
//               >
//                 Download PNG image
//               </button>
//               <button
//                 onClick={exportOptions.jpeg}
//                 style={{
//                   display: 'block',
//                   width: '100%',
//                   padding: '0.5rem 1rem',
//                   border: 'none',
//                   background: 'none',
//                   textAlign: 'left',
//                   cursor: 'pointer',
//                 }}
//               >
//                 Download JPEG image
//               </button>
//               <button
//                 onClick={exportOptions.svg}
//                 style={{
//                   display: 'block',
//                   width: '100%',
//                   padding: '0.5rem 1rem',
//                   border: 'none',
//                   background: 'none',
//                   textAlign: 'left',
//                   cursor: 'pointer',
//                 }}
//               >
//                 Download SVG vector image
//               </button>
//               <button
//                 onClick={exportOptions.csv}
//                 style={{
//                   display: 'block',
//                   width: '100%',
//                   padding: '0.5rem 1rem',
//                   border: 'none',
//                   background: 'none',
//                   textAlign: 'left',
//                   cursor: 'pointer',
//                 }}
//               >
//                 Download CSV
//               </button>
//               <button
//                 onClick={exportOptions.xls}
//                 style={{
//                   display: 'block',
//                   width: '100%',
//                   padding: '0.5rem 1rem',
//                   border: 'none',
//                   background: 'none',
//                   textAlign: 'left',
//                   cursor: 'pointer',
//                 }}
//               >
//                 Download XLS
//               </button>
//               </div>
//             )}
//           </div>
//           </div>
//           <HighchartsReact
//               highcharts={Highcharts}
//               options={chartOptions}
//               ref={chartComponentRef} // Reference for resizing
//               containerProps={{ style: { height: '100%', width: '100%' } }} // Ensure chart takes full container
//             />
//           <button
//             className="bg-cyan-950 text-white font-bold py-2 px-4 rounded mt-4"
//             onClick={() => setShowSidebar(false)}
//           >
//             Close
//           </button>
//           <button
//             className="bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 ml-2"
//             onClick={() => setIsFullscreen(!isFullscreen)}
//           >
//             {isFullscreen ? 'Exit Fullscreen' : 'View Full Chart'}
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Map;


import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import uniqueSites from "../wavedata/cleaned_sites_with_coordinates.json";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import HighchartsWindbarb from "highcharts/modules/windbarb";
import Exporting from "highcharts/modules/exporting";
import ExportData from "highcharts/modules/export-data";
import { formatDate } from "./formatDate";
import { FaTimes, FaSync, FaExpand, FaCompress } from "react-icons/fa";
import { fetchLatestWaveData } from "../utils";

window.Highcharts = Highcharts;
HighchartsWindbarb(Highcharts);
Exporting(Highcharts);
ExportData(Highcharts);

// Mapbox access token
mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

const createPopupContent = (landmark) => {
    const container = document.createElement("div");

    container.innerHTML = `
    <h2 style="text-align: center; font-weight: bold;">${landmark.site_name
        }</h2>
    <p>Latitude: ${landmark.LATITUDE}</p>
    <p>Longitude: ${landmark.LONGITUDE}</p>
    ${landmark.TIME ? `<p>Time: ${formatDate(landmark.TIME)}</p>` : ""}
    ${landmark.WPDI ? `<p>Wave Direction (WPDI): ${landmark.WPDI}°</p>` : ""}
    ${landmark.WHTH ? `<p>Wave Height (WHTH): ${landmark.WHTH} meters</p>` : ""}
    <div style="text-align: center;">
      <button class="detail-graph-btn bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2">Detail Graph</button>
    </div>
  `;
    // TODO: useref - hook (update later)
    const button = container.querySelector(".detail-graph-btn");
    if (button) {
        button.addEventListener("click", () => {
            window.dispatchEvent(
                new CustomEvent("detailGraph", { detail: landmark.site_name })
            );
        });
    }

    return container;
};

// Map Component
const Map = ({ location }) => {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const chartComponentRef = useRef(null);
    const [landmarks, setLandmarks] = useState([]);
    const [selectedLandmark, setSelectedLandmark] = useState(null);
    const [showSidebar, setShowSidebar] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [exportMenuVisible, setExportMenuVisible] = useState(false);
    const exportButtonRef = useRef(null);
    const exportMenuRef = useRef(null);
    const [chartStartDate, setChartStartDate] = useState("");
    const [chartEndDate, setChartEndDate] = useState("");
    const [mapStyle] = useState(
        "mapbox://styles/mapbox/navigation-day-v1"
    );

    const handleExportClick = () => {
        setExportMenuVisible((prev) => !prev);
    };

    // 在此添加 useEffect 来观察 selectedLandmark 用来检查记得删除
    useEffect(() => {
        console.log("Selected Landmark state:", selectedLandmark);
    }, [selectedLandmark]);

    // Add a global click listener to close the menu when the click area is not within the export button and menu
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (exportMenuVisible) {
                if (
                    exportMenuRef.current &&
                    !exportMenuRef.current.contains(event.target) &&
                    exportButtonRef.current &&
                    !exportButtonRef.current.contains(event.target)
                ) {
                    setExportMenuVisible(false);
                }
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [exportMenuVisible]);

    //Define the processing functions for each export option
    const exportOptions = {
        print: () => {
            if (chartComponentRef.current && chartComponentRef.current.chart) {
                chartComponentRef.current.chart.print();
            }
            setExportMenuVisible(false);
        },
        png: () => {
            if (chartComponentRef.current && chartComponentRef.current.chart) {
                chartComponentRef.current.chart.exportChart({ type: "image/png" });
            }
            setExportMenuVisible(false);
        },
        jpeg: () => {
            if (chartComponentRef.current && chartComponentRef.current.chart) {
                chartComponentRef.current.chart.exportChart({ type: "image/jpeg" });
            }
            setExportMenuVisible(false);
        },
        svg: () => {
            if (chartComponentRef.current && chartComponentRef.current.chart) {
                chartComponentRef.current.chart.exportChart({ type: "image/svg+xml" });
            }
            setExportMenuVisible(false);
        },
        csv: () => {
            if (chartComponentRef.current && chartComponentRef.current.chart) {
                chartComponentRef.current.chart.downloadCSV();
            }
            setExportMenuVisible(false);
        },
        xls: () => {
            if (chartComponentRef.current && chartComponentRef.current.chart) {
                chartComponentRef.current.chart.downloadXLS();
            }
            setExportMenuVisible(false);
        },
    };

    // uniqueSites 
    useEffect(() => {
        const landmarksArray = Object.keys(uniqueSites).map((siteName) => ({
            site_name: siteName,
            LATITUDE: uniqueSites[siteName].latitude,
            LONGITUDE: uniqueSites[siteName].longitude,
            TIME: null,
            WPDI: null,
            WHTH: null,
        }));
        setLandmarks(landmarksArray);
    }, []);

    // Initialize the map
    useEffect(() => {
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: mapStyle,
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
    }, [mapStyle]); // Include mapStyle in the dependency array to avoid missing dependency warning.

    // Using GeoJSON data sources and aggregations to display landmarks
    useEffect(() => {
        if (!map.current || !landmarks.length) return;

        const addClusterLayers = () => {
            // 转换 landmarks 数组为 GeoJSON FeatureCollection
            const features = landmarks.map((landmark) => ({
                type: "Feature",
                geometry: {
                    type: "Point",
                    coordinates: [
                        parseFloat(landmark.LONGITUDE),
                        parseFloat(landmark.LATITUDE),
                    ],
                },
                properties: {
                    site_name: landmark.site_name,
                    LATITUDE: landmark.LATITUDE,
                    LONGITUDE: landmark.LONGITUDE,
                    TIME: landmark.TIME,
                    WPDI: landmark.WPDI,
                    WHTH: landmark.WHTH,
                },
            }));
            const geojsonData = {
                type: "FeatureCollection",
                features: features,
            };

            // If the data source already exists, update the data; otherwise, add a new data source and layer
            if (map.current.getSource("landmarks")) {
                map.current.getSource("landmarks").setData(geojsonData);
            } else {
                map.current.addSource("landmarks", {
                    type: "geojson",
                    data: geojsonData,
                    cluster: true,
                    clusterMaxZoom: 14,
                    clusterRadius: 50,
                });
                // Add the Converged Circles layer
                map.current.addLayer({
                    id: "clusters",
                    type: "circle",
                    source: "landmarks",
                    filter: ["has", "point_count"],
                    paint: {
                        "circle-color": "#51bbd6",
                        "circle-radius": [
                            "step",
                            ["get", "point_count"],
                            20,
                            100,
                            30,
                            750,
                            40,
                        ],
                        "circle-stroke-width": 1,
                        "circle-stroke-color": "#fff",
                    },
                });
                // Adding an aggregate count layer
                map.current.addLayer({
                    id: "cluster-count",
                    type: "symbol",
                    source: "landmarks",
                    filter: ["has", "point_count"],
                    layout: {
                        "text-field": "{point_count_abbreviated}",
                        "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
                        "text-size": 12,
                    },
                    paint: {
                        "text-color": "#fff",
                    },
                });
                // Add an unaggregated points layer
                map.current.addLayer({
                    id: "unclustered-point",
                    type: "circle",
                    source: "landmarks",
                    filter: ["!", ["has", "point_count"]],
                    paint: {
                        "circle-color": "#f28cb1",
                        "circle-radius": 6,
                        "circle-stroke-width": 1,
                        "circle-stroke-color": "#fff",
                    },
                });
                // Click on the aggregation point to zoom in on the points within the aggregation
                map.current.on("click", "clusters", (e) => {
                    const features = map.current.queryRenderedFeatures(e.point, {
                        layers: ["clusters"],
                    });
                    const clusterId = features[0].properties.cluster_id;
                    map.current
                        .getSource("landmarks")
                        .getClusterExpansionZoom(clusterId, (err, zoom) => {
                            if (err) return;
                            map.current.easeTo({
                                center: features[0].geometry.coordinates,
                                zoom: zoom,
                            });
                        });
                });
                // Change the mouse pointer to indicate that the aggregation point is clickable
                map.current.on("mouseenter", "clusters", () => {
                    map.current.getCanvas().style.cursor = "pointer";
                });
                map.current.on("mouseleave", "clusters", () => {
                    map.current.getCanvas().style.cursor = "";
                });
            }
        };

        // Determine whether the map style is loaded
        if (map.current.isStyleLoaded()) {
            addClusterLayers();
        } else {
            map.current.on("styledata", addClusterLayers);
        }

        // Cleanup: Remove 'styledata' listener on component unmount
        return () => {
            if (map.current) {
                map.current.off("styledata", addClusterLayers);
            }
        };
    }, [landmarks, mapStyle]);

    // Add a click event listener to the unclustered-point layer
    useEffect(() => {
        if (!map.current) return;

        const onUnclusteredClick = (e) => {
            const feature = e.features[0];
            // Note: feature.properties already contains site information
            const popupContent = createPopupContent(feature.properties);
            new mapboxgl.Popup({ offset: 25 })
                .setLngLat(feature.geometry.coordinates)
                .setDOMContent(popupContent)
                .addTo(map.current);
        };

        map.current.on("click", "unclustered-point", onUnclusteredClick);
        map.current.on("mouseenter", "unclustered-point", () => {
            map.current.getCanvas().style.cursor = "pointer";
        });
        map.current.on("mouseleave", "unclustered-point", () => {
            map.current.getCanvas().style.cursor = "";
        });

        return () => {
            if (map.current) {
                map.current.off("click", "unclustered-point", onUnclusteredClick);
                map.current.off("mouseenter", "unclustered-point");
                map.current.off("mouseleave", "unclustered-point");
            }
        };
    }, [landmarks]);

    // Add a click event listener to the map to close the sidebar when clicking outside of it
    useEffect(() => {
        const handleDetailGraph = (e) => {
            const site_name = e.detail;
            const selected = landmarks.filter(
                (landmark) => landmark.site_name === site_name
            );
            setSelectedLandmark(selected);
            setShowSidebar(true);
        };

        window.addEventListener("detailGraph", handleDetailGraph);
        return () => {
            window.removeEventListener("detailGraph", handleDetailGraph);
        };
    }, [landmarks]);

    // Update the map view when the location prop changes
    useEffect(() => {
        if (location && map.current) {
            const selectedLocation = landmarks.find(
                (landmark) => landmark.site_name === location
            );
            if (selectedLocation) {
                map.current.flyTo({
                    center: [selectedLocation.LONGITUDE, selectedLocation.LATITUDE],
                    zoom: 10,
                    essential: true,
                });
            }
        }
    }, [location, landmarks]);

    // Filter data to get only the last 24 hours (48 records assuming every half hour)
    const chartOptions = React.useMemo(() => {
        if (!selectedLandmark || selectedLandmark.length === 0) return null;

        // Step3: filtering and creating winbard data
        // const windbarbData = selectedLandmark
        //   .filter(
        //     (landmark) =>
        //       landmark.TIME &&
        //       landmark.WPDI &&
        //       !isNaN(Date.parse(landmark.TIME)) &&
        //       !isNaN(parseFloat(landmark.WPDI))
        //   )
        //   .map((landmark) => ({
        //     x: Date.parse(landmark.TIME),
        //     value: 10,
        //     direction: parseFloat(landmark.WPDI),
        //   }));

        // 在控制台打印风向数据，方便调试
        // console.log("Windbarb data:", windbarbData);

        // const heightData = selectedLandmark
        //   .filter(landmark => landmark.TIME && landmark.WHTH != null)
        //   .map(landmark => ({
        //     x: Date.parse(landmark.TIME),
        //     y: parseFloat(landmark.WHTH)
        //   }));

        return {
            chart: {
                type: "line",
                zoomType: "x", // Enable horizontal scaling
            },
            title: {
                text: `Observed wave data at ${selectedLandmark[0].site_name}`,
                align: "left",
            },
            subtitle: {
                text: 'Source: <a href="https://oceancurrent.aodn.org.au/index.php" target="_blank">IMOS OceanCurrent</a>',
                align: "left",
            },
            xAxis: {
                type: "datetime",
                title: {
                    text: "Time (UTC)",
                },
                labels: {
                    format: "{value:%e %b %Y %H:%M}", // customize time format - see file utils.jsx
                },
            },
            yAxis: [
                {
                    title: {
                        text: "Wave Height (m)",
                    },
                },

            ],
            series: [
                {
                    type: "line",
                    name: "Wave Height",
                    data: selectedLandmark.map((landmark) => ({
                        x: Date.parse(landmark.TIME),
                        y: landmark.WHTH,
                    })),
                    // data: heightData,
                    tooltip: {
                        valueSuffix: " m",
                    },
                },
                {
                    type: "windbarb",
                    yAxis: 1,
                    name: "Wave Direction",
                    vectorLength: 50,
                    color: "#000000",
                    // data: windbarbData,
                    data: selectedLandmark
                        .filter(
                            (landmark) =>
                                landmark.TIME !== null &&
                                landmark.WPDI !== null &&
                                !isNaN(Date.parse(landmark.TIME)) &&
                                !isNaN(parseFloat(landmark.WPDI))
                        )
                        .map((landmark) => ({
                            x: Date.parse(landmark.TIME),
                            value: 10,
                            direction: parseFloat(landmark.WPDI),
                        })),
                    marker: {
                        symbol: "arrow",
                        rotation: 0,
                    },
                    tooltip: {
                        valueSuffix: " °",
                    },
                    zIndex: 5,
                },
            ],
        };
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

    // Define a function that updates the chart xAxis range when the user clicks the Apply button
    const applyDateRange = () => {
        const minTimestamp = Date.parse(chartStartDate);
        const maxTimestamp = Date.parse(chartEndDate);

        // Filter data within the selected range
        const filteredData = selectedLandmark.filter((landmark) => {
            const t = Date.parse(landmark.TIME);
            return t >= minTimestamp && t <= maxTimestamp;
        });

        if (filteredData.length === 0) {
            alert("No data available for the selected time range.");
            return; // Do not update the chart
        }

        if (chartComponentRef.current && chartComponentRef.current.chart) {
            chartComponentRef.current.chart.xAxis[0].update({
                min: minTimestamp,
                max: maxTimestamp,
            });
        } else {
            console.log("Chart ref is not ready!!");
        }
    };

    // Define a reset function to clear the input and reset the chart to display all data when the user clicks the Reset button
    const resetDateRange = () => {
        setChartStartDate("");
        setChartEndDate("");
        if (chartComponentRef.current && chartComponentRef.current.chart) {
            chartComponentRef.current.chart.xAxis[0].update({
                min: null,
                max: null,
            });
        }
    };

    useEffect(() => {
        if (map.current) {
            map.current.resize();
        }
    }, [showSidebar, isFullscreen]);


    return (
        <div style={{ position: "relative", display: "flex", height: "100vh" }}>
            <div
                ref={mapContainer}
                className="map-container"
                style={{
                    width: (showSidebar && !isFullscreen) ? "50%" : "100%",
                    height: "100%",
                }}
            />

            {showSidebar && chartOptions && (
                <div
                    className="sidebar"
                    style={{
                        width: isFullscreen ? "100%" : "50%",
                        padding: "20px",
                        backgroundColor: "#f8f9fa",
                        boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                        height: "100%",
                        position: isFullscreen ? "absolute" : "relative",
                        top: 0,
                        right: 0,
                        zIndex: isFullscreen ? 1000 : "auto"
                        ,
                    }}
                >
                    {/* Date Range Selection Control */}
                    <div style={{ marginBottom: "1rem" }}>
                        <label>
                            Start Date:{" "}
                            <input
                                type="date"
                                value={chartStartDate}
                                onChange={(e) => setChartStartDate(e.target.value)}
                            />
                        </label>
                        <label style={{ marginLeft: "1rem" }}>
                            End Date:{" "}
                            <input
                                type="date"
                                value={chartEndDate}
                                onChange={(e) => setChartEndDate(e.target.value)}
                            />
                        </label>
                        {/* Apply Button */}
                        <button
                            onClick={applyDateRange}
                            title="Please select date range before click apply."
                            className="
              ml-4 mt-2
              bg-white 
              hover:bg-gray-100 
              text-gray-800 font-semibold py-1 px-2 border 
              border-gray-400 rounded shadow mr-2"
                        >
                            Apply
                        </button>
                        {/* Reset Button */}
                        <button
                            onClick={resetDateRange}
                            title="Click this to rest date range."
                            className="
              bg-white 
              hover:bg-gray-100 
              text-gray-800 font-semibold py-1 px-2 border 
              border-gray-400 rounded shadow"
                        >
                            Reset
                        </button>
                        {/* Export Button */}
                        {/* Wrap the Export button and drop-down menu */}
                        <div
                            style={{
                                position: "relative",
                                display: "inline-block",
                                marginLeft: "0.5rem",
                                marginRight: "0.5rem",
                            }}
                        >
                            <button
                                ref={exportButtonRef}
                                title="Click this to export wave chart."
                                onClick={handleExportClick}
                                className="
                bg-gray-300 
                hover:bg-gray-400 
                text-gray-800 font-bold py-1 px-2 rounded inline-flex items-center"
                            >
                                Export
                            </button>
                            {exportMenuVisible && (
                                <div
                                    ref={exportMenuRef}
                                    style={{
                                        position: "absolute",
                                        top: "calc(100% + 0.5rem)",
                                        left: 0,
                                        width: "250px",
                                        backgroundColor: "#fff",
                                        border: "1px solid #ccc",
                                        borderRadius: "4px",
                                        boxShadow: "0 2px 5px rgba(0,0,0,0.15)",
                                        zIndex: 1001,
                                    }}
                                >
                                    <button
                                        onClick={exportOptions.print}
                                        style={{
                                            display: "block",
                                            width: "100%",
                                            padding: "0.5rem 1rem",
                                            border: "none",
                                            background: "none",
                                            textAlign: "left",
                                            cursor: "pointer",
                                        }}
                                    >
                                        Print chart
                                    </button>
                                    <button
                                        onClick={exportOptions.png}
                                        style={{
                                            display: "block",
                                            width: "100%",
                                            padding: "0.5rem 1rem",
                                            border: "none",
                                            background: "none",
                                            textAlign: "left",
                                            cursor: "pointer",
                                        }}
                                    >
                                        Download PNG image
                                    </button>
                                    <button
                                        onClick={exportOptions.jpeg}
                                        style={{
                                            display: "block",
                                            width: "100%",
                                            padding: "0.5rem 1rem",
                                            border: "none",
                                            background: "none",
                                            textAlign: "left",
                                            cursor: "pointer",
                                        }}
                                    >
                                        Download JPEG image
                                    </button>
                                    <button
                                        onClick={exportOptions.svg}
                                        style={{
                                            display: "block",
                                            width: "100%",
                                            padding: "0.5rem 1rem",
                                            border: "none",
                                            background: "none",
                                            textAlign: "left",
                                            cursor: "pointer",
                                        }}
                                    >
                                        Download SVG vector image
                                    </button>
                                    <button
                                        onClick={exportOptions.csv}
                                        style={{
                                            display: "block",
                                            width: "100%",
                                            padding: "0.5rem 1rem",
                                            border: "none",
                                            background: "none",
                                            textAlign: "left",
                                            cursor: "pointer",
                                        }}
                                    >
                                        Download CSV
                                    </button>
                                    <button
                                        onClick={exportOptions.xls}
                                        style={{
                                            display: "block",
                                            width: "100%",
                                            padding: "0.5rem 1rem",
                                            border: "none",
                                            background: "none",
                                            textAlign: "left",
                                            cursor: "pointer",
                                        }}
                                    >
                                        Download XLS
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Refresh Icon 按钮 */}
                        <button
                            className="bg-green-700 hover:bg-green-600 text-white font-bold py-1 px-2 rounded inline-flex items-center"
                            title="Click this to get the latest wave data."
                            onClick={async () => {
                                const updatedData = await fetchLatestWaveData(
                                    selectedLandmark[0].site_name
                                );

                                //用来检查数据是否更新
                                console.log("Updated API data:", updatedData);
                                // Check if WHTH of all data points is null
                                const allWaveHeightsNull = updatedData.every(
                                    (item) => item.WHTH === null
                                );
                                // Checks if WPDI is null for all data points
                                const allWaveDirectionsNull = updatedData.every(
                                    (item) => item.WPDI === null
                                );

                                if (allWaveHeightsNull) {
                                    alert("No wave height data record available.");
                                }
                                if (allWaveDirectionsNull) {
                                    alert("No wave direction data record available.");
                                }

                                if (updatedData) {
                                    setSelectedLandmark(updatedData);
                                } else {
                                    alert("Failed to load the latest data from GeoServer.");
                                }
                            }}
                        >
                            <FaSync size={20} />
                        </button>

                        {/* Fullscreen switch buttom */}
                        <button
                            className="bg-blue-700 text-white font-bold py-2 px-3 rounded mt-4 ml-2"
                            title="Click this to view full screen wave chart."
                            onClick={() => setIsFullscreen(!isFullscreen)}
                        >
                            {isFullscreen ? <FaCompress size={18} /> : <FaExpand size={18} />}
                        </button>
                    </div>

                    <button
                        onClick={() => setShowSidebar(false)}
                        className="absolute top-2 right-2 text-gray-700 hover:text-gray-900">
                        <FaTimes size={24} />
                    </button>

                    <HighchartsReact
                        highcharts={Highcharts}
                        options={chartOptions}
                        // options={testOptions}
                        ref={chartComponentRef} // Reference for resizing
                        containerProps={{ style: { height: "100%", width: "100%" } }} // Ensure chart takes full container
                    />
                </div>
            )}
        </div>
    );
};

export default Map;
