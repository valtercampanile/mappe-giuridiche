import { useAuth } from '../hooks/useAuth';

export default function Studio() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-surface">
      <header className="h-11 bg-white border-b border-border flex items-center justify-between px-4">
        <h1 className="text-lg font-bold text-primary">Mappe Giuridiche</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-text-secondary">{user?.name}</span>
          <button
            onClick={() => void logout()}
            className="text-sm text-text-secondary hover:text-primary"
          >
            Esci
          </button>
        </div>
      </header>
      <main className="p-8">
        <h2 className="text-xl font-semibold text-text-primary">Studio</h2>
        <p className="mt-2 text-text-secondary">Pagina in costruzione</p>
      </main>
    </div>
  );
}
