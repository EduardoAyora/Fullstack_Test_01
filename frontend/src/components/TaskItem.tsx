type Person = {
  _id?: string;
  name?: string;
  email?: string;
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

type TaskItemProps = {
  task: Task;
  onRemove: (taskId: string) => void;
  onEdit: (task: Task) => void;
  removingTaskId: string | null;
  priorityStyles: Record<TaskPriority, string>;
  statusStyles: Record<TaskStatus, string>;
};

export const TaskItem = ({
  task,
  onRemove,
  onEdit,
  removingTaskId,
  priorityStyles,
  statusStyles,
}: TaskItemProps) => {
  return (
    <article className="relative rounded-xl border border-white/10 bg-slate-700/30 p-4 pr-16 shadow-lg ring-1 ring-white/5">
      <div className="absolute right-3 top-3 flex items-center gap-2">
        <button
          type="button"
          onClick={() => onEdit(task)}
          className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xs text-slate-100 transition hover:border-white/25 hover:bg-white/10"
          title="Editar tarea"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            className="h-4 w-4"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4Z" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => onRemove(task._id)}
          className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xs text-slate-100 transition hover:border-rose-400/70 hover:bg-rose-500/20 hover:text-rose-100"
          title="Eliminar tarea"
          disabled={removingTaskId === task._id}
        >
          {removingTaskId === task._id ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              className="h-4 w-4 animate-spin text-slate-100"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4Z"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M9.75 3a.75.75 0 0 0-.75.75V4.5H5.25a.75.75 0 0 0 0 1.5h.22l.53 12.04A2.25 2.25 0 0 0 8.25 20.25h7.5a2.25 2.25 0 0 0 2.25-2.21l.53-12.04h.22a.75.75 0 0 0 0-1.5h-3.75v-.75a.75.75 0 0 0-.75-.75h-3.75Zm4.5 1.5h-4.5v.75h4.5V4.5Zm-5.78 3a.75.75 0 0 1 .78.71l.38 7.5a.75.75 0 1 1-1.5.08l-.38-7.5a.75.75 0 0 1 .72-.79Zm6.56 0a.75.75 0 0 1 .72.79l-.38 7.5a.75.75 0 0 1-1.5-.08l.38-7.5a.75.75 0 0 1 .78-.71Z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </button>
      </div>
      <div className="flex flex-col gap-3">
        <h3 className="text-base font-semibold text-white">
          {task.description}
        </h3>
        <p className="text-sm text-slate-300">
          Asignada a:{' '}
          {task.assignedTo?.name ||
            task.assignedTo?.email ||
            'Sin asignar'}
        </p>
        <div className="flex flex-wrap gap-2 pt-1 pr-2">
          <span
            className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
              statusStyles[task.status] ||
              'bg-slate-500/15 text-slate-200 ring-1 ring-slate-500/30'
            }`}
          >
            {task.status}
          </span>
          <span
            className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
              priorityStyles[task.priority] ||
              'bg-slate-500/15 text-slate-200 ring-1 ring-slate-500/30'
            }`}
          >
            {task.priority}
          </span>
        </div>
      </div>
    </article>
  );
};
