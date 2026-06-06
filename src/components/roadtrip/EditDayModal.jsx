import { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Plus, Trash2 } from 'lucide-react';

export default function EditDayModal({ day, onSave, onClose }) {
  const isNew = !day;
  const [title, setTitle]       = useState(day?.title       ?? '');
  const [desc, setDesc]         = useState(day?.desc        ?? '');
  const [userNotes, setUserNotes] = useState(day?.userNotes ?? '');
  const [highlights, setHighlights] = useState(day?.highlights ?? []);
  const [newHighlight, setNewHighlight] = useState('');

  function addHighlight() {
    const v = newHighlight.trim();
    if (!v) return;
    setHighlights(h => [...h, v]);
    setNewHighlight('');
  }

  function removeHighlight(i) {
    setHighlights(h => h.filter((_, idx) => idx !== i));
  }

  function handleSave() {
    if (!title.trim()) return;
    onSave({ title: title.trim(), desc: desc.trim(), highlights, userNotes: userNotes.trim() });
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
          <h2 className="font-display font-bold text-bark-900 text-base">
            {isNew ? 'Add Day' : 'Edit Day'}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-stone-100 text-bark-400">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-bark-500 uppercase tracking-wide mb-1.5">
              Title <span className="text-red-400">*</span>
            </label>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Toronto → Kingston"
              className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm text-bark-800 focus:outline-none focus:border-sun-400 focus:ring-1 focus:ring-sun-300"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-bark-500 uppercase tracking-wide mb-1.5">
              Description
            </label>
            <textarea
              value={desc}
              onChange={e => setDesc(e.target.value)}
              placeholder="What's happening on this day?"
              rows={3}
              className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm text-bark-800 focus:outline-none focus:border-sun-400 focus:ring-1 focus:ring-sun-300 resize-none"
            />
          </div>

          {/* My Notes */}
          <div>
            <label className="block text-xs font-semibold text-bark-500 uppercase tracking-wide mb-1.5">
              My Notes
            </label>
            <textarea
              value={userNotes}
              onChange={e => setUserNotes(e.target.value)}
              placeholder="Personal notes for this day…"
              rows={3}
              className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm text-bark-800 focus:outline-none focus:border-sun-400 focus:ring-1 focus:ring-sun-300 resize-none"
            />
          </div>

          {/* Highlights */}
          <div>
            <label className="block text-xs font-semibold text-bark-500 uppercase tracking-wide mb-1.5">
              Highlights
            </label>
            <div className="space-y-1.5 mb-2">
              {highlights.map((h, i) => (
                <div key={i} className="flex items-center gap-2 bg-sun-50 border border-sun-200 rounded-lg px-3 py-1.5">
                  <span className="flex-1 text-sm text-bark-700">{h}</span>
                  <button onClick={() => removeHighlight(i)} className="text-bark-300 hover:text-red-500">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={newHighlight}
                onChange={e => setNewHighlight(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addHighlight())}
                placeholder="Add a highlight…"
                className="flex-1 border border-stone-200 rounded-xl px-3 py-2 text-sm text-bark-800 focus:outline-none focus:border-sun-400 focus:ring-1 focus:ring-sun-300"
              />
              <button
                onClick={addHighlight}
                className="px-3 py-2 rounded-xl bg-sun-100 hover:bg-sun-200 text-sun-800 text-xs font-semibold transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-stone-100 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded-xl text-sm font-semibold text-bark-500 hover:bg-stone-100 transition-colors">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!title.trim()}
            className="px-4 py-2 rounded-xl text-sm font-bold bg-sun-500 hover:bg-sun-600 text-bark-950 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isNew ? 'Add Day' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
