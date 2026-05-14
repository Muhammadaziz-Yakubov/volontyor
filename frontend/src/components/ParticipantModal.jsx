import { useState, useEffect } from 'react';
import { X, Search, UserPlus, UserMinus, Loader2 } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const ParticipantModal = ({ isOpen, onClose, event, onSuccess }) => {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [currentParticipants, setCurrentParticipants] = useState([]);

  useEffect(() => {
    if (isOpen) {
      fetchVolunteers();
      if (event && event.participants) {
        setCurrentParticipants(event.participants.map(p => p._id || p));
      }
    }
  }, [isOpen, event]);

  const fetchVolunteers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/volunteers');
      setVolunteers(res.data.data);
    } catch (err) {
      toast.error('Ko\'ngillilarni yuklashda xatolik');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (volunteerId) => {
    try {
      await api.post(`/events/${event._id}/participants`, { volunteerId });
      setCurrentParticipants([...currentParticipants, volunteerId]);
      toast.success('Ko\'ngilli qo\'shildi');
      onSuccess();
    } catch (err) {
      toast.error('Qo\'shishda xatolik');
    }
  };

  const handleRemove = async (volunteerId) => {
    try {
      await api.delete(`/events/${event._id}/participants/${volunteerId}`);
      setCurrentParticipants(currentParticipants.filter(id => id !== volunteerId));
      toast.success('Ko\'ngilli olib tashlandi');
      onSuccess();
    } catch (err) {
      toast.error('Olib tashlashda xatolik');
    }
  };

  const filteredVolunteers = volunteers.filter(v => 
    v.fullName.toLowerCase().includes(search.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-card border border-slate-800 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Ishtirokchilarni boshqarish</h2>
            <p className="text-xs text-muted mt-1">{event?.title}</p>
          </div>
          <button onClick={onClose} className="text-muted hover:text-text transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 border-b border-slate-800">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted w-4 h-4" />
            <input
              type="text"
              placeholder="Ism bo'yicha qidirish..."
              className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {loading ? (
            <div className="flex justify-center py-10"><Loader2 className="animate-spin text-primary" /></div>
          ) : (
            filteredVolunteers.map(v => {
              const isParticipant = currentParticipants.includes(v._id);
              return (
                <div key={v._id} className="flex items-center justify-between p-3 bg-slate-900/30 rounded-2xl border border-slate-800 group hover:border-slate-700 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-400">
                      {v.fullName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{v.fullName}</p>
                      <p className="text-xs text-muted">{v.role}</p>
                    </div>
                  </div>
                  
                  {isParticipant ? (
                    <button 
                      onClick={() => handleRemove(v._id)}
                      className="p-2 text-red-400 hover:bg-red-400/10 rounded-xl transition-all flex items-center gap-2 text-xs font-bold"
                    >
                      <UserMinus className="w-4 h-4" />
                      Olib tashlash
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleAdd(v._id)}
                      className="p-2 text-accent hover:bg-accent/10 rounded-xl transition-all flex items-center gap-2 text-xs font-bold"
                    >
                      <UserPlus className="w-4 h-4" />
                      Qo'shish
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
        
        <div className="p-6 border-t border-slate-800 bg-slate-900/20">
          <button onClick={onClose} className="w-full btn-primary">Tayyor</button>
        </div>
      </div>
    </div>
  );
};

export default ParticipantModal;
