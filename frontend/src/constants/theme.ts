import type { EntityType } from '../types/entity.types';

export const ENTITY_COLORS: Record<EntityType, { color: string; bg: string; border: string }> = {
  VALORE: { color: '#004B8C', bg: '#EBF3FB', border: '#0066CC' },
  PRINCIPIO: { color: '#0066CC', bg: '#EBF3FB', border: '#004B8C' },
  NORMA: { color: '#17324D', bg: '#F5F9FC', border: '#D9E4ED' },
  ISTITUTO: { color: '#5C6F82', bg: '#F5F9FC', border: '#D9E4ED' },
  QUESTIONE: { color: '#7A5800', bg: '#FFF8E6', border: '#7A5800' },
  FUNZIONE: { color: '#006D3D', bg: '#E6F5ED', border: '#006D3D' },
  LOGICA_INTERPRETATIVA: { color: '#5C6F82', bg: '#F5F9FC', border: '#5C6F82' },
  GIURISPRUDENZA: { color: '#8B1A1A', bg: '#FDF2F2', border: '#8B1A1A' },
  TENSIONE: { color: '#8B1A1A', bg: '#FDF2F2', border: '#8B1A1A' },
};

export const ENTITY_LABELS: Record<EntityType, string> = {
  VALORE: 'Valore',
  PRINCIPIO: 'Principio',
  NORMA: 'Norma',
  ISTITUTO: 'Istituto',
  QUESTIONE: 'Questione',
  FUNZIONE: 'Funzione',
  LOGICA_INTERPRETATIVA: 'Logica interpretativa',
  GIURISPRUDENZA: 'Giurisprudenza',
  TENSIONE: 'Tensione',
};

export const ENTITY_BADGE: Record<EntityType, string> = {
  VALORE: 'V',
  PRINCIPIO: 'P',
  NORMA: 'N',
  ISTITUTO: 'I',
  QUESTIONE: 'Q',
  FUNZIONE: 'F',
  LOGICA_INTERPRETATIVA: 'LI',
  GIURISPRUDENZA: 'G',
  TENSIONE: 'T',
};

export const PAGE_ROUTES = {
  Studio: '/studio',
  Ripasso: '/ripasso',
  Esercitazione: '/esercitazione',
  Questioni: '/questioni',
  Login: '/login',
  Register: '/register',
} as const;
