import { useAuth } from '../auth/useAuth';

export const Dashboard = () => {
  const { logout, user } = useAuth();

  return (
    <div>
      <h1>Dashboard</h1>
      <p>{user?.email}</p>
      <button onClick={logout}>Cerrar sesión</button>
    </div>
  );
};