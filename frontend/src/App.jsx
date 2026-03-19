import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Login from './pages/Login';
import Register from './pages/Register';
import CustomerDashboard from './pages/CustomerDashboard';
import SellerDashboard from './pages/SellerDashboard';
import Background3D from './components/Background3D';
import Checkout from './pages/Checkout';
import PhonePeGateway from './pages/PhonePeGateway';

const PrivateRoute = ({ children, role }) => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('role');

    if (!token) return <Navigate to="/login" />;
    if (role && userRole !== role) return <Navigate to="/login" />; // Unauhtorized role jumps to login

    return children;
};

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/customer/*" element={
            <PrivateRoute role="customer">
                <Routes>
                    <Route path="dashboard" element={<CustomerDashboard />} />
                    <Route path="checkout/:pid" element={<Checkout />} />
                    <Route path="payment/phonepe" element={<PhonePeGateway />} />
                    <Route path="*" element={<Navigate to="dashboard" />} />
                </Routes>
            </PrivateRoute>
        } />
        
        <Route path="/seller/*" element={
            <PrivateRoute role="seller">
                <SellerDashboard />
            </PrivateRoute>
        } />

        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <Router>
      <Background3D />
      <div className="min-h-screen text-slate-900 font-sans selection:bg-blue-200 bg-transparent overflow-hidden">
        
        {/* Simple Global Header */}
        <header className="bg-white/70 backdrop-blur-md border-b border-white/20 sticky top-0 z-50 shadow-sm">
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
              <div className="flex items-center gap-2">
                 <div className="w-8 h-8 rounded-lg bg-blue-600 shadow-lg shadow-blue-500/30 flex items-center justify-center text-white font-bold text-xl">
                    Rx
                 </div>
                 <span className="font-semibold text-lg tracking-tight">PharmaCare</span>
              </div>
              <nav className="flex gap-4">
                 {/* Navigation injected via pages later */}
              </nav>
           </div>
        </header>

        {/* Main Content Area */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
          <AnimatedRoutes />
        </main>
      </div>
    </Router>
  );
}

export default App;
