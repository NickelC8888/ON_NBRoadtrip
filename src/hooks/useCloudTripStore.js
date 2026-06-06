import { useState, useEffect, useCallback, useRef } from 'react';
import { TRIPS as BASE_TRIPS } from '@/data/roadTripData';
import {
  getCustomTrips, saveCustomTrips, addCustomTrip, updateCustomTrip, deleteCustomTrip,
  getOverrides, applyOverride,
  addItemToTrip, editItemInTrip, deleteItemFromTrip, updateSeasonTips, updateItinerary,
  getPackingOverrides, addPackingItem, deletePackingItem,
} from '@/store/tripStore';
import { api } from '@/lib/api';

function buildTrips(customTrips, overrides) {
  const base = BASE_TRIPS.map(t => applyOverride(t, overrides[t.id]));
  return [...base, ...customTrips];
}

// Debounce helper — waits `ms` after last call before executing
function useDebouncedCallback(fn, ms = 800) {
  const timer = useRef(null);
  return useCallback((...args) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => fn(...args), ms);
  }, [fn, ms]); // eslint-disable-line
}

export function useCloudTripStore(user) {
  const [customTrips,      setCustomTrips]      = useState(() => getCustomTrips());
  const [overrides,        setOverrides]        = useState(() => getOverrides());
  const [packingOverrides, setPackingOverrides] = useState(() => getPackingOverrides());
  const [cloudLoading,     setCloudLoading]     = useState(false);
  const [synced,           setSynced]           = useState(false);
  const [migrationPending, setMigrationPending] = useState(false);

  const trips = buildTrips(customTrips, overrides);

  // ── Cloud sync helpers ──────────────────────────────────────────────────────
  const pushCustomTrip = useCallback(async (tripId, tripData) => {
    if (!user) return;
    await api(`/api/trips/custom/${tripId}`, { method: 'PUT', body: tripData }).catch(console.error);
    setSynced(true);
  }, [user]);

  const deleteCloudTrip = useCallback(async (tripId) => {
    if (!user) return;
    await api(`/api/trips/custom/${tripId}`, { method: 'DELETE' }).catch(console.error);
  }, [user]);

  const pushOverride = useDebouncedCallback(async (tripId, overrideData) => {
    if (!user) return;
    await api(`/api/trips/override/${tripId}`, { method: 'PUT', body: overrideData }).catch(console.error);
    setSynced(true);
  }, 1000);

  const pushPacking = useDebouncedCallback(async (packingData) => {
    if (!user) return;
    await api('/api/trips/packing', { method: 'PUT', body: packingData }).catch(console.error);
    setSynced(true);
  }, 1000);

  // ── Load from cloud on sign-in ──────────────────────────────────────────────
  useEffect(() => {
    if (!user) return;

    setCloudLoading(true);
    api('/api/trips')
      .then(({ customTrips: cloudCustom, overrides: cloudOverrides, packingOverrides: cloudPacking }) => {
        // Check if localStorage has data that the cloud doesn't
        const localCustom = getCustomTrips();
        const localOverrides = getOverrides();
        const hasLocalData = localCustom.length > 0 || Object.keys(localOverrides).length > 0;
        const hasCloudData = cloudCustom.length > 0 || Object.keys(cloudOverrides).length > 0;

        if (hasLocalData && !hasCloudData) {
          // Offer migration
          setMigrationPending(true);
        } else {
          // Trust cloud as source of truth
          saveCustomTrips(cloudCustom);
          setCustomTrips(cloudCustom);
          // Merge overrides into localStorage cache
          import('@/store/tripStore').then(({ save: _ }) => {
            localStorage.setItem('roadtrip_trip_overrides', JSON.stringify(cloudOverrides));
            localStorage.setItem('roadtrip_packing_overrides', JSON.stringify(cloudPacking));
          });
          setOverrides(cloudOverrides);
          setPackingOverrides(cloudPacking);
          setSynced(true);
        }
      })
      .catch(console.error)
      .finally(() => setCloudLoading(false));
  }, [user?.id]); // eslint-disable-line

  // ── Migration: push localStorage → cloud ──────────────────────────────────
  const migrateToCloud = useCallback(async () => {
    const localCustom = getCustomTrips();
    const localOverrides = getOverrides();
    const localPacking = getPackingOverrides();

    await Promise.all([
      ...localCustom.map(t => api(`/api/trips/custom/${t.id}`, { method: 'PUT', body: t })),
      ...Object.entries(localOverrides).map(([id, ov]) =>
        api(`/api/trips/override/${id}`, { method: 'PUT', body: ov })
      ),
      api('/api/trips/packing', { method: 'PUT', body: localPacking }),
    ]).catch(console.error);

    setSynced(true);
    setMigrationPending(false);
  }, []);

  const dismissMigration = useCallback(() => {
    // Use cloud (empty) as source of truth — discard local
    saveCustomTrips([]);
    setCustomTrips([]);
    setOverrides({});
    setPackingOverrides({ added: {}, deleted: {} });
    setMigrationPending(false);
  }, []);

  // ── Custom trip CRUD ────────────────────────────────────────────────────────
  const createTrip = useCallback(async (trip) => {
    addCustomTrip(trip);
    const updated = getCustomTrips();
    setCustomTrips(updated);
    await pushCustomTrip(trip.id, trip);
  }, [pushCustomTrip]);

  const editTrip = useCallback(async (id, patch) => {
    updateCustomTrip(id, patch);
    const updated = getCustomTrips();
    setCustomTrips(updated);
    const trip = updated.find(t => t.id === id);
    if (trip) await pushCustomTrip(id, trip);
  }, [pushCustomTrip]);

  const removeTrip = useCallback(async (id) => {
    deleteCustomTrip(id);
    setCustomTrips(getCustomTrips());
    setOverrides(getOverrides());
    await deleteCloudTrip(id);
  }, [deleteCloudTrip]);

  // ── Item CRUD ───────────────────────────────────────────────────────────────
  const addItem = useCallback(async (tripId, section, item) => {
    const isCustom = getCustomTrips().some(t => t.id === tripId);
    if (isCustom) {
      const all = getCustomTrips().map(t =>
        t.id !== tripId ? t : { ...t, [section]: [...(t[section] || []), item] }
      );
      saveCustomTrips(all);
      setCustomTrips(all);
      const trip = all.find(t => t.id === tripId);
      if (trip) await pushCustomTrip(tripId, trip);
    } else {
      addItemToTrip(tripId, section, item);
      const ov = getOverrides();
      setOverrides(ov);
      pushOverride(tripId, ov[tripId]);
    }
  }, [pushCustomTrip, pushOverride]);

  const editItem = useCallback(async (tripId, section, originalName, updatedItem) => {
    const isCustom = getCustomTrips().some(t => t.id === tripId);
    if (isCustom) {
      const all = getCustomTrips().map(t => {
        if (t.id !== tripId) return t;
        return { ...t, [section]: (t[section] || []).map(i => i.name === originalName ? { ...i, ...updatedItem } : i) };
      });
      saveCustomTrips(all);
      setCustomTrips(all);
      const trip = all.find(t => t.id === tripId);
      if (trip) await pushCustomTrip(tripId, trip);
    } else {
      editItemInTrip(tripId, section, originalName, updatedItem);
      const ov = getOverrides();
      setOverrides(ov);
      pushOverride(tripId, ov[tripId]);
    }
  }, [pushCustomTrip, pushOverride]);

  const deleteItem = useCallback(async (tripId, section, itemName) => {
    const isCustom = getCustomTrips().some(t => t.id === tripId);
    if (isCustom) {
      const all = getCustomTrips().map(t =>
        t.id !== tripId ? t : { ...t, [section]: (t[section] || []).filter(i => i.name !== itemName) }
      );
      saveCustomTrips(all);
      setCustomTrips(all);
      const trip = all.find(t => t.id === tripId);
      if (trip) await pushCustomTrip(tripId, trip);
    } else {
      deleteItemFromTrip(tripId, section, itemName);
      const ov = getOverrides();
      setOverrides(ov);
      pushOverride(tripId, ov[tripId]);
    }
  }, [pushCustomTrip, pushOverride]);

  const saveTips = useCallback(async (tripId, tipData) => {
    const isCustom = getCustomTrips().some(t => t.id === tripId);
    if (isCustom) {
      updateCustomTrip(tripId, { seasonTips: tipData });
      const updated = getCustomTrips();
      setCustomTrips(updated);
      const trip = updated.find(t => t.id === tripId);
      if (trip) await pushCustomTrip(tripId, trip);
    } else {
      updateSeasonTips(tripId, tipData);
      const ov = getOverrides();
      setOverrides(ov);
      pushOverride(tripId, ov[tripId]);
    }
  }, [pushCustomTrip, pushOverride]);

  // ── Itinerary helpers ───────────────────────────────────────────────────────
  function getCurrentItinerary(tripId) {
    const custom = getCustomTrips().find(t => t.id === tripId);
    if (custom) return custom.route?.itinerary || [];
    const base = BASE_TRIPS.find(t => t.id === tripId);
    const ov = getOverrides()[tripId];
    return ov?.itinerary ?? (base?.route?.itinerary || []);
  }

  async function applyItineraryChange(tripId, newDays) {
    const isCustom = getCustomTrips().some(t => t.id === tripId);
    if (isCustom) {
      const all = getCustomTrips().map(t =>
        t.id !== tripId ? t : { ...t, route: { ...t.route, itinerary: newDays } }
      );
      saveCustomTrips(all);
      setCustomTrips(all);
      const trip = all.find(t => t.id === tripId);
      if (trip) await pushCustomTrip(tripId, trip);
    } else {
      updateItinerary(tripId, newDays);
      const ov = getOverrides();
      setOverrides(ov);
      pushOverride(tripId, ov[tripId]);
    }
  }

  const addDay = useCallback(async (tripId, dayData) => {
    const current = getCurrentItinerary(tripId);
    const nextNum = current.length > 0 ? Math.max(...current.map(d => d.day)) + 1 : 1;
    const newDay = { day: nextNum, highlights: [], ...dayData };
    await applyItineraryChange(tripId, [...current, newDay]);
  }, [pushCustomTrip, pushOverride]); // eslint-disable-line

  const editDay = useCallback(async (tripId, dayNumber, dayData) => {
    const current = getCurrentItinerary(tripId);
    const newDays = current.map(d => d.day === dayNumber ? { ...d, ...dayData } : d);
    await applyItineraryChange(tripId, newDays);
  }, [pushCustomTrip, pushOverride]); // eslint-disable-line

  const deleteDay = useCallback(async (tripId, dayNumber) => {
    const current = getCurrentItinerary(tripId);
    await applyItineraryChange(tripId, current.filter(d => d.day !== dayNumber));
  }, [pushCustomTrip, pushOverride]); // eslint-disable-line

  const reorderDays = useCallback(async (tripId, newDays) => {
    await applyItineraryChange(tripId, newDays);
  }, [pushCustomTrip, pushOverride]); // eslint-disable-line

  // ── Packing ─────────────────────────────────────────────────────────────────
  const addPacking = useCallback(async (categoryId, itemText) => {
    addPackingItem(categoryId, itemText);
    const pov = getPackingOverrides();
    setPackingOverrides(pov);
    pushPacking(pov);
  }, [pushPacking]);

  const deletePacking = useCallback(async (categoryId, itemText) => {
    deletePackingItem(categoryId, itemText);
    const pov = getPackingOverrides();
    setPackingOverrides(pov);
    pushPacking(pov);
  }, [pushPacking]);

  return {
    trips,
    customTripIds: customTrips.map(t => t.id),
    packingOverrides,
    cloudLoading,
    synced,
    migrationPending,
    migrateToCloud,
    dismissMigration,
    createTrip, editTrip, removeTrip,
    addItem, editItem, deleteItem, saveTips,
    addDay, editDay, deleteDay, reorderDays,
    addPacking, deletePacking,
  };
}
