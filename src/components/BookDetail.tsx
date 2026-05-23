import { BookResponseDTO } from '../api/types/book.types';
import { bookService } from '../api/services/book.service';
import { useAuth } from '../hooks/useAuth';
import { useState } from 'react';
import { useCommentsByBook, useCreateComment, useDeleteComment } from '../api/hooks/useComments';
import { useAuthorStats } from '../api/hooks/useAuthors';
import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import SendIcon from '@mui/icons-material/Send';
import StarIcon from '@mui/icons-material/Star';
import FavoriteIcon from '@mui/icons-material/Favorite';
import DeleteIcon from '@mui/icons-material/Delete';

interface BookDetailProps {
  book: BookResponseDTO;
  onClose: () => void;
}

function BookDetail({ book, onClose }: BookDetailProps) {
  const { isFavorite, toggleFavorite, user } = useAuth();
  
  // Queries
  const { data: comments = [], isLoading: loadingComments } = useCommentsByBook(book.id);
  const { data: stats } = useAuthorStats(book.authorId);

  // Mutations
  const createCommentMutation = useCreateComment(book.id);
  const deleteCommentMutation = useDeleteComment(book.id);

  const [newComment, setNewComment] = useState("");
  const favorite = isFavorite(book.id);

  const handleDeleteComment = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;
    try {
      await deleteCommentMutation.mutateAsync(id);
    } catch (err) {
      console.error("Failed to delete comment");
    }
  };

  const handleSendComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;
    try {
      await createCommentMutation.mutateAsync({
        bookId: book.id,
        userId: user.id,
        content: newComment
      });
      setNewComment("");
    } catch (err) {
      console.error("Failed to post comment");
    }
  };

  const handleDownload = async () => {
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto glass-card rounded-3xl bg-white dark:bg-slate-900 shadow-2xl animate-in zoom-in-95 duration-300">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors z-10"
        >
          <CloseIcon />
        </button>

        <div className="flex flex-col md:flex-row h-full">
          {/* Cover Section */}
          <div className="w-full md:w-2/5 aspect-[3/4] md:aspect-auto">
            <img 
              src={book.coverImage} 
              alt={book.title} 
              className="w-full h-full object-cover"
            />
          </div>

          {/* Info Section */}
          <div className="flex-1 p-8 md:p-12">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                {book.gender}
              </span>
              <span className="text-gray-500 text-sm">
                {book.numPages} Pages
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              {book.title}
            </h1>
            
            <p className="text-xl text-primary font-medium mb-8">
              by {book.authorName}
            </p>

            <div className="space-y-6 mb-10">
              <div>
                <h3 className="text-sm font-bold uppercase text-gray-400 mb-2">Descripción</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {book.description || "No description available for this book."}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6 pt-6 border-t border-gray-100 dark:border-gray-800 text-sm">
                <div>
                  <span className="block text-gray-400 font-medium mb-1">Publicado por</span>
                  <span className="text-gray-900 dark:text-white font-semibold">{book.uploadedByName}</span>
                </div>
                <div>
                  <span className="block text-gray-400 font-medium mb-1">Estado</span>
                  <span className="text-green-500 font-semibold">Disponible para descarga</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-4 mb-12">
              <button 
                onClick={handleDownload}
                className="premium-button bg-primary text-white flex items-center gap-2 flex-1 justify-center py-4"
              >
                <DownloadIcon />
                Descargar PDF
              </button>
              
              <button 
                onClick={() => toggleFavorite(book.id)}
                className={`premium-button flex items-center gap-2 flex-1 justify-center py-4 ${
                  favorite ? 'bg-red-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                }`}
              >
                {favorite ? <FavoriteIcon /> : <FavoriteIcon className="opacity-40" />}
                {favorite ? 'En Favoritos' : 'Añadir a Favoritos'}
              </button>
            </div>

            {/* Author Stats Bar */}
            {stats && (
              <div className="flex justify-center p-4 rounded-2xl bg-gray-50 dark:bg-slate-800/50 mb-12 border border-gray-100 dark:border-gray-700">
                <div className="text-center">
                  <FavoriteIcon className="text-red-500 mb-1" fontSize="small" />
                  <span className="block text-xs font-bold">{stats.totalFavorites}</span>
                  <span className="text-[10px] text-gray-500 uppercase">Favoritos</span>
                </div>
              </div>
            )}

            {/* Comments Section */}
            <div className="space-y-8">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <ChatBubbleOutlineIcon />
                Discusiones ({comments.length})
              </h3>

              {user && (
                <form onSubmit={handleSendComment} className="relative">
                  <input 
                    type="text"
                    placeholder="Add a public comment..."
                    className="input-field pr-12"
                    value={newComment}
                    onChange={e => setNewComment(e.target.value)}
                  />
                  <button 
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-primary hover:text-primary-hover"
                  >
                    <SendIcon />
                  </button>
                </form>
              )}

              <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {loadingComments ? (
                  <p className="text-gray-500 text-center py-4">Cargando discusiones...</p>
                ) : (
                  comments.map(comment => (
                    <div key={comment.id} className="flex gap-4 group relative">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary shrink-0">
                        {comment.userName.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm">{comment.userName}</span>
                            <span className="text-[10px] text-gray-400">
                              {new Date(comment.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          {user?.role === 'ADMIN' && (
                            <button 
                              onClick={() => handleDeleteComment(comment.id)}
                              className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Delete Comment"
                            >
                              <DeleteIcon fontSize="small" />
                            </button>
                          )}
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  ))
                )}
                {!loadingComments && comments.length === 0 && (
                  <p className="text-gray-500 text-center py-8 bg-gray-50 dark:bg-slate-800/30 rounded-2xl border-2 border-dashed border-gray-100 dark:border-gray-700">
                    ¡Sé el primero en compartir tu opinión sobre este libro!
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookDetail;

