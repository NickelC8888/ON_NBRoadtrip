import { useState } from 'react';
import {
  ChevronLeft, ChevronDown, ChevronUp, MapPin, Clock, Calendar,
  Footprints, Utensils, BedDouble, Scale, Car,
} from 'lucide-react';
import TripRouteMap from './TripRouteMap';

// ── helpers ───────────────────────────────────────────────────────────────────

function winSide(va, vb, better) {
  if (better === 'lower') return va < vb ? 'a' : vb < va ? 'b' : 'tie';
  if (better === 'higher') return va > vb ? 'a' : vb > va ? 'b' : 'tie';
  return 'tie';
}

function StatChip({ label, value, win, side }) {
  const isWinner = win === side;
  return (
    <div className={`text-center px-3 py-2 rounded-xl border text-xs ${
      isWinner ? 'bg-leaf-50 border-leaf-300' : 'bg-stone-50 border-stone-200'
    }`}>
      <div className={`font-bold text-sm ${isWinner ? 'text-leaf-700' : 'text-bark-700'}`}>
        {value} {isWinner && <span className="text-leaf-500">✓</span>}
      </div>
      <div className="text-bark-400 text-[10px] mt-0.5 uppercase tracking-wide">{label}</div>
    </div>
  );
}

// ── DayCard ───────────────────────────────────────────────────────────────────

