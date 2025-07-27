import './App.css';
import 'antd/dist/reset.css'; // ✅ Ant Design v5 styles
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navigate, Route, Routes } from 'react-router-dom'; // ✅ CORRECT
import NotFoundPage from './pages/NotFoundPage';
import AdminLayout from './pages/layouts/AdminLayout';
import AuthLayout from './pages/layouts/AuthLayout';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import SetupPasswordPage from './pages/auth/SetupPasswordPage';
import AdminGuard from './middlewares/AdminGuard';
import Event from './pages/dashboard/Event';
import Customer from './pages/dashboard/Customer';
import RolesPermissionsPage from './pages/dashboard/Roles/RolesPermissionsPage';
import RightPermissionPage from './pages/dashboard/rights/RightPermissionPage';
import DashboardPage from './pages/dashboard/Dashboards/DashboardPage';
import TicketTypePage from './pages/dashboard/TicketTypes/TicketTypePages';
import CategoryPage from './pages/dashboard/Categories/CategoryPage';
import PaymentMethodPage from './pages/dashboard/PaymentMethods/PaymentMethodPage';
import OrganizationRequestPage from './pages/dashboard/Organizations/OrganizationRequestPage';
import OrganizationPage from './pages/dashboard/Organizations/OrganizationPage';
import ProfilePage from './pages/dashboard/Profiles/ProfilePage';
import SettingPage from './pages/dashboard/Settings/SettingPage';
import Notification from './pages/dashboard/Notification/Notification';
import PromocodePage from './pages/dashboard/Promocodes/PromocodePage';


function App() {
  return (
    <Routes>
      <Route element={<AdminGuard />}>
        <Route element={<AdminLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="/notification" element={<Notification />} />
          <Route path='/preferences' element={<SettingPage />} />
          <Route path='/profile' element={<ProfilePage />} />
          <Route path='/dashboard' element={<DashboardPage />} />
          <Route path='/payment-methods' element={<PaymentMethodPage />} />
          <Route path='/organizations' element={<OrganizationPage />} />
          <Route path='/request-organizations' element={<OrganizationRequestPage />} />
          <Route path='/ticket-types' element={<TicketTypePage />} />
          <Route path='/categories' element={<CategoryPage />} />
          <Route path='/rights' index element={<RightPermissionPage />} />
          <Route path='/roles' index element={<RolesPermissionsPage />} />
          <Route path='/Event' index element={<Event />} />
          <Route path='/Customer' index element={<Customer />} />
          <Route path='/promocodes' element={<PromocodePage/>}/>
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
  );
}

export default App;
