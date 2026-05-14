import { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const VolunteerModal = ({ isOpen, onClose, volunteer, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    age: '',
    gender: 'Male',
    address: '',
    role: 'Volunteer',
    status: 'Active',
    notes: '',
  });

  useEffect(() => {
    if (volunteer) {
      setFormData({
        fullName: volunteer.fullName || '',
        phoneNumber: volunteer.phoneNumber || '',
        age: volunteer.age || '',
        gender: volunteer.gender || 'Male',
        address: volunteer.address || '',
        role: volunteer.role || 'Volunteer',
        status: volunteer.status || 'Active',
        notes: volunteer.notes || '',
      });
    } else {
      setFormData({
        fullName: '',
        phoneNumber: '',
        age: '',
        gender: 'Male',
        address: '',
        role: 'Volunteer',
        status: 'Active',
        notes: '',
      });
    }
  }, [volunteer, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (volunteer) {
        await api.put(`/volunteers/${volunteer._id}`, formData);
        toast.success('Ma\'lumotlar muvaffaqiyatli yangilandi');
      } else {
        await api.post('/volunteers', formData);
        toast.success('Yangi ko\'ngilli muvaffaqiyatli qo\'shildi');
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
      <div className="bg-card border border-slate-800 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-xl font-bold">{volunteer ? 'Tahrirlash' : 'Yangi ko\'ngilli qo\'shish'}</h2>
          <button onClick={onClose} className="text-muted hover:text-text transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 overflow-y-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">To'liq ism</label>
              <input
                required
                type="text"
                className="input-field w-full"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="Masalan: Ali Valiyev"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Telefon raqam</label>
              <input
                required
                type="text"
                className="input-field w-full"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                placeholder="+998 90 123 45 67"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Yoshi</label>
              <input
                required
                type="number"
                className="input-field w-full"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                placeholder="18"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Jinsi</label>
              <select
                className="input-field w-full"
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              >
                <option value="Male">Erkak</option>
                <option value="Female">Ayol</option>
              </select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-slate-400">Manzil</label>
              <input
                required
                type="text"
                className="input-field w-full"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Buloqboshi tumani, Navoiy ko'chasi 15-uy"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Roli</label>
              <input
                required
                type="text"
                className="input-field w-full"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                placeholder="Volunteer, Leader, etc."
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Holati</label>
              <select
                className="input-field w-full"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="Active">Faol</option>
                <option value="Inactive">Nofaol</option>
                <option value="On Leave">Ta'tilda</option>
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400">Eslatmalar</label>
            <textarea
              className="input-field w-full min-h-[100px]"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Qo'shimcha ma'lumotlar..."
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

export default VolunteerModal;
