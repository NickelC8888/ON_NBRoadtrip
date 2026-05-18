# Leg Detail Page — Design Spec
_Date: 2026-05-17_

## Goal

Add a "More Info" button to the bottom of each expanded itinerary day card. Clicking it opens a leg-specific detail page showing a full map, drive info, and all relevant resources (POI, trails, restaurants, lodging) filtered to that leg only.

---

## Architecture

No router is installed. Navigation is state-based.

`RoadTripPlanner` gains one new state:

```js
const [selectedLeg, setSelectedLeg] = useState(null);
// shape: { tripId: string, dayNumber: number } | null
```

When `selectedLeg` is set, `RoadTripPlanner` renders `LegDetailPage` instead of the normal trip grid + detail. Back button sets `selectedLeg` to `null` and scrolls to top.

---

## Component Changes

### `RoadTripPlanner` (`src/pages/RoadTripPlanner.jsx`)
- Add `selectedLeg` state.
- When `selectedLeg !== null`, render `<LegDetailPage>` full-screen instead of normal content.
- Pass `onMoreInfo={(dayNumber) => { setSelectedLeg({ tripId, dayNumber }); window.scrollTo({ top: 0, behavior: 'smooth' }); }}` down to `TripDetail`.

### `TripDetail` (`src/components/roadtrip/TripDetail.jsx`)
- Accept `onMoreInfo` prop.
- Pass it through to each `<ItineraryDay>`.

### `ItineraryDay` (inside `TripDetail.jsx`)
- Accept `onMoreInfo` prop.
- When expanded, render a "More Info" button at the bottom of the open panel.
- Button style: outlined, uses existing design tokens (sun/bark palette).
- `onClick`: calls `onMoreInfo(day.day)`.

### `LegDetailPage` (`src/components/roadtrip/LegDetailPage.jsx`) — new file
- Props: `trip`, `day`, `onBack`
- Self-contained page. Derives all filtered data internally.

---

## LegDetailPage Layout

```
┌─────────────────────────────────────────────────────┐
│ ← Back to [Trip Name]          [Trip Emoji + Name]  │
├─────────────────────────────────────────────────────┤
│ Day N · [Leg Title]                                 │
├─────────────────────────────────────────────────────┤
│                                                     │
│         LEAFLET MAP (~450px tall, full width)       │
│   legWaypoints as route line                        │
│   mapPoints where p.day === day.day as markers      │
│                                                     │
├─────────────────────────────────────────────────────┤
│ Drive Segments (distance · time per segment)        │
│ Driving Directions (numbered driveSteps list)       │
├─────────────────────────────────────────────────────┤
│ TABS: POI | Trails | Restaurants | Lodging          │
│ (only tabs with data are shown)                     │
│ [Filtered cards using existing card components]     │
└─────────────────────────────────────────────────────┘
```

---

## Data Filtering

Reuse the existing `filterByLeg` logic from `TripDetail`. In `LegDetailPage`:

```js
const legNumber = day.day;

const normalize = value =>
  (value || '').toString().toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

const itemMatchesLeg = (item, keywords) => {
  const haystack = [item.name, item.location, item.address, item.description,
    item.cuisine, item.type, item.tags && item.tags.join(' ')]
    .filter(Boolean).join(' ');
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

const legPoi        = (trip.poi        || []).filter(filterByLeg);
const legTrails     = (trip.trails     || []).filter(filterByLeg);
const legRestaurants= (trip.restaurants|| []).filter(filterByLeg);
const legLodging    = (trip.lodging    || []).filter(filterByLeg);
```

Map points filtered to `day.day` only (exact match, not keyword):
```js
const legMapPoints = (trip.route.mapPoints || []).filter(p => p.day === legNumber);
```

---

## Map Config

```js
const legTrip = {
  colorFrom: trip.colorFrom,
  route: {
    waypoints: day.legWaypoints || legMapPoints.map(p => p.coords),
    stops: [],
    mapPoints: legMapPoints,
  },
};
```

Passed to the existing `<TripRouteMap trip={legTrip} height="450px" />`.

---

## Tabs

Show only tabs that have data:
- POI (always shown if `legPoi.length > 0`, else show empty state message)
- Trails (same)
- Restaurants (hide tab entirely if `trip.restaurants` is empty globally, matching TripDetail behavior)
- Lodging (same)

Empty state message: `"No [type] for this leg."` — matches existing TripDetail pattern.

Reuse existing card components: `POICard`, `TrailCard`, `RestaurantCard`, `LodgingCard`.

---

## Scroll Behavior

- "More Info" click → `window.scrollTo({ top: 0, behavior: 'smooth' })` before state update.
- "Back" click → `window.scrollTo({ top: 0, behavior: 'smooth' })` before calling `onBack()`.

---

## Styling

Follow existing design tokens:
- Header: `bg-cream-100 border-b border-sun-200` sticky top bar.
- Back button: `← Back` with `ChevronLeft` icon, `text-bark-600 hover:text-sun-700`.
- Day header: `font-display font-bold text-2xl text-bark-900`.
- Map container: `rounded-2xl overflow-hidden shadow-card`.
- Tabs: reuse existing `<Tabs>` component from `@/components/ui/tabs`.
- Cards: existing grid `grid-cols-1 md:grid-cols-2 gap-4`.

---

## Out of Scope

- URL-based routing (no React Router).
- Attraction suitability filter (kids/dogs) on the leg page — can be added later.
- Print button on leg page.
