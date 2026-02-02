import React, { useState, useEffect, useRef } from 'react';
import { User, UserRole, Appointment, ServiceType, AppointmentStatus, ChatMessage } from '../types';
import { SERVICES_INFO } from '../constants';
import { generateHealthResponse, generateDailyHealthTip } from '../services/geminiService';
import { 
  Calendar, Clock, CheckCircle, XCircle, MessageSquare, 
  Plus, Search, Sparkles, Send, Loader2, Trash2 
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

interface DashboardProps {
  currentUser: User;
  appointments: Appointment[];
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Dashboard: React.FC<DashboardProps> = ({ currentUser, appointments, setAppointments }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'appointments' | 'chat'>('overview');
  const [dailyTip, setDailyTip] = useState<string>('');

  // Initial Data Load
  useEffect(() => {
    const fetchTip = async () => {
      const tip = await generateDailyHealthTip();
      setDailyTip(tip);
    };
    fetchTip();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header & Welcome */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
            {currentUser.role === UserRole.ADMIN ? 'Administrator Dashboard' : 'My Wellness Dashboard'}
          </h1>
          <p className="text-slate-500 mt-1">
            {currentUser.role === UserRole.ADMIN 
              ? 'Manage clinic operations and view analytics.' 
              : `Welcome back, ${currentUser.name}.`
            }
          </p>
        </div>
        
        {/* Daily Tip Card */}
        <div className="bg-gradient-to-r from-teal-50 to-blue-50 border border-teal-100 p-4 rounded-xl flex items-start gap-3 max-w-lg">
          <Sparkles className="text-teal-500 flex-shrink-0 mt-1" size={20} />
          <div>
            <h4 className="text-xs font-bold text-teal-700 uppercase tracking-wider mb-1">Daily Health Tip</h4>
            <p className="text-sm text-slate-700 font-medium italic">
              {dailyTip ? `"${dailyTip}"` : <span className="flex items-center gap-2"><Loader2 size={12} className="animate-spin" /> Loading tip...</span>}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 mb-6 overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-4 px-6 font-medium text-sm transition-colors whitespace-nowrap ${activeTab === 'overview' ? 'border-b-2 border-teal-600 text-teal-600' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('appointments')}
          className={`pb-4 px-6 font-medium text-sm transition-colors whitespace-nowrap ${activeTab === 'appointments' ? 'border-b-2 border-teal-600 text-teal-600' : 'text-slate-500 hover:text-slate-700'}`}
        >
          {currentUser.role === UserRole.ADMIN ? 'Manage Appointments' : 'My Appointments'}
        </button>
        {currentUser.role !== UserRole.ADMIN && (
          <button
            onClick={() => setActiveTab('chat')}
            className={`pb-4 px-6 font-medium text-sm transition-colors whitespace-nowrap ${activeTab === 'chat' ? 'border-b-2 border-teal-600 text-teal-600' : 'text-slate-500 hover:text-slate-700'}`}
          >
             Ask Francis (AI)
          </button>
        )}
      </div>

      {/* Content Area */}
      <div className="min-h-[500px]">
        {activeTab === 'overview' && (
          currentUser.role === UserRole.ADMIN 
            ? <AdminOverview appointments={appointments} /> 
            : <UserOverview appointments={appointments} userId={currentUser.id} setTab={setActiveTab} />
        )}
        
        {activeTab === 'appointments' && (
          currentUser.role === UserRole.ADMIN
            ? <AdminAppointmentManager appointments={appointments} setAppointments={setAppointments} />
            : <UserAppointmentManager appointments={appointments} setAppointments={setAppointments} currentUser={currentUser} />
        )}

        {activeTab === 'chat' && currentUser.role !== UserRole.ADMIN && (
          <AIChatInterface currentUser={currentUser} />
        )}
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*                                SUB COMPONENTS                              */
/* -------------------------------------------------------------------------- */

// --- Admin Overview ---
const AdminOverview: React.FC<{ appointments: Appointment[] }> = ({ appointments }) => {
  // Calc Stats
  const total = appointments.length;
  const pending = appointments.filter(a => a.status === AppointmentStatus.PENDING).length;
  const completed = appointments.filter(a => a.status === AppointmentStatus.COMPLETED).length;

  const dataStatus = [
    { name: 'Pending', value: pending },
    { name: 'Confirmed', value: appointments.filter(a => a.status === AppointmentStatus.CONFIRMED).length },
    { name: 'Completed', value: completed },
    { name: 'Cancelled', value: appointments.filter(a => a.status === AppointmentStatus.CANCELLED).length },
  ];

  // Group by service type
  const serviceCount = appointments.reduce((acc, curr) => {
    acc[curr.serviceType] = (acc[curr.serviceType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const dataService = Object.keys(serviceCount).map(key => ({
    name: key,
    value: serviceCount[key]
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* KPI Cards */}
      <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-slate-500 text-sm font-medium mb-1">Total Appointments</div>
          <div className="text-3xl font-bold text-slate-800">{total}</div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-slate-500 text-sm font-medium mb-1">Pending Actions</div>
          <div className="text-3xl font-bold text-orange-600">{pending}</div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-slate-500 text-sm font-medium mb-1">Completed Visits</div>
          <div className="text-3xl font-bold text-teal-600">{completed}</div>
        </div>
      </div>

      {/* Charts */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm min-h-[300px]">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Appointments by Status</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={dataStatus}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {dataStatus.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm min-h-[300px]">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Popular Services</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={dataService} layout="vertical" margin={{ left: 40 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" width={100} style={{fontSize: '12px'}} />
            <Tooltip />
            <Bar dataKey="value" fill="#0d9488" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// --- User Overview ---
const UserOverview: React.FC<{ appointments: Appointment[], userId: string, setTab: (t: any) => void }> = ({ appointments, userId, setTab }) => {
  const myAppointments = appointments.filter(a => a.userId === userId);
  const nextAppointment = myAppointments
    .filter(a => a.status === AppointmentStatus.CONFIRMED && new Date(a.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-teal-600 text-white p-8 rounded-2xl shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-4">Need Medical Attention?</h2>
          <p className="text-teal-100 mb-6">Book an appointment with our specialists easily.</p>
          <button 
            onClick={() => setTab('appointments')}
            className="bg-white text-teal-700 px-6 py-2 rounded-full font-bold hover:bg-teal-50 transition-colors"
          >
            Book Now
          </button>
        </div>
        <div className="absolute right-[-20px] bottom-[-40px] opacity-20">
          <Calendar size={200} />
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Upcoming Appointment</h3>
        {nextAppointment ? (
          <div className="flex gap-4 items-start">
             <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
                <Clock size={24} />
             </div>
             <div>
               <div className="font-semibold text-slate-900">{nextAppointment.serviceType}</div>
               <div className="text-slate-500 text-sm">{new Date(nextAppointment.date).toDateString()} at {nextAppointment.time}</div>
               <div className="mt-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                 Confirmed
               </div>
             </div>
          </div>
        ) : (
          <div className="text-slate-500 text-center py-6">
            <p>No upcoming appointments.</p>
          </div>
        )}
      </div>
      
       <div className="bg-indigo-50 p-8 rounded-2xl shadow-sm border border-indigo-100 md:col-span-2 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-indigo-900 mb-2">Have health questions?</h3>
            <p className="text-indigo-700 text-sm">Our AI Assistant Francis is here to help clarify general health concerns.</p>
          </div>
          <button 
            onClick={() => setTab('chat')}
            className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors"
          >
            <MessageSquare size={18} /> Chat with Francis
          </button>
       </div>
    </div>
  );
};

// --- User Appointment Manager (Booking & List) ---
const UserAppointmentManager: React.FC<{ 
  appointments: Appointment[], 
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>,
  currentUser: User
}> = ({ appointments, setAppointments, currentUser }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    serviceType: ServiceType.MEDICAL,
    date: '',
    time: '',
    reason: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newAppointment: Appointment = {
      id: Math.random().toString(36).substr(2, 9),
      userId: currentUser.id,
      userName: currentUser.name,
      serviceType: formData.serviceType,
      date: formData.date,
      time: formData.time,
      reason: formData.reason,
      status: AppointmentStatus.PENDING
    };
    setAppointments(prev => [...prev, newAppointment]);
    setShowForm(false);
    setFormData({ serviceType: ServiceType.MEDICAL, date: '', time: '', reason: '' });
  };

  const myAppointments = appointments.filter(a => a.userId === currentUser.id);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center">
        <h3 className="font-bold text-lg text-slate-800">My Appointments</h3>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors"
        >
          {showForm ? 'Cancel' : <><Plus size={16} /> New Appointment</>}
        </button>
      </div>

      {showForm && (
        <div className="p-6 bg-slate-50 border-b border-slate-100">
          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Service</label>
                <select 
                  className="w-full rounded-lg border-slate-300 border p-2 text-sm focus:ring-2 focus:ring-teal-500 outline-none"
                  value={formData.serviceType}
                  onChange={e => setFormData({...formData, serviceType: e.target.value as ServiceType})}
                  required
                >
                  {Object.values(ServiceType).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                <input 
                  type="date" 
                  className="w-full rounded-lg border-slate-300 border p-2 text-sm focus:ring-2 focus:ring-teal-500 outline-none"
                  value={formData.date}
                  onChange={e => setFormData({...formData, date: e.target.value})}
                  required
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Preferred Time</label>
                <input 
                  type="time" 
                  className="w-full rounded-lg border-slate-300 border p-2 text-sm focus:ring-2 focus:ring-teal-500 outline-none"
                  value={formData.time}
                  onChange={e => setFormData({...formData, time: e.target.value})}
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Reason for Visit</label>
              <textarea 
                className="w-full rounded-lg border-slate-300 border p-2 text-sm focus:ring-2 focus:ring-teal-500 outline-none"
                rows={3}
                value={formData.reason}
                onChange={e => setFormData({...formData, reason: e.target.value})}
                placeholder="Briefly describe your symptoms or reason for visit..."
                required
              />
            </div>
            <div className="flex justify-end pt-2">
              <button type="submit" className="bg-teal-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-teal-700">
                Submit Request
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 font-medium">
            <tr>
              <th className="px-6 py-4">Service</th>
              <th className="px-6 py-4">Date & Time</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {myAppointments.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-slate-400">No appointments found.</td>
              </tr>
            ) : (
              myAppointments.map(app => (
                <tr key={app.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-800">{app.serviceType}</td>
                  <td className="px-6 py-4 text-slate-600">{app.date} @ {app.time}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${app.status === AppointmentStatus.CONFIRMED ? 'bg-green-100 text-green-800' : 
                        app.status === AppointmentStatus.PENDING ? 'bg-yellow-100 text-yellow-800' :
                        app.status === AppointmentStatus.CANCELLED ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500 italic">{app.notes || '-'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- Admin Appointment Manager ---
const AdminAppointmentManager: React.FC<{ 
  appointments: Appointment[], 
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>> 
}> = ({ appointments, setAppointments }) => {

  const updateStatus = (id: string, status: AppointmentStatus) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  };

  const deleteApp = (id: string) => {
     if(window.confirm('Are you sure you want to delete this record?')) {
        setAppointments(prev => prev.filter(a => a.id !== id));
     }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-100">
        <h3 className="font-bold text-lg text-slate-800">Manage Appointments</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 font-medium">
            <tr>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Service</th>
              <th className="px-6 py-4">Date/Time</th>
              <th className="px-6 py-4">Reason</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
             {appointments.length === 0 ? (
               <tr><td colSpan={6} className="text-center py-8 text-slate-400">No appointments.</td></tr>
             ) : appointments.map(app => (
              <tr key={app.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-medium text-slate-800">{app.userName}</td>
                <td className="px-6 py-4 text-slate-600">{app.serviceType}</td>
                <td className="px-6 py-4 text-slate-600 whitespace-nowrap">{app.date} <br/><span className="text-xs">{app.time}</span></td>
                <td className="px-6 py-4 text-slate-500 max-w-xs truncate" title={app.reason}>{app.reason}</td>
                <td className="px-6 py-4">
                   <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${app.status === AppointmentStatus.CONFIRMED ? 'bg-green-100 text-green-800' : 
                        app.status === AppointmentStatus.PENDING ? 'bg-yellow-100 text-yellow-800' :
                        app.status === AppointmentStatus.CANCELLED ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
                      {app.status}
                    </span>
                </td>
                <td className="px-6 py-4 text-right whitespace-nowrap">
                  {app.status === AppointmentStatus.PENDING && (
                    <div className="flex justify-end gap-2">
                      <button onClick={() => updateStatus(app.id, AppointmentStatus.CONFIRMED)} className="text-green-600 hover:bg-green-50 p-1 rounded"><CheckCircle size={18} /></button>
                      <button onClick={() => updateStatus(app.id, AppointmentStatus.CANCELLED)} className="text-red-600 hover:bg-red-50 p-1 rounded"><XCircle size={18} /></button>
                    </div>
                  )}
                  {app.status === AppointmentStatus.CONFIRMED && (
                    <button onClick={() => updateStatus(app.id, AppointmentStatus.COMPLETED)} className="text-blue-600 text-xs font-medium hover:underline">Mark Complete</button>
                  )}
                   {(app.status === AppointmentStatus.CANCELLED || app.status === AppointmentStatus.COMPLETED) && (
                    <button onClick={() => deleteApp(app.id)} className="text-slate-400 hover:text-red-600 p-1"><Trash2 size={16} /></button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- AI Chat Interface ---
const AIChatInterface: React.FC<{ currentUser: User }> = ({ currentUser }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'model', text: `Hi ${currentUser.name}! I'm Francis, your wellness assistant. How can I help you today?`, timestamp: Date.now() }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const responseText = await generateHealthResponse(input);
    
    const modelMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: 'model', text: responseText, timestamp: Date.now() };
    setMessages(prev => [...prev, modelMsg]);
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto h-[600px] bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
      <div className="p-4 border-b border-slate-100 bg-teal-50 flex items-center gap-3">
        <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center text-white">
          <Sparkles size={20} />
        </div>
        <div>
          <h3 className="font-bold text-slate-800">Francis</h3>
          <p className="text-xs text-slate-500">AI Wellness Assistant</p>
        </div>
      </div>
      
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-teal-600 text-white rounded-tr-none' 
                : 'bg-slate-100 text-slate-800 rounded-tl-none'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-100 p-4 rounded-2xl rounded-tl-none flex gap-2 items-center">
              <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100"></span>
              <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200"></span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="p-4 border-t border-slate-100">
        <form onSubmit={handleSend} className="flex gap-2">
          <input 
            type="text" 
            className="flex-grow border border-slate-300 rounded-full px-4 py-3 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
            placeholder="Ask a health question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button 
            type="submit" 
            disabled={loading || !input.trim()}
            className="bg-teal-600 text-white p-3 rounded-full hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={20} />
          </button>
        </form>
        <p className="text-center text-xs text-slate-400 mt-2">AI can make mistakes. Please consult a professional for serious medical advice.</p>
      </div>
    </div>
  );
};

export default Dashboard;