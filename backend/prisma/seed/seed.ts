import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

interface JsonEntity {
  id: string;
  tipo: string;
  label: string;
  short?: string;
  fonte?: string;
  zona_grigia?: boolean;
  tags?: string[];
  lezioni?: string[];
  [key: string]: unknown;
}

interface JsonRelation {
  from: string;
  to: string;
  tipo: string;
  label: string;
  poli?: string[];
  tecnica_risoluzione?: string[];
  criteri_orientamento?: string[];
  manifestazioni?: unknown[];
  zona_grigia?: boolean;
  [key: string]: unknown;
}

interface JsonDatabase {
  entita: JsonEntity[];
  relazioni: JsonRelation[];
}

const TYPE_MAP: Record<string, string> = {
  valore: 'VALORE',
  principio: 'PRINCIPIO',
  norma: 'NORMA',
  istituto: 'ISTITUTO',
  questione: 'QUESTIONE',
  funzione: 'FUNZIONE',
  logica_interpretativa: 'LOGICA_INTERPRETATIVA',
  giurisprudenza: 'GIURISPRUDENZA',
  tensione: 'TENSIONE',
};

const RELATION_TYPE_MAP: Record<string, string> = {
  catena: 'CATENA',
  corollario: 'COROLLARIO',
  strutturale: 'STRUTTURALE',
  di_principio: 'DI_PRINCIPIO',
  limite_eccezione: 'LIMITE_ECCEZIONE',
  funzionale_trasversale: 'FUNZIONALE_TRASVERSALE',
  positivizza: 'POSITIVIZZA',
  attua: 'ATTUA',
  fonda: 'FONDA',
  tensione: 'TENSIONE',
};

const COMMON_FIELDS = new Set([
  'id', 'tipo', 'label', 'short', 'fonte', 'zona_grigia', 'tags', 'lezioni',
]);

function extractData(entity: JsonEntity): Record<string, unknown> {
  const data: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(entity)) {
    if (!COMMON_FIELDS.has(key)) {
      data[key] = value;
    }
  }
  return data;
}

async function main() {
  const dataPath = path.resolve(__dirname, '../../../data/database_L1_con_tensioni.json');

  if (!fs.existsSync(dataPath)) {
    console.log(`File dati non trovato: ${dataPath}`); // eslint-disable-line no-console
    console.log('Uso dati di seed incorporati per L1...'); // eslint-disable-line no-console
    await seedBuiltinData();
    return;
  }

  const raw = fs.readFileSync(dataPath, 'utf-8');
  const db = JSON.parse(raw) as JsonDatabase;
  await seedFromJson(db);
}

async function seedBuiltinData() {
  // Materia
  await prisma.materia.upsert({
    where: { id: 'penale' },
    update: { label: 'Diritto Penale', active: true },
    create: { id: 'penale', label: 'Diritto Penale', active: true },
  });

  // Lezioni
  const lezioni = [
    { id: 'L1', titolo: 'Principio di legalità e fonti del diritto penale', materia: 'penale', ordine: 1 },
    { id: 'L2', titolo: 'Corollari della legalità', materia: 'penale', ordine: 2 },
    { id: 'L3', titolo: 'Cause di giustificazione', materia: 'penale', ordine: 3 },
    { id: 'L4', titolo: 'Materialità e fatto tipico', materia: 'penale', ordine: 4 },
    { id: 'L5', titolo: 'Colpevolezza', materia: 'penale', ordine: 5 },
  ];
  for (const l of lezioni) {
    await prisma.lezione.upsert({
      where: { id: l.id },
      update: l,
      create: l,
    });
  }

  // Entità L1 rappresentative
  const entities = getBuiltinEntities();
  let entitiesCount = 0;
  for (const e of entities) {
    await prisma.entity.upsert({
      where: { id: e.id },
      update: {
        type: e.type as 'VALORE',
        label: e.label,
        short: e.short ?? null,
        fonte: (e.fonte as 'DOCENTE') ?? 'DOCENTE',
        zonaGrigia: e.zonaGrigia ?? false,
        tags: e.tags ?? [],
        materiaId: 'penale',
        data: e.data,
      },
      create: {
        id: e.id,
        type: e.type as 'VALORE',
        label: e.label,
        short: e.short ?? null,
        fonte: (e.fonte as 'DOCENTE') ?? 'DOCENTE',
        zonaGrigia: e.zonaGrigia ?? false,
        tags: e.tags ?? [],
        materiaId: 'penale',
        data: e.data,
      },
    });

    if (e.lezioneId) {
      await prisma.entityLezione.upsert({
        where: { entityId_lezioneId: { entityId: e.id, lezioneId: e.lezioneId } },
        update: {},
        create: { entityId: e.id, lezioneId: e.lezioneId },
      });
    }
    entitiesCount++;
  }

  // Relazioni
  const relations = getBuiltinRelations();
  await prisma.relation.deleteMany();
  let relationsCount = 0;
  for (const r of relations) {
    await prisma.relation.create({
      data: {
        type: r.type as 'CATENA',
        fromId: r.fromId,
        toId: r.toId,
        label: r.label,
        data: r.data ?? undefined,
      },
    });
    relationsCount++;
  }

  console.log(`Seed completato: ${String(entitiesCount)} entità, ${String(relationsCount)} relazioni`); // eslint-disable-line no-console
}

