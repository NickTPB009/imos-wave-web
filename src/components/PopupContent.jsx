import React, { useEffect, useRef } from "react";
import { ReactComponent as SaveIcon } from "../assets/selected.svg";
import { ReactComponent as CompareIcon } from "../assets/comparison.svg";
import { ReactComponent as DetailIcon } from "../assets/details.svg";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

// Mapbox access token
mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

const PopupContent = ({
    site,
    onDetailClick,
    selectedCompareSites,
    toggleCompareSite,
    onSaveSite,
}) => {

    const miniMapContainer = useRef(null);
    const mapRef = useRef(null);

    useEffect(() => {
        if (!site || !miniMapContainer.current) return;

        // 清除旧地图（避免重复）
        if (mapRef.current) {
            mapRef.current.remove();
        }

        // 初始化迷你地图
        mapRef.current = new mapboxgl.Map({
            container: miniMapContainer.current,
            style: "mapbox://styles/mapbox/streets-v11",
            center: [site.LONGITUDE, site.LATITUDE],
            zoom: 6,
            interactive: false,
        });

        // 添加标记点
        new mapboxgl.Marker().setLngLat([site.LONGITUDE, site.LATITUDE]).addTo(mapRef.current);
    }, [site]);

    return (
        <div style={{ fontFamily: "Arial", fontSize: "14px" }}>
            <h2 style={{ textAlign: "center", fontWeight: "bold" }}>
                {site.site_name}
            </h2>

            {/* Mini map */}
            <div
                ref={miniMapContainer}
                className="w-full h-36 rounded my-2 shadow"
                style={{ border: "1px solid #ccc" }}
            ></div>

            <p>Latitude: {site.LATITUDE}</p>
            <p>Longitude: {site.LONGITUDE}</p>
            {site.TIME && <p>Time: {new Date(site.TIME).toLocaleString()}</p>}
            {site.WPDI && <p>Wave Direction (WPDI): {site.WPDI}°</p>}
            {site.WHTH && <p>Wave Height (WHTH): {site.WHTH} meters</p>}

            <div className="flex flex-col items-center space-y-2 mt-4">
                <button
                    onClick={() => onSaveSite(site.site_name)}
                    className="flex items-center justify-center w-48 py-2 border border-gray-400 rounded bg-white hover:bg-gray-100 text-blue-900"
                >
                    <SaveIcon className="w-5 h-5 mr-2" />
                    Save Location
                </button>

                <button
                    onClick={() => toggleCompareSite(site.site_name)}
                    className="flex items-center justify-center w-48 py-2 border border-gray-400 rounded bg-white hover:bg-gray-100 text-blue-900"
                >
                    <CompareIcon className="w-5 h-5 mr-2" />
                    Comparison
                </button>

                <button
                    onClick={() => onDetailClick(site.site_name)}
                    className="flex items-center justify-center w-48 py-2 border border-gray-400 rounded bg-white hover:bg-gray-100 text-blue-900"
                >
                    <DetailIcon className="w-5 h-5 mr-2" />
                    More details
                </button>
            </div>

        </div>
    );
};

export default PopupContent;
