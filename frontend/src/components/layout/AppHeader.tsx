import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const NAV_ITEMS = [
  { label: 'Studio', path: '/studio' },
  { label: 'Ripasso', path: '/ripasso' },
  { label: 'Esercitazione', path: '/esercitazione' },
  { label: 'Questioni', path: '/questioni' },
];

const ADMIN_ITEMS = [
  { label: 'Upload Contenuti', path: '/admin/upload' },
  { label: 'Gestione Entità', path: '/admin/entita' },
];

export function AppHeader() {
  const location = useLocation();
  const { isAdmin } = useAuth();
  const [adminOpen, setAdminOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setAdminOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <header className="h-11 min-h-[44px] bg-white border-b border-border flex items-center px-4 gap-6">
      <span className="text-sm font-bold text-primary">Mappe Giuridiche</span>
      <nav className="flex gap-1 items-center">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`px-3 py-1 text-xs font-semibold rounded transition-colors ${
              location.pathname === item.path
                ? 'bg-primary/10 text-primary'
                : 'text-text-secondary hover:text-text-primary hover:bg-surface'
            }`}
          >
            {item.label}
          </Link>
        ))}

        {isAdmin && (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setAdminOpen(!adminOpen)}
              className={`px-3 py-1 text-xs font-semibold rounded transition-colors ${
                isAdminPage
                  ? 'bg-primary/10 text-primary'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface'
              }`}
            >
              Admin {adminOpen ? '▴' : '▾'}
            </button>
            {adminOpen && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-border rounded shadow-lg z-50 min-w-[180px]">
                {ADMIN_ITEMS.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setAdminOpen(false)}
                    className={`block px-4 py-2 text-xs hover:bg-surface transition-colors ${
                      location.pathname === item.path
                        ? 'text-primary font-semibold'
                        : 'text-text-primary'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