async function seedFromJson(db: JsonDatabase) {
  // Materia
  await prisma.materia.upsert({
    where: { id: 'penale' },
    update: { label: 'Diritto Penale', active: true },
    create: { id: 'penale', label: 'Diritto Penale', active: true },
  });

  // Lezioni
  const lezioni = [
    { id: 'L1', titolo: 'Principio di legalità e fonti del diritto penale', materia: 'penale', ordine: 1 },
    { id: 'L2', titolo: 'Corollari della legalità', materia: 'penale', ordine: 2 },
    { id: 'L3', titolo: 'Cause di giustificazione', materia: 'penale', ordine: 3 },
    { id: 'L4', titolo: 'Materialità e fatto tipico', materia: 'penale', ordine: 4 },
    { id: 'L5', titolo: 'Colpevolezza', materia: 'penale', ordine: 5 },
  ];
  for (const l of lezioni) {
    await prisma.lezione.upsert({ where: { id: l.id }, update: l, create: l });
  }

  // Entità
  let entitiesCount = 0;
  for (const e of db.entita) {
    const type = TYPE_MAP[e.tipo.toLowerCase()] ?? e.tipo.toUpperCase();
    const data = extractData(e);

    await prisma.entity.upsert({
      where: { id: e.id },
      update: {
        type: type as 'VALORE',
        label: e.label,
        short: e.short ?? null,
        fonte: ((e.fonte ?? 'docente').toUpperCase() as 'DOCENTE') ?? 'DOCENTE',
        zonaGrigia: e.zona_grigia ?? false,
        tags: e.tags ?? [],
        materiaId: 'penale',
        data,
      },
      create: {
        id: e.id,
        type: type as 'VALORE',
        label: e.label,
        short: e.short ?? null,
        fonte: ((e.fonte ?? 'docente').toUpperCase() as 'DOCENTE') ?? 'DOCENTE',
        zonaGrigia: e.zona_grigia ?? false,
        tags: e.tags ?? [],
        materiaId: 'penale',
        data,
      },
    });

    for (const lez of e.lezioni ?? []) {
      await prisma.entityLezione.upsert({
        where: { entityId_lezioneId: { entityId: e.id, lezioneId: lez } },
        update: {},
        create: { entityId: e.id, lezioneId: lez },
      });
    }
    entitiesCount++;
  }

  // Relazioni
  await prisma.relation.deleteMany();
  let relationsCount = 0;
  for (const r of db.relazioni) {
    const type = RELATION_TYPE_MAP[r.tipo.toLowerCase()] ?? r.tipo.toUpperCase();
    const { from, to, tipo, label, ...rest } = r;
    void tipo;

    await prisma.relation.create({
      data: {
        type: type as 'CATENA',
        fromId: from,
        toId: to,
        label,
        data: Object.keys(rest).length > 0 ? rest : undefined,
      },
    });
    relationsCount++;
  }

  console.log(`Seed completato: ${String(entitiesCount)} entità, ${String(relationsCount)} relazioni`); // eslint-disable-line no-console
}

