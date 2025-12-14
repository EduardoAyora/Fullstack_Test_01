import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerRequest } from '../api/auth.api';

type RegisterForm = {
  name: string;
  email: string;
  password: string;
};

export const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<RegisterForm>({
    name: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (field: keyof RegisterForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!form.name || !form.email || !form.password) {
      setError('Todos los campos son obligatorios.');
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(form.email)) {
      setError('Ingresa un correo electrónico válido.');
      return;
    }

    if (form.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    try {
      setLoading(true);
      await registerRequest(form.name, form.email, form.password);
      setSuccess('Registro exitoso. Ahora puedes iniciar sesión.');
      setTimeout(() => navigate('/login'), 800);
    } catch (err: any) {
      const message =
        err?.response?.data?.message || 'No se pudo completar el registro.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-black text-slate-100">
      <div className="mx-auto flex max-w-5xl flex-col gap-12 px-6 py-16 md:flex-row md:items-center">
        <div className="flex-1 space-y-6">
          <p className="inline-flex items-center rounded-full bg-slate-800/70 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-300 shadow-lg ring-1 ring-white/10">
            Regístrate
          </p>
          <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
            Crea tu cuenta y gestiona tus proyectos.
          </h1>
          <div className="flex items-center gap-3 text-sm text-slate-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_2px_rgba(74,222,128,0.35)]" />
            Empieza en minutos: registra tus datos y accede al panel.
          </div>
        </div>

        <div className="w-full max-w-md flex-1">
          <div className="rounded-2xl bg-slate-900/60 p-8 shadow-2xl ring-1 ring-white/10 backdrop-blur">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-white">Crear cuenta</h2>
              <p className="mt-1 text-sm text-slate-300">
                Ingresa tus datos para comenzar.
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-200">
                  Nombre
                </span>
                <input
                  type="text"
                  name="name"
                  className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-slate-100 shadow-inner shadow-slate-950 outline-none transition duration-150 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/40"
                  placeholder="Tu nombre"
                  value={form.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  disabled={loading}
                />
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-200">
                  Correo electrónico
                </span>
                <input
                  // type="email"
                  name="email"
                  className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-slate-100 shadow-inner shadow-slate-950 outline-none transition duration-150 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/40"
                  placeholder="tu@email.com"
                  value={form.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  disabled={loading}
                />
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-200">
                  Contraseña
                </span>
                <input
                  type="password"
                  name="password"
                  className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-slate-100 shadow-inner shadow-slate-950 outline-none transition duration-150 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/40"
                  placeholder="Mínimo 6 caracteres"
                  value={form.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  disabled={loading}
                  // minLength={6}
                />
              </label>

              {error && (
                <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-200 ring-1 ring-red-500/30">
                  {error}
                </p>
              )}

              {success && (
                <p className="rounded-lg bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200 ring-1 ring-emerald-500/30">
                  {success}
                </p>
              )}

              <button
                type="submit"
                className="group relative flex w-full justify-center overflow-hidden rounded-xl bg-emerald-500 px-4 py-3 text-base font-semibold text-slate-950 transition hover:translate-y-[-1px] hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={loading}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-emerald-400/0 via-white/15 to-emerald-400/0 opacity-0 transition duration-500 group-hover:opacity-100" />
                {loading ? 'Creando cuenta…' : 'Crear cuenta'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-300">
              ¿Ya tienes cuenta?{' '}
              <Link
                to="/login"
                className="font-semibold text-emerald-300 hover:text-emerald-200"
              >
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
