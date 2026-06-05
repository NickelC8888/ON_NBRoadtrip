import { useState, useCallback } from 'react';
import { TRIPS as BASE_TRIPS } from '@/data/roadTripData';
import {
  getCustomTrips, saveCustomTrips, addCustomTrip, updateCustomTrip, deleteCustomTrip,
  getOverrides, applyOverride,
  addItemToTrip, editItemInTrip, deleteItemFromTrip, updateSeasonTips,
  getPackingOverrides, addPackingItem, deletePackingItem,
} from '@/store/tripStore';

function buildTrips(customTrips, overrides) {
  const base = BASE_TRIPS.map(t => applyOverride(t, overrides[t.id]));
  return [...base, ...customTrips];
}

export function useTripStore() {
  const [customTrips,      setCustomTrips]      = useState(() => getCustomTrips());
  const [overrides,        setOverrides]        = useState(() => getOverrides());
  const [packingOverrides, setPackingOverrides] = useState(() => getPackingOverrides());

  const trips = buildTrips(customTrips, overrides);

  // ── Custom trip CRUD ────────────────────────────────────────────────────────
  const createTrip = useCallback(trip => {
    addCustomTrip(trip);
    setCustomTrips(getCustomTrips());
  }, []);

  const editTrip = useCallback((id, patch) => {
    updateCustomTrip(id, patch);
    setCustomTrips(getCustomTrips());
  }, []);

  const removeTrip = useCallback(id => {
    deleteCustomTrip(id);
    setCustomTrips(getCustomTrips());
    setOverrides(getOverrides());
  }, []);

  // ── Item CRUD (works on base trips via overrides, custom trips directly) ────
  const addItem = useCallback((tripId, section, item) => {
    const isCustom = getCustomTrips().some(t => t.id === tripId);
    if (isCustom) {
      const all = getCustomTrips().map(t =>
        t.id !== tripId ? t : { ...t, [section]: [...(t[section] || []), item] }
      );
      saveCustomTrips(all);
      setCustomTrips(all);
    } else {
      addItemToTrip(tripId, section, item);
      setOverrides(getOverrides());
    }
  }, []);

  const editItem = useCallback((tripId, section, originalName, updatedItem) => {
    const isCustom = getCustomTrips().some(t => t.id === tripId);
    if (isCustom) {
      const all = getCustomTrips().map(t => {
        if (t.id !== tripId) return t;
        return {
          ...t,
          [section]: (t[section] || []).map(i =>
            i.name === originalName ? { ...i, ...updatedItem } : i
          ),
        };
      });
      saveCustomTrips(all);
      setCustomTrips(all);
    } else {
      editItemInTrip(tripId, section, originalName, updatedItem);
      setOverrides(getOverrides());
    }
  }, []);

  const deleteItem = useCallback((tripId, section, itemName) => {
    const isCustom = getCustomTrips().some(t => t.id === tripId);
    if (isCustom) {
      const all = getCustomTrips().map(t =>
        t.id !== tripId ? t : { ...t, [section]: (t[section] || []).filter(i => i.name !== itemName) }
      );
      saveCustomTrips(all);
      setCustomTrips(all);
    } else {
      deleteItemFromTrip(tripId, section, itemName);
      setOverrides(getOverrides());
    }
  }, []);

  const saveTips = useCallback((tripId, tips) => {
    const isCustom = getCustomTrips().some(t => t.id === tripId);
    if (isCustom) {
      updateCustomTrip(tripId, { seasonTips: tips });
      setCustomTrips(getCustomTrips());
    } else {
      updateSeasonTips(tripId, tips);
      setOverrides(getOverrides());
    }
  }, []);

  // ── Packing list ────────────────────────────────────────────────────────────
  const addPacking = useCallback((categoryId, itemText) => {
    addPackingItem(categoryId, itemText);
    setPackingOverrides(getPackingOverrides());
  }, []);

  const deletePacking = useCallback((categoryId, itemText) => {
    deletePackingItem(categoryId, itemText);
    setPackingOverrides(getPackingOverrides());
  }, []);

  return {
    trips,
    customTripIds: customTrips.map(t => t.id),
    packingOverrides,
    createTrip,
    editTrip,
    removeTrip,
    addItem,
    editItem,
    deleteItem,
    saveTips,
    addPacking,
    deletePacking,
  };
}
