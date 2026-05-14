import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  ClipboardCheck, 
  BarChart3, 
  Settings,
  LogOut,
  Heart
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { cn } from '../utils/cn';

const Sidebar = () => {
  const location = useLocation();
  const { logout } = useAuth();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Asosiy', path: '/' },
    { icon: Users, label: 'Ko\'ngillilar', path: '/volunteers' },
    { icon: Calendar, label: 'Tadbirlar', path: '/events' },
    { icon: ClipboardCheck, label: 'Davomat', path: '/attendance' },
    { icon: BarChart3, label: 'Statistika', path: '/statistics' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-card border-r border-slate-800 flex flex-col z-50 transition-all duration-300">
      <div className="p-6 flex items-center gap-3">
        <div className="bg-primary p-2 rounded-lg">
          <Heart className="text-white w-6 h-6" />
        </div>
        <span className="text-xl font-bold tracking-tight">Buloqboshi</span>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
              location.pathname === item.path
                ? "bg-primary text-white shadow-lg shadow-primary/20"
                : "text-muted hover:bg-slate-800/50 hover:text-text"
            )}
          >
            <item.icon className={cn(
              "w-5 h-5",
              location.pathname === item.path ? "text-white" : "text-muted group-hover:text-text"
            )} />
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-4 py-3 text-muted hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Chiqish</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
