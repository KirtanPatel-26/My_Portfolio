import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import { 
  Building2, 
  Stethoscope, 
  Users, 
  Calendar, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  SlidersHorizontal,
  Info,
  CheckCircle,
  AlertTriangle,
  ToggleLeft,
  BarChart3,
  Settings,
  User,
  TrendingUp,
  DollarSign,
  Activity,
  FileSpreadsheet,
  Printer,
  Download
} from 'lucide-react';

const AdminDashboard = ({ activeTab }) => {
  const {
    users,
    statuses,
    departments,
    doctors,
    doctorDepartments,
    patients,
    appointments,
    settings,
    addDepartment,
    updateDepartment,
    deleteDepartment,
    addDoctor,
    updateDoctor,
    deleteDoctor,
    addPatient,
    updatePatient,
    deletePatient,
    addAppointment,
    updateAppointment,
    deleteAppointment,
    addStatus,
    updateStatus,
    deleteStatus,
    updateSettings,
    updateAdminProfile,
    currentUser
  } = useContext(AppContext);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal Control States
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'dept', 'doc', 'pat', 'app', 'status'
  const [modalMode, setModalMode] = useState('add'); // 'add', 'edit'
  const [editId, setEditId] = useState(null);

  // Form Field States
  // Department Form
  const [deptName, setDeptName] = useState('');
  const [deptDesc, setDeptDesc] = useState('');
  const [deptActive, setDeptActive] = useState(1);

  // Doctor Form
  const [docName, setDocName] = useState('');
  const [docPhone, setDocPhone] = useState('');
  const [docEmail, setDocEmail] = useState('');
  const [docQual, setDocQual] = useState('');
  const [docSpec, setDocSpec] = useState('');
  const [docActive, setDocActive] = useState(1);
  const [docDeptId, setDocDeptId] = useState('');
  const [docUser, setDocUser] = useState('');
  const [docPass, setDocPass] = useState('');

  // Patient Form
  const [patName, setPatName] = useState('');
  const [patPhone, setPatPhone] = useState('');
  const [patEmail, setPatEmail] = useState('');
  const [patDOB, setPatDOB] = useState('');
  const [patGender, setPatGender] = useState('Male');
  const [patAddress, setPatAddress] = useState('');
  const [patCity, setPatCity] = useState('');
  const [patState, setPatState] = useState(1); // Link to Status
  const [patActive, setPatActive] = useState(1);
  const [patUser, setPatUser] = useState('');
  const [patPass, setPatPass] = useState('');

  // Appointment Form
  const [appDocId, setAppDocId] = useState('');
  const [appPatId, setAppPatId] = useState('');
  const [appDate, setAppDate] = useState('');
  const [appStatus, setAppStatus] = useState(3); // Pending default
  const [appDesc, setAppDesc] = useState('');
  const [appRemarks, setAppRemarks] = useState('None');
  const [appAmount, setAppAmount] = useState('');

  // Status Form
  const [statusName, setStatusName] = useState('');
  const [statusCss, setStatusCss] = useState('status-active');

  // Admin Profile Form
  const [adminUser, setAdminUser] = useState(currentUser?.UserName || '');
  const [adminPass, setAdminPass] = useState(currentUser?.Password || '');
  const [adminEmail, setAdminEmail] = useState(currentUser?.Email || '');
  const [adminPhone, setAdminPhone] = useState(currentUser?.MobileNo || '');
  const [profileMsg, setProfileMsg] = useState('');

  // System Settings Form
  const [setHospName, setSetHospName] = useState(settings?.hospitalName || 'HopeCare HMS');
  const [setCurrency, setSetCurrency] = useState(settings?.currency || '$');
  const [setHours, setSetHours] = useState(settings?.workingHours || '09:00 AM - 08:00 PM');
  const [setMaxApp, setSetMaxApp] = useState(settings?.maxDailyAppointments || 20);
  const [settingsMsg, setSettingsMsg] = useState('');

  // Sync profile & settings fields if store updates
  useEffect(() => {
    if (currentUser) {
      setAdminUser(currentUser.UserName);
      setAdminPass(currentUser.Password);
      setAdminEmail(currentUser.Email);
      setAdminPhone(currentUser.MobileNo);
    }
  }, [currentUser]);

  useEffect(() => {
    if (settings) {
      setSetHospName(settings.hospitalName);
      setSetCurrency(settings.currency);
      setSetHours(settings.workingHours);
      setSetMaxApp(settings.maxDailyAppointments);
    }
  }, [settings]);

  // Helper functions
  const getDoctorDeptName = (docId) => {
    const mapping = doctorDepartments.find((dd) => dd.DoctorID === docId);
    if (mapping) {
      const dept = departments.find((d) => d.DepartmentID === mapping.DepartmentID);
      return dept ? dept.DepartmentName : 'Not Assigned';
    }
    return 'Not Assigned';
  };

  const getDoctorDeptID = (docId) => {
    const mapping = doctorDepartments.find((dd) => dd.DoctorID === docId);
    return mapping ? mapping.DepartmentID : '';
  };

  const getStatusLabel = (statusId) => {
    const st = statuses.find((s) => s.StatusID === statusId);
    return st ? st.StatusName : 'Unknown';
  };

  const getStatusClass = (statusId) => {
    const st = statuses.find((s) => s.StatusID === statusId);
    return st ? st.StatusCssClass : 'status-inactive';
  };

  const openAddModal = (type) => {
    setModalType(type);
    setModalMode('add');
    setEditId(null);
    setSearchTerm('');

    // Reset Form Fields
    if (type === 'dept') {
      setDeptName('');
      setDeptDesc('');
      setDeptActive(1);
    } else if (type === 'doc') {
      setDocName('');
      setDocPhone('');
      setDocEmail('');
      setDocQual('');
      setDocSpec('');
      setDocActive(1);
      setDocDeptId('');
      setDocUser('');
      setDocPass('');
    } else if (type === 'pat') {
      setPatName('');
      setPatPhone('');
      setPatEmail('');
      setPatDOB('');
      setPatGender('Male');
      setPatAddress('');
      setPatCity('');
      setPatState(1);
      setPatActive(1);
      setPatUser('');
      setPatPass('');
    } else if (type === 'app') {
      setAppDocId('');
      setAppPatId('');
      setAppDate('');
      setAppStatus(3);
      setAppDesc('');
      setAppRemarks('None');
      setAppAmount('');
    } else if (type === 'status') {
      setStatusName('');
      setStatusCss('status-active');
    }
    setShowModal(true);
  };

  const openEditModal = (type, item) => {
    setModalType(type);
    setModalMode('edit');
    setSearchTerm('');

    if (type === 'dept') {
      setEditId(item.DepartmentID);
      setDeptName(item.DepartmentName);
      setDeptDesc(item.Description);
      setDeptActive(item.IsActive);
    } else if (type === 'doc') {
      setEditId(item.DoctorID);
      setDocName(item.Name);
      setDocPhone(item.Phone);
      setDocEmail(item.Email);
      setDocQual(item.Qualification);
      setDocSpec(item.Specialization);
      setDocActive(item.IsActive);
      setDocDeptId(getDoctorDeptID(item.DoctorID));
      
      const associatedUser = users.find((u) => u.UserID === item.UserID);
      setDocUser(associatedUser ? associatedUser.UserName : '');
      setDocPass(associatedUser ? associatedUser.Password : '');
    } else if (type === 'pat') {
      setEditId(item.PatientID);
      setPatName(item.Name);
      setPatPhone(item.Phone);
      setPatEmail(item.Email);
      setPatDOB(item.DateOfBirth ? item.DateOfBirth.substring(0, 10) : '');
      setPatGender(item.Gender);
      setPatAddress(item.Address);
      setPatCity(item.City);
      setPatState(item.State);
      setPatActive(item.IsActive);
      
      const associatedUser = users.find((u) => u.UserID === item.UserID);
      setPatUser(associatedUser ? associatedUser.UserName : '');
      setPatPass(associatedUser ? associatedUser.Password : '');
    } else if (type === 'app') {
      setEditId(item.AppointmentID);
      setAppDocId(item.DoctorID);
      setAppPatId(item.PatientID);
      setAppDate(item.AppointmentDate);
      setAppStatus(item.AppointmentStatus);
      setAppDesc(item.Description);
      setAppRemarks(item.SpecialRemarks);
      setAppAmount(item.TotalConsultedAmount !== null ? item.TotalConsultedAmount.toString() : '');
    } else if (type === 'status') {
      setEditId(item.StatusID);
      setStatusName(item.StatusName);
      setStatusCss(item.StatusCssClass);
    }
    setShowModal(true);
  };

  const handleModalSubmit = (e) => {
    e.preventDefault();
    if (modalType === 'dept') {
      const payload = { DepartmentName: deptName, Description: deptDesc, IsActive: parseInt(deptActive) };
      if (modalMode === 'add') addDepartment(payload);
      else updateDepartment(editId, payload);
    } else if (modalType === 'doc') {
      const payload = {
        Name: docName,
        Phone: docPhone,
        Email: docEmail,
        Qualification: docQual,
        Specialization: docSpec,
        IsActive: parseInt(docActive),
        DepartmentID: docDeptId,
        UserName: docUser,
        Password: docPass,
      };
      if (modalMode === 'add') addDoctor(payload);
      else updateDoctor(editId, payload);
    } else if (modalType === 'pat') {
      const payload = {
        Name: patName,
        Phone: patPhone,
        Email: patEmail,
        DateOfBirth: patDOB,
        Gender: patGender,
        Address: patAddress,
        City: patCity,
        State: parseInt(patState),
        IsActive: parseInt(patActive),
        UserName: patUser,
        Password: patPass,
      };
      if (modalMode === 'add') addPatient(payload);
      else updatePatient(editId, payload);
    } else if (modalType === 'app') {
      const payload = {
        DoctorID: appDocId,
        PatientID: appPatId,
        AppointmentDate: appDate,
        AppointmentStatus: parseInt(appStatus),
        Description: appDesc,
        SpecialRemarks: appRemarks,
        TotalConsultedAmount: appAmount === '' ? null : appAmount,
      };
      if (modalMode === 'add') addAppointment(payload);
      else updateAppointment(editId, payload);
    } else if (modalType === 'status') {
      const payload = {
        StatusName: statusName,
        StatusCssClass: statusCss
      };
      if (modalMode === 'add') addStatus(payload);
      else updateStatus(editId, payload);
    }
    setShowModal(false);
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    setProfileMsg('');
    updateAdminProfile({
      UserName: adminUser,
      Password: adminPass,
      Email: adminEmail,
      MobileNo: adminPhone
    });
    setProfileMsg('Admin profile credentials updated successfully!');
    setTimeout(() => setProfileMsg(''), 3000);
  };

  const handleSettingsSubmit = (e) => {
    e.preventDefault();
    setSettingsMsg('');
    updateSettings({
      hospitalName: setHospName,
      currency: setCurrency,
      workingHours: setHours,
      maxDailyAppointments: parseInt(setMaxApp)
    });
    setSettingsMsg('Global system configurations updated successfully!');
    setTimeout(() => setSettingsMsg(''), 3000);
  };

  // Filter lists based on search
  const filteredDepartments = departments.filter((d) =>
    d.DepartmentName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredDoctors = doctors.filter((doc) =>
    doc.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.Specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPatients = patients.filter((pat) =>
    pat.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pat.City.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredStatuses = statuses.filter((st) => 
    st.StatusName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAppointments = appointments.filter((app) => {
    const doc = doctors.find((d) => d.DoctorID === app.DoctorID);
    const pat = patients.find((p) => p.PatientID === app.PatientID);
    const nameMatch =
      (doc && doc.Name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (pat && pat.Name.toLowerCase().includes(searchTerm.toLowerCase()));

    const statusMatch = statusFilter === 'all' ? true : app.AppointmentStatus === parseInt(statusFilter);
    return nameMatch && statusMatch;
  });

  // Calculate dynamic data for the graphs
  // 1. Dynamic booking trends for line graph (last 7 days counts)
  const getLineGraphData = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const count = appointments.filter(app => app.AppointmentDate.startsWith(dateStr)).length;
      data.push({
        label: days[d.getDay()],
        count: count
      });
    }
    return data;
  };
  const lineGraphData = getLineGraphData();
  const maxLineVal = Math.max(...lineGraphData.map(d => d.count), 2);

  // 2. Doctor Consultation Earnings Bar Chart Data
  const getDoctorEarningsData = () => {
    return doctors.map(doc => {
      const earnings = appointments
        .filter(app => app.DoctorID === doc.DoctorID && app.AppointmentStatus === 5 && app.TotalConsultedAmount !== null)
        .reduce((sum, app) => sum + parseFloat(app.TotalConsultedAmount), 0);
      return {
        name: doc.Name.split(' ').slice(1).join(' ') || doc.Name, // Last Name
        amount: earnings
      };
    }).slice(0, 5); // Limit to top 5
  };
  const docEarningsData = getDoctorEarningsData();
  const maxEarningsVal = Math.max(...docEarningsData.map(d => d.amount), 50);

  // 3. Appointment Status Circle Donut Data
  const getStatusDonutData = () => {
    const pending = appointments.filter(a => a.AppointmentStatus === 3).length;
    const confirmed = appointments.filter(a => a.AppointmentStatus === 4).length;
    const consulted = appointments.filter(a => a.AppointmentStatus === 5).length;
    const cancelled = appointments.filter(a => a.AppointmentStatus === 6).length;
    const total = appointments.length || 1;

    return [
      { name: 'Pending', count: pending, color: '#f59e0b', pct: (pending / total) * 100 },
      { name: 'Confirmed', count: confirmed, color: '#0284c7', pct: (confirmed / total) * 100 },
      { name: 'Consulted', count: consulted, color: '#10b981', pct: (consulted / total) * 100 },
      { name: 'Cancelled', count: cancelled, color: '#ef4444', pct: (cancelled / total) * 100 },
    ];
  };
  const statusDonutData = getStatusDonutData();

  // 4. Department Workload Horizontal Bar Chart
  const getDeptWorkloadData = () => {
    return departments.map(dept => {
      const count = appointments.filter(app => {
        const mapping = doctorDepartments.find(dd => dd.DoctorID === app.DoctorID);
        return mapping?.DepartmentID === dept.DepartmentID;
      }).length;
      return {
        name: dept.DepartmentName,
        count: count
      };
    });
  };
  const deptWorkloadData = getDeptWorkloadData();
  const maxDeptVal = Math.max(...deptWorkloadData.map(d => d.count), 2);

  return (
    <div>
      {/* 1. HOME PANEL */}
      {activeTab === 'dashboard' && (
        <div>
          <div className="dashboard-title-bar">
            <h2>Welcome Admin, Dashboard Overview</h2>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-info">
                <h4>Total Doctors</h4>
                <p>{doctors.length}</p>
              </div>
              <div className="stat-icon-wrapper blue">
                <Stethoscope size={24} />
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-info">
                <h4>Registered Patients</h4>
                <p>{patients.length}</p>
              </div>
              <div className="stat-icon-wrapper teal">
                <Users size={24} />
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-info">
                <h4>Departments</h4>
                <p>{departments.length}</p>
              </div>
              <div className="stat-icon-wrapper orange">
                <Building2 size={24} />
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-info">
                <h4>Appointments</h4>
                <p>{appointments.length}</p>
              </div>
              <div className="stat-icon-wrapper green">
                <Calendar size={24} />
              </div>
            </div>
          </div>

          {/* Quick Graphs Overview */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            {/* Graph 1: Live Bookings Trend */}
            <div className="panel" style={{ marginBottom: 0 }}>
              <div className="panel-header" style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <TrendingUp size={18} color="var(--primary)" />
                  <h3 style={{ fontSize: '1.05rem' }}>Booking Activity (Last 7 Days)</h3>
                </div>
              </div>
              <div style={{ height: '220px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <svg viewBox="0 0 500 180" style={{ width: '100%', height: '150px' }}>
                  {/* Grid Lines */}
                  <line x1="40" y1="20" x2="480" y2="20" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="40" y1="80" x2="480" y2="80" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="40" y1="140" x2="480" y2="140" stroke="#e2e8f0" strokeWidth="1" />
                  
                  {/* Path Generation */}
                  {(() => {
                    const points = lineGraphData.map((d, index) => {
                      const x = 40 + index * 70;
                      const y = 140 - (d.count / maxLineVal) * 110;
                      return `${x},${y}`;
                    }).join(' ');

                    return (
                      <>
                        <polyline
                          fill="none"
                          stroke="var(--primary)"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          points={points}
                        />
                        {/* Shading area */}
                        <polygon
                          fill="rgba(2, 132, 199, 0.08)"
                          points={`40,140 ${points} 460,140`}
                        />
                      </>
                    );
                  })()}

                  {/* Draw circles & labels */}
                  {lineGraphData.map((d, index) => {
                    const x = 40 + index * 70;
                    const y = 140 - (d.count / maxLineVal) * 110;
                    return (
                      <g key={index}>
                        <circle
                          cx={x}
                          cy={y}
                          r="5.5"
                          fill="var(--bg-secondary)"
                          stroke="var(--primary)"
                          strokeWidth="2.5"
                        />
                        <text cx={x} x={x} y={y - 12} textAnchor="middle" fontSize="10.5" fontWeight="600" fill="var(--text-secondary)">
                          {d.count}
                        </text>
                        <text cx={x} x={x} y="160" textAnchor="middle" fontSize="10" fontWeight="500" fill="var(--text-light)">
                          {d.label}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>

            {/* Graph 2: Donut Status Distribution */}
            <div className="panel" style={{ marginBottom: 0 }}>
              <div className="panel-header" style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Activity size={18} color="var(--accent)" />
                  <h3 style={{ fontSize: '1.05rem' }}>Appointment Status Breakdown</h3>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', height: '220px' }}>
                <svg width="150" height="150" viewBox="0 0 36 36" style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f1f5f9" strokeWidth="3" />
                  
                  {(() => {
                    let accumulatedPercent = 0;
                    return statusDonutData.map((d, i) => {
                      if (d.pct === 0) return null;
                      const strokeDasharray = `${d.pct} ${100 - d.pct}`;
                      const strokeDashoffset = 100 - accumulatedPercent;
                      accumulatedPercent += d.pct;
                      return (
                        <circle
                          key={i}
                          cx="18"
                          cy="18"
                          r="15.915"
                          fill="none"
                          stroke={d.color}
                          strokeWidth="3.2"
                          strokeDasharray={strokeDasharray}
                          strokeDashoffset={strokeDashoffset}
                        />
                      );
                    });
                  })()}
                </svg>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: '150px' }}>
                  {statusDonutData.map((d, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                      <span style={{ width: 12, height: 12, borderRadius: '3px', backgroundColor: d.color, display: 'inline-block' }}></span>
                      <span style={{ fontWeight: 500, color: 'var(--text-secondary)' }}>{d.name}:</span>
                      <span style={{ fontWeight: 700 }}>{d.count} ({Math.round(d.pct)}%)</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
            <div className="panel">
              <div className="panel-header">
                <h3>System Breakdown</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ fontWeight: 600 }}>Active Users:</span>
                  <span>{users.filter(u => u.IsActive === 1).length} / {users.length}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ fontWeight: 600 }}>Pending Consultations:</span>
                  <span className="badge status-pending" style={{ padding: '0.2rem 0.6rem' }}>
                    {appointments.filter(a => a.AppointmentStatus === 3).length} Appointments
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ fontWeight: 600 }}>Completed Consultations:</span>
                  <span className="badge status-consulted" style={{ padding: '0.2rem 0.6rem' }}>
                    {appointments.filter(a => a.AppointmentStatus === 5).length} Appointments
                  </span>
                </div>
              </div>
            </div>

            <div className="panel">
              <div className="panel-header">
                <h3>Quick Action Board</h3>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <button onClick={() => openAddModal('doc')} className="btn btn-primary" style={{ height: '70px', fontSize: '0.9rem' }}>
                  <Plus size={16} /> Add Doctor
                </button>
                <button onClick={() => openAddModal('pat')} className="btn btn-secondary" style={{ height: '70px', fontSize: '0.9rem' }}>
                  <Plus size={16} /> Add Patient
                </button>
                <button onClick={() => openAddModal('dept')} className="btn btn-secondary" style={{ height: '70px', fontSize: '0.9rem' }}>
                  <Plus size={16} /> Add Department
                </button>
                <button onClick={() => openAddModal('app')} className="btn btn-primary" style={{ height: '70px', fontSize: '0.9rem' }}>
                  <Calendar size={16} /> Schedule Appointment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. DEPARTMENTS PANEL */}
      {activeTab === 'departments' && (
        <div className="panel">
          <div className="panel-header">
            <h3>Manage Departments</h3>
            <button onClick={() => openAddModal('dept')} className="btn btn-primary btn-sm">
              <Plus size={16} /> Create Department
            </button>
          </div>

          <div className="filter-bar">
            <div className="search-input-wrapper">
              <Search className="search-icon-inside" size={18} />
              <input
                type="text"
                placeholder="Search department by name..."
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Department Name</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Created Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDepartments.length > 0 ? (
                  filteredDepartments.map((dept) => (
                    <tr key={dept.DepartmentID}>
                      <td>{dept.DepartmentID}</td>
                      <td style={{ fontWeight: 600 }}>{dept.DepartmentName}</td>
                      <td>{dept.Description || 'No description'}</td>
                      <td>
                        <span className={`badge ${dept.IsActive ? 'status-active' : 'status-inactive'}`}>
                          {dept.IsActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>{new Date(dept.Created).toLocaleDateString()}</td>
                      <td className="actions-cell">
                        <button onClick={() => openEditModal('dept', dept)} className="btn btn-secondary btn-sm" title="Edit">
                          <Edit size={14} />
                        </button>
                        <button onClick={() => deleteDepartment(dept.DepartmentID)} className="btn btn-danger btn-sm" title="Delete">
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-light)' }}>
                      No departments found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. DOCTORS PANEL */}
      {activeTab === 'doctors' && (
        <div className="panel">
          <div className="panel-header">
            <h3>Manage Doctors</h3>
            <button onClick={() => openAddModal('doc')} className="btn btn-primary btn-sm">
              <Plus size={16} /> Add Doctor
            </button>
          </div>

          <div className="filter-bar">
            <div className="search-input-wrapper">
              <Search className="search-icon-inside" size={18} />
              <input
                type="text"
                placeholder="Search by name, specialization..."
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Doctor Details</th>
                  <th>Department</th>
                  <th>Qualification</th>
                  <th>Specialization</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDoctors.length > 0 ? (
                  filteredDoctors.map((doc) => (
                    <tr key={doc.DoctorID}>
                      <td>{doc.DoctorID}</td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontWeight: 600 }}>{doc.Name}</span>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>Phone: {doc.Phone}</span>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>Email: {doc.Email}</span>
                        </div>
                      </td>
                      <td style={{ fontWeight: 500, color: 'var(--primary)' }}>
                        {getDoctorDeptName(doc.DoctorID)}
                      </td>
                      <td>{doc.Qualification}</td>
                      <td>{doc.Specialization}</td>
                      <td>
                        <span className={`badge ${doc.IsActive ? 'status-active' : 'status-inactive'}`}>
                          {doc.IsActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="actions-cell">
                        <button onClick={() => openEditModal('doc', doc)} className="btn btn-secondary btn-sm" title="Edit">
                          <Edit size={14} />
                        </button>
                        <button onClick={() => deleteDoctor(doc.DoctorID)} className="btn btn-danger btn-sm" title="Delete">
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-light)' }}>
                      No Doctors registered yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. PATIENTS PANEL */}
      {activeTab === 'patients' && (
        <div className="panel">
          <div className="panel-header">
            <h3>Manage Patients</h3>
            <button onClick={() => openAddModal('pat')} className="btn btn-primary btn-sm">
              <Plus size={16} /> Register Patient
            </button>
          </div>

          <div className="filter-bar">
            <div className="search-input-wrapper">
              <Search className="search-icon-inside" size={18} />
              <input
                type="text"
                placeholder="Search patient by name, city..."
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Patient Details</th>
                  <th>DOB / Gender</th>
                  <th>Location Address</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.length > 0 ? (
                  filteredPatients.map((pat) => (
                    <tr key={pat.PatientID}>
                      <td>{pat.PatientID}</td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontWeight: 600 }}>{pat.Name}</span>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>Email: {pat.Email}</span>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>Phone: {pat.Phone}</span>
                        </div>
                      </td>
                      <td>
                        <div>{pat.DateOfBirth}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>{pat.Gender}</div>
                      </td>
                      <td>
                        <div>{pat.Address}</div>
                        <div style={{ fontWeight: 500, fontSize: '0.85rem' }}>{pat.City}</div>
                      </td>
                      <td>
                        <span className={`badge ${getStatusClass(pat.State)}`}>
                          {getStatusLabel(pat.State)}
                        </span>
                      </td>
                      <td className="actions-cell">
                        <button onClick={() => openEditModal('pat', pat)} className="btn btn-secondary btn-sm" title="Edit">
                          <Edit size={14} />
                        </button>
                        <button onClick={() => deletePatient(pat.PatientID)} className="btn btn-danger btn-sm" title="Delete">
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-light)' }}>
                      No Patients registered yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. APPOINTMENTS PANEL */}
      {activeTab === 'appointments' && (
        <div className="panel">
          <div className="panel-header">
            <h3>Manage Appointments</h3>
            <button onClick={() => openAddModal('app')} className="btn btn-primary btn-sm">
              <Plus size={16} /> Create Appointment
            </button>
          </div>

          <div className="filter-bar">
            <div className="search-input-wrapper">
              <Search className="search-icon-inside" size={18} />
              <input
                type="text"
                placeholder="Search by doctor or patient name..."
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="filters-right">
              <SlidersHorizontal size={16} color="var(--text-light)" />
              <select
                className="select-filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                {statuses.map((st) => (
                  <option key={st.StatusID} value={st.StatusID}>
                    {st.StatusName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Patient</th>
                  <th>Doctor</th>
                  <th>Schedule Date & Time</th>
                  <th>Status</th>
                  <th>Fee Billing</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.length > 0 ? (
                  filteredAppointments.map((app) => {
                    const doc = doctors.find((d) => d.DoctorID === app.DoctorID);
                    const pat = patients.find((p) => p.PatientID === app.PatientID);
                    return (
                      <tr key={app.AppointmentID}>
                        <td>{app.AppointmentID}</td>
                        <td style={{ fontWeight: 600 }}>{pat ? pat.Name : 'Deleted Patient'}</td>
                        <td style={{ fontWeight: 500, color: 'var(--accent)' }}>{doc ? doc.Name : 'Deleted Doctor'}</td>
                        <td>{new Date(app.AppointmentDate).toLocaleString()}</td>
                        <td>
                          <span className={`badge ${getStatusClass(app.AppointmentStatus)}`}>
                            {getStatusLabel(app.AppointmentStatus)}
                          </span>
                        </td>
                        <td style={{ fontWeight: 600 }}>
                          {setCurrency}{app.TotalConsultedAmount !== null ? parseFloat(app.TotalConsultedAmount).toFixed(2) : '0.00'}
                        </td>
                        <td className="actions-cell">
                          <button onClick={() => openEditModal('app', app)} className="btn btn-secondary btn-sm" title="Edit">
                            <Edit size={14} />
                          </button>
                          <button onClick={() => deleteAppointment(app.AppointmentID)} className="btn btn-danger btn-sm" title="Delete">
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-light)' }}>
                      No appointments matching requirements.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 6. STATUSES PANEL (NEW CRUD) */}
      {activeTab === 'statuses' && (
        <div className="panel">
          <div className="panel-header">
            <h3>Manage Appointment & Account Statuses</h3>
            <button onClick={() => openAddModal('status')} className="btn btn-primary btn-sm">
              <Plus size={16} /> Add Status Entry
            </button>
          </div>

          <div className="filter-bar">
            <div className="search-input-wrapper">
              <Search className="search-icon-inside" size={18} />
              <input
                type="text"
                placeholder="Search statuses by name..."
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Status ID</th>
                  <th>Status Name</th>
                  <th>Visual CSS Class Reference</th>
                  <th>Visual Preview Badges</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStatuses.length > 0 ? (
                  filteredStatuses.map((st) => (
                    <tr key={st.StatusID}>
                      <td>{st.StatusID}</td>
                      <td style={{ fontWeight: 600 }}>{st.StatusName}</td>
                      <td><code>{st.StatusCssClass}</code></td>
                      <td>
                        <span className={`badge ${st.StatusCssClass}`}>
                          {st.StatusName} Preview
                        </span>
                      </td>
                      <td className="actions-cell">
                        <button onClick={() => openEditModal('status', st)} className="btn btn-secondary btn-sm" title="Edit">
                          <Edit size={14} />
                        </button>
                        <button 
                          onClick={() => deleteStatus(st.StatusID)} 
                          className="btn btn-danger btn-sm" 
                          title="Delete"
                          disabled={[1, 2, 3, 4, 5, 6].includes(st.StatusID)} // Preserve default keys
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-light)' }}>
                      No statuses found matching search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div style={{ marginTop: '1.25rem', padding: '0.75rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--warning-light)', color: 'var(--warning)', display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.82rem', border: '1px solid var(--warning)' }}>
            <Info size={16} />
            <span><strong>Notice:</strong> Status codes 1-6 are linked to key application flows (Pending, Confirmed, Consulted, Cancelled, Active, Inactive) and cannot be deleted.</span>
          </div>
        </div>
      )}

      {/* 7. REPORTS & ANALYTICS PANEL (NEW TABS - 4 DYNAMIC GRAPHS) */}
      {activeTab === 'reports' && (
        <div>
          <div className="dashboard-title-bar">
            <h2>Hospital Analytics & Reports</h2>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="btn btn-secondary btn-sm" onClick={() => alert('Simulated PDF generated successfully! Printing...')}><Printer size={15} /> Print Reports</button>
              <button className="btn btn-secondary btn-sm" onClick={() => alert('CSV file containing analytics data has been downloaded.')}><Download size={15} /> Export CSV</button>
            </div>
          </div>

          {/* Dynamic 4 Graphs Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
            
            {/* Graph 1: Live Bookings Line Graph */}
            <div className="panel" style={{ marginBottom: 0 }}>
              <div className="panel-header" style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <TrendingUp size={18} color="var(--primary)" />
                  <h3 style={{ fontSize: '1.05rem' }}>Booking Trends (Last 7 Days)</h3>
                </div>
              </div>
              <div style={{ height: '240px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <svg viewBox="0 0 500 180" style={{ width: '100%', height: '180px' }}>
                  {/* Grid Lines */}
                  <line x1="40" y1="20" x2="480" y2="20" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="40" y1="80" x2="480" y2="80" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="40" y1="140" x2="480" y2="140" stroke="#e2e8f0" strokeWidth="1" />
                  
                  {/* Path Generation */}
                  {(() => {
                    const points = lineGraphData.map((d, index) => {
                      const x = 40 + index * 70;
                      const y = 140 - (d.count / maxLineVal) * 110;
                      return `${x},${y}`;
                    }).join(' ');

                    return (
                      <>
                        <polyline
                          fill="none"
                          stroke="var(--primary)"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          points={points}
                        />
                        <polygon
                          fill="rgba(2, 132, 199, 0.08)"
                          points={`40,140 ${points} 460,140`}
                        />
                      </>
                    );
                  })()}

                  {/* Nodes */}
                  {lineGraphData.map((d, index) => {
                    const x = 40 + index * 70;
                    const y = 140 - (d.count / maxLineVal) * 110;
                    return (
                      <g key={index}>
                        <circle cx={x} cy={y} r="5.5" fill="#fff" stroke="var(--primary)" strokeWidth="2.5" />
                        <text x={x} y={y - 12} textAnchor="middle" fontSize="10" fontWeight="600" fill="var(--text-secondary)">{d.count}</text>
                        <text x={x} y="160" textAnchor="middle" fontSize="10" fontWeight="500" fill="var(--text-light)">{d.label}</text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>

            {/* Graph 2: Revenue Generated Vertical Bar Chart */}
            <div className="panel" style={{ marginBottom: 0 }}>
              <div className="panel-header" style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <DollarSign size={18} color="var(--success)" />
                  <h3 style={{ fontSize: '1.05rem' }}>Consultation Billings ($) by Doctor</h3>
                </div>
              </div>
              <div style={{ height: '240px' }}>
                <svg viewBox="0 0 500 180" style={{ width: '100%', height: '180px' }}>
                  {/* Grid Lines */}
                  <line x1="45" y1="20" x2="480" y2="20" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="45" y1="80" x2="480" y2="80" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="45" y1="140" x2="480" y2="140" stroke="#e2e8f0" strokeWidth="1" />

                  {/* Draw bars dynamically */}
                  {docEarningsData.map((d, index) => {
                    const barWidth = 40;
                    const spacing = 80;
                    const x = 60 + index * spacing;
                    const barHeight = (d.amount / maxEarningsVal) * 110;
                    const y = 140 - barHeight;
                    return (
                      <g key={index}>
                        {/* Bar Rect */}
                        <rect
                          x={x}
                          y={y}
                          width={barWidth}
                          height={barHeight}
                          rx="4"
                          fill="var(--success)"
                          opacity="0.85"
                        />
                        <text x={x + barWidth/2} y={y - 8} textAnchor="middle" fontSize="10.5" fontWeight="700" fill="var(--text-primary)">
                          {setCurrency}{d.amount}
                        </text>
                        <text x={x + barWidth/2} y="158" textAnchor="middle" fontSize="10" fontWeight="500" fill="var(--text-secondary)">
                          {d.name}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>

            {/* Graph 3: Donut Status Distribution */}
            <div className="panel" style={{ marginBottom: 0 }}>
              <div className="panel-header" style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Activity size={18} color="var(--warning)" />
                  <h3 style={{ fontSize: '1.05rem' }}>Appointment Status Breakdown</h3>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', height: '240px' }}>
                <svg width="160" height="160" viewBox="0 0 36 36" style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f1f5f9" strokeWidth="3.2" />
                  {(() => {
                    let accumulatedPercent = 0;
                    return statusDonutData.map((d, i) => {
                      if (d.pct === 0) return null;
                      const strokeDasharray = `${d.pct} ${100 - d.pct}`;
                      const strokeDashoffset = 100 - accumulatedPercent;
                      accumulatedPercent += d.pct;
                      return (
                        <circle
                          key={i}
                          cx="18"
                          cy="18"
                          r="15.915"
                          fill="none"
                          stroke={d.color}
                          strokeWidth="3.4"
                          strokeDasharray={strokeDasharray}
                          strokeDashoffset={strokeDashoffset}
                        />
                      );
                    });
                  })()}
                </svg>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: '150px' }}>
                  {statusDonutData.map((d, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                      <span style={{ width: 12, height: 12, borderRadius: '3px', backgroundColor: d.color, display: 'inline-block' }}></span>
                      <span style={{ fontWeight: 500, color: 'var(--text-secondary)' }}>{d.name}:</span>
                      <span style={{ fontWeight: 700 }}>{d.count} ({Math.round(d.pct)}%)</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Graph 4: Department Workload Horizontal Bar Chart */}
            <div className="panel" style={{ marginBottom: 0 }}>
              <div className="panel-header" style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Building2 size={18} color="var(--warning)" />
                  <h3 style={{ fontSize: '1.05rem' }}>Appointments Volume by Department</h3>
                </div>
              </div>
              <div style={{ height: '240px', padding: '1rem 0' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {deptWorkloadData.map((dept, idx) => {
                    const widthPct = maxDeptVal > 0 ? (dept.count / maxDeptVal) * 100 : 0;
                    return (
                      <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600 }}>
                          <span>{dept.name}</span>
                          <span>{dept.count} Bookings</span>
                        </div>
                        <div style={{ width: '100%', height: '10px', backgroundColor: 'var(--border)', borderRadius: '5px', overflow: 'hidden' }}>
                          <div style={{ width: `${Math.max(widthPct, 4)}%`, height: '100%', backgroundColor: 'var(--primary)', borderRadius: '5px', transition: 'width 0.5s' }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

          </div>

          {/* Quick Metrics Table */}
          <div className="panel">
            <div className="panel-header">
              <h3>System Operational Metrics Report</h3>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', textAlign: 'center', marginBottom: '1rem' }}>
              <div style={{ padding: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-primary)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', fontWeight: 600, textTransform: 'uppercase' }}>Gross Consultation Revenue</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--success)' }}>
                  {setCurrency}{appointments.reduce((sum, app) => sum + (app.TotalConsultedAmount ? parseFloat(app.TotalConsultedAmount) : 0), 0).toFixed(2)}
                </div>
              </div>
              <div style={{ padding: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-primary)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', fontWeight: 600, textTransform: 'uppercase' }}>Average Ticket Price</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>
                  {setCurrency}{(() => {
                    const billed = appointments.filter(a => a.TotalConsultedAmount !== null);
                    if (billed.length === 0) return '0.00';
                    const avg = billed.reduce((sum, app) => sum + parseFloat(app.TotalConsultedAmount), 0) / billed.length;
                    return avg.toFixed(2);
                  })()}
                </div>
              </div>
              <div style={{ padding: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-primary)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', fontWeight: 600, textTransform: 'uppercase' }}>Cancellation Rate</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--danger)' }}>
                  {(() => {
                    const total = appointments.length || 1;
                    const cancelled = appointments.filter(a => a.AppointmentStatus === 6).length;
                    return `${Math.round((cancelled / total) * 100)}%`;
                  })()}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 8. PROFILE PANEL (NEW TAB) */}
      {activeTab === 'profile' && (
        <div className="panel" style={{ maxWidth: '650px', margin: '0 auto' }}>
          <div className="panel-header">
            <h3>Admin Profile Credentials</h3>
          </div>

          {profileMsg && (
            <div className="error-message" style={{ backgroundColor: 'var(--success-light)', color: 'var(--success)', borderLeftColor: 'var(--success)' }}>
              {profileMsg}
            </div>
          )}

          <form onSubmit={handleProfileSubmit}>
            <div className="form-group row-2">
              <div>
                <label className="form-label">Admin Username</label>
                <input
                  type="text"
                  className="form-input"
                  value={adminUser}
                  onChange={(e) => setAdminUser(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="form-label">Password Key</label>
                <input
                  type="text"
                  className="form-input"
                  value={adminPass}
                  onChange={(e) => setAdminPass(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Mobile Contact Number</label>
              <input
                type="text"
                className="form-input"
                value={adminPhone}
                onChange={(e) => setAdminPhone(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                required
              />
            </div>

            <div style={{ marginTop: '1.5rem' }}>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                Update Credentials
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 9. SETTINGS PANEL (NEW TAB) */}
      {activeTab === 'settings' && (
        <div className="panel" style={{ maxWidth: '650px', margin: '0 auto' }}>
          <div className="panel-header">
            <h3>Global Hospital portal configuration Settings</h3>
          </div>

          {settingsMsg && (
            <div className="error-message" style={{ backgroundColor: 'var(--success-light)', color: 'var(--success)', borderLeftColor: 'var(--success)' }}>
              {settingsMsg}
            </div>
          )}

          <form onSubmit={handleSettingsSubmit}>
            <div className="form-group">
              <label className="form-label">Hospital Name</label>
              <input
                type="text"
                className="form-input"
                value={setHospName}
                onChange={(e) => setSetHospName(e.target.value)}
                required
              />
            </div>

            <div className="form-group row-2">
              <div>
                <label className="form-label">Default Currency Symbol</label>
                <select
                  className="form-input"
                  value={setCurrency}
                  onChange={(e) => setSetCurrency(e.target.value)}
                  required
                >
                  <option value="$">US Dollar ($)</option>
                  <option value="₹">Indian Rupee (₹)</option>
                  <option value="£">British Pound (£)</option>
                  <option value="€">Euro (€)</option>
                  <option value="¥">Yen / Yuan (¥)</option>
                </select>
              </div>

              <div>
                <label className="form-label">Daily Appointment Limit per Doctor</label>
                <input
                  type="number"
                  className="form-input"
                  value={setMaxApp}
                  onChange={(e) => setSetMaxApp(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Hospital Daily Working Hours</label>
              <input
                type="text"
                className="form-input"
                value={setHours}
                placeholder="e.g. 09:00 AM - 08:00 PM"
                onChange={(e) => setSetHours(e.target.value)}
                required
              />
            </div>

            <div style={{ marginTop: '1.5rem' }}>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                Save Configurations
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL POPUP */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h3 className="modal-title">
                {modalMode === 'add' ? 'Add New' : 'Edit'}{' '}
                {modalType === 'dept' && 'Department'}
                {modalType === 'doc' && 'Doctor Record'}
                {modalType === 'pat' && 'Patient Profile'}
                {modalType === 'app' && 'Appointment Details'}
                {modalType === 'status' && 'Status Entry'}
              </h3>
              <button className="modal-close-btn" onClick={() => setShowModal(false)}>x</button>
            </div>
            
            <form onSubmit={handleModalSubmit}>
              <div className="modal-body">
                {/* 1. Department Form Fields */}
                {modalType === 'dept' && (
                  <>
                    <div className="form-group">
                      <label className="form-label">Department Name</label>
                      <input
                        type="text"
                        className="form-input"
                        value={deptName}
                        onChange={(e) => setDeptName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Description</label>
                      <textarea
                        rows="3"
                        className="form-input"
                        value={deptDesc}
                        onChange={(e) => setDeptDesc(e.target.value)}
                        style={{ resize: 'vertical' }}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Active Status</label>
                      <select className="form-input" value={deptActive} onChange={(e) => setDeptActive(parseInt(e.target.value))}>
                        <option value={1}>Active</option>
                        <option value={0}>Inactive</option>
                      </select>
                    </div>
                  </>
                )}

                {/* 2. Doctor Form Fields */}
                {modalType === 'doc' && (
                  <>
                    <div className="form-group row-2">
                      <div>
                        <label className="form-label">Doctor Name</label>
                        <input
                          type="text"
                          className="form-input"
                          value={docName}
                          onChange={(e) => setDocName(e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <label className="form-label">Hospital Department</label>
                        <select className="form-input" value={docDeptId} onChange={(e) => setDocDeptId(e.target.value)} required>
                          <option value="">-- Choose Department --</option>
                          {departments.filter(d => d.IsActive === 1 || d.DepartmentID === parseInt(docDeptId)).map((d) => (
                            <option key={d.DepartmentID} value={d.DepartmentID}>
                              {d.DepartmentName}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="form-group row-2">
                      <div>
                        <label className="form-label">Qualification</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="e.g. MBBS, MD"
                          value={docQual}
                          onChange={(e) => setDocQual(e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <label className="form-label">Specialization</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="e.g. Cardiologist"
                          value={docSpec}
                          onChange={(e) => setDocSpec(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group row-2">
                      <div>
                        <label className="form-label">Phone Contact</label>
                        <input
                          type="text"
                          className="form-input"
                          value={docPhone}
                          onChange={(e) => setDocPhone(e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <label className="form-label">Email Address</label>
                        <input
                          type="email"
                          className="form-input"
                          value={docEmail}
                          onChange={(e) => setDocEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', marginBottom: '1rem', border: '1px solid var(--border)' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Login Account Details</span>
                      <div className="form-group row-2" style={{ marginTop: '0.5rem', marginBottom: 0 }}>
                        <div>
                          <label className="form-label">Username</label>
                          <input
                            type="text"
                            className="form-input"
                            value={docUser}
                            onChange={(e) => setDocUser(e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <label className="form-label">Password</label>
                          <input
                            type="text"
                            className="form-input"
                            value={docPass}
                            onChange={(e) => setDocPass(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Active Status</label>
                      <select className="form-input" value={docActive} onChange={(e) => setDocActive(parseInt(e.target.value))}>
                        <option value={1}>Active</option>
                        <option value={0}>Inactive</option>
                      </select>
                    </div>
                  </>
                )}

                {/* 3. Patient Form Fields */}
                {modalType === 'pat' && (
                  <>
                    <div className="form-group row-2">
                      <div>
                        <label className="form-label">Patient Name</label>
                        <input
                          type="text"
                          className="form-input"
                          value={patName}
                          onChange={(e) => setPatName(e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <label className="form-label">Gender</label>
                        <select className="form-input" value={patGender} onChange={(e) => setPatGender(e.target.value)}>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-group row-2">
                      <div>
                        <label className="form-label">Date of Birth</label>
                        <input
                          type="date"
                          className="form-input"
                          value={patDOB}
                          onChange={(e) => setPatDOB(e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <label className="form-label">Phone Contact</label>
                        <input
                          type="text"
                          className="form-input"
                          value={patPhone}
                          onChange={(e) => setPatPhone(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Email Address</label>
                      <input
                        type="email"
                        className="form-input"
                        value={patEmail}
                        onChange={(e) => setPatEmail(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group row-2">
                      <div>
                        <label className="form-label">Address</label>
                        <input
                          type="text"
                          className="form-input"
                          value={patAddress}
                          onChange={(e) => setPatAddress(e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <label className="form-label">City</label>
                        <input
                          type="text"
                          className="form-input"
                          value={patCity}
                          onChange={(e) => setPatCity(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', marginBottom: '1rem', border: '1px solid var(--border)' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Login Account Details</span>
                      <div className="form-group row-2" style={{ marginTop: '0.5rem', marginBottom: 0 }}>
                        <div>
                          <label className="form-label">Username</label>
                          <input
                            type="text"
                            className="form-input"
                            value={patUser}
                            onChange={(e) => setPatUser(e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <label className="form-label">Password</label>
                          <input
                            type="text"
                            className="form-input"
                            value={patPass}
                            onChange={(e) => setPatPass(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="form-group row-2">
                      <div>
                        <label className="form-label">State / Account Status</label>
                        <select className="form-input" value={patState} onChange={(e) => setPatState(parseInt(e.target.value))}>
                          {statuses.map((st) => (
                            <option key={st.StatusID} value={st.StatusID}>
                              {st.StatusName}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="form-label">Is Active Account</label>
                        <select className="form-input" value={patActive} onChange={(e) => setPatActive(parseInt(e.target.value))}>
                          <option value={1}>Active</option>
                          <option value={0}>Inactive</option>
                        </select>
                      </div>
                    </div>
                  </>
                )}

                {/* 4. Appointment Form Fields */}
                {modalType === 'app' && (
                  <>
                    <div className="form-group row-2">
                      <div>
                        <label className="form-label">Select Patient</label>
                        <select className="form-input" value={appPatId} onChange={(e) => setAppPatId(e.target.value)} required>
                          <option value="">-- Choose Patient --</option>
                          {patients.map((pat) => (
                            <option key={pat.PatientID} value={pat.PatientID}>
                              {pat.Name} (ID: {pat.PatientID})
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="form-label">Select Doctor</label>
                        <select className="form-input" value={appDocId} onChange={(e) => setAppDocId(e.target.value)} required>
                          <option value="">-- Choose Doctor --</option>
                          {doctors.filter(d => d.IsActive === 1 || d.DoctorID === parseInt(appDocId)).map((doc) => (
                            <option key={doc.DoctorID} value={doc.DoctorID}>
                              {doc.Name} ({getDoctorDeptName(doc.DoctorID)})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="form-group row-2">
                      <div>
                        <label className="form-label">Appointment Date & Time</label>
                        <input
                          type="datetime-local"
                          className="form-input"
                          value={appDate}
                          onChange={(e) => setAppDate(e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <label className="form-label">Appointment Status</label>
                        <select className="form-input" value={appStatus} onChange={(e) => setAppStatus(parseInt(e.target.value))}>
                          {statuses.map((st) => (
                            <option key={st.StatusID} value={st.StatusID}>
                              {st.StatusName}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Appointment Description</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Brief reason for appointment"
                        value={appDesc}
                        onChange={(e) => setAppDesc(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group row-2">
                      <div>
                        <label className="form-label">Special Remarks</label>
                        <input
                          type="text"
                          className="form-input"
                          value={appRemarks}
                          onChange={(e) => setAppRemarks(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="form-label">Total Fee Amount ($)</label>
                        <input
                          type="number"
                          step="0.01"
                          className="form-input"
                          placeholder="e.g. 50.00"
                          value={appAmount}
                          onChange={(e) => setAppAmount(e.target.value)}
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* 5. Status Form Fields */}
                {modalType === 'status' && (
                  <>
                    <div className="form-group">
                      <label className="form-label">Status Name</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. Completed"
                        value={statusName}
                        onChange={(e) => setStatusName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">CSS Theme Color Class</label>
                      <select
                        className="form-input"
                        value={statusCss}
                        onChange={(e) => setStatusCss(e.target.value)}
                        required
                      >
                        <option value="status-active">Active (Emerald Green)</option>
                        <option value="status-inactive">Inactive (Light Grey)</option>
                        <option value="status-pending">Pending (Orange/Yellow)</option>
                        <option value="status-confirmed">Confirmed (Sky Blue)</option>
                        <option value="status-consulted">Consulted (Teal/Green)</option>
                        <option value="status-cancelled">Cancelled (Crimson Red)</option>
                      </select>
                    </div>
                  </>
                )}
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
