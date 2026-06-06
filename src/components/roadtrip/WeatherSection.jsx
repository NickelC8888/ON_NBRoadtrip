import { useState, useEffect, useRef } from 'react';
import { ChevronDown, ChevronUp, CloudSun } from 'lucide-react';

// ── Season → historical date range (same period, previous year) ───────────────
const SEASON_INFO = {
  'june':             { label: 'Late June',       month: 6,  startDay: 14, endDay: 21 },
  'late-august':      { label: 'Late August',     month: 8,  startDay: 18, endDay: 25 },
  'early-september':  { label: 'Early September', month: 9,  startDay: 1,  endDay: 8  },
};

function getDateRange(season) {
  const info = SEASON_INFO[season];
  if (!info) return null;
  const refYear = new Date().getFullYear() - 1; // use last year's actuals
  const pad = n => String(n).padStart(2, '0');
  return {
    label: info.label,
    start: `${refYear}-${pad(info.month)}-${pad(info.startDay)}`,
    end:   `${refYear}-${pad(info.month)}-${pad(info.endDay)}`,
    year:  refYear,
  };
}

// ── WMO weather code → label + emoji ─────────────────────────────────────────
function describeCode(code) {
  if (code === 0)              return { label: 'Sunny',          emoji: '☀️' };
  if (code === 1)              return { label: 'Mostly Clear',   emoji: '🌤️' };
  if (code === 2)              return { label: 'Partly Cloudy',  emoji: '⛅' };
  if (code === 3)              return { label: 'Overcast',       emoji: '☁️' };
  if (code >= 45 && code <= 48) return { label: 'Foggy',         emoji: '🌫️' };
  if (code >= 51 && code <= 57) return { label: 'Drizzle',       emoji: '🌦️' };
  if (code >= 61 && code <= 67) return { label: 'Rainy',         emoji: '🌧️' };
  if (code >= 71 && code <= 77) return { label: 'Snow',          emoji: '❄️' };
  if (code >= 80 && code <= 82) return { label: 'Showers',       emoji: '🌦️' };
  if (code >= 95)              return { label: 'Thunderstorms',  emoji: '⛈️' };
  return { label: 'Mixed',    emoji: '🌤️' };
}

function avg(arr) {
  if (!arr || arr.length === 0) return null;
  const valid = arr.filter(v => v != null);
  return valid.length ? Math.round(valid.reduce((a, b) => a + b, 0) / valid.length) : null;
}

function modeCode(codes) {
  if (!codes || codes.length === 0) return 2;
  const counts = {};
  codes.forEach(c => { if (c != null) counts[c] = (counts[c] || 0) + 1; });
  return Number(Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 2);
}

// ── Fetch weather from Open-Meteo archive ─────────────────────────────────────
const cache = {};

async function fetchStopWeather(lat, lon, start, end) {
  const key = `${lat},${lon},${start},${end}`;
  if (cache[key]) return cache[key];

  const url = new URL('https://archive-api.open-meteo.com/v1/archive');
  url.searchParams.set('latitude',  lat);
  url.searchParams.set('longitude', lon);
  url.searchParams.set('start_date', start);
  url.searchParams.set('end_date',   end);
  url.searchParams.set('daily', 'temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code');
  url.searchParams.set('timezone', 'America/Toronto');

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error('weather fetch failed');
  const json = await res.json();
  const d = json.daily;

  const result = {
    avgHigh:  avg(d.temperature_2m_max),
    avgLow:   avg(d.temperature_2m_min),
    rainDays: (d.precipitation_sum || []).filter(p => p != null && p >= 2).length,
    totalDays: (d.temperature_2m_max || []).length,
    condition: describeCode(modeCode(d.weather_code)),
  };
  cache[key] = result;
  return result;
}