function getBuiltinEntities() {
  return [
    // Valori
    { id: 'V01', type: 'VALORE', label: 'Libertà personale', short: 'Bene fondamentale tutelato dalla Costituzione',
      tags: ['costituzionale'], lezioneId: 'L1',
      data: { fondamento_normativo: ['Art. 13 Cost.', 'Art. 5 CEDU'],
        rationes_fondative: [{ label: 'favor libertatis', descrizione: 'Orientamento a favore della libertà', tipo: 'bussola' }],
        declinazioni: [{ lezione: 'L1', genera: ['P01', 'P02'] }] } },
    { id: 'V02', type: 'VALORE', label: 'Certezza del diritto', short: 'Prevedibilità delle conseguenze giuridiche',
      tags: ['costituzionale'], lezioneId: 'L1',
      data: { fondamento_normativo: ['Art. 25 Cost.'], rationes_fondative: [], declinazioni: [] } },
    // Principi
    { id: 'P01', type: 'PRINCIPIO', label: 'Principio di legalità', short: 'Nullum crimen, nulla poena sine lege',
      tags: ['legalità', 'fondamentale'], lezioneId: 'L1',
      data: { definizione: 'Nessuno può essere punito se non in forza di una legge entrata in vigore prima del fatto commesso',
        fondamento_normativo: ['Art. 25, co. 2, Cost.', 'Art. 1 c.p.'],
        auto_applicativo: true, test_giudice: 'Verifica diretta della preesistenza della norma incriminatrice',
        valori_fondanti: ['V01', 'V02'], corollari: ['P02', 'P03', 'P04'] } },
    { id: 'P02', type: 'PRINCIPIO', label: 'Riserva di legge', short: 'Solo il Parlamento può creare reati',
      tags: ['legalità'], lezioneId: 'L1',
      data: { definizione: 'Solo la legge in senso formale può prevedere reati e pene',
        fondamento_normativo: ['Art. 25, co. 2, Cost.'], auto_applicativo: true,
        test_giudice: 'Verifica che la fonte sia una legge ordinaria o atto avente forza di legge',
        valori_fondanti: ['V01'], corollari: [] } },
    { id: 'P03', type: 'PRINCIPIO', label: 'Tassatività', short: 'La norma penale deve essere precisa e determinata',
      tags: ['legalità'], lezioneId: 'L1',
      data: { definizione: 'La norma penale deve descrivere il fatto in modo preciso e determinato',
        fondamento_normativo: ['Art. 25, co. 2, Cost.'], auto_applicativo: true,
        test_giudice: 'Verifica che la fattispecie sia sufficientemente determinata', valori_fondanti: ['V02'], corollari: [] } },
    { id: 'P04', type: 'PRINCIPIO', label: 'Irretroattività sfavorevole', short: 'Divieto di applicare norme penali sfavorevoli retroattivamente',
      tags: ['legalità', 'garanzia'], lezioneId: 'L1',
      data: { definizione: 'La legge penale sfavorevole non può avere efficacia retroattiva',
        fondamento_normativo: ['Art. 25, co. 2, Cost.', 'Art. 2 c.p.'], auto_applicativo: true,
        test_giudice: 'Verifica che la norma applicata fosse vigente al momento del fatto', valori_fondanti: ['V01', 'V02'], corollari: [] } },
    // Norme
    { id: 'N01', type: 'NORMA', label: 'Art. 25, co. 2, Cost.', short: 'Fondamento costituzionale del principio di legalità',
      tags: ['costituzione'], lezioneId: 'L1',
      data: { testo: 'Nessuno può essere punito se non in forza di una legge che sia entrata in vigore prima del fatto commesso',
        fonte_formale: 'Costituzione', rango: 'costituzionale' } },
    { id: 'N02', type: 'NORMA', label: 'Art. 1 c.p.', short: 'Nessuno può essere punito per un fatto non previsto dalla legge come reato',
      tags: ['codice_penale'], lezioneId: 'L1',
      data: { testo: 'Nessuno può essere punito per un fatto che non sia espressamente preveduto come reato dalla legge',
        fonte_formale: 'Codice penale', rango: 'ordinario' } },
    // Istituti
    { id: 'I01', type: 'ISTITUTO', label: 'Riserva di legge', short: 'Solo fonti primarie possono prevedere reati',
      tags: ['legalità'], lezioneId: 'L1',
      data: { definizione: 'Istituto che garantisce che solo il Parlamento possa introdurre nuove fattispecie di reato' } },
    { id: 'I02', type: 'ISTITUTO', label: 'Divieto di analogia in malam partem', short: 'Non si possono estendere norme penali per analogia',
      tags: ['legalità', 'interpretazione'], lezioneId: 'L1',
      data: { definizione: 'Divieto di applicare per analogia le norme penali a casi non espressamente previsti' } },
    // Questioni
    { id: 'Q01', type: 'QUESTIONE', label: 'Natura della riserva di legge: assoluta o relativa?',
      short: 'La riserva di legge in materia penale è assoluta o relativa?',
      tags: ['legalità', 'controversa'], lezioneId: 'L1',
      data: { formulazione: 'La riserva di legge prevista dall\'art. 25, co. 2, Cost. è di natura assoluta o relativa?',
        stato: 'controversa', tesi: [
          { label: 'Riserva assoluta', contenuto: 'Solo la legge formale può prevedere reati e pene', autori: ['Corte Cost.'], giurisprudenza: [], logiche_usate: [] },
          { label: 'Riserva tendenzialmente assoluta', contenuto: 'Ammette integrazioni tecniche da fonti secondarie', autori: ['Dottrina maggioritaria'], giurisprudenza: [], logiche_usate: [] },
        ], posizione_docente: 'La riserva è tendenzialmente assoluta' } },
    // Giurisprudenza
    { id: 'G01', type: 'GIURISPRUDENZA', label: 'Corte Cost. n. 364/1988', short: 'Ignoranza inevitabile della legge penale scusa',
      tags: ['legalità', 'colpevolezza'], lezioneId: 'L1',
      data: { organo: 'Corte Costituzionale', anno: 1988, numero: '364',
        massima: 'L\'ignoranza inevitabile della legge penale esclude la colpevolezza' } },
    // Logica interpretativa
    { id: 'LI01', type: 'LOGICA_INTERPRETATIVA', label: 'Interpretazione letterale', short: 'Il significato delle parole della legge',
      tags: ['interpretazione'], lezioneId: 'L1',
      data: { tipo_logica: 'sostanziale', definizione: 'Attribuzione di significato secondo il tenore letterale delle parole' } },
    // Funzione
    { id: 'F01', type: 'FUNZIONE', label: 'Funzione di garanzia', short: 'Tutela del cittadino contro l\'arbitrio del potere punitivo',
      tags: ['garanzia'], lezioneId: 'L1',
      data: { definizione: 'Funzione volta a garantire la prevedibilità e la calcolabilità delle conseguenze penali' } },
  ];
}

