import { useState } from 'react';
import {
  MapPin, Clock, Calendar, Dog, Users, Car, ExternalLink,
  Star, Utensils, BedDouble, TreePine, XCircle, Phone,
  ChevronDown, ChevronUp, Footprints, Sun, Printer, ShoppingBag, Mail,
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { CONTACT_OVERRIDES } from '@/data/contactOverrides';
import TripRouteMap from './TripRouteMap';
import TripPackingList from './TripPackingList';
import CityAttractionsSection from './CityAttractionsSection';

// ── badges ───────────────────────────────────────────────────────────────────

function DogBadge({ friendly }) {
  return friendly ? (
    <span className="inline-flex items-center gap-1 text-xs bg-leaf-100 text-leaf-700 border border-leaf-300 px-2 py-0.5 rounded-full font-medium">
      <Dog className="w-3 h-3" /> Dog OK
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 text-xs bg-red-50 text-red-600 border border-red-200 px-2 py-0.5 rounded-full font-medium">
      <XCircle className="w-3 h-3" /> No dogs
    </span>
  );
}

function KidBadge({ friendly }) {
  return friendly ? (
    <span className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full font-medium">
      <Users className="w-3 h-3" /> Kid-friendly
    </span>
  ) : null;
}

function PriceRange({ range }) {
  const labels = { '$': 'Budget', '$$': 'Moderate', '$$$': 'Upscale', '$$$$': 'Luxury' };
  const classes = {
    '$':    'bg-leaf-100 text-leaf-700 border-leaf-300',
    '$$':   'bg-sun-100 text-sun-700 border-sun-300',
    '$$$':  'bg-orange-100 text-orange-700 border-orange-300',
    '$$$$': 'bg-red-50 text-red-600 border-red-200',
  };
  return (
    <span className={`inline-flex items-center text-xs border px-2 py-0.5 rounded-full font-medium ${classes[range] || 'bg-stone-100 text-stone-600 border-stone-200'}`}>
      {range} · {labels[range]}
    </span>
  );
}

function DifficultyBadge({ difficulty }) {
  const map = {
    easy:             'bg-leaf-100 text-leaf-700 border-leaf-300',
    'easy-moderate':  'bg-sun-100 text-sun-700 border-sun-300',
    moderate:         'bg-orange-100 text-orange-700 border-orange-300',
    intermediate:     'bg-orange-100 text-orange-700 border-orange-300',
  };
  return (
    <span className={`inline-flex items-center text-xs border px-2 py-0.5 rounded-full capitalize font-medium ${map[difficulty] || 'bg-stone-100 text-stone-600 border-stone-200'}`}>
      {difficulty}
    </span>
  );
}

function makeGoogleMapsSearchLink(item) {
  const target = item.address || item.location || '';
  const query = encodeURIComponent(`${item.name}${target ? `, ${target}` : ''}`.trim());
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}

function withContactOverride(item, category) {
  const override = CONTACT_OVERRIDES[`${category}:${item.name}`];
  return override ? { ...item, ...override } : item;
}

function firstPresent(...values) {
  return values.find(value => typeof value === 'string' && value.trim().length > 0)?.trim();
}

function normalizeContact(value) {
  return (value || '').toString().toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

function ContactLine({ icon, label, children, href }) {
  const className = "text-xs text-bark-500 flex items-start gap-1.5 mt-1 leading-snug";
  const content = (
    <>
      <span className="mt-0.5 flex-shrink-0">{icon}</span>
      <span>
        <span className="font-semibold text-bark-700">{label}: </span>
        {children}
      </span>
    </>
  );

  return href ? (
    <a href={href} className={`${className} hover:text-sun-700 transition-colors`}>
      {content}
    </a>
  ) : (
    <p className={className}>{content}</p>
  );
}

function ContactDetails({ item, showLocation = true }) {
  const location = firstPresent(item.location);
  const address = firstPresent(item.address, item.streetAddress, item.addressLine);
  const phone = firstPresent(item.phone, item.telephone, item.tel);
  const email = firstPresent(item.email, item.emailAddress);
  const shouldShowArea = showLocation && location && normalizeContact(location) !== normalizeContact(address);
  const addressLookup = item.googleMapsUrl || makeGoogleMapsSearchLink(item);

  return (
    <>
      {address ? (
        <ContactLine icon={<MapPin className="w-3 h-3" />} label="Address">{address}</ContactLine>
      ) : shouldShowArea ? (
        <>
          <ContactLine icon={<MapPin className="w-3 h-3" />} label="Area">{location}</ContactLine>
          <ContactLine icon={<MapPin className="w-3 h-3" />} label="Address" href={addressLookup}>
            Find full address on Google Maps
          </ContactLine>
        </>
      ) : (
        <ContactLine icon={<MapPin className="w-3 h-3" />} label="Address" href={addressLookup}>
          Open Google Maps for address
        </ContactLine>
      )}
      {address && shouldShowArea && (
        <ContactLine icon={<MapPin className="w-3 h-3" />} label="Area">{location}</ContactLine>
      )}
      {phone && (
        <ContactLine icon={<Phone className="w-3 h-3" />} label="Phone" href={`tel:${phone.replace(/[^\d+]/g, '')}`}>
          {phone}
        </ContactLine>
      )}
      {email && (
        <ContactLine icon={<Mail className="w-3 h-3" />} label="Email" href={`mailto:${email}`}>
          {email}
        </ContactLine>
      )}
    </>
  );
}

// ── sub-section cards ─────────────────────────────────────────────────────────

function ItineraryDay({ day, legMapPoints, attractionFilter, onMoreInfo }) {
  const [open, setOpen] = useState(false);
  const attractionMatchesFilter = attraction => {
    if (attractionFilter === 'kids') return attraction.kidFriendlyLikely || attraction.kidFriendly;
    if (attractionFilter === 'dogs') return attraction.dogFriendlyLikely || attraction.dogFriendly;
    return true;
  };
  const hasWaypoints = day.legWaypoints && day.legWaypoints.length > 1;
  const hasPoints = legMapPoints && legMapPoints.length > 0;
  const hasMap = hasWaypoints || hasPoints;

  const legTrip = hasMap ? {
    colorFrom: '#f59e0b',
    route: {
      waypoints: hasWaypoints ? day.legWaypoints : legMapPoints.map(p => p.coords),
      stops: [],
      mapPoints: legMapPoints || [],
    },
  } : null;

  return (
    <div className="border border-stone-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 bg-cream-100 hover:bg-cream-200 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <span className="w-7 h-7 rounded-full bg-sun-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 font-display shadow-sm">
            {day.day}
          </span>
          <span className="font-semibold text-bark-800 text-sm">{day.title}</span>
        </div>
        {open
          ? <ChevronUp className="w-4 h-4 text-bark-400 flex-shrink-0" />
          : <ChevronDown className="w-4 h-4 text-bark-400 flex-shrink-0" />}
      </button>
      {open && (
        <div className="border-t border-stone-100 bg-white">
          <div className={`${hasMap ? 'grid lg:grid-cols-2 gap-0' : ''}`}>
            {/* Left: description + driving directions */}
            <div className="px-4 py-4 text-sm text-bark-600 leading-relaxed space-y-4">
              <p>{day.desc}</p>
              {day.driveSegments && day.driveSegments.length > 0 && (
                <div>
                  <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-bark-400 mb-2">
                    <Car className="w-3.5 h-3.5 text-leaf-600" /> Travel segments
                  </p>
                  <div className="space-y-2">
                    {day.driveSegments.map((segment, i) => (
                      <div key={`${segment.from}-${segment.to}-${i}`} className="rounded-lg border border-leaf-100 bg-leaf-50 px-3 py-2">
                        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                          <span className="text-xs font-semibold text-bark-700">{segment.from} to {segment.to}</span>
                          <span className="text-xs font-bold text-leaf-700">{segment.distance} · {segment.time}</span>
                        </div>
                        {segment.note && <p className="mt-1 text-xs text-bark-500 leading-snug">{segment.note}</p>}
                        {segment.attractions && segment.attractions.filter(attractionMatchesFilter).length > 0 && (
                          <div className="mt-2 border-t border-leaf-100 pt-2">
                            <p className="text-[11px] font-semibold uppercase tracking-widest text-bark-400">Top nearby attractions</p>
                            <ol className="mt-1.5 space-y-1">
                              {segment.attractions.filter(attractionMatchesFilter).map((attraction, attractionIndex) => (
                                <li key={attraction.xid || `${attraction.name}-${attractionIndex}`} className="flex gap-2 text-xs text-bark-600">
                                  <span className="font-bold text-leaf-700">{attractionIndex + 1}.</span>
                                  <span>
                                    <a
                                      href={attraction.url || makeGoogleMapsSearchLink(attraction)}
                                      target="_blank"
                                      rel="noreferrer noopener"
                                      className="font-semibold text-bark-700 hover:text-sun-700"
                                    >
                                      {attraction.name}
                                    </a>
                                    <span className="text-bark-400">
                                      {' '}· {attraction.category} · {attraction.location}
                                      {attractionFilter !== 'all' && ' · likely match'}
                                    </span>
                                  </span>
                                </li>
                              ))}
                            </ol>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {day.driveSteps && day.driveSteps.length > 0 && (
                <div>
                  <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-bark-400 mb-2">
                    <Car className="w-3.5 h-3.5 text-sun-500" /> Driving directions
                  </p>
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
            </div>
            {/* Right: leg map */}
            {hasMap && (
              <div className="h-[300px] lg:h-auto lg:min-h-[280px] border-t lg:border-t-0 lg:border-l border-stone-100 overflow-hidden">
                <TripRouteMap trip={legTrip} height="100%" />
              </div>
            )}
          </div>
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
    </div>
  );
}

export function POICard({ poi }) {
  const contactPoi = withContactOverride(poi, 'poi');
  return (
    <div className="border border-stone-200 rounded-xl p-4 space-y-2 bg-white shadow-card">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h4 className="font-semibold text-bark-800 text-sm">{poi.name}</h4>
          <ContactDetails item={contactPoi} />
        </div>
        <div className="flex flex-col gap-1 flex-shrink-0">
          <DogBadge friendly={poi.dogFriendly} />
          <KidBadge friendly={poi.kidFriendly} />
        </div>
      </div>
      <p className="text-sm text-bark-600 leading-relaxed">{poi.description}</p>
      {poi.dogNote && (
        <div className={`text-xs rounded-lg px-3 py-2 flex gap-2 ${poi.dogFriendly ? 'bg-leaf-50 text-leaf-800 border border-leaf-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          <Dog className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
          <span>{poi.dogNote}</span>
        </div>
      )}
      {poi.tags && (
        <div className="flex flex-wrap gap-1">
          {poi.tags.map(t => (
            <span key={t} className="text-xs bg-cream-200 text-bark-500 border border-cream-300 px-2 py-0.5 rounded-full">{t}</span>
          ))}
        </div>
      )}
      <a
        href={contactPoi.googleMapsUrl || makeGoogleMapsSearchLink(contactPoi)}
        target="_blank"
        rel="noreferrer noopener"
        className="inline-flex items-center gap-1 text-xs text-sun-700 hover:text-sun-800 font-semibold"
      >
        <ExternalLink className="w-3.5 h-3.5" />
        View on Google Maps
      </a>
    </div>
  );
}

export function TrailCard({ trail }) {
  const note = trail.samoyedNote || trail.seniorDogNote;
  const contactTrail = withContactOverride(trail, 'trails');
  return (
    <div className="border border-stone-200 rounded-xl p-4 space-y-2 bg-white shadow-card">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h4 className="font-semibold text-bark-800 text-sm">{trail.name}</h4>
          <ContactDetails item={contactTrail} />
        </div>
        <DifficultyBadge difficulty={trail.difficulty} />
      </div>
      <p className="text-sm text-bark-600 leading-relaxed">{trail.description}</p>
      <div className="grid grid-cols-3 gap-2 text-xs text-center">
        <div className="bg-cream-100 border border-cream-300 rounded-lg py-1.5">
          <div className="font-bold text-bark-700">{trail.lengthKm} km</div>
          <div className="text-bark-400">Distance</div>
        </div>
        <div className="bg-cream-100 border border-cream-300 rounded-lg py-1.5">
          <div className="font-bold text-bark-700 capitalize">{trail.surface}</div>
          <div className="text-bark-400">Surface</div>
        </div>
        <div className="bg-cream-100 border border-cream-300 rounded-lg py-1.5">
          <div className="font-bold text-bark-700">{trail.duration}</div>
          <div className="text-bark-400">Time</div>
        </div>
      </div>
      {note && (
        <div className="text-xs bg-sun-50 text-sun-800 border border-sun-200 rounded-lg px-3 py-2 flex gap-2">
          <Dog className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
          <span>{note}</span>
        </div>
      )}
      <div className="flex flex-wrap items-center gap-2">
        {trail.dogFriendly && <DogBadge friendly={true} />}
        {trail.kidFriendly && <KidBadge friendly={true} />}
      </div>
      <a
        href={contactTrail.googleMapsUrl || makeGoogleMapsSearchLink(contactTrail)}
        target="_blank"
        rel="noreferrer noopener"
        className="inline-flex items-center gap-1 text-xs text-sun-700 hover:text-sun-800 font-semibold"
      >
        <ExternalLink className="w-3.5 h-3.5" />
        View on Google Maps
      </a>
    </div>
  );
}

export function RestaurantCard({ restaurant }) {
  const contactRestaurant = withContactOverride(restaurant, 'restaurants');
  return (
    <div className="border border-stone-200 rounded-xl p-4 space-y-2 bg-white shadow-card">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h4 className="font-semibold text-bark-800 text-sm">{restaurant.name}</h4>
          <ContactDetails item={contactRestaurant} />
          <p className="text-xs text-bark-500 mt-0.5">{restaurant.cuisine}</p>
        </div>
        <div className="flex flex-col gap-1 flex-shrink-0 items-end">
          <DogBadge friendly={restaurant.dogFriendly} />
          <PriceRange range={restaurant.priceRange} />
        </div>
      </div>
      {restaurant.mustTry && (
        <div className="text-xs bg-sun-50 text-sun-800 border border-sun-200 rounded-lg px-3 py-2 flex gap-2">
          <Star className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-sun-500" />
          <span><strong>Must try:</strong> {restaurant.mustTry}</span>
        </div>
      )}
      {restaurant.tip && (
        <p className="text-xs text-bark-500 italic leading-relaxed">{restaurant.tip}</p>
      )}
      <a
        href={contactRestaurant.googleMapsUrl || makeGoogleMapsSearchLink(contactRestaurant)}
        target="_blank"
        rel="noreferrer noopener"
        className="inline-flex items-center gap-1 text-xs text-sun-700 hover:text-sun-800 font-semibold"
      >
        <ExternalLink className="w-3.5 h-3.5" />
        View on Google Maps
      </a>
    </div>
  );
}

export function LodgingCard({ lodging }) {
  const contactLodging = withContactOverride(lodging, 'lodging');
  const priceClass = {
    '$$':   'text-leaf-600',
    '$$$':  'text-sun-600',
    '$$$$': 'text-red-600',
  };
  return (
    <div className="border border-stone-200 rounded-xl p-4 space-y-2 bg-white shadow-card">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h4 className="font-semibold text-bark-800 text-sm">{lodging.name}</h4>
          <ContactDetails item={contactLodging} />
          <p className="text-xs text-bark-500 mt-0.5">{lodging.type} · {lodging.rooms}</p>
        </div>
        <span className={`text-sm font-bold flex-shrink-0 font-display ${priceClass[lodging.priceRange] || 'text-bark-600'}`}>
          {lodging.priceRange}
        </span>
      </div>
      <div className="text-xs bg-leaf-50 text-leaf-800 border border-leaf-200 rounded-lg px-3 py-2 flex gap-2">
        <Dog className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
        <span>{lodging.petPolicy}</span>
      </div>
      <p className="text-xs text-bark-400 italic">{lodging.bookingNote}</p>
      <a
        href={contactLodging.googleMapsUrl || makeGoogleMapsSearchLink(contactLodging)}
        target="_blank"
        rel="noreferrer noopener"
        className="inline-flex items-center gap-1 text-xs text-sun-700 hover:text-sun-800 font-semibold"
      >
        <ExternalLink className="w-3.5 h-3.5" />
        View on Google Maps
      </a>
    </div>
  );
}

// ── main ──────────────────────────────────────────────────────────────────────

export default function TripDetail({ trip, activeSeason, onMoreInfo }) {
  const seasonTip = activeSeason !== 'all' ? trip.seasonTips?.[activeSeason] : null;
  const hasRestaurants = Array.isArray(trip.restaurants) && trip.restaurants.length > 0;
  const hasTripProfile = !!trip.tripProfile;
  const [selectedLeg, setSelectedLeg] = useState('all');
  const [attractionFilter, setAttractionFilter] = useState('all');
  const selectedLegNumber = selectedLeg === 'all' ? null : Number(selectedLeg);

  const normalize = value => (value || '').toString().toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  const itemMatchesLeg = (item, keywords) => {
    const haystack = [
      item.name,
      item.location,
      item.address,
      item.description,
      item.cuisine,
      item.type,
      item.tags && item.tags.join(' '),
    ]
      .filter(Boolean)
      .join(' ');
    const normalized = normalize(haystack);
    return keywords.some(keyword => normalized.includes(normalize(keyword)));
  };

  const selectedLegKeywords = selectedLegNumber == null
    ? []
    : (() => {
      const day = trip.route.itinerary.find(d => d.day === selectedLegNumber);
      if (!day) return [];
      const fromTo = day.title.split(/→|to|-/i).map(s => s.trim()).filter(Boolean);
      const stopNames = trip.route.stops.map(stop => stop.name);
      return [...fromTo, ...stopNames];
    })();

  const filterByLeg = item => {
    if (selectedLegNumber == null) return true;
    if (item?.day === selectedLegNumber) return true;
    if (selectedLegKeywords.length === 0) return false;
    return itemMatchesLeg(item, selectedLegKeywords);
  };
  const filterByAttractionSuitability = item => {
    if (attractionFilter === 'kids') return item?.kidFriendlyLikely || item?.kidFriendly;
    if (attractionFilter === 'dogs') return item?.dogFriendlyLikely || item?.dogFriendly;
    return true;
  };
  const filterMapPointBySuitability = item => {
    if (!item?.sourceId) return true;
    if (attractionFilter === 'kids') return item?.kidFriendlyLikely || item?.category !== 'poi';
    if (attractionFilter === 'dogs') return item?.dogFriendlyLikely || item?.category !== 'poi';
    return true;
  };
  const displayedTrip = {
    ...trip,
    route: {
      ...trip.route,
      mapPoints: (trip.route.mapPoints || []).filter(filterMapPointBySuitability),
    },
  };

  const filteredPoi = Array.isArray(trip.poi) ? trip.poi.filter(filterByLeg).filter(filterByAttractionSuitability) : [];
  const filteredTrails = Array.isArray(trip.trails) ? trip.trails.filter(filterByLeg) : [];
  const filteredRestaurants = Array.isArray(trip.restaurants) ? trip.restaurants.filter(filterByLeg) : [];
  const filteredLodging = Array.isArray(trip.lodging) ? trip.lodging.filter(filterByLeg) : [];

  return (
    <div className="space-y-6">
      {/* Detail header */}
      <div
        className="relative overflow-hidden rounded-2xl p-6 text-white shadow-card-hover"
        style={{ background: `linear-gradient(140deg, ${trip.colorFrom}, ${trip.colorTo})` }}
      >
        {/* Decorative circle */}
        <div className="absolute -top-12 -right-12 w-52 h-52 rounded-full bg-white/10 pointer-events-none" />
        <div className="absolute -bottom-8 right-24 w-32 h-32 rounded-full bg-white/8 pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 relative">
          <div>
            <div className="text-4xl mb-2 select-none">{trip.emoji}</div>
            <h2 className="font-display text-2xl font-bold text-white">{trip.name}</h2>
            <p className="text-white/80 mt-1 text-sm italic font-light">{trip.tagline}</p>
          </div>
          <div className="grid grid-cols-3 gap-3 shrink-0 sm:grid-cols-1">
            <StatPill icon={<MapPin className="w-4 h-4" />} value={`${trip.distanceKm} km`} label="Round trip" />
            <StatPill icon={<Clock className="w-4 h-4" />} value={`${trip.driveHoursOneWay} hrs`} label="Total drive" />
            <StatPill icon={<Calendar className="w-4 h-4" />} value={trip.duration} label="Duration" />
          </div>
        </div>

        {hasTripProfile && (
          <div className="mt-4 bg-white/15 backdrop-blur-sm rounded-xl p-3 grid grid-cols-3 gap-3 text-sm text-white/90 relative">
            <ProfilePill icon={<Users className="w-4 h-4" />} label={trip.tripProfile.passengers} />
            <ProfilePill icon={<Dog className="w-4 h-4" />} label={trip.tripProfile.pet} />
            <ProfilePill icon={<Car className="w-4 h-4" />} label={trip.tripProfile.vehicle} />
          </div>
        )}

        <div className="mt-4 flex flex-wrap gap-3 relative">
          {trip.route.googleMapsUrl && (
            <a
              href={trip.route.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 border border-white/30 transition-colors text-white text-sm font-semibold px-4 py-2 rounded-xl"
            >
              <ExternalLink className="w-4 h-4" />
              Open in Google Maps
            </a>
          )}
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 border border-white/30 transition-colors text-white text-sm font-semibold px-4 py-2 rounded-xl"
          >
            <Printer className="w-4 h-4" />
            Print trip plan
          </button>
        </div>
      </div>

      {hasTripProfile && (
        <div className="flex gap-3 bg-sun-50 border border-sun-200 rounded-xl p-4 text-sm text-sun-900">
          <Sun className="w-5 h-5 flex-shrink-0 text-sun-500 mt-0.5" />
          <p className="leading-relaxed">{trip.tripProfile.dogBreedNote}</p>
        </div>
      )}

      {seasonTip && (
        <div className="flex gap-3 bg-lake-50 border border-lake-200 rounded-xl p-4 text-sm text-lake-900">
          <Calendar className="w-5 h-5 flex-shrink-0 text-lake-500 mt-0.5" />
          <p className="leading-relaxed">
            <strong>
              {activeSeason === 'june' ? 'June tip' : activeSeason === 'late-august' ? 'Late August tip' : 'Early September tip'}:
            </strong>{' '}
            {seasonTip}
          </p>
        </div>
      )}

      {/* Map + Route Details — same height row */}
      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr] h-auto lg:h-[540px]">
        {/* Map — fills full column height */}
        <div className="rounded-2xl overflow-hidden bg-white shadow-card flex flex-col h-[400px] lg:h-full">
          <div className="px-4 pt-3 pb-2 border-b border-stone-100 flex-shrink-0">
            <SectionLabel>Route Map</SectionLabel>
          </div>
          <div className="flex-1 min-h-0">
            <TripRouteMap trip={displayedTrip} height="100%" />
          </div>
        </div>

        {/* Route details — same height, scrolls if needed */}
        <div className="flex flex-col gap-3 h-[auto] lg:h-full">
          <SectionLabel>Route Details</SectionLabel>
          <div className="grid grid-cols-2 gap-3 flex-shrink-0">
            <StatBox icon={<MapPin className="w-3.5 h-3.5" />} label="Driving distance" value={`${trip.distanceKm} km`} />
            <StatBox icon={<Clock className="w-3.5 h-3.5" />} label="Estimated drive" value={`${trip.driveHoursOneWay} hrs`} />
          </div>
          <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-card flex-1 overflow-y-auto">
            <h4 className="font-semibold text-bark-800 text-sm mb-3">Destinations</h4>
            <div className="space-y-3 text-sm text-bark-600">
              {trip.route.stops
                .filter((s, i, arr) => s.name !== arr[i - 1]?.name)
                .map((stop, i, arr) => (
                  <div key={`${stop.name}-${i}`} className="flex items-start gap-3">
                    <span className="mt-0.5 text-base flex-shrink-0">{i === 0 ? '🏠' : i === arr.length - 1 ? '🏁' : `${i}.`}</span>
                    <div>
                      <p className="font-semibold text-bark-700">{stop.name}</p>
                      <p className="text-xs text-bark-400">{stop.night != null ? `Night ${stop.night}` : 'Drive stop'}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Day-by-Day Itinerary — sequential, full width */}
      <div className="space-y-3">
        <SectionLabel>Day-by-Day Itinerary</SectionLabel>
        <div className="space-y-2">
          {trip.route.itinerary.map(day => (
            <ItineraryDay
              key={day.day}
              day={day}
              attractionFilter={attractionFilter}
              legMapPoints={(displayedTrip.route.mapPoints || []).filter(p => p.day === day.day)}
              onMoreInfo={onMoreInfo}
            />
          ))}
        </div>
      </div>

      {/* City Attractions */}
      <CityAttractionsSection trip={trip} filterCities={null} />

      <div className="bg-white border border-stone-200 rounded-2xl p-4">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h4 className="font-semibold text-bark-700 text-sm">Filter attractions</h4>
            <p className="text-xs text-bark-500">Dog and kid filters use OpenTripMap category heuristics. Verify policies before visiting.</p>
          </div>
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="inline-flex rounded-xl border border-stone-300 bg-cream-50 p-1 shadow-sm">
              {[
                { id: 'all', label: 'All' },
                { id: 'kids', label: 'Kid likely' },
                { id: 'dogs', label: 'Dog likely' },
              ].map(option => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setAttractionFilter(option.id)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                    attractionFilter === option.id
                      ? 'bg-leaf-600 text-white shadow-sm'
                      : 'text-bark-600 hover:bg-white'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <label htmlFor="leg-filter" className="text-xs uppercase tracking-widest text-bark-500 font-semibold">
                Leg
              </label>
              <select
                id="leg-filter"
                value={selectedLeg}
                onChange={e => setSelectedLeg(e.target.value)}
                className="rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm text-bark-700 shadow-sm"
              >
                <option value="all">All legs</option>
                {trip.route.itinerary.map(day => (
                  <option key={day.day} value={String(day.day)}>
                    Day {day.day}: {day.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="poi">
        <TabsList className={`grid w-full ${hasRestaurants ? 'grid-cols-6' : 'grid-cols-5'}`}>
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
          <TabsTrigger value="tips" className="flex items-center gap-1.5 text-xs">
            <TreePine className="w-3.5 h-3.5" />
            Tips
          </TabsTrigger>
          <TabsTrigger value="packing" className="flex items-center gap-1.5 text-xs">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Pack List</span>
            <span className="sm:hidden">Pack</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="poi" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPoi.length > 0 ? filteredPoi.map(p => <POICard key={`${p.sourceId || p.name}-${p.day || 'all'}-${p.location || ''}`} poi={p} />) : (
              <p className="text-sm text-bark-500">No points of interest are assigned to this leg.</p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="trails" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTrails.length > 0 ? filteredTrails.map(t => <TrailCard key={`${t.name}-${t.day || 'all'}-${t.location || ''}`} trail={t} />) : (
              <p className="text-sm text-bark-500">No trails are assigned to this leg.</p>
            )}
          </div>
        </TabsContent>

        {hasRestaurants && (
          <TabsContent value="restaurants" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredRestaurants.length > 0 ? filteredRestaurants.map(r => <RestaurantCard key={`${r.name}-${r.day || 'all'}-${r.location || ''}`} restaurant={r} />) : (
                <p className="text-sm text-bark-500">No restaurants are assigned to this leg.</p>
              )}
            </div>
          </TabsContent>
        )}

        <TabsContent value="lodging" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredLodging.length > 0 ? filteredLodging.map(l => <LodgingCard key={`${l.name}-${l.day || 'all'}-${l.location || ''}`} lodging={l} />) : (
              <p className="text-sm text-bark-500">No lodging is assigned to this leg.</p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="tips" className="mt-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {Object.entries(trip.seasonTips).map(([season, tip]) => (
              <div key={season} className="bg-white border border-stone-200 rounded-xl p-4 space-y-1 shadow-card">
                <h4 className="font-semibold text-bark-700 text-sm">
                  {season === 'june' ? '☀️ June' : season === 'late-august' ? '🌻 Late August' : '🍂 Early September'}
                </h4>
                <p className="text-xs text-bark-600 leading-relaxed">{tip}</p>
              </div>
            ))}
          </div>
          {hasTripProfile && (
            <div className="bg-sun-50 border border-sun-200 rounded-xl p-4 space-y-2">
              <h4 className="font-semibold text-sun-800 text-sm flex items-center gap-2">
                <Dog className="w-4 h-4" /> Samoyed Travel Tips
              </h4>
              <ul className="text-xs text-sun-900 space-y-1.5 list-disc list-inside leading-relaxed">
                <li>Hike before 10 am or after 6 pm to avoid peak heat</li>
                <li>Carry at least 2 litres of fresh water specifically for the dog</li>
                <li>Test pavement temperature with your palm — hot enough to burn your hand means it burns paw pads</li>
                <li>Keep a cooling mat or wet towel in the van for rest breaks</li>
                <li>A Samoyed's coat actually insulates against heat — never shave it</li>
                <li>Watch for excessive panting, drooling, or stumbling — signs of heat stress</li>
                <li>Many hotels want proof of vaccinations — bring a vet record printout</li>
              </ul>
            </div>
          )}
        </TabsContent>

        <TabsContent value="packing" className="mt-4">
          <TripPackingList />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export function SectionLabel({ children }) {
  return (
    <h3 className="font-display font-semibold text-bark-500 text-xs uppercase tracking-widest flex items-center gap-2">
      <span className="w-4 h-0.5 bg-sun-400 inline-block rounded-full" />
      {children}
    </h3>
  );
}

function StatPill({ icon, value, label }) {
  return (
    <div className="bg-white/15 backdrop-blur-sm rounded-xl px-3 py-2 text-center sm:text-left">
      <div className="flex items-center justify-center sm:justify-start gap-1 text-white/70 mb-0.5">{icon}</div>
      <div className="text-white font-bold text-base font-display">{value}</div>
      <div className="text-white/60 text-xs">{label}</div>
    </div>
  );
}

function ProfilePill({ icon, label }) {
  return (
    <div className="flex items-center gap-1.5 text-white/90">
      <span className="opacity-70">{icon}</span>
      <span className="text-xs">{label}</span>
    </div>
  );
}

function StatBox({ icon, label, value }) {
  return (
    <div className="bg-white border border-stone-200 rounded-xl px-3 py-2 shadow-card">
      <div className="flex items-center gap-1.5 text-bark-400 mb-0.5">
        {icon}
        <span className="text-xs font-medium uppercase tracking-wide">{label}</span>
      </div>
      <div className="text-sm font-bold text-bark-800">{value}</div>
    </div>
  );
}
