import { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const EventModal = ({ isOpen, onClose, event, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    status: 'Upcoming',
  });

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title || '',
        description: event.description || '',
        date: event.date ? new Date(event.date).toISOString().split('T')[0] : '',
        location: event.location || '',
        status: event.status || 'Upcoming',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        date: '',
        location: '',
        status: 'Upcoming',
      });
    }
  }, [event, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (event) {
        await api.put(`/events/${event._id}`, formData);
        toast.success('Tadbir muvaffaqiyatli yangilandi');
      } else {
        await api.post('/events', formData);
        toast.success('Yangi tadbir muvaffaqiyatli yaratildi');
      }
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-card border border-slate-800 w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-xl font-bold">{event ? 'Tadbirni tahrirlash' : 'Yangi tadbir yaratish'}</h2>
          <button onClick={onClose} className="text-muted hover:text-text transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400">Tadbir nomi</label>
            <input
              required
              type="text"
              className="input-field w-full"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Masalan: Daraxt ekish kuni"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400">Tavsif</label>
            <textarea
              required
              className="input-field w-full min-h-[100px]"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Tadbir haqida batafsil..."
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Sana</label>
              <input
                required
                type="date"
                className="input-field w-full"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Holati</label>
              <select
                className="input-field w-full"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="Upcoming">Kutilmoqda</option>
                <option value="Ongoing">Jarayonda</option>
                <option value="Completed">Tugagan</option>
                <option value="Cancelled">Bekor qilingan</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400">Manzil</label>
            <input
              required
              type="text"
              className="input-field w-full"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Masalan: Markaziy park"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn-outline"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-[2] btn-primary flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Saqlash'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventModal;
