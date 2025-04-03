import React, { useState } from "react";
import "./App.css";
import Header from "./components/Header";
import Map from "./components/Map";

export default function App() {
  const [selectedLocation, setSelectedLocation] = useState(null);

  return (
    <div className="page-container">
      <Header onSelectLocation={setSelectedLocation} />
      <Map location={selectedLocation} />
    </div>
  );
}
