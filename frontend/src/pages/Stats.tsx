import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getStats } from '../api/stats.api';

type StatsResponse = {
  totalProjects: number;
  totalTasks: number;
  tasksByStatus: Record<string, number>;
  tasksByPriority: Record<string, number>;
  assignedToUser: number;
  completionRate: number;
  avgTasksPerProject: number;
};

export const Stats = () => {
  const [data, setData] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError('');
      const { data } = await getStats();
      setData(data);
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        'No se pudieron cargar las estadísticas.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-800 via-slate-900 to-black text-slate-100">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-10">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-slate-300">Dashboard</p>
            <h1 className="text-3xl font-semibold text-white">
              Estadísticas
            </h1>
            <p className="text-sm text-slate-400">
              Resumen de actividad del usuario
            </p>
          </div>
          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center rounded-xl border border-white/20 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-white/40 hover:bg-white/5"
          >
            Volver
          </Link>
        </header>

        {error && (
          <p className="rounded-lg bg-rose-500/10 px-4 py-3 text-sm text-rose-100 ring-1 ring-rose-500/30">
            {error}
          </p>
        )}

        {loading ? (
          <div className="rounded-2xl border border-white/10 bg-slate-800/70 p-6 text-sm text-slate-300">
            Cargando estadísticas…
          </div>
        ) : (
          data && (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-slate-800/70 p-6 shadow-lg ring-1 ring-white/10">
                <h2 className="text-lg font-semibold text-white mb-3">
                  Resumen
                </h2>
                <div className="grid grid-cols-2 gap-3 text-sm text-slate-200">
                  <div>
                    <p className="text-xs text-slate-400">Proyectos</p>
                    <p className="text-2xl font-semibold">
                      {data.totalProjects ?? 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Tareas</p>
                    <p className="text-2xl font-semibold">
                      {data.totalTasks ?? 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">
                      Asignadas a mí
                    </p>
                    <p className="text-xl font-semibold">
                      {data.assignedToUser ?? 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">
                      Tareas por proyecto
                    </p>
                    <p className="text-xl font-semibold">
                      {(data.avgTasksPerProject ?? 0).toFixed(1)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">
                      Tasa de finalización
                    </p>
                    <p className="text-xl font-semibold">
                      {Math.round((data.completionRate ?? 0) * 100)}%
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-800/70 p-6 shadow-lg ring-1 ring-white/10">
                <h2 className="text-lg font-semibold text-white mb-3">
                  Por estado
                </h2>
                <div className="space-y-2 text-sm text-slate-200">
                  {Object.entries(data.tasksByStatus || {}).map(
                    ([status, count]) => (
                      <div
                        key={status}
                        className="flex items-center justify-between rounded-lg border border-white/5 bg-white/5 px-3 py-2"
                      >
                        <span className="capitalize">{status}</span>
                        <span className="font-semibold">{count}</span>
                      </div>
                    )
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-800/70 p-6 shadow-lg ring-1 ring-white/10">
                <h2 className="text-lg font-semibold text-white mb-3">
                  Por prioridad
                </h2>
                <div className="space-y-2 text-sm text-slate-200">
                  {Object.entries(data.tasksByPriority || {}).map(
                    ([priority, count]) => (
                      <div
                        key={priority}
                        className="flex items-center justify-between rounded-lg border border-white/5 bg-white/5 px-3 py-2"
                      >
                        <span className="capitalize">{priority}</span>
                        <span className="font-semibold">{count}</span>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};
