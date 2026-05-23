import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../api/services/auth.service';


function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const authData = await authService.login(email, password);
      login(authData);
      navigate('/');
    } catch (err) {
      setError('Credenciales incorrectas o problema de conexión.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-md glass-card p-10 rounded-3xl bg-white/20 dark:bg-slate-900/40">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">Bienvenido de nuevo</h2>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 p-4 rounded-xl mb-6 text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="usuario@ejemplo.com"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              placeholder="••••••••"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full premium-button bg-primary text-white text-lg py-3 mt-4"
          >
            {loading ? 'Autenticando...' : 'Entrar'}
          </button>
        </form>
        
        <p className="mt-8 text-center text-gray-600 dark:text-gray-400">
          ¿No tienes una cuenta?{' '}
          <Link to="/register" className="text-primary hover:underline font-semibold">
            Créala ahora
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginForm;