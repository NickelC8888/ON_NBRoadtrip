import { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Save } from 'lucide-react';

// ── Field configs per section type ────────────────────────────────────────────
const FIELDS = {
  poi: [
    { key: 'name',        label: 'Name',        type: 'text',     required: true },
    { key: 'location',    label: 'Location',    type: 'text' },
    { key: 'address',     label: 'Address',     type: 'text' },
    { key: 'description', label: 'Description', type: 'textarea' },
    { key: 'day',         label: 'Day #',       type: 'number' },
    { key: 'kidFriendly', label: 'Kid-friendly',type: 'checkbox' },
    { key: 'dogFriendly', label: 'Dog-friendly',type: 'checkbox' },
  ],
  trails: [
    { key: 'name',        label: 'Name',        type: 'text',     required: true },
    { key: 'location',    label: 'Location',    type: 'text' },
    { key: 'address',     label: 'Address',     type: 'text' },
    { key: 'description', label: 'Description', type: 'textarea' },
    { key: 'day',         label: 'Day #',       type: 'number' },
    { key: 'difficulty',  label: 'Difficulty',  type: 'select', options: ['easy', 'moderate', 'hard'] },
    { key: 'lengthKm',    label: 'Length (km)', type: 'number' },
    { key: 'duration',    label: 'Duration',    type: 'text' },
    { key: 'dogFriendly', label: 'Dog-friendly',type: 'checkbox' },
    { key: 'kidFriendly', label: 'Kid-friendly',type: 'checkbox' },
  ],
  restaurants: [
    { key: 'name',        label: 'Name',        type: 'text',     required: true },
    { key: 'location',    label: 'Location',    type: 'text' },
    { key: 'address',     label: 'Address',     type: 'text' },
    { key: 'cuisine',     label: 'Cuisine',     type: 'text' },
    { key: 'description', label: 'Notes',       type: 'textarea' },
    { key: 'day',         label: 'Day #',       type: 'number' },
    { key: 'dogFriendly', label: 'Dog-friendly patio', type: 'checkbox' },
    { key: 'kidFriendly', label: 'Kid-friendly',type: 'checkbox' },
  ],
  lodging: [
    { key: 'name',        label: 'Name',        type: 'text',     required: true },
    { key: 'location',    label: 'Location',    type: 'text' },
    { key: 'address',     label: 'Address',     type: 'text' },
    { key: 'description', label: 'Notes',       type: 'textarea' },
    { key: 'day',         label: 'Night #',     type: 'number' },
    { key: 'dogFriendly', label: 'Pet-friendly',type: 'checkbox' },
  ],
  stops: [
    { key: 'name',        label: 'Name',        type: 'text',     required: true },
    { key: 'description', label: 'Description', type: 'textarea' },
  ],
};

const SECTION_LABELS = {
  poi:         'Point of Interest',
  trails:      'Trail',
  restaurants: 'Restaurant',
  lodging:     'Lodging',
  stops:       'Destination Stop',
};

function ModalContent({ section, initialData, onSave, onClose }) {
  const fields = FIELDS[section] || FIELDS.poi;
  const [form, setForm] = useState(() => {
    const defaults = {};
    fields.forEach(f => {
      defaults[f.key] = initialData?.[f.key] ?? (f.type === 'checkbox' ? false : f.type === 'number' ? '' : '');
    });
    return defaults;
  });
  const [error, setError] = useState('');

  function set(key, value) { setForm(f => ({ ...f, [key]: value })); }

  function handleSubmit(e) {
    e.preventDefault();
    const req = fields.find(f => f.required && !form[f.key]?.toString().trim());
    if (req) { setError(`${req.label} is required.`); return; }
    const cleaned = { ...form };
    fields.forEach(f => {
      if (f.type === 'number' && cleaned[f.key] !== '') cleaned[f.key] = Number(cleaned[f.key]);
      if (f.type === 'number' && cleaned[f.key] === '') delete cleaned[f.key];
    });
    onSave(cleaned);
  }

  const isEdit = !!initialData;
  const title = isEdit
    ? `Edit ${SECTION_LABELS[section] || section}`
    : `Add ${SECTION_LABELS[section] || section}`;

  return (
    <div
      style={{ position:'fixed', inset:0, zIndex:99999, backgroundColor:'rgba(0,0,0,0.65)',
               display:'flex', alignItems:'center', justifyContent:'center', padding:'16px' }}
      onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        style={{ backgroundColor:'#fff', borderRadius:16, boxShadow:'0 24px 64px rgba(0,0,0,0.35)',
                 width:'100%', maxWidth:520, maxHeight:'90vh', display:'flex', flexDirection:'column', overflow:'hidden' }}
        onMouseDown={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100 flex-shrink-0">
          <h2 className="font-display font-bold text-bark-900 text-base">{title}</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-stone-100 text-bark-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {fields.map(f => (
            <div key={f.key}>
              {f.type === 'checkbox' ? (
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={!!form[f.key]}
                    onChange={e => set(f.key, e.target.checked)}
                    className="w-4 h-4 rounded accent-sun-500"
                  />
                  <span className="text-sm text-bark-700 font-medium">{f.label}</span>
                </label>
              ) : (
                <div>
                  <label className="block text-xs font-semibold text-bark-600 mb-1">
                    {f.label}{f.required && <span className="text-red-400 ml-0.5">*</span>}
                  </label>
                  {f.type === 'textarea' ? (
                    <textarea
                      value={form[f.key]}
                      onChange={e => set(f.key, e.target.value)}
                      rows={3}
                      className="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm text-bark-800 focus:outline-none focus:ring-2 focus:ring-sun-400 resize-none"
                    />
                  ) : f.type === 'select' ? (
                    <select
                      value={form[f.key]}
                      onChange={e => set(f.key, e.target.value)}
                      className="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm text-bark-800 focus:outline-none focus:ring-2 focus:ring-sun-400 bg-white"
                    >
                      <option value="">— select —</option>
                      {f.options.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  ) : (
                    <input
                      type={f.type}
                      value={form[f.key]}
                      onChange={e => set(f.key, e.target.value)}
                      className="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm text-bark-800 focus:outline-none focus:ring-2 focus:ring-sun-400"
                    />
                  )}
                </div>
              )}
            </div>
          ))}

          {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-stone-100 flex-shrink-0 bg-stone-50">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-sm text-bark-600 hover:bg-stone-200 transition-colors">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-sun-500 hover:bg-sun-600 text-bark-950 text-sm font-bold shadow-sm transition-colors"
          >
            <Save className="w-4 h-4" />
            {isEdit ? 'Save Changes' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function EditItemModal({ section, initialData, onSave, onClose }) {
  return createPortal(
    <ModalContent section={section} initialData={initialData} onSave={onSave} onClose={onClose} />,
    document.body
  );
}
