import { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Mail, Lock, User, LogIn, UserPlus, AlertCircle } from 'lucide-react';

function ModalContent({ onSuccess, onClose }) {
  const [tab,      setTab]      = useState('login');   // 'login' | 'register'
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [name,     setName]     = useState('');
  const [error,    setError]    = useState('');
  const [busy,     setBusy]     = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await onSuccess(tab, { email, password, name });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      style={{ position:'fixed', inset:0, zIndex:99999, backgroundColor:'rgba(0,0,0,0.65)',
               display:'flex', alignItems:'center', justifyContent:'center', padding:'16px' }}
      onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        style={{ backgroundColor:'#fff', borderRadius:16, boxShadow:'0 24px 64px rgba(0,0,0,0.35)',
                 width:'100%', maxWidth:420, overflow:'hidden' }}
        onMouseDown={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
          <div>
            <h2 className="font-display font-bold text-bark-900 text-base">
              {tab === 'login' ? 'Welcome back' : 'Create account'}
            </h2>
            <p className="text-xs text-bark-400 mt-0.5">
              {tab === 'login' ? 'Sign in to sync your trips across devices' : 'Save your trips and access them anywhere'}
            </p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-stone-100 text-bark-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-stone-100">
          {[['login','Sign In'],['register','Create Account']].map(([id, label]) => (
            <button key={id} onClick={() => { setTab(id); setError(''); }}
              className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${
                tab === id
                  ? 'text-sun-700 border-b-2 border-sun-500'
                  : 'text-bark-400 hover:text-bark-600'
              }`}>
              {label}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-5 py-5 space-y-3">
          {tab === 'register' && (
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-bark-300" />
              <input type="text" placeholder="Your name (optional)" value={name} onChange={e => setName(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-sun-400" />
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-bark-300" />
            <input type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} required
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-sun-400" />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-bark-300" />
            <input type="password" placeholder={tab === 'register' ? 'Password (min 8 characters)' : 'Password'}
              value={password} onChange={e => setPassword(e.target.value)} required
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-sun-400" />
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl px-3 py-2.5">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <button type="submit" disabled={busy}
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-sun-500 hover:bg-sun-600 disabled:opacity-60 text-bark-950 font-bold text-sm transition-colors shadow-sm">
            {busy ? (
              <span className="w-4 h-4 border-2 border-bark-900/30 border-t-bark-900 rounded-full animate-spin" />
            ) : tab === 'login' ? (
              <><LogIn className="w-4 h-4" /> Sign In</>
            ) : (
              <><UserPlus className="w-4 h-4" /> Create Account</>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-bark-400 pb-4">
          Your data is stored privately on our server.
        </p>
      </div>
    </div>
  );
}

export default function AuthModal({ onSuccess, onClose }) {
  return createPortal(
    <ModalContent onSuccess={onSuccess} onClose={onClose} />,
    document.body
  );
}
