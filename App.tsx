import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import { User, UserRole, Appointment, AppointmentStatus, ServiceType } from './types';
import { DEMO_USERS } from './constants';

const App: React.FC = () => {
  // --- State Management ---
  const [currentPage, setCurrentPage] = useState('landing');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // Mock Database for Appointments
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: '101',
      userId: 'u1',
      userName: 'Juan Dela Cruz',
      serviceType: ServiceType.DENTAL,
      date: '2023-11-15',
      time: '10:00',
      reason: 'Toothache',
      status: AppointmentStatus.COMPLETED
    },
    {
      id: '102',
      userId: 'u1',
      userName: 'Juan Dela Cruz',
      serviceType: ServiceType.MEDICAL,
      date: '2023-12-20',
      time: '14:00',
      reason: 'Annual Physical Exam',
      status: AppointmentStatus.PENDING
    },
    {
        id: '103',
        userId: 'u99',
        userName: 'Maria Clara',
        serviceType: ServiceType.COUNSELING,
        date: '2023-12-21',
        time: '09:00',
        reason: 'Stress management',
        status: AppointmentStatus.CONFIRMED
      }
  ]);

  // --- Authentication Mock ---
  const handleLogin = (email: string) => {
    // Simple mock login logic
    if (email.includes('admin')) {
      setCurrentUser(DEMO_USERS.admin);
      setCurrentPage('dashboard');
    } else {
      setCurrentUser(DEMO_USERS.student);
      setCurrentPage('dashboard');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage('landing');
  };

  // --- Render Logic ---
  const renderContent = () => {
    switch (currentPage) {
      case 'landing':
        return <Landing onGetStarted={() => setCurrentPage('login')} />;
      case 'dashboard':
        if (!currentUser) return <LoginPage onLogin={handleLogin} onBack={() => setCurrentPage('landing')} />;
        return <Dashboard currentUser={currentUser} appointments={appointments} setAppointments={setAppointments} />;
      case 'login':
        return <LoginPage onLogin={handleLogin} onBack={() => setCurrentPage('landing')} />;
      default:
        return <Landing onGetStarted={() => setCurrentPage('login')} />;
    }
  };

  return (
    <Layout 
      currentUser={currentUser} 
      onLogout={handleLogout} 
      onNavigate={setCurrentPage}
      currentPage={currentPage}
    >
      {renderContent()}
    </Layout>
  );
};

// Simple Login Component (Internal to App to keep it simple)
const LoginPage: React.FC<{ onLogin: (email: string) => void, onBack: () => void }> = ({ onLogin, onBack }) => {
  const [email, setEmail] = useState('');
  const [isRegister, setIsRegister] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email);
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-800">{isRegister ? 'Join FrancisCare' : 'Welcome Back'}</h2>
          <p className="text-slate-500 mt-2">Enter your school credentials to access wellness services.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">School Email</label>
            <input 
              type="email" 
              required
              placeholder="e.g., student@sfcg.edu.ph"
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500 outline-none transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          {isRegister && (
             <div>
             <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
             <input 
               type="text" 
               placeholder="Juan Dela Cruz"
               className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-teal-500 outline-none transition-all"
             />
           </div>
          )}
          
          <button type="submit" className="w-full bg-teal-600 text-white font-bold py-3 rounded-lg hover:bg-teal-700 transition-colors shadow-md hover:shadow-lg">
            {isRegister ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-500">
           {isRegister ? "Already have an account? " : "Don't have an account? "}
           <button onClick={() => setIsRegister(!isRegister)} className="text-teal-600 font-bold hover:underline">
             {isRegister ? 'Sign In' : 'Register Now'}
           </button>
        </div>
         <div className="mt-4 text-center">
            <button onClick={onBack} className="text-slate-400 text-sm hover:text-slate-600">Back to Home</button>
        </div>
        
        <div className="mt-8 pt-6 border-t border-slate-100 text-xs text-center text-slate-400">
          <p>Demo Hints:</p>
          <p>Use <span className="font-mono bg-slate-100 p-1">admin@sfcg.edu.ph</span> for Admin view</p>
          <p>Use any other email for Student view</p>
        </div>
      </div>
    </div>
  );
}

export default App;