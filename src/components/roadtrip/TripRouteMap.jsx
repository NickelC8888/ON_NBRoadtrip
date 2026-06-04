import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Auto-fit the map to the route bounds whenever the trip changes
function BoundsFitter({ waypoints }) {
  const map = useMap();
  useEffect(() => {
    if (waypoints.length > 1) {
      map.fitBounds(waypoints, { padding: [32, 32] });
    }
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
      div.style.background = 'rgba(255,255,255,0.95)';
      div.style.border = '1px solid rgba(15,23,42,0.18)';
      div.style.borderRadius = '8px';
      div.style.boxShadow = '0 4px 12px rgba(0,0,0,0.18)';
      div.style.padding = '8px 10px';
      div.style.font = '12px sans-serif';
      div.style.color = '#0f172a';
      div.innerHTML = Object.entries(POINT_STYLES).map(([, style]) => `
        <div style="display:flex;align-items:center;gap:6px;margin:3px 0;">
          <span style="display:inline-flex;align-items:center;justify-content:center;width:18px;height:18px;border-radius:6px;background:${style.color};color:white;font-weight:800;font-size:10px;">${style.label}</span>
          <span>${style.title}</span>
        </div>
      `).join('');
      return div;
    };

    legend.addTo(map);
    return () => legend.remove();
  }, [map, visible]);

  return null;
}

function makeStopIcon(label, isStart, isEnd) {
  const bg = isStart ? '#059669' : isEnd ? '#dc2626' : '#2563eb';
  const html = `
    <div style="
      background:${bg};
      color:white;
      width:30px;
      height:30px;
      border-radius:50%;
      display:flex;
      align-items:center;
      justify-content:center;
      font-weight:700;
      font-size:12px;
      border:2px solid white;
      box-shadow:0 2px 6px rgba(0,0,0,0.35);
      font-family:sans-serif;
    ">${label}</div>`;
  return L.divIcon({ html, className: '', iconSize: [30, 30], iconAnchor: [15, 15] });
}

function makeDirectionIcon(label) {
  const html = `
    <div style="
      background:#f59e0b;
      color:white;
      width:28px;
      height:28px;
      border-radius:50%;
      display:flex;
      align-items:center;
      justify-content:center;
      font-weight:800;
      font-size:12px;
      border:2px solid white;
      box-shadow:0 2px 6px rgba(0,0,0,0.35);
      font-family:sans-serif;
    ">${label}</div>`;
  return L.divIcon({ html, className: '', iconSize: [28, 28], iconAnchor: [14, 14] });
}

const POINT_STYLES = {
  poi: { label: 'P', color: '#0f766e', title: 'Point of interest' },
  trail: { label: 'T', color: '#16a34a', title: 'Trail' },
  food: { label: 'F', color: '#d97706', title: 'Food stop' },
  lodging: { label: 'L', color: '#7c3aed', title: 'Lodging' },
  stop: { label: 'S', color: '#2563eb', title: 'Stop' },
};

function makePointIcon(category) {
  const style = POINT_STYLES[category] || POINT_STYLES.poi;
  const html = `
    <div style="
      background:${style.color};
      color:white;
      width:24px;
      height:24px;
      border-radius:8px;
      display:flex;
      align-items:center;
      justify-content:center;
      font-weight:800;
      font-size:11px;
      border:2px solid white;
      box-shadow:0 2px 6px rgba(0,0,0,0.35);
      font-family:sans-serif;
    ">${style.label}</div>`;
  return L.divIcon({ html, className: '', iconSize: [24, 24], iconAnchor: [12, 12] });
}

function buildGoogleDirectionsEmbedUrl(waypoints, apiKey) {
  const origin = `${waypoints[0][0]},${waypoints[0][1]}`;
  const destination = `${waypoints[waypoints.length - 1][0]},${waypoints[waypoints.length - 1][1]}`;
  const waypointsParam = waypoints
    .slice(1, -1)
    .map(([lat, lng]) => `${lat},${lng}`)
    .join('|');

  const base = `https://www.google.com/maps/embed/v1/directions?key=${encodeURIComponent(apiKey)}&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&mode=driving`;
  return waypointsParam ? `${base}&waypoints=${encodeURIComponent(waypointsParam)}` : base;
}

