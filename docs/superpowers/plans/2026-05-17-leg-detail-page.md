# Leg Detail Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a "More Info" button to each itinerary day card that opens a full leg-specific detail page with a map, drive info, and filtered POI/trails/restaurants/lodging.

**Architecture:** State-based page swap in `RoadTripPlanner` — `selectedLeg` state gates rendering between the normal trip view and a new `LegDetailPage` component. No router required. Data filtering reuses the same keyword-matching logic already in `TripDetail`, duplicated into `LegDetailPage`.

**Tech Stack:** React 18, Tailwind CSS, Leaflet via react-leaflet, lucide-react icons, existing design tokens (bark/sun/cream/leaf/lake palette).

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| Create | `src/components/roadtrip/LegDetailPage.jsx` | Full leg detail view — header, map, drive info, tabbed resources |
| Modify | `src/components/roadtrip/TripDetail.jsx` | Accept + pass `onMoreInfo` prop; add "More Info" button to `ItineraryDay` |
| Modify | `src/pages/RoadTripPlanner.jsx` | Own `selectedLeg` state; gate render between normal view and `LegDetailPage` |

---

## Task 1: Wire selectedLeg state into RoadTripPlanner

**Files:**
- Modify: `src/pages/RoadTripPlanner.jsx`

- [ ] **Step 1: Add selectedLeg state**

Open `src/pages/RoadTripPlanner.jsx`. Add state after the existing `activeSeason` state:

```jsx
const [selectedLeg, setSelectedLeg] = useState(null);
// shape: { tripId: string, dayNumber: number } | null
```

- [ ] **Step 2: Add handleMoreInfo function**

Add this function inside the component, after `handleSelectTrip`:

```jsx
function handleMoreInfo(dayNumber) {
  setSelectedLeg({ tripId: selectedTripId, dayNumber });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function handleBackFromLeg() {
  setSelectedLeg(null);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
```

- [ ] **Step 3: Gate the render — add LegDetailPage placeholder**

At the top of the JSX returned by `RoadTripPlanner`, wrap existing content in a conditional. First add a temporary placeholder so the gate works before `LegDetailPage` exists:

```jsx
// Temporary — replace in Task 3
if (selectedLeg) {
  const legTrip = TRIPS.find(t => t.id === selectedLeg.tripId);
  const legDay = legTrip?.route.itinerary.find(d => d.day === selectedLeg.dayNumber);
  return (
    <div className="p-8 text-bark-700">
      <button onClick={handleBackFromLeg} className="text-sm text-sun-700 font-semibold mb-4 flex items-center gap-1">
        ← Back
      </button>
      <h2 className="font-display text-2xl font-bold">Day {legDay?.day}: {legDay?.title}</h2>
      <p className="text-sm text-bark-500 mt-2">LegDetailPage coming in Task 3…</p>
    </div>
  );
}
```

Place this block before the `return (` of the main JSX.

- [ ] **Step 4: Pass onMoreInfo to TripDetail**

Find the `<TripDetail>` render in `RoadTripPlanner.jsx` (around line 149):

```jsx
<TripDetail trip={selectedTrip} activeSeason={activeSeason} />
```

Change to:

```jsx
<TripDetail trip={selectedTrip} activeSeason={activeSeason} onMoreInfo={handleMoreInfo} />
```

- [ ] **Step 5: Verify in browser**

Dev server runs at `http://localhost:5999`. Select any trip, open any day card. The "More Info" button doesn't exist yet — that's fine. The gate and state are wired. No errors in console expected.

- [ ] **Step 6: Commit**

```bash
git add src/pages/RoadTripPlanner.jsx
git commit -m "feat: add selectedLeg state and page gate to RoadTripPlanner"
```

---

## Task 2: Add "More Info" button to ItineraryDay

**Files:**
- Modify: `src/components/roadtrip/TripDetail.jsx`

- [ ] **Step 1: Add onMoreInfo prop to TripDetail**