function getBuiltinRelations() {
  return [
    // Catena V → P
    { type: 'CATENA', fromId: 'V01', toId: 'P01', label: 'fonda' },
    { type: 'CATENA', fromId: 'V02', toId: 'P01', label: 'fonda' },
    { type: 'CATENA', fromId: 'V01', toId: 'P02', label: 'fonda' },
    // Corollari
    { type: 'COROLLARIO', fromId: 'P01', toId: 'P02', label: 'corollario' },
    { type: 'COROLLARIO', fromId: 'P01', toId: 'P03', label: 'corollario' },
    { type: 'COROLLARIO', fromId: 'P01', toId: 'P04', label: 'corollario' },
    // Positivizza
    { type: 'POSITIVIZZA', fromId: 'N01', toId: 'P01', label: 'positivizza' },
    { type: 'POSITIVIZZA', fromId: 'N02', toId: 'P01', label: 'positivizza' },
    // Attua
    { type: 'ATTUA', fromId: 'I01', toId: 'P02', label: 'attua' },
    { type: 'ATTUA', fromId: 'I02', toId: 'P03', label: 'attua' },
    // Di principio
    { type: 'DI_PRINCIPIO', fromId: 'P01', toId: 'I01', label: 'governa' },
    { type: 'DI_PRINCIPIO', fromId: 'P01', toId: 'I02', label: 'governa' },
    // Tensione
    { type: 'TENSIONE', fromId: 'P03', toId: 'P04', label: 'Tassatività vs. Irretroattività',
      data: { poli: ['P03', 'P04'], tecnica_risoluzione: ['bilanciamento'],
        criteri_orientamento: ['favor_rei'],
        manifestazioni: [{ contesto: 'Successione di leggi penali nel tempo', lezione: 'L1', istituti: ['I01'], giurisprudenza: ['G01'], esito: 'Prevale il favor rei' }] } },
  ];
}

main()
  .catch((e) => {
    console.error('Errore nel seed:', e); // eslint-disable-line no-console
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
