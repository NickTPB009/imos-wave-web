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

// const Map = ({ location }) => {
//   const mapContainer = useRef(null);
//   const map = useRef(null);
//   const chartComponentRef = useRef(null); // Reference for the chart component
//   const [landmarks, setLandmarks] = useState([]);
//   const [selectedLandmark, setSelectedLandmark] = useState(null);
//   const [showSidebar, setShowSidebar] = useState(false);
//   const [isFullscreen, setIsFullscreen] = useState(false);
//   const markerRef = useRef([]);
//   const [exportMenuVisible, setExportMenuVisible] = useState(false);
//   // 新增两个 ref 用于 Export 按钮和下拉菜单
//   const exportButtonRef = useRef(null);
//   const exportMenuRef = useRef(null);

//   const [chartStartDate, setChartStartDate] = useState('');
//   const [chartEndDate, setChartEndDate] = useState('');

//   // 切换 Export 下拉菜单显示状态
//   const handleExportClick = () => {
//     setExportMenuVisible((prev) => !prev);
//   };

//   // 添加全局点击监听器，当点击区域不在 Export 按钮和菜单内时关闭菜单
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (exportMenuVisible) {
//         if (
//           exportMenuRef.current && !exportMenuRef.current.contains(event.target) &&
//           exportButtonRef.current && !exportButtonRef.current.contains(event.target)
//         ) {
//           setExportMenuVisible(false);
//         }
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, [exportMenuVisible]);

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
//     // Extract landmarks from local JSON files
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
//       ...mandurahLandmarks 
//     ]);
//   }, []);

//   // Initialize the map
//   useEffect(() => {
//     map.current = new mapboxgl.Map({
//       container: mapContainer.current,
//       style: 'mapbox://styles/mapbox/navigation-day-v1',
//       center: [133.7751, -25.2744],
//       zoom: 3, 
//     });
//     map.current.addControl(new mapboxgl.NavigationControl());
//     return () => {
//       if (map.current) {
//         map.current.remove();
//       }
//     };
//   }, []);

//   // Change map style if mapStyle state changes (if needed)
//   // (此处你已有相应的代码)

//   useEffect(() => {
//     // Remove previous markers
//     markerRef.current.forEach((marker) => marker.remove());
//     markerRef.current = [];

//     // Add new markers to the map
//     landmarks.forEach((landmark) => {
//       const marker = new mapboxgl.Marker()
//         .setLngLat([landmark.LONGITUDE, landmark.LATITUDE])
//         .setPopup(
//           new mapboxgl.Popup({ offset: 25 }).setDOMContent(createPopupContent(landmark))
//         )
//         .addTo(map.current);

//       marker.getElement().addEventListener('click', () => {
//         map.current.flyTo({
//           center: [landmark.LONGITUDE, landmark.LATITUDE],
//           zoom: 6,
//           essential: true,
//         });
//       });
//       markerRef.current.push(marker);
//     });
//   }, [landmarks]);

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

//   const chartOptions = React.useMemo(() => {
//     if (!selectedLandmark || selectedLandmark.length === 0) return null;
//     console.log('Selected Landmark times:', selectedLandmark.map(l => Date.parse(l.TIME)));
//     return {
//       chart: {
//         type: 'line',
//         zoomType: 'x',
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
//         title: { text: 'Time (UTC)' },
//         labels: { format: '{value:%e %b %Y %H:%M}' },
//       },
//       yAxis: [{
//         title: { text: 'Wave Height (m)' },
//       }],
//       series: [
//         {
//           type: 'line',
//           name: 'Wave Height',
//           data: selectedLandmark.map((landmark) => ({
//             x: Date.parse(landmark.TIME),
//             y: landmark.WHTH,
//           })),
//           tooltip: { valueSuffix: ' m' },
//         },
//         {
//           type: 'windbarb',
//           name: 'Wave Direction',
//           data: selectedLandmark.map((landmark) => ({
//             x: Date.parse(landmark.TIME),
//             value: 10,
//             direction: landmark.WPDI,
//           })),
//           marker: { symbol: 'arrow', rotation: 0 },
//           tooltip: { valueSuffix: ' °' },
//         },
//       ],
//     }
//   }, [selectedLandmark]);

//   useEffect(() => {
//     if (chartComponentRef.current) {
//       const chart = chartComponentRef.current.chart;
//       if (chart) {
//         chart.reflow();
//       }
//     }
//   }, [isFullscreen]);

