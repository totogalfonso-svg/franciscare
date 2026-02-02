import React from 'react';
import { User, UserRole } from '../types';
import { LogOut, LayoutDashboard, Home, User as UserIcon } from 'lucide-react';
import { APP_NAME } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  currentUser: User | null;
  onLogout: () => void;
  onNavigate: (page: string) => void;
  currentPage: string;
}

const Layout: React.FC<LayoutProps> = ({ children, currentUser, onLogout, onNavigate, currentPage }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center cursor-pointer" onClick={() => onNavigate('landing')}>
              <div className="flex-shrink-0 flex items-center gap-2">
                <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center text-white font-bold">F</div>
                <span className="text-xl font-bold text-slate-800 tracking-tight">{APP_NAME}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {currentUser ? (
                <div className="flex items-center gap-4">
                  <span className="text-sm text-slate-600 hidden md:block">
                    Welcome, <span className="font-semibold text-slate-800">{currentUser.name}</span>
                  </span>
                  
                  <button
                    onClick={() => onNavigate('dashboard')}
                    className={`p-2 rounded-full hover:bg-slate-100 transition-colors ${currentPage === 'dashboard' ? 'bg-teal-50 text-teal-600' : 'text-slate-500'}`}
                    title="Dashboard"
                  >
                    <LayoutDashboard size={20} />
                  </button>
                  
                  <button
                    onClick={onLogout}
                    className="flex items-center gap-2 text-sm font-medium text-red-600 hover:bg-red-50 px-3 py-2 rounded-md transition-colors"
                  >
                    <LogOut size={16} />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                   <button
                    onClick={() => onNavigate('landing')}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${currentPage === 'landing' ? 'text-teal-600 bg-teal-50' : 'text-slate-600 hover:text-teal-600'}`}
                  >
                    Home
                  </button>
                  <button
                    onClick={() => onNavigate('login')}
                    className="bg-teal-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-teal-700 transition-shadow shadow-sm"
                  >
                    Login / Register
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="mb-2">&copy; {new Date().getFullYear()} St. Francis College Guihulngan. All rights reserved.</p>
          <p className="text-sm text-slate-500">FrancisCare Wellness Management System</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;