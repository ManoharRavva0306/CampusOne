import React from 'react';
import { useApp } from '../../context/AppContext';
import { USERS } from '../../data/mockData';
import { X, CheckCircle, Shield, User, GraduationCap, Wrench, Building2 } from 'lucide-react';

export default function RoleSwitcherModal({ onClose }) {
  const { currentUser, switchUser } = useApp();

  const getRoleIcon = (role) => {
    switch (role) {
      case 'student': return <User className="w-3.5 h-3.5 text-blue-600" />;
      case 'faculty_advisor': return <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />;
      case 'domain_admin': return <Wrench className="w-3.5 h-3.5 text-amber-600" />;
      case 'central_admin': return <Shield className="w-3.5 h-3.5 text-forest-900" />;
      default: return <User className="w-3.5 h-3.5 text-charcoal-500" />;
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'student': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'faculty_advisor': return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'domain_admin': return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'central_admin': return 'bg-forest-900 text-mint-300 border-forest-800';
      default: return 'bg-ivory-200 text-charcoal-700 border-ivory-300';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white border border-ivory-300 rounded-3xl max-w-xl w-full p-6 shadow-2xl overflow-hidden animate-scale-in">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-ivory-200">
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-base font-bold text-forest-950">Switch Demo Persona</h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-mono font-bold border border-emerald-200">
                Judge View
              </span>
            </div>
            <p className="text-xs text-charcoal-500 mt-0.5">
              Experience scope privacy rules, supervisory desks, and two-way verification from each stakeholder's perspective.
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-lg text-charcoal-400 hover:text-forest-950 hover:bg-ivory-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* User list */}
        <div className="mt-4 space-y-2 max-h-[60vh] overflow-y-auto pr-1">
          {USERS.map((user) => {
            const isSelected = currentUser.id === user.id;
            return (
              <div
                key={user.id}
                onClick={() => {
                  switchUser(user);
                  onClose();
                }}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                  isSelected
                    ? 'bg-emerald-50/60 border-emerald-400 ring-1 ring-emerald-400/40 shadow-sm'
                    : 'bg-ivory-100/70 border-ivory-200 hover:bg-white hover:border-ivory-300'
                }`}
              >
                <div className="flex items-center space-x-3.5">
                  <div className="relative">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-subtle"
                    />
                    <div className="absolute -bottom-1 -right-1 p-0.5 bg-white rounded-full shadow-sm">
                      {getRoleIcon(user.role)}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="text-xs font-bold text-forest-950">{user.name}</h4>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getRoleBadge(user.role)}`}>
                        {user.role.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs text-charcoal-700 mt-0.5">{user.description}</p>
                    <div className="text-[11px] text-charcoal-500 font-mono mt-0.5 flex items-center space-x-2">
                      {user.rollNo && <span>ID: {user.rollNo}</span>}
                      {user.classSection && <span>• {user.classSection}</span>}
                      {user.room && <span>• Room {user.room}</span>}
                    </div>
                  </div>
                </div>

                <div>
                  {isSelected ? (
                    <div className="flex items-center space-x-1 text-xs text-emerald-800 font-bold px-2.5 py-1 bg-white rounded-lg border border-emerald-300 shadow-sm">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Active</span>
                    </div>
                  ) : (
                    <button className="text-xs text-charcoal-500 hover:text-forest-950 px-2.5 py-1 rounded-lg bg-white border border-ivory-300 hover:border-charcoal-400">
                      Select
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer tip */}
        <div className="mt-4 pt-3 border-t border-ivory-200 text-[11px] text-charcoal-500 flex items-center justify-between">
          <span>💡 Notice how ticket visibility automatically filters depending on the selected persona.</span>
          <button 
            onClick={onClose}
            className="text-xs text-emerald-700 font-bold hover:underline"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
