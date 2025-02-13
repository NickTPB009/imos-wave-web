// // 在组件顶部定义 exportMenu 状态及相关处理函数
// const Map = ({ location }) => {
//     // ...（原有的 useRef、useState 定义）
//     const [exportMenuVisible, setExportMenuVisible] = useState(false);
  
//     // 用于 Highcharts 日期范围选择的状态
//     const [chartStartDate, setChartStartDate] = useState('');
//     const [chartEndDate, setChartEndDate] = useState('');
  
//     // 其它状态和 useEffect（不变）
//     // ...
  
//     // 定义 Export 按钮点击处理：切换下拉菜单显示状态
//     const handleExportClick = () => {
//       setExportMenuVisible((prev) => !prev);
//     };
  
//     // 定义各个导出选项的处理函数
//     const exportOptions = {
//       print: () => {
//         if (chartComponentRef.current && chartComponentRef.current.chart) {
//           chartComponentRef.current.chart.print();
//         }
//         setExportMenuVisible(false);
//       },
//       png: () => {
//         if (chartComponentRef.current && chartComponentRef.current.chart) {
//           chartComponentRef.current.chart.exportChart({ type: 'image/png' });
//         }
//         setExportMenuVisible(false);
//       },
//       jpeg: () => {
//         if (chartComponentRef.current && chartComponentRef.current.chart) {
//           chartComponentRef.current.chart.exportChart({ type: 'image/jpeg' });
//         }
//         setExportMenuVisible(false);
//       },
//       svg: () => {
//         if (chartComponentRef.current && chartComponentRef.current.chart) {
//           chartComponentRef.current.chart.exportChart({ type: 'image/svg+xml' });
//         }
//         setExportMenuVisible(false);
//       },
//       csv: () => {
//         if (chartComponentRef.current && chartComponentRef.current.chart) {
//           chartComponentRef.current.chart.downloadCSV();
//         }
//         setExportMenuVisible(false);
//       },
//       xls: () => {
//         if (chartComponentRef.current && chartComponentRef.current.chart) {
//           chartComponentRef.current.chart.downloadXLS();
//         }
//         setExportMenuVisible(false);
//       },
//     };
  
//     // 定义 applyDateRange 与 resetDateRange 函数（代码不变）
//     const applyDateRange = () => {
//       const minTimestamp = Date.parse(chartStartDate);
//       const maxTimestamp = Date.parse(chartEndDate);
//       console.log('Start:', chartStartDate, minTimestamp);
//       console.log('End:', chartEndDate, maxTimestamp);
  
//       // 筛选在选定范围内的数据（这里不改变数据，只是判断是否有数据）
//       const filteredData = selectedLandmark.filter((landmark) => {
//         const t = Date.parse(landmark.TIME);
//         return t >= minTimestamp && t <= maxTimestamp;
//       });
//       if (filteredData.length === 0) {
//         alert("No data available for the selected time range.");
//         return;
//       }
  
//       if (chartComponentRef.current && chartComponentRef.current.chart) {
//         chartComponentRef.current.chart.xAxis[0].update({
//           min: minTimestamp,
//           max: maxTimestamp,
//         });
//       }
//     };
  
//     const resetDateRange = () => {
//       setChartStartDate('');
//       setChartEndDate('');
//       if (chartComponentRef.current && chartComponentRef.current.chart) {
//         chartComponentRef.current.chart.xAxis[0].update({
//           min: null,
//           max: null,
//         });
//       }
//     };
  
//     // 以下为返回的 JSX 部分，主要修改在侧边栏中新增 Export 按钮和下拉菜单
//     return (
//       <div style={{ display: 'flex', height: '100vh' }}>
//         <div
//           ref={mapContainer}
//           className="map-container"
//           style={{ width: showSidebar && !isFullscreen ? '75%' : '100%', height: '100%' }}
//         />
//         {showSidebar && selectedLandmark && selectedLandmark.length > 0 && (
//           <div
//             className="sidebar"
//             style={{
//               width: isFullscreen ? '100%' : '25%',
//               padding: '20px',
//               backgroundColor: '#f8f9fa',
//               boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
//               height: '100%',
//               position: isFullscreen ? 'absolute' : 'relative',
//               top: 0,
//               right: 0,
//               zIndex: isFullscreen ? 1000 : 'auto',
//             }}
//           >
//             {/* 日期选择控件 */}
//             <div style={{ marginBottom: '1rem', position: 'relative' }}>
//               <label>
//                 Start Date:{' '}
//                 <input
//                   type="date"
//                   value={chartStartDate}
//                   onChange={(e) => setChartStartDate(e.target.value)}
//                 />
//               </label>
//               <label style={{ marginLeft: '1rem' }}>
//                 End Date:{' '}
//                 <input
//                   type="date"
//                   value={chartEndDate}
//                   onChange={(e) => setChartEndDate(e.target.value)}
//                 />
//               </label>
//               <button
//                 onClick={applyDateRange}
//                 style={{
//                   marginLeft: '1rem',
//                   backgroundColor: '#2563eb',
//                   color: 'white',
//                   fontWeight: 'bold',
//                   padding: '0.5rem 1rem',
//                   borderRadius: '0.25rem',
//                 }}
//               >
//                 Apply
//               </button>
//               <button
//                 onClick={resetDateRange}
//                 style={{
//                   marginLeft: '1rem',
//                   backgroundColor: '#dc2626',
//                   color: 'white',
//                   fontWeight: 'bold',
//                   padding: '0.5rem 1rem',
//                   borderRadius: '0.25rem',
//                 }}
//               >
//                 Reset
//               </button>
//               {/* Export 按钮 */}
//               <button
//                 onClick={handleExportClick}
//                 style={{
//                   marginLeft: '1rem',
//                   backgroundColor: '#10B981',
//                   color: 'white',
//                   fontWeight: 'bold',
//                   padding: '0.5rem 1rem',
//                   borderRadius: '0.25rem',
//                 }}
//               >
//                 Export
//               </button>
//               {/* Export 下拉菜单 */}
//               {exportMenuVisible && (
//                 <div
//                   style={{
//                     position: 'absolute',
//                     top: '3rem',
//                     right: 0,
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
//             {/* Highcharts 图表 */}
//             <HighchartsReact
//               highcharts={Highcharts}
//               options={chartOptions}
//               ref={chartComponentRef} // Reference for resizing
//               containerProps={{ style: { height: '100%', width: '100%' } }} // Ensure chart takes full container
//             />
//             <button
//               className="bg-cyan-950 text-white font-bold py-2 px-4 rounded mt-4"
//               onClick={() => setShowSidebar(false)}
//             >
//               Close
//             </button>
//             <button
//               className="bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 ml-2"
//               onClick={() => setIsFullscreen(!isFullscreen)}
//             >
//               {isFullscreen ? 'Exit Fullscreen' : 'View Full Chart'}
//             </button>
//           </div>
//         )}
//       </div>
//     );
//   };
  
//   export default Map;
  