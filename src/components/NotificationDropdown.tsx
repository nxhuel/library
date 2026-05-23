import { useNotifications, useMarkRead, useMarkAllRead } from '../api/hooks/useNotifications';
import CloseIcon from '@mui/icons-material/Close';
import DoneAllIcon from '@mui/icons-material/DoneAll';

interface NotificationDropdownProps {
  userId: number;
  onClose: () => void;
}

function NotificationDropdown({ userId, onClose }: NotificationDropdownProps) {
  const { data: notifications = [], isLoading } = useNotifications(userId);
  const markReadMutation = useMarkRead(userId);
  const markAllReadMutation = useMarkAllRead(userId);

  const handleMarkRead = async (id: number) => {
    try {
      await markReadMutation.mutateAsync(id);
    } catch (err) {
      console.error("Error al marcar la notificación como leída");
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllReadMutation.mutateAsync();
    } catch (err) {
      console.error("Error al marcar todas como leídas");
    }
  };

  return (
    <div className="absolute left-24 top-0 w-80 glass-card bg-[var(--card-light)] dark:bg-[var(--card-dark)] rounded-xl shadow-2xl z-[100] animate-in slide-in-from-left-2 duration-200">
      <div className="p-4 border-b border-gray-100 dark:border-[var(--border-dark)] flex justify-between items-center">
        <h3 className="font-bold text-sm">Notificaciones</h3>
        <div className="flex gap-2">
          <button 
            onClick={handleMarkAllRead}
            className="p-1 text-primary hover:bg-primary/10 rounded transition-colors"
            title="Marcar todas como leídas"
          >
            <DoneAllIcon fontSize="small" />
          </button>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors">
            <CloseIcon fontSize="small" />
          </button>
        </div>
      </div>

      <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500 text-sm italic">Cargando...</div>
        ) : notifications.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-sm italic">No hay notificaciones</div>
        ) : (
          <div className="flex flex-col">
            {notifications.map((notif) => (
              <div 
                key={notif.id}
                onClick={() => !notif.read && handleMarkRead(notif.id!)}
                className={`p-4 border-b border-gray-50 dark:border-gray-800/50 cursor-pointer transition-colors ${
                  notif.read ? 'opacity-60 bg-transparent' : 'bg-primary/5 hover:bg-primary/10'
                }`}
              >
                <p className={`text-xs leading-relaxed ${notif.read ? 'text-gray-500' : 'text-gray-900 dark:text-white font-medium'}`}>
                  {notif.message}
                </p>
                <span className="text-[10px] text-gray-400 mt-2 block">
                  {new Date(notif.createdAt!).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default NotificationDropdown;
