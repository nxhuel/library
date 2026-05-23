import { BookResponseDTO } from '../api/types/book.types';
import { bookService } from '../api/services/book.service';
import { useAuth } from '../hooks/useAuth';
import { useState } from 'react';
import BookDetail from './BookDetail';
import DownloadIcon from '@mui/icons-material/Download';
import FavoriteIcon from '@mui/icons-material/Favorite';

interface BookCardProps {
  book: BookResponseDTO;
}

function BookCard({ book }: BookCardProps) {
  const { isFavorite, toggleFavorite, user } = useAuth();
  const [showDetail, setShowDetail] = useState(false);
  const favorite = isFavorite(book.id);

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const data = await bookService.downloadPdf(book.id);
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${book.title}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Failed to download PDF");
    }
  };

  return (
    <>
      <div 
        onClick={() => setShowDetail(true)}
        className="group relative flex flex-col glass-card transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500 cursor-pointer"
      >
        <div className="relative aspect-[3/4] overflow-hidden">
          <img
            src={book.coverImage}
            alt={book.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          
          {/* Overlay Actions */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6 gap-3">
            <button
              onClick={handleDownload}
              className="p-3 rounded-full bg-primary text-white hover:bg-primary-hover transition-colors shadow-lg"
              title="Download PDF"
            >
              <DownloadIcon fontSize="small" />
            </button>
            
            {user && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(book.id);
                  }}
                  className={`p-3 rounded-full transition-colors shadow-lg ${
                    favorite ? 'bg-red-500 text-white' : 'bg-white text-gray-900 hover:bg-gray-100'
                  }`}
                  title={favorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
                >
                  {favorite ? <FavoriteIcon fontSize="small" /> : <FavoriteIcon className="opacity-40" fontSize="small" />}
                </button>
            )}
          </div>
        </div>

        <div className="p-4 flex-1 flex flex-col">
          <div className="flex justify-between items-start mb-1">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-primary px-2 py-0.5 rounded-full bg-primary/10">
              {book.gender}
            </span>
            <span className="text-[10px] text-gray-500 dark:text-gray-400">
              {book.numPages} pages
            </span>
          </div>
          
          <h3 className="font-bold text-gray-900 dark:text-white text-base line-clamp-1 mb-1">
            {book.title}
          </h3>
          
          <p className="text-gray-600 dark:text-gray-400 text-xs italic">
            by {book.authorName}
          </p>

          <p className="mt-2 text-gray-500 dark:text-gray-500 text-[10px] line-clamp-2 leading-relaxed">
            {book.description}
          </p>
        </div>
      </div>

      {showDetail && (
        <BookDetail 
          book={book} 
          onClose={() => setShowDetail(false)} 
        />
      )}
    </>
  );
}

export default BookCard;