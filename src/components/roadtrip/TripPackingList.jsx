import { useState } from 'react';
import { ChevronDown, ChevronUp, CheckSquare, Square, RotateCcw, Trash2, Plus } from 'lucide-react';

const CATEGORIES = [
  {
    id: 'essentials',
    label: '📋 Trip Essentials',
    items: [
      'Valid ID / passports (needed crossing into Québec — good habit)',
      'Health cards (OHIP) for all family members',
      'Pet vaccination records + vet contact info',
      'Car insurance + roadside assistance info',
      'Phone chargers + portable power bank',
      'Cash (small towns / markets may be cash-only)',
      'Reusable water bottles (one per person)',
      'First aid kit',
      'Sunscreen SPF 50+',
      'Bug spray (DEET or natural) — especially for Muskoka in June',
      'Printed or downloaded offline maps (no cell signal in parks)',
      'Snack bag: granola bars, nuts, fruit, crackers for the road',
    ],
  },
  {
    id: 'dog',
    label: '🐾 Dog Gear',
    items: [
      'Collapsible water bowl (pack 2)',
      'Enough food for the full trip + 1 extra day',
      'Water — carry 2 L dedicated to the dog on hike days',
      'Leash (6 ft standard) + backup leash',
      'Harness (easier for longer hikes than collar)',
      'Dog waste bags (100+)',
      'Dog first aid kit: antiseptic, gauze, tweezers for ticks',
      'Flea, tick & heartworm prevention (up to date)',
      'Cooling mat for the van',
      'Towel for wet / muddy paws',
      'Dog bed or familiar blanket (reduces hotel anxiety)',
      'Calming treats / anxiety vest if your dog is car-nervous',
      'Vet records + proof of rabies vaccination',
      'Recent photo of your dog (in case of separation)',
      'Paw wax / boots for hot pavement days',
    ],
  },
  {
    id: 'kids',
    label: '👧 Kids Gear',
    items: [
      'Sunhats for each child',
      'Swimsuits + rash guards',
      'Change of clothes per day + 2 extras',
      'Rain jacket (always)',
      'Closed-toe shoes for hiking',
      'Sandals for beach days',
      'Small backpack each child can carry (snacks + water)',
      'Favourite stuffed animal / comfort item',
      'Audiobooks / podcasts downloaded for long drives',
      'Tablet or device + headphones (fully charged)',
      'Car sickness medication if needed',
      'Sunscreen stick (kids will actually use it)',
      'Allergy medication + EpiPen if applicable',
    ],
  },
  {
    id: 'hiking',
    label: '🥾 Hiking & Outdoors',
    items: [
      'Daypack (20–30L) with hip belt for weight distribution',
      'Trail snacks: energy bars, dried fruit, nuts',
      'Water filter or purification tablets (backcountry)',
      'Trekking poles (optional — great on rocky Bruce Peninsula trails)',
      'Tick removal tool',
      'Whistle + small flashlight per person',
      'Dry bags for electronics and snacks',
      'Microfibre towels (quick-dry, pack small)',
      'Insect head nets (early June in Muskoka)',
      'Bear spray (Gatineau Park / Algonquin area)',
      'Trail map downloaded offline (AllTrails or Gaia GPS)',
    ],
  },
  {
    id: 'van',
    label: '🚐 Van & Road Gear',
    items: [
      'Full tank of gas before leaving Toronto',
      'Tire pressure checked (including spare)',
      'Roof rack load secured and locked',
      'Car vacuum or brush (dog hair is relentless)',
      'Seat cover / cargo liner for dog area',
      'Portable cooler for food and dog water',
      'Paper towels + all-purpose cleaning spray',
      'Zip-lock bags (various sizes — endlessly useful)',
      'Bungee cords + cargo net for roof rack',
      'Jumper cables or jump starter pack',
      'Small toolkit (screwdrivers, duct tape, zip ties)',
      'Parking coins / Honk app loaded for Ontario meters',
      'Campsite or trail parking day-pass printed if required',
    ],
  },
  {
    id: 'overnight',
    label: '🛏️ Hotel & Overnight',
    items: [
      'All lodging confirmation numbers saved offline',
      'Portable door alarm (peace of mind in unfamiliar rooms)',
      'White noise app or small fan (kids sleep better)',
      'Night light (plug-in, kids in unfamiliar bathrooms)',
      'Laundry pods + dryer sheets (1 load mid-trip)',
      'Foldable luggage scale if flying home',
      'Extension cord / power bar (hotel outlets are never where you need them)',
      'Dog-specific: bring dog bed, put towel on hotel bedding, tip housekeeping extra',
    ],
  },
];

export default function TripPackingList({ editMode, packingOverrides, onAdd, onDelete }) {
  // Merge base categories with user overrides
  const categories = CATEGORIES.map(cat => {
    const added   = packingOverrides?.added?.[cat.id]   || [];
    const deleted = packingOverrides?.deleted?.[cat.id] || [];
    return {
      ...cat,
      items: [...cat.items.filter(i => !deleted.includes(i)), ...added],
    };
  });

  const totalItems = categories.reduce((n, c) => n + c.items.length, 0);
  const [checked, setChecked] = useState(new Set());

  function toggle(key) {
    setChecked(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }

  function reset() { setChecked(new Set()); }

  const checkedCount = checked.size;
  const pct = Math.round((checkedCount / totalItems) * 100);

  return (
    <div className="space-y-4">
      {/* Header bar */}
      <div className="flex items-center justify-between bg-cream-100 border border-sun-100 rounded-xl px-4 py-3">
        <div className="space-y-1.5">
          <p className="text-sm text-bark-600">
            <span className="font-bold text-bark-800">{checkedCount}</span>
            <span className="text-bark-400"> of {totalItems} items packed</span>
          </p>
          <div className="h-2 w-48 bg-cream-300 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{ width: `${pct}%`, background: 'linear-gradient(to right, #f59e0b, #fbbf24)' }}
            />
          </div>
        </div>
        {checkedCount > 0 && (
          <button
            onClick={reset}
            className="flex items-center gap-1.5 text-xs text-bark-400 hover:text-sun-600 transition-colors font-medium"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>
        )}
      </div>

      {categories.map(cat => (
        <CategorySection
          key={cat.id}
          category={cat}
          checked={checked}
          onToggle={toggle}
          editMode={editMode}
          onAdd={onAdd}
          onDelete={onDelete}
        />
      ))}

      {pct === 100 && (
        <div className="text-center py-5 bg-leaf-50 border-2 border-leaf-200 rounded-2xl text-leaf-700 font-semibold text-sm">
          🎒 All packed — have an amazing trip!
        </div>
      )}
    </div>
  );
}

function CategorySection({ category, checked, onToggle, editMode, onAdd, onDelete }) {
  const [open, setOpen] = useState(false);
  const [newItem, setNewItem] = useState('');
  const catChecked = category.items.filter(item => checked.has(`${category.id}::${item}`)).length;
  const allDone = catChecked === category.items.length && category.items.length > 0;

  function submitAdd(e) {
    e.preventDefault();
    const text = newItem.trim();
    if (!text) return;
    onAdd?.(category.id, text);
    setNewItem('');
  }

  return (
    <div className={`border rounded-xl overflow-hidden transition-colors shadow-card ${allDone ? 'border-leaf-300' : editMode ? 'border-sun-200' : 'border-stone-200'}`}>
      <button
        onClick={() => setOpen(o => !o)}
        className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors ${allDone ? 'bg-leaf-50 hover:bg-leaf-100' : editMode ? 'bg-sun-50 hover:bg-sun-100' : 'bg-cream-100 hover:bg-cream-200'}`}
      >
        <div className="flex items-center gap-3">
          <span className={`font-semibold text-sm ${allDone ? 'text-leaf-700' : 'text-bark-800'}`}>
            {category.label}
          </span>
          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold border ${allDone ? 'bg-leaf-100 text-leaf-700 border-leaf-300' : 'bg-cream-200 text-bark-500 border-cream-300'}`}>
            {catChecked}/{category.items.length}
          </span>
        </div>
        {open
          ? <ChevronUp className="w-4 h-4 text-bark-400 flex-shrink-0" />
          : <ChevronDown className="w-4 h-4 text-bark-400 flex-shrink-0" />}
      </button>

      {open && (
        <div className="bg-white">
          <ul className="divide-y divide-stone-100">
            {category.items.map(item => {
              const key = `${category.id}::${item}`;
              const isChecked = checked.has(key);
              return (
                <li key={item} className="flex items-center">
                  <button
                    onClick={() => onToggle(key)}
                    className="flex-1 flex items-start gap-3 px-4 py-2.5 text-left hover:bg-cream-100 transition-colors"
                  >
                    {isChecked
                      ? <CheckSquare className="w-4 h-4 text-leaf-500 flex-shrink-0 mt-0.5" />
                      : <Square className="w-4 h-4 text-stone-300 flex-shrink-0 mt-0.5" />}
                    <span className={`text-sm leading-snug ${isChecked ? 'line-through text-bark-300' : 'text-bark-700'}`}>
                      {item}
                    </span>
                  </button>
                  {editMode && (
                    <button
                      onClick={() => onDelete?.(category.id, item)}
                      className="w-8 h-8 mr-2 flex items-center justify-center rounded-lg hover:bg-red-100 text-bark-300 hover:text-red-500 transition-colors flex-shrink-0"
                      title="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
          {editMode && (
            <form onSubmit={submitAdd} className="flex gap-2 px-4 py-3 border-t border-stone-100 bg-sun-50">
              <input
                value={newItem}
                onChange={e => setNewItem(e.target.value)}
                placeholder="Add item…"
                className="flex-1 rounded-xl border border-sun-300 px-3 py-1.5 text-sm text-bark-800 focus:outline-none focus:ring-2 focus:ring-sun-400 bg-white"
              />
              <button type="submit"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-sun-500 hover:bg-sun-600 text-bark-950 text-xs font-bold transition-colors">
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
