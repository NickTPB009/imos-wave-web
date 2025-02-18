import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

const Map = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  // 定义一个 state 用来存储当前地图样式
  const [mapStyle, setMapStyle] = useState('mapbox://styles/mapbox/navigation-day-v1');

  // 初始化地图时使用 mapStyle
  useEffect(() => {
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: mapStyle,
      center: [133.7751, -25.2744], // 澳大利亚中心坐标
      zoom: 3,
    });

    // 添加导航控件（缩放/旋转）
    map.current.addControl(new mapboxgl.NavigationControl());

    return () => map.current.remove();
  }, []); // 仅在组件挂载时初始化

  // 当 mapStyle 变化时调用 setStyle 切换样式
  useEffect(() => {
    if (map.current) {
      map.current.setStyle(mapStyle);
    }
  }, [mapStyle]);

  return (
    <div style={{ position: 'relative', height: '100vh' }}>
      <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />

      {/* 样式切换按钮 */}
      <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 10 }}>
        <button
          onClick={() => setMapStyle('mapbox://styles/mapbox/standard-satellite')}
          style={{ padding: '0.5rem 1rem', marginRight: '0.5rem' }}
        >
          卫星图层
        </button>
        <button
          onClick={() => setMapStyle('mapbox://styles/mapbox/navigation-day-v1')}
          style={{ padding: '0.5rem 1rem' }}
        >
          导航图层
        </button>
      </div>
    </div>
  );
};

export default Map;


