import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import {
  GoogleMap,
  useJsApiLoader,
  DirectionsRenderer,
} from '@react-google-maps/api';
import { MapContainer, TileLayer, Polyline, Marker as LMarker, Popup, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Places library must be a stable reference outside any component
const GMAPS_LIBRARIES = ['places'];

// ── shared point styles (used by both map engines) ────────────────────────────

const POINT_STYLES = {
  poi:     { label: 'P', color: '#0f766e', title: 'Point of interest' },
  trail:   { label: 'T', color: '#16a34a', title: 'Trail' },
  food:    { label: 'F', color: '#d97706', title: 'Food stop' },
  lodging: { label: 'L', color: '#7c3aed', title: 'Lodging' },
  stop:    { label: 'S', color: '#2563eb', title: 'Stop' },
};

function googleMapsSearch(point) {
  const q = encodeURIComponent(`${point.name} ${point.location || ''}`.trim());
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
}

// ── Google Maps implementation — all markers created imperatively ─────────────

// Plain SVG URL string — no window.google.maps.Size/Point needed
function stopSvg(color, letter, cityName) {
  const name = (cityName || '').replace(/&/g, '&amp;').replace(/</g, '&lt;');
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="56" overflow="visible">
      <path d="M18 2C10.27 2 4 8.27 4 16c0 9.5 14 32 14 32S32 25.5 32 16C32 8.27 25.73 2 18 2z"
        fill="${color}" stroke="white" stroke-width="2.5"/>
      <text x="18" y="19" text-anchor="middle" dominant-baseline="middle"
        fill="white" font-size="12" font-weight="800" font-family="Arial,sans-serif">${letter}</text>
      <text x="18" y="54" text-anchor="middle"
        fill="${color}" font-size="11" font-weight="700" font-family="Arial,sans-serif"
        paint-order="stroke" stroke="white" stroke-width="4" stroke-linejoin="round">${name}</text>
    </svg>`
  )}`;
}

function poiSvg(color, name, showLabel, isSelected) {
  const r = isSelected ? 10 : 7;
  const sw = isSelected ? 3 : 2;
  const d = (r + sw) * 2;
  const safeLabel = (name || '').replace(/&/g, '&amp;').replace(/</g, '&lt;');
  if (!showLabel) {
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="${d}" height="${d}">
        <circle cx="${d / 2}" cy="${d / 2}" r="${r}" fill="${color}" stroke="white" stroke-width="${sw}"/>
      </svg>`
    )}`;
  }
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${d}" height="${d + 16}" overflow="visible">
      <circle cx="${d / 2}" cy="${d / 2}" r="${r}" fill="${color}" stroke="white" stroke-width="${sw}"/>
      <text x="${d / 2}" y="${d + 12}" text-anchor="middle"
        fill="${color}" font-size="10" font-weight="600" font-family="Arial,sans-serif"
        paint-order="stroke" stroke="white" stroke-width="3" stroke-linejoin="round">${safeLabel}</text>
    </svg>`
  )}`;
}

function popupHtml(item, pos, apiKey) {
  const svSrc = `https://maps.googleapis.com/maps/api/streetview?size=480x160&location=${pos.lat},${pos.lng}&fov=80&pitch=5&key=${apiKey}`;
  const gmUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${item.name} ${item.location || ''}`.trim())}`;
  const desc = (item.description || item.note || '').slice(0, 200).replace(/</g, '&lt;');
  const nightLine = item.night != null ? `<p style="color:#2563eb;font-size:11px;margin:0 0 4px">Night ${item.night} · overnight</p>` : '';
  const driveLine = item.driveFromPrevious ? `<p style="color:#64748b;font-size:11px;margin:0 0 4px">${item.driveFromPrevious.distance} · ${item.driveFromPrevious.time}</p>` : '';
  const descLine = desc ? `<p style="color:#475569;margin:0 0 8px;line-height:1.4">${desc}</p>` : '';
  return `<div style="max-width:240px;font-family:Arial,sans-serif;font-size:12px">
    <img src="${svSrc}" style="width:100%;height:120px;object-fit:cover;border-radius:6px;margin-bottom:8px;display:block" onerror="this.style.display='none'"/>
    <p style="font-weight:700;font-size:14px;margin:0 0 4px;color:#0f172a">${(item.name || '').replace(/</g, '&lt;')}</p>
    ${nightLine}${driveLine}${descLine}
    <a href="${gmUrl}" target="_blank" rel="noopener" style="color:#2563eb;font-weight:700;text-decoration:none">Open in Google Maps →</a>
  </div>`;
}

function GoogleMapContent({ trip, height, selectedCoords, showAllLabels, apiKey }) {
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef(null);
  const rendererRef = useRef(null);
  const infoWinRef = useRef(null);
  const stopMarkersRef = useRef([]);
  const poiMarkersRef = useRef([]);

  const { waypoints, stops = [], mapPoints = [] } = trip.route;
  const waypointsKey = useMemo(() => JSON.stringify(waypoints), [waypoints]);
  const stopsKey    = useMemo(() => JSON.stringify(stops),     [stops]);
  const pointsKey   = useMemo(() => JSON.stringify(mapPoints), [mapPoints]);

  const center = useMemo(() => ({
    lat: waypoints.reduce((s, [lat]) => s + lat, 0) / waypoints.length,
    lng: waypoints.reduce((s, [, lng]) => s + lng, 0) / waypoints.length,
  }), [waypointsKey]); // eslint-disable-line

  const containerStyle = height.endsWith('%')
    ? { height, minHeight: '380px', width: '100%' }
    : { height, width: '100%' };

  // ── initialise map once ────────────────────────────────────────────────────
  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
    infoWinRef.current = new window.google.maps.InfoWindow();
    rendererRef.current = new window.google.maps.DirectionsRenderer({ map, suppressMarkers: true });
    setMapLoaded(true);
  }, []); // eslint-disable-line

  // ── road directions ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!mapLoaded || waypoints.length < 2) return;
    rendererRef.current.setOptions({
      polylineOptions: { strokeColor: trip.colorFrom || '#f59e0b', strokeWeight: 5, strokeOpacity: 0.85 },
    });
    const svc = new window.google.maps.DirectionsService();
    const ints = waypoints.slice(1, -1);
    const step = Math.max(1, Math.ceil(ints.length / 23));
    svc.route({
      origin:      { lat: waypoints[0][0],                    lng: waypoints[0][1] },
      destination: { lat: waypoints[waypoints.length - 1][0], lng: waypoints[waypoints.length - 1][1] },
      waypoints: ints.filter((_, i) => i % step === 0).map(([lat, lng]) => ({ location: { lat, lng }, stopover: false })),
      travelMode: 'DRIVING',
      optimizeWaypoints: false,
    }, (result, status) => { if (status === 'OK') rendererRef.current.setDirections(result); });
  }, [mapLoaded, waypointsKey]); // eslint-disable-line

  // ── destination stop markers ───────────────────────────────────────────────
  useEffect(() => {
    if (!mapLoaded) return;
    stopMarkersRef.current.forEach(m => m.setMap(null));
    stopMarkersRef.current = [];
    const unique = stops.filter((s, i, arr) => s.name !== arr[i - 1]?.name);
    unique.forEach((stop, i) => {
      const color = i === 0 ? '#059669' : i === unique.length - 1 ? '#dc2626' : '#2563eb';
      const letter = i === 0 ? 'S' : i === unique.length - 1 ? 'E' : String(i);
      const m = new window.google.maps.Marker({
        map: mapRef.current,
        position: { lat: stop.coords[0], lng: stop.coords[1] },
        icon: stopSvg(color, letter, stop.name.split(',')[0].trim()),
        zIndex: 200,
        title: stop.name,
      });
      m.addListener('click', () => {
        const pos = { lat: stop.coords[0], lng: stop.coords[1] };
        infoWinRef.current.setContent(popupHtml(stop, pos, apiKey));
        infoWinRef.current.setPosition(pos);
        infoWinRef.current.open(mapRef.current);
      });
      stopMarkersRef.current.push(m);
    });
    return () => { stopMarkersRef.current.forEach(m => m.setMap(null)); stopMarkersRef.current = []; };
  }, [mapLoaded, stopsKey]); // eslint-disable-line

  // ── POI markers (recreate when points, labels, or selection changes) ───────
  useEffect(() => {
    if (!mapLoaded) return;
    poiMarkersRef.current.forEach(m => m.setMap(null));
    poiMarkersRef.current = [];
    mapPoints.forEach((pt) => {
      const style = POINT_STYLES[pt.category] || POINT_STYLES.poi;
      const isSel = selectedCoords != null &&
        Math.abs(pt.coords[0] - selectedCoords[0]) < 0.0001 &&
        Math.abs(pt.coords[1] - selectedCoords[1]) < 0.0001;
      const m = new window.google.maps.Marker({
        map: mapRef.current,
        position: { lat: pt.coords[0], lng: pt.coords[1] },
        icon: poiSvg(style.color, pt.name, showAllLabels, isSel),
        zIndex: isSel ? 500 : 1,
        title: pt.name,
      });
      m.addListener('click', () => {
        const pos = { lat: pt.coords[0], lng: pt.coords[1] };
        infoWinRef.current.setContent(popupHtml(pt, pos, apiKey));
        infoWinRef.current.setPosition(pos);
        infoWinRef.current.open(mapRef.current);
      });
      poiMarkersRef.current.push(m);
    });
    return () => { poiMarkersRef.current.forEach(m => m.setMap(null)); poiMarkersRef.current = []; };
  }, [mapLoaded, pointsKey, showAllLabels, selectedCoords]); // eslint-disable-line

  // ── pan to selected POI ────────────────────────────────────────────────────
  useEffect(() => {
    if (mapRef.current && selectedCoords) {
      mapRef.current.panTo({ lat: selectedCoords[0], lng: selectedCoords[1] });
      mapRef.current.setZoom(Math.max(mapRef.current.getZoom(), 14));
    }
  }, [selectedCoords]);

  // ── full cleanup on unmount ────────────────────────────────────────────────
  useEffect(() => () => {
    stopMarkersRef.current.forEach(m => m.setMap(null));
    poiMarkersRef.current.forEach(m => m.setMap(null));
    infoWinRef.current?.close();
    rendererRef.current?.setMap(null);
  }, []);

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={6}
      options={{ mapTypeControl: false, streetViewControl: false, fullscreenControl: false, gestureHandling: 'cooperative', clickableIcons: false }}
      onLoad={onMapLoad}
      onClick={() => infoWinRef.current?.close()}
    />
  );
}

