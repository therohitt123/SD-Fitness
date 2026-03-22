import { Suspense, lazy, useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ScrollProgress from './components/layout/ScrollProgress';
import Loader from './components/ui/Loader';
import ProtectedRoute from './components/layout/ProtectedRoute';
import ROLES from './constants/roles';

const HomePage = lazy(() => import('./pages/HomePage'));
const AdminLoginPage = lazy(() => import('./pages/AdminLoginPage'));
const TrainerLoginPage = lazy(() => import('./pages/TrainerLoginPage'));
const TrainerProfilePage = lazy(() => import('./pages/TrainerProfilePage'));
const SignupPage = lazy(() => import('./pages/SignupPage'));
const MemberLoginPage = lazy(() => import('./pages/MemberLoginPage'));
const AdminDashboardLayout = lazy(() => import('./pages/admin/AdminDashboardLayout'));
const AdminOverviewPage = lazy(() => import('./pages/admin/AdminOverviewPage'));
const SliderManagerPage = lazy(() => import('./pages/admin/SliderManagerPage'));
const TrainerManagerPage = lazy(() => import('./pages/admin/TrainerManagerPage'));
const GalleryManagerPage = lazy(() => import('./pages/admin/GalleryManagerPage'));
const ShopManagerPage = lazy(() => import('./pages/admin/ShopManagerPage'));
const PlanManagerPage = lazy(() => import('./pages/admin/PlanManagerPage'));
const UpdatesManagerPage = lazy(() => import('./pages/admin/UpdatesManagerPage'));
const ContactManagerPage = lazy(() => import('./pages/admin/ContactManagerPage'));
const GymInfoManagerPage = lazy(() => import('./pages/admin/GymInfoManagerPage'));
const EnquiriesManagerPage = lazy(() => import('./pages/admin/EnquiriesManagerPage'));
const MembersManagerPage = lazy(() => import('./pages/admin/MembersManagerPage'));
const AdminAccountPage = lazy(() => import('./pages/admin/AdminAccountPage'));
const TrainerDashboardLayout = lazy(() => import('./pages/trainer/TrainerDashboardLayout'));

export default function App() {
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const fullScreenLoader = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950">
      <Loader />
    </div>
  );

  const hideFooter =
    location.pathname.startsWith('/admin') || location.pathname.startsWith('/trainers/');

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return fullScreenLoader;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-50">
      <ScrollProgress />
      <Navbar />
      <main className="">
        <Suspense
          fallback={fullScreenLoader}
        >
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<MemberLoginPage />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/trainer/login" element={<TrainerLoginPage />} />
            <Route path="/register" element={<SignupPage />} />
            <Route path="/trainers/:id" element={<TrainerProfilePage />} />
            <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} redirectTo="/admin/login" />}>
              <Route path="/admin" element={<AdminDashboardLayout />}>
                <Route index element={<AdminOverviewPage />} />
                <Route path="slider" element={<SliderManagerPage />} />
                <Route path="trainers" element={<TrainerManagerPage />} />
                <Route path="gallery" element={<GalleryManagerPage />} />
                <Route path="shop" element={<ShopManagerPage />} />
                <Route path="plans" element={<PlanManagerPage />} />
                <Route path="updates" element={<UpdatesManagerPage />} />
                <Route path="contacts" element={<ContactManagerPage />} />
                <Route path="gym-info" element={<GymInfoManagerPage />} />
                <Route path="enquiries" element={<EnquiriesManagerPage />} />
                <Route path="members" element={<MembersManagerPage />} />
                <Route path="account" element={<AdminAccountPage />} />
              </Route>
            </Route>
            <Route element={<ProtectedRoute allowedRoles={[ROLES.TRAINER]} redirectTo="/trainer/login" />}>
              <Route path="/trainer" element={<TrainerDashboardLayout />} />
            </Route>
          </Routes>
        </Suspense>
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
}
