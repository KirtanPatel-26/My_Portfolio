import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import { 
  Calendar, 
  Heart, 
  User, 
  Clock, 
  CheckCircle, 
  Info,
  Search,
  Building2,
  Stethoscope,
  BarChart3,
  Settings,
  Printer,
  Download,
  Activity,
  DollarSign,
  SlidersHorizontal
} from 'lucide-react';

const PatientDashboard = ({ activeTab, setActiveTab }) => {
  const {
    currentUser,
    patients,
    doctors,
    doctorDepartments,
    departments,
    appointments,
    statuses,
    addAppointment,
    updatePatient,
    settings: globalSettings
  } = useContext(AppContext);

  // Find Patient Record linked to the logged-in user
  const currentPat = patients.find((p) => p.UserID === currentUser?.UserID);

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');

  // Booking Form State
  const [selectedDeptId, setSelectedDeptId] = useState('');
  const [selectedDocId, setSelectedDocId] = useState('');
  const [appDate, setAppDate] = useState('');
  const [appDesc, setAppDesc] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState('');
  const [bookingError, setBookingError] = useState('');

  // Profile Edit State
  const [profName, setProfName] = useState(currentPat ? currentPat.Name : '');
  const [profPhone, setProfPhone] = useState(currentPat ? currentPat.Phone : '');
  const [profEmail, setProfEmail] = useState(currentPat ? currentPat.Email : '');
  const [profDOB, setProfDOB] = useState(currentPat && currentPat.DateOfBirth ? currentPat.DateOfBirth.substring(0, 10) : '');
  const [profGender, setProfGender] = useState(currentPat ? currentPat.Gender : 'Male');
  const [profAddress, setProfAddress] = useState(currentPat ? currentPat.Address : '');
  const [profCity, setProfCity] = useState(currentPat ? currentPat.City : '');
  const [profileSuccess, setProfileSuccess] = useState('');

  // Patient Notification Settings State
  const [prefLang, setPrefLang] = useState('English');
  const [prefTheme, setPrefTheme] = useState('Light');
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifySMS, setNotifySMS] = useState(true);
  const [settingsMsg, setSettingsMsg] = useState('');

  // Sync profile details if store updates
  useEffect(() => {
    if (currentPat) {
      setProfName(currentPat.Name);
      setProfPhone(currentPat.Phone);
      setProfEmail(currentPat.Email);
      setProfDOB(currentPat.DateOfBirth ? currentPat.DateOfBirth.substring(0, 10) : '');
      setProfGender(currentPat.Gender);
      setProfAddress(currentPat.Address);
      setProfCity(currentPat.City);
    }
  }, [currentPat]);

  // Helpers
  const getDoctorName = (docId) => {
    const doc = doctors.find((d) => d.DoctorID === docId);
    return doc ? doc.Name : 'Unknown Doctor';
  };

  const getDoctorSpecialization = (docId) => {
    const doc = doctors.find((d) => d.DoctorID === docId);
    return doc ? doc.Specialization : 'N/A';
  };

  const getDoctorDeptName = (docId) => {
    const mapping = doctorDepartments.find((dd) => dd.DoctorID === docId);
    if (mapping) {
      const dept = departments.find((d) => d.DepartmentID === mapping.DepartmentID);
      return dept ? dept.DepartmentName : 'Not Assigned';
    }
    return 'Not Assigned';
  };

  const getStatusLabel = (statusId) => {
    const st = statuses.find((s) => s.StatusID === statusId);
    return st ? st.StatusName : 'Unknown';
  };

  const getStatusClass = (statusId) => {
    const st = statuses.find((s) => s.StatusID === statusId);
    return st ? st.StatusCssClass : 'status-inactive';
  };

  // Doctors belonging to the selected department
  const availableDoctors = doctors.filter((doc) => {
    if (!selectedDeptId) return false;
    const mapping = doctorDepartments.find(
      (dd) => dd.DoctorID === doc.DoctorID && dd.DepartmentID === parseInt(selectedDeptId)
    );
    return !!mapping && doc.IsActive === 1;
  });

  const handleBookSubmit = (e) => {
    e.preventDefault();
    setBookingError('');
    setBookingSuccess('');

    if (!selectedDocId || !appDate || !appDesc) {
      setBookingError('Please enter all booking details.');
      return;
    }

    if (!currentPat) {
      setBookingError('No patient profile found. Please fill in your profile details first.');
      return;
    }

    addAppointment({
      DoctorID: selectedDocId,
      PatientID: currentPat.PatientID,
      AppointmentDate: appDate,
      AppointmentStatus: 3, // Pending
      Description: appDesc,
      SpecialRemarks: 'None',
      TotalConsultedAmount: null,
    });

    setBookingSuccess('Appointment request submitted successfully! Pending hospital confirmation.');
    setSelectedDeptId('');
    setSelectedDocId('');
    setAppDate('');
    setAppDesc('');
    
    // Auto redirect after delay
    setTimeout(() => {
      setActiveTab('dashboard');
      setBookingSuccess('');
    }, 2500);
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    setProfileSuccess('');

    if (!currentPat) return;

    updatePatient(currentPat.PatientID, {
      Name: profName,
      Phone: profPhone,
      Email: profEmail,
      DateOfBirth: profDOB,
      Gender: profGender,
      Address: profAddress,
      City: profCity,
    });

    setProfileSuccess('Profile details updated successfully!');
    setTimeout(() => setProfileSuccess(''), 3000);
  };

  const handleSettingsSubmit = (e) => {
    e.preventDefault();
    setSettingsMsg('Notification and theme configurations saved successfully!');
    setTimeout(() => setSettingsMsg(''), 3000);
  };

  // Patient's appointments
  const patAppointments = currentPat
    ? appointments.filter((app) => app.PatientID === currentPat.PatientID)
    : [];

  // Filter listings based on search inputs
  const filteredDoctors = doctors.filter((doc) => {
    const docDeptMapping = doctorDepartments.find(dd => dd.DoctorID === doc.DoctorID);
    const deptMatch = deptFilter === 'all' ? true : docDeptMapping?.DepartmentID === parseInt(deptFilter);
    const searchMatch = doc.Name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        doc.Specialization.toLowerCase().includes(searchTerm.toLowerCase());
    return doc.IsActive === 1 && deptMatch && searchMatch;
  });

  const filteredDepartments = departments.filter((d) => 
    d.IsActive === 1 && d.DepartmentName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Billing Report Totals
  const totalBilled = patAppointments
    .filter(a => a.TotalConsultedAmount !== null)
    .reduce((sum, a) => sum + parseFloat(a.TotalConsultedAmount), 0);

  const pendingVisits = patAppointments.filter(a => a.AppointmentStatus === 3 || a.AppointmentStatus === 4).length;
  const completedVisits = patAppointments.filter(a => a.AppointmentStatus === 5).length;

  if (!currentPat) {
    return (
      <div className="panel" style={{ textAlign: 'center', padding: '3rem' }}>
        <h3>Patient Profile Initializing</h3>
        <p style={{ color: 'var(--text-light)', marginTop: '1rem' }}>
          Please contact your administrator or enter your personal profile information.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* 1. APPOINTMENTS LIST PANEL */}
      {activeTab === 'dashboard' && (
        <div className="panel">
          <div className="panel-header">
            <h3>My Appointment Schedule</h3>
            <button className="btn btn-primary btn-sm" onClick={() => setActiveTab('book-appointment')}>
              <Heart size={16} /> Book New Appointment
            </button>
          </div>

          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Appointment ID</th>
                  <th>Assigned Doctor</th>
                  <th>Department / Specialization</th>
                  <th>Appointment Date & Time</th>
                  <th>Brief Description</th>
                  <th>Doctor's Remarks</th>
                  <th>Status</th>
                  <th>Fee Billing</th>
                </tr>
              </thead>
              <tbody>
                {patAppointments.length > 0 ? (
                  patAppointments.map((app) => (
                    <tr key={app.AppointmentID}>
                      <td>{app.AppointmentID}</td>
                      <td style={{ fontWeight: 600 }}>{getDoctorName(app.DoctorID)}</td>
                      <td>
                        <span style={{ fontWeight: 500, color: 'var(--primary)' }}>
                          {getDoctorSpecialization(app.DoctorID)}
                        </span>
                      </td>
                      <td>{new Date(app.AppointmentDate).toLocaleString()}</td>
                      <td>{app.Description}</td>
                      <td>
                        <span style={{ fontStyle: 'italic', fontSize: '0.85rem' }}>
                          {app.SpecialRemarks || 'No remarks yet'}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${getStatusClass(app.AppointmentStatus)}`}>
                          {getStatusLabel(app.AppointmentStatus)}
                        </span>
                      </td>
                      <td style={{ fontWeight: 600 }}>
                        {globalSettings?.currency || '$'}{app.TotalConsultedAmount !== null ? parseFloat(app.TotalConsultedAmount).toFixed(2) : '0.00'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-light)' }}>
                      You haven't requested any appointments yet. Click "Book New Appointment" to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. BOOK APPOINTMENT PANEL */}
      {activeTab === 'book-appointment' && (
        <div className="panel" style={{ maxWidth: '700px', margin: '0 auto' }}>
          <div className="panel-header">
            <h3>Book Hospital Appointment</h3>
          </div>

          {bookingSuccess && (
            <div className="error-message" style={{ backgroundColor: 'var(--success-light)', color: 'var(--success)', borderLeftColor: 'var(--success)' }}>
              {bookingSuccess}
            </div>
          )}
          {bookingError && <div className="error-message">{bookingError}</div>}

          <form onSubmit={handleBookSubmit}>
            <div className="form-group row-2">
              <div>
                <label className="form-label">Hospital Department</label>
                <select
                  className="form-input"
                  value={selectedDeptId}
                  onChange={(e) => {
                    setSelectedDeptId(e.target.value);
                    setSelectedDocId('');
                  }}
                  required
                >
                  <option value="">-- Choose Department --</option>
                  {departments.filter(d => d.IsActive === 1).map((d) => (
                    <option key={d.DepartmentID} value={d.DepartmentID}>
                      {d.DepartmentName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label">Available Specialist</label>
                <select
                  className="form-input"
                  value={selectedDocId}
                  onChange={(e) => setSelectedDocId(e.target.value)}
                  disabled={!selectedDeptId}
                  required
                >
                  <option value="">
                    {selectedDeptId ? '-- Choose Doctor --' : 'Please select department first'}
                  </option>
                  {availableDoctors.map((doc) => (
                    <option key={doc.DoctorID} value={doc.DoctorID}>
                      {doc.Name} ({doc.Specialization})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Desired Date & Time</label>
              <input
                type="datetime-local"
                className="form-input"
                value={appDate}
                onChange={(e) => setAppDate(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Medical Issues / Symptoms Description</label>
              <textarea
                rows="4"
                className="form-input"
                placeholder="Briefly describe what symptoms or issues you want to address..."
                value={appDesc}
                onChange={(e) => setAppDesc(e.target.value)}
                required
                style={{ resize: 'vertical' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                Submit Appointment Request
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => setActiveTab('dashboard')}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 3. DOCTORS PANEL (NEW VIEW FOR PATIENT) */}
      {activeTab === 'doctors' && (
        <div className="panel">
          <div className="panel-header">
            <h3>Our Medical Specialists</h3>
          </div>

          <div className="filter-bar">
            <div className="search-input-wrapper">
              <Search className="search-icon-inside" size={18} />
              <input
                type="text"
                placeholder="Search specialists by name, qualification..."
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="filters-right">
              <SlidersHorizontal size={16} color="var(--text-light)" />
              <select
                className="select-filter"
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
              >
                <option value="all">All Departments</option>
                {departments.filter(d => d.IsActive === 1).map((d) => (
                  <option key={d.DepartmentID} value={d.DepartmentID}>
                    {d.DepartmentName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Doctor Name</th>
                  <th>Assigned Department</th>
                  <th>Qualification</th>
                  <th>Medical Specialization</th>
                  <th>Hospital Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDoctors.length > 0 ? (
                  filteredDoctors.map((doc) => (
                    <tr key={doc.DoctorID}>
                      <td style={{ fontWeight: 600 }}>{doc.Name}</td>
                      <td style={{ fontWeight: 500, color: 'var(--primary)' }}>{getDoctorDeptName(doc.DoctorID)}</td>
                      <td>{doc.Qualification}</td>
                      <td>{doc.Specialization}</td>
                      <td>{doc.Email}</td>
                      <td>
                        <button 
                          className="btn btn-primary btn-sm"
                          onClick={() => {
                            const mapping = doctorDepartments.find(dd => dd.DoctorID === doc.DoctorID);
                            if (mapping) {
                              setSelectedDeptId(mapping.DepartmentID.toString());
                              setSelectedDocId(doc.DoctorID.toString());
                              setActiveTab('book-appointment');
                            }
                          }}
                        >
                          Book Visit
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-light)' }}>
                      No active doctors found matching requirements.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. DEPARTMENTS PANEL (NEW VIEW FOR PATIENT) */}
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
                placeholder="Search departments by name..."
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem', marginTop: '1rem' }}>
            {filteredDepartments.length > 0 ? (
              filteredDepartments.map((dept) => {
                const docCount = doctorDepartments.filter(dd => dd.DepartmentID === dept.DepartmentID).length;
                return (
                  <div key={dept.DepartmentID} className="panel" style={{ marginBottom: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                        <div style={{ padding: '0.5rem', borderRadius: '8px', background: 'var(--primary-light)', color: 'var(--primary)' }}>
                          <Building2 size={20} />
                        </div>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{dept.DepartmentName}</h4>
                      </div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                        {dept.Description || 'Specialist healthcare department committed to patients.'}
                      </p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: '0.75rem', fontSize: '0.82rem', color: 'var(--text-light)' }}>
                      <span><strong>{docCount}</strong> Doctors Active</span>
                      <button 
                        className="btn btn-secondary btn-sm"
                        style={{ border: 'none', background: 'var(--primary-light)', color: 'var(--primary)', padding: '0.3rem 0.75rem' }}
                        onClick={() => {
                          setSelectedDeptId(dept.DepartmentID.toString());
                          setActiveTab('book-appointment');
                        }}
                      >
                        Select
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div style={{ gridColumn: 'span 3', textAlign: 'center', padding: '3rem', color: 'var(--text-light)' }}>
                No active hospital departments found.
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5. REPORTS PANEL (NEW VIEW FOR PATIENT) */}
      {activeTab === 'reports' && (
        <div>
          <div className="dashboard-title-bar">
            <h2>My Medical & Billing Reports</h2>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="btn btn-secondary btn-sm" onClick={() => alert('Printing your patient bill details...')}><Printer size={15} /> Print Summary</button>
              <button className="btn btn-secondary btn-sm" onClick={() => alert('Downloading Patient Statement report.')}><Download size={15} /> Download statement</button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            <div className="stat-card">
              <div className="stat-info">
                <h4>Total Consultations</h4>
                <p>{patAppointments.length}</p>
              </div>
              <div className="stat-icon-wrapper blue">
                <Activity size={24} />
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-info">
                <h4>Completed Checks</h4>
                <p>{completedVisits}</p>
              </div>
              <div className="stat-icon-wrapper green">
                <CheckCircle size={24} />
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-info">
                <h4>Pending Checks</h4>
                <p>{pendingVisits}</p>
              </div>
              <div className="stat-icon-wrapper orange">
                <Clock size={24} />
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-info">
                <h4>Total Fees Paid</h4>
                <p>{globalSettings?.currency || '$'}{totalBilled.toFixed(2)}</p>
              </div>
              <div className="stat-icon-wrapper teal">
                <DollarSign size={24} />
              </div>
            </div>
          </div>

          <div className="panel">
            <div className="panel-header">
              <h3>Consultation History Log</h3>
            </div>
            
            <div className="table-responsive">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Doctor</th>
                    <th>Diagnosis Description</th>
                    <th>Prescription / Doctor Remarks</th>
                    <th>Fee Status</th>
                    <th>Paid Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {patAppointments.filter(app => app.AppointmentStatus === 5).length > 0 ? (
                    patAppointments.filter(app => app.AppointmentStatus === 5).map((app) => (
                      <tr key={app.AppointmentID}>
                        <td>{new Date(app.AppointmentDate).toLocaleDateString()}</td>
                        <td style={{ fontWeight: 600 }}>{getDoctorName(app.DoctorID)}</td>
                        <td>{app.Description}</td>
                        <td style={{ fontStyle: 'italic' }}>{app.SpecialRemarks || 'N/A'}</td>
                        <td><span className="badge status-consulted">Settled</span></td>
                        <td style={{ fontWeight: 600 }}>
                          {globalSettings?.currency || '$'}{app.TotalConsultedAmount ? parseFloat(app.TotalConsultedAmount).toFixed(2) : '0.00'}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-light)' }}>
                        No completed consultations found on record.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 6. PROFILE PANEL */}
      {activeTab === 'profile' && (
        <div className="panel" style={{ maxWidth: '700px', margin: '0 auto' }}>
          <div className="panel-header">
            <h3>My Personal Medical Profile</h3>
          </div>

          {profileSuccess && (
            <div className="error-message" style={{ backgroundColor: 'var(--success-light)', color: 'var(--success)', borderLeftColor: 'var(--success)' }}>
              {profileSuccess}
            </div>
          )}

          <form onSubmit={handleProfileSubmit}>
            <div className="form-group row-2">
              <div>
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={profName}
                  onChange={(e) => setProfName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="form-label">Gender</label>
                <select
                  className="form-input"
                  value={profGender}
                  onChange={(e) => setProfGender(e.target.value)}
                >
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
                  value={profDOB}
                  onChange={(e) => setProfDOB(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="form-label">Contact Phone</label>
                <input
                  type="tel"
                  className="form-input"
                  value={profPhone}
                  onChange={(e) => setProfPhone(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                value={profEmail}
                onChange={(e) => setProfEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group row-2">
              <div>
                <label className="form-label">Home Address</label>
                <input
                  type="text"
                  className="form-input"
                  value={profAddress}
                  onChange={(e) => setProfAddress(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="form-label">City</label>
                <input
                  type="text"
                  className="form-input"
                  value={profCity}
                  onChange={(e) => setProfCity(e.target.value)}
                  required
                />
              </div>
            </div>

            <div style={{ marginTop: '1.5rem' }}>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                Save Profile Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 7. SETTINGS PANEL (NEW VIEW FOR PATIENT) */}
      {activeTab === 'settings' && (
        <div className="panel" style={{ maxWidth: '700px', margin: '0 auto' }}>
          <div className="panel-header">
            <h3>My System Preferences</h3>
          </div>

          {settingsMsg && (
            <div className="error-message" style={{ backgroundColor: 'var(--success-light)', color: 'var(--success)', borderLeftColor: 'var(--success)' }}>
              {settingsMsg}
            </div>
          )}

          <form onSubmit={handleSettingsSubmit}>
            <div className="form-group row-2">
              <div>
                <label className="form-label">Preferred Portal Language</label>
                <select 
                  className="form-input"
                  value={prefLang}
                  onChange={(e) => setPrefLang(e.target.value)}
                >
                  <option value="English">English</option>
                  <option value="Spanish">Spanish</option>
                  <option value="Hindi">Hindi (हिंदी)</option>
                  <option value="French">French</option>
                </select>
              </div>

              <div>
                <label className="form-label">UI Interface Theme</label>
                <select
                  className="form-input"
                  value={prefTheme}
                  onChange={(e) => setPrefTheme(e.target.value)}
                >
                  <option value="Light">Light Slate (Default)</option>
                  <option value="Dark">Dark Mode (Simulated)</option>
                  <option value="Teal">Ocean Teal Theme</option>
                </select>
              </div>
            </div>

            <div style={{ padding: '1rem', background: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', border: '1px solid var(--border)' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>Appointment Alerts & Notifications</h4>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={notifyEmail}
                    onChange={(e) => setNotifyEmail(e.target.checked)}
                  />
                  <span>Send me email notifications upon Booking Approvals and Doctor Reviews.</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={notifySMS}
                    onChange={(e) => setNotifySMS(e.target.checked)}
                  />
                  <span>Send SMS alerts on prescription logs.</span>
                </label>
              </div>
            </div>

            <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--success-light)', color: 'var(--success)', display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.82rem', border: '1px solid var(--success)', marginBottom: '1.5rem' }}>
              <Info size={16} />
              <span><strong>Account State:</strong> Active Patient Login (Linked to ID: {currentPat.PatientID}).</span>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              Save Preferences
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default PatientDashboard;
