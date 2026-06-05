import { Router } from 'express';
import db from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

// GET /api/trips — return all user trip data in one shot
router.get('/', (req, res) => {
  const uid = req.user.id;

  const customTrips = db.prepare(
    'SELECT trip_id, trip_data FROM user_custom_trips WHERE user_id = ?'
  ).all(uid).map(r => JSON.parse(r.trip_data));

  const overrides = db.prepare(
    'SELECT trip_id, overrides FROM user_trip_overrides WHERE user_id = ?'
  ).all(uid).reduce((acc, r) => {
    acc[r.trip_id] = JSON.parse(r.overrides);
    return acc;
  }, {});

  const packingRow = db.prepare(
    'SELECT overrides FROM user_packing_overrides WHERE user_id = ?'
  ).get(uid);
  const packingOverrides = packingRow ? JSON.parse(packingRow.overrides) : { added: {}, deleted: {} };

  res.json({ customTrips, overrides, packingOverrides });
});

// PUT /api/trips/custom/:id — upsert a custom trip
router.put('/custom/:id', (req, res) => {
  const uid = req.user.id;
  const tripId = req.params.id;
  const tripData = JSON.stringify(req.body);

  db.prepare(`
    INSERT INTO user_custom_trips (user_id, trip_id, trip_data, updated_at)
    VALUES (?, ?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(user_id, trip_id) DO UPDATE SET
      trip_data  = excluded.trip_data,
      updated_at = CURRENT_TIMESTAMP
  `).run(uid, tripId, tripData);

  res.json({ ok: true });
});

// DELETE /api/trips/custom/:id
router.delete('/custom/:id', (req, res) => {
  db.prepare(
    'DELETE FROM user_custom_trips WHERE user_id = ? AND trip_id = ?'
  ).run(req.user.id, req.params.id);
  res.json({ ok: true });
});

// PUT /api/trips/override/:tripId — upsert override for a base trip
router.put('/override/:tripId', (req, res) => {
  const uid = req.user.id;
  const tripId = req.params.tripId;
  const overrides = JSON.stringify(req.body);

  db.prepare(`
    INSERT INTO user_trip_overrides (user_id, trip_id, overrides, updated_at)
    VALUES (?, ?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(user_id, trip_id) DO UPDATE SET
      overrides  = excluded.overrides,
      updated_at = CURRENT_TIMESTAMP
  `).run(uid, tripId, overrides);

  res.json({ ok: true });
});

// PUT /api/trips/packing — upsert packing overrides
router.put('/packing', (req, res) => {
  const uid = req.user.id;
  const overrides = JSON.stringify(req.body);

  db.prepare(`
    INSERT INTO user_packing_overrides (user_id, overrides, updated_at)
    VALUES (?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(user_id) DO UPDATE SET
      overrides  = excluded.overrides,
      updated_at = CURRENT_TIMESTAMP
  `).run(uid, overrides);

  res.json({ ok: true });
});

export default router;
