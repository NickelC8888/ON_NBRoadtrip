import { useState, useRef } from 'react';
import { MapPin, Dog, Users, Leaf, Sun, Plus, CloudOff, CheckCircle2, Upload } from 'lucide-react';
import { SEASONS } from '@/data/roadTripData';
import { useCloudTripStore } from '@/hooks/useCloudTripStore';
import TripCard from '@/components/roadtrip/TripCard';
import TripDetail from '@/components/roadtrip/TripDetail';
import LegDetailPage from '@/components/roadtrip/LegDetailPage';
import CreateTripModal from '@/components/roadtrip/CreateTripModal';

export default function RoadTripPlanner({ user }) {
  const [selectedTripId, setSelectedTripId] = useState(null);
  const [activeSeason, setActiveSeason] = useState('all');
  const [selectedLeg, setSelectedLeg] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const detailRef = useRef(null);

  const store = useCloudTripStore(user);
  const { trips, customTripIds, packingOverrides, cloudLoading, synced,
          migrationPending, migrateToCloud, dismissMigration,
          createTrip, removeTrip, addItem, editItem, deleteItem,
          saveTips, addPacking, deletePacking } = store;

  const filteredTrips = activeSeason === 'all'
    ? trips
    : trips.filter(t => t.seasons?.includes(activeSeason));

  const selectedTrip = trips.find(t => t.id === selectedTripId);

  function handleMoreInfo(dayNumber) {
    setSelectedLeg({ tripId: selectedTripId, dayNumber });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleBackFromLeg() {
    setSelectedLeg(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleSelectTrip(id) {
    const opening = id !== selectedTripId;
    setSelectedTripId(prev => (prev === id ? null : id));
    if (opening) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  if (selectedLeg) {
    const legTrip = trips.find(t => t.id === selectedLeg.tripId);
    const legDay = legTrip?.route.itinerary.find(d => d.day === selectedLeg.dayNumber);
    if (!legTrip || !legDay) {
      return (
        <div className="p-8 text-bark-700">
          <button onClick={handleBackFromLeg} className="text-sm text-sun-700 font-semibold mb-4">
            ← Back
          </button>
          <p className="text-sm text-bark-500">Leg not found.</p>
        </div>
      );
    }
    return (
      <LegDetailPage
        trip={legTrip}
        day={legDay}
        onBack={handleBackFromLeg}
      />
    );
  }

  return (
    <div className="space-y-8">

      {/* ── Cloud loading skeleton ── */}
      {cloudLoading && (
        <div className="flex items-center gap-2 text-xs text-bark-400 bg-cream-100 border border-stone-200 rounded-xl px-4 py-3">
          <span className="w-3.5 h-3.5 border-2 border-bark-300 border-t-sun-500 rounded-full animate-spin flex-shrink-0" />
          Loading your saved trips…
        </div>
      )}

      {/* ── Migration prompt ── */}
      {migrationPending && !cloudLoading && (
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 bg-sun-50 border border-sun-300 rounded-xl px-4 py-3">
          <div className="flex items-center gap-2 flex-1">
            <Upload className="w-4 h-4 text-sun-600 flex-shrink-0" />
            <p className="text-sm text-bark-700 font-medium">
              You have saved trips on this device. Import them to your account?
            </p>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <button onClick={dismissMigration}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-bark-500 hover:bg-stone-100 transition-colors">
              Discard
            </button>
            <button onClick={migrateToCloud}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-sun-500 hover:bg-sun-600 text-bark-950 transition-colors">
              Import to account
            </button>
          </div>
        </div>
      )}

      {/* ── Sync indicator ── */}
      {user && synced && !cloudLoading && (
        <div className="flex items-center gap-1.5 text-xs text-leaf-600 font-medium">
          <CheckCircle2 className="w-3.5 h-3.5" /> Trips synced to your account
        </div>
      )}

      {/* ── Hero ── */}
      <div
        className={`relative overflow-hidden rounded-3xl border border-sun-200 shadow-card ${selectedTripId ? 'hidden sm:block' : ''}`}
        style={{
          background: 'radial-gradient(ellipse at 25% 70%, #fde68a 0%, #fef3c7 45%, #fffdf5 80%)',
        }}
      >
        {/* Decorative overlapping circles — top-right corner */}
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-sun-300/20 pointer-events-none" />
        <div className="absolute -top-8 -right-4 w-40 h-40 rounded-full bg-lake-300/15 pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-48 h-48 rounded-full bg-leaf-200/20 pointer-events-none" />

        {/* "FROM TORONTO" vertical label */}
        <div
          className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-display font-semibold tracking-[0.3em] text-sun-400 uppercase select-none hidden lg:block"
          style={{ writingMode: 'vertical-rl', transform: 'translateY(-50%) rotate(180deg)' }}
        >
          From Toronto
        </div>

        <div className="relative p-8 sm:p-10 pr-16">
          {/* Chips */}
          <div className="flex flex-wrap gap-2 mb-6">
            <BrightChip color="amber"><Users className="w-3 h-3" /> Family of 4</BrightChip>
            <BrightChip color="green"><Dog className="w-3 h-3" /> Dog-friendly</BrightChip>
            <BrightChip color="blue"><MapPin className="w-3 h-3" /> Ontario, Québec &amp; N.B.</BrightChip>
            <BrightChip color="teal"><Sun className="w-3 h-3" /> Summer &amp; Fall</BrightChip>
          </div>

          {/* Headline */}
          <div className="mb-5">
            <p className="text-[11px] font-display font-semibold tracking-[0.25em] text-bark-400 uppercase mb-1">
              Curated road trips
            </p>
            <h1 className="leading-[1.0]">
              <span className="block font-display font-extrabold text-4xl sm:text-5xl md:text-6xl text-bark-900 tracking-tight">
                YOUR GREAT
              </span>
              <span className="block font-sans font-bold italic text-4xl sm:text-5xl md:text-6xl text-sun-500">
                Ontario
              </span>
              <span className="block font-display font-extrabold text-4xl sm:text-5xl md:text-6xl text-bark-900 tracking-tight">
                ESCAPE
              </span>
            </h1>
          </div>

          {/* Amber rule */}
          <div className="w-16 h-1 rounded-full bg-sun-400 mb-5" />

          <p className="text-bark-600 text-sm sm:text-base max-w-2xl leading-relaxed mb-6">
            Curated 3–7 day road trips from Richmond Hill and Toronto for families with kids and a dog.
            Every route includes dog-friendly trails, family activities, top restaurants,
            and vetted pet-friendly accommodation — mapped and ready to go.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <StatDot color="#f59e0b">{trips.length} curated routes</StatDot>
            <StatDot color="#06b6d4">Interactive maps</StatDot>
            <StatDot color="#22c55e">Dog &amp; kid POI ratings</StatDot>
            <StatDot color="#d97706">Beginner–intermediate trails</StatDot>
          </div>
        </div>
      </div>

      {/* ── Season filter + New Trip ── */}
      <div className={`space-y-2.5 ${selectedTripId ? 'hidden sm:block' : ''}`}>
        <div className="flex items-center justify-between gap-4">
          <p className="text-[10px] font-display font-semibold text-bark-400 uppercase tracking-widest">
            Filter by season
          </p>
          <button
            onClick={() => setShowCreate(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sun-500 hover:bg-sun-600 text-bark-950 text-xs font-bold shadow-sm transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> New Trip
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {SEASONS.map(s => (
            <button
              key={s.id}
              onClick={() => {
                setActiveSeason(s.id);
                setSelectedTripId(null);
                setSelectedLeg(null);
              }}
              className={`
                px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200
                ${activeSeason === s.id
                  ? 'bg-sun-500 text-bark-950 border-sun-500 font-semibold shadow-md shadow-sun-200'
                  : 'bg-white text-bark-600 border-stone-200 hover:border-sun-300 hover:text-sun-700 hover:bg-sun-50'}
              `}
            >
              {s.id === 'june' && '☀️ '}
              {s.id === 'late-august' && '🌻 '}
              {s.id === 'early-september' && '🍂 '}
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Trip grid ── */}
      <div className={selectedTripId ? 'hidden sm:block' : ''}>
        {filteredTrips.length === 0 ? (
          <div className="text-center py-16 bg-cream-200 border-2 border-dashed border-sun-200 rounded-2xl">
            <Leaf className="w-10 h-10 mx-auto mb-3 text-leaf-400" />
            <p className="text-base font-semibold text-bark-700">No trips for this season.</p>
            <p className="text-sm mt-1 text-bark-400">Try a different filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTrips.map(trip => (
              <TripCard
                key={trip.id}
                trip={trip}
                isSelected={selectedTripId === trip.id}
                onSelect={handleSelectTrip}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Trip detail ── */}
      {selectedTrip && (
        <div ref={detailRef} className="scroll-mt-20">
          <button
            onClick={() => setSelectedTripId(null)}
            className="sm:hidden mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-sun-700 hover:text-sun-800"
          >
            ← All trips
          </button>
        <div className="border-t-2 border-sun-100 pt-8">
          <TripDetail
            trip={selectedTrip}
            activeSeason={activeSeason}
            onMoreInfo={handleMoreInfo}
            isCustomTrip={customTripIds.includes(selectedTrip.id)}
            onAddItem={addItem}
            onEditItem={editItem}
            onDeleteItem={deleteItem}
            onSaveTips={saveTips}
            onDeleteTrip={id => { removeTrip(id); setSelectedTripId(null); }}
            packingOverrides={packingOverrides}
            onAddPacking={addPacking}
            onDeletePacking={deletePacking}
          />
        </div>
        </div>
      )}

      {/* ── Empty state ── */}
      {!selectedTrip && filteredTrips.length > 0 && (
        <div className="text-center py-10 bg-cream-200/60 border-2 border-dashed border-sun-200 rounded-2xl">
          <MapPin className="w-8 h-8 mx-auto mb-3 text-sun-300" />
          <p className="text-base font-semibold text-bark-600">Select a trip to see the full plan</p>
          <p className="text-sm mt-1 text-bark-400">Maps · Trails · Restaurants · Lodging · Itinerary</p>
        </div>
      )}

      {showCreate && (
        <CreateTripModal
          onClose={() => setShowCreate(false)}
          onCreate={trip => { createTrip(trip); setShowCreate(false); setSelectedTripId(trip.id); }}
        />
      )}
    </div>
  );
}

function BrightChip({ children, color = 'amber' }) {
  const palette = {
    amber: 'bg-sun-100 text-sun-800 border-sun-300',
    green: 'bg-leaf-100 text-leaf-800 border-leaf-300',
    blue:  'bg-blue-50 text-blue-700 border-blue-200',
    teal:  'bg-lake-50 text-lake-700 border-lake-200',
  };
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border ${palette[color]}`}>
      {children}
    </span>
  );
}

function StatDot({ color, children }) {
  return (
    <span className="flex items-center gap-2 text-xs text-bark-500 font-medium">
      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
      {children}
    </span>
  );
}
