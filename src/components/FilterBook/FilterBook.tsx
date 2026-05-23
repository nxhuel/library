import { BookResponseDTO } from "../../api/types/book.types";

interface FilterBookProps {
  allBooks: BookResponseDTO[];
  onFilter: (results: BookResponseDTO[]) => void;
}

function FilterBook({ allBooks, onFilter }: FilterBookProps) {
  const genres = Array.from(new Set(allBooks.map(b => b.gender)));

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto">
      <button 
        onClick={() => onFilter(allBooks)}
        className="premium-button text-xs py-2 px-4 bg-white/50 dark:bg-slate-800/50 text-gray-700 dark:text-gray-300 hover:bg-primary hover:text-white transition-all whitespace-nowrap glass-card"
      >
        All Genres
      </button>
      {genres.map(genre => (
        <button 
          key={genre}
          onClick={() => onFilter(allBooks.filter(b => b.gender === genre))}
          className="premium-button text-xs py-2 px-4 bg-white/50 dark:bg-slate-800/50 text-gray-700 dark:text-gray-300 hover:bg-primary hover:text-white transition-all whitespace-nowrap glass-card"
        >
          {genre}
        </button>
      ))}
    </div>
  );
}

export default FilterBook;

