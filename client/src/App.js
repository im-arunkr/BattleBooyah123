import React, { useState } from 'react';
import AdminLogin from './pages/AdminLogin';
import Dashboard from './pages/Dashboard';

function App() {
  // [FIX] Page load hone par check karein ki token localStorage me hai ya nahi.
  // !!localStorage.getItem('adminToken') ka matlab hai:
  // Agar token milta hai (string), to use true me badal do.
  // Agar token nahi milta (null), to use false me badal do.
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('adminToken'));

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  return (
    <div>
      {/* Ab yeh check page refresh hone ke baad bhi kaam karega */}
      {isLoggedIn ? (
        <Dashboard />
      ) : (
        <AdminLogin onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
}

export default App;

