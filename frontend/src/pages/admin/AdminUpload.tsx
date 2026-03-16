import { useState, useCallback, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { uploadJson, getUpload, getUploads, deleteUpload } from '../../services/admin.api';
import type { JsonEntity, DocumentUpload } from '../../services/admin.api';
import { AppHeader } from '../../components/layout/AppHeader';
import { UploadReview } from '../../components/features/admin/UploadReview';
import { useAuth } from '../../hooks/useAuth';

const STATUS_FILTERS = [
  { value: null, label: 'Tutti' },
  { value: 'REVIEW', label: 'In revisione' },
  { value: 'APPROVED', label: 'Approvati' },
  { value: 'DELETED', label: 'Eliminati' },
];

export default function AdminUpload() {
  const { isAdmin } = useAuth();
  const queryClient = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploadId, setUploadId] = useState<string | null>(null);
  const [entities, setEntities] = useState<JsonEntity[]>([]);
  const [relationsCount, setRelationsCount] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const { data: uploads } = useQuery({
    queryKey: ['admin-uploads'],
    queryFn: getUploads,
    enabled: isAdmin,
  });

  const filteredUploads = statusFilter
    ? (uploads ?? []).filter((u) => u.status === statusFilter)
    : (uploads ?? []);

  const processFile = useCallback(
    async (file: File) => {
      setError(null);
      setUploading(true);
      try {
        const content = await file.text();
        const result = await uploadJson(content, file.name);
        await openUpload(result.uploadId);
        void queryClient.invalidateQueries({ queryKey: ['admin-uploads'] });
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Errore durante l'upload";
        setError(msg);
      } finally {
        setUploading(false);
      }
    },
    [queryClient],
  ); // eslint-disable-line react-hooks/exhaustive-deps

  const openUpload = async (id: string) => {
    const full = await getUpload(id);
    const proposed = full.proposedEntities as { entities: JsonEntity[]; relations: unknown[] };
    setEntities(proposed?.entities ?? []);
    setRelationsCount(proposed?.relations?.length ?? 0);
    setUploadId(id);
  };

  const handleDelete = async (u: DocumentUpload) => {
    await deleteUpload(u.id);
    void queryClient.invalidateQueries({ queryKey: ['admin-uploads'] });
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file?.name.endsWith('.json')) void processFile(file);
      else setError('Il file deve essere in formato JSON');
    },
    [processFile],
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) void processFile(file);
    },
    [processFile],
  );

  return (
    <div className="h-screen flex flex-col">
      <AppHeader />
      <div className="flex-1 overflow-y-auto">
        {!uploadId ? (
          <div className="max-w-2xl mx-auto px-4 py-8">
            <h2 className="text-xl font-semibold text-text-primary mb-4">Upload contenuti JSON</h2>

            <div
              onDrop={handleDrop}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onClick={() => fileRef.current?.click()}
              className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
                dragOver ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
              }`}
            >
              <p className="text-sm text-text-primary mb-1">
                Trascina qui il file JSON esportato da Claude.ai
              </p>
              <p className="text-xs text-text-secondary">oppure clicca per selezionare</p>
              {uploading && <p className="text-xs text-primary mt-2">Caricamento in corso...</p>}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleFileChange}
            />

            {error && (
              <div className="mt-4 p-3 rounded bg-error/5 border border-error/20 text-sm text-error">
                {error}
              </div>
            )}

            {uploads && uploads.length > 0 && (
              <div className="mt-8">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-text-secondary uppercase">
                    Storico upload
                  </h3>
                  <div className="flex gap-1">
                    {STATUS_FILTERS.map((f) => (
                      <button
                        key={f.value ?? 'all'}
                        onClick={() => setStatusFilter(f.value)}
                        className={`px-2 py-0.5 text-[10px] rounded ${
                          statusFilter === f.value
                            ? 'bg-primary text-white'
                            : 'bg-surface text-text-secondary'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border text-left text-text-secondary">
                      <th className="py-2 pr-4">Data</th>
                      <th className="py-2 pr-4">File</th>
                      <th className="py-2 pr-4">Stato</th>
                      <th className="py-2 w-8"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUploads.map((u) => (
                      <tr
                        key={u.id}
                        className="border-b border-border hover:bg-surface cursor-pointer"
                        onClick={() => u.status !== 'DELETED' && void openUpload(u.id)}
                      >
                        <td className="py-2 pr-4 text-text-secondary">
                          {new Date(u.createdAt).toLocaleDateString('it-IT')}
                        </td>
                        <td className="py-2 pr-4 text-text-primary">{u.filename}</td>
                        <td className="py-2 pr-4">
                          <StatusPill status={u.status} />
                        </td>
                        <td className="py-2">
                          {u.status !== 'DELETED' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                void handleDelete(u);
                              }}
                              className="text-text-secondary hover:text-error text-xs"
                              title="Elimina"
                            >
                              ✕
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="px-4 py-2 border-b border-border bg-surface">
              <button
                onClick={() => setUploadId(null)}
                className="text-xs text-primary hover:underline"
              >
                ← Torna alla lista upload
              </button>
            </div>
            <UploadReview uploadId={uploadId} entities={entities} relationsCount={relationsCount} />
          </div>
        )}
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const style =
    status === 'APPROVED'
      ? 'bg-success/10 text-success'
      : status === 'REVIEW'
        ? 'bg-warning/10 text-warning'
        : status === 'DELETED'
          ? 'bg-error/10 text-error'
          : 'bg-surface text-text-secondary';
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${style}`}>{status}</span>
  );
}