In `TripDetail.jsx`, find the `export default function TripDetail({ trip, activeSeason })` signature (line 430) and add `onMoreInfo`:

```jsx
export default function TripDetail({ trip, activeSeason, onMoreInfo }) {
```

- [ ] **Step 2: Pass onMoreInfo to each ItineraryDay**

Find where `<ItineraryDay>` is rendered (around line 611):

```jsx
{trip.route.itinerary.map(day => (
  <ItineraryDay
    key={day.day}
    day={day}
    attractionFilter={attractionFilter}
    legMapPoints={(displayedTrip.route.mapPoints || []).filter(p => p.day === day.day)}
  />
))}
```

Add the prop:

```jsx
{trip.route.itinerary.map(day => (
  <ItineraryDay
    key={day.day}
    day={day}
    attractionFilter={attractionFilter}
    legMapPoints={(displayedTrip.route.mapPoints || []).filter(p => p.day === day.day)}
    onMoreInfo={onMoreInfo}
  />
))}
```

- [ ] **Step 3: Add onMoreInfo prop to ItineraryDay component**

Find the `function ItineraryDay({ day, legMapPoints, attractionFilter })` signature (line 146) and add the prop:

```jsx
function ItineraryDay({ day, legMapPoints, attractionFilter, onMoreInfo }) {
```

- [ ] **Step 4: Add More Info button inside the expanded panel**

Find the closing of the expanded panel in `ItineraryDay` — the `</div>` that closes `<div className="border-t border-stone-100 bg-white">` (around line 257). Add the button just before that closing `</div>`:

```jsx
{open && (
  <div className="border-t border-stone-100 bg-white">
    <div className={`${hasMap ? 'grid lg:grid-cols-2 gap-0' : ''}`}>
      {/* ... existing left and right panels ... */}
    </div>
    {/* More Info button */}
    {onMoreInfo && (
      <div className="px-4 py-3 border-t border-stone-100 flex justify-end">
        <button
          onClick={() => onMoreInfo(day.day)}
          className="inline-flex items-center gap-2 bg-sun-500 hover:bg-sun-600 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors shadow-sm"
        >
          More Info →
        </button>
      </div>
    )}
  </div>
)}
```

The exact insertion point is after the `</div>` that closes the `grid` div but before the `</div>` that closes `border-t border-stone-100 bg-white`. Reference: the structure is:

```
{open && (
  <div className="border-t border-stone-100 bg-white">   ← outer
    <div className={grid...}>                              ← grid
      {/* left panel */}
      {/* right map */}
    </div>                                                 ← close grid
    ← INSERT MORE INFO BUTTON HERE
  </div>                                                   ← close outer
)}
```

- [ ] **Step 5: Verify in browser**

At `http://localhost:5999`: select a trip, expand any day card. A gold "More Info →" button appears at the bottom right of the expanded card. Clicking it shows the placeholder page from Task 1 with the day title. Back button returns to the trip. No console errors.

- [ ] **Step 6: Commit**

```bash
git add src/components/roadtrip/TripDetail.jsx
git commit -m "feat: add More Info button to ItineraryDay cards"
```

---

## Task 3: Create LegDetailPage — header and map

**Files:**
- Create: `src/components/roadtrip/LegDetailPage.jsx`

- [ ] **Step 1: Create the file with header**

Create `src/components/roadtrip/LegDetailPage.jsx`:

