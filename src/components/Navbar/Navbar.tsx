import { NavLink } from 'react-router-dom';
import BookIcon from "@mui/icons-material/Book";
import HomeIcon from "@mui/icons-material/Home";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PersonIcon from "@mui/icons-material/Person";
import GroupIcon from "@mui/icons-material/Group";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import AssessmentIcon from "@mui/icons-material/Assessment";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import LogoutIcon from "@mui/icons-material/Logout";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useEffect, useState } from "react";
import NotificationDropdown from "../NotificationDropdown";
import { useAuth } from "../../hooks/useAuth";
import { useUnreadCount } from "../../api/hooks/useNotifications";

function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    }
    return "light";
  });
  const [showNotifications, setShowNotifications] = useState(false);
  
  const { data: unreadCount = 0 } = useUnreadCount(user?.id || 0);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === "light" ? "dark" : "light");

  return (
    <nav className="fixed left-4 top-8 bottom-8 w-20 flex flex-col items-center py-8 bg-[var(--card-light)] dark:bg-[var(--card-dark)] border border-gray-200 dark:border-[var(--border-dark)] rounded-2xl shadow-md z-50">
      <div className="text-primary mb-12">
        <BookIcon fontSize="large" />
      </div>

      <div className="flex-1 flex flex-col gap-8">
        <NavLink 
          to="/" 
          className={({ isActive }) => `nav-link ${isActive ? 'text-primary' : 'text-gray-400'}`}
          title="Home"
        >
          <HomeIcon fontSize="medium" />
        </NavLink>

        <NavLink 
          to="/authors" 
          className={({ isActive }) => `nav-link ${isActive ? 'text-primary' : 'text-gray-400'}`}
          title="Authors"
        >
          <GroupIcon fontSize="medium" />
        </NavLink>

        {isAuthenticated && (
          <NavLink 
            to="/favorites" 
            className={({ isActive }) => `nav-link ${isActive ? 'text-primary' : 'text-gray-400'}`}
            title="Favorites"
          >
            <FavoriteIcon fontSize="medium" />
          </NavLink>
        )}

        {isAuthenticated && user?.role === 'AUTHOR' && (
          <NavLink 
            to="/my-books" 
            className={({ isActive }) => `nav-link ${isActive ? 'text-primary' : 'text-gray-400'}`}
            title="My Books"
          >
            <MenuBookIcon fontSize="medium" />
          </NavLink>
        )}


        {isAuthenticated && user?.role === 'ADMIN' && (
          <NavLink 
            to="/admin" 
            className={({ isActive }) => `nav-link ${isActive ? 'text-primary' : 'text-gray-400'}`}
            title="Admin Dashboard"
          >
            <AssessmentIcon fontSize="medium" />
          </NavLink>
        )}

        <NavLink 
          to={isAuthenticated ? "/profile" : "/login"} 
          className={({ isActive }) => `nav-link ${isActive ? 'text-primary' : 'text-gray-400'}`}
          title={isAuthenticated ? "Profile" : "Login"}
        >
          <PersonIcon fontSize="medium" />
        </NavLink>

        {isAuthenticated && (
          <div className="relative w-full">
            <div 
              onClick={() => setShowNotifications(!showNotifications)}
              className={`nav-link cursor-pointer group flex items-center justify-center w-full ${showNotifications ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
            >
              <NotificationsIcon className="text-gray-400 group-hover:text-primary transition-colors" fontSize="medium" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-2 w-4 h-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full border-2 border-white dark:border-slate-900">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </div>
            
            {showNotifications && user && (
              <NotificationDropdown 
                userId={user.id} 
                onClose={() => setShowNotifications(false)} 
              />
            )}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-6 items-center">
        <button 
          onClick={toggleTheme}
          className="text-gray-400 hover:text-primary transition-colors"
          title="Toggle Theme"
        >
          {theme === "light" ? <DarkModeIcon /> : <LightModeIcon />}
        </button>

        {isAuthenticated && (
          <button 
            onClick={logout}
            className="text-gray-400 hover:text-red-500 transition-colors"
            title="Logout"
          >
            <LogoutIcon />
          </button>
        )}
        
        {user?.photo && (
          <img 
            src={user.photo} 
            alt="User Photo" 
            className="w-10 h-10 rounded-full border-2 border-primary shadow-sm"
          />
        )}
      </div>
    </nav>
  );
}

export default Navbar;

