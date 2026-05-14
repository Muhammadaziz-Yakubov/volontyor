import { useState, useEffect } from 'react';
import { 
  Plus, 
  Calendar as CalendarIcon, 
  MapPin, 
  Users, 
  Clock,
  ChevronRight,
  Loader2,
  Trash2,
  Edit2,
  UserPlus
} from 'lucide-react';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import EventModal from '../components/EventModal';
import ParticipantModal from '../components/ParticipantModal';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isParticipantModalOpen, setIsParticipantModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await api.get('/events');
      setEvents(res.data.data);
    } catch (err) {
      toast.error('Tadbirlarni yuklashda xatolik');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleAdd = () => {
    setSelectedEvent(null);
    setIsModalOpen(true);
  };

  const handleEdit = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleManageParticipants = (event) => {
    setSelectedEvent(event);
    setIsParticipantModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Haqiqatan ham ushbu tadbirni o\'chirmoqchimisiz?')) {
      try {
        await api.delete(`/events/${id}`);
        toast.success('Tadbir o\'chirildi');
        fetchEvents();
      } catch (err) {
        toast.error('O\'chirishda xatolik');
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tadbirlar</h1>
          <p className="text-muted">Ko'ngillilar faoliyatini rejalashtirish va boshqarish.</p>
        </div>
        <button 
          onClick={handleAdd}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Tadbir yaratish
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <p className="text-muted">Yuklanmoqda...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AnimatePresence mode='popLayout'>
            {events.map((event, idx) => (
              <motion.div
                key={event._id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="card group hover:border-primary/50 transition-all"
              >
                <div className="flex gap-6">
                  <div className="w-32 h-32 rounded-2xl bg-slate-800 flex flex-col items-center justify-center border border-slate-700 shrink-0">
                    <span className="text-xs uppercase font-bold text-primary tracking-widest mb-1">
                      {new Date(event.date).toLocaleDateString('uz-UZ', { month: 'short' })}
                    </span>
                    <span className="text-3xl font-bold leading-none">
                      {new Date(event.date).getDate()}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-bold truncate group-hover:text-primary transition-colors">{event.title}</h3>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold ${
                          event.status === 'Upcoming' ? 'bg-blue-500/10 text-blue-500' :
                          event.status === 'Ongoing' ? 'bg-accent/10 text-accent' :
                          event.status === 'Completed' ? 'bg-slate-500/10 text-slate-500' :
                          'bg-red-500/10 text-red-500'
                        }`}>
                          {event.status === 'Upcoming' ? 'Kutilmoqda' : 
                           event.status === 'Ongoing' ? 'Jarayonda' : 
                           event.status === 'Completed' ? 'Tugagan' : 'Bekor qilingan'}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted line-clamp-2 mb-4">{event.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2 text-xs text-muted">
                        <MapPin className="w-3.5 h-3.5" />
                        <span className="truncate">{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted" />
                    <span className="text-xs text-muted">
                      <span className="font-bold text-text">{event.participants?.length || 0}</span> ishtirokchi
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleManageParticipants(event)}
                      className="p-2 text-muted hover:text-accent hover:bg-accent/10 rounded-lg transition-all flex items-center gap-1 text-[10px] font-bold"
                    >
                      <UserPlus className="w-4 h-4" />
                      Biriktirish
                    </button>
                    <button 
                      onClick={() => handleEdit(event)}
                      className="p-2 text-muted hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(event._id)}
                      className="p-2 text-muted hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {!loading && events.length === 0 && (
        <div className="text-center py-20 bg-card rounded-3xl border border-dashed border-slate-800">
          <CalendarIcon className="w-16 h-16 text-slate-700 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Tadbirlar mavjud emas</h3>
          <p className="text-muted">Birinchi tadbirni yaratish uchun "Tadbir yaratish" tugmasini bosing.</p>
        </div>
      )}

      <EventModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        event={selectedEvent}
        onSuccess={fetchEvents}
      />

      <ParticipantModal 
        isOpen={isParticipantModalOpen}
        onClose={() => setIsParticipantModalOpen(false)}
        event={selectedEvent}
        onSuccess={fetchEvents}
      />
    </div>
  );
};

export default Events;
