import { useState, useEffect } from 'react';
import { 
  ClipboardCheck, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Clock,
  Loader2,
  Calendar
} from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const Attendance = () => {
  const [events, setEvents] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [loading, setLoading] = useState(true);
  const [markingLoading, setMarkingLoading] = useState({});
  const [attendanceRecords, setAttendanceRecords] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsRes, volunteersRes] = await Promise.all([
          api.get('/events'),
          api.get('/volunteers')
        ]);
        setEvents(eventsRes.data.data);
        setVolunteers(volunteersRes.data.data);
        if (eventsRes.data.data.length > 0) {
          setSelectedEventId(eventsRes.data.data[0]._id);
        }
      } catch (err) {
        toast.error('Ma\'lumotlarni yuklashda xatolik');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedEventId) {
      fetchAttendance();
    }
  }, [selectedEventId]);

  const fetchAttendance = async () => {
    try {
      const res = await api.get(`/attendance/event/${selectedEventId}`);
      const records = {};
      res.data.data.forEach(rec => {
        records[rec.volunteer._id] = rec.status;
      });
      setAttendanceRecords(records);
    } catch (err) {
      console.error(err);
    }
  };

  const handleMark = async (volunteerId, status) => {
    setMarkingLoading(prev => ({ ...prev, [volunteerId]: true }));
    try {
      await api.post('/attendance', {
        volunteer: volunteerId,
        event: selectedEventId,
        status: status
      });
      setAttendanceRecords(prev => ({ ...prev, [volunteerId]: status }));
      toast.success('Belgilandi');
    } catch (err) {
      toast.error('Xatolik: ehtimol allaqachon belgilangan');
    } finally {
      setMarkingLoading(prev => ({ ...prev, [volunteerId]: false }));
    }
  };

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin text-primary" /></div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Davomat</h1>
        <p className="text-muted">Tadbirlar bo'yicha ko'ngillilar ishtirokini belgilash.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/3 space-y-4">
          <h3 className="font-semibold flex items-center gap-2">
            <Calendar className="w-4 h-4" /> Tadbirni tanlang
          </h3>
          <div className="space-y-2">
            {events.map((event) => (
              <button
                key={event._id}
                onClick={() => setSelectedEventId(event._id)}
                className={`w-full text-left p-4 rounded-2xl border transition-all ${
                  selectedEventId === event._id 
                    ? 'bg-primary/10 border-primary text-primary shadow-lg shadow-primary/5' 
                    : 'bg-card border-slate-800 text-muted hover:border-slate-700'
                }`}
              >
                <p className="font-bold truncate">{event.title}</p>
                <p className="text-xs opacity-70">{new Date(event.date).toLocaleDateString('uz-UZ')}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold">Ko'ngillilar ro'yxati</h3>
            <div className="text-xs text-muted">
              Jami: {volunteers.length} ta
            </div>
          </div>

          <div className="space-y-4">
            {volunteers.map((v) => (
              <div key={v._id} className="flex items-center justify-between p-4 bg-slate-900/50 rounded-2xl border border-slate-800/50 group hover:border-slate-700 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-400">
                    {v.fullName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{v.fullName}</p>
                    <p className="text-xs text-muted">{v.role}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    disabled={markingLoading[v._id] || attendanceRecords[v._id] === 'Present'}
                    onClick={() => handleMark(v._id, 'Present')}
                    className={`p-2 rounded-xl transition-all ${
                      attendanceRecords[v._id] === 'Present'
                        ? 'bg-accent text-white'
                        : 'bg-slate-800 text-muted hover:bg-accent/20 hover:text-accent'
                    }`}
                  >
                    <CheckCircle2 className="w-5 h-5" />
                  </button>
                  <button
                    disabled={markingLoading[v._id] || attendanceRecords[v._id] === 'Absent'}
                    onClick={() => handleMark(v._id, 'Absent')}
                    className={`p-2 rounded-xl transition-all ${
                      attendanceRecords[v._id] === 'Absent'
                        ? 'bg-red-500 text-white'
                        : 'bg-slate-800 text-muted hover:bg-red-500/20 hover:text-red-500'
                    }`}
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                  <button
                    disabled={markingLoading[v._id] || attendanceRecords[v._id] === 'Late'}
                    onClick={() => handleMark(v._id, 'Late')}
                    className={`p-2 rounded-xl transition-all ${
                      attendanceRecords[v._id] === 'Late'
                        ? 'bg-orange-500 text-white'
                        : 'bg-slate-800 text-muted hover:bg-orange-500/20 hover:text-orange-500'
                    }`}
                  >
                    <Clock className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
