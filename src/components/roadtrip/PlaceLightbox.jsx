import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronLeft, ChevronRight, Star, MapPin, Phone, Globe, Clock } from 'lucide-react';

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

// ── inner content (rendered via portal into document.body) ────────────────────
function LightboxContent({ item, onClose }) {
  const [photos,  setPhotos]  = useState([]);
  const [details, setDetails] = useState(null);
  const [current, setCurrent] = useState(0);
  const [status,  setStatus]  = useState('loading'); // loading | ready | fallback

  const query = `${item.name || ''} ${item.address || item.location || ''}`.trim();

  // ── Google Places lookup ───────────────────────────────────────────────────
  useEffect(() => {
    let dead  = false;
    let timer = null;
    setPhotos([]); setDetails(null); setCurrent(0); setStatus('loading');

    const run = () => {
      if (dead) return;
      if (!window.google?.maps?.places) {
        timer = setTimeout(run, 500);
        return;
      }
      try {
        // Pass a plain (not-appended) div — Places uses it for attribution
        // attribution container; attaching to body causes StrictMode double-run issues
        const svc = new window.google.maps.places.PlacesService(document.createElement('div'));

        svc.findPlaceFromText(
          {
            input: query,
            inputType: 'textQuery',
            fields: ['place_id', 'photos', 'name', 'formatted_address', 'rating', 'user_ratings_total'],
          },
          (results, st) => {
            if (dead) return;
            if (st === 'OK' && results?.[0]) {
              const p    = results[0];
              const urls = (p.photos || []).slice(0, 10).map(ph => ph.getUrl({ maxWidth: 1200 }));
              setPhotos(urls);
              setDetails({
                rating: p.rating,
                user_ratings_total: p.user_ratings_total,
                formatted_address: p.formatted_address,
              });
              setStatus(urls.length > 0 ? 'ready' : 'fallback');

              if (p.place_id) {
                svc.getDetails(
                  { placeId: p.place_id, fields: ['opening_hours', 'formatted_phone_number', 'website'] },
                  (d, ds) => {
                    if (!dead && ds === 'OK' && d) {
                      setDetails(prev => ({
                        ...prev,
                        opening_hours:          d.opening_hours,
                        formatted_phone_number: d.formatted_phone_number,
                        website:                d.website,
                      }));
                    }
                  }
                );
              }
            } else {
              setStatus('fallback');
            }
          }
        );
      } catch (err) {
        console.error('[PlaceLightbox] PlacesService error:', err);
        setStatus('fallback');
      }
    };

    run();
    return () => { dead = true; if (timer) clearTimeout(timer); };
  }, [query]); // eslint-disable-line

  // ── keyboard nav + scroll lock ─────────────────────────────────────────────
  useEffect(() => {
    const onKey = e => {
      if (e.key === 'Escape')     onClose();
      if (e.key === 'ArrowLeft')  setCurrent(c => Math.max(0, c - 1));
      if (e.key === 'ArrowRight') setCurrent(c => Math.min(photos.length - 1, c + 1));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, photos.length]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  const prev = () => setCurrent(c => Math.max(0, c - 1));
  const next = () => setCurrent(c => Math.min(photos.length - 1, c + 1));

  const gmUrl  = item.googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
  const svLoc  = item.coords
    ? `${item.coords[0]},${item.coords[1]}`
    : encodeURIComponent(item.address || item.name || '');
  const svSrc  = `https://maps.googleapis.com/maps/api/streetview?size=800x500&location=${svLoc}&fov=90&key=${API_KEY}`;

  return (
    /* ── Backdrop — use inline style to guarantee visibility regardless of Tailwind purge ── */
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 99999,
        backgroundColor: 'rgba(0,0,0,0.82)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '12px',
      }}
      onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* ── Dialog panel ── */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: 16,
          boxShadow: '0 24px 64px rgba(0,0,0,0.45)',
          width: '100%', maxWidth: 672,
          maxHeight: '92vh',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
        }}
        onMouseDown={e => e.stopPropagation()}
      >

        {/* Header */}
        <div className="flex items-start justify-between px-5 py-3.5 border-b border-stone-100 flex-shrink-0">
          <div className="min-w-0 flex-1 pr-3">
            <h2 className="font-display font-bold text-bark-900 text-base leading-snug truncate">
              {item.name}
            </h2>
            {(item.address || item.location) && (
              <p className="text-xs text-bark-400 mt-0.5 truncate">{item.address || item.location}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full hover:bg-stone-100 text-bark-400 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Photo area */}
        <div
          style={{ position: 'relative', backgroundColor: '#1c1917', flexShrink: 0, height: 300, overflow: 'hidden' }}
        >
          {status === 'loading' && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-stone-400 text-sm animate-pulse">Loading photos…</span>
            </div>
          )}

          {status === 'ready' && photos.length > 0 && (
            <>
              <img
                key={current}
                src={photos[current]}
                alt={`${item.name} — photo ${current + 1}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover', userSelect: 'none',
                  cursor: photos.length > 1 ? 'pointer' : 'default' }}
                draggable={false}
                onClick={e => {
                  const r = e.currentTarget.getBoundingClientRect();
                  (e.clientX - r.left < r.width / 2) ? prev() : next();
                }}
              />
              {photos.length > 1 && (
                <>
                  <button
                    onClick={prev} disabled={current === 0}
                    style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)',
                      width: 36, height: 36, borderRadius: '50%', background: 'rgba(0,0,0,0.55)',
                      border: 'none', cursor: 'pointer', color: 'white',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      opacity: current === 0 ? 0.3 : 1, transition: 'opacity .15s' }}
                  >
                    <ChevronLeft style={{ width: 20, height: 20 }} />
                  </button>
                  <button
                    onClick={next} disabled={current === photos.length - 1}
                    style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
                      width: 36, height: 36, borderRadius: '50%', background: 'rgba(0,0,0,0.55)',
                      border: 'none', cursor: 'pointer', color: 'white',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      opacity: current === photos.length - 1 ? 0.3 : 1, transition: 'opacity .15s' }}
                  >
                    <ChevronRight style={{ width: 20, height: 20 }} />
                  </button>
                  <div style={{ position: 'absolute', bottom: 10, right: 10,
                    background: 'rgba(0,0,0,0.6)', color: 'white', fontSize: 11,
                    fontWeight: 600, padding: '3px 10px', borderRadius: 12, pointerEvents: 'none' }}>
                    {current + 1} / {photos.length}
                  </div>
                </>
              )}
            </>
          )}

          {status === 'fallback' && (
            <img
              src={svSrc}
              alt={`Street View: ${item.name}`}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={e => { e.currentTarget.style.display = 'none'; }}
            />
          )}
        </div>

        {/* Thumbnails */}
        {photos.length > 1 && (
          <div style={{ display: 'flex', gap: 6, padding: '8px 16px', background: '#fafaf9',
            borderBottom: '1px solid #f1f0ee', overflowX: 'auto', flexShrink: 0 }}>
            {photos.map((src, i) => (
              <button
                key={i} onClick={() => setCurrent(i)}
                style={{ flexShrink: 0, width: 56, height: 56, borderRadius: 8, overflow: 'hidden', padding: 0,
                  border: `2px solid ${i === current ? '#f59e0b' : 'transparent'}`,
                  opacity: i === current ? 1 : 0.55, cursor: 'pointer', transition: 'opacity .15s, border-color .15s' }}
              >
                <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} draggable={false} />
              </button>
            ))}
          </div>
        )}

        {/* Details */}
        <div className="px-5 py-4 overflow-y-auto space-y-3" style={{ flex: 1 }}>

          <div className="flex flex-wrap gap-x-5 gap-y-1.5">
            {details?.rating != null && (
              <span className="flex items-center gap-1 text-sm font-semibold text-sun-700">
                <Star className="w-4 h-4 fill-sun-400 stroke-sun-500" />
                {details.rating.toFixed(1)}
                {details.user_ratings_total != null && (
                  <span className="text-xs text-bark-400 font-normal ml-0.5">
                    ({details.user_ratings_total.toLocaleString()} reviews)
                  </span>
                )}
              </span>
            )}
            {details?.formatted_address && (
              <span className="flex items-center gap-1.5 text-xs text-bark-600">
                <MapPin className="w-3.5 h-3.5 text-bark-400 flex-shrink-0" />
                {details.formatted_address}
              </span>
            )}
            {details?.formatted_phone_number && (
              <a
                href={`tel:${details.formatted_phone_number.replace(/\D/g, '')}`}
                className="flex items-center gap-1.5 text-xs text-lake-700 hover:underline"
              >
                <Phone className="w-3.5 h-3.5 text-lake-400" />
                {details.formatted_phone_number}
              </a>
            )}
          </div>

          {details?.opening_hours?.weekday_text?.length > 0 && (
            <div>
              <p className="flex items-center gap-1.5 text-xs font-semibold text-bark-700 mb-1.5">
                <Clock className="w-3.5 h-3.5" /> Opening Hours
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-0.5 pl-5 text-xs text-bark-500">
                {details.opening_hours.weekday_text.map((d, i) => <span key={i}>{d}</span>)}
              </div>
            </div>
          )}

          <div className="flex items-center flex-wrap gap-4 pt-1 border-t border-stone-100">
            {details?.website && (
              <a href={details.website} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-lake-600 hover:text-lake-800">
                <Globe className="w-3.5 h-3.5" /> Website
              </a>
            )}
            <a href={gmUrl} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-sun-700 hover:text-sun-800">
              <MapPin className="w-3.5 h-3.5" /> Google Maps
            </a>
            <span className="text-[10px] text-stone-300 ml-auto select-none">Photos · Google Places</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Portal into document.body so no parent overflow/stacking-context clips the overlay
export default function PlaceLightbox({ item, onClose }) {
  if (!item) return null;
  return createPortal(
    <LightboxContent item={item} onClose={onClose} />,
    document.body
  );
}
