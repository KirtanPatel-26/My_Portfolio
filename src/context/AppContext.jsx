import React, { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

const DEFAULT_STATUSES = [
  { StatusID: 1, StatusName: 'Active', StatusCssClass: 'status-active' },
  { StatusID: 2, StatusName: 'Inactive', StatusCssClass: 'status-inactive' },
  { StatusID: 3, StatusName: 'Pending', StatusCssClass: 'status-pending' },
  { StatusID: 4, StatusName: 'Confirmed', StatusCssClass: 'status-confirmed' },
  { StatusID: 5, StatusName: 'Consulted', StatusCssClass: 'status-consulted' },
  { StatusID: 6, StatusName: 'Cancelled', StatusCssClass: 'status-cancelled' },
];

const DEFAULT_USERS = [
  { UserID: 1, UserName: 'admin', Password: 'admin', Email: 'admin@hms.com', MobileNo: '9876543210', IsActive: 1, Created: new Date().toISOString(), Role: 'Admin', Modified: new Date().toISOString() },
  { UserID: 2, UserName: 'doctor1', Password: 'doctor1', Email: 'doctor1@hms.com', MobileNo: '9876543211', IsActive: 1, Created: new Date().toISOString(), Role: 'Doctor', Modified: new Date().toISOString() },
  { UserID: 3, UserName: 'doctor2', Password: 'doctor2', Email: 'doctor2@hms.com', MobileNo: '9876543212', IsActive: 1, Created: new Date().toISOString(), Role: 'Doctor', Modified: new Date().toISOString() },
  { UserID: 4, UserName: 'patient1', Password: 'patient1', Email: 'patient1@hms.com', MobileNo: '9876543213', IsActive: 1, Created: new Date().toISOString(), Role: 'Patient', Modified: new Date().toISOString() },
  { UserID: 5, UserName: 'patient2', Password: 'patient2', Email: 'patient2@hms.com', MobileNo: '9876543214', IsActive: 1, Created: new Date().toISOString(), Role: 'Patient', Modified: new Date().toISOString() },
];

const DEFAULT_DEPARTMENTS = [
  { DepartmentID: 1, DepartmentName: 'Cardiology', Description: 'Advanced cardiac care and heart surgery department.', IsActive: 1, Created: new Date().toISOString(), Modified: new Date().toISOString(), UserID: 1 },
  { DepartmentID: 2, DepartmentName: 'Neurology', Description: 'Expert treatments for brains, nerves, and spinal cord.', IsActive: 1, Created: new Date().toISOString(), Modified: new Date().toISOString(), UserID: 1 },
  { DepartmentID: 3, DepartmentName: 'Pediatrics', Description: 'Specialized healthcare for infants, toddlers, and teenagers.', IsActive: 1, Created: new Date().toISOString(), Modified: new Date().toISOString(), UserID: 1 },
  { DepartmentID: 4, DepartmentName: 'Orthopedics', Description: 'Specialized treatment for bones, joints, ligaments, tendons, and muscles.', IsActive: 1, Created: new Date().toISOString(), Modified: new Date().toISOString(), UserID: 1 },
  { DepartmentID: 5, DepartmentName: 'Dermatology', Description: 'Comprehensive care for hair, nails, and skin disorders.', IsActive: 1, Created: new Date().toISOString(), Modified: new Date().toISOString(), UserID: 1 },
];

const DEFAULT_DOCTORS = [
  { DoctorID: 1, Name: 'Dr. John Smith', Phone: '9876543211', Email: 'doctor1@hms.com', Qualification: 'MD, DM - Cardiology', Specialization: 'Interventional Cardiologist', IsActive: 1, Created: new Date().toISOString(), Modified: new Date().toISOString(), UserID: 2 },
  { DoctorID: 2, Name: 'Dr. Sarah Connor', Phone: '9876543212', Email: 'doctor2@hms.com', Qualification: 'MD, DM - Neurology', Specialization: 'Neurosurgeon', IsActive: 1, Created: new Date().toISOString(), Modified: new Date().toISOString(), UserID: 3 },
];

const DEFAULT_DOCTOR_DEPARTMENTS = [
  { DoctorDepartmentID: 1, DoctorID: 1, DepartmentID: 1, Created: new Date().toISOString(), Modified: new Date().toISOString(), UserID: 1 },
  { DoctorDepartmentID: 2, DoctorID: 2, DepartmentID: 2, Created: new Date().toISOString(), Modified: new Date().toISOString(), UserID: 1 },
];

const DEFAULT_PATIENTS = [
  { PatientID: 1, Name: 'Bruce Wayne', DateOfBirth: '1980-02-19', Gender: 'Male', Email: 'patient1@hms.com', Phone: '9876543213', Address: '1007 Mountain Drive', City: 'Gotham City', State: 1, IsActive: 1, Created: new Date().toISOString(), Modified: new Date().toISOString(), UserID: 4 },
  { PatientID: 2, Name: 'Clark Kent', DateOfBirth: '1985-06-18', Gender: 'Male', Email: 'patient2@hms.com', Phone: '9876543214', Address: '344 Clinton Street, Apt 3B', City: 'Metropolis', State: 1, IsActive: 1, Created: new Date().toISOString(), Modified: new Date().toISOString(), UserID: 5 },
];

const DEFAULT_APPOINTMENTS = [
  { AppointmentID: 1, DoctorID: 1, PatientID: 1, AppointmentDate: '2026-07-10T10:00', AppointmentStatus: 3, Description: 'Regular cardiovascular assessment and cholesterol report review.', SpecialRemarks: 'None', Created: new Date().toISOString(), Modified: new Date().toISOString(), UserID: 4, TotalConsultedAmount: null },
  { AppointmentID: 2, DoctorID: 2, PatientID: 2, AppointmentDate: '2026-07-12T14:30', AppointmentStatus: 4, Description: 'Follow-up for chronic migraine issues and brain scan check.', SpecialRemarks: 'Please carry recent scan copy.', Created: new Date().toISOString(), Modified: new Date().toISOString(), UserID: 5, TotalConsultedAmount: null },
];

export const AppProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('hms_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('hms_users');
    return saved ? JSON.parse(saved) : DEFAULT_USERS;
  });

  const [statuses, setStatuses] = useState(() => {
    const saved = localStorage.getItem('hms_statuses');
    return saved ? JSON.parse(saved) : DEFAULT_STATUSES;
  });

  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('hms_settings');
    return saved ? JSON.parse(saved) : {
      hospitalName: 'HopeCare HMS',
      currency: '$',
      workingHours: '09:00 AM - 08:00 PM',
      maxDailyAppointments: 20
    };
  });

  const [departments, setDepartments] = useState(() => {
    const saved = localStorage.getItem('hms_departments');
    if (saved) {
      const parsed = JSON.parse(saved);
      const hasOrth = parsed.some(d => d.DepartmentName === 'Orthopedics');
      const hasDerm = parsed.some(d => d.DepartmentName === 'Dermatology');
      let updated = [...parsed];
      let changed = false;
      if (!hasOrth) {
        updated.push({ 
          DepartmentID: 4, 
          DepartmentName: 'Orthopedics', 
          Description: 'Specialized treatment for bones, joints, ligaments, tendons, and muscles.', 
          IsActive: 1, 
          Created: new Date().toISOString(), 
          Modified: new Date().toISOString(), 
          UserID: 1 
        });
        changed = true;
      }
      if (!hasDerm) {
        updated.push({ 
          DepartmentID: 5, 
          DepartmentName: 'Dermatology', 
          Description: 'Comprehensive care for hair, nails, and skin disorders.', 
          IsActive: 1, 
          Created: new Date().toISOString(), 
          Modified: new Date().toISOString(), 
          UserID: 1 
        });
        changed = true;
      }
      if (changed) {
        localStorage.setItem('hms_departments', JSON.stringify(updated));
        return updated;
      }
      return parsed;
    }
    return DEFAULT_DEPARTMENTS;
  });

  const [doctors, setDoctors] = useState(() => {
    const saved = localStorage.getItem('hms_doctors');
    return saved ? JSON.parse(saved) : DEFAULT_DOCTORS;
  });

  const [doctorDepartments, setDoctorDepartments] = useState(() => {
    const saved = localStorage.getItem('hms_doctor_departments');
    return saved ? JSON.parse(saved) : DEFAULT_DOCTOR_DEPARTMENTS;
  });

  const [patients, setPatients] = useState(() => {
    const saved = localStorage.getItem('hms_patients');
    return saved ? JSON.parse(saved) : DEFAULT_PATIENTS;
  });

  const [appointments, setAppointments] = useState(() => {
    const saved = localStorage.getItem('hms_appointments');
    return saved ? JSON.parse(saved) : DEFAULT_APPOINTMENTS;
  });

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('hms_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('hms_departments', JSON.stringify(departments));
  }, [departments]);

  useEffect(() => {
    localStorage.setItem('hms_doctors', JSON.stringify(doctors));
  }, [doctors]);

  useEffect(() => {
    localStorage.setItem('hms_doctor_departments', JSON.stringify(doctorDepartments));
  }, [doctorDepartments]);

  useEffect(() => {
    localStorage.setItem('hms_patients', JSON.stringify(patients));
  }, [patients]);

  useEffect(() => {
    localStorage.setItem('hms_appointments', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem('hms_statuses', JSON.stringify(statuses));
  }, [statuses]);

  useEffect(() => {
    localStorage.setItem('hms_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('hms_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('hms_current_user');
    }
  }, [currentUser]);

  // Auth Operations
  const login = (username, password, selectedRole) => {
    const foundUser = users.find(
      (u) => u.UserName.toLowerCase() === username.toLowerCase() && u.Password === password && u.Role.toLowerCase() === selectedRole.toLowerCase()
    );
    if (foundUser) {
      if (!foundUser.IsActive) {
        return { success: false, message: 'Account is inactive.' };
      }
      setCurrentUser(foundUser);
      return { success: true, user: foundUser };
    }
    return { success: false, message: 'Invalid username, password, or role.' };
  };

  const registerUser = (userData) => {
    // Check if username or email exists
    const duplicate = users.some(
      (u) => u.UserName.toLowerCase() === userData.UserName.toLowerCase() || u.Email.toLowerCase() === userData.Email.toLowerCase()
    );
    if (duplicate) {
      return { success: false, message: 'Username or Email already exists.' };
    }

    const newUserId = users.length > 0 ? Math.max(...users.map((u) => u.UserID)) + 1 : 1;
    const newUser = {
      UserID: newUserId,
      UserName: userData.UserName,
      Password: userData.Password,
      Email: userData.Email,
      MobileNo: userData.MobileNo,
      IsActive: 1,
      Created: new Date().toISOString(),
      Role: userData.Role, // 'Admin', 'Doctor', 'Patient'
      Modified: new Date().toISOString(),
    };

    // Update Users
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);

    // If role is Doctor, create a Doctor profile
    if (userData.Role === 'Doctor') {
      const newDoctorId = doctors.length > 0 ? Math.max(...doctors.map((d) => d.DoctorID)) + 1 : 1;
      const newDoctor = {
        DoctorID: newDoctorId,
        Name: userData.Name || `Dr. ${userData.UserName}`,
        Phone: userData.MobileNo,
        Email: userData.Email,
        Qualification: userData.Qualification || 'MBBS',
        Specialization: userData.Specialization || 'General Physician',
        IsActive: 1,
        Created: new Date().toISOString(),
        Modified: new Date().toISOString(),
        UserID: newUserId,
      };
      setDoctors((prev) => [...prev, newDoctor]);

      // Map to default Cardiology or Neurology if specified
      if (userData.DepartmentID) {
        const newDDid = doctorDepartments.length > 0 ? Math.max(...doctorDepartments.map((dd) => dd.DoctorDepartmentID)) + 1 : 1;
        setDoctorDepartments((prev) => [
          ...prev,
          {
            DoctorDepartmentID: newDDid,
            DoctorID: newDoctorId,
            DepartmentID: parseInt(userData.DepartmentID),
            Created: new Date().toISOString(),
            Modified: new Date().toISOString(),
            UserID: 1,
          },
        ]);
      }
    }

    // If role is Patient, create a Patient profile
    if (userData.Role === 'Patient') {
      const newPatientId = patients.length > 0 ? Math.max(...patients.map((p) => p.PatientID)) + 1 : 1;
      const newPatient = {
        PatientID: newPatientId,
        Name: userData.Name || userData.UserName,
        DateOfBirth: userData.DateOfBirth || new Date().toISOString().split('T')[0],
        Gender: userData.Gender || 'Other',
        Email: userData.Email,
        Phone: userData.MobileNo,
        Address: userData.Address || 'N/A',
        City: userData.City || 'N/A',
        State: 1, // Status Active (matches status id)
        IsActive: 1,
        Created: new Date().toISOString(),
        Modified: new Date().toISOString(),
        UserID: newUserId,
      };
      setPatients((prev) => [...prev, newPatient]);
    }

    return { success: true, user: newUser };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  // --- CRUD Departments ---
  const addDepartment = (dept) => {
    const nextId = departments.length > 0 ? Math.max(...departments.map((d) => d.DepartmentID)) + 1 : 1;
    const newDept = {
      DepartmentID: nextId,
      DepartmentName: dept.DepartmentName,
      Description: dept.Description || '',
      IsActive: dept.IsActive !== undefined ? dept.IsActive : 1,
      Created: new Date().toISOString(),
      Modified: new Date().toISOString(),
      UserID: currentUser ? currentUser.UserID : 1,
    };
    setDepartments((prev) => [...prev, newDept]);
  };

  const updateDepartment = (id, updatedFields) => {
    setDepartments((prev) =>
      prev.map((d) =>
        d.DepartmentID === id
          ? { ...d, ...updatedFields, Modified: new Date().toISOString(), UserID: currentUser ? currentUser.UserID : d.UserID }
          : d
      )
    );
  };

  const deleteDepartment = (id) => {
    setDepartments((prev) => prev.filter((d) => d.DepartmentID !== id));
    // Cascade removal in doctor mapping
    setDoctorDepartments((prev) => prev.filter((dd) => dd.DepartmentID !== id));
  };

  // --- CRUD Doctors ---
  const addDoctor = (doc) => {
    // 1. Create a corresponding Login User for the Doctor
    const nextUserId = users.length > 0 ? Math.max(...users.map((u) => u.UserID)) + 1 : 1;
    const newDocUser = {
      UserID: nextUserId,
      UserName: doc.UserName || doc.Name.toLowerCase().replace(/\s+/g, ''),
      Password: doc.Password || 'doctor123',
      Email: doc.Email,
      MobileNo: doc.Phone,
      IsActive: doc.IsActive !== undefined ? doc.IsActive : 1,
      Created: new Date().toISOString(),
      Role: 'Doctor',
      Modified: new Date().toISOString(),
    };
    setUsers((prev) => [...prev, newDocUser]);

    // 2. Add Doctor record
    const nextDocId = doctors.length > 0 ? Math.max(...doctors.map((d) => d.DoctorID)) + 1 : 1;
    const newDoc = {
      DoctorID: nextDocId,
      Name: doc.Name,
      Phone: doc.Phone,
      Email: doc.Email,
      Qualification: doc.Qualification,
      Specialization: doc.Specialization,
      IsActive: doc.IsActive !== undefined ? doc.IsActive : 1,
      Created: new Date().toISOString(),
      Modified: new Date().toISOString(),
      UserID: nextUserId,
    };
    setDoctors((prev) => [...prev, newDoc]);

    // 3. Map to department
    if (doc.DepartmentID) {
      const nextDDid = doctorDepartments.length > 0 ? Math.max(...doctorDepartments.map((dd) => dd.DoctorDepartmentID)) + 1 : 1;
      setDoctorDepartments((prev) => [
        ...prev,
        {
          DoctorDepartmentID: nextDDid,
          DoctorID: nextDocId,
          DepartmentID: parseInt(doc.DepartmentID),
          Created: new Date().toISOString(),
          Modified: new Date().toISOString(),
          UserID: currentUser ? currentUser.UserID : 1,
        },
      ]);
    }
  };

  const updateDoctor = (id, updatedFields) => {
    setDoctors((prev) =>
      prev.map((d) =>
        d.DoctorID === id
          ? { ...d, ...updatedFields, Modified: new Date().toISOString() }
          : d
      )
    );

    // Update associated user if active status, email, phone or name changed
    const targetDoc = doctors.find((d) => d.DoctorID === id);
    if (targetDoc) {
      setUsers((prev) =>
        prev.map((u) =>
          u.UserID === targetDoc.UserID
            ? {
                ...u,
                Email: updatedFields.Email !== undefined ? updatedFields.Email : u.Email,
                MobileNo: updatedFields.Phone !== undefined ? updatedFields.Phone : u.MobileNo,
                IsActive: updatedFields.IsActive !== undefined ? updatedFields.IsActive : u.IsActive,
                Modified: new Date().toISOString(),
              }
            : u
        )
      );

      // Handle Department mapping updates
      if (updatedFields.DepartmentID) {
        setDoctorDepartments((prev) => {
          const mappingExists = prev.some((dd) => dd.DoctorID === id);
          if (mappingExists) {
            return prev.map((dd) =>
              dd.DoctorID === id
                ? { ...dd, DepartmentID: parseInt(updatedFields.DepartmentID), Modified: new Date().toISOString() }
                : dd
            );
          } else {
            const nextDDid = prev.length > 0 ? Math.max(...prev.map((dd) => dd.DoctorDepartmentID)) + 1 : 1;
            return [
              ...prev,
              {
                DoctorDepartmentID: nextDDid,
                DoctorID: id,
                DepartmentID: parseInt(updatedFields.DepartmentID),
                Created: new Date().toISOString(),
                Modified: new Date().toISOString(),
                UserID: currentUser ? currentUser.UserID : 1,
              },
            ];
          }
        });
      }
    }
  };

  const deleteDoctor = (id) => {
    const targetDoc = doctors.find((d) => d.DoctorID === id);
    setDoctors((prev) => prev.filter((d) => d.DoctorID !== id));
    // Cascade removal in doctor-department mapping and appointments
    setDoctorDepartments((prev) => prev.filter((dd) => dd.DoctorID !== id));
    setAppointments((prev) => prev.filter((app) => app.DoctorID !== id));

    // Disable or delete user account
    if (targetDoc) {
      setUsers((prev) => prev.filter((u) => u.UserID !== targetDoc.UserID));
    }
  };

  // --- CRUD Patients ---
  const addPatient = (pat) => {
    // 1. Create Login User
    const nextUserId = users.length > 0 ? Math.max(...users.map((u) => u.UserID)) + 1 : 1;
    const newPatUser = {
      UserID: nextUserId,
      UserName: pat.UserName || pat.Name.toLowerCase().replace(/\s+/g, ''),
      Password: pat.Password || 'patient123',
      Email: pat.Email,
      MobileNo: pat.Phone,
      IsActive: pat.IsActive !== undefined ? pat.IsActive : 1,
      Created: new Date().toISOString(),
      Role: 'Patient',
      Modified: new Date().toISOString(),
    };
    setUsers((prev) => [...prev, newPatUser]);

    // 2. Create Patient Record
    const nextPatId = patients.length > 0 ? Math.max(...patients.map((p) => p.PatientID)) + 1 : 1;
    const newPatientObj = {
      PatientID: nextPatId,
      Name: pat.Name,
      DateOfBirth: pat.DateOfBirth,
      Gender: pat.Gender,
      Email: pat.Email,
      Phone: pat.Phone,
      Address: pat.Address,
      City: pat.City,
      State: pat.State || 1, // Status Link
      IsActive: pat.IsActive !== undefined ? pat.IsActive : 1,
      Created: new Date().toISOString(),
      Modified: new Date().toISOString(),
      UserID: nextUserId,
    };
    setPatients((prev) => [...prev, newPatientObj]);
  };

  const updatePatient = (id, updatedFields) => {
    setPatients((prev) =>
      prev.map((p) =>
        p.PatientID === id
          ? { ...p, ...updatedFields, Modified: new Date().toISOString() }
          : p
      )
    );

    // Sync to user table
    const targetPat = patients.find((p) => p.PatientID === id);
    if (targetPat) {
      setUsers((prev) =>
        prev.map((u) =>
          u.UserID === targetPat.UserID
            ? {
                ...u,
                Email: updatedFields.Email !== undefined ? updatedFields.Email : u.Email,
                MobileNo: updatedFields.Phone !== undefined ? updatedFields.Phone : u.MobileNo,
                IsActive: updatedFields.IsActive !== undefined ? updatedFields.IsActive : u.IsActive,
                Modified: new Date().toISOString(),
              }
            : u
        )
      );
    }
  };

  const deletePatient = (id) => {
    const targetPat = patients.find((p) => p.PatientID === id);
    setPatients((prev) => prev.filter((p) => p.PatientID !== id));
    setAppointments((prev) => prev.filter((app) => app.PatientID !== id));

    if (targetPat) {
      setUsers((prev) => prev.filter((u) => u.UserID !== targetPat.UserID));
    }
  };

  // --- CRUD Appointments ---
  const addAppointment = (app) => {
    const nextId = appointments.length > 0 ? Math.max(...appointments.map((a) => a.AppointmentID)) + 1 : 1;
    const newApp = {
      AppointmentID: nextId,
      DoctorID: parseInt(app.DoctorID),
      PatientID: parseInt(app.PatientID),
      AppointmentDate: app.AppointmentDate,
      AppointmentStatus: app.AppointmentStatus || 3, // Default is Pending (ID: 3)
      Description: app.Description || '',
      SpecialRemarks: app.SpecialRemarks || 'None',
      Created: new Date().toISOString(),
      Modified: new Date().toISOString(),
      UserID: currentUser ? currentUser.UserID : 1,
      TotalConsultedAmount: app.TotalConsultedAmount ? parseFloat(app.TotalConsultedAmount) : null,
    };
    setAppointments((prev) => [...prev, newApp]);
  };

  const updateAppointment = (id, updatedFields) => {
    setAppointments((prev) =>
      prev.map((a) =>
        a.AppointmentID === id
          ? {
              ...a,
              ...updatedFields,
              DoctorID: updatedFields.DoctorID ? parseInt(updatedFields.DoctorID) : a.DoctorID,
              PatientID: updatedFields.PatientID ? parseInt(updatedFields.PatientID) : a.PatientID,
              AppointmentStatus: updatedFields.AppointmentStatus ? parseInt(updatedFields.AppointmentStatus) : a.AppointmentStatus,
              TotalConsultedAmount: updatedFields.TotalConsultedAmount !== undefined ? (updatedFields.TotalConsultedAmount === '' || updatedFields.TotalConsultedAmount === null ? null : parseFloat(updatedFields.TotalConsultedAmount)) : a.TotalConsultedAmount,
              Modified: new Date().toISOString(),
              UserID: currentUser ? currentUser.UserID : a.UserID,
            }
          : a
      )
    );
  };

  const deleteAppointment = (id) => {
    setAppointments((prev) => prev.filter((a) => a.AppointmentID !== id));
  };

  // --- CRUD Statuses ---
  const addStatus = (st) => {
    const nextId = statuses.length > 0 ? Math.max(...statuses.map((s) => s.StatusID)) + 1 : 1;
    const newStatus = {
      StatusID: nextId,
      StatusName: st.StatusName,
      StatusCssClass: st.StatusCssClass || 'status-inactive',
    };
    setStatuses((prev) => [...prev, newStatus]);
  };

  const updateStatus = (id, updatedFields) => {
    setStatuses((prev) =>
      prev.map((s) => (s.StatusID === id ? { ...s, ...updatedFields } : s))
    );
  };

  const deleteStatus = (id) => {
    setStatuses((prev) => prev.filter((s) => s.StatusID !== id));
  };

  // --- System Settings ---
  const updateSettings = (newSettings) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  // --- Admin Profile Settings ---
  const updateAdminProfile = (fields) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, ...fields, Modified: new Date().toISOString() };
    setCurrentUser(updatedUser);
    setUsers((prev) =>
      prev.map((u) => (u.UserID === currentUser.UserID ? updatedUser : u))
    );
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        statuses,
        departments,
        doctors,
        doctorDepartments,
        patients,
        appointments,
        settings,
        login,
        registerUser,
        logout,
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
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
