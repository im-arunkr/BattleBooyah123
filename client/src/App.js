import React, { useState } from 'react';
import AdminLogin from './pages/AdminLogin';
import Dashboard from './pages/Dashboard';

function App() {
  // [FIX] Ab page load hone par sahi naam 'token' se check kiya jayega.
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  return (
    <div>
      {/* Ab yeh check page refresh hone ke baad bhi sahi se kaam karega */}
      {isLoggedIn ? (
        <Dashboard />
      ) : (
        <AdminLogin onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
}

export default App;