const AUTH_ERROR_CODES = {
  ApiNotActivatedMapError: 'Maps JavaScript API is not enabled. Go to Google Cloud Console → APIs & Services → Enable APIs → enable "Maps JavaScript API".',
  RefererNotAllowedMapError: 'This domain is not allowed by your API key. Add "http://localhost:5999/*" to the key\'s allowed HTTP referrers in Google Cloud Console → Credentials.',
  InvalidKeyMapError: 'The API key is invalid. Double-check the key in .env.local.',
  BillingNotEnabledMapError: 'Billing is not enabled on your Google Cloud project. Maps JavaScript API requires a billing account (free tier is fine).',
  ExpiredKeyMapError: 'The API key has expired.',
  MissingKeyMapError: 'No API key provided.',
};

function GoogleMapsView({ trip, height, selectedCoords, showAllLabels, apiKey }) {
  const [authError, setAuthError] = useState(null);

  // Intercept Google's gm_authFailure before the overlay renders
  useEffect(() => {
    const prev = window.gm_authFailure;
    window.gm_authFailure = () => {
      // Extract the error code Google embeds in the DOM
      const msg = document.querySelector('.dismissButton')?.closest('[id]')?.id || '';
      const code = Object.keys(AUTH_ERROR_CODES).find(k => msg.includes(k)) || 'unknown';
      setAuthError(code);
      if (typeof prev === 'function') prev();
    };
    return () => { window.gm_authFailure = prev; };
  }, []);

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'roadtrip-gmaps',
    googleMapsApiKey: apiKey,
    libraries: GMAPS_LIBRARIES,
  });

  if (authError || loadError) {
    const errorText = AUTH_ERROR_CODES[authError] ||
      (loadError?.message) ||
      'Unknown Google Maps error — check the browser console for details.';
    return (
      <div className="flex flex-col items-start justify-center h-full min-h-[280px] bg-red-50 border border-red-200 rounded-xl p-5 gap-3">
        <p className="text-red-700 font-semibold text-sm">Google Maps failed to load</p>
        <p className="text-red-600 text-xs leading-relaxed">{errorText}</p>
        <a
          href="https://console.cloud.google.com/apis/library/maps-backend.googleapis.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-semibold text-blue-600 hover:underline"
        >
          Open Maps JavaScript API in Cloud Console →
        </a>
      </div>
    );
  }
  if (!isLoaded) return (
    <div className="flex items-center justify-center h-full min-h-[280px] bg-cream-100 rounded-xl">
      <span className="text-bark-400 text-sm animate-pulse">Loading map…</span>
    </div>
  );

  return (
    <GoogleMapContent
      trip={trip}
      height={height}
      selectedCoords={selectedCoords}
      showAllLabels={showAllLabels}
      apiKey={apiKey}
    />
  );
}

