import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen bg-surface text-text-primary font-sans">
          <h1 className="text-2xl font-bold p-8 text-primary">Mappe Giuridiche</h1>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
