import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    // Simulación de API
    const response = {
      token: 'fake-jwt-token',
      user: { id: '1', email: 'test@test.com' },
    };

    login(response.token, response.user);
    navigate('/dashboard');
  };

  return (
    <div>
      <h1>Login</h1>
      <button onClick={handleLogin}>Iniciar sesión</button>
    </div>
  );
};