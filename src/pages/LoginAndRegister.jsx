import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Heart, Stethoscope, User, ShieldCheck } from 'lucide-react';

const LoginAndRegister = () => {
  const { login, registerUser, departments } = useContext(AppContext);
  const [isRegister, setIsRegister] = useState(false);
  const [loginRole, setLoginRole] = useState('Patient'); // Patient, Doctor, Admin
  
  // Registration Role
  const [regRole, setRegRole] = useState('Patient'); // Patient, Doctor

  // Login form state
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Common Registration Form states
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regName, setRegName] = useState('');

  // Patient Registration Form states
  const [regDOB, setRegDOB] = useState('');
  const [regGender, setRegGender] = useState('Male');
  const [regAddress, setRegAddress] = useState('');
  const [regCity, setRegCity] = useState('');

  // Doctor Registration Form states
  const [regQual, setRegQual] = useState('');
  const [regSpec, setRegSpec] = useState('');
  const [regDeptId, setRegDeptId] = useState('');

  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setError('');
    const result = login(loginUsername, loginPassword, loginRole);
    if (!result.success) {
      setError(result.message);
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!regUsername || !regPassword || !regEmail || !regPhone || !regName) {
      setError('Please fill in all common fields.');
      return;
    }

    const userData = {
      UserName: regUsername,
      Password: regPassword,
      Email: regEmail,
      MobileNo: regPhone,
      Name: regName,
      Role: regRole,
    };

    if (regRole === 'Patient') {
      userData.DateOfBirth = regDOB;
      userData.Gender = regGender;
      userData.Address = regAddress;
      userData.City = regCity;
    } else if (regRole === 'Doctor') {
      userData.Qualification = regQual;
      userData.Specialization = regSpec;
      userData.DepartmentID = regDeptId;
    }

    const result = registerUser(userData);
    if (result.success) {
      setSuccessMsg('Registration successful! You can now log in.');
      setIsRegister(false);
      // set credentials for ease of use
      setLoginUsername(regUsername);
      setLoginPassword(regPassword);
      setLoginRole(regRole);
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        <div className="auth-header">
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.75rem' }}>
            <div style={{
              background: 'var(--primary-light)',
              padding: '0.75rem',
              borderRadius: '50%',
              color: 'var(--primary)',
              display: 'inline-flex',
              alignItems: 'center'
            }}>
              <Heart size={36} fill="var(--primary)" />
            </div>
          </div>
          <h2 className="auth-title">HopeCare HMS</h2>
          <p className="auth-subtitle">
            {isRegister ? 'Create your new hospital portal account' : 'Access your appointment dashboard'}
          </p>
        </div>

        {error && <div className="error-message">{error}</div>}
        {successMsg && (
          <div className="error-message" style={{ backgroundColor: 'var(--success-light)', color: 'var(--success)', borderLeftColor: 'var(--success)' }}>
            {successMsg}
          </div>
        )}

        {!isRegister ? (
          /* LOGIN FORM */
          <form onSubmit={handleLoginSubmit}>
            <div className="auth-role-tabs">
              <button
                type="button"
                className={`auth-role-tab ${loginRole === 'Patient' ? 'active' : ''}`}
                onClick={() => setLoginRole('Patient')}
              >
                <User size={14} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                Patient
              </button>
              <button
                type="button"
                className={`auth-role-tab ${loginRole === 'Doctor' ? 'active' : ''}`}
                onClick={() => setLoginRole('Doctor')}
              >
                <Stethoscope size={14} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                Doctor
              </button>
              <button
                type="button"
                className={`auth-role-tab ${loginRole === 'Admin' ? 'active' : ''}`}
                onClick={() => setLoginRole('Admin')}
              >
                <ShieldCheck size={14} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                Admin
              </button>
            </div>

            <div className="form-group">
              <label className="form-label">Username</label>
              <input
                type="text"
                className="form-input"
                placeholder="Enter username"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="Enter password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="auth-button">
              Sign In as {loginRole}
            </button>

            <div className="auth-switch">
              Don't have an account?{' '}
              <button type="button" className="auth-switch-link" onClick={() => setIsRegister(true)}>
                Register Here
              </button>
            </div>
            
            <div style={{ marginTop: '1.5rem', padding: '0.75rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              <span style={{ fontWeight: 600 }}>Quick Login Credentials:</span>
              <ul style={{ paddingLeft: '1.2rem', marginTop: '0.25rem' }}>
                <li>Admin: <code style={{ fontWeight: 600 }}>admin</code> / <code style={{ fontWeight: 600 }}>admin</code></li>
                <li>Doctor: <code style={{ fontWeight: 600 }}>doctor1</code> / <code style={{ fontWeight: 600 }}>doctor1</code></li>
                <li>Patient: <code style={{ fontWeight: 600 }}>patient1</code> / <code style={{ fontWeight: 600 }}>patient1</code></li>
              </ul>
            </div>
          </form>
        ) : (
          /* REGISTRATION FORM */
          <form onSubmit={handleRegisterSubmit}>
            <div className="auth-role-tabs" style={{ gridTemplateColumns: '1fr 1fr' }}>
              <button
                type="button"
                className={`auth-role-tab ${regRole === 'Patient' ? 'active' : ''}`}
                onClick={() => setRegRole('Patient')}
              >
                Register as Patient
              </button>
              <button
                type="button"
                className={`auth-role-tab ${regRole === 'Doctor' ? 'active' : ''}`}
                onClick={() => setRegRole('Doctor')}
              >
                Register as Doctor
              </button>
            </div>

            {/* Common Inputs */}
            <div className="form-group row-2">
              <div>
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. John Doe"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="form-label">Username</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. johndoe"
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group row-2">
              <div>
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="Password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="e.g. email@hms.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Mobile Number</label>
              <input
                type="tel"
                className="form-input"
                placeholder="e.g. +91 98765 43210"
                value={regPhone}
                onChange={(e) => setRegPhone(e.target.value)}
                required
              />
            </div>

            {/* Role-specific Fields */}
            {regRole === 'Patient' && (
              <>
                <div className="form-group row-2">
                  <div>
                    <label className="form-label">Date of Birth</label>
                    <input
                      type="date"
                      className="form-input"
                      value={regDOB}
                      onChange={(e) => setRegDOB(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label">Gender</label>
                    <select
                      className="form-input"
                      value={regGender}
                      onChange={(e) => setRegGender(e.target.value)}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="form-group row-2">
                  <div>
                    <label className="form-label">Address</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Flat/House, Street"
                      value={regAddress}
                      onChange={(e) => setRegAddress(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label">City</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Mumbai"
                      value={regCity}
                      onChange={(e) => setRegCity(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </>
            )}

            {regRole === 'Doctor' && (
              <>
                <div className="form-group row-2">
                  <div>
                    <label className="form-label">Qualification</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. MD, DM Cardiology"
                      value={regQual}
                      onChange={(e) => setRegQual(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label">Specialization</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Heart Specialist"
                      value={regSpec}
                      onChange={(e) => setRegSpec(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Hospital Department</label>
                  <select
                    className="form-input"
                    value={regDeptId}
                    onChange={(e) => setRegDeptId(e.target.value)}
                    required
                  >
                    <option value="">-- Select Department --</option>
                    {departments.filter(d => d.IsActive === 1).map((d) => (
                      <option key={d.DepartmentID} value={d.DepartmentID}>
                        {d.DepartmentName}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}

            <button type="submit" className="auth-button" style={{ backgroundColor: 'var(--accent)' }}>
              Create Account
            </button>

            <div className="auth-switch">
              Already have an account?{' '}
              <button type="button" className="auth-switch-link" onClick={() => setIsRegister(false)}>
                Log In
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginAndRegister;
