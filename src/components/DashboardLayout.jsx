import React, { useState, useContext } from 'react';
import Sidebar from './Sidebar';
import { Menu, LogOut, Heart } from 'lucide-react';
import { AppContext } from '../context/AppContext';

const DashboardLayout = ({ children, activeTab, setActiveTab, currentUser, logout }) => {
  const { settings } = useContext(AppContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!currentUser) return children;

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="app-container">
      <Sidebar
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        role={currentUser.Role}
        logout={logout}
      />
      
      <div className="main-content">
        <header className="header">
          <div className="header-left">
            <button className="menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <Menu size={24} />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Heart size={20} color="var(--primary)" fill="var(--primary)" />
              <span style={{ fontWeight: 700, fontSize: '1.1rem', letterSpacing: '-0.5px' }}>
                {settings?.hospitalName || 'HopeCare HMS'} Portal
              </span>
            </div>
          </div>
          
          <div className="header-right">
            <div className="user-profile-badge">
              <div className="user-avatar">
                {getInitials(currentUser.UserName)}
              </div>
              <div className="user-info">
                <span className="user-name">{currentUser.UserName}</span>
                <span className="user-role">{currentUser.Role}</span>
              </div>
            </div>
            <button className="logout-btn" onClick={logout} title="Sign Out">
              <LogOut size={18} />
              <span style={{ display: 'inline-block' }}>Logout</span>
            </button>
          </div>
        </header>
        
        <main className="page-body">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