function DayCard({ day, colorFrom, colorTo }) {
  const [open, setOpen] = useState(false);
  if (!day) {
    return (
      <div className="border border-dashed border-stone-200 rounded-xl p-4 text-center text-bark-300 text-sm h-full flex items-center justify-center">
        No day
      </div>
    );
  }
  return (
    <div className="border border-stone-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 px-4 py-3 bg-cream-50 hover:bg-cream-100 transition-colors text-left"
      >
        <span
          className="w-7 h-7 rounded-full text-white text-xs font-bold flex items-center justify-center flex-shrink-0 font-display shadow-sm"
          style={{ background: `linear-gradient(135deg, ${colorFrom}, ${colorTo})` }}
        >
          {day.day}
        </span>
        <span className="font-semibold text-bark-800 text-sm flex-1 leading-snug">{day.title}</span>
        {open
          ? <ChevronUp className="w-4 h-4 text-bark-400 flex-shrink-0" />
          : <ChevronDown className="w-4 h-4 text-bark-400 flex-shrink-0" />}
      </button>
      {open && (
        <div className="px-4 py-3 space-y-3 bg-white border-t border-stone-100">
          {day.desc && <p className="text-xs text-bark-600 leading-relaxed">{day.desc}</p>}
          {day.highlights && day.highlights.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {day.highlights.map(h => (
                <span key={h} className="text-[10px] bg-sun-50 text-sun-800 border border-sun-200 px-2 py-0.5 rounded-full">{h}</span>
              ))}
            </div>
          )}
          {day.driveSegments && day.driveSegments.length > 0 && (
            <div className="space-y-1.5">
              {day.driveSegments.map((seg, i) => (
                <div key={i} className="rounded-lg bg-leaf-50 border border-leaf-100 px-2.5 py-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-semibold text-bark-700">{seg.from} → {seg.to}</span>
                    <span className="text-[11px] font-bold text-leaf-700 flex-shrink-0">{seg.distance} · {seg.time}</span>
                  </div>
                  {seg.note && <p className="text-[10px] text-bark-500 mt-0.5 leading-snug">{seg.note}</p>}
                </div>
              ))}
            </div>
          )}
          {day.userNotes && (
            <div className="bg-sun-50 border border-sun-200 rounded-lg px-3 py-2 text-xs text-bark-700 leading-relaxed">
              📌 {day.userNotes}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── StopsList ─────────────────────────────────────────────────────────────────

function StopsList({ trip }) {
  const stops = (trip.route?.stops || []).filter((s, i) => i === 0 || s.night != null);
  return (
    <div className="space-y-2">
      {stops.map((s, i) => (
        <div key={`${s.name}-${i}`} className="flex items-start gap-2.5">
          <span className="mt-0.5 text-sm flex-shrink-0">
            {i === 0 ? '🏠' : i === stops.length - 1 ? '🏁' : `${i}.`}
          </span>
          <div>
            <p className="text-xs font-semibold text-bark-700">{s.name}</p>
            {s.night != null && (
              <p className="text-[10px] text-bark-400">Night {s.night}</p>
            )}
            {s.driveFromPrevious && (
              <p className="text-[10px] text-leaf-600 font-medium">
                {s.driveFromPrevious.distance} · {s.driveFromPrevious.time}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── main ──────────────────────────────────────────────────────────────────────

export default function ComparePage({ trips, onBack, onViewTrip }) {
  const [a, b] = trips;

  const itinA = a.route?.itinerary || [];
  const itinB = b.route?.itinerary || [];
  const maxDays = Math.max(itinA.length, itinB.length);
  const rows = Array.from({ length: maxDays }, (_, i) => ({
    dayA: itinA[i] || null,
    dayB: itinB[i] || null,
    index: i,
  }));

  const poiA = (a.poi || []).length;   const poiB = (b.poi || []).length;
  const trailsA = (a.trails || []).length; const trailsB = (b.trails || []).length;
  const restA = (a.restaurants || []).length; const restB = (b.restaurants || []).length;
  const lodgA = (a.lodging || []).length;  const lodgB = (b.lodging || []).length;

  const distWin   = winSide(a.distanceKm, b.distanceKm, 'lower');
  const driveWin  = winSide(a.driveHoursOneWay, b.driveHoursOneWay, 'lower');
  const poiWin    = winSide(poiA, poiB, 'higher');
  const trailWin  = winSide(trailsA, trailsB, 'higher');
  const restWin   = winSide(restA, restB, 'higher');
  const lodgWin   = winSide(lodgA, lodgB, 'higher');

  return (
    <div className="space-y-8">

      {/* ── Header ── */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-bark-600 hover:text-sun-700 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to comparison
        </button>
        <div className="flex items-center gap-1.5 text-bark-500">
          <Scale className="w-4 h-4" />
          <span className="text-xs font-semibold uppercase tracking-wide">Side-by-Side</span>
        </div>
      </div>

      {/* ── Trip headers ── */}
      <div className="grid grid-cols-[1fr_auto_1fr] gap-2 items-stretch">
        <div
          className="rounded-2xl p-4 text-white flex flex-col"
          style={{ background: `linear-gradient(140deg, ${a.colorFrom}, ${a.colorTo})` }}
        >
          <div className="text-3xl mb-1.5 leading-none select-none">{a.emoji}</div>
          <h2 className="font-display font-bold text-base leading-snug flex-1">{a.name}</h2>
          <p className="text-white/70 text-xs mt-1 italic line-clamp-2">{a.tagline}</p>
          <button
            onClick={() => onViewTrip(a.id)}
            className="mt-3 self-start inline-flex items-center gap-1 text-xs font-semibold bg-white/20 hover:bg-white/30 border border-white/30 px-3 py-1.5 rounded-lg transition-colors"
          >
            View Full Plan →
          </button>
        </div>

        <div className="flex items-center justify-center px-2">
          <span className="font-display font-extrabold text-stone-300 text-sm">VS</span>
        </div>

        <div
          className="rounded-2xl p-4 text-white flex flex-col"
          style={{ background: `linear-gradient(140deg, ${b.colorFrom}, ${b.colorTo})` }}
        >
          <div className="text-3xl mb-1.5 leading-none select-none">{b.emoji}</div>
          <h2 className="font-display font-bold text-base leading-snug flex-1">{b.name}</h2>
          <p className="text-white/70 text-xs mt-1 italic line-clamp-2">{b.tagline}</p>
          <button
            onClick={() => onViewTrip(b.id)}
            className="mt-3 self-start inline-flex items-center gap-1 text-xs font-semibold bg-white/20 hover:bg-white/30 border border-white/30 px-3 py-1.5 rounded-lg transition-colors"
          >
            View Full Plan →
          </button>
        </div>
      </div>

      {/* ── Stats side by side ── */}
      <div className="grid grid-cols-[1fr_auto_1fr] gap-2 items-start">
        <div className="grid grid-cols-2 gap-2">
          <StatChip label="Distance" value={`${a.distanceKm} km`} win={distWin} side="a" />
          <StatChip label="Drive time" value={`${a.driveHoursOneWay} hrs`} win={driveWin} side="a" />
          <StatChip label="Duration" value={a.duration} win="tie" side="a" />
          <StatChip label="POI" value={poiA} win={poiWin} side="a" />
          <StatChip label="Trails" value={trailsA} win={trailWin} side="a" />
          <StatChip label="Restaurants" value={restA} win={restWin} side="a" />
          <StatChip label="Lodging" value={lodgA} win={lodgWin} side="a" />
        </div>
        <div className="flex items-center justify-center px-1 pt-3">
          <div className="w-px bg-stone-200 h-full min-h-[120px]" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <StatChip label="Distance" value={`${b.distanceKm} km`} win={distWin} side="b" />
          <StatChip label="Drive time" value={`${b.driveHoursOneWay} hrs`} win={driveWin} side="b" />
          <StatChip label="Duration" value={b.duration} win="tie" side="b" />
          <StatChip label="POI" value={poiB} win={poiWin} side="b" />
          <StatChip label="Trails" value={trailsB} win={trailWin} side="b" />
          <StatChip label="Restaurants" value={restB} win={restWin} side="b" />
          <StatChip label="Lodging" value={lodgB} win={lodgWin} side="b" />
        </div>
      </div>

      {/* ── Route maps ── */}
      <div className="space-y-3">
        <SectionLabel>Route Maps</SectionLabel>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-semibold text-bark-500 mb-1.5 truncate">{a.name}</p>
            <div className="rounded-2xl overflow-hidden shadow-card" style={{ height: '320px' }}>
              <TripRouteMap trip={a} height="320px" />
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-bark-500 mb-1.5 truncate">{b.name}</p>
            <div className="rounded-2xl overflow-hidden shadow-card" style={{ height: '320px' }}>
              <TripRouteMap trip={b} height="320px" />
            </div>
          </div>
        </div>
      </div>

      {/* ── Destinations side by side ── */}
      <div className="space-y-3">
        <SectionLabel>Overnight Destinations</SectionLabel>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-card">
            <TripBadge trip={a} />
            <div className="mt-3">
              <StopsList trip={a} />
            </div>
          </div>
          <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-card">
            <TripBadge trip={b} />
            <div className="mt-3">
              <StopsList trip={b} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Day-by-day itinerary ── */}
      <div className="space-y-3">
        <SectionLabel>Day-by-Day Itinerary</SectionLabel>

        {/* Column headers */}
        <div className="grid grid-cols-2 gap-3">
          <TripBadge trip={a} />
          <TripBadge trip={b} />
        </div>

        {/* Rows */}
        <div className="space-y-3">
          {rows.map(({ dayA, dayB, index }) => (
            <div key={index} className="grid grid-cols-2 gap-3 items-start">
              <DayCard day={dayA} colorFrom={a.colorFrom} colorTo={a.colorTo} />
              <DayCard day={dayB} colorFrom={b.colorFrom} colorTo={b.colorTo} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <h3 className="font-display font-semibold text-bark-500 text-xs uppercase tracking-widest flex items-center gap-2">
      <span className="w-4 h-0.5 bg-sun-400 inline-block rounded-full" />
      {children}
    </h3>
  );
}

function TripBadge({ trip }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="w-5 h-5 rounded-full flex-shrink-0"
        style={{ background: `linear-gradient(135deg, ${trip.colorFrom}, ${trip.colorTo})` }}
      />
      <span className="text-xs font-bold text-bark-700 truncate">{trip.name}</span>
    </div>
  );
}
