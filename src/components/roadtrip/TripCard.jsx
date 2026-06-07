import { MapPin, Clock, Calendar, Scale } from 'lucide-react';

const SEASON_LABELS = {
  june: '☀️ Jun',
  'late-august': '🌻 Aug',
  'early-september': '🍂 Sep',
};

export default function TripCard({ trip, isSelected, onSelect, isInCompare, onToggleCompare, compareDisabled }) {
  const isFeatured = trip.duration === '7 days';
  const highlights = Array.isArray(trip.highlights) ? trip.highlights : [];

  return (
    <div className="flex flex-col gap-1.5">
      {/* Main card */}
      <button
        onClick={() => onSelect(trip.id)}
        className={`
          group w-full text-left rounded-2xl overflow-hidden transition-all duration-200
          focus:outline-none focus-visible:ring-2 focus-visible:ring-sun-500 focus-visible:ring-offset-2
          ${isSelected
            ? 'shadow-card-sel -translate-y-0.5'
            : 'shadow-card hover:shadow-card-hover hover:-translate-y-0.5'}
          bg-white
        `}
      >
        {/* Vivid gradient header */}
        <div
          className="relative p-4 pb-5 text-white"
          style={{ background: `linear-gradient(140deg, ${trip.colorFrom}, ${trip.colorTo})` }}
        >
          {isFeatured && (
            <span className="absolute top-3 right-3 bg-white/25 text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-sm tracking-wide">
              7-DAY
            </span>
          )}
          <div className="absolute -bottom-6 -right-6 w-20 h-20 rounded-full bg-white/10 pointer-events-none" />
          <div className="text-4xl mb-2 leading-none select-none">{trip.emoji}</div>
          <h3 className="font-display font-bold text-base leading-tight text-white">{trip.name}</h3>
          <p className="text-white/80 text-xs mt-1 leading-snug line-clamp-2 font-light italic">
            {trip.tagline}
          </p>
        </div>

        {/* Card body */}
        <div className="px-4 pt-4 pb-0 bg-white">
          <div className="grid grid-cols-3 gap-1.5 mb-3">
            <StatCell icon={<MapPin className="w-2.5 h-2.5" />} label="km" value={`${trip.distanceKm}`} color={trip.colorFrom} />
            <StatCell icon={<Clock className="w-2.5 h-2.5" />} label="hrs" value={`${trip.driveHoursOneWay}`} color={trip.colorFrom} />
            <StatCell icon={<Calendar className="w-2.5 h-2.5" />} label="days" value={trip.duration.replace(' days', '').replace(' day', '')} color={trip.colorFrom} />
          </div>

          <div className="flex flex-wrap gap-1 mb-3">
            {trip.seasons.map(s => (
              <span
                key={s}
                className="text-[10px] bg-cream-200 text-bark-600 border border-cream-300 px-1.5 py-0.5 rounded-full font-medium"
              >
                {SEASON_LABELS[s]}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap gap-x-3 gap-y-0.5 mb-3 min-h-[1rem]">
            {highlights.slice(0, 3).map(h => (
              <span key={h} className="text-[11px] text-bark-400 before:content-['·'] before:mr-1 before:text-sun-400">
                {h}
              </span>
            ))}
          </div>
        </div>

        {/* CTA footer */}
        <div
          className={`
            mx-4 mb-4 mt-1 px-3 py-2 rounded-xl flex items-center justify-between
            text-xs font-semibold tracking-wide transition-all duration-200
            ${isSelected
              ? 'text-white'
              : 'text-bark-500 group-hover:text-bark-800 bg-cream-100 group-hover:bg-cream-200'}
          `}
          style={isSelected ? { background: `linear-gradient(135deg, ${trip.colorFrom}, ${trip.colorTo})` } : {}}
        >
          <span>{isSelected ? 'Viewing plan ✓' : 'View full plan'}</span>
          <span className={`text-base leading-none transition-transform duration-200 ${isSelected ? '' : 'group-hover:translate-x-0.5'}`}>
            →
          </span>
        </div>
      </button>

      {/* Compare toggle — sibling so no nested-button issue */}
      {onToggleCompare && (
        <button
          onClick={() => onToggleCompare(trip.id)}
          disabled={compareDisabled && !isInCompare}
          className={`w-full flex items-center justify-center gap-1.5 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
            isInCompare
              ? 'bg-leaf-100 text-leaf-700 border-leaf-300 hover:bg-leaf-200'
              : compareDisabled
              ? 'bg-stone-50 text-stone-300 border-stone-200 cursor-not-allowed opacity-50'
              : 'bg-white text-bark-500 border-stone-200 hover:bg-cream-100 hover:text-bark-700 hover:border-sun-200'
          }`}
        >
          <Scale className="w-3 h-3" />
          {isInCompare ? '✓ In comparison' : 'Add to compare'}
        </button>
      )}
    </div>
  );
}

function StatCell({ icon, label, value, color }) {
  return (
    <div className="flex flex-col items-center gap-0.5 bg-cream-100 rounded-xl py-2 border border-cream-300">
      <div style={{ color }} className="opacity-80">{icon}</div>
      <span className="text-bark-800 font-bold text-[11px]">{value}</span>
      <span className="text-bark-400 text-[9px] uppercase tracking-wide">{label}</span>
    </div>
  );
}
