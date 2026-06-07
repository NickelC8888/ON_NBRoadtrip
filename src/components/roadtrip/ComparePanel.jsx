import { X, MapPin, Clock, Calendar, Footprints, Utensils, BedDouble, Scale } from 'lucide-react';

const SEASON_LABELS = {
  june: '☀️ June',
  'late-august': '🌻 Late Aug',
  'early-september': '🍂 Early Sep',
};

function winSide(va, vb, better) {
  if (better === 'lower') {
    if (va < vb) return 'a';
    if (vb < va) return 'b';
    return 'tie';
  }
  if (better === 'higher') {
    if (va > vb) return 'a';
    if (vb > va) return 'b';
    return 'tie';
  }
  return 'tie';
}

function cellClass(side, win) {
  if (win === 'tie' || win === 'neutral') return 'text-bark-700';
  return side === win
    ? 'text-leaf-700 font-bold'
    : 'text-bark-400';
}

function cellBg(side, win) {
  if (win === 'tie' || win === 'neutral') return '';
  return side === win ? 'bg-leaf-50' : '';
}

function MetricRow({ icon, label, valA, valB, win }) {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] border-t border-stone-100">
      {/* Trip A value */}
      <div className={`flex items-center justify-end px-4 py-2.5 gap-1.5 ${cellBg('a', win)}`}>
        {win === 'a' && <span className="text-leaf-500 text-xs">✓</span>}
        <span className={`text-sm ${cellClass('a', win)}`}>{valA}</span>
      </div>

      {/* Label */}
      <div className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-stone-50 border-x border-stone-100 min-w-[110px]">
        <span className="text-bark-400 flex-shrink-0">{icon}</span>
        <span className="text-[11px] font-semibold text-bark-500 uppercase tracking-wide whitespace-nowrap">{label}</span>
      </div>

      {/* Trip B value */}
      <div className={`flex items-center justify-start px-4 py-2.5 gap-1.5 ${cellBg('b', win)}`}>
        <span className={`text-sm ${cellClass('b', win)}`}>{valB}</span>
        {win === 'b' && <span className="text-leaf-500 text-xs">✓</span>}
      </div>
    </div>
  );
}

function StopsRow({ stopsA, stopsB }) {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] border-t border-stone-100">
      <div className="flex flex-col items-end gap-1 px-4 py-3">
        {stopsA.map(s => (
          <span key={s.name} className="text-xs text-bark-600 text-right">{s.name}</span>
        ))}
      </div>
      <div className="flex items-center justify-center gap-1.5 px-3 py-3 bg-stone-50 border-x border-stone-100 min-w-[110px]">
        <MapPin className="w-3 h-3 text-bark-400" />
        <span className="text-[11px] font-semibold text-bark-500 uppercase tracking-wide whitespace-nowrap">Key Stops</span>
      </div>
      <div className="flex flex-col items-start gap-1 px-4 py-3">
        {stopsB.map(s => (
          <span key={s.name} className="text-xs text-bark-600">{s.name}</span>
        ))}
      </div>
    </div>
  );
}

