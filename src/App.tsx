import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import AppLayout from './components/AppLayout';
import Dashboard from './pages/Dashboard';
import TeacherAttendancePage from './pages/TeacherAttendance';
import StudentAttendancePage from './pages/StudentAttendance';
import TeacherRecapPage from './pages/TeacherRecap';
import StudentRecapPage from './pages/StudentRecap';
import StudentDataPage from './pages/StudentData';
import UserManagementPage from './pages/UserManagement';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Protected App Routes */}
        <Route path="/app" element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="absensi-guru" element={<TeacherAttendancePage />} />
          <Route path="absensi-siswa" element={<StudentAttendancePage />} />
          
          {/* Recap Routes */}
          <Route path="rekap">
            <Route index element={<Navigate to="/app/rekap/siswa" replace />} />
            <Route path="guru" element={<TeacherRecapPage />} />
            <Route path="siswa" element={<StudentRecapPage />} />
          </Route>

          {/* Admin Only Routes */}
          <Route path="data-siswa" element={<StudentDataPage />} />
          <Route path="users" element={<UserManagementPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
