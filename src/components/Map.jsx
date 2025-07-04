import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import HighchartsWindbarb from "highcharts/modules/windbarb";
import Exporting from "highcharts/modules/exporting";
import ExportData from "highcharts/modules/export-data";
import { FaTimes, FaSync, FaExpand, FaCompress } from "react-icons/fa";
import { fetchLatestWaveData } from "../utils";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fetchCachedSitesFromBackend } from "../utils";
import PopupContent from "./PopupContent";
import Draggable from 'react-draggable';
import { createRoot } from "react-dom/client";
import CompareChart from "./CompareChart";
import CompareSelector from "./CompareSelector";


window.Highcharts = Highcharts;
HighchartsWindbarb(Highcharts);
Exporting(Highcharts);
ExportData(Highcharts);

// Mapbox access token
mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;


// Map Component
const Map = ({ location, savedSites, setSavedSites, setHasNewSavedSite, }) => {
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
  const [compareFullScreen, setCompareFullScreen] = useState(false);
  const [chartStartDate, setChartStartDate] = useState("");
  const [chartEndDate, setChartEndDate] = useState("");
  const [showCompareChart, setShowCompareChart] = useState(false);
  const [quickRange, setQuickRange] = useState(null);
  const [compareWaveData, setCompareWaveData] = useState({});
  const [selectedCompareSites, setSelectedCompareSites] = useState([]);
  const [mapStyle] = useState(
    "mapbox://styles/mapbox/navigation-day-v1"
  );
  const handleExportClick = () => {
    setExportMenuVisible((prev) => !prev);
  };

  const createPopupContent = (landmark) => {
    const container = document.createElement("div");

    const toggleCompareSite = (siteName) => {
      setSelectedCompareSites((prev) =>
        prev.includes(siteName)
          ? prev.filter((s) => s !== siteName)
          : [...prev, siteName].slice(-3) // Limit to last 3 selected sites
      );
    };

    const root = createRoot(container);
    root.render(
      <PopupContent
        site={landmark}
        selectedCompareSites={selectedCompareSites}
        toggleCompareSite={toggleCompareSite}
        onDetailClick={(siteName) => {
          window.dispatchEvent(
            new CustomEvent("detailGraph", { detail: siteName })
          );
        }}
        onSaveSite={(siteName) => {
          setSavedSites((prev) =>
            prev.includes(siteName) ? prev : [...prev, siteName]
          );
          setHasNewSavedSite(true); // ✅ 红点提醒
        }}
      />
    );

    return container;
  };


  const handleCloseCompareChart = () => {
    setShowCompareChart(false);
    setCompareWaveData({});
    setSelectedCompareSites([]); // 可选：也重置选择的站点
  };

  // 过滤出当前要给图表渲染的数据
  const dataForChart = React.useMemo(() => {
    if (!selectedLandmark) return [];

    // 如果 quickRange 为 null，就返回所有数据
    if (quickRange == null) {
      return selectedLandmark;
    }

    const now = Date.now();
    const cutoff = now - quickRange * 24 * 60 * 60 * 1000;
    // 只保留最近 quickRange 天的数据
    return selectedLandmark.filter(item =>
      Date.parse(item.TIME) >= cutoff
    );
  }, [selectedLandmark, quickRange]);

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

  useEffect(() => {
    const loadSites = async () => {
      // const sites = await fetchAllSitesFromGeoServer();
      const sites = await fetchCachedSitesFromBackend();

      const enrichedSites = sites.map((site) => ({
        ...site,
        TIME: null,
        WPDI: null,
        WHTH: null
      }));

      setLandmarks(enrichedSites);
    };

    loadSites();
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
        .setDOMContent(createPopupContent(feature.properties))
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
    const handleDetailGraph = async (e) => {
      const site_name = e.detail;
      setShowSidebar(true); // 优先显示图表区域

      try {
        const latestData = await fetchLatestWaveData(site_name);
        if (!latestData || latestData.length === 0) {
          alert("No latest wave data available.");
          return;
        }

        const allWaveHeightsNull = latestData.every(item => item.WHTH === null);
        const allWaveDirectionsNull = latestData.every(item => item.WPDI === null);

        if (allWaveHeightsNull) {
          alert("No wave height data record available.");
        }
        if (allWaveDirectionsNull) {
          alert("No wave direction data record available.");
        }

        // 判断是否有最近7天的数据
        const now = new Date();
        const sevenDaysAgo = new Date(now);
        sevenDaysAgo.setDate(now.getDate() - 7);

        const hasRecent7DaysData = latestData.some(item => {
          const itemTime = new Date(item.TIME);
          return itemTime >= sevenDaysAgo && itemTime <= now;
        });

        if (!hasRecent7DaysData) {
          alert(`No last 7 days data available, please click "View All Wave Data".`);
        }

        setSelectedLandmark(latestData);
        setQuickRange(7); // Set a default quick range of 7 days
      } catch (error) {
        console.error("Error fetching latest data:", error);
        alert("Failed to fetch the latest wave data.");
      }

      toast.info(
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            whiteSpace: "nowrap"
          }}
        >
          Showing latest data of <strong>{site_name}</strong>.
        </span>,
        {
          position: "top-center",
          autoClose: 5000,
          closeOnClick: true,
          style: {
            maxWidth: "900px",
            minHeight: "48px",
            fontSize: "16px",
            display: "flex",
            alignItems: "center",
            padding: "10px 16px"
          }
        }
      );
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
        text: 'Source: <a href="https://geoserver-portal.aodn.org.au/geoserver/web/?0&workspace=aodn" target="_blank">GeoServer</a>',
        align: "left",
      },
      xAxis: {
        type: "datetime",
        title: {
          text: "Time",
        },

        // 根据 quickRange 动态设置
        min: quickRange != null ? Date.now() - quickRange * 24 * 60 * 60 * 1000 : null,
        max: quickRange != null ? Date.now() : null
      },
      yAxis: [
        {
          title: {
            text: "Wave Height (m)",
          },
          opposite: false,
        },
        {
          title: {
            text: "Wave Direction (°)"
          },
          opposite: true,
          max: 360,
          min: 0,
          labels: {
            enabled: false
          },
          gridLineWidth: 1,
        }
      ],
      series: [
        {
          type: "line",
          name: "Wave Height",
          turboThreshold: 90000,
          data: dataForChart.map((landmark) => ({
            x: Date.parse(landmark.TIME),
            y: landmark.WHTH,
          })),
          tooltip: {
            xDateFormat: "%A, %b %e, %Y, %H:%M",
            shared: true
          },
        },
        {
          type: "windbarb",
          yAxis: 1,
          name: "Wave Direction",
          vectorLength: 30,
          color: "#ff8c00",
          turboThreshold: 90000,
          data: dataForChart
            .filter(
              (landmark) =>
                landmark.TIME !== null &&
                landmark.WPDI !== null &&
                !isNaN(Date.parse(landmark.TIME)) &&
                !isNaN(parseFloat(landmark.WPDI))
            )
            .map((landmark) => ({
              x: Date.parse(landmark.TIME),
              value: 5,
              direction: parseFloat(landmark.WPDI),
            })),
          marker: {
            symbol: "arrow",
            rotation: 0,
          },
          tooltip: {
            xDateFormat: "%A, %b %e, %Y, %H:%M",
            shared: true
          },
          zIndex: 5,
        },
      ],
    };
  }, [selectedLandmark, quickRange, dataForChart]);

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

  // Define a function to apply quick date ranges when the user clicks the quick range buttons
  const applyQuickRange = (days) => {
    if (!selectedLandmark || selectedLandmark.length === 0) return;

    // 特殊处理“View All Wave Data”按钮（days = null）
    if (days === null) {
      setQuickRange(null);
      setChartStartDate(null);
      setChartEndDate(null);
      return;
    }

    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - days);

    const filteredData = selectedLandmark.filter((item) => {
      const itemDate = new Date(item.TIME);
      return itemDate >= start && itemDate <= end;
    });

    if (filteredData.length === 0) {
      toast.warning(`No last ${days} day(s) data available, please click "View All Wave Data".`, {
        position: "top-center",
        autoClose: 5000,
      });
      return;
    }

    setChartStartDate(start.toISOString().split("T")[0]);
    setChartEndDate(end.toISOString().split("T")[0]);
    setQuickRange(days);
  };


  // Define a reset function to clear the input and reset the chart to display all data when the user clicks the Reset button
  const resetDateRange = () => {
    setChartStartDate("");
    setChartEndDate("");
    setQuickRange(null);
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

  useEffect(() => {
    const fetchCompareData = async () => {
      const newData = {};

      for (const siteName of selectedCompareSites) {
        try {
          const data = await fetchLatestWaveData(siteName);
          if (data && data.length > 0) {
            newData[siteName] = data;
          }
        } catch (error) {
          console.error(`Error fetching data for ${siteName}:`, error);
        }
      }

      setCompareWaveData(newData);
    };

    if (selectedCompareSites.length > 0) {
      fetchCompareData();
    } else {
      setCompareWaveData({});
    }
  }, [selectedCompareSites]);

  useEffect(() => {
    if (quickRange != null && chartComponentRef.current && selectedLandmark.length) {
      const now = Date.now();
      const past = now - quickRange * 24 * 60 * 60 * 1000;
      chartComponentRef.current.chart.xAxis[0].update({
        min: past,
        max: now
      });
    }
  }, [quickRange, selectedLandmark]);


  return (
    <div style={{ position: "relative", display: "flex", height: "100vh" }}>
      <CompareSelector
        landmarks={landmarks}
        selectedCompareSites={selectedCompareSites}
        setSelectedCompareSites={setSelectedCompareSites}
        setShowCompareChart={setShowCompareChart}
      />


      <ToastContainer
        toastStyle={{
          fontFamily: "inherit",
          fontSize: "16px"
        }}
      />
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

            {/* Quick range buttons */}
            <div style={{ marginTop: "0.5rem" }}>
              <button
                onClick={() => { applyQuickRange(1) }}
                className={`
    text-sm font-semibold py-1 px-2 border rounded mr-2
    ${quickRange === 1
                    ? 'bg-blue-700 text-white border-blue-700'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-800 border-gray-400'}
  `}
              >
                Last 1 Day
              </button>

              <button
                onClick={() => { applyQuickRange(3) }}
                className={`
    text-sm font-semibold py-1 px-2 border rounded mr-2
    ${quickRange === 3
                    ? 'bg-blue-700 text-white border-blue-700'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-800 border-gray-400'}
  `}
              >
                Last 3 Days
              </button>

              <button
                onClick={() => { applyQuickRange(7) }}
                className={`
    text-sm font-semibold py-1 px-2 border rounded mr-2
    ${quickRange === 7
                    ? 'bg-blue-700 text-white border-blue-700'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-800 border-gray-400'}
  `}
              >
                Last 1 Week
              </button>

              <button
                onClick={() => { applyQuickRange(30) }}
                className={`
    text-sm font-semibold py-1 px-2 border rounded mr-2
    ${quickRange === 30
                    ? 'bg-blue-700 text-white border-blue-700'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-800 border-gray-400'}
  `}
              >
                Last 1 Month
              </button>

              <button
                onClick={() => { applyQuickRange(null) }}
                className={`
    text-sm font-semibold py-1 px-2 border rounded mr-2
    ${quickRange === null
                    ? 'bg-blue-700 text-white border-blue-700'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-800 border-gray-400'}
  `}
              >
                View All Wave Data
              </button>

              {/* Refresh Icon 按钮 */}
              <button
                className="bg-green-700 text-white font-bold py-2 px-3 rounded mt-4 ml-2"
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
                <FaSync size={18} />
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
          </div>

          <button
            onClick={() => setShowSidebar(false)}
            className="absolute top-2 right-2 text-gray-700 hover:text-gray-900">
            <FaTimes size={24} />
          </button>

          <HighchartsReact
            highcharts={Highcharts}
            options={chartOptions}
            ref={chartComponentRef}
            containerProps={{ style: { height: "100%", width: "100%" } }} // Ensure chart takes full container
          />
        </div>
      )}

      {Object.keys(compareWaveData).length > 0 && (
        <Draggable handle=".compare-header" bounds="parent">
          <div
            style={{
              position: 'absolute',
              top: 10,
              left: 10,
              width: compareFullScreen ? '95%' : '600px',
              height: compareFullScreen ? '90%' : '400px',
              backgroundColor: 'white',
              border: '1px solid #ccc',
              borderRadius: '6px',
              padding: '10px',
              zIndex: 999,
              resize: 'both',
              overflow: 'auto',
              boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
            }}
          >
            {/* 顶部拖拽和控制栏 */}
            <div
              className="compare-header"
              style={{
                cursor: 'move',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '10px',
              }}
            >
              <strong>Wave Data Comparison</strong>
              <div>
                <button
                  onClick={() => setCompareFullScreen(prev => !prev)}
                  className="bg-blue-700 text-white px-2 py-1 rounded mr-2"
                >
                  {compareFullScreen ? 'Minimize' : 'Fullscreen'}
                </button>
                <button
                  onClick={handleCloseCompareChart}
                  className="bg-red-600 text-white px-2 py-1 rounded"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* 图表组件 */}
            <CompareChart data={compareWaveData} />
          </div>
        </Draggable>
      )}



    </div>
  );
};

export default Map;
