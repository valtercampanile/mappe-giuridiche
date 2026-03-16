import { Prisma } from '@prisma/client';
import prisma from '../config/database';
import { uploadRepository } from '../repositories/upload.repository';
import { AppError } from '../utils/errors';

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
  'id',
  'type',
  'label',
  'short',
  'fonte',
  'zona_grigia',
  'tags',
  'lezioni',
]);

interface ParsedJson {
  entities: JsonEntity[];
  relations: JsonRelation[];
  meta?: Record<string, unknown>;
}

interface JsonEntity {
  id: string;
  type: string;
  label: string;
  short?: string;
  zona_grigia?: boolean;
  tags?: string[];
  lezioni?: string[];
  [key: string]: unknown;
}

interface JsonRelation {
  id?: string;
  type: string;
  from: string;
  to: string;
  label: string;
  [key: string]: unknown;
}

export const uploadService = {
  parseAndValidateJson(content: string): ParsedJson {
    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(content) as Record<string, unknown>;
    } catch {
      throw new AppError('JSON non valido', 'INVALID_JSON', 400);
    }

    if (!Array.isArray(parsed.entities)) {
      throw new AppError('Campo "entities" mancante o non è un array', 'INVALID_SCHEMA', 400);
    }
    if (!Array.isArray(parsed.relations)) {
      throw new AppError('Campo "relations" mancante o non è un array', 'INVALID_SCHEMA', 400);
    }

    const errors: string[] = [];
    for (const [i, e] of (parsed.entities as JsonEntity[]).entries()) {
      if (!e.id) errors.push(`entities[${String(i)}]: id mancante`);
      if (!e.type) errors.push(`entities[${String(i)}]: type mancante`);
      if (!e.label) errors.push(`entities[${String(i)}]: label mancante`);
    }
    if (errors.length > 0) {
      throw new AppError(errors.join('; '), 'VALIDATION_ERRORS', 400);
    }

    return {
      entities: parsed.entities as JsonEntity[],
      relations: parsed.relations as JsonRelation[],
      meta: parsed.meta as Record<string, unknown> | undefined,
    };
  },

  async createUpload(userId: string, filename: string, content: string) {
    const parsed = this.parseAndValidateJson(content);

    const upload = await uploadRepository.create({
      uploadedBy: userId,
      filename,
      proposedEntities: {
        entities: parsed.entities,
        relations: parsed.relations,
      } as Prisma.InputJsonValue,
    });

    return {
      uploadId: upload.id,
      entitaProposte: parsed.entities.length,
      relazioniProposte: parsed.relations.length,
    };
  },

  async getUpload(id: string) {
    const upload = await uploadRepository.findById(id);
    if (!upload) throw new AppError('Upload non trovato', 'UPLOAD_NOT_FOUND', 404);
    return upload;
  },

  async getUploads() {
    return uploadRepository.findAll();
  },

  async softDeleteUpload(id: string) {
    const upload = await uploadRepository.findById(id);
    if (!upload) throw new AppError('Upload non trovato', 'UPLOAD_NOT_FOUND', 404);
    return uploadRepository.updateStatus(id, 'DELETED');
  },

  async applyApproved(uploadId: string, approvedIds: string[], rejectedIds: string[]) {
    const upload = await uploadRepository.findById(uploadId);
    if (!upload) throw new AppError('Upload non trovato', 'UPLOAD_NOT_FOUND', 404);

    const proposed = upload.proposedEntities as {
      entities: JsonEntity[];
      relations: JsonRelation[];
    };
    const approvedSet = new Set(approvedIds);
    void rejectedIds;

    // Ensure materia exists
    await prisma.materia.upsert({
      where: { id: 'penale' },
      update: {},
      create: { id: 'penale', label: 'Diritto Penale', active: true },
    });

    let inserted = 0;
    let updated = 0;

    for (const e of proposed.entities) {
      if (!approvedSet.has(e.id)) continue;

      const type = TYPE_MAP[e.type.toLowerCase()] ?? e.type.toUpperCase();
      const dataObj: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(e)) {
        if (k === 'data' && typeof v === 'object' && v !== null && !Array.isArray(v)) {
          // Formato update_inquadramento: i campi sono nested in entity.data
          Object.assign(dataObj, v);
        } else if (!COMMON_FIELDS.has(k)) {
          dataObj[k] = v;
        }
      }
      const data = dataObj as Prisma.InputJsonValue;

      const existing = await prisma.entity.findUnique({ where: { id: e.id } });

      await prisma.entity.upsert({
        where: { id: e.id },
        update: {
          type: type as Prisma.EntityUpdateInput['type'],
          label: e.label,
          short: e.short ?? null,
          zonaGrigia: e.zona_grigia ?? false,
          tags: e.tags ?? [],
          data,
        },
        create: {
          id: e.id,
          type: type as Prisma.EntityCreateInput['type'],
          label: e.label,
          short: e.short ?? null,
          fonte: 'DOCENTE',
          zonaGrigia: e.zona_grigia ?? false,
          tags: e.tags ?? [],
          materiaId: 'penale',
          data,
        },
      });

      if (existing) updated++;
      else inserted++;

      // Link lezioni
      for (const lez of e.lezioni ?? []) {
        const lezioneExists = await prisma.lezione.findUnique({ where: { id: lez } });
        if (lezioneExists) {
          await prisma.entityLezione.upsert({
            where: { entityId_lezioneId: { entityId: e.id, lezioneId: lez } },
            update: {},
            create: { entityId: e.id, lezioneId: lez },
          });
        }
      }
    }

    // Relations: only if both from/to exist in DB
    const entityIds = new Set(
      (await prisma.entity.findMany({ select: { id: true } })).map((x) => x.id),
    );
    let relInserted = 0;

    for (const r of proposed.relations) {
      if (!entityIds.has(r.from) || !entityIds.has(r.to)) continue;

      const type = RELATION_TYPE_MAP[r.type.toLowerCase()] ?? r.type.toUpperCase();
      const skipKeys = new Set(['from', 'to', 'type', 'id', 'label', 'lezioni']);
      const relData: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(r)) {
        if (!skipKeys.has(k)) relData[k] = v;
      }

      await prisma.relation.create({
        data: {
          type: type as Prisma.RelationCreateInput['type'],
          fromId: r.from,
          toId: r.to,
          label: r.label,
          data: Object.keys(relData).length > 0 ? (relData as Prisma.InputJsonValue) : undefined,
        },
      });
      relInserted++;
    }

    await uploadRepository.updateStatus(uploadId, 'APPROVED', new Date());

    return {
      inserted,
      updated,
      skipped: proposed.entities.length - inserted - updated,
      relInserted,
    };
  },
};