function googleMapsSearch(point) {
  const query = encodeURIComponent(`${point.name} ${point.location || ''}`.trim());
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}

export default function TripRouteMap({ trip, height = '380px' }) {
  const { waypoints, stops } = trip.route;
  const mapPoints = trip.route.mapPoints || [];
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const embedUrl = apiKey && waypoints && waypoints.length > 1
    ? buildGoogleDirectionsEmbedUrl(waypoints, apiKey)
    : null;
  const bounds = [...waypoints, ...mapPoints.map(point => point.coords)];
  const isLegRoute = Array.isArray(stops) && stops.length === 0 && waypoints.length > 1;

  // Center on the midpoint of all waypoints as a fallback
  const centerLat = waypoints.reduce((s, w) => s + w[0], 0) / waypoints.length;
  const centerLng = waypoints.reduce((s, w) => s + w[1], 0) / waypoints.length;
  const mapStyle = height.endsWith('%')
    ? { height, minHeight: '380px', width: '100%', borderRadius: '0.5rem', border: 0 }
    : { height, width: '100%', borderRadius: '0.5rem', border: 0 };

  if (embedUrl) {
    return (
      <div className="relative h-full overflow-hidden rounded-2xl shadow-card" style={{ minHeight: '380px' }}>
        <iframe
          title="Google Maps directions"
          src={embedUrl}
          style={mapStyle}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    );
  }

  return (
    <div className="relative h-full">
      <MapContainer
        center={[centerLat, centerLng]}
        zoom={7}
        style={mapStyle}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Route polyline */}
        <Polyline
          positions={routeGeo ? routeGeo.coordinates.map(([lng, lat]) => [lat, lng]) : waypoints}
          pathOptions={{ color: trip.colorFrom, weight: 4, dashArray: '8 6', opacity: 0.85 }}
        />

        {/* Stop markers */}
        {stops.map((stop, i) => {
          const isStart = i === 0;
          const isEnd = i === stops.length - 1;
          const label = isStart ? '🏠' : isEnd ? '📍' : String(i);
          return (
            <Marker
              key={stop.name}
              position={stop.coords}
              icon={makeStopIcon(label, isStart, isEnd)}
            >
              <Popup>
                <div style={{ minWidth: '160px' }}>
                  <p style={{ fontWeight: 700, marginBottom: 4 }}>{stop.name}</p>
                  {stop.night != null && (
                    <p style={{ fontSize: 12, color: '#2563eb', marginBottom: 4 }}>
                      Night {stop.night} overnight
                    </p>
                  )}
                  <p style={{ fontSize: 12, color: '#475569' }}>{stop.description}</p>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {isLegRoute && (
          <>
            <Marker position={waypoints[0]} icon={makeDirectionIcon('S')} />
            <Marker position={waypoints[waypoints.length - 1]} icon={makeDirectionIcon('E')} />
          </>
        )}

        {/* Points of interest, trails, food, lodging, and notable stops */}
        {mapPoints.map((point, index) => {
          const style = POINT_STYLES[point.category] || POINT_STYLES.poi;
          return (
            <Marker
              key={`${point.category}-${point.name}-${point.day || 'all'}-${point.coords.join(',')}-${index}`}
              position={point.coords}
              icon={makePointIcon(point.category)}
            >
              <Popup>
                <div style={{ minWidth: '180px' }}>
                  <p style={{ fontWeight: 700, marginBottom: 4 }}>{point.name}</p>
                  <p style={{ fontSize: 12, color: style.color, fontWeight: 700, marginBottom: 4 }}>
                    {style.title}{point.day ? ` · Day ${point.day}` : ''}
                  </p>
                  {point.location && (
                    <p style={{ fontSize: 12, color: '#475569', marginBottom: 4 }}>{point.location}</p>
                  )}
                  {point.note && (
                    <p style={{ fontSize: 12, color: '#475569', marginBottom: 8 }}>{point.note}</p>
                  )}
                  <a
                    href={point.googleMapsUrl || googleMapsSearch(point)}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: 12, color: '#2563eb', fontWeight: 700 }}
                  >
                    Open in Google Maps
                  </a>
                </div>
              </Popup>
            </Marker>
          );
        })}

        <MapLegend visible={mapPoints.length > 0} />
        <BoundsFitter waypoints={bounds} />
      </MapContainer>
    </div>
  );
}
