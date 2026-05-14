import { useAuth } from '../context/AuthContext';
import { Bell, Search, User } from 'lucide-react';

const Navbar = () => {
  const { user } = useAuth();

  return (
    <header className="h-20 bg-background/80 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-8 sticky top-0 z-40">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted w-4 h-4" />
          <input
            type="text"
            placeholder="Qidirish..."
            className="w-full bg-slate-900/50 border border-slate-800 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button className="relative text-muted hover:text-text transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-accent rounded-full border-2 border-background"></span>
        </button>
        
        <div className="flex items-center gap-3 pl-6 border-l border-slate-800">
          <div className="text-right">
            <p className="text-sm font-medium">{user?.name || 'Admin'}</p>
            <p className="text-xs text-muted">Super Admin</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
            <User className="text-muted w-6 h-6" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
