import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import { 
  Calendar, 
  User, 
  Search, 
  SlidersHorizontal, 
  Eye, 
  Edit2, 
  Activity, 
  DollarSign, 
  Building2, 
  Settings, 
  BarChart3, 
  Clock, 
  Printer, 
  Download, 
  Info,
  CheckCircle2
} from 'lucide-react';

const DoctorDashboard = ({ activeTab }) => {
  const {
    currentUser,
    doctors,
    doctorDepartments,
    departments,
    patients,
    appointments,
    statuses,
    updateAppointment,
    updateDoctor,
    settings: globalSettings
  } = useContext(AppContext);

  // Find the doctor record associated with current logged-in user
  const currentDoc = doctors.find((d) => d.UserID === currentUser?.UserID);

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Consultation Modal State
  const [showModal, setShowModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);

  // Consultation Input States
  const [appStatus, setAppStatus] = useState(5); // Default to Consulted
  const [remarks, setRemarks] = useState('');
  const [amount, setAmount] = useState('');

  // Interactive Hover Graph State
  const [hoveredBarIndex, setHoveredBarIndex] = useState(null);

  // Doctor Profile Editing State
  const [profName, setProfName] = useState(currentDoc ? currentDoc.Name : '');
  const [profPhone, setProfPhone] = useState(currentDoc ? currentDoc.Phone : '');
  const [profEmail, setProfEmail] = useState(currentDoc ? currentDoc.Email : '');
  const [profQual, setProfQual] = useState(currentDoc ? currentDoc.Qualification : '');
  const [profSpec, setProfSpec] = useState(currentDoc ? currentDoc.Specialization : '');
  const [profileSuccess, setProfileSuccess] = useState('');

  // Doctor Settings State
  const [consultFee, setConsultFee] = useState('75');
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifySMS, setNotifySMS] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState('');

  // Sync profile details if store updates
  useEffect(() => {
    if (currentDoc) {
      setProfName(currentDoc.Name);
      setProfPhone(currentDoc.Phone);
      setProfEmail(currentDoc.Email);
      setProfQual(currentDoc.Qualification);
      setProfSpec(currentDoc.Specialization);
    }
  }, [currentDoc]);

  // Helpers
  const getStatusLabel = (statusId) => {
    const st = statuses.find((s) => s.StatusID === statusId);
    return st ? st.StatusName : 'Unknown';
  };

  const getStatusClass = (statusId) => {
    const st = statuses.find((s) => s.StatusID === statusId);
    return st ? st.StatusCssClass : 'status-inactive';
  };

  const getDoctorDeptName = (docId) => {
    const mapping = doctorDepartments.find((dd) => dd.DoctorID === docId);
    if (mapping) {
      const dept = departments.find((d) => d.DepartmentID === mapping.DepartmentID);
      return dept ? dept.DepartmentName : 'Not Assigned';
    }
    return 'Not Assigned';
  };

  const handleConsultOpen = (app) => {
    setSelectedApp(app);
    setAppStatus(app.AppointmentStatus);
    setRemarks(app.SpecialRemarks || '');
    setAmount(app.TotalConsultedAmount !== null ? app.TotalConsultedAmount.toString() : '');
    setShowModal(true);
  };

  const handleConsultSubmit = (e) => {
    e.preventDefault();
    if (!selectedApp) return;

    updateAppointment(selectedApp.AppointmentID, {
      AppointmentStatus: parseInt(appStatus),
      SpecialRemarks: remarks,
      TotalConsultedAmount: amount === '' ? null : amount
    });

    setShowModal(false);
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    setProfileSuccess('');
    if (!currentDoc) return;

    updateDoctor(currentDoc.DoctorID, {
      Name: profName,
      Phone: profPhone,
      Email: profEmail,
      Qualification: profQual,
      Specialization: profSpec
    });

    setProfileSuccess('Professional medical profile updated successfully!');
    setTimeout(() => setProfileSuccess(''), 3000);
  };

  const handleSettingsSubmit = (e) => {
    e.preventDefault();
    setSettingsSuccess('Preferences and fee schedules saved successfully!');
    setTimeout(() => setSettingsSuccess(''), 3000);
  };

  // Filter doctor's appointments
  const docAppointments = appointments.filter((app) => app.DoctorID === currentDoc?.DoctorID);

  const filteredAppointments = docAppointments.filter((app) => {
    const pat = patients.find((p) => p.PatientID === app.PatientID);
    const patName = pat ? pat.Name.toLowerCase() : '';
    const nameMatch = patName.includes(searchTerm.toLowerCase());
    const statusMatch = statusFilter === 'all' ? true : app.AppointmentStatus === parseInt(statusFilter);
    return nameMatch && statusMatch;
  });

  // Calculate day-of-week data for the SVG bar chart
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayShortLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  const appointmentsPerDay = daysOfWeek.map((dayName, index) => {
    const count = docAppointments.filter(app => {
      const date = new Date(app.AppointmentDate);
      return date.getDay() === index;
    }).length;
    return { day: dayName, count: count, short: dayShortLabels[index] };
  });

  const maxAppCount = Math.max(...appointmentsPerDay.map(d => d.count), 2);

  // Stats calculation
  const totalVisits = docAppointments.length;
  const pendingVisits = docAppointments.filter((a) => a.AppointmentStatus === 3).length;
  const activeVisits = docAppointments.filter((a) => a.AppointmentStatus === 4).length;
  const completedVisits = docAppointments.filter((a) => a.AppointmentStatus === 5).length;
  const totalEarnings = docAppointments
    .filter((a) => a.AppointmentStatus === 5 && a.TotalConsultedAmount !== null)
    .reduce((sum, a) => sum + parseFloat(a.TotalConsultedAmount), 0);

  // Filter patients listed for reports / lists (only patients who booked this doctor)
  const myPatients = patients.filter((pat) => 
    docAppointments.some((app) => app.PatientID === pat.PatientID) && 
    pat.Name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredDepartments = departments.filter((d) => 
    d.IsActive === 1 && d.DepartmentName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!currentDoc) {
    return (
      <div className="panel" style={{ textAlign: 'center', padding: '3rem' }}>
        <h3>Doctor Profile Not Found</h3>
        <p style={{ color: 'var(--text-light)', marginTop: '1rem' }}>
          Your user account does not appear to be linked to a Doctor profile. Please contact the administrator.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="dashboard-title-bar">
        <div>
          <h2>Welcome, {currentDoc.Name}</h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            Specialization: {currentDoc.Specialization} | Department: {getDoctorDeptName(currentDoc.DoctorID)}
          </p>
        </div>
      </div>

      {/* Stats Board */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-info">
            <h4>Total Schedule</h4>
            <p>{totalVisits}</p>
          </div>
          <div className="stat-icon-wrapper blue">
            <Calendar size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <h4>Pending Reviews</h4>
            <p>{pendingVisits}</p>
          </div>
          <div className="stat-icon-wrapper orange">
            <Calendar size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <h4>Confirmed Visits</h4>
            <p>{activeVisits}</p>
          </div>
          <div className="stat-icon-wrapper teal">
            <Calendar size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <h4>Fee Earnings</h4>
            <p>{globalSettings?.currency || '$'}{totalEarnings.toFixed(2)}</p>
          </div>
          <div className="stat-icon-wrapper green">
            <DollarSign size={24} />
          </div>
        </div>
      </div>

      {/* 1. DOCTOR DASHBOARD PANEL */}
      {activeTab === 'dashboard' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          {/* Interactive SVG Bar Graph per day */}
          <div className="panel" style={{ marginBottom: 0, position: 'relative' }}>
            <div className="panel-header" style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Activity size={18} color="var(--primary)" />
                <h3 style={{ fontSize: '1.05rem' }}>Weekly Schedule Bookings (Hover to inspect)</h3>
              </div>
            </div>
            
            <div style={{ height: '240px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <svg viewBox="0 0 500 180" style={{ width: '100%', height: '170px', overflow: 'visible' }}>
                {/* Horizontal Grid lines */}
                <line x1="40" y1="20" x2="480" y2="20" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="40" y1="80" x2="480" y2="80" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="40" y1="140" x2="480" y2="140" stroke="#e2e8f0" strokeWidth="1.5" />

                {/* Bars */}
                {appointmentsPerDay.map((d, index) => {
                  const barWidth = 32;
                  const spacing = 62;
                  const x = 50 + index * spacing;
                  const barHeight = (d.count / maxAppCount) * 110;
                  const y = 140 - barHeight;
                  const isHovered = hoveredBarIndex === index;

                  return (
                    <g key={index}>
                      {/* Interactive rect wrapper for easier hovering */}
                      <rect
                        x={x - 10}
                        y={20}
                        width={barWidth + 20}
                        height={130}
                        fill="transparent"
                        style={{ cursor: 'pointer' }}
                        onMouseEnter={() => setHoveredBarIndex(index)}
                        onMouseLeave={() => setHoveredBarIndex(null)}
                      />

                      {/* Bar columns */}
                      <rect
                        x={x}
                        y={y}
                        width={barWidth}
                        height={barHeight}
                        rx="4"
                        fill={isHovered ? 'var(--accent)' : 'var(--primary)'}
                        style={{ transition: 'fill 0.2s, height 0.3s', cursor: 'pointer' }}
                        onMouseEnter={() => setHoveredBarIndex(index)}
                        onMouseLeave={() => setHoveredBarIndex(null)}
                      />

                      {/* Y-value counts */}
                      <text
                        x={x + barWidth / 2}
                        y={y - 8}
                        textAnchor="middle"
                        fontSize="10"
                        fontWeight="700"
                        fill="var(--text-primary)"
                        opacity={isHovered ? 1 : 0.4}
                      >
                        {d.count}
                      </text>

                      {/* Days label */}
                      <text
                        x={x + barWidth / 2}
                        y="156"
                        textAnchor="middle"
                        fontSize="10.5"
                        fontWeight="600"
                        fill={isHovered ? 'var(--accent)' : 'var(--text-secondary)'}
                      >
                        {d.short}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Tooltip Overlay triggered on hover */}
              {hoveredBarIndex !== null && (
                <div style={{
                  position: 'absolute',
                  top: '60px',
                  backgroundColor: 'var(--bg-sidebar)',
                  color: 'var(--text-white)',
                  padding: '0.5rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  boxShadow: 'var(--shadow-lg)',
                  pointerEvents: 'none',
                  zIndex: 200,
                  border: '1px solid #1e293b',
                  animation: 'modalFadeIn 0.15s ease-out'
                }}>
                  {appointmentsPerDay[hoveredBarIndex].day}: {appointmentsPerDay[hoveredBarIndex].count} Booked Visit{appointmentsPerDay[hoveredBarIndex].count !== 1 ? 's' : ''}
                </div>
              )}
            </div>
          </div>

          {/* Quick Stats Panel */}
          <div className="panel" style={{ marginBottom: 0 }}>
            <div className="panel-header" style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={18} color="var(--success)" />
                <h3 style={{ fontSize: '1.05rem' }}>Operational Checkup</h3>
              </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '240px', justifyContent: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border)', fontSize: '0.9rem' }}>
                <strong>Completed Consultation Reviews:</strong>
                <span className="badge status-consulted">{completedVisits} Consultations</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border)', fontSize: '0.9rem' }}>
                <strong>Active Hospital Patients Managed:</strong>
                <span>{myPatients.length} Patients</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border)', fontSize: '0.9rem' }}>
                <strong>Total Revenue Share:</strong>
                <span style={{ color: 'var(--success)', fontWeight: 700 }}>{globalSettings?.currency || '$'}{totalEarnings.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. DOCTOR PROFILE PANEL (NEW) */}
      {activeTab === 'profile' && (
        <div className="panel" style={{ maxWidth: '650px', margin: '0 auto' }}>
          <div className="panel-header">
            <h3>My Professional Profile Settings</h3>
          </div>

          {profileSuccess && (
            <div className="error-message" style={{ backgroundColor: 'var(--success-light)', color: 'var(--success)', borderLeftColor: 'var(--success)' }}>
              {profileSuccess}
            </div>
          )}

          <form onSubmit={handleProfileSubmit}>
            <div className="form-group row-2">
              <div>
                <label className="form-label">Full Professional Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={profName}
                  onChange={(e) => setProfName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="form-label">Contact Phone</label>
                <input
                  type="text"
                  className="form-input"
                  value={profPhone}
                  onChange={(e) => setProfPhone(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group row-2">
              <div>
                <label className="form-label">Qualification Credentials</label>
                <input
                  type="text"
                  className="form-input"
                  value={profQual}
                  onChange={(e) => setProfQual(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="form-label">Specialist Specialization</label>
                <input
                  type="text"
                  className="form-input"
                  value={profSpec}
                  onChange={(e) => setProfSpec(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Hospital Email Address</label>
              <input
                type="email"
                className="form-input"
                value={profEmail}
                onChange={(e) => setProfEmail(e.target.value)}
                required
              />
            </div>

            <div style={{ marginTop: '1.5rem' }}>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                Save Profile Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 3. APPOINTMENTS PANEL (Original Consult Page) */}
      {(activeTab === 'appointments' || activeTab === 'calendar') && (
        <div className="panel">
          <div className="panel-header">
            <h3>{activeTab === 'appointments' ? 'Patient Consultation Book' : 'My Calendar Agenda Schedule'}</h3>
          </div>

          <div className="filter-bar">
            <div className="search-input-wrapper">
              <Search className="search-icon-inside" size={18} />
              <input
                type="text"
                placeholder="Search consultations by patient name..."
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
                <option value="all">All Appointments</option>
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
                  <th>Patient Name</th>
                  <th>Schedule Date & Time</th>
                  <th>Description</th>
                  <th>Remarks / Prescription</th>
                  <th>Status</th>
                  <th>Bill Fee</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.length > 0 ? (
                  filteredAppointments.map((app) => {
                    const pat = patients.find((p) => p.PatientID === app.PatientID);
                    return (
                      <tr key={app.AppointmentID}>
                        <td>{app.AppointmentID}</td>
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontWeight: 600 }}>{pat ? pat.Name : 'N/A'}</span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>
                              Gender: {pat ? pat.Gender : ''} | DOB: {pat ? pat.DateOfBirth : ''}
                            </span>
                          </div>
                        </td>
                        <td style={{ fontWeight: 600 }}>{new Date(app.AppointmentDate).toLocaleString()}</td>
                        <td>{app.Description}</td>
                        <td>{app.SpecialRemarks || 'None'}</td>
                        <td>
                          <span className={`badge ${getStatusClass(app.AppointmentStatus)}`}>
                            {getStatusLabel(app.AppointmentStatus)}
                          </span>
                        </td>
                        <td style={{ fontWeight: 600 }}>
                          {globalSettings?.currency || '$'}{app.TotalConsultedAmount !== null ? parseFloat(app.TotalConsultedAmount).toFixed(2) : '0.00'}
                        </td>
                        <td>
                          <button
                            onClick={() => handleConsultOpen(app)}
                            className="btn btn-secondary btn-sm"
                            title="Review / Edit Consultation"
                          >
                            <Edit2 size={12} />
                            <span>Consult</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-light)' }}>
                      No appointments matching requirements.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. PATIENTS PANEL (NEW) */}
      {activeTab === 'patients' && (
        <div className="panel">
          <div className="panel-header">
            <h3>Registered Patient Index</h3>
          </div>

          <div className="filter-bar">
            <div className="search-input-wrapper">
              <Search className="search-icon-inside" size={18} />
              <input
                type="text"
                placeholder="Search patient record by name..."
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
                  <th>Patient Name</th>
                  <th>DOB</th>
                  <th>Gender</th>
                  <th>Phone Number</th>
                  <th>Residential Address</th>
                  <th>Contact Email</th>
                  <th>Total Visits</th>
                </tr>
              </thead>
              <tbody>
                {myPatients.length > 0 ? (
                  myPatients.map((pat) => {
                    const patientVisits = docAppointments.filter(app => app.PatientID === pat.PatientID).length;
                    return (
                      <tr key={pat.PatientID}>
                        <td style={{ fontWeight: 600 }}>{pat.Name}</td>
                        <td>{pat.DateOfBirth}</td>
                        <td>{pat.Gender}</td>
                        <td>{pat.Phone}</td>
                        <td>{pat.Address}, {pat.City}</td>
                        <td>{pat.Email}</td>
                        <td style={{ fontWeight: 700 }}>{patientVisits} visits</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-light)' }}>
                      No patients registered on your active consultation list yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. DEPARTMENTS PANEL (NEW) */}
      {activeTab === 'departments' && (
        <div className="panel">
          <div className="panel-header">
            <h3>Hospital Care Departments</h3>
          </div>

          <div className="filter-bar">
            <div className="search-input-wrapper">
              <Search className="search-icon-inside" size={18} />
              <input
                type="text"
                placeholder="Search departments..."
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem', marginTop: '1rem' }}>
            {filteredDepartments.map((dept) => {
              const docCount = doctorDepartments.filter(dd => dd.DepartmentID === dept.DepartmentID).length;
              return (
                <div key={dept.DepartmentID} className="panel" style={{ marginBottom: 0, border: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <div style={{ padding: '0.5rem', borderRadius: '8px', background: 'var(--primary-light)', color: 'var(--primary)' }}>
                      <Building2 size={20} />
                    </div>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{dept.DepartmentName}</h4>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                    {dept.Description || 'Specialist healthcare department committed to patients.'}
                  </p>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-light)', borderTop: '1px solid var(--border)', paddingTop: '0.75rem' }}>
                    <span><strong>{docCount}</strong> Doctors Assigned</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 6. REPORTS PANEL (NEW) */}
      {activeTab === 'reports' && (
        <div>
          <div className="dashboard-title-bar">
            <h2>Doctor Practice Reports</h2>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="btn btn-secondary btn-sm" onClick={() => alert('Simulated Practice Invoice Statement printed.')}><Printer size={15} /> Print Invoice</button>
              <button className="btn btn-secondary btn-sm" onClick={() => alert('Practice billing breakdown downloaded.')}><Download size={15} /> Export Statement</button>
            </div>
          </div>

          <div className="panel">
            <div className="panel-header">
              <h3>Practice Revenue Statement log</h3>
            </div>
            
            <div className="table-responsive">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Patient Name</th>
                    <th>Reason</th>
                    <th>Fee Status</th>
                    <th>Consultation Fees Collected</th>
                  </tr>
                </thead>
                <tbody>
                  {docAppointments.filter(app => app.AppointmentStatus === 5).length > 0 ? (
                    docAppointments.filter(app => app.AppointmentStatus === 5).map((app) => {
                      const pat = patients.find(p => p.PatientID === app.PatientID);
                      return (
                        <tr key={app.AppointmentID}>
                          <td>{new Date(app.AppointmentDate).toLocaleDateString()}</td>
                          <td style={{ fontWeight: 600 }}>{pat ? pat.Name : 'Deleted Patient'}</td>
                          <td>{app.Description}</td>
                          <td><span className="badge status-consulted">Settled</span></td>
                          <td style={{ fontWeight: 600, color: 'var(--success)' }}>
                            {globalSettings?.currency || '$'}{app.TotalConsultedAmount ? parseFloat(app.TotalConsultedAmount).toFixed(2) : '0.00'}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-light)' }}>
                        No completed billed consultations found on record.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 7. SETTINGS PANEL (NEW) */}
      {activeTab === 'settings' && (
        <div className="panel" style={{ maxWidth: '650px', margin: '0 auto' }}>
          <div className="panel-header">
            <h3>Doctor Practice Preferences</h3>
          </div>

          {settingsSuccess && (
            <div className="error-message" style={{ backgroundColor: 'var(--success-light)', color: 'var(--success)', borderLeftColor: 'var(--success)' }}>
              {settingsSuccess}
            </div>
          )}

          <form onSubmit={handleSettingsSubmit}>
            <div className="form-group">
              <label className="form-label">My Consultation Checkup Fee ({globalSettings?.currency || '$'})</label>
              <input
                type="number"
                className="form-input"
                value={consultFee}
                onChange={(e) => setConsultFee(e.target.value)}
                required
              />
            </div>

            <div style={{ padding: '1rem', background: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', border: '1px solid var(--border)' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>E-Notification Preferences</h4>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={notifyEmail}
                    onChange={(e) => setNotifyEmail(e.target.checked)}
                  />
                  <span>Send me email alerts when patients request new visits.</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={notifySMS}
                    onChange={(e) => setNotifySMS(e.target.checked)}
                  />
                  <span>Send daily agenda SMS briefs.</span>
                </label>
              </div>
            </div>

            <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--success-light)', color: 'var(--success)', display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.82rem', border: '1px solid var(--success)', marginBottom: '1.5rem' }}>
              <Info size={16} />
              <span><strong>Practice State:</strong> Active Doctor login account associated with hospital.</span>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              Save Settings
            </button>
          </form>
        </div>
      )}

      {/* CONSULTATION REVIEW MODAL */}
      {showModal && selectedApp && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h3 className="modal-title">Consultation & Appointment Review</h3>
              <button className="modal-close-btn" onClick={() => setShowModal(false)}>x</button>
            </div>

            <form onSubmit={handleConsultSubmit}>
              <div className="modal-body">
                {/* Patient Summary Card */}
                {(() => {
                  const pat = patients.find((p) => p.PatientID === selectedApp.PatientID);
                  return (
                    <div style={{
                      padding: '1rem',
                      backgroundColor: 'var(--bg-primary)',
                      borderRadius: 'var(--radius-md)',
                      marginBottom: '1.5rem',
                      border: '1px solid var(--border)'
                    }}>
                      <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Patient Demographics
                      </h4>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem 1rem', fontSize: '0.85rem' }}>
                        <div><strong>Name:</strong> {pat ? pat.Name : 'N/A'}</div>
                        <div><strong>DOB:</strong> {pat ? pat.DateOfBirth : 'N/A'}</div>
                        <div><strong>Gender:</strong> {pat ? pat.Gender : 'N/A'}</div>
                        <div><strong>Contact Phone:</strong> {pat ? pat.Phone : 'N/A'}</div>
                        <div style={{ gridColumn: 'span 2' }}><strong>Residential Address:</strong> {pat ? `${pat.Address}, ${pat.City}` : 'N/A'}</div>
                      </div>
                    </div>
                  );
                })()}

                <div className="form-group row-2">
                  <div>
                    <label className="form-label">Review Status</label>
                    <select
                      className="form-input"
                      value={appStatus}
                      onChange={(e) => setAppStatus(parseInt(e.target.value))}
                      required
                    >
                      {statuses.filter(st => [3, 4, 5, 6].includes(st.StatusID)).map((st) => (
                        <option key={st.StatusID} value={st.StatusID}>
                          {st.StatusName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Billing Fee Amount ({globalSettings?.currency || '$'})</label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-input"
                      placeholder="e.g. 75.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Appointment description (Patient query)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={selectedApp.Description}
                    disabled
                    style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-secondary)' }}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Doctor Special Remarks / Prescriptions</label>
                  <textarea
                    rows="4"
                    className="form-input"
                    placeholder="Provide recommendations, diagnosis, dosage prescriptions..."
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    required
                    style={{ resize: 'vertical' }}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Consultation</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;
