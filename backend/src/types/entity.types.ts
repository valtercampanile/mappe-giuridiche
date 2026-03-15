export enum EntityType {
  VALORE = 'VALORE',
  PRINCIPIO = 'PRINCIPIO',
  NORMA = 'NORMA',
  ISTITUTO = 'ISTITUTO',
  QUESTIONE = 'QUESTIONE',
  FUNZIONE = 'FUNZIONE',
  LOGICA_INTERPRETATIVA = 'LOGICA_INTERPRETATIVA',
  GIURISPRUDENZA = 'GIURISPRUDENZA',
  TENSIONE = 'TENSIONE',
}

export enum RelationType {
  CATENA = 'CATENA',
  COROLLARIO = 'COROLLARIO',
  STRUTTURALE = 'STRUTTURALE',
  DI_PRINCIPIO = 'DI_PRINCIPIO',
  LIMITE_ECCEZIONE = 'LIMITE_ECCEZIONE',
  FUNZIONALE_TRASVERSALE = 'FUNZIONALE_TRASVERSALE',
  POSITIVIZZA = 'POSITIVIZZA',
  ATTUA = 'ATTUA',
  FONDA = 'FONDA',
  TENSIONE = 'TENSIONE',
}

export enum FonteType {
  DOCENTE = 'DOCENTE',
  AI = 'AI',
}

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
  data: unknown;
  createdAt: Date;
  updatedAt: Date;
}

export interface Relation {
  id: string;
  type: RelationType;
  fromId: string;
  toId: string;
  label: string;
  data: unknown;
  createdAt: Date;
}

export interface EntityFilters {
  type?: string;
  materiaId?: string;
  lezioneId?: string;
  tags?: string[];
  zonaGrigia?: boolean;
  q?: string;
  page?: number;
  limit?: number;
}
