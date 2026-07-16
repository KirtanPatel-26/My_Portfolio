import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { 
  LayoutDashboard, 
  Building2, 
  Stethoscope, 
  Users, 
  Calendar, 
  User, 
  LogOut, 
  Heart,
  X,
  ToggleLeft,
  BarChart3,
  Settings
} from 'lucide-react';

const Sidebar = ({ isOpen, setIsOpen, activeTab, setActiveTab, role, logout }) => {
  const { settings } = useContext(AppContext);

  const adminMenuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'departments', name: 'Departments', icon: Building2 },
    { id: 'doctors', name: 'Doctors', icon: Stethoscope },
    { id: 'patients', name: 'Patients', icon: Users },
    { id: 'appointments', name: 'Appointments', icon: Calendar },
    { id: 'statuses', name: 'Statuses', icon: ToggleLeft },
    { id: 'reports', name: 'Reports', icon: BarChart3 },
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'settings', name: 'Settings', icon: Settings },
  ];

  const doctorMenuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'profile', name: 'My Profile', icon: User },
    { id: 'appointments', name: 'Appointments', icon: Calendar },
    { id: 'patients', name: 'Patients', icon: Users },
    { id: 'departments', name: 'Departments', icon: Building2 },
    { id: 'calendar', name: 'Calendar Schedule', icon: Calendar },
    { id: 'reports', name: 'Reports', icon: BarChart3 },
    { id: 'settings', name: 'Settings', icon: Settings },
  ];

  const patientMenuItems = [
    { id: 'dashboard', name: 'My Appointments', icon: Calendar },
    { id: 'book-appointment', name: 'Book Appointment', icon: Heart },
    { id: 'doctors', name: 'Doctors', icon: Stethoscope },
    { id: 'departments', name: 'Departments', icon: Building2 },
    { id: 'reports', name: 'My Reports', icon: BarChart3 },
    { id: 'profile', name: 'My Profile', icon: User },
    { id: 'settings', name: 'Settings', icon: Settings },
  ];

  const getMenuItems = () => {
    switch (role) {
      case 'Admin':
        return adminMenuItems;
      case 'Doctor':
        return doctorMenuItems;
      case 'Patient':
        return patientMenuItems;
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-logo-container">
        <Heart className="sidebar-logo-icon" fill="var(--primary)" />
        <span className="sidebar-logo-text">{settings?.hospitalName || 'HopeCare HMS'}</span>
        <button 
          className="menu-toggle" 
          style={{ display: isOpen ? 'block' : 'none', color: 'var(--text-white)' }}
          onClick={() => setIsOpen(false)}
        >
          <X size={20} />
        </button>
      </div>

      <nav className="sidebar-menu">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              className={`sidebar-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => {
                setActiveTab(item.id);
                setIsOpen(false); // Close sidebar on mobile after selection
              }}
            >
              <Icon size={20} />
              <span>{item.name}</span>
            </button>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <button className="sidebar-item" onClick={logout} style={{ color: '#ef4444' }}>
          <LogOut size={20} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