// ── WeatherCard ───────────────────────────────────────────────────────────────
function WeatherCard({ stop, weather, loading, error }) {
  return (
    <div className="flex-shrink-0 w-40 bg-white border border-stone-200 rounded-xl p-3 shadow-card text-center space-y-1.5">
      <p className="text-xs font-bold text-bark-700 truncate">{stop.name}</p>
      {loading && (
        <div className="flex justify-center py-3">
          <span className="w-4 h-4 border-2 border-stone-200 border-t-sun-400 rounded-full animate-spin" />
        </div>
      )}
      {error && <p className="text-[10px] text-bark-400">Unavailable</p>}
      {weather && !loading && (
        <>
          <div className="text-2xl">{weather.condition.emoji}</div>
          <p className="text-[10px] text-bark-500">{weather.condition.label}</p>
          <div className="flex items-center justify-center gap-2 text-xs font-bold">
            <span className="text-red-500">{weather.avgHigh}°</span>
            <span className="text-bark-300">/</span>
            <span className="text-blue-500">{weather.avgLow}°</span>
          </div>
          <p className="text-[10px] text-bark-400">
            {weather.rainDays}/{weather.totalDays} rain days
          </p>
        </>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function WeatherSection({ trip, activeSeason }) {
  const [open, setOpen] = useState(false);
  const [weatherMap, setWeatherMap] = useState({});
  const [loadingSet, setLoadingSet] = useState(new Set());
  const [errorSet, setErrorSet] = useState(new Set());
  const fetchedRef = useRef(false);

  // Pick season to display: use activeSeason if specific, else first trip season
  const season = activeSeason !== 'all' ? activeSeason : (trip.seasons?.[0] ?? 'june');
  const range = getDateRange(season);

  // Overnight stops + departure (first stop)
  const stops = (trip.route?.stops || []).filter((s, i) => i === 0 || s.night != null);

  useEffect(() => {
    if (!open || !range || stops.length === 0) return;
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    stops.forEach(stop => {
      if (!stop.coords) return;
      const [lat, lon] = stop.coords;
      setLoadingSet(prev => new Set([...prev, stop.name]));
      fetchStopWeather(lat, lon, range.start, range.end)
        .then(w => {
          setWeatherMap(prev => ({ ...prev, [stop.name]: w }));
          setLoadingSet(prev => { const s = new Set(prev); s.delete(stop.name); return s; });
        })
        .catch(() => {
          setErrorSet(prev => new Set([...prev, stop.name]));
          setLoadingSet(prev => { const s = new Set(prev); s.delete(stop.name); return s; });
        });
    });
  }, [open]); // eslint-disable-line

  if (!range || stops.length === 0) return null;

  return (
    <div className="border border-stone-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-50 to-sky-50 hover:from-blue-100 hover:to-sky-100 transition-colors text-left"
      >
        <div className="flex items-center gap-2">
          <CloudSun className="w-4 h-4 text-sky-500 flex-shrink-0" />
          <div>
            <span className="font-semibold text-bark-800 text-sm">Typical Weather</span>
            <span className="ml-2 text-xs text-bark-400">· {range.label} · based on {range.year} actuals</span>
          </div>
        </div>
        {open
          ? <ChevronUp className="w-4 h-4 text-bark-400 flex-shrink-0" />
          : <ChevronDown className="w-4 h-4 text-bark-400 flex-shrink-0" />}
      </button>

      {open && (
        <div className="border-t border-stone-100 bg-white px-4 py-4 space-y-3">
          <div className="flex gap-3 overflow-x-auto pb-1">
            {stops.map(stop => (
              <WeatherCard
                key={stop.name}
                stop={stop}
                weather={weatherMap[stop.name]}
                loading={loadingSet.has(stop.name)}
                error={errorSet.has(stop.name)}
              />
            ))}
          </div>
          <p className="text-[10px] text-bark-400 leading-relaxed">
            Temperatures in °C. Historical data via{' '}
            <a href="https://open-meteo.com" target="_blank" rel="noreferrer" className="underline hover:text-bark-600">
              Open-Meteo
            </a>
            {' '}for the same week in {range.year}. Conditions vary year to year.
          </p>
        </div>
      )}
    </div>
  );
}
