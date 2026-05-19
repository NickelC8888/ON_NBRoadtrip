import { useState } from 'react';
import { ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { OPENTRIPMAP_CITY_ATTRACTIONS } from '@/data/openTripMapCityAttractions';
import { SectionLabel } from './TripDetail';

function AttractionCard({ attraction }) {
  return (
    <div className="border border-stone-200 rounded-xl p-3 bg-white shadow-card space-y-1.5">
      <div className="flex items-start justify-between gap-2">
        <h4 className="font-semibold text-bark-800 text-sm leading-snug">{attraction.name}</h4>
        <span className="text-xs bg-cream-200 text-bark-500 border border-cream-300 px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0">
          {attraction.category}
        </span>
      </div>
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs text-bark-400">
          {attraction.dist != null ? `${(attraction.dist / 1000).toFixed(1)} km away` : 'Distance unknown'}
        </span>
        <a
          href={attraction.url}
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex items-center gap-1 text-xs text-sun-700 hover:text-sun-800 font-semibold"
        >
          <ExternalLink className="w-3 h-3" />
          Details
        </a>
      </div>
    </div>
  );
}

function CityAccordion({ city, attractions }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-stone-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        className="w-full flex items-center justify-between px-4 py-3 bg-cream-100 hover:bg-cream-200 transition-colors text-left"
      >
        <div className="flex items-center gap-2">
          <span className="font-semibold text-bark-800 text-sm">{city}</span>
          <span className="text-xs bg-sun-100 text-sun-700 border border-sun-200 px-2 py-0.5 rounded-full font-medium">
            {attractions.length}
          </span>
        </div>
        {open
          ? <ChevronUp className="w-4 h-4 text-bark-400 flex-shrink-0" />
          : <ChevronDown className="w-4 h-4 text-bark-400 flex-shrink-0" />}
      </button>
      {open && (
        <div className="border-t border-stone-100 bg-white p-4">
          {attractions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {attractions.map(a => (
                <AttractionCard key={a.xid} attraction={a} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-bark-500">No attractions found for this city.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default function CityAttractionsSection({ trip, filterCities }) {
  const cityData = OPENTRIPMAP_CITY_ATTRACTIONS[trip.id] || {};
  const cities = Object.keys(cityData).filter(city =>
    filterCities === null || filterCities.includes(city)
  );

  if (cities.length === 0) return null;

  return (
    <div className="space-y-3">
      <SectionLabel>Nearby Attractions</SectionLabel>
      <div className="space-y-2">
        {cities.map(city => (
          <CityAccordion key={city} city={city} attractions={cityData[city] || []} />
        ))}
      </div>
    </div>
  );
}
