import { create } from 'zustand';

type Materia = 'penale' | 'civile' | 'amm';
type Pagina = 'Studio' | 'Ripasso' | 'Esercitazione' | 'Questioni';

interface UiState {
  sidebarOpen: boolean;
  graphOpen: boolean;
  materiaAttiva: Materia;
  paginaAttiva: Pagina;
  toggleSidebar: () => void;
  toggleGraph: () => void;
  setMateria: (materia: Materia) => void;
  setPagina: (pagina: Pagina) => void;
}

export const useUiStore = create<UiState>((set) => ({
  sidebarOpen: true,
  graphOpen: true,
  materiaAttiva: 'penale',
  paginaAttiva: 'Studio',

  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  toggleGraph: () => set((s) => ({ graphOpen: !s.graphOpen })),
  setMateria: (materiaAttiva) => set({ materiaAttiva }),
  setPagina: (paginaAttiva) => set({ paginaAttiva }),
}));
