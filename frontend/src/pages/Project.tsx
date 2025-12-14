import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { getProjectById } from '../api/project.api';
import { getTasksByProject } from '../api/task.api';
import { AddTaskModal } from '../components/AddTaskModal';
import { AddCollaboratorModal } from '../components/AddCollaboratorModal';

type Person = {
  name?: string;
  email?: string;
};

type Project = {
  _id: string;
  name: string;
  creator?: Person;
  collaborators?: Person[];
};

type TaskPriority = 'baja' | 'media' | 'alta';
type TaskStatus = 'pendiente' | 'en progreso' | 'completada';

type Task = {
  _id: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignedTo?: Person;
};

export const Project = () => {
  const { projectId: routeProjectId } = useParams<{ projectId: string }>();
  const [projectId, setProjectId] = useState<string>('');
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loadingProject, setLoadingProject] = useState(false);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [error, setError] = useState('');
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isCollaboratorModalOpen, setIsCollaboratorModalOpen] =
    useState(false);

  useEffect(() => {
    if (routeProjectId) {
      setProjectId(routeProjectId);
    }
  }, [routeProjectId]);

  const fetchProject = async (id: string) => {
    try {
      setLoadingProject(true);
      setError('');
      const { data } = await getProjectById(id);
      setProject(data);
    } catch (err: any) {
      const message =
        err?.response?.data?.message || 'No se pudo cargar el proyecto.';
      setError(message);
    } finally {
      setLoadingProject(false);
    }
  };

  const fetchTasks = async (id: string) => {
    try {
      setLoadingTasks(true);
      setError('');
      const { data } = await getTasksByProject(id);
      setTasks(data ?? []);
    } catch (err: any) {
      const message =
        err?.response?.data?.message || 'No se pudieron cargar las tareas.';
      setError(message);
    } finally {
      setLoadingTasks(false);
    }
  };

  useEffect(() => {
    if (!projectId) return;
    fetchProject(projectId);
    fetchTasks(projectId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  const priorityStyles: Record<TaskPriority, string> = useMemo(
    () => ({
      baja: 'bg-emerald-500/15 text-emerald-200 ring-1 ring-emerald-500/30',
      media: 'bg-amber-500/15 text-amber-200 ring-1 ring-amber-500/30',
      alta: 'bg-rose-500/15 text-rose-200 ring-1 ring-rose-500/30',
    }),
    []
  );

  const statusStyles: Record<TaskStatus, string> = useMemo(
    () => ({
      pendiente: 'bg-slate-500/15 text-slate-200 ring-1 ring-slate-500/30',
      'en progreso':
        'bg-sky-500/15 text-sky-200 ring-1 ring-sky-500/30',
      completada:
        'bg-emerald-500/15 text-emerald-200 ring-1 ring-emerald-500/30',
    }),
    []
  );

  if (!routeProjectId) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-black text-slate-100">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-slate-300">Proyecto</p>
            <h1 className="text-3xl font-semibold text-white">
              {loadingProject ? 'Cargando…' : project?.name || 'Proyecto'}
            </h1>
            <p className="mt-2 text-sm text-slate-300">
              Creador:{' '}
              {project?.creator?.name ||
                project?.creator?.email ||
                'Sin datos'}
            </p>
          </div>
          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center rounded-xl border border-white/20 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-white/40 hover:bg-white/5"
          >
            Volver al dashboard
          </Link>
        </header>

        {error && (
          <p className="rounded-lg bg-rose-500/10 px-4 py-3 text-sm text-rose-100 ring-1 ring-rose-500/30">
            {error}
          </p>
        )}

        <section className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 shadow-xl ring-1 ring-white/10 backdrop-blur">
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <h2 className="text-lg font-semibold text-white">
              Colaboradores
            </h2>
            <span className="text-xs text-slate-400">
              {project?.collaborators?.length || 0} en total
            </span>
            <div className="ml-auto">
              <button
                type="button"
                onClick={() => setIsCollaboratorModalOpen(true)}
                className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:translate-y-[-1px] hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2 focus:ring-offset-slate-900"
              >
                Agregar colaborador
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {project?.collaborators?.length ? (
              project.collaborators.map((collaborator, index) => (
                <span
                  key={`${collaborator.email ?? collaborator.name ?? index}-${index}`}
                  className="rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-slate-100 ring-1 ring-white/10"
                >
                  {collaborator.name || collaborator.email || 'Colaborador'}
                </span>
              ))
            ) : (
              <p className="text-sm text-slate-400">
                Sin colaboradores aún.
              </p>
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 shadow-xl ring-1 ring-white/10 backdrop-blur">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <h2 className="text-lg font-semibold text-white">Tareas</h2>
            {loadingTasks && (
              <span className="text-xs text-slate-400">Cargando…</span>
            )}
            <div className="ml-auto flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsTaskModalOpen(true)}
                className="rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:translate-y-[-1px] hover:bg-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2 focus:ring-offset-slate-900"
              >
                Agregar tarea
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {tasks.map((task) => (
              <article
                key={task._id}
                className="rounded-xl border border-white/10 bg-slate-950/50 p-4 shadow-lg ring-1 ring-white/5"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-white">
                      {task.description}
                    </h3>
                    <p className="mt-1 text-sm text-slate-300">
                      Asignada a:{' '}
                      {task.assignedTo?.name ||
                        task.assignedTo?.email ||
                        'Sin asignar'}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        statusStyles[task.status] ||
                        'bg-slate-500/15 text-slate-200 ring-1 ring-slate-500/30'
                      }`}
                    >
                      {task.status}
                    </span>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        priorityStyles[task.priority] ||
                        'bg-slate-500/15 text-slate-200 ring-1 ring-slate-500/30'
                      }`}
                    >
                      {task.priority}
                    </span>
                  </div>
                </div>
              </article>
            ))}

            {!tasks.length && !loadingTasks && (
              <div className="rounded-xl border border-dashed border-white/15 px-4 py-6 text-center text-sm text-slate-300">
                No hay tareas aún en este proyecto.
              </div>
            )}
          </div>
        </section>
      </div>

      <AddTaskModal
        open={isTaskModalOpen}
        projectId={projectId}
        onCreated={() => fetchTasks(projectId)}
        onClose={() => setIsTaskModalOpen(false)}
      />
      <AddCollaboratorModal
        open={isCollaboratorModalOpen}
        projectId={projectId}
        onAdded={() => fetchProject(projectId)}
        onClose={() => setIsCollaboratorModalOpen(false)}
      />
    </div>
  );
};
