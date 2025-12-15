import { useEffect, useMemo, useState } from 'react';
import { updateTaskRequest } from '../api/task.api';

type TaskPriority = 'baja' | 'media' | 'alta';
type TaskStatus = 'pendiente' | 'en progreso' | 'completada';
type Collaborator = { _id?: string; name?: string; email?: string };

type TaskData = {
  _id: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  assignedTo?: { _id?: string; name?: string; email?: string };
};

type EditTaskModalProps = {
  projectId: string;
  task: TaskData | null;
  open: boolean;
  onClose: () => void;
  onUpdated: () => Promise<void> | void;
  collaborators?: Collaborator[];
};

export const EditTaskModal = ({
  projectId,
  task,
  open,
  onClose,
  onUpdated,
  collaborators = [],
}: EditTaskModalProps) => {
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('media');
  const [status, setStatus] = useState<TaskStatus>('pendiente');
  const [assignedTo, setAssignedTo] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const collaboratorOptions = useMemo(
    () => collaborators.filter((item) => !!item._id),
    [collaborators]
  );

  useEffect(() => {
    if (open && task) {
      setDescription(task.description);
      setPriority(task.priority);
      setStatus(task.status);
      setAssignedTo(task.assignedTo?._id || '');
      setError('');
    } else if (!open) {
      setDescription('');
      setPriority('media');
      setStatus('pendiente');
      setAssignedTo('');
      setError('');
    }
  }, [open, task]);

  useEffect(() => {
    if (!assignedTo && collaboratorOptions.length && open) {
      setAssignedTo(collaboratorOptions[0]._id!);
    }
  }, [assignedTo, collaboratorOptions, open]);

  if (!open || !task) return null;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!description.trim() || !projectId || !task._id || !assignedTo) return;

    try {
      setLoading(true);
      setError('');
      await updateTaskRequest(projectId, task._id, {
        description: description.trim(),
        priority,
        status,
        assignedTo,
      });
      await onUpdated();
      onClose();
    } catch (err: any) {
      const message =
        err?.response?.data?.message || 'No se pudo actualizar la tarea.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur">
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-slate-900/80 p-6 shadow-2xl ring-1 ring-white/10">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">
            Editar tarea
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/10 px-3 py-1 text-xs font-semibold text-slate-200 transition hover:border-white/30 hover:bg-white/5"
          >
            Cerrar
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-200">
              Descripción
            </span>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={3}
              className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 shadow-inner shadow-slate-950 outline-none transition duration-150 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/40"
              placeholder="Descripción de la tarea"
              disabled={loading}
            />
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-200">
                Prioridad
              </span>
              <select
                value={priority}
                onChange={(event) =>
                  setPriority(event.target.value as TaskPriority)
                }
                className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 shadow-inner shadow-slate-950 outline-none transition duration-150 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/40"
                disabled={loading}
              >
                <option value="baja">Baja</option>
                <option value="media">Media</option>
                <option value="alta">Alta</option>
              </select>
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-200">
                Estado
              </span>
              <select
                value={status}
                onChange={(event) =>
                  setStatus(event.target.value as TaskStatus)
                }
                className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 shadow-inner shadow-slate-950 outline-none transition duration-150 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/40"
                disabled={loading}
              >
                <option value="pendiente">Pendiente</option>
                <option value="en progreso">En progreso</option>
                <option value="completada">Completada</option>
              </select>
            </label>
          </div>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-200">
              Asignar a
            </span>
            <select
              value={assignedTo}
              onChange={(event) => setAssignedTo(event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 shadow-inner shadow-slate-950 outline-none transition duration-150 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/40"
              disabled={loading || collaboratorOptions.length === 0}
            >
              {collaboratorOptions.length === 0 ? (
                <option value="">No hay colaboradores disponibles</option>
              ) : (
                collaboratorOptions.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.name || item.email || item._id}
                  </option>
                ))
              )}
            </select>
          </label>

          {error && (
            <p className="rounded-lg bg-rose-500/10 px-3 py-2 text-sm text-rose-100 ring-1 ring-rose-500/30">
              {error}
            </p>
          )}

          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-white/15 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-white/30 hover:bg-white/5"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={
                loading ||
                !description.trim() ||
                !assignedTo ||
                collaboratorOptions.length === 0
              }
              className="rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:translate-y-[-1px] hover:bg-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Guardando…' : 'Guardar cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
