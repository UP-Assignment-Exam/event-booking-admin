import './App.css';
import { Route, Routes } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import NotFoundPage from './pages/NotFoundPage';
import AdminLayout from './pages/layouts/AdminLayout';
import AuthLayout from './pages/layouts/AuthLayout';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import SetupPasswordPage from './pages/auth/SetupPasswordPage';
import Dashboard from './pages/dashboard/Dashboard';
import AdminGuard from './middlewares/AdminGuard';
import Event from './pages/dashboard/Event';
import Customer from './pages/dashboard/Customer';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AdminGuard />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path='/Event' index element={<Event/>} />
            <Route path='/Customer' index element={<Customer/>}/>
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Route>

        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/setup-password" element={<SetupPasswordPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
