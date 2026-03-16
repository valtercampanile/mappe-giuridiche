import { useState, useCallback, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { uploadJson, getUpload, getUploads } from '../../services/admin.api';
import type { JsonEntity } from '../../services/admin.api';
import { AppHeader } from '../../components/layout/AppHeader';
import { UploadReview } from '../../components/features/admin/UploadReview';
import { useAuth } from '../../hooks/useAuth';

export default function AdminUpload() {
  const { isAdmin } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploadId, setUploadId] = useState<string | null>(null);
  const [entities, setEntities] = useState<JsonEntity[]>([]);
  const [relationsCount, setRelationsCount] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const { data: uploads } = useQuery({
    queryKey: ['admin-uploads'],
    queryFn: getUploads,
    enabled: isAdmin,
  });

  const processFile = useCallback(async (file: File) => {
    setError(null);
    setUploading(true);
    try {
      const content = await file.text();
      const result = await uploadJson(content, file.name);
      setUploadId(result.uploadId);

      const full = await getUpload(result.uploadId);
      const proposed = full.proposedEntities as { entities: JsonEntity[]; relations: unknown[] };
      setEntities(proposed.entities);
      setRelationsCount(proposed.relations.length);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Errore durante l'upload";
      setError(msg);
    } finally {
      setUploading(false);
    }
  }, []);

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
                <h3 className="text-sm font-semibold text-text-secondary uppercase mb-2">
                  Storico upload
                </h3>
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border text-left text-text-secondary">
                      <th className="py-2 pr-4">Data</th>
                      <th className="py-2 pr-4">File</th>
                      <th className="py-2 pr-4">Stato</th>
                    </tr>
                  </thead>
                  <tbody>
                    {uploads.map((u) => (
                      <tr key={u.id} className="border-b border-border">
                        <td className="py-2 pr-4 text-text-secondary">
                          {new Date(u.createdAt).toLocaleDateString('it-IT')}
                        </td>
                        <td className="py-2 pr-4 text-text-primary">{u.filename}</td>
                        <td className="py-2 pr-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                              u.status === 'APPROVED'
                                ? 'bg-success/10 text-success'
                                : u.status === 'REVIEW'
                                  ? 'bg-warning/10 text-warning'
                                  : 'bg-surface text-text-secondary'
                            }`}
                          >
                            {u.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          <UploadReview uploadId={uploadId} entities={entities} relationsCount={relationsCount} />
        )}
      </div>
    </div>
  );
}
