import { useState } from 'react';
import { ChevronLeft, Car, MapPin, Footprints, BedDouble, Utensils, Navigation } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import TripRouteMap from './TripRouteMap';
import { POICard, TrailCard, RestaurantCard, LodgingCard } from './TripDetail';
import CityAttractionsSection from './CityAttractionsSection';
import PlaceLightbox from './PlaceLightbox';
import { OPENTRIPMAP_CITY_ATTRACTIONS } from '@/data/openTripMapCityAttractions';

export default function LegDetailPage({ trip, day, onBack }) {
  const [lightboxItem, setLightboxItem] = useState(null);
  const legMapPoints = (trip.route.mapPoints || []).filter(p => p.day === day.day);

  const hasMap = (day.legWaypoints && day.legWaypoints.length > 1) || legMapPoints.length > 0;

  const legTrip = hasMap ? {
    colorFrom: trip.colorFrom,
    route: {
      waypoints: day.legWaypoints && day.legWaypoints.length > 1
        ? day.legWaypoints
        : legMapPoints.map(p => p.coords),
      stops: [],
      mapPoints: legMapPoints,
    },
  } : null;

  // Resource filtering — same logic as TripDetail
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

  const legCities = (() => {
    const cityData = OPENTRIPMAP_CITY_ATTRACTIONS[trip.id] || {};
    const knownCities = Object.keys(cityData);
    const titleParts = day.title
      .split(/→|to|-|\|/i)
      .map(s => s.replace(/\d+\s*km.*$/i, '').trim())
      .filter(Boolean);
    return knownCities.filter(city =>
      titleParts.some(part =>
        city.toLowerCase().includes(part.toLowerCase()) ||
        part.toLowerCase().includes(city.toLowerCase())
      )
    );
  })();

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

      {/* Day title card */}
      <div
        className="rounded-2xl p-5 text-white shadow-card"
        style={{ background: `linear-gradient(140deg, ${trip.colorFrom}, ${trip.colorTo})` }}
      >
        <div className="text-xs font-semibold uppercase tracking-widest text-white/60 mb-1">
          Day {day.day}
        </div>
        <h2 className="font-display text-2xl font-bold">{day.title}</h2>

        {/* Start → End waypoint strip */}
        {(() => {
          const segs = day.driveSegments;
          const titleParts = day.title.split(/→/).map(s => s.trim()).filter(Boolean);
          const startLabel = segs?.length > 0 ? segs[0].from : titleParts[0];
          const endLabel   = segs?.length > 0 ? segs[segs.length - 1].to : titleParts[titleParts.length - 1];
          if (!startLabel || !endLabel || startLabel === endLabel) return null;
          return (
            <div className="mt-3 flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-white/90">
                <span className="w-5 h-5 rounded-full bg-white/20 border border-white/40 flex items-center justify-center text-[10px] font-bold">A</span>
                {startLabel}
              </span>
              <Navigation className="w-3.5 h-3.5 text-white/50 flex-shrink-0 mx-1" />
              <span className="flex items-center gap-1.5 text-xs font-semibold text-white/90">
                <span className="w-5 h-5 rounded-full bg-white/20 border border-white/40 flex items-center justify-center text-[10px] font-bold">B</span>
                {endLabel}
              </span>
              {segs?.length > 0 && (() => {
                const totalKm = segs.reduce((acc, s) => {
                  const m = (s.distance || '').match(/[\d.]+/);
                  return acc + (m ? parseFloat(m[0]) : 0);
                }, 0);
                return totalKm > 0 ? (
                  <span className="ml-auto text-xs text-white/60 font-medium">{Math.round(totalKm)} km</span>
                ) : null;
              })()}
            </div>
          );
        })()}

        {day.desc && (
          <p className="mt-2 text-sm text-white/80 leading-relaxed">{day.desc}</p>
        )}
      </div>

      {/* Map */}
      {hasMap && legTrip && (
        <div className="rounded-2xl overflow-hidden shadow-card" style={{ height: '450px' }}>
          <TripRouteMap trip={legTrip} height="450px" />
        </div>
      )}

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
                  <POICard key={`${p.sourceId || p.name}-${p.day || 'all'}-${p.location || ''}`} poi={p} onPhotos={setLightboxItem} />
                ))
              : <p className="text-sm text-bark-500">No points of interest for this leg.</p>}
          </div>
        </TabsContent>

        <TabsContent value="trails" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {legTrails.length > 0
              ? legTrails.map(t => (
                  <TrailCard key={`${t.name}-${t.day || 'all'}-${t.location || ''}`} trail={t} onPhotos={setLightboxItem} />
                ))
              : <p className="text-sm text-bark-500">No trails for this leg.</p>}
          </div>
        </TabsContent>

        {hasRestaurants && (
          <TabsContent value="restaurants" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {legRestaurants.length > 0
                ? legRestaurants.map(r => (
                    <RestaurantCard key={`${r.name}-${r.day || 'all'}-${r.location || ''}`} restaurant={r} onPhotos={setLightboxItem} />
                  ))
                : <p className="text-sm text-bark-500">No restaurants for this leg.</p>}
            </div>
          </TabsContent>
        )}

        <TabsContent value="lodging" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {legLodging.length > 0
              ? legLodging.map(l => (
                  <LodgingCard key={`${l.name}-${l.day || 'all'}-${l.location || ''}`} lodging={l} onPhotos={setLightboxItem} />
                ))
              : <p className="text-sm text-bark-500">No lodging for this leg.</p>}
          </div>
        </TabsContent>
      </Tabs>

      {legCities.length > 0 && (
        <CityAttractionsSection trip={trip} filterCities={legCities} />
      )}

      {lightboxItem && <PlaceLightbox item={lightboxItem} onClose={() => setLightboxItem(null)} />}
    </div>
  );
}
