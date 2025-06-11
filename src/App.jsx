import React, { useEffect, useState } from "react";
import "./App.css";
import Header from "./components/Header";
import Map from "./components/Map";
import { fetchCachedSitesFromBackend } from "./utils";
// import { fetchSiteNamesFromGeoServer } from "./utils";

export default function App() {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [landmarks, setLandmarks] = useState([]);

  // useEffect(() => {
  //   async function loadLandmarks() {
  //     const result = await fetchSiteNamesFromGeoServer();
  //     console.log("✅ GeoServer 返回的 landmarks：", result);
  //     setLandmarks(result);
  //   }

  //   loadLandmarks();
  // }, []);

  // 使用后端 API 获取站点列表
  // 这样可以避免直接请求 GeoServer，减少延迟和错误
  useEffect(() => {
    async function loadLandmarks() {
      const result = await fetchCachedSitesFromBackend();
      setLandmarks(result);
    }
    loadLandmarks();
  }, []);

  return (
    <div className="page-container">
      <Header
        onSelectLocation={setSelectedLocation}
        landmarks={landmarks}
      />
      <Map
        location={selectedLocation}
        landmarks={landmarks}
        setLandmarks={setLandmarks}
      />

    </div>
  );
}
