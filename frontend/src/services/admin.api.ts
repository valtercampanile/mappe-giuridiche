import api from './api';
import type { ApiResponse } from '../types/api.types';

interface UploadResult {
  uploadId: string;
  entitaProposte: number;
  relazioniProposte: number;
}

interface ApproveResult {
  inserted: number;
  updated: number;
  skipped: number;
  relInserted: number;
}

interface DocumentUpload {
  id: string;
  uploadedBy: string;
  filename: string;
  status: string;
  proposedEntities: { entities: JsonEntity[]; relations: JsonRelation[] } | null;
  approvedAt: string | null;
  createdAt: string;
}

interface JsonEntity {
  id: string;
  type: string;
  label: string;
  short?: string;
  zona_grigia?: boolean;
  tags?: string[];
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

export type { UploadResult, ApproveResult, DocumentUpload, JsonEntity, JsonRelation };

export async function uploadJson(content: string, filename: string): Promise<UploadResult> {
  const res = await api.post<ApiResponse<UploadResult>>('/admin/upload', { content, filename });
  return res.data.data;
}

export async function getUpload(id: string): Promise<DocumentUpload> {
  const res = await api.get<ApiResponse<DocumentUpload>>(`/admin/upload/${id}`);
  return res.data.data;
}

export async function getUploads(): Promise<DocumentUpload[]> {
  const res = await api.get<ApiResponse<DocumentUpload[]>>('/admin/uploads');
  return res.data.data;
}

export async function deleteUpload(id: string): Promise<void> {
  await api.delete(`/admin/upload/${id}`);
}

export async function approveUpload(
  id: string,
  approvedIds: string[],
  rejectedIds: string[],
): Promise<ApproveResult> {
  const res = await api.post<ApiResponse<ApproveResult>>(`/admin/upload/${id}/approve`, {
    approvedIds,
    rejectedIds,
  });
  return res.data.data;
}
