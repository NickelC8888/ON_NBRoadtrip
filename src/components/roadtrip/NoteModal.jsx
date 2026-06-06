import { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, StickyNote } from 'lucide-react';

export default function NoteModal({ title, initialNote, onSave, onClose }) {
  const [note, setNote] = useState(initialNote ?? '');

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-stone-100">
          <StickyNote className="w-4 h-4 text-sun-500 flex-shrink-0" />
          <h2 className="font-display font-bold text-bark-900 text-sm flex-1 truncate">
            Notes — {title}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-stone-100 text-bark-400">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-5 py-4">
          <textarea
            autoFocus
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="Add your personal notes here…"
            rows={5}
            className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm text-bark-800 focus:outline-none focus:border-sun-400 focus:ring-1 focus:ring-sun-300 resize-none"
          />
        </div>

        <div className="px-5 py-4 border-t border-stone-100 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded-xl text-sm font-semibold text-bark-500 hover:bg-stone-100 transition-colors">
            Cancel
          </button>
          <button
            onClick={() => { onSave(note.trim()); onClose(); }}
            className="px-4 py-2 rounded-xl text-sm font-bold bg-sun-500 hover:bg-sun-600 text-bark-950 transition-colors"
          >
            Save Note
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