// ── Leaflet fallback (no API key) ─────────────────────────────────────────────

function SetViewOnSelect({ coords }) {
  const map = useMap();
  useEffect(() => {
    if (coords) map.flyTo(coords, Math.max(map.getZoom(), 14), { animate: true, duration: 0.6 });
  }, [map, coords]);
  return null;
}

function BoundsFitter({ waypoints }) {
  const map = useMap();
  useEffect(() => {
    if (waypoints.length > 1) map.fitBounds(waypoints, { padding: [32, 32] });
  }, [map, waypoints]);
  return null;
}

function MapLegend({ visible }) {
  const map = useMap();
  useEffect(() => {
    if (!visible) return undefined;
    const legend = L.control({ position: 'bottomright' });
    legend.onAdd = () => {
      const div = L.DomUtil.create('div');
      Object.assign(div.style, {
        background: 'rgba(255,255,255,0.95)',
        border: '1px solid rgba(15,23,42,0.18)',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.18)',
        padding: '8px 10px',
        font: '12px sans-serif',
        color: '#0f172a',
      });
      div.innerHTML = Object.values(POINT_STYLES).map(s => `
        <div style="display:flex;align-items:center;gap:6px;margin:3px 0;">
          <span style="display:inline-flex;align-items:center;justify-content:center;width:18px;height:18px;border-radius:6px;background:${s.color};color:white;font-weight:800;font-size:10px;">${s.label}</span>
          <span>${s.title}</span>
        </div>`).join('');
      return div;
    };
    legend.addTo(map);
    return () => legend.remove();
  }, [map, visible]);
  return null;
}

