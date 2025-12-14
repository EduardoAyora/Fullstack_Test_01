type ConfirmDeleteProjectProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
};

export const ConfirmDeleteProject = ({
  open,
  onClose,
  onConfirm,
  loading = false,
}: ConfirmDeleteProjectProps) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900/80 p-6 shadow-2xl ring-1 ring-white/10">
        <h3 className="text-lg font-semibold text-white">
          Eliminar proyecto
        </h3>
        <p className="mt-2 text-sm text-slate-300">
          Esta acción no se puede deshacer. ¿Deseas eliminar el proyecto?
        </p>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-white/15 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-white/30 hover:bg-white/5"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="rounded-xl bg-rose-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:translate-y-[-1px] hover:bg-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Eliminando…' : 'Eliminar'}
          </button>
        </div>
      </div>
    </div>
  );
};
