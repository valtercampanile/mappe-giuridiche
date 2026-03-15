export type EntityType =
  | 'VALORE'
  | 'PRINCIPIO'
  | 'NORMA'
  | 'ISTITUTO'
  | 'QUESTIONE'
  | 'FUNZIONE'
  | 'LOGICA_INTERPRETATIVA'
  | 'GIURISPRUDENZA'
  | 'TENSIONE';

export type RelationType =
  | 'CATENA'
  | 'COROLLARIO'
  | 'STRUTTURALE'
  | 'DI_PRINCIPIO'
  | 'LIMITE_ECCEZIONE'
  | 'FUNZIONALE_TRASVERSALE'
  | 'POSITIVIZZA'
  | 'ATTUA'
  | 'FONDA'
  | 'TENSIONE';

export type FonteType = 'DOCENTE' | 'AI';

export interface Entity {
  id: string;
  type: EntityType;
  label: string;
  short: string | null;
  fonte: FonteType;
  zonaGrigia: boolean;
  archived: boolean;
  tags: string[];
  materiaId: string;
  data: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface Relation {
  id: string;
  type: RelationType;
  fromId: string;
  toId: string;
  label: string;
  data: Record<string, unknown> | null;
  createdAt: string;
}

export interface EntityFilters {
  type?: EntityType;
  materiaId?: string;
  lezioneId?: string;
  zonaGrigia?: boolean;
  q?: string;
  page?: number;
  limit?: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'USER' | 'ADMIN';
  subscriptionTier: 'BASE' | 'ADVANCED' | 'COMPLETE';
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export type StatoQuestione = 'aperta' | 'prevalente' | 'risolta' | 'controversa';

export interface Tesi {
  label: string;
  contenuto: string;
  autori?: string[];
  giurisprudenza?: string[];
  logiche_usate?: string[];
}

export interface QuestioniFilters {
  stato?: StatoQuestione;
  zonaGrigia?: boolean;
  q?: string;
}
