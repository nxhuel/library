import { Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components';
import BooksPage from './pages/BooksPage';
import ProfilePage from './pages/ProfilePage';
import AuthorsPage from './pages/AuthorsPage';
import ManageBooksPage from './pages/ManageBooksPage';
import FavoritesPage from './pages/FavoritesPage';
import AdminDashboard from './pages/AdminDashboard';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import { useAuth } from './hooks/useAuth';

function App() {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <Navbar />
      <main className="flex-1 pl-20 lg:pl-28 py-8 pr-8">
        <Routes>
          <Route path="/" element={<BooksPage />} />
          <Route path="/authors" element={<AuthorsPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/profile" element={isAuthenticated ? <ProfilePage /> : <Navigate to="/login" />} />
          <Route path="/my-books" element={isAuthenticated && (user?.role === 'AUTHOR' || user?.role === 'ADMIN') ? <ManageBooksPage /> : <Navigate to="/" />} />
          <Route path="/admin" element={isAuthenticated && user?.role === 'ADMIN' ? <AdminDashboard /> : <Navigate to="/" />} />
          <Route path="/login" element={!isAuthenticated ? <LoginForm /> : <Navigate to="/" />} />
          <Route path="/register" element={!isAuthenticated ? <RegisterForm /> : <Navigate to="/" />} />
          {/* Add more routes as needed */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
