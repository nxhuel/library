import { useEffect, useState, useCallback } from "react";
import { useBooks } from "../api/hooks/useBooks";
import { BookResponseDTO } from "../api/types/book.types";
import BookCard from "../components/BookCard";
import { useAuth } from "../hooks/useAuth";
import Search from "../components/Search/Search";
import FilterBook from "../components/FilterBook/FilterBook";

function BooksPage() {
  const { data: allBooks = [], isLoading: loading, error } = useBooks();
  const [displayedBooks, setDisplayedBooks] = useState<BookResponseDTO[]>([]);
  const { user } = useAuth();

  const handleSearch = useCallback((results: BookResponseDTO[]) => {
    setDisplayedBooks(results);
  }, []);

  return (
    <div className="max-w-7xl mx-auto">
      <header className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Explora la <span className="text-primary">Biblioteca</span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-lg max-w-2xl">
          Descubre miles de libros, desde epopeyas fantásticas hasta sagas
          científicas.{" "}
          {user
            ? ` Bienvenido de nuevo, ${user.name}!`
            : " Inicia sesión para descargar y guardar tus favoritos."}
        </p>
      </header>

      <div className="flex flex-col md:flex-row gap-6 mb-12 items-center justify-between">
        <div className="w-full md:w-1/2">
          <Search allBooks={allBooks as any} onSearch={handleSearch} />
        </div>
        <FilterBook allBooks={allBooks as any} onFilter={handleSearch} />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="aspect-[3/4] rounded-2xl bg-gray-200 dark:bg-gray-800 animate-pulse"
            />
          ))}
        </div>
      ) : error ? (
        <div className="glass-card p-12 text-center rounded-3xl">
          <p className="text-red-500 mb-4 font-medium">Failed to load books</p>
          <button
            onClick={() => window.location.reload()}
            className="premium-button bg-primary text-white"
          >
            Intentar de nuevo
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {displayedBooks.map((book) => (
            <BookCard key={book.id} book={book as any} />
          ))}
          {displayedBooks.length === 0 && (
            <div className="col-span-full py-20 text-center text-gray-500">
              No se encontraron libros que coincidieran con sus criterios.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default BooksPage;