function SeasonsRow({ a, b }) {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] border-t border-stone-100">
      <div className="flex flex-wrap justify-end gap-1 px-4 py-2.5">
        {(a.seasons || []).map(s => (
          <span key={s} className="text-[10px] bg-cream-200 text-bark-600 border border-cream-300 px-1.5 py-0.5 rounded-full font-medium">
            {SEASON_LABELS[s]}
          </span>
        ))}
      </div>
      <div className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-stone-50 border-x border-stone-100 min-w-[110px]">
        <Calendar className="w-3 h-3 text-bark-400" />
        <span className="text-[11px] font-semibold text-bark-500 uppercase tracking-wide whitespace-nowrap">Seasons</span>
      </div>
      <div className="flex flex-wrap justify-start gap-1 px-4 py-2.5">
        {(b.seasons || []).map(s => (
          <span key={s} className="text-[10px] bg-cream-200 text-bark-600 border border-cream-300 px-1.5 py-0.5 rounded-full font-medium">
            {SEASON_LABELS[s]}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function ComparePanel({ trips, onClose, onViewTrip }) {
  const [a, b] = trips;

  const poiA = (a.poi || []).length;
  const poiB = (b.poi || []).length;
  const trailsA = (a.trails || []).length;
  const trailsB = (b.trails || []).length;
  const restA = (a.restaurants || []).length;
  const restB = (b.restaurants || []).length;
  const lodgA = (a.lodging || []).length;
  const lodgB = (b.lodging || []).length;

  const nightsA = parseInt(a.duration) || 0;
  const nightsB = parseInt(b.duration) || 0;

  const stopsA = (a.route?.stops || []).filter((s, i) => i === 0 || s.night != null);
  const stopsB = (b.route?.stops || []).filter((s, i) => i === 0 || s.night != null);

  const metrics = [
    {
      icon: <MapPin className="w-3 h-3" />,
      label: 'Distance',
      valA: `${a.distanceKm} km`,
      valB: `${b.distanceKm} km`,
      win: winSide(a.distanceKm, b.distanceKm, 'lower'),
    },
    {
      icon: <Clock className="w-3 h-3" />,
      label: 'Drive Time',
      valA: `${a.driveHoursOneWay} hrs`,
      valB: `${b.driveHoursOneWay} hrs`,
      win: winSide(a.driveHoursOneWay, b.driveHoursOneWay, 'lower'),
    },
    {
      icon: <Calendar className="w-3 h-3" />,
      label: 'Duration',
      valA: a.duration,
      valB: b.duration,
      win: winSide(nightsA, nightsB, 'neutral'),
    },
    {
      icon: <MapPin className="w-3 h-3" />,
      label: 'POI',
      valA: `${poiA} places`,
      valB: `${poiB} places`,
      win: winSide(poiA, poiB, 'higher'),
    },
    {
      icon: <Footprints className="w-3 h-3" />,
      label: 'Trails',
      valA: `${trailsA} trails`,
      valB: `${trailsB} trails`,
      win: winSide(trailsA, trailsB, 'higher'),
    },
    {
      icon: <Utensils className="w-3 h-3" />,
      label: 'Restaurants',
      valA: `${restA} spots`,
      valB: `${restB} spots`,
      win: winSide(restA, restB, 'higher'),
    },
    {
      icon: <BedDouble className="w-3 h-3" />,
      label: 'Lodging',
      valA: `${lodgA} options`,
      valB: `${lodgB} options`,
      win: winSide(lodgA, lodgB, 'higher'),
    },
  ];

  return (
    <div className="bg-white border border-stone-200 rounded-2xl shadow-card overflow-hidden">
      {/* Panel header */}
      <div className="flex items-center justify-between px-5 py-3 bg-stone-50 border-b border-stone-200">
        <div className="flex items-center gap-2">
          <Scale className="w-4 h-4 text-bark-400" />
          <h3 className="font-display font-bold text-bark-800 text-sm">Trip Comparison</h3>
        </div>
        <button
          onClick={onClose}
          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-stone-200 text-bark-400 hover:text-bark-700 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Trip headers */}
      <div className="grid grid-cols-[1fr_auto_1fr]">
        {/* Trip A header */}
        <div
          className="p-4 text-white"
          style={{ background: `linear-gradient(140deg, ${a.colorFrom}, ${a.colorTo})` }}
        >
          <div className="text-2xl mb-1 leading-none select-none">{a.emoji}</div>
          <p className="font-display font-bold text-sm leading-snug">{a.name}</p>
          <button
            onClick={() => onViewTrip(a.id)}
            className="mt-2 inline-flex items-center gap-1 text-xs font-semibold bg-white/20 hover:bg-white/30 border border-white/30 px-2.5 py-1 rounded-lg transition-colors"
          >
            View Plan →
          </button>
        </div>

        {/* VS divider */}
        <div className="flex items-center justify-center px-3 bg-stone-50 border-x border-stone-200">
          <span className="font-display font-extrabold text-stone-300 text-sm tracking-widest">VS</span>
        </div>

        {/* Trip B header */}
        <div
          className="p-4 text-white"
          style={{ background: `linear-gradient(140deg, ${b.colorFrom}, ${b.colorTo})` }}
        >
          <div className="text-2xl mb-1 leading-none select-none">{b.emoji}</div>
          <p className="font-display font-bold text-sm leading-snug">{b.name}</p>
          <button
            onClick={() => onViewTrip(b.id)}
            className="mt-2 inline-flex items-center gap-1 text-xs font-semibold bg-white/20 hover:bg-white/30 border border-white/30 px-2.5 py-1 rounded-lg transition-colors"
          >
            View Plan →
          </button>
        </div>
      </div>

      {/* Metric rows */}
      {metrics.map(m => (
        <MetricRow key={m.label} icon={m.icon} label={m.label} valA={m.valA} valB={m.valB} win={m.win} />
      ))}

      {/* Overnight stops */}
      <StopsRow stopsA={stopsA} stopsB={stopsB} />

      {/* Seasons */}
      <SeasonsRow a={a} b={b} />

      {/* Legend */}
      <div className="px-5 py-3 border-t border-stone-100 bg-stone-50 flex items-center gap-2">
        <span className="text-leaf-600 text-xs font-semibold">✓</span>
        <span className="text-[11px] text-bark-400">Better value for distance/drive time (lower) and resources (more options)</span>
      </div>
    </div>
  );
}