```jsx
import { ChevronLeft, MapPin, Clock, Car } from 'lucide-react';
import TripRouteMap from './TripRouteMap';

export default function LegDetailPage({ trip, day, onBack }) {
  const legMapPoints = (trip.route.mapPoints || []).filter(p => p.day === day.day);

  const legTrip = {
    colorFrom: trip.colorFrom,
    route: {
      waypoints: day.legWaypoints && day.legWaypoints.length > 1
        ? day.legWaypoints
        : legMapPoints.map(p => p.coords),
      stops: [],
      mapPoints: legMapPoints,
    },
  };

  const hasMap = (day.legWaypoints && day.legWaypoints.length > 1) || legMapPoints.length > 0;

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

      {/* Day title */}
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
      {hasMap && (
        <div className="rounded-2xl overflow-hidden shadow-card" style={{ height: '450px' }}>
          <TripRouteMap trip={legTrip} height="450px" />
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Wire LegDetailPage into RoadTripPlanner**

Open `src/pages/RoadTripPlanner.jsx`. Add the import at the top:

```jsx
import LegDetailPage from '@/components/roadtrip/LegDetailPage';
```

Replace the temporary placeholder block from Task 1 with the real component:

```jsx
if (selectedLeg) {
  const legTrip = TRIPS.find(t => t.id === selectedLeg.tripId);
  const legDay = legTrip?.route.itinerary.find(d => d.day === selectedLeg.dayNumber);
  if (legTrip && legDay) {
    return (
      <LegDetailPage
        trip={legTrip}
        day={legDay}
        onBack={handleBackFromLeg}
      />
    );
  }
}
```

- [ ] **Step 3: Verify in browser**

At `http://localhost:5999`: click "More Info →" on any expanded day card. You should see:
- A back button in the top left
- A colored header card with day number, leg title, and description
- A Leaflet map showing the leg route and markers
- No console errors (especially no Leaflet container errors)

- [ ] **Step 4: Commit**

```bash
git add src/components/roadtrip/LegDetailPage.jsx src/pages/RoadTripPlanner.jsx
git commit -m "feat: create LegDetailPage with header and leg map"
```

---

## Task 4: Add drive info to LegDetailPage

**Files:**
- Modify: `src/components/roadtrip/LegDetailPage.jsx`

- [ ] **Step 1: Add drive segments section**

In `LegDetailPage.jsx`, add the drive sections after the map section. Import `Car` is already included. Add this block inside the `<div className="space-y-6">` after the map:

```jsx
{/* Drive segments */}
{day.driveSegments && day.driveSegments.length > 0 && (
  <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-card space-y-3">
    <h3 className="font-display font-semibold text-bark-500 text-xs uppercase tracking-widest flex items-center gap-2">
      <span className="w-4 h-0.5 bg-sun-400 inline-block rounded-full" />
      Travel Segments
    </h3>
    <div className="space-y-2">
      {day.driveSegments.map((segment, i) => (
        <div key={`${segment.from}-${segment.to}-${i}`} className="rounded-lg border border-leaf-100 bg-leaf-50 px-3 py-2">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-xs font-semibold text-bark-700">{segment.from} → {segment.to}</span>
            <span className="text-xs font-bold text-leaf-700">{segment.distance} · {segment.time}</span>
          </div>
          {segment.note && (
            <p className="mt-1 text-xs text-bark-500 leading-snug">{segment.note}</p>
          )}
        </div>
      ))}
    </div>
  </div>
)}

{/* Drive steps */}
{day.driveSteps && day.driveSteps.length > 0 && (
  <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-card space-y-3">
    <h3 className="font-display font-semibold text-bark-500 text-xs uppercase tracking-widest flex items-center gap-2">
      <Car className="w-3.5 h-3.5 text-sun-500" />
      Driving Directions
    </h3>
    <ol className="space-y-1.5">
      {day.driveSteps.map((step, i) => (
        <li key={i} className="flex gap-2.5 text-xs text-bark-600">
          <span className="mt-0.5 w-4 h-4 rounded-full bg-sun-100 border border-sun-300 text-sun-700 font-bold text-[10px] flex items-center justify-center flex-shrink-0">
            {i + 1}
          </span>
          <span className="leading-snug">{step}</span>
        </li>
      ))}
    </ol>
  </div>
)}
```

- [ ] **Step 2: Verify in browser**

Click "More Info →" on a day that has `driveSteps` (Day 1 of Tobermory has 4 drive steps). Below the map you should see a "Driving Directions" card with numbered steps. A day with `driveSegments` shows those too.

- [ ] **Step 3: Commit**

```bash
git add src/components/roadtrip/LegDetailPage.jsx
git commit -m "feat: add drive segments and steps to LegDetailPage"
```

