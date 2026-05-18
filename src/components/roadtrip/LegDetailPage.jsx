import { ChevronLeft, Car } from 'lucide-react';
import TripRouteMap from './TripRouteMap';

export default function LegDetailPage({ trip, day, onBack }) {
  const legMapPoints = (trip.route.mapPoints || []).filter(p => p.day === day.day);

  const hasMap = (day.legWaypoints && day.legWaypoints.length > 1) || legMapPoints.length > 0;

  const legTrip = hasMap ? {
    colorFrom: trip.colorFrom,
    route: {
      waypoints: day.legWaypoints && day.legWaypoints.length > 1
        ? day.legWaypoints
        : legMapPoints.map(p => p.coords),
      stops: [],
      mapPoints: legMapPoints,
    },
  } : null;

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-bark-600 hover:text-sun-700 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to {trip.name}
        </button>
        <span className="text-sm text-bark-400 font-medium select-none">{trip.emoji}</span>
      </div>

      {/* Day title card */}
      <div
        className="rounded-2xl p-5 text-white shadow-card"
        style={{ background: `linear-gradient(140deg, ${trip.colorFrom}, ${trip.colorTo})` }}
      >
        <div className="text-xs font-semibold uppercase tracking-widest text-white/60 mb-1">
          Day {day.day}
        </div>
        <h2 className="font-display text-2xl font-bold">{day.title}</h2>
        {day.desc && (
          <p className="mt-2 text-sm text-white/80 leading-relaxed">{day.desc}</p>
        )}
      </div>

      {/* Map */}
      {hasMap && legTrip && (
        <div className="rounded-2xl overflow-hidden shadow-card" style={{ height: '450px' }}>
          <TripRouteMap trip={legTrip} height="450px" />
        </div>
      )}
    </div>
  );
}
