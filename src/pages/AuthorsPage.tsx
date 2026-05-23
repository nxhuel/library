import { useState } from 'react';
import { useAuthors } from '../api/hooks/useAuthors';
import { useBooksByAuthor } from '../api/hooks/useBooks';
import { AuthorResponseDTO } from '../api/types/author.types';
import BookCard from '../components/BookCard';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function AuthorsPage() {
  const { data: authors = [], isLoading: loading } = useAuthors();
  const [selectedAuthor, setSelectedAuthor] = useState<AuthorResponseDTO | null>(null);
  const { data: authorBooks = [], isLoading: loadingBooks } = useBooksByAuthor(selectedAuthor?.userId || 0);

  const handleSelectAuthor = (author: AuthorResponseDTO) => {
    setSelectedAuthor(author);
  };

  if (loading) return <div className="p-12 text-center text-gray-500">Cargando autores...</div>;

  return (
    <div className="max-w-7xl mx-auto">
      {selectedAuthor ? (
        <div className="animate-in slide-in-from-right duration-300">
          <button 
            onClick={() => setSelectedAuthor(null)}
            className="flex items-center gap-2 text-primary font-bold mb-8 hover:gap-3 transition-all"
          >
            <ArrowBackIcon />
           Volver a la lista de autores
          </button>

          <header className="mb-12 glass-card p-10 rounded-3xl flex items-center gap-8">
            <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center text-3xl font-bold text-primary uppercase">
              {selectedAuthor.userName.charAt(0)}
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">{selectedAuthor.userName}</h1>
              <p className="text-primary font-medium mb-4">{selectedAuthor.nationality}</p>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl italic">
                "{selectedAuthor.bio || "Este autor aún no ha compartido una biografía."}"
              </p>
            </div>
          </header>

          <h2 className="text-2xl font-bold mb-8">Libros de {selectedAuthor.userName}</h2>
          
          {loadingBooks ? (
            <div className="text-center py-12">Cargando libros...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
              {authorBooks.map(book => (
                <BookCard key={book.id} book={book as any} />
              ))}
              {authorBooks.length === 0 && (
                <div className="col-span-full py-20 text-center text-gray-500">
                  No se encontraron libros de este autor.
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="animate-in slide-in-from-left duration-300">
          <header className="mb-12">
            <h1 className="text-4xl font-bold mb-4">Nuestros <span className="text-primary">Autores</span></h1>
            <p className="text-gray-500 dark:text-gray-400 text-lg">Conoce a las mentes detrás de nuestra colección.</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {authors.map(author => (
              <div 
                key={author.userId}
                onClick={() => handleSelectAuthor(author)}
                className="glass-card p-8 rounded-3xl hover:-translate-y-2 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-6 mb-6">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    {author.userName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{author.userName}</h3>
                    <p className="text-sm text-gray-500">{author.nationality}</p>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 italic">
                  {author.bio || "Este autor aún no ha compartido una biografía."}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default AuthorsPage;

