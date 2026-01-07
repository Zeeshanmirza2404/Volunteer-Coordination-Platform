import React, { useEffect, lazy, Suspense } from "react";
import { Routes, Route, useNavigate } from 'react-router-dom';
import { setNavigate } from './api.js';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import PrivateRoute from './components/PrivateRoute.jsx';

// Lazy load route components for code splitting
const Home = lazy(() => import("./pages/Home.jsx"));
const Register = lazy(() => import("./pages/Register.jsx"));
const Login = lazy(() => import("./pages/Login.jsx"));
const Donations = lazy(() => import("./pages/Donations.jsx"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard.jsx"));
const VolunteerDashboard = lazy(() => import('./pages/VolunteerDashboard.jsx'));
const NGODashboard = lazy(() => import("./pages/NGODashboard.jsx"));
const VolunteerEvents = lazy(() => import("./pages/VolunteerEvents.jsx"));
const NGOForm = lazy(() => import("./pages/NGOForm.jsx"));
const Events = lazy(() => import('./pages/Events.jsx'));

// Loading fallback component
const LoadingFallback = () => (
  <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
);

function App() {
  const navigate = useNavigate();

  // Set navigate function for API layer on mount
  useEffect(() => {
    setNavigate(navigate);
  }, [navigate]);

  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col">
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/donate" element={<Donations />} />
              <Route
                path="/ngo/dashboard"
                element={
                  <PrivateRoute allowedRoles={['ngo']}>
                    <NGODashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin/dashboard"
                element={
                  <PrivateRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </PrivateRoute>
                }
              />  
              <Route
                path="/volunteer/dashboard"
                element={
                  <PrivateRoute allowedRoles={['volunteer']}>
                    <VolunteerDashboard />
                  </PrivateRoute>
                }
              />
              <Route path="/volunteer-events" element={<VolunteerEvents />} />
              <Route path="/events" element={<Events />} />
              <Route path="/ngo/:id" element={<NGOForm />} />
            </Routes>
          </Suspense>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default App;
