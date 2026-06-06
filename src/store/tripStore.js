// ── Keys ──────────────────────────────────────────────────────────────────────
const CUSTOM_KEY    = 'roadtrip_custom_trips';
const OVERRIDE_KEY  = 'roadtrip_trip_overrides';
const PACKING_KEY   = 'roadtrip_packing_overrides';

// ── Helpers ───────────────────────────────────────────────────────────────────
function load(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
  catch { return fallback; }
}
function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function blankSection() { return { add: [], edit: {}, delete: [] }; }
function blankOverride() {
  return {
    poi:         blankSection(),
    trails:      blankSection(),
    restaurants: blankSection(),
    lodging:     blankSection(),
    stops:       blankSection(),
    seasonTips:  null, // null = unchanged; object = full replacement
    itinerary:   null, // null = use base; array = full replacement (add/edit/delete/reorder)
  };
}

// ── Custom trips ──────────────────────────────────────────────────────────────
export function getCustomTrips()          { return load(CUSTOM_KEY, []); }
export function saveCustomTrips(trips)    { save(CUSTOM_KEY, trips); }

export function addCustomTrip(trip) {
  const trips = getCustomTrips();
  trips.push(trip);
  saveCustomTrips(trips);
}
export function updateCustomTrip(id, patch) {
  const trips = getCustomTrips().map(t => t.id === id ? { ...t, ...patch } : t);
  saveCustomTrips(trips);
}
export function deleteCustomTrip(id) {
  saveCustomTrips(getCustomTrips().filter(t => t.id !== id));
  // also clear any override that may have accumulated
  const ov = getOverrides();
  delete ov[id];
  save(OVERRIDE_KEY, ov);
}

// ── Trip overrides (for base static trips) ────────────────────────────────────
export function getOverrides() { return load(OVERRIDE_KEY, {}); }
export function getOverride(tripId) {
  return load(OVERRIDE_KEY, {})[tripId] ?? blankOverride();
}
function saveOverride(tripId, override) {
  const all = getOverrides();
  all[tripId] = override;
  save(OVERRIDE_KEY, all);
}

// section = 'poi' | 'trails' | 'restaurants' | 'lodging' | 'stops'
export function addItemToTrip(tripId, section, item) {
  const ov = getOverride(tripId);
  ov[section] = ov[section] ?? blankSection();
  ov[section].add.push(item);
  saveOverride(tripId, ov);
}

export function editItemInTrip(tripId, section, originalName, updatedItem) {
  const ov = getOverride(tripId);
  ov[section] = ov[section] ?? blankSection();
  // Also update if it was a previously-added item
  const addIdx = ov[section].add.findIndex(i => i.name === originalName);
  if (addIdx !== -1) {
    ov[section].add[addIdx] = updatedItem;
  } else {
    ov[section].edit[originalName] = updatedItem;
  }
  saveOverride(tripId, ov);
}

export function deleteItemFromTrip(tripId, section, itemName) {
  const ov = getOverride(tripId);
  ov[section] = ov[section] ?? blankSection();
  // Remove from add list if it was user-added
  ov[section].add = ov[section].add.filter(i => i.name !== itemName);
  // Remove from edit map if present
  delete ov[section].edit[itemName];
  // Mark for deletion from base data
  if (!ov[section].delete.includes(itemName)) {
    ov[section].delete.push(itemName);
  }
  saveOverride(tripId, ov);
}

export function updateItinerary(tripId, days) {
  const ov = getOverride(tripId);
  ov.itinerary = days;
  saveOverride(tripId, ov);
}

export function updateSeasonTips(tripId, tips) {
  const ov = getOverride(tripId);
  ov.seasonTips = tips;
  saveOverride(tripId, ov);
}

// ── Merge helper — apply override to a base trip ─────────────────────────────
function mergeSection(baseItems, sectionOv) {
  if (!sectionOv) return baseItems;
  const { add, edit, delete: del } = sectionOv;
  return [
    ...baseItems
      .filter(i => !del.includes(i.name))
      .map(i => (edit[i.name] ? { ...i, ...edit[i.name] } : i)),
    ...add,
  ];
}

export function applyOverride(trip, override) {
  if (!override) return trip;
  const SECTIONS = ['poi', 'trails', 'restaurants', 'lodging'];
  const result = { ...trip };
  for (const s of SECTIONS) {
    result[s] = mergeSection(trip[s] || [], override[s]);
  }
  // stops live inside route
  if (override.stops) {
    result.route = {
      ...trip.route,
      stops: mergeSection(trip.route.stops || [], override.stops),
    };
  }
  if (override.seasonTips) {
    result.seasonTips = override.seasonTips;
  }
  if (override.itinerary) {
    result.route = { ...result.route, itinerary: override.itinerary };
  }
  return result;
}

// ── Packing overrides ─────────────────────────────────────────────────────────
export function getPackingOverrides() { return load(PACKING_KEY, { added: {}, deleted: {} }); }
export function savePackingOverrides(ov) { save(PACKING_KEY, ov); }

export function addPackingItem(categoryId, itemText) {
  const ov = getPackingOverrides();
  ov.added[categoryId] = [...(ov.added[categoryId] || []), itemText];
  savePackingOverrides(ov);
}

export function deletePackingItem(categoryId, itemText) {
  const ov = getPackingOverrides();
  // Remove from added if it was a user addition
  if (ov.added[categoryId]) {
    ov.added[categoryId] = ov.added[categoryId].filter(i => i !== itemText);
  }
  // Mark base items for deletion
  ov.deleted[categoryId] = [...(ov.deleted[categoryId] || []), itemText];
  savePackingOverrides(ov);
}
