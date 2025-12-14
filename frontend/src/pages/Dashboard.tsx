import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../auth/useAuth';
import { createProjectRequest, listProjects } from '../api/project.api';
import { profileRequest } from '../api/auth.api';

type Project = {
  _id: string;
  name: string;
  creator?: { name?: string; email?: string };
};

export const Dashboard = () => {
  const { logout, user, loadUserData } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [newProject, setNewProject] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const limit = 6;

  const userLabel = useMemo(
    () => user?.email || user?.id || 'Usuario',
    [user]
  );

  const fetchProjects = async (pageToLoad: number) => {
    try {
      setLoading(true);
      setError('');
      const { data } = await listProjects(pageToLoad, limit);
      setProjects(data.projects ?? []);
      setHasNextPage(Boolean(data.hasNextPage));
    } catch (err: any) {
      const message = err?.response?.data?.message || 'No se pudieron cargar los proyectos.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async () => {
    try {
      const { data: profile } = await profileRequest();
      const id = profile._id ?? profile.id ?? '';
      const email = profile.email ?? '';

      if (id || email) {
        loadUserData({ id, email });
      }
    } catch (err: any) {
      const message =
        err?.response?.data?.message || 'No se pudo cargar el perfil.';
      setError(message);
    }
  };

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchProjects(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleCreate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newProject.trim()) return;

    try {
      setLoading(true);
      setError('');
      await createProjectRequest(newProject.trim());
      setNewProject('');
      await fetchProjects(page);
    } catch (err: any) {
      const message = err?.response?.data?.message || 'No se pudo crear el proyecto.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-800 via-slate-900 to-black text-slate-100">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-12">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-slate-300">Bienvenido</p>
            <h1 className="text-3xl font-semibold text-white">
              Tus proyectos
            </h1>
            <p className="text-slate-400">{userLabel}</p>
          </div>
          <button
            onClick={logout}
            className="rounded-xl border border-white/30 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-white/50 hover:bg-white/10"
          >
            Cerrar sesión
          </button>
        </header>

        <section className="rounded-2xl md:max-w-3/4 border-white/15 border bg-slate-800/70 p-6 shadow-xl ring-1 ring-white/10 backdrop-blur">
          <form
            className="flex flex-col gap-3 sm:flex-row sm:items-end"
            onSubmit={handleCreate}
          >
            <div className="flex-1">
              <label className="text-sm text-slate-300">
                Nombre del proyecto
              </label>
              <input
                type="text"
                value={newProject}
                onChange={(e) => setNewProject(e.target.value)}
                className="mt-1 max-h-12 w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-slate-100 shadow-inner shadow-slate-950 outline-none transition duration-150 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/40"
                placeholder="Proyecto Backend"
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full max-h-12 h-12 rounded-xl bg-sky-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:translate-y-[-1px] hover:bg-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              Crear proyecto
            </button>
          </form>
          {error && (
            <p className="mt-3 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-200 ring-1 ring-red-500/30">
              {error}
            </p>
          )}
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <article
              key={project._id}
              className="rounded-xl border border-white/15 bg-slate-800/70 p-5 shadow-lg ring-1 ring-white/20 backdrop-blur transition hover:-translate-y-1 hover:border-white/40 hover:ring-white/40"
            >
              <h3 className="text-lg font-semibold text-white">
                {project.name}
              </h3>
              <p className="mt-2 text-sm text-slate-300">
                Creador: {project.creator?.name || project.creator?.email || 'N/D'}
              </p>
            </article>
          ))}
          {!projects.length && !loading && (
            <div className="col-span-full rounded-xl border border-dashed border-white/10 p-8 text-center text-slate-300">
              No hay proyectos todavía.
            </div>
          )}
        </section>

        <div className="flex items-center justify-between">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1 || loading}
            className="rounded-lg bg-slate-800/70 border border-white/30 px-3 py-2 text-sm text-slate-200 transition hover:border-white/50 hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Anterior
          </button>
          <span className="text-sm text-slate-300">Página {page}</span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={loading || !hasNextPage}
            className="rounded-lg bg-slate-800/70 border border-white/30 px-3 py-2 text-sm text-slate-200 transition hover:border-white/50 hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
};
