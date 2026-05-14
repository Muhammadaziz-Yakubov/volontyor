import { useState, useEffect } from 'react';
import { 
  Users, 
  Calendar, 
  CheckCircle2, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Activity
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import api from '../services/api';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/statistics');
        setStats(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <Activity className="w-10 h-10 animate-spin text-primary" />
      <p className="text-muted">Statistika yuklanmoqda...</p>
    </div>
  );

  const cards = [
    { 
      label: 'Jami ko\'ngillilar', 
      value: stats?.totalVolunteers || 0, 
      icon: Users, 
      color: 'bg-blue-500/10 text-blue-500',
      trend: '+12%',
      isUp: true
    },
    { 
      label: 'Faol ko\'ngillilar', 
      value: stats?.activeVolunteers || 0, 
      icon: TrendingUp, 
      color: 'bg-accent/10 text-accent',
      trend: '+5.4%',
      isUp: true
    },
    { 
      label: 'Kutilayotgan tadbirlar', 
      value: stats?.upcomingEvents || 0, 
      icon: Calendar, 
      color: 'bg-purple-500/10 text-purple-500',
      trend: '-2',
      isUp: false
    },
    { 
      label: 'Davomat ko\'rsatkichi', 
      value: `${stats?.attendanceRate || 0}%`, 
      icon: CheckCircle2, 
      color: 'bg-orange-500/10 text-orange-500',
      trend: '+2.1%',
      isUp: true
    },
  ];

  const chartData = [
    { name: 'Dush', count: 40 },
    { name: 'Sesh', count: 30 },
    { name: 'Chor', count: 65 },
    { name: 'Pay', count: 45 },
    { name: 'Jum', count: 90 },
    { name: 'Shan', count: 120 },
    { name: 'Yak', count: 85 },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-white to-slate-500 bg-clip-text text-transparent">Boshqaruv Paneli</h1>
          <p className="text-muted mt-1">Xush kelibsiz! Bugungi ko'rsatkichlar va faolliklar.</p>
        </div>
        <div className="flex gap-3">
          <div className="hidden md:flex flex-col items-end justify-center px-4 border-r border-slate-800">
            <p className="text-[10px] uppercase font-bold text-muted tracking-widest">Bugun</p>
            <p className="text-sm font-bold">{new Date().toLocaleDateString('uz-UZ', { day: 'numeric', month: 'long' })}</p>
          </div>
          <button className="btn-primary shadow-lg shadow-primary/20">Hisobotni yuklash</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="card group hover:border-primary/30 transition-all duration-500 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 blur-2xl group-hover:bg-primary/10 transition-all"></div>
            
            <div className="flex items-start justify-between mb-4 relative z-10">
              <div className={`p-4 rounded-2xl ${card.color} shadow-inner`}>
                <card.icon className="w-6 h-6" />
              </div>
              <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full ${
                card.isUp ? 'text-accent bg-accent/10' : 'text-red-400 bg-red-400/10'
              }`}>
                {card.trend}
                {card.isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              </div>
            </div>
            <h3 className="text-muted text-xs font-bold uppercase tracking-wider">{card.label}</h3>
            <p className="text-4xl font-black mt-2 tracking-tighter">{card.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card border-slate-800/50 bg-slate-900/20 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <div className="w-2 h-6 bg-primary rounded-full"></div>
              Haftalik faollik dinamikasi
            </h3>
            <select className="bg-slate-900 border border-slate-800 text-xs rounded-lg px-2 py-1 focus:outline-none">
              <option>Oxirgi 7 kun</option>
              <option>Oxirgi 30 kun</option>
            </select>
          </div>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" opacity={0.5} />
                <XAxis 
                  dataKey="name" 
                  stroke="#64748b" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false}
                  dy={10}
                />
                <YAxis 
                  stroke="#64748b" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false}
                />
                <Tooltip 
                  cursor={{ stroke: '#3B82F6', strokeWidth: 2 }}
                  contentStyle={{ backgroundColor: '#111827', border: '1px solid #1e293b', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }}
                  itemStyle={{ color: '#F8FAFC', fontWeight: 'bold' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#3B82F6" 
                  strokeWidth={4} 
                  fillOpacity={1} 
                  fill="url(#colorCount)" 
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card border-slate-800/50 bg-slate-900/20 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <div className="w-2 h-6 bg-purple-500 rounded-full"></div>
              Yaqindagi tadbirlar
            </h3>
            <button className="text-xs text-primary hover:underline font-bold">Hammasi</button>
          </div>
          <div className="space-y-5">
            {stats?.recentEvents?.length > 0 ? stats.recentEvents.map((event, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex gap-4 items-center p-3 rounded-2xl hover:bg-slate-800/30 transition-colors cursor-pointer border border-transparent hover:border-slate-800"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 flex flex-col items-center justify-center border border-slate-700 shrink-0 shadow-lg">
                  <span className="text-[9px] uppercase font-black text-muted leading-none mb-1">
                    {new Date(event.date).toLocaleDateString('uz-UZ', { month: 'short' })}
                  </span>
                  <span className="text-xl font-black leading-none text-white">
                    {new Date(event.date).getDate()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold truncate text-slate-200">{event.title}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-1 h-1 rounded-full bg-slate-600"></div>
                    <p className="text-[11px] text-muted truncate font-medium">{event.location}</p>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-tighter ${
                  event.status === 'Upcoming' ? 'bg-blue-500/10 text-blue-400' : 
                  event.status === 'Completed' ? 'bg-accent/10 text-accent' : 
                  'bg-slate-500/10 text-slate-400'
                }`}>
                  {event.status === 'Upcoming' ? 'Kutilmoqda' : event.status === 'Completed' ? 'Tugagan' : event.status}
                </div>
              </motion.div>
            )) : (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <Calendar className="w-12 h-12 text-slate-800 mb-2" />
                <p className="text-sm text-muted font-medium italic">Tadbirlar topilmadi</p>
              </div>
            )}
          </div>

          <div className="mt-8 p-4 rounded-3xl bg-gradient-to-br from-primary/20 to-accent/10 border border-primary/20 relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-white/5 rounded-full blur-xl group-hover:scale-150 transition-all duration-700"></div>
            <p className="text-xs font-bold text-primary mb-1">Eslatma</p>
            <p className="text-[11px] font-medium leading-relaxed text-slate-300">Keyingi yirik tadbirga 3 kun qoldi. Tayyorgarlik ko'rishni unutmang!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