function makeStopIcon(label, isStart, isEnd) {
  const bg = isStart ? '#059669' : isEnd ? '#dc2626' : '#2563eb';
  const html = `<div style="background:${bg};color:white;width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:12px;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.35);font-family:sans-serif;">${label}</div>`;
  return L.divIcon({ html, className: '', iconSize: [30, 30], iconAnchor: [15, 15] });
}

function makeDirectionIcon(label) {
  const html = `<div style="background:#f59e0b;color:white;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:12px;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.35);font-family:sans-serif;">${label}</div>`;
  return L.divIcon({ html, className: '', iconSize: [28, 28], iconAnchor: [14, 14] });
}

function makePointIcon(category, isSelected = false) {
  const style = POINT_STYLES[category] || POINT_STYLES.poi;
  const size = isSelected ? 34 : 24;
  const html = `<div style="background:${style.color};color:white;width:${size}px;height:${size}px;border-radius:${isSelected ? '50%' : '8px'};display:flex;align-items:center;justify-content:center;font-weight:800;font-size:${isSelected ? '14px' : '11px'};border:${isSelected ? '3px' : '2px'} solid white;box-shadow:0 ${isSelected ? '3px 10px rgba(0,0,0,0.5)' : '2px 6px rgba(0,0,0,0.35)'};font-family:sans-serif;${isSelected ? `outline:3px solid ${style.color};outline-offset:3px;` : ''}">${style.label}</div>`;
  return L.divIcon({ html, className: '', iconSize: [size, size], iconAnchor: [size / 2, size / 2] });
}

