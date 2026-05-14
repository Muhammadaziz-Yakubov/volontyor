import { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit2, 
  Trash2, 
  UserCircle2,
  Phone,
  MapPin,
  Loader2
} from 'lucide-react';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import VolunteerModal from '../components/VolunteerModal';

const Volunteers = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);

  const fetchVolunteers = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/volunteers?search=${search}&status=${filter}`);
      setVolunteers(res.data.data);
    } catch (err) {
      toast.error('Ko\'ngillilarni yuklashda xatolik');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchVolunteers();
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [search, filter]);

  const handleDelete = async (id) => {
    if (window.confirm('Haqiqatan ham ushbu ko\'ngillini o\'chirmoqchimisiz?')) {
      try {
        await api.delete(`/volunteers/${id}`);
        toast.success('Ko\'ngilli o\'chirildi');
        fetchVolunteers();
      } catch (err) {
        toast.error('O\'chirishda xatolik');
      }
    }
  };

  const handleEdit = (volunteer) => {
    setSelectedVolunteer(volunteer);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedVolunteer(null);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ko'ngillilar</h1>
          <p className="text-muted">Tashkilot ko'ngillilarini boshqarish va kuzatish.</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <button 
            onClick={async () => {
              const res = await api.get('/volunteers/export', { responseType: 'blob' });
              const url = window.URL.createObjectURL(new Blob([res.data]));
              const link = document.createElement('a');
              link.href = url;
              link.setAttribute('download', 'ko_ngillilar.xlsx');
              document.body.appendChild(link);
              link.click();
              link.remove();
            }}
            className="btn-outline flex items-center gap-2 justify-center flex-1 md:flex-none"
          >
            Excelga yuklash
          </button>
          <button 
            onClick={handleAdd}
            className="btn-primary flex items-center gap-2 flex-1 md:flex-none justify-center"
          >
            <Plus className="w-5 h-5" />
            Ko'ngilli qo'shish
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted w-4 h-4" />
          <input
            type="text"
            placeholder="Ism bo'yicha qidirish..."
            className="w-full bg-card border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-4">
          <select 
            className="bg-card border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="">Barcha holatlar</option>
            <option value="Active">Faol</option>
            <option value="Inactive">Nofaol</option>
            <option value="On Leave">Ta'tilda</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <p className="text-muted">Yuklanmoqda...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode='popLayout'>
            {volunteers.map((v, idx) => (
              <motion.div
                key={v._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="card group hover:border-primary/50 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center border border-slate-700 text-slate-400 group-hover:text-primary transition-colors overflow-hidden">
                      {v.profileImage && v.profileImage !== 'default-profile.png' ? (
                        <img src={v.profileImage} alt={v.fullName} className="w-full h-full object-cover" />
                      ) : (
                        <UserCircle2 className="w-10 h-10" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{v.fullName}</h3>
                      <p className="text-sm text-primary font-medium">{v.role}</p>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded text-[10px] font-bold ${
                    v.status === 'Active' ? 'bg-accent/10 text-accent' : 
                    v.status === 'On Leave' ? 'bg-orange-500/10 text-orange-500' :
                    'bg-red-400/10 text-red-400'
                  }`}>
                    {v.status === 'Active' ? 'Faol' : v.status === 'On Leave' ? 'Ta\'tilda' : 'Nofaol'}
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-sm text-muted">
                    <Phone className="w-4 h-4" />
                    {v.phoneNumber}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted">
                    <MapPin className="w-4 h-4" />
                    {v.address}
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-muted uppercase font-bold tracking-wider">Davomat</span>
                    <span className="text-lg font-bold">{v.attendanceCount}</span>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleEdit(v)}
                      className="p-2 text-muted hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(v._id)}
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

      {!loading && volunteers.length === 0 && (
        <div className="text-center py-20 bg-card rounded-3xl border border-dashed border-slate-800">
          <UserCircle2 className="w-16 h-16 text-slate-700 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Ko'ngillilar topilmadi</h3>
          <p className="text-muted">Qidiruv yoki filtrlash parametrlarini o'zgartirib ko'ring.</p>
        </div>
      )}

      <VolunteerModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        volunteer={selectedVolunteer}
        onSuccess={fetchVolunteers}
      />
    </div>
  );
};

export default Volunteers;
