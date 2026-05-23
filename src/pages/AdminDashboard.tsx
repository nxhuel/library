import { useAdminMetrics } from '../api/hooks/useAdmin';
import { useUsers, useUpdateUserRole, useUpdateUserStatus } from '../api/hooks/useUsers';
import { useDeletedBooks } from '../api/hooks/useBooks';
import { useDeletedComments, useDeleteComment } from '../api/hooks/useComments';
import { useAuth } from '../hooks/useAuth';
import { useState, useMemo } from 'react';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PeopleIcon from '@mui/icons-material/People';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import DownloadIcon from '@mui/icons-material/Download';
import ChatIcon from '@mui/icons-material/Chat';
import DeleteIcon from '@mui/icons-material/Delete';
import HistoryIcon from '@mui/icons-material/History';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { UserRole } from '../api/types/user.types';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  AreaChart, Area
} from 'recharts';

function AdminDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'metrics' | 'users' | 'history'>('metrics');
  
  // Queries
  const { data: metrics, isLoading: metricsLoading } = useAdminMetrics();
  const { data: users = [], isLoading: usersLoading } = useUsers();
  const { data: deletedBooks = [], isLoading: deletedBooksLoading } = useDeletedBooks();
  const { data: deletedComments = [], isLoading: deletedCommentsLoading } = useDeletedComments();

  // Mutations
  const updateRoleMutation = useUpdateUserRole();
  const updateStatusMutation = useUpdateUserStatus();

  // Chart Data Processing
  const roleData = useMemo(() => {
    if (!metrics) return [];
    return [
      { name: 'Users', value: metrics.totalUsers, color: '#3b82f6' },
      { name: 'Authors', value: metrics.totalAuthors, color: '#a855f7' },
      { name: 'Admins', value: metrics.totalAdmins, color: '#10b981' }
    ];
  }, [metrics]);

  const activityData = useMemo(() => {
    if (!metrics) return [];
    return [
      { name: 'Books', count: metrics.totalBooks },
      { name: 'Favorites', count: metrics.totalFavorites },
      { name: 'Comments', count: metrics.totalComments },
      { name: 'Deleted', count: metrics.deletedBooks }
    ];
  }, [metrics]);

  const timelineData = useMemo(() => {
    if (!users.length) return [];
    const groups = users.reduce((acc: any, user) => {
      const date = new Date(user.createdAt!).toLocaleDateString();
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});
    
    return Object.entries(groups).map(([date, count]) => ({
      date,
      users: count
    })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [users]);

  const handleRoleChange = async (userId: number, newRole: UserRole) => {
    try {
      await updateRoleMutation.mutateAsync({ id: userId, role: { role: newRole } });
    } catch (e) {
      alert("Failed to update user role");
    }
  };

  const handleStatusToggle = async (userId: number, currentStatus: string) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      await updateStatusMutation.mutateAsync({ id: userId, status: { status: newStatus as any } });
    } catch (e) {
      alert("Failed to update user status");
    }
  };

  if (user?.role !== 'ADMIN') {
    return <div className="p-12 text-center">Access Denied. Admins only.</div>;
  }

  const loading = metricsLoading || usersLoading || deletedBooksLoading || deletedCommentsLoading;
  if (loading) return <div className="p-12 text-center text-gray-500">Cargando dashboard...</div>;

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-bold flex items-center gap-4">
            <AssessmentIcon fontSize="large" className="text-primary" />
            Admin <span className="text-primary">Dashboard</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg">Gestiona los usuarios de la plataforma y supervisa las métricas de crecimiento.</p>
        </div>
        
        <div className="flex gap-2 bg-gray-100 dark:bg-slate-900 p-1 rounded-2xl">
          <TabButton active={activeTab === 'metrics'} onClick={() => setActiveTab('metrics')} label="Métricas" />
          <TabButton active={activeTab === 'users'} onClick={() => setActiveTab('users')} label="Usuarios" />
          <TabButton active={activeTab === 'history'} onClick={() => setActiveTab('history')} label="Historial" />
        </div>
      </header>

      {activeTab === 'metrics' && (
        <div className="animate-in fade-in duration-500 space-y-8">
          {/* Quick Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <MetricCard icon={<PeopleIcon />} label="Usuarios" value={metrics?.totalUsers || 0} color="blue" />
            <MetricCard icon={<PeopleIcon />} label="Autores" value={metrics?.totalAuthors || 0} color="purple" />
            <MetricCard icon={<MenuBookIcon />} label="Libros" value={metrics?.totalBooks || 0} color="green" />
            <MetricCard icon={<FavoriteIcon />} label="Favoritos" value={metrics?.totalFavorites || 0} color="red" />
            <MetricCard icon={<ChatIcon />} label="Comentarios" value={metrics?.totalComments || 0} color="pink" />
          </div>
          
          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* User Roles Pie Chart */}
            <div className="glass-card p-6 rounded-3xl h-[400px]">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <PeopleIcon className="text-primary" />
                Distribución de roles
              </h3>
              <ResponsiveContainer width="100%" height="90%">
                <PieChart>
                  <Pie
                    data={roleData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {roleData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Platform Activity Bar Chart */}
            <div className="glass-card p-6 rounded-3xl h-[400px]">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <AssessmentIcon className="text-primary" />
                Resumen de actividad
              </h3>
              <ResponsiveContainer width="100%" height="90%">
                <BarChart data={activityData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip 
                    cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Registration Timeline */}
            <div className="glass-card p-6 rounded-3xl h-[400px] lg:col-span-2">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <HistoryIcon className="text-primary" />
                Crecimiento de registros de usuarios
              </h3>
              <ResponsiveContainer width="100%" height="90%">
                <AreaChart data={timelineData}>
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area type="monotone" dataKey="users" stroke="#3b82f6" fillOpacity={1} fill="url(#colorUsers)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="glass-card p-8 rounded-3xl animate-in slide-in-from-bottom-4 duration-500">
          <h2 className="text-xl font-bold mb-6">Gestión de usuarios</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-gray-400 font-medium border-b border-gray-100 dark:border-gray-800">
                <tr>
                  <th className="pb-4 px-2">Usuario</th>
                  <th className="pb-4 px-2">Estado</th>
                  <th className="pb-4 px-2">Rol</th>
                  <th className="pb-4 px-2">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {users.map(u => (
                  <tr key={u.id} className="group">
                    <td className="py-4 px-2">
                      <div className="font-bold">{u.name}</div>
                      <div className="text-[10px] text-gray-500">{u.email}</div>
                    </td>
                    <td className="py-4 px-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${u.status === 'ACTIVE' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="py-4 px-2">
                      <select 
                         value={u.role}
                         onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
                         className="bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1 text-xs outline-none cursor-pointer"
                      >
                        <option value="USER">Usuario</option>
                        <option value="AUTHOR">Autor</option>
                        <option value="ADMIN">Admin</option>
                      </select>
                    </td>
                    <td className="py-4 px-2">
                      <button 
                        onClick={() => handleStatusToggle(u.id, u.status)}
                        className={`text-xs font-bold hover:underline ${u.status === 'ACTIVE' ? 'text-red-500' : 'text-green-500'}`}
                      >
                        {u.status === 'ACTIVE' ? 'Desactivar' : 'Activar'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="grid grid-cols-1 gap-8 animate-in slide-in-from-bottom-4 duration-500">
          <div className="glass-card p-8 rounded-3xl">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <HistoryIcon className="text-red-500" />
              Historial de libros eliminados
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-gray-400 font-medium border-b border-gray-100 dark:border-gray-800">
                  <tr>
                    <th className="pb-4 px-2">Titulo</th>
                    <th className="pb-4 px-2">Autor</th>
                    <th className="pb-4 px-2">Subido por</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {deletedBooks.map(b => (
                    <tr key={b.id}>
                      <td className="py-4 px-2 font-bold">{b.title}</td>
                      <td className="py-4 px-2">{b.authorName}</td>
                      <td className="py-4 px-2">{b.uploadedByName}</td>
                    </tr>
                  ))}
                  {deletedBooks.length === 0 && (
                    <tr><td colSpan={3} className="py-8 text-center text-gray-500 italic">No se encontraron libros eliminados.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="glass-card p-8 rounded-3xl">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <HistoryIcon className="text-red-500" />
              Historial de comentarios eliminados
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-gray-400 font-medium border-b border-gray-100 dark:border-gray-800">
                  <tr>
                    <th className="pb-4 px-2">Contenido del comentario</th>
                    <th className="pb-4 px-2">Usuario</th>
                    <th className="pb-4 px-2">Libro</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {deletedComments.map(c => (
                    <tr key={c.id}>
                      <td className="py-4 px-2 italic">"{c.content}"</td>
                      <td className="py-4 px-2 font-medium">{c.userName}</td>
                      <td className="py-4 px-2 text-xs">{c.bookTitle}</td>
                    </tr>
                  ))}
                  {deletedComments.length === 0 && (
                    <tr><td colSpan={3} className="py-8 text-center text-gray-500 italic">No se encontraron comentarios eliminados.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TabButton({ active, onClick, label }: { active: boolean, onClick: () => void, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
        active ? 'bg-white dark:bg-slate-800 shadow-md text-primary' : 'text-gray-500 hover:text-primary'
      }`}
    >
      {label}
    </button>
  );
}

function MetricCard({ icon, label, value, color }: { icon: any, label: string, value: number, color: string }) {
  const colors: any = {
    blue: 'bg-blue-500/10 text-blue-500',
    purple: 'bg-purple-500/10 text-purple-500',
    green: 'bg-green-500/10 text-green-500',
    orange: 'bg-orange-500/10 text-orange-500',
    pink: 'bg-pink-500/10 text-pink-500',
    red: 'bg-red-500/10 text-red-500',
  };

  return (
    <div className="glass-card p-6 rounded-3xl flex flex-col items-center text-center hover:scale-105 transition-transform">
      <div className={`p-3 rounded-2xl mb-4 ${colors[color]}`}>
        {icon}
      </div>
      <span className="text-3xl font-bold mb-1">{value}</span>
      <span className="text-xs uppercase font-bold text-gray-400 tracking-wider">{label}</span>
    </div>
  );
}

export default AdminDashboard;
