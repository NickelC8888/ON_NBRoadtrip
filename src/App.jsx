import { useState } from 'react';
import { Dog, MapPin, Github, LogIn } from 'lucide-react';
import RoadTripPlanner from './pages/RoadTripPlanner.jsx';
import { useAuth } from './hooks/useAuth.js';
import AuthModal from './components/auth/AuthModal.jsx';
import UserMenu from './components/auth/UserMenu.jsx';

export default function App() {
  const { user, loading, register, login, logout } = useAuth();
  const [showAuth, setShowAuth] = useState(false);

  async function handleAuthSuccess(tab, creds) {
    if (tab === 'login') await login(creds);
    else await register(creds);
    setShowAuth(false);
  }

  return (
    <div className="min-h-screen font-sans text-bark-900 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-sun-200 bg-cream-100/95 backdrop-blur-md shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-sun-500 flex items-center justify-center shadow-sm flex-shrink-0">
              <MapPin className="w-4.5 h-4.5 text-white" strokeWidth={2.5} />
            </div>
            <div className="flex flex-col leading-none gap-0.5">
              <span className="font-display font-bold text-lg text-bark-900 tracking-tight leading-none">
                Ontario{' '}
                <span className="text-sun-600">Road Trip</span>
              </span>
              <span className="text-[10px] text-bark-400 font-medium tracking-[0.15em] uppercase leading-none">
                Family Planner
              </span>
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-3">
            <span className="hidden md:flex items-center gap-1.5 text-xs text-leaf-700 bg-leaf-50 border border-leaf-200 px-3 py-1.5 rounded-full font-medium">
              <Dog className="w-3.5 h-3.5" />
              Toronto-based · Dog-friendly
            </span>
            <a
              href="https://github.com/NickelC8888/family-road-trip-planner"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-bark-500 hover:text-sun-600 transition-colors duration-200 font-medium"
            >
              <Github className="w-4 h-4" />
              <span className="hidden sm:inline text-xs">GitHub</span>
            </a>
            {!loading && (
              user
                ? <UserMenu user={user} onLogout={logout} />
                : (
                  <button
                    onClick={() => setShowAuth(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sun-500 hover:bg-sun-600 text-bark-950 text-xs font-bold shadow-sm transition-colors"
                  >
                    <LogIn className="w-3.5 h-3.5" /> Sign In
                  </button>
                )
            )}
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8 md:py-12">
        <RoadTripPlanner user={user} />
      </main>

      {showAuth && (
        <AuthModal onSuccess={handleAuthSuccess} onClose={() => setShowAuth(false)} />
      )}

      {/* Footer */}
      <footer className="border-t border-sun-100 bg-cream-200 py-6 mt-auto">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-bark-400 text-xs font-medium">
          <p>© {new Date().getFullYear()} Ontario Road Trip Planner — for planning purposes only</p>
          <p className="flex items-center gap-1.5">
            <Dog className="w-3.5 h-3.5 text-sun-400" />
            Always verify dog policies before visiting
          </p>
        </div>
      </footer>
    </div>
  );
}
