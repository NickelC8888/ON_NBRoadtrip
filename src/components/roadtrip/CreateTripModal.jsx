import { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Save } from 'lucide-react';

const EMOJIS = ['🏔️','🌊','🌲','🏕️','🚗','🦌','🌅','🏞️','🗺️','⛺','🌿','🏖️','🦅','🌄','🎣'];
const SEASON_OPTIONS = [
  { id: 'june',             label: '☀️ June' },
  { id: 'late-august',      label: '🌻 Late August' },
  { id: 'early-september',  label: '🍂 Early September' },
];

function nanoid() {
  return `custom_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

function ModalContent({ onCreate, onClose }) {
  const [form, setForm] = useState({
    name: '',
    tagline: '',
    emoji: '🗺️',
    duration: '',
    distanceKm: '',
    driveHoursOneWay: '',
    seasons: ['june', 'late-august', 'early-september'],
    colorFrom: '#0d9488',
    colorTo: '#0891b2',
  });
  const [error, setError] = useState('');

  function set(key, value) { setForm(f => ({ ...f, [key]: value })); }
  function toggleSeason(id) {
    setForm(f => ({
      ...f,
      seasons: f.seasons.includes(id) ? f.seasons.filter(s => s !== id) : [...f.seasons, id],
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim()) { setError('Trip name is required.'); return; }
    if (form.seasons.length === 0) { setError('Select at least one season.'); return; }

    const trip = {
      id: nanoid(),
      name: form.name.trim(),
      tagline: form.tagline.trim() || 'My custom road trip',
      emoji: form.emoji,
      duration: form.duration.trim() || '—',
      distanceKm: form.distanceKm ? Number(form.distanceKm) : 0,
      driveHoursOneWay: form.driveHoursOneWay ? Number(form.driveHoursOneWay) : 0,
      seasons: form.seasons,
      colorFrom: form.colorFrom,
      colorTo: form.colorTo,
      highlights: [],
      route: {
        waypoints: [],
        stops: [],
        itinerary: [],
        mapPoints: [],
      },
      poi:         [],
      trails:      [],
      restaurants: [],
      lodging:     [],
      seasonTips:  {
        june: '',
        'late-august': '',
        'early-september': '',
      },
    };

    onCreate(trip);
  }

  return (
    <div
      style={{ position:'fixed', inset:0, zIndex:99999, backgroundColor:'rgba(0,0,0,0.65)',
               display:'flex', alignItems:'center', justifyContent:'center', padding:'16px' }}
      onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        style={{ backgroundColor:'#fff', borderRadius:16, boxShadow:'0 24px 64px rgba(0,0,0,0.35)',
                 width:'100%', maxWidth:540, maxHeight:'92vh', display:'flex', flexDirection:'column', overflow:'hidden' }}
        onMouseDown={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100 flex-shrink-0">
          <h2 className="font-display font-bold text-bark-900 text-base">Create New Trip</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-stone-100 text-bark-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-5 py-4 space-y-4">

          {/* Emoji picker */}
          <div>
            <label className="block text-xs font-semibold text-bark-600 mb-2">Emoji</label>
            <div className="flex flex-wrap gap-2">
              {EMOJIS.map(e => (
                <button
                  key={e} type="button"
                  onClick={() => set('emoji', e)}
                  className={`w-9 h-9 rounded-xl text-xl transition-all ${form.emoji === e ? 'bg-sun-200 ring-2 ring-sun-500' : 'bg-cream-100 hover:bg-cream-200'}`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-bark-600 mb-1">Trip Name <span className="text-red-400">*</span></label>
            <input type="text" value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Muskoka Long Weekend"
              className="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm text-bark-800 focus:outline-none focus:ring-2 focus:ring-sun-400" />
          </div>

          {/* Tagline */}
          <div>
            <label className="block text-xs font-semibold text-bark-600 mb-1">Tagline</label>
            <input type="text" value={form.tagline} onChange={e => set('tagline', e.target.value)} placeholder="A short subtitle for this trip"
              className="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm text-bark-800 focus:outline-none focus:ring-2 focus:ring-sun-400" />
          </div>

          {/* Duration + distance row */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-bark-600 mb-1">Duration</label>
              <input type="text" value={form.duration} onChange={e => set('duration', e.target.value)} placeholder="e.g. 3 days"
                className="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm text-bark-800 focus:outline-none focus:ring-2 focus:ring-sun-400" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-bark-600 mb-1">Distance (km)</label>
              <input type="number" min="0" value={form.distanceKm} onChange={e => set('distanceKm', e.target.value)}
                className="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm text-bark-800 focus:outline-none focus:ring-2 focus:ring-sun-400" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-bark-600 mb-1">Drive (hrs)</label>
              <input type="number" min="0" step="0.5" value={form.driveHoursOneWay} onChange={e => set('driveHoursOneWay', e.target.value)}
                className="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm text-bark-800 focus:outline-none focus:ring-2 focus:ring-sun-400" />
            </div>
          </div>

          {/* Color pickers */}
          <div className="flex gap-4 items-end">
            <div>
              <label className="block text-xs font-semibold text-bark-600 mb-1">Card colour (from)</label>
              <input type="color" value={form.colorFrom} onChange={e => set('colorFrom', e.target.value)}
                className="w-12 h-9 rounded-lg border border-stone-300 cursor-pointer p-0.5" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-bark-600 mb-1">Card colour (to)</label>
              <input type="color" value={form.colorTo} onChange={e => set('colorTo', e.target.value)}
                className="w-12 h-9 rounded-lg border border-stone-300 cursor-pointer p-0.5" />
            </div>
            <div className="flex-1 h-9 rounded-xl" style={{ background: `linear-gradient(to right, ${form.colorFrom}, ${form.colorTo})` }} />
          </div>

          {/* Seasons */}
          <div>
            <label className="block text-xs font-semibold text-bark-600 mb-2">Available seasons</label>
            <div className="flex flex-wrap gap-2">
              {SEASON_OPTIONS.map(s => (
                <button
                  key={s.id} type="button"
                  onClick={() => toggleSeason(s.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                    form.seasons.includes(s.id)
                      ? 'bg-sun-500 border-sun-500 text-bark-950'
                      : 'bg-white border-stone-300 text-bark-600 hover:border-sun-300'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
        </form>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 px-5 py-4 border-t border-stone-100 flex-shrink-0 bg-stone-50">
          <p className="text-xs text-bark-400">You can add POI, trails, and lodging after creating.</p>
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-sm text-bark-600 hover:bg-stone-200 transition-colors">
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-sun-500 hover:bg-sun-600 text-bark-950 text-sm font-bold shadow-sm transition-colors"
            >
              <Save className="w-4 h-4" /> Create Trip
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CreateTripModal({ onCreate, onClose }) {
  return createPortal(
    <ModalContent onCreate={onCreate} onClose={onClose} />,
    document.body
  );
}
