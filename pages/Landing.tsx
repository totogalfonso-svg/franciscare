import React from 'react';
import { SERVICES_INFO, COLLEGE_NAME } from '../constants';
import { ChevronRight, ShieldCheck, Clock, Users } from 'lucide-react';

interface LandingProps {
  onGetStarted: () => void;
}

const Landing: React.FC<LandingProps> = ({ onGetStarted }) => {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-teal-600 to-blue-700 text-white py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://picsum.photos/1920/1080')] opacity-10 bg-cover bg-center"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="lg:w-2/3">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Your Health, Our Priority at <br/>
              <span className="text-teal-200">{COLLEGE_NAME}</span>
            </h1>
            <p className="text-xl md:text-2xl text-teal-50 mb-8 font-light max-w-2xl">
              Accessible, confidential, and comprehensive wellness services for every student, faculty, and staff member.
            </p>
            <button 
              onClick={onGetStarted}
              className="bg-white text-teal-700 font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl hover:bg-teal-50 transition-all transform hover:-translate-y-1 flex items-center gap-2"
            >
              Access Wellness Services <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* Stats/Features */}
      <section className="bg-white py-12 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors">
            <div className="p-3 bg-teal-100 text-teal-700 rounded-full">
              <ShieldCheck size={28} />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Secure & Confidential</h3>
              <p className="text-sm text-slate-500">Your health data is protected.</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors">
             <div className="p-3 bg-blue-100 text-blue-700 rounded-full">
              <Users size={28} />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Expert Care</h3>
              <p className="text-sm text-slate-500">Certified medical professionals.</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors">
             <div className="p-3 bg-purple-100 text-purple-700 rounded-full">
              <Clock size={28} />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Easy Scheduling</h3>
              <p className="text-sm text-slate-500">Book appointments online instantly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Our Wellness Services</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              FrancisCare offers a holistic approach to campus health, covering physical, dental, and mental well-being.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {SERVICES_INFO.map((service) => {
              const Icon = service.icon;
              return (
                <div key={service.id} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-slate-100 flex flex-col items-center text-center">
                  <div className={`p-4 rounded-full ${service.bg} ${service.color} mb-6`}>
                    <Icon size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-3">{service.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{service.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;