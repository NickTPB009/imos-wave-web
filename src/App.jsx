import React, { useEffect, useState } from "react";
import "./App.css";
import Header from "./components/Header";
import Map from "./components/Map";
import { fetchCachedSitesFromBackend } from "./utils";
// import { fetchSiteNamesFromGeoServer } from "./utils";

export default function App() {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [landmarks, setLandmarks] = useState([]);
  const [savedSites, setSavedSites] = useState([]);
  const [hasNewSavedSite, setHasNewSavedSite] = useState(false);

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
        savedSites={savedSites}
        clearSavedSites={() => setSavedSites([])}
        removeSavedSite={(siteName) =>
          setSavedSites((prev) => prev.filter((s) => s !== siteName))
        }
        setHasNewSavedSite={setHasNewSavedSite}
        hasNewSavedSite={hasNewSavedSite}
      />

      <Map
        location={selectedLocation}
        landmarks={landmarks}
        setLandmarks={setLandmarks}
        savedSites={savedSites}
        setSavedSites={setSavedSites}
        setHasNewSavedSite={setHasNewSavedSite}
      />

    </div>
  );
}