---

## Task 5: Add tabbed resources to LegDetailPage

**Files:**
- Modify: `src/components/roadtrip/LegDetailPage.jsx`

- [ ] **Step 1: Add imports**

At the top of `LegDetailPage.jsx`, add to the existing import block:

```jsx
import { ChevronLeft, MapPin, Car, Footprints, BedDouble, Utensils } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import TripRouteMap from './TripRouteMap';

// Import card components — these are defined inside TripDetail.jsx.
// Since they are not exported, copy the filtering logic here and use
// TripDetail's exported default only for layout. The cards themselves
// must be re-implemented below (see Step 2).
```

**Note:** `POICard`, `TrailCard`, `RestaurantCard`, `LodgingCard` are defined inside `TripDetail.jsx` but not exported. You have two options:

- **Option A (recommended):** Export them from `TripDetail.jsx` and import here.
- **Option B:** Re-implement lightweight versions inside `LegDetailPage.jsx`.

Use **Option A** — it's less duplication.

- [ ] **Step 2: Export card components from TripDetail.jsx**

Open `src/components/roadtrip/TripDetail.jsx`. Find these four function declarations and add `export` to each:

```jsx
export function POICard({ poi }) {
export function TrailCard({ trail }) {
export function RestaurantCard({ restaurant }) {
export function LodgingCard({ lodging }) {
```

The default export (`export default function TripDetail`) stays unchanged. The helper functions `makeGoogleMapsSearchLink` and `withContactOverride` are defined in the same file and used by the cards via closure — do NOT export them; they don't need to be imported anywhere else.

- [ ] **Step 3: Add filtering logic to LegDetailPage**

In `LegDetailPage.jsx`, add the filtering logic inside the component function, before the `return`:

```jsx
// Filtering — same logic as TripDetail
const legNumber = day.day;

const normalize = value =>
  (value || '').toString().toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

const itemMatchesLeg = (item, keywords) => {
  const haystack = [
    item.name, item.location, item.address, item.description,
    item.cuisine, item.type, item.tags && item.tags.join(' '),
  ].filter(Boolean).join(' ');
  return keywords.some(k => normalize(haystack).includes(normalize(k)));
};

const legKeywords = (() => {
  const fromTo = day.title.split(/→|to|-/i).map(s => s.trim()).filter(Boolean);
  const stopNames = trip.route.stops.map(s => s.name);
  return [...fromTo, ...stopNames];
})();

const filterByLeg = item => {
  if (item?.day === legNumber) return true;
  if (legKeywords.length === 0) return false;
  return itemMatchesLeg(item, legKeywords);
};

const legPoi         = (trip.poi         || []).filter(filterByLeg);
const legTrails      = (trip.trails      || []).filter(filterByLeg);
const legRestaurants = (trip.restaurants || []).filter(filterByLeg);
const legLodging     = (trip.lodging     || []).filter(filterByLeg);
const hasRestaurants = Array.isArray(trip.restaurants) && trip.restaurants.length > 0;
```

- [ ] **Step 4: Add imports for card components**

Replace the import block at the top of `LegDetailPage.jsx` with:

```jsx
import { ChevronLeft, Car, MapPin, Footprints, BedDouble, Utensils } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import TripRouteMap from './TripRouteMap';
import {
  POICard,
  TrailCard,
  RestaurantCard,
  LodgingCard,
} from './TripDetail';
```

- [ ] **Step 5: Add tabs section to the JSX**

Add this block at the end of the `<div className="space-y-6">`, after the drive steps section:

