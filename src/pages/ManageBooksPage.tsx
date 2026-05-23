import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { 
  useBooksByUploader, 
  useCreateBook, 
  useUpdateBook, 
  useDeleteBook, 
  useUploadPdf 
} from '../api/hooks/useBooks';
import { useAuthor } from '../api/hooks/useAuthors';
import { useUsers } from '../api/hooks/useUsers';
import { useCreateNotification } from '../api/hooks/useNotifications';
import { BookResponseDTO } from '../api/types/book.types';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

function ManageBooksPage() {
  const { user } = useAuth();
  
  // Queries
  const { data: books = [], isLoading: booksLoading } = useBooksByUploader(user?.id || 0);
  const { data: authorProfile, isLoading: authorLoading } = useAuthor(user?.id || 0);

  // Mutations
  const createBookMutation = useCreateBook();
  const updateBookMutation = useUpdateBook();
  const deleteBookMutation = useDeleteBook();
  const uploadPdfMutation = useUploadPdf();
  const createNotificationMutation = useCreateNotification();
  const { data: allUsers = [] } = useUsers();

  const [editingBook, setEditingBook] = useState<Partial<BookResponseDTO> | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !editingBook) return;
    setSaving(true);
    try {
      let savedBook: BookResponseDTO;
      if (editingBook.id) {
        savedBook = await updateBookMutation.mutateAsync({
          id: editingBook.id,
          book: {
            ...editingBook,
            authorId: user.id,
            uploadedById: user.id
          } as any
        });
      } else {
        savedBook = await createBookMutation.mutateAsync({
          ...editingBook,
          authorId: user.id,
          uploadedById: user.id
        } as any);
      }

      if (file && savedBook.id) {
        await uploadPdfMutation.mutateAsync({ id: savedBook.id, file });
      }

      // Notify all users about the new book (Simulated Broadcast)
      if (!editingBook.id && savedBook.id) {
        const message = `${user.name} has published a new book: ${savedBook.title}`;
        // In a real production app, this broadcast should happen on the backend.
        // For this implementation, we notify all registered users.
        allUsers.forEach(u => {
          if (u.id !== user.id) { // Don't notify the author themselves
            createNotificationMutation.mutate({ userId: u.id!, message });
          }
        });
      }

      setEditingBook(null);
      setFile(null);
    } catch (err) {
      alert("Failed to save book");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;
    try {
      await deleteBookMutation.mutateAsync(id);
    } catch (err) {
      alert("Failed to delete book");
    }
  };

  if (user?.role !== 'AUTHOR') {
    return <div className="p-12 text-center">Only authors can manage their own books.</div>;
  }

  if (authorLoading || (user?.role !== 'ADMIN' && !authorProfile)) {
    if (!authorProfile && !authorLoading) {
      return (
        <div className="p-12 text-center glass-card max-w-2xl mx-auto rounded-3xl mt-12">
          <h2 className="text-2xl font-bold mb-4">Completa tu perfil</h2>
          <p className="text-gray-500 mb-8">Debes configurar tu biografía de autor antes de publicar libros.</p>
          <a href="/profile" className="premium-button bg-primary text-white inline-block">Ir al perfil</a>
        </div>
      );
    }
    return <div className="p-12 text-center">Cargando...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <header className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Gestionar mis libros</h1>
          <p className="text-gray-500 dark:text-gray-400">Agrega, edita o elimina tus publicaciones.</p>
        </div>
        <button 
          onClick={() => setEditingBook({ title: '', description: '', gender: '', numPages: 0, coverImage: '' })}
          className="premium-button bg-primary text-white flex items-center gap-2"
        >
          <AddIcon />
          Subir Nuevo Libro
        </button>
      </header>

      {editingBook && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-2xl glass-card p-8 rounded-3xl bg-white dark:bg-slate-900">
            <h2 className="text-2xl font-bold mb-6">{editingBook.id ? 'Edit Book' : 'Upload New Book'}</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-400 mb-1">Title</label>
                <input 
                  type="text" className="input-field" required
                  value={editingBook.title || ''}
                  onChange={e => setEditingBook({...editingBook, title: e.target.value})}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                <textarea 
                  className="input-field min-h-[80px]" required
                  value={editingBook.description || ''}
                  onChange={e => setEditingBook({...editingBook, description: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Genre</label>
                <input 
                  type="text" className="input-field" required
                  value={editingBook.gender || ''}
                  onChange={e => setEditingBook({...editingBook, gender: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Pages</label>
                <input 
                  type="number" className="input-field" required
                  value={editingBook.numPages || 0}
                  onChange={e => setEditingBook({...editingBook, numPages: parseInt(e.target.value)})}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-400 mb-1">Cover Image URL</label>
                <input 
                  type="text" className="input-field" required
                  placeholder="https://images.unsplash.com/..."
                  value={editingBook.coverImage || ''}
                  onChange={e => setEditingBook({...editingBook, coverImage: e.target.value})}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-400 mb-1">PDF File (optional)</label>
                <div className="relative border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-4 text-center hover:border-primary transition-colors">
                  <input 
                    type="file" accept=".pdf"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={e => setFile(e.target.files?.[0] || null)}
                  />
                  <CloudUploadIcon className="text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">
                    {file ? file.name : "Click or drag PDF to upload"}
                  </p>
                </div>
              </div>
              
              <div className="md:col-span-2 flex gap-4 mt-6">
                <button 
                  type="button" onClick={() => setEditingBook(null)}
                  className="flex-1 py-3 rounded-xl border border-gray-200 dark:border-gray-700 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" disabled={saving}
                  className="flex-1 premium-button bg-primary text-white"
                >
                  {saving ? 'Saving...' : 'Save Book'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {booksLoading ? (
        <div className="text-center py-20 text-gray-500">Cargando tus libros...</div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {books.map(book => (
            <div key={book.id} className="glass-card p-6 rounded-2xl flex items-center gap-6">
              <img src={book.coverImage} alt={book.title} className="w-16 h-24 object-cover rounded-lg shadow-md" />
              <div className="flex-1">
                <h3 className="font-bold text-lg">{book.title}</h3>
                <p className="text-sm text-gray-500">{book.gender} • {book.numPages} pages</p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => setEditingBook(book)}
                  className="p-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-blue-500 transition-colors"
                >
                  <EditIcon />
                </button>
                <button 
                  onClick={() => handleDelete(book.id)}
                  className="p-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-red-500 transition-colors"
                >
                  <DeleteIcon />
                </button>
              </div>
            </div>
          ))}
          {books.length === 0 && (
            <div className="text-center py-20 bg-gray-50 dark:bg-slate-900/50 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-800">
              <p className="text-gray-500 mb-4">No has subido ningún libro todavía.</p>
              <button 
                onClick={() => setEditingBook({ title: '', description: '', gender: '', numPages: 0, coverImage: '' })}
                className="text-primary font-bold hover:underline"
              >
                Sube tu primer libro
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ManageBooksPage;

