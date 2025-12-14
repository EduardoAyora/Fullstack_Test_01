import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import { loginRequest } from '../api/auth.api';

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    const { data } = await loginRequest('test@test.com', '123456');

    login(data.token, data.user);
    navigate('/dashboard');
  };

  return (
    <div>
      <h1>Login</h1>
      <button onClick={handleLogin}>Iniciar sesión</button>
    </div>
  );
};