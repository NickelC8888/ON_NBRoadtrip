import { Dog, MapPin, Github } from 'lucide-react';
import RoadTripPlanner from './pages/RoadTripPlanner.jsx';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-violet-600 p-2 rounded-lg">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight text-slate-800">
                Ontario <span className="text-violet-600">Road Trip</span> Planner
              </span>
              <span className="hidden sm:block text-xs text-slate-400 leading-none">
                Family · Kids · Dog-friendly
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden md:flex items-center gap-1.5 text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
              <Dog className="w-3.5 h-3.5 text-violet-600" />
              Toronto-based trips
            </span>
            <a
              href="https://github.com/NickelC8888/family-road-trip-planner"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-slate-600 hover:text-violet-600 transition-colors"
            >
              <Github className="w-4 h-4" />
              <span className="hidden sm:inline">GitHub</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8 md:py-12">
        <RoadTripPlanner />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-auto">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-slate-400 text-sm">
          <p>© {new Date().getFullYear()} Ontario Family Road Trip Planner. For planning purposes only.</p>
          <p className="flex items-center gap-1">
            <Dog className="w-3.5 h-3.5 text-violet-400" />
            Always verify dog policies before visiting.
          </p>
        </div>
      </footer>
    </div>
  );
}