```jsx
{/* Tabbed resources */}
<Tabs defaultValue="poi">
  <TabsList className={`grid w-full ${hasRestaurants ? 'grid-cols-4' : 'grid-cols-3'}`}>
    <TabsTrigger value="poi" className="flex items-center gap-1.5 text-xs">
      <MapPin className="w-3.5 h-3.5" />
      <span className="hidden sm:inline">Points of Interest</span>
      <span className="sm:hidden">POI</span>
    </TabsTrigger>
    <TabsTrigger value="trails" className="flex items-center gap-1.5 text-xs">
      <Footprints className="w-3.5 h-3.5" />
      Trails
    </TabsTrigger>
    {hasRestaurants && (
      <TabsTrigger value="restaurants" className="flex items-center gap-1.5 text-xs">
        <Utensils className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Restaurants</span>
        <span className="sm:hidden">Eat</span>
      </TabsTrigger>
    )}
    <TabsTrigger value="lodging" className="flex items-center gap-1.5 text-xs">
      <BedDouble className="w-3.5 h-3.5" />
      Lodging
    </TabsTrigger>
  </TabsList>

  <TabsContent value="poi" className="mt-4">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {legPoi.length > 0
        ? legPoi.map(p => (
            <POICard key={`${p.sourceId || p.name}-${p.day || 'all'}-${p.location || ''}`} poi={p} />
          ))
        : <p className="text-sm text-bark-500">No points of interest for this leg.</p>}
    </div>
  </TabsContent>

  <TabsContent value="trails" className="mt-4">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {legTrails.length > 0
        ? legTrails.map(t => (
            <TrailCard key={`${t.name}-${t.day || 'all'}-${t.location || ''}`} trail={t} />
          ))
        : <p className="text-sm text-bark-500">No trails for this leg.</p>}
    </div>
  </TabsContent>

  {hasRestaurants && (
    <TabsContent value="restaurants" className="mt-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {legRestaurants.length > 0
          ? legRestaurants.map(r => (
              <RestaurantCard key={`${r.name}-${r.day || 'all'}-${r.location || ''}`} restaurant={r} />
            ))
          : <p className="text-sm text-bark-500">No restaurants for this leg.</p>}
      </div>
    </TabsContent>
  )}

  <TabsContent value="lodging" className="mt-4">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {legLodging.length > 0
        ? legLodging.map(l => (
            <LodgingCard key={`${l.name}-${l.day || 'all'}-${l.location || ''}`} lodging={l} />
          ))
        : <p className="text-sm text-bark-500">No lodging for this leg.</p>}
    </div>
  </TabsContent>
</Tabs>
```

- [ ] **Step 6: Verify in browser**

At `http://localhost:5999`:
1. Select Tobermory trip → expand Day 1 → click "More Info →"
2. Leg page loads: header, map, drive directions, tabs
3. POI tab shows items filtered to Day 1 (or keyword-matched to Toronto/Owen Sound)
4. Trails, Lodging tabs show filtered items or empty state messages
5. Back button returns to the trip detail, scrolled to top
6. Try another trip with restaurants — Restaurants tab should appear

No console errors.

- [ ] **Step 7: Commit**

```bash
git add src/components/roadtrip/LegDetailPage.jsx src/components/roadtrip/TripDetail.jsx
git commit -m "feat: add tabbed POI/trails/restaurants/lodging to LegDetailPage"
```

---

## Task 6: Final polish and verification

**Files:**
- Modify: `src/components/roadtrip/LegDetailPage.jsx` (minor tweaks if needed)

- [ ] **Step 1: Check all trips**

At `http://localhost:5999`, test every trip's every day card:
- All "More Info →" buttons present when card is expanded
- All leg pages load without errors
- Map renders correctly (some days may have no `legWaypoints` — those show mapPoints only)
- Days with no driveSegments or driveSteps skip those sections cleanly
- Tabs with zero items show the empty state text, not errors

- [ ] **Step 2: Check mobile layout**

In browser devtools, switch to a 375px wide viewport. Verify:
- Header back button and emoji fit on one line
- Day title card doesn't overflow
- Map fills width at 450px tall
- Tab labels use short form (`POI`, `Eat`) on small screens
- Cards stack to single column

- [ ] **Step 3: Final commit**

```bash
git add -p   # stage any polish changes only
git commit -m "feat: leg detail page — polish and mobile layout"
```

If no changes needed, skip this commit.
