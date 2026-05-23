import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useUser, useUpdateUser } from '../api/hooks/useUsers';
import { useAuthor, useUpdateAuthor, useCreateAuthor } from '../api/hooks/useAuthors';
import { UserResponseDTO } from '../api/types/user.types';
import { AuthorResponseDTO } from '../api/types/author.types';
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';
import BadgeIcon from '@mui/icons-material/Badge';

function ProfilePage() {
  const { user, login } = useAuth();
  
  // Queries
  const { data: userProfile, isLoading: userLoading } = useUser(user?.id || 0);
  const { data: authorProfile, isLoading: authorLoading } = useAuthor(user?.id || 0);

  // Mutations
  const updateUserMutation = useUpdateUser();
  const updateAuthorMutation = useUpdateAuthor();
  const createAuthorMutation = useCreateAuthor();

  const [userData, setUserData] = useState<Partial<UserResponseDTO>>({});
  const [authorData, setAuthorData] = useState<Partial<AuthorResponseDTO>>({});
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    if (userProfile) {
      setUserData(userProfile);
    }
  }, [userProfile]);

  useEffect(() => {
    if (authorProfile) {
      setAuthorData(authorProfile);
    }
  }, [authorProfile]);

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setMessage(null);
    try {
      const updated = await updateUserMutation.mutateAsync({ id: user.id, user: userData as any });
      login(updated as any);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update profile.' });
    }
  };

  const handleUpdateAuthor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setMessage(null);
    try {
      if (authorProfile) {
        await updateAuthorMutation.mutateAsync({ userId: user.id, author: authorData as any });
      } else {
        await createAuthorMutation.mutateAsync({ userId: user.id, author: authorData as any });
      }
      setMessage({ type: 'success', text: 'Author bio updated successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update author bio.' });
    }
  };


  const loading = userLoading || authorLoading;
  const saving = updateUserMutation.isPending || updateAuthorMutation.isPending || createAuthorMutation.isPending;

  if (loading) return <div className="p-12 text-center text-gray-500">Loading profile...</div>;

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <header className="mb-12 flex items-center gap-6">
        <img 
          src={user?.photo || `https://ui-avatars.com/api/?name=${user?.name}&background=6366f1&color=fff`} 
          alt="Avatar" 
          className="w-24 h-24 rounded-full border-4 border-primary shadow-xl"
        />
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">{userData?.name}</h1>
          <p className="text-gray-500 dark:text-gray-400">{userData?.email} • {userData?.role}</p>
        </div>
      </header>

      {message && (
        <div className={`p-4 rounded-xl mb-8 border ${
          message.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-600' : 'bg-red-500/10 border-red-500/20 text-red-600'
        }`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* User Info Form */}
        <section className="glass-card p-8 rounded-3xl">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <EditIcon className="text-primary" />
            Información General
          </h2>
          <form onSubmit={handleUpdateUser} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Nombre Completo</label>
              <input 
                type="text" 
                className="input-field"
                value={userData?.name || ''}
                onChange={e => setUserData(prev => ({...prev, name: e.target.value}))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
              <input 
                type="email" 
                className="input-field"
                value={userData?.email || ''}
                onChange={e => setUserData(prev => ({...prev, email: e.target.value}))}
              />
            </div>
            <button 
              type="submit" 
              disabled={saving}
              className="premium-button bg-primary text-white w-full mt-4 flex items-center justify-center gap-2"
            >
              <SaveIcon fontSize="small" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </section>

        {/* Favorites & Ratings Section */}
        <section className="glass-card p-8 rounded-3xl">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <BadgeIcon className="text-primary" />
            Favoritos y Puntuaciones
          </h2>
          <div className="space-y-4">
            <p className="text-sm text-gray-500 mb-4">
              Aquí puedes ver los libros que has marcado como favoritos. En nuestro sistema, marcar un libro como favorito equivale a darle una puntuación positiva (estrella).
            </p>
            <a 
              href="/favorites" 
              className="premium-button bg-red-500 text-white w-full flex items-center justify-center gap-2"
            >
              Ver mis Libros Favoritos
            </a>
          </div>
        </section>

        {/* Author Bio Section */}
        {(user?.role === 'AUTHOR' || user?.role === 'ADMIN') && (
          <section className="glass-card p-8 rounded-3xl md:col-span-2">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <BadgeIcon className="text-primary" />
              Biografía de Autor
            </h2>
            <form onSubmit={handleUpdateAuthor} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Nacionalidad</label>
                  <input 
                    type="text" 
                    className="input-field"
                    placeholder="e.g. Argentine"
                    value={authorData?.nationality || ''}
                    onChange={e => setAuthorData(prev => ({...prev, nationality: e.target.value}))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Bio</label>
                  <textarea 
                    className="input-field min-h-[100px]"
                    placeholder="Tell us about yourself..."
                    value={authorData?.bio || ''}
                    onChange={e => setAuthorData(prev => ({...prev, bio: e.target.value}))}
                  />
                </div>
              </div>
              <button 
                type="submit" 
                disabled={saving}
                className="premium-button bg-primary text-white w-full mt-4 flex items-center justify-center gap-2"
              >
                <SaveIcon fontSize="small" />
                {saving ? 'Saving...' : 'Update Bio'}
              </button>
            </form>
          </section>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;