//   const applyDateRange = () => {
//     const minTimestamp = Date.parse(chartStartDate);
//     const maxTimestamp = Date.parse(chartEndDate);
//     console.log('Start:', chartStartDate, minTimestamp);
//     console.log('End:', chartEndDate, maxTimestamp);
//     const filteredData = selectedLandmark.filter((landmark) => {
//       const t = Date.parse(landmark.TIME);
//       return t >= minTimestamp && t <= maxTimestamp;
//     });
//     if (filteredData.length === 0) {
//       alert("No data available for the selected time range.");
//       return;
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
//     <div style={{ position: 'relative', display: 'flex', height: '100vh' }}>
//       <div 
//         ref={mapContainer} 
//         className="map-container" 
//         style={{ width: showSidebar && !isFullscreen ? '75%' : '100%', height: '100%' }} 
//       />
//       <div style={{ position: 'absolute', bottom: 10, right: 10, zIndex: 10 }}>
//         <button
//           onClick={() => setMapStyle('mapbox://styles/mapbox/standard-satellite')}
//           className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l"
//         >
//           Satellite Layer
//         </button> <br />
//         <button
//           onClick={() => setMapStyle('mapbox://styles/mapbox/navigation-day-v1')}
//           className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l"
//         >
//           Default Layer
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
//           }}
//         >
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
//             </label>
//             <button
//               onClick={applyDateRange}
//               className="ml-4 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
//             >
//               Apply
//             </button>
//             <button
//               onClick={resetDateRange}
//               className="ml-4 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
//             >
//               Reset
//             </button>
//             {/* Export 按钮及下拉菜单 */}
//             <div style={{ position: 'relative', display: 'inline-block', marginLeft: '1rem' }}>
//               <button
//                 ref={exportButtonRef}
//                 onClick={handleExportClick}
//                 className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
//               >
//                 Export
//               </button>
//               {exportMenuVisible && (
//                 <div
//                   ref={exportMenuRef}
//                   style={{
//                     position: 'absolute',
//                     top: 'calc(100% + 0.5rem)',
//                     left: 0,
//                     width: '250px',
//                     backgroundColor: '#fff',
//                     border: '1px solid #ccc',
//                     borderRadius: '4px',
//                     boxShadow: '0 2px 5px rgba(0,0,0,0.15)',
//                     zIndex: 1001,
//                   }}
//                 >
//                   <button
//                     onClick={exportOptions.print}
//                     style={{
//                       display: 'block',
//                       width: '100%',
//                       padding: '0.5rem 1rem',
//                       border: 'none',
//                       background: 'none',
//                       textAlign: 'left',
//                       cursor: 'pointer',
//                     }}
//                   >
//                     Print chart
//                   </button>
//                   <button
//                     onClick={exportOptions.png}
//                     style={{
//                       display: 'block',
//                       width: '100%',
//                       padding: '0.5rem 1rem',
//                       border: 'none',
//                       background: 'none',
//                       textAlign: 'left',
//                       cursor: 'pointer',
//                     }}
//                   >
//                     Download PNG image
//                   </button>
//                   <button
//                     onClick={exportOptions.jpeg}
//                     style={{
//                       display: 'block',
//                       width: '100%',
//                       padding: '0.5rem 1rem',
//                       border: 'none',
//                       background: 'none',
//                       textAlign: 'left',
//                       cursor: 'pointer',
//                     }}
//                   >
//                     Download JPEG image
//                   </button>
//                   <button
//                     onClick={exportOptions.svg}
//                     style={{
//                       display: 'block',
//                       width: '100%',
//                       padding: '0.5rem 1rem',
//                       border: 'none',
//                       background: 'none',
//                       textAlign: 'left',
//                       cursor: 'pointer',
//                     }}
//                   >
//                     Download SVG vector image
//                   </button>
//                   <button
//                     onClick={exportOptions.csv}
//                     style={{
//                       display: 'block',
//                       width: '100%',
//                       padding: '0.5rem 1rem',
//                       border: 'none',
//                       background: 'none',
//                       textAlign: 'left',
//                       cursor: 'pointer',
//                     }}
//                   >
//                     Download CSV
//                   </button>
//                   <button
//                     onClick={exportOptions.xls}
//                     style={{
//                       display: 'block',
//                       width: '100%',
//                       padding: '0.5rem 1rem',
//                       border: 'none',
//                       background: 'none',
//                       textAlign: 'left',
//                       cursor: 'pointer',
//                     }}
//                   >
//                     Download XLS
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//           <HighchartsReact
//             highcharts={Highcharts}
//             options={chartOptions}
//             ref={chartComponentRef}
//             containerProps={{ style: { height: '100%', width: '100%' } }}
//           />
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
