import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// --- Page Imports ---
import LandingPage from './pages/LandingPage';
import UserLoginPage from './pages/UserLoginPage';
import UserDashboard from './pages/UserDashboard';
import UserAccountPage from './pages/UserAccountPage';
import BattleRoyalePage from './pages/BattleRoyalePage';
import ContestDetailPage from './pages/ContestDetailPage';
import MyContestsPage from './pages/MyContestsPage';
import LeaderboardPage from './pages/LeaderboardPage';
import ClashSquadPage from './pages/ClashSquadPage';
import LoneWolfPage from './pages/LoneWolfPage';


// --- Admin Page Imports ---
import AdminLogin from './pages/AdminLogin';
import AdminForgotPassword from './pages/AdminForgotPassword';
import AdminResetPassword from './pages/AdminResetPassword';
import Dashboard from './pages/Dashboard'; // This is your Admin Dashboard

// --- Helper component to protect user routes ---
const UserProtectedRoute = ({ children }) => {
    const isUserLoggedIn = !!localStorage.getItem('user_token');
    if (!isUserLoggedIn) {
        return <Navigate to="/login" />;
    }
    return children;
};

function App() {
    // State for admin login
    const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(!!localStorage.getItem('token'));

    const handleAdminLoginSuccess = () => {
        setIsAdminLoggedIn(true);
    };

    const handleAdminLogout = () => {
        localStorage.removeItem('token');
        setIsAdminLoggedIn(false);
    };

    return (
        <Router>
            <Routes>

                {/* ===== Public & User Routes ===== */}

                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<UserLoginPage />} />

                <Route
                    path="/dashboard"
                    element={
                        <UserProtectedRoute>
                            <UserDashboard />
                        </UserProtectedRoute>
                    }
                />
                <Route
                    path="/account"
                    element={
                        <UserProtectedRoute>
                            <UserAccountPage />
                        </UserProtectedRoute>
                    }
                />
                <Route
                    path="/games/battle-royale"
                    element={
                        <UserProtectedRoute>
                            <BattleRoyalePage />
                        </UserProtectedRoute>
                    }
                />
                <Route
                    path="/games/clash-squad"
                    element={
                        <UserProtectedRoute>
                            <ClashSquadPage />
                        </UserProtectedRoute>
                    }
                />
                <Route 
                    path="/games/lone-wolf" 
                    element={
                        <UserProtectedRoute>
                            <LoneWolfPage />
                        </UserProtectedRoute>
                    } 
                />
                <Route
                    path="/contest/:id"
                    element={
                        <UserProtectedRoute>
                            <ContestDetailPage />
                        </UserProtectedRoute>
                    }
                />
                <Route
                    path="/my-contests"
                    element={
                        <UserProtectedRoute>
                            <MyContestsPage />
                        </UserProtectedRoute>
                    }
                />
                <Route
                    path="/contest/:id/leaderboard"
                    element={
                        <UserProtectedRoute>
                            <LeaderboardPage />
                        </UserProtectedRoute>
                    }
                />

                {/* ===== Admin Routes ===== */}

                <Route
                    path="/admin/login"
                    element={
                        isAdminLoggedIn ? (
                            <Navigate to="/admin/dashboard" />
                        ) : (
                            <AdminLogin onLoginSuccess={handleAdminLoginSuccess} />
                        )
                    }
                />
                <Route
                    path="/admin/forgot-password"
                    element={<AdminForgotPassword />}
                />
                <Route
                    path="/admin/reset-password/:token"
                    element={<AdminResetPassword />}
                />
                <Route
                    path="/admin/dashboard"
                    element={
                        isAdminLoggedIn ? (
                            <Dashboard onLogout={handleAdminLogout} />
                        ) : (
                            <Navigate to="/admin/login" />
                        )
                    }
                />

                {/* Fallback route */}
                <Route path="*" element={<Navigate to="/" />} />

            </Routes>
        </Router>
    );
}

export default App;

