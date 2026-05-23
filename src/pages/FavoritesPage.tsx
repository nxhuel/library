import { useAuth } from '../hooks/useAuth';
import { useUserFavorites } from '../api/hooks/useFavorites';
import { useBooks } from '../api/hooks/useBooks';
import BookCard from '../components/BookCard';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { NavLink } from 'react-router-dom';

function FavoritesPage() {
  const { user } = useAuth();
  
  // Fetch favorites and all books to get full details
  const { data: favorites = [], isLoading: favsLoading } = useUserFavorites(user?.id || 0);
  const { data: allBooks = [], isLoading: booksLoading } = useBooks();

  const favoriteBooks = allBooks.filter(book => 
    favorites.some(fav => fav.bookId === book.id)
  );

  const loading = favsLoading || booksLoading;

  if (loading) return <div className="p-12 text-center text-gray-500">Cargando tus favoritos...</div>;

  return (
    <div className="max-w-7xl mx-auto">
      <header className="mb-12 flex items-center gap-4">
        <div className="p-3 rounded-2xl bg-red-500/10 text-red-500">
          <FavoriteIcon fontSize="large" />
        </div>
        <div>
          <h1 className="text-4xl font-bold">Mis <span className="text-red-500">Favoritos</span></h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg">Tu colección seleccionada de lecturas imperdibles.</p>
        </div>
      </header>

      {favoriteBooks.length === 0 ? (
        <div className="text-center py-32 glass-card rounded-3xl">
          <p className="text-gray-500 text-xl mb-6">No has guardado ningún libro todavía.</p>
          <NavLink 
            to="/" 
            className="premium-button bg-primary text-white"
          >
            Explorar la biblioteca
          </NavLink>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {favoriteBooks.map(book => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
}

export default FavoritesPage;

