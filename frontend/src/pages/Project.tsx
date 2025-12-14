import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import {
  getProjectById,
  removeCollaboratorRequest,
} from '../api/project.api';
import { deleteTaskRequest, getTasksByProject } from '../api/task.api';
import { AddTaskModal } from '../components/AddTaskModal';
import { AddCollaboratorModal } from '../components/AddCollaboratorModal';
import { TaskItem } from '../components/TaskItem';

type Person = {
  _id?: string;
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
  const [removingCollaboratorId, setRemovingCollaboratorId] =
    useState<string | null>(null);
  const [removingTaskId, setRemovingTaskId] = useState<string | null>(null);

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

  const handleRemoveTask = async (taskId: string) => {
    if (!projectId || !taskId) return;
    try {
      setRemovingTaskId(taskId);
      setError('');
      await deleteTaskRequest(projectId, taskId);
      await fetchTasks(projectId);
    } catch (err: any) {
      const message =
        err?.response?.data?.message || 'No se pudo eliminar la tarea.';
      setError(message);
    } finally {
      setRemovingTaskId(null);
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

  const handleRemoveCollaborator = async (collaboratorId?: string) => {
    if (!collaboratorId || !projectId) return;
    try {
      setRemovingCollaboratorId(collaboratorId);
      setError('');
      await removeCollaboratorRequest(projectId, collaboratorId);
      await fetchProject(projectId);
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        'No se pudo eliminar el colaborador.';
      setError(message);
    } finally {
      setRemovingCollaboratorId(null);
    }
  };

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
    <div className="min-h-screen bg-linear-to-br from-slate-800 via-slate-900 to-black text-slate-100">
      <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-10">
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

        <section className="rounded-2xl border border-white/10 bg-slate-800/70 p-6 shadow-xl ring-1 ring-white/10 backdrop-blur">
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
                  className="flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-slate-100 ring-1 ring-white/10"
                >
                  {collaborator.name || collaborator.email || 'Colaborador'}
                  {collaborator._id && (
                    <button
                      type="button"
                      onClick={() =>
                        handleRemoveCollaborator(collaborator._id)
                      }
                      className="flex h-6 w-6 items-center justify-center rounded-full bg-transparent text-[10px] text-slate-100 transition hover:border-rose-400/70 hover:bg-rose-500/20 hover:text-rose-100"
                      title="Eliminar colaborador"
                      disabled={removingCollaboratorId === collaborator._id}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="h-3.5 w-3.5"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M9.75 3a.75.75 0 0 0-.75.75V4.5H5.25a.75.75 0 0 0 0 1.5h.22l.53 12.04A2.25 2.25 0 0 0 8.25 20.25h7.5a2.25 2.25 0 0 0 2.25-2.21l.53-12.04h.22a.75.75 0 0 0 0-1.5h-3.75v-.75a.75.75 0 0 0-.75-.75h-3.75Zm4.5 1.5h-4.5v.75h4.5V4.5Zm-5.78 3a.75.75 0 0 1 .78.71l.38 7.5a.75.75 0 1 1-1.5.08l-.38-7.5a.75.75 0 0 1 .72-.79Zm6.56 0a.75.75 0 0 1 .72.79l-.38 7.5a.75.75 0 0 1-1.5-.08l.38-7.5a.75.75 0 0 1 .78-.71Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  )}
                </span>
              ))
            ) : (
              <p className="text-sm text-slate-400">
                Sin colaboradores aún.
              </p>
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-slate-800/70 p-6 shadow-xl ring-1 ring-white/10 backdrop-blur">
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

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {tasks.map((task) => (
              <TaskItem
                key={task._id}
                task={task}
                onRemove={handleRemoveTask}
                removingTaskId={removingTaskId}
                priorityStyles={priorityStyles}
                statusStyles={statusStyles}
              />
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
        collaborators={project?.collaborators}
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
