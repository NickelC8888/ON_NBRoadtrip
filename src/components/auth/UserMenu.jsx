import { useState, useRef, useEffect } from 'react';
import { LogOut, ChevronDown, User } from 'lucide-react';

export default function UserMenu({ user, onLogout }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const initials = user.name
    ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : user.email[0].toUpperCase();

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-sun-50 hover:bg-sun-100 border border-sun-200 transition-colors"
      >
        <div className="w-6 h-6 rounded-full bg-sun-500 flex items-center justify-center text-bark-950 text-xs font-bold flex-shrink-0">
          {initials}
        </div>
        <span className="text-xs font-semibold text-bark-700 max-w-[120px] truncate hidden sm:block">
          {user.name || user.email}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-bark-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1.5 w-52 bg-white border border-stone-200 rounded-xl shadow-lg overflow-hidden z-50">
          <div className="px-3 py-2.5 border-b border-stone-100">
            <div className="flex items-center gap-2">
              <User className="w-3.5 h-3.5 text-bark-400 flex-shrink-0" />
              <div className="min-w-0">
                {user.name && <p className="text-xs font-semibold text-bark-800 truncate">{user.name}</p>}
                <p className="text-xs text-bark-400 truncate">{user.email}</p>
              </div>
            </div>
          </div>
          <button
            onClick={() => { setOpen(false); onLogout(); }}
            className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
