import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { AppHeader } from './components/layout/AppHeader';
import Login from './pages/Login';
import Register from './pages/Register';
import Studio from './pages/Studio';
import Ripasso from './pages/Ripasso';
import Esercitazione from './pages/Esercitazione';
import Questioni from './pages/Questioni';
import AdminUpload from './pages/admin/AdminUpload';

const queryClient = new QueryClient();

function AdminEntitaPlaceholder() {
  return (
    <div className="h-screen flex flex-col">
      <AppHeader />
      <div className="flex-1 flex items-center justify-center text-text-secondary">
        <p>Gestione Entità — in costruzione</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/studio"
            element={
              <ProtectedRoute>
                <Studio />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ripasso"
            element={
              <ProtectedRoute>
                <Ripasso />
              </ProtectedRoute>
            }
          />
          <Route
            path="/esercitazione"
            element={
              <ProtectedRoute>
                <Esercitazione />
              </ProtectedRoute>
            }
          />
          <Route
            path="/questioni"
            element={
              <ProtectedRoute>
                <Questioni />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/upload"
            element={
              <ProtectedRoute requireAdmin>
                <AdminUpload />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/entita"
            element={
              <ProtectedRoute requireAdmin>
                <AdminEntitaPlaceholder />
              </ProtectedRoute>
            }
          />
          <Route path="/admin" element={<Navigate to="/admin/upload" replace />} />
          <Route path="/" element={<Navigate to="/studio" replace />} />
          <Route path="*" element={<Navigate to="/studio" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