function LeafletMapView({ trip, height, selectedCoords, showAllLabels }) {
  const { waypoints, stops } = trip.route;
  const mapPoints = trip.route.mapPoints || [];
  const bounds = [...waypoints, ...mapPoints.map(p => p.coords)];
  const isLegRoute = Array.isArray(stops) && stops.length === 0 && waypoints.length > 1;
  const centerLat = waypoints.reduce((s, w) => s + w[0], 0) / waypoints.length;
  const centerLng = waypoints.reduce((s, w) => s + w[1], 0) / waypoints.length;
  const mapStyle = height.endsWith('%')
    ? { height, minHeight: '380px', width: '100%', borderRadius: '0.5rem', border: 0 }
    : { height, width: '100%', borderRadius: '0.5rem', border: 0 };

  return (
    <div className="relative h-full">
      <MapContainer center={[centerLat, centerLng]} zoom={7} style={mapStyle} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Polyline positions={waypoints} pathOptions={{ color: trip.colorFrom, weight: 4, dashArray: '8 6', opacity: 0.85 }} />

        {stops.map((stop, i) => {
          const isStart = i === 0;
          const isEnd = i === stops.length - 1;
          return (
            <LMarker key={stop.name} position={stop.coords} icon={makeStopIcon(isStart ? '🏠' : isEnd ? '📍' : String(i), isStart, isEnd)}>
              <Popup>
                <div style={{ minWidth: '160px' }}>
                  <p style={{ fontWeight: 700, marginBottom: 4 }}>{stop.name}</p>
                  {stop.night != null && <p style={{ fontSize: 12, color: '#2563eb', marginBottom: 4 }}>Night {stop.night} overnight</p>}
                  <p style={{ fontSize: 12, color: '#475569' }}>{stop.description}</p>
                </div>
              </Popup>
            </LMarker>
          );
        })}

        {isLegRoute && (
          <>
            <LMarker position={waypoints[0]} icon={makeDirectionIcon('S')} />
            <LMarker position={waypoints[waypoints.length - 1]} icon={makeDirectionIcon('E')} />
          </>
        )}

        {mapPoints.map((point, index) => {
          const style = POINT_STYLES[point.category] || POINT_STYLES.poi;
          const isSelected = selectedCoords != null &&
            Math.abs(point.coords[0] - selectedCoords[0]) < 0.0001 &&
            Math.abs(point.coords[1] - selectedCoords[1]) < 0.0001;
          return (
            <LMarker
              key={`${point.category}-${point.name}-${point.day || 'all'}-${index}`}
              position={point.coords}
              icon={makePointIcon(point.category, isSelected)}
              zIndexOffset={isSelected ? 1000 : 0}
            >
              {showAllLabels && (
                <Tooltip permanent direction="top" offset={[0, -14]} opacity={0.92}>
                  <span style={{ fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap' }}>{point.name}</span>
                </Tooltip>
              )}
              <Popup>
                <div style={{ minWidth: '180px' }}>
                  <p style={{ fontWeight: 700, marginBottom: 4 }}>{point.name}</p>
                  <p style={{ fontSize: 12, color: style.color, fontWeight: 700, marginBottom: 4 }}>
                    {style.title}{point.day ? ` · Day ${point.day}` : ''}
                  </p>
                  {point.location && <p style={{ fontSize: 12, color: '#475569', marginBottom: 4 }}>{point.location}</p>}
                  {point.note && <p style={{ fontSize: 12, color: '#475569', marginBottom: 8 }}>{point.note}</p>}
                  <a href={point.googleMapsUrl || googleMapsSearch(point)} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: '#2563eb', fontWeight: 700 }}>
                    Open in Google Maps
                  </a>
                </div>
              </Popup>
            </LMarker>
          );
        })}

        <SetViewOnSelect coords={selectedCoords} />
        <MapLegend visible={mapPoints.length > 0} />
        <BoundsFitter waypoints={bounds} />
      </MapContainer>
    </div>
  );
}

// ── public component ──────────────────────────────────────────────────────────

export default function TripRouteMap({ trip, height = '380px', selectedCoords = null, showAllLabels = false }) {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  if (apiKey) {
    return (
      <GoogleMapsView
        trip={trip}
        height={height}
        selectedCoords={selectedCoords}
        showAllLabels={showAllLabels}
        apiKey={apiKey}
      />
    );
  }

  return (
    <LeafletMapView
      trip={trip}
      height={height}
      selectedCoords={selectedCoords}
      showAllLabels={showAllLabels}
    />
  );
}
