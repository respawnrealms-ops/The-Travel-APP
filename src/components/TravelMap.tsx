import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { WebView } from 'react-native-webview';

export interface MapMarker {
  lat: number;
  lng: number;
  label: string;
  color?: string;
}

interface TravelMapProps {
  markers: MapMarker[];
  height?: number;
  centerLat?: number;
  centerLng?: number;
  zoom?: number;
  darkMode?: boolean;
}

export function TravelMap({
  markers,
  height = 220,
  centerLat,
  centerLng,
  zoom = 13,
  darkMode = true,
}: TravelMapProps) {
  const lat = centerLat ?? (markers[0]?.lat ?? 48.8566);
  const lng = centerLng ?? (markers[0]?.lng ?? 2.3522);

  const markersJson = JSON.stringify(markers);

  const mapTiles = darkMode
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

  const html = `
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  html, body { width:100%; height:100%; background: ${darkMode ? '#0d1117' : '#f4f4f4'}; }
  #map { width:100%; height:100%; }
  .leaflet-popup-content-wrapper {
    background: ${darkMode ? '#1a2335' : '#fff'};
    color: ${darkMode ? '#fff' : '#333'};
    border-radius: 12px;
    border: 1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'};
    box-shadow: 0 8px 32px rgba(0,0,0,0.4);
  }
  .leaflet-popup-tip { background: ${darkMode ? '#1a2335' : '#fff'}; }
  .leaflet-control-attribution { display: none; }
  .leaflet-control-zoom { display: none; }
</style>
</head>
<body>
<div id="map"></div>
<script>
  var map = L.map('map', {
    zoomControl: false,
    attributionControl: false,
    dragging: true,
    scrollWheelZoom: false,
  }).setView([${lat}, ${lng}], ${zoom});

  L.tileLayer('${mapTiles}', {
    maxZoom: 19,
    subdomains: 'abcd',
  }).addTo(map);

  var markers = ${markersJson};
  var latlngs = [];

  function makeIcon(color) {
    return L.divIcon({
      className: '',
      html: '<div style="width:14px;height:14px;border-radius:50%;background:' + color + ';border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.5);"></div>',
      iconSize: [14, 14],
      iconAnchor: [7, 7],
      popupAnchor: [0, -10],
    });
  }

  markers.forEach(function(m, idx) {
    var color = m.color || '#0F62FE';
    if (idx === 0) color = '#10B981';
    else if (idx === markers.length - 1) color = '#EF4444';
    var marker = L.marker([m.lat, m.lng], { icon: makeIcon(color) }).addTo(map);
    marker.bindPopup('<b>' + m.label + '</b>', { maxWidth: 160 });
    latlngs.push([m.lat, m.lng]);
  });

  if (latlngs.length > 1) {
    L.polyline(latlngs, {
      color: '#00C6FF',
      weight: 3,
      opacity: 0.85,
      dashArray: '6,6',
    }).addTo(map);
  }

  if (latlngs.length > 0) {
    var group = new L.FeatureGroup(markers.map(function(m){ return L.marker([m.lat, m.lng]); }));
    map.fitBounds(group.getBounds().pad(0.25));
  }
</script>
</body>
</html>`;

  if (Platform.OS === 'web') {
    // On web, render an iframe-compatible inline frame
    return (
      <View style={[styles.wrapper, { height }]}>
        <iframe
          srcDoc={html}
          style={{ width: '100%', height: '100%', border: 'none', borderRadius: 20 }}
          title="Travel Map"
          sandbox="allow-scripts allow-same-origin"
        />
      </View>
    );
  }

  return (
    <View style={[styles.wrapper, { height }]}>
      <WebView
        source={{ html }}
        style={styles.webview}
        scrollEnabled={false}
        javaScriptEnabled
        domStorageEnabled
        originWhitelist={['*']}
        mixedContentMode="always"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});
