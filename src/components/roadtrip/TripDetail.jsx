import { useState } from 'react';
import {
  MapPin, Clock, Calendar, Dog, Users, Car, ExternalLink,
  Star, Utensils, BedDouble, TreePine, XCircle, Phone, Camera,
  ChevronDown, ChevronUp, Footprints, Sun, Printer, ShoppingBag, Mail,
  Pencil, Trash2, Plus, Eye, EyeOff, GripVertical, StickyNote, Heart,
} from 'lucide-react';
import {
  DndContext, closestCenter, PointerSensor, useSensor, useSensors,
} from '@dnd-kit/core';
import {
  SortableContext, useSortable, verticalListSortingStrategy, arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { CONTACT_OVERRIDES } from '@/data/contactOverrides';
import TripRouteMap from './TripRouteMap';
import TripPackingList from './TripPackingList';
import PlaceLightbox from './PlaceLightbox';

import EditItemModal from './EditItemModal';
import EditDayModal from './EditDayModal';
import NoteModal from './NoteModal';
import WeatherSection from './WeatherSection';

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

// ── day resource helpers ──────────────────────────────────────────────────────

function normForMatch(s) {
  return (s || '').toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim();
}

function findMapPoint(item, legMapPoints) {
  if (!legMapPoints?.length) return null;
  const itemN = normForMatch(item.name);
  // Exact
  let mp = legMapPoints.find(p => normForMatch(p.name) === itemN);
  if (mp) return mp;
  // One name contains the other
  mp = legMapPoints.find(p => {
    const pN = normForMatch(p.name);
    return pN.includes(itemN) || itemN.includes(pN);
  });
  if (mp) return mp;
  // ≥2 significant words overlap
  const iWords = new Set(itemN.split(' ').filter(w => w.length > 3));
  if (iWords.size >= 2) {
    mp = legMapPoints.find(p => {
      const pWords = normForMatch(p.name).split(' ').filter(w => w.length > 3);
      return pWords.filter(w => iWords.has(w)).length >= 2;
    });
  }
  return mp || null;
}

const RESOURCE_SECTIONS = [
  { key: 'poi',         label: 'Points of Interest', Icon: MapPin,    accent: 'text-lake-600'   },
  { key: 'trails',      label: 'Trails',              Icon: Footprints, accent: 'text-leaf-600'  },
  { key: 'restaurants', label: 'Restaurants',         Icon: Utensils,  accent: 'text-sun-600'    },
  { key: 'lodging',     label: 'Lodging',             Icon: BedDouble, accent: 'text-purple-600' },
];

function itemInfoUrl(item) {
  if (item.website) return item.website;
  const q = encodeURIComponent(`${item.name}${item.location ? ' ' + item.location : ''}`);
  return `https://en.wikipedia.org/w/index.php?search=${q}`;
}

function ResourceItem({ item, legMapPoints, selectedCoords, onSelectCoords, onPhotos }) {
  const mp = findMapPoint(item, legMapPoints);
  const isActive = mp && selectedCoords &&
    Math.abs(mp.coords[0] - selectedCoords[0]) < 0.0001 &&
    Math.abs(mp.coords[1] - selectedCoords[1]) < 0.0001;

  return (
    <div
      onClick={mp ? () => onSelectCoords(isActive ? null : mp.coords) : undefined}
      className={`px-3 py-3 transition-all duration-150 ${mp ? 'cursor-pointer' : ''} ${
        isActive ? 'bg-sun-50' : mp ? 'hover:bg-cream-50' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-bark-800 text-sm leading-snug">{item.name}</p>
          {(item.location || item.address) && (
            <p className="text-xs text-bark-400 mt-0.5 truncate">{item.location || item.address}</p>
          )}
        </div>
        <div className="flex items-center gap-1 flex-shrink-0 mt-0.5">
          {item.dogFriendly && (
            <span className="inline-flex items-center gap-0.5 text-[10px] bg-leaf-100 text-leaf-700 border border-leaf-200 px-1.5 py-0.5 rounded-full font-medium">
              <Dog className="w-2.5 h-2.5" /> Dog OK
            </span>
          )}
          {item.kidFriendly && (
            <span className="inline-flex items-center gap-0.5 text-[10px] bg-blue-50 text-blue-700 border border-blue-200 px-1.5 py-0.5 rounded-full font-medium">
              <Users className="w-2.5 h-2.5" /> Kids
            </span>
          )}
        </div>
      </div>

      {item.description && (
        <p className="text-xs text-bark-500 mt-1.5 leading-relaxed line-clamp-2">{item.description}</p>
      )}
      {item.dogNote && (
        <p className="text-[11px] text-leaf-700 mt-1 leading-snug italic">{item.dogNote}</p>
      )}
      {item.mustTry && (
        <p className="text-[11px] text-sun-700 mt-1 leading-snug">
          <Star className="w-2.5 h-2.5 inline mr-0.5 mb-0.5" />
          {item.mustTry}
        </p>
      )}
      {item.petPolicy && (
        <p className="text-[11px] text-leaf-700 mt-1 leading-snug">
          <Dog className="w-2.5 h-2.5 inline mr-0.5 mb-0.5" />
          {item.petPolicy}
        </p>
      )}

      <div className="flex items-center gap-3 mt-2" onClick={e => e.stopPropagation()}>
        {mp && (
          <span className={`inline-flex items-center gap-1 text-[11px] font-medium ${isActive ? 'text-sun-600' : 'text-bark-400'}`}>
            <MapPin className="w-3 h-3" />
            {isActive ? 'On map ✓' : 'Click to pin'}
          </span>
        )}
        <button
          onClick={() => onPhotos && onPhotos(item)}
          className="inline-flex items-center gap-1 text-[11px] text-lake-600 hover:text-lake-800 font-semibold transition-colors ml-auto"
          title="View photos & details"
        >
          <Camera className="w-3 h-3" /> Photos
        </button>
        <a
          href={item.googleMapsUrl || makeGoogleMapsSearchLink(item)}
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex items-center gap-1 text-[11px] text-sun-700 hover:text-sun-800 font-semibold"
        >
          <MapPin className="w-3 h-3" /> Maps
        </a>
      </div>
    </div>
  );
}

function DayResourceList({ resources, legMapPoints, selectedCoords, onSelectCoords }) {
  const [lightboxItem, setLightboxItem] = useState(null);

  const sections = RESOURCE_SECTIONS
    .map(s => ({ ...s, items: resources?.[s.key] || [] }))
    .filter(s => s.items.length > 0);
  if (sections.length === 0) return null;

  const shortLabel = { 'Points of Interest': 'POI', Trails: 'Trails', Restaurants: 'Eat', Lodging: 'Stay' };

  return (
    <div className="border-t border-stone-100 bg-white px-4 pb-4 pt-3">
      <Tabs defaultValue={sections[0].key}>
        <TabsList
          className="grid w-full"
          style={{ gridTemplateColumns: `repeat(${sections.length}, 1fr)` }}
        >
          {sections.map(({ key, label, Icon }) => (
            <TabsTrigger key={key} value={key} className="flex items-center gap-1.5 text-xs">
              <Icon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{label}</span>
              <span className="sm:hidden">{shortLabel[label] ?? label}</span>
            </TabsTrigger>
          ))}
        </TabsList>
        {sections.map(({ key, items }) => (
          <TabsContent key={key} value={key} className="mt-3">
            <div className="divide-y divide-stone-100 border border-stone-200 rounded-xl overflow-hidden">
              {items.map(item => (
                <ResourceItem
                  key={item.name}
                  item={item}
                  legMapPoints={legMapPoints}
                  selectedCoords={selectedCoords}
                  onSelectCoords={onSelectCoords}
                  onPhotos={setLightboxItem}
                />
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
      {lightboxItem && <PlaceLightbox item={lightboxItem} onClose={() => setLightboxItem(null)} />}
    </div>
  );
}

// ── sub-section cards ─────────────────────────────────────────────────────────

function UserNoteBlock({ note, onNote }) {
  return (
    <div className="flex items-start gap-2 bg-sun-50 border border-sun-200 rounded-lg px-3 py-2">
      <StickyNote className="w-3.5 h-3.5 text-sun-500 flex-shrink-0 mt-0.5" />
      <p className="text-xs text-bark-700 leading-relaxed flex-1 whitespace-pre-wrap">{note}</p>
      {onNote && (
        <button onClick={onNote} className="text-bark-300 hover:text-sun-600 transition-colors flex-shrink-0">
          <Pencil className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}

function FavButton({ isFavourited, onFavourite }) {
  return (
    <button
      onClick={onFavourite}
      className={`w-7 h-7 flex items-center justify-center rounded-lg transition-colors ${
        isFavourited
          ? 'text-red-500 hover:text-red-600'
          : 'text-bark-300 hover:text-red-400'
      }`}
      title={isFavourited ? 'Remove favourite' : 'Add to favourites'}
    >
      <Heart className={`w-3.5 h-3.5 ${isFavourited ? 'fill-current' : ''}`} />
    </button>
  );
}

function NoteButton({ hasNote, onNote }) {
  return (
    <button
      onClick={onNote}
      className={`inline-flex items-center gap-1 text-xs font-semibold transition-colors ${
        hasNote ? 'text-sun-600 hover:text-sun-700' : 'text-bark-400 hover:text-sun-600'
      }`}
      title={hasNote ? 'Edit note' : 'Add note'}
    >
      <StickyNote className="w-3.5 h-3.5" />
      {hasNote ? 'Note' : 'Add note'}
    </button>
  );
}

// ── Sortable wrapper for drag-and-drop itinerary ──────────────────────────────

function ItineraryDayList({ trip, displayedTrip, attractionFilter, onMoreInfo, editMode, onEditDay, onDeleteDay, onReorderDays, onNoteDay }) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));
  const itinerary = trip.route.itinerary;

  function getDayResources(day) {
    const dayCities = day.title
      .split(/→|to\b|-/i)
      .map(s => s.trim().toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').trim())
      .filter(Boolean);
    const matchesDay = item => {
      if (item.day === day.day) return true;
      if (item.day != null) return false;
      const haystack = [item.name, item.location, item.address]
        .filter(Boolean).join(' ').toLowerCase().replace(/[^a-z0-9 ]+/g, ' ');
      return dayCities.some(city => city.length > 2 && haystack.includes(city));
    };
    return {
      poi:         (trip.poi         || []).filter(matchesDay),
      trails:      (trip.trails       || []).filter(matchesDay),
      restaurants: (trip.restaurants  || []).filter(matchesDay),
      lodging:     (trip.lodging      || []).filter(matchesDay),
    };
  }

  function handleDragEnd({ active, over }) {
    if (!over || active.id === over.id) return;
    const oldIdx = itinerary.findIndex(d => String(d.day) === active.id);
    const newIdx = itinerary.findIndex(d => String(d.day) === over.id);
    onReorderDays(arrayMove(itinerary, oldIdx, newIdx));
  }

  if (!editMode) {
    return (
      <div className="space-y-2">
        {itinerary.map(day => (
          <ItineraryDay
            key={day.day}
            day={day}
            attractionFilter={attractionFilter}
            legMapPoints={(displayedTrip.route.mapPoints || []).filter(p => p.day === day.day)}
            onMoreInfo={onMoreInfo}
            dayResources={getDayResources(day)}
            onNote={onNoteDay ? () => onNoteDay(day) : null}
          />
        ))}
      </div>
    );
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={itinerary.map(d => String(d.day))} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
          {itinerary.map(day => (
            <SortableItineraryDay
              key={day.day}
              day={day}
              attractionFilter={attractionFilter}
              legMapPoints={(displayedTrip.route.mapPoints || []).filter(p => p.day === day.day)}
              onMoreInfo={onMoreInfo}
              dayResources={getDayResources(day)}
              onEdit={() => onEditDay(day)}
              onDelete={() => onDeleteDay(day.day)}
              onNote={onNoteDay ? () => onNoteDay(day) : null}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

function SortableItineraryDay({ day, onEdit, onDelete, onNote, ...props }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: String(day.day) });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative">
      <ItineraryDay day={day} editMode onEdit={onEdit} onDelete={onDelete} onNote={onNote} dragListeners={listeners} dragAttributes={attributes} {...props} />
    </div>
  );
}

function ItineraryDay({ day, legMapPoints, attractionFilter, onMoreInfo, dayResources, editMode, onEdit, onDelete, onNote, dragListeners, dragAttributes }) {
  const [open, setOpen] = useState(false);
  const [selectedCoords, setSelectedCoords] = useState(null);
  const [showAllLabels, setShowAllLabels] = useState(false);

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

  const hasResources = dayResources && RESOURCE_SECTIONS.some(s => (dayResources[s.key] || []).length > 0);

  return (
    <div className="border border-stone-200 rounded-xl overflow-hidden">
      <div className="flex items-stretch bg-cream-100 hover:bg-cream-200 transition-colors">
        {editMode && (
          <div
            {...dragAttributes}
            {...dragListeners}
            className="flex items-center pl-3 pr-1 cursor-grab active:cursor-grabbing text-bark-300 hover:text-bark-500 touch-none"
          >
            <GripVertical className="w-4 h-4" />
          </div>
        )}
        <button
          onClick={() => setOpen(o => !o)}
          className="flex-1 flex items-center justify-between px-4 py-3 text-left min-w-0"
        >
          <div className="flex items-center gap-3 min-w-0">
            <span className="w-7 h-7 rounded-full bg-sun-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 font-display shadow-sm">
              {day.day}
            </span>
            <span className="font-semibold text-bark-800 text-sm truncate">{day.title}</span>
          </div>
          {open
            ? <ChevronUp className="w-4 h-4 text-bark-400 flex-shrink-0 ml-2" />
            : <ChevronDown className="w-4 h-4 text-bark-400 flex-shrink-0 ml-2" />}
        </button>
        {editMode && (
          <div className="flex items-center gap-1 pr-2">
            <button onClick={onEdit} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-sun-100 text-bark-400 hover:text-sun-700 transition-colors">
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button onClick={onDelete} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-100 text-bark-400 hover:text-red-600 transition-colors">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
      {open && (
        <div className="border-t border-stone-100 bg-white">
          {/* Drive info + map row */}
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
                <TripRouteMap
                  trip={legTrip}
                  height="100%"
                  selectedCoords={selectedCoords}
                  showAllLabels={showAllLabels}
                />
              </div>
            )}
          </div>

          {/* Day resources — POI, trails, restaurants, lodging */}
          {hasResources && (
            <DayResourceList
              resources={dayResources}
              legMapPoints={legMapPoints}
              selectedCoords={selectedCoords}
              onSelectCoords={setSelectedCoords}
            />
          )}

          {/* User note */}
          {day.userNotes && (
            <div className="px-4 pb-0">
              <UserNoteBlock note={day.userNotes} onNote={onNote} />
            </div>
          )}

          {/* Footer */}
          <div className="px-4 py-3 border-t border-stone-100 flex items-center justify-between gap-2 flex-wrap">
            {hasMap && (
              <button
                onClick={() => { setShowAllLabels(v => !v); setSelectedCoords(null); }}
                className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl border transition-colors ${
                  showAllLabels
                    ? 'bg-sun-100 border-sun-300 text-sun-800'
                    : 'bg-white border-stone-200 text-bark-500 hover:border-sun-200 hover:text-bark-700'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" />
                {showAllLabels ? 'Hide map labels' : 'Show all on map'}
              </button>
            )}
            {onNote && <NoteButton hasNote={!!day.userNotes} onNote={onNote} />}
            {onMoreInfo && (
              <button
                onClick={() => onMoreInfo(day.day)}
                className="inline-flex items-center gap-2 bg-sun-500 hover:bg-sun-600 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors shadow-sm ml-auto"
              >
                Day Details →
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function POICard({ poi, onPhotos, editMode, onEdit, onDelete, onNote, isFavourited, onFavourite }) {
  const contactPoi = withContactOverride(poi, 'poi');
  return (
    <div className={`border rounded-xl p-4 space-y-2 bg-white shadow-card ${editMode ? 'border-sun-300' : 'border-stone-200'}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h4 className="font-semibold text-bark-800 text-sm">{poi.name}</h4>
          <ContactDetails item={contactPoi} />
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          {editMode && (
            <>
              <button onClick={() => onEdit && onEdit(poi)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-sun-100 text-bark-400 hover:text-sun-700 transition-colors" title="Edit">
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => onDelete && onDelete(poi.name)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-100 text-bark-400 hover:text-red-600 transition-colors" title="Delete">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </>
          )}
          <div className="flex flex-col gap-1 ml-1">
            <DogBadge friendly={poi.dogFriendly} />
            <KidBadge friendly={poi.kidFriendly} />
          </div>
        </div>
      </div>
      <p className="text-sm text-bark-600 leading-relaxed">{poi.description}</p>
      {poi.dogNote && (
        <div className={`text-xs rounded-lg px-3 py-2 flex gap-2 ${poi.dogFriendly ? 'bg-leaf-50 text-leaf-800 border border-leaf-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          <Dog className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
          <span>{poi.dogNote}</span>
        </div>
      )}
      {poi.userNotes && <UserNoteBlock note={poi.userNotes} onNote={onNote} />}
      {poi.tags && (
        <div className="flex flex-wrap gap-1">
          {poi.tags.map(t => (
            <span key={t} className="text-xs bg-cream-200 text-bark-500 border border-cream-300 px-2 py-0.5 rounded-full">{t}</span>
          ))}
        </div>
      )}
      <div className="flex items-center gap-3">
        <button onClick={() => onPhotos && onPhotos(poi)}
          className="inline-flex items-center gap-1 text-xs text-lake-600 hover:text-lake-800 font-semibold transition-colors">
          <Camera className="w-3.5 h-3.5" /> Photos &amp; Info
        </button>
        {onNote && <NoteButton hasNote={!!poi.userNotes} onNote={onNote} />}
        {onFavourite && <FavButton isFavourited={isFavourited} onFavourite={onFavourite} />}
        <a href={contactPoi.googleMapsUrl || makeGoogleMapsSearchLink(contactPoi)} target="_blank" rel="noreferrer noopener"
          className="inline-flex items-center gap-1 text-xs text-sun-700 hover:text-sun-800 font-semibold ml-auto">
          <ExternalLink className="w-3.5 h-3.5" /> Google Maps
        </a>
      </div>
    </div>
  );
}

export function TrailCard({ trail, onPhotos, editMode, onEdit, onDelete, onNote, isFavourited, onFavourite }) {
  const note = trail.samoyedNote || trail.seniorDogNote;
  const contactTrail = withContactOverride(trail, 'trails');
  return (
    <div className={`border rounded-xl p-4 space-y-2 bg-white shadow-card ${editMode ? 'border-sun-300' : 'border-stone-200'}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h4 className="font-semibold text-bark-800 text-sm">{trail.name}</h4>
          <ContactDetails item={contactTrail} />
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          {editMode && (
            <>
              <button onClick={() => onEdit && onEdit(trail)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-sun-100 text-bark-400 hover:text-sun-700 transition-colors" title="Edit">
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => onDelete && onDelete(trail.name)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-100 text-bark-400 hover:text-red-600 transition-colors" title="Delete">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </>
          )}
          <DifficultyBadge difficulty={trail.difficulty} />
        </div>
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
      {trail.userNotes && <UserNoteBlock note={trail.userNotes} onNote={onNote} />}
      <div className="flex flex-wrap items-center gap-2">
        {trail.dogFriendly && <DogBadge friendly={true} />}
        {trail.kidFriendly && <KidBadge friendly={true} />}
      </div>
      <div className="flex items-center gap-3">
        <button onClick={() => onPhotos && onPhotos(trail)}
          className="inline-flex items-center gap-1 text-xs text-lake-600 hover:text-lake-800 font-semibold transition-colors">
          <Camera className="w-3.5 h-3.5" /> Photos &amp; Info
        </button>
        {onNote && <NoteButton hasNote={!!trail.userNotes} onNote={onNote} />}
        {onFavourite && <FavButton isFavourited={isFavourited} onFavourite={onFavourite} />}
        <a href={contactTrail.googleMapsUrl || makeGoogleMapsSearchLink(contactTrail)} target="_blank" rel="noreferrer noopener"
          className="inline-flex items-center gap-1 text-xs text-sun-700 hover:text-sun-800 font-semibold ml-auto">
          <ExternalLink className="w-3.5 h-3.5" /> Google Maps
        </a>
      </div>
    </div>
  );
}

export function RestaurantCard({ restaurant, onPhotos, editMode, onEdit, onDelete, onNote, isFavourited, onFavourite }) {
  const contactRestaurant = withContactOverride(restaurant, 'restaurants');
  return (
    <div className={`border rounded-xl p-4 space-y-2 bg-white shadow-card ${editMode ? 'border-sun-300' : 'border-stone-200'}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h4 className="font-semibold text-bark-800 text-sm">{restaurant.name}</h4>
          <ContactDetails item={contactRestaurant} />
          <p className="text-xs text-bark-500 mt-0.5">{restaurant.cuisine}</p>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          {editMode && (
            <>
              <button onClick={() => onEdit && onEdit(restaurant)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-sun-100 text-bark-400 hover:text-sun-700 transition-colors" title="Edit">
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => onDelete && onDelete(restaurant.name)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-100 text-bark-400 hover:text-red-600 transition-colors" title="Delete">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </>
          )}
          <div className="flex flex-col gap-1 ml-1 items-end">
            <DogBadge friendly={restaurant.dogFriendly} />
            <PriceRange range={restaurant.priceRange} />
          </div>
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
      {restaurant.userNotes && <UserNoteBlock note={restaurant.userNotes} onNote={onNote} />}
      <div className="flex items-center gap-3">
        <button onClick={() => onPhotos && onPhotos(restaurant)}
          className="inline-flex items-center gap-1 text-xs text-lake-600 hover:text-lake-800 font-semibold transition-colors">
          <Camera className="w-3.5 h-3.5" /> Photos &amp; Info
        </button>
        {onNote && <NoteButton hasNote={!!restaurant.userNotes} onNote={onNote} />}
        {onFavourite && <FavButton isFavourited={isFavourited} onFavourite={onFavourite} />}
        <a href={contactRestaurant.googleMapsUrl || makeGoogleMapsSearchLink(contactRestaurant)} target="_blank" rel="noreferrer noopener"
          className="inline-flex items-center gap-1 text-xs text-sun-700 hover:text-sun-800 font-semibold ml-auto">
          <ExternalLink className="w-3.5 h-3.5" /> Google Maps
        </a>
      </div>
    </div>
  );
}

export function LodgingCard({ lodging, onPhotos, editMode, onEdit, onDelete, onNote, isFavourited, onFavourite }) {
  const contactLodging = withContactOverride(lodging, 'lodging');
  const priceClass = {
    '$$':   'text-leaf-600',
    '$$$':  'text-sun-600',
    '$$$$': 'text-red-600',
  };
  return (
    <div className={`border rounded-xl p-4 space-y-2 bg-white shadow-card ${editMode ? 'border-sun-300' : 'border-stone-200'}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h4 className="font-semibold text-bark-800 text-sm">{lodging.name}</h4>
          <ContactDetails item={contactLodging} />
          <p className="text-xs text-bark-500 mt-0.5">{lodging.type} · {lodging.rooms}</p>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          {editMode && (
            <>
              <button onClick={() => onEdit && onEdit(lodging)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-sun-100 text-bark-400 hover:text-sun-700 transition-colors" title="Edit">
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => onDelete && onDelete(lodging.name)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-100 text-bark-400 hover:text-red-600 transition-colors" title="Delete">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </>
          )}
          <span className={`text-sm font-bold ml-1 font-display ${priceClass[lodging.priceRange] || 'text-bark-600'}`}>
            {lodging.priceRange}
          </span>
        </div>
      </div>
      <div className="text-xs bg-leaf-50 text-leaf-800 border border-leaf-200 rounded-lg px-3 py-2 flex gap-2">
        <Dog className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
        <span>{lodging.petPolicy}</span>
      </div>
      <p className="text-xs text-bark-400 italic">{lodging.bookingNote}</p>
      {lodging.userNotes && <UserNoteBlock note={lodging.userNotes} onNote={onNote} />}
      <div className="flex items-center gap-3">
        <button onClick={() => onPhotos && onPhotos(lodging)}
          className="inline-flex items-center gap-1 text-xs text-lake-600 hover:text-lake-800 font-semibold transition-colors">
          <Camera className="w-3.5 h-3.5" /> Photos &amp; Info
        </button>
        {onNote && <NoteButton hasNote={!!lodging.userNotes} onNote={onNote} />}
        {onFavourite && <FavButton isFavourited={isFavourited} onFavourite={onFavourite} />}
        <a href={contactLodging.googleMapsUrl || makeGoogleMapsSearchLink(contactLodging)} target="_blank" rel="noreferrer noopener"
          className="inline-flex items-center gap-1 text-xs text-sun-700 hover:text-sun-800 font-semibold ml-auto">
          <ExternalLink className="w-3.5 h-3.5" /> Google Maps
        </a>
      </div>
    </div>
  );
}

// ── main ──────────────────────────────────────────────────────────────────────

export default function TripDetail({
  trip, activeSeason, onMoreInfo,
  isCustomTrip, onAddItem, onEditItem, onDeleteItem, onSaveTips, onDeleteTrip,
  onAddDay, onEditDay, onDeleteDay, onReorderDays,
  packingOverrides, onAddPacking, onDeletePacking,
  favourites, onToggleFav,
}) {
  const seasonTip = activeSeason !== 'all' ? trip.seasonTips?.[activeSeason] : null;
  const hasRestaurants = Array.isArray(trip.restaurants) && trip.restaurants.length > 0;
  const hasTripProfile = !!trip.tripProfile;
  const [selectedLeg, setSelectedLeg] = useState('all');
  const [attractionFilter, setAttractionFilter] = useState('all');
  const [lightboxItem, setLightboxItem] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editModal, setEditModal] = useState(null); // { section, item } | null
  const [confirmDelete, setConfirmDelete] = useState(null); // { section, name } | null
  const [dayModal, setDayModal] = useState(null); // null | 'new' | day object
  const [noteModal, setNoteModal] = useState(null); // null | { type:'item'|'day', label, current, onSave }

  function handleEdit(section, item) {
    setEditModal({ section, item });
  }
  function handleDelete(section, name) {
    setConfirmDelete({ section, name });
  }
  function commitDelete() {
    if (confirmDelete) onDeleteItem?.(trip.id, confirmDelete.section, confirmDelete.name);
    setConfirmDelete(null);
  }
  function handleSaveItem(data) {
    if (!editModal) return;
    const { section, item } = editModal;
    if (item) {
      onEditItem?.(trip.id, section, item.name, data);
    } else {
      onAddItem?.(trip.id, section, data);
    }
    setEditModal(null);
  }
  const isFav = (section, name) => (favourites?.[trip.id]?.[section] || []).includes(name);
  const toggleFav = (section, name) => onToggleFav?.(trip.id, section, name);

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
      return day.title.split(/→|to|-/i).map(s => s.trim()).filter(Boolean);
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
        className="relative overflow-hidden rounded-2xl px-5 py-4 text-white shadow-card-hover"
        style={{ background: `linear-gradient(140deg, ${trip.colorFrom}, ${trip.colorTo})` }}
      >
        {/* Decorative circle */}
        <div className="absolute -top-12 -right-12 w-52 h-52 rounded-full bg-white/10 pointer-events-none" />
        <div className="absolute -bottom-8 right-24 w-32 h-32 rounded-full bg-white/8 pointer-events-none" />

        <div className="relative flex items-center gap-3">
          <span className="text-2xl select-none flex-shrink-0">{trip.emoji}</span>
          <div className="min-w-0">
            <h2 className="font-display text-lg font-bold text-white leading-tight truncate">{trip.name}</h2>
            <div className="flex items-center flex-wrap gap-x-4 gap-y-0.5 mt-1">
              <span className="flex items-center gap-1 text-xs text-white/75 font-medium">
                <MapPin className="w-3 h-3" /> {trip.distanceKm} km
              </span>
              <span className="flex items-center gap-1 text-xs text-white/75 font-medium">
                <Clock className="w-3 h-3" /> {trip.driveHoursOneWay} hrs drive
              </span>
              <span className="flex items-center gap-1 text-xs text-white/75 font-medium">
                <Calendar className="w-3 h-3" /> {trip.duration}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-2 relative">
          {trip.route.googleMapsUrl && (
            <a
              href={trip.route.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-white/20 hover:bg-white/30 border border-white/30 transition-colors text-white text-xs font-semibold px-3 py-1.5 rounded-lg"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Google Maps
            </a>
          )}
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 bg-white/20 hover:bg-white/30 border border-white/30 transition-colors text-white text-xs font-semibold px-3 py-1.5 rounded-lg"
          >
            <Printer className="w-3.5 h-3.5" />
            Print
          </button>
          <button
            onClick={() => setEditMode(v => !v)}
            className={`inline-flex items-center gap-1.5 border text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
              editMode
                ? 'bg-sun-400 border-sun-300 text-bark-900 hover:bg-sun-500'
                : 'bg-white/20 hover:bg-white/30 border-white/30 text-white'
            }`}
          >
            {editMode ? <EyeOff className="w-3.5 h-3.5" /> : <Pencil className="w-3.5 h-3.5" />}
            {editMode ? 'Done Editing' : 'Edit'}
          </button>
          {isCustomTrip && editMode && (
            <button
              onClick={() => { if (window.confirm(`Delete "${trip.name}"? This cannot be undone.`)) onDeleteTrip?.(trip.id); }}
              className="inline-flex items-center gap-1.5 bg-red-500/80 hover:bg-red-600 border border-red-400 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" /> Delete
            </button>
          )}
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

      {/* Weather */}
      <WeatherSection trip={displayedTrip} activeSeason={activeSeason} />

      {/* Day-by-Day Itinerary — sequential, full width */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <SectionLabel>Day-by-Day Itinerary</SectionLabel>
          {editMode && (
            <button
              onClick={() => setDayModal('new')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-sun-100 hover:bg-sun-200 text-sun-800 transition-colors border border-sun-200"
            >
              <Plus className="w-3.5 h-3.5" /> Add Day
            </button>
          )}
        </div>
        <ItineraryDayList
          trip={trip}
          displayedTrip={displayedTrip}
          attractionFilter={attractionFilter}
          onMoreInfo={onMoreInfo}
          editMode={editMode}
          onEditDay={day => setDayModal(day)}
          onDeleteDay={dayNum => {
            if (window.confirm('Remove this day? This cannot be undone.')) {
              onDeleteDay?.(trip.id, dayNum);
            }
          }}
          onReorderDays={newDays => onReorderDays?.(trip.id, newDays)}
          onNoteDay={day => setNoteModal({
            label: `Day ${day.day}: ${day.title}`,
            current: day.userNotes,
            onSave: notes => onEditDay?.(trip.id, day.day, { userNotes: notes }),
          })}
        />
      </div>

      {/* Filter controls — placed directly above the resource tabs */}
      <div className="bg-white border border-stone-200 rounded-2xl p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h4 className="font-semibold text-bark-700 text-sm">Filter resources</h4>
            <p className="text-xs text-bark-400 mt-0.5">Narrow POI, trails, restaurants, and lodging by day or suitability.</p>
          </div>
          <div className="flex flex-wrap gap-3 items-center">
            <div className="inline-flex rounded-xl border border-stone-300 bg-cream-50 p-1 shadow-sm">
              {[
                { id: 'all', label: 'All' },
                { id: 'kids', label: '👶 Kids' },
                { id: 'dogs', label: '🐾 Dogs' },
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
            <select
              id="leg-filter"
              value={selectedLeg}
              onChange={e => setSelectedLeg(e.target.value)}
              className="rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm text-bark-700 shadow-sm"
              aria-label="Filter by day"
            >
              <option value="all">All days</option>
              {trip.route.itinerary.map(day => (
                <option key={day.day} value={String(day.day)}>
                  Day {day.day}: {day.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="poi">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="poi" className="flex items-center gap-1.5 text-xs">
            <MapPin className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Points of Interest</span>
            <span className="sm:hidden">POI</span>
          </TabsTrigger>
          <TabsTrigger value="trails" className="flex items-center gap-1.5 text-xs">
            <Footprints className="w-3.5 h-3.5" />
            Trails
          </TabsTrigger>
          <TabsTrigger value="restaurants" className="flex items-center gap-1.5 text-xs">
            <Utensils className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Restaurants</span>
            <span className="sm:hidden">Eat</span>
          </TabsTrigger>
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

        <TabsContent value="poi" className="mt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPoi.length > 0 ? filteredPoi.map(p => (
              <POICard key={`${p.sourceId || p.name}-${p.day || 'all'}-${p.location || ''}`} poi={p}
                onPhotos={setLightboxItem} editMode={editMode}
                onEdit={item => handleEdit('poi', item)}
                onDelete={name => handleDelete('poi', name)}
                onNote={() => setNoteModal({ label: p.name, current: p.userNotes, onSave: notes => onEditItem?.(trip.id, 'poi', p.name, { ...p, userNotes: notes }) })}
                isFavourited={isFav('poi', p.name)} onFavourite={() => toggleFav('poi', p.name)} />
            )) : <p className="text-sm text-bark-500">No points of interest are assigned to this leg.</p>}
          </div>
          {editMode && (
            <button onClick={() => setEditModal({ section: 'poi', item: null })}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-sun-700 hover:text-sun-800 border border-sun-300 hover:border-sun-400 rounded-xl px-4 py-2 bg-sun-50 transition-colors">
              <Plus className="w-4 h-4" /> Add Point of Interest
            </button>
          )}
        </TabsContent>

        <TabsContent value="trails" className="mt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTrails.length > 0 ? filteredTrails.map(t => (
              <TrailCard key={`${t.name}-${t.day || 'all'}-${t.location || ''}`} trail={t}
                onPhotos={setLightboxItem} editMode={editMode}
                onEdit={item => handleEdit('trails', item)}
                onDelete={name => handleDelete('trails', name)}
                onNote={() => setNoteModal({ label: t.name, current: t.userNotes, onSave: notes => onEditItem?.(trip.id, 'trails', t.name, { ...t, userNotes: notes }) })}
                isFavourited={isFav('trails', t.name)} onFavourite={() => toggleFav('trails', t.name)} />
            )) : <p className="text-sm text-bark-500">No trails are assigned to this leg.</p>}
          </div>
          {editMode && (
            <button onClick={() => setEditModal({ section: 'trails', item: null })}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-sun-700 hover:text-sun-800 border border-sun-300 hover:border-sun-400 rounded-xl px-4 py-2 bg-sun-50 transition-colors">
              <Plus className="w-4 h-4" /> Add Trail
            </button>
          )}
        </TabsContent>

        <TabsContent value="restaurants" className="mt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredRestaurants.length > 0 ? filteredRestaurants.map(r => (
              <RestaurantCard key={`${r.name}-${r.day || 'all'}-${r.location || ''}`} restaurant={r}
                onPhotos={setLightboxItem} editMode={editMode}
                onEdit={item => handleEdit('restaurants', item)}
                onDelete={name => handleDelete('restaurants', name)}
                onNote={() => setNoteModal({ label: r.name, current: r.userNotes, onSave: notes => onEditItem?.(trip.id, 'restaurants', r.name, { ...r, userNotes: notes }) })}
                isFavourited={isFav('restaurants', r.name)} onFavourite={() => toggleFav('restaurants', r.name)} />
            )) : <p className="text-sm text-bark-500">No restaurants are assigned to this leg.</p>}
          </div>
          {editMode && (
            <button onClick={() => setEditModal({ section: 'restaurants', item: null })}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-sun-700 hover:text-sun-800 border border-sun-300 hover:border-sun-400 rounded-xl px-4 py-2 bg-sun-50 transition-colors">
              <Plus className="w-4 h-4" /> Add Restaurant
            </button>
          )}
        </TabsContent>

        <TabsContent value="lodging" className="mt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredLodging.length > 0 ? filteredLodging.map(l => (
              <LodgingCard key={`${l.name}-${l.day || 'all'}-${l.location || ''}`} lodging={l}
                onPhotos={setLightboxItem} editMode={editMode}
                onEdit={item => handleEdit('lodging', item)}
                onDelete={name => handleDelete('lodging', name)}
                onNote={() => setNoteModal({ label: l.name, current: l.userNotes, onSave: notes => onEditItem?.(trip.id, 'lodging', l.name, { ...l, userNotes: notes }) })}
                isFavourited={isFav('lodging', l.name)} onFavourite={() => toggleFav('lodging', l.name)} />
            )) : <p className="text-sm text-bark-500">No lodging is assigned to this leg.</p>}
          </div>
          {editMode && (
            <button onClick={() => setEditModal({ section: 'lodging', item: null })}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-sun-700 hover:text-sun-800 border border-sun-300 hover:border-sun-400 rounded-xl px-4 py-2 bg-sun-50 transition-colors">
              <Plus className="w-4 h-4" /> Add Lodging
            </button>
          )}
        </TabsContent>

        <TabsContent value="tips" className="mt-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {Object.entries(trip.seasonTips || {}).map(([season, tip]) => (
              <div key={season} className="bg-white border border-stone-200 rounded-xl p-4 space-y-1 shadow-card">
                <h4 className="font-semibold text-bark-700 text-sm">
                  {season === 'june' ? '☀️ June' : season === 'late-august' ? '🌻 Late August' : '🍂 Early September'}
                </h4>
                {editMode ? (
                  <textarea
                    defaultValue={tip}
                    rows={4}
                    onBlur={e => {
                      const updated = { ...(trip.seasonTips || {}), [season]: e.target.value };
                      onSaveTips?.(trip.id, updated);
                    }}
                    className="w-full text-xs text-bark-600 leading-relaxed border border-sun-300 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-sun-400 resize-none bg-sun-50"
                  />
                ) : (
                  <p className="text-xs text-bark-600 leading-relaxed">{tip}</p>
                )}
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
          <TripPackingList editMode={editMode} packingOverrides={packingOverrides} onAdd={onAddPacking} onDelete={onDeletePacking} />
        </TabsContent>
      </Tabs>

      {lightboxItem && <PlaceLightbox item={lightboxItem} onClose={() => setLightboxItem(null)} />}

      {editModal && (
        <EditItemModal
          section={editModal.section}
          initialData={editModal.item}
          onSave={handleSaveItem}
          onClose={() => setEditModal(null)}
        />
      )}

      {noteModal && (
        <NoteModal
          title={noteModal.label}
          initialNote={noteModal.current}
          onSave={noteModal.onSave}
          onClose={() => setNoteModal(null)}
        />
      )}

      {dayModal && (
        <EditDayModal
          day={dayModal === 'new' ? null : dayModal}
          onSave={data => {
            if (dayModal === 'new') {
              onAddDay?.(trip.id, data);
            } else {
              onEditDay?.(trip.id, dayModal.day, data);
            }
            setDayModal(null);
          }}
          onClose={() => setDayModal(null)}
        />
      )}

      {confirmDelete && (
        <div style={{ position:'fixed', inset:0, zIndex:99999, backgroundColor:'rgba(0,0,0,0.55)',
                      display:'flex', alignItems:'center', justifyContent:'center', padding:'16px' }}
          onMouseDown={e => { if (e.target === e.currentTarget) setConfirmDelete(null); }}>
          <div style={{ background:'#fff', borderRadius:16, padding:24, maxWidth:360, width:'100%', boxShadow:'0 16px 48px rgba(0,0,0,0.3)' }}
            onMouseDown={e => e.stopPropagation()}>
            <h3 className="font-display font-bold text-bark-900 text-base mb-2">Delete this item?</h3>
            <p className="text-sm text-bark-600 mb-5">
              <strong>{confirmDelete.name}</strong> will be removed from this trip. This cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setConfirmDelete(null)} className="px-4 py-2 rounded-xl text-sm text-bark-600 hover:bg-stone-100 transition-colors">Cancel</button>
              <button onClick={commitDelete} className="px-5 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-bold transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}
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
