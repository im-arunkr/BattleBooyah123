import React, { useState } from 'react';
// Icons import karein
import { ArrowLeft, UserPlus, Gamepad2, ListOrdered, Wallet, Users, FileClock, Send, LogOut } from 'lucide-react';

// Sections ke liye components import karein
import CreateContest from '../components/CreateContest';
import CreateUser from '../components/CreateUser';
import ManageUsers from '../components/ManageUsers';
import ManageBalance from '../components/ManageBalance';
import ManageLeaderboard from '../components/ManageLeaderboard';
import ManageContest from '../components/ManageContest';
import TransactionLogs from '../components/TransactionLogs';
import SendNotification from '../components/SendNotification';

// Card ke liye ek alag component
const DashboardCard = ({ title, description, icon, onClick, color }) => {
    return (
        <button 
            onClick={onClick}
            className="bg-[#121223] rounded-2xl p-6 text-left w-full h-full shadow-md 
                       border border-gray-700/40 transition-transform duration-300 
                       hover:-translate-y-2 hover:shadow-xl"
        >
            <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-md ${color}`}>
                    {icon}
                </div>
                <h3 className="text-lg font-semibold">{title}</h3>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">{description}</p>
        </button>
    );
};

function Dashboard() {
    const [activeSection, setActiveSection] = useState('home');

    // [NEW] Logout ke liye function
    const handleLogout = () => {
        // Token ko localStorage se remove karein
        localStorage.removeItem('adminToken');
        // Page ko reload karein taki user login page par redirect ho jaye
        window.location.reload();
    };

    const renderMainContent = () => {
        if (activeSection === 'home') {
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <DashboardCard 
                        title="Create User ID"
                        description="This section allows admin to create a new user with username and password."
                        icon={<UserPlus size={22} className="text-white" />}
                        onClick={() => setActiveSection('create-user')}
                        color="bg-gradient-to-r from-yellow-500 to-orange-500"
                    />
                    <DashboardCard 
                        title="Create Contest"
                        description="This section lets admin create a contest with name and entry fee."
                        icon={<Gamepad2 size={22} className="text-white" />}
                        onClick={() => setActiveSection('create-contest')}
                        color="bg-gradient-to-r from-green-400 to-teal-500"
                    />
                    <DashboardCard 
                        title="Manage Contest"
                        description="This section lets admin update contest with name and entry fee."
                        icon={<ListOrdered size={22} className="text-white" />}
                        onClick={() => setActiveSection('manage-contest')}
                        color="bg-gradient-to-r from-emerald-400 to-green-600"
                    />
                    <DashboardCard 
                        title="Manage Balance"
                        description="This section is used to add or remove balance from a user account."
                        icon={<Wallet size={22} className="text-white" />}
                        onClick={() => setActiveSection('manage-balance')}
                        color="bg-gradient-to-r from-pink-500 to-red-500"
                    />
                    <DashboardCard 
                        title="Manage Users"
                        description="Admin can view all users and take actions like banning users."
                        icon={<Users size={22} className="text-white" />}
                        onClick={() => setActiveSection('manage-users')}
                        color="bg-gradient-to-r from-indigo-400 to-purple-600"
                    />
                    <DashboardCard 
                        title="Transaction Logs"
                        description="View a detailed list of all transactions made by users."
                        icon={<FileClock size={22} className="text-white" />}
                        onClick={() => setActiveSection('transaction-logs')}
                        color="bg-gradient-to-r from-orange-400 to-yellow-600"
                    />
                    <DashboardCard 
                        title="Send Notification"
                        description="Send broadcast messages or alerts to all users."
                        icon={<Send size={22} className="text-white" />}
                        onClick={() => setActiveSection('send-notification')}
                        color="bg-gradient-to-r from-pink-400 to-purple-500"
                    />
                </div>
            );
        }

        switch (activeSection) {
            case 'create-user': return <CreateUser />;
            case 'create-contest': return <CreateContest />;
            case 'manage-contest': return <ManageContest />;
            case 'manage-balance': return <ManageBalance />;
            case 'manage-users': return <ManageUsers />;
            case 'transaction-logs': return <TransactionLogs />;
            case 'send-notification': return <SendNotification />;
            case 'manage-leaderboard': return <ManageLeaderboard />;
            default: return null;
        }
    };

    return (
        <div 
            className="min-h-screen text-white font-['Poppins'] p-6"
            style={{ background: 'linear-gradient(180deg, #1a1440, #0b0820)' }}
        >
            <div className="max-w-7xl mx-auto">
                <header className="mb-10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {activeSection !== 'home' && (
                            <button 
                                onClick={() => setActiveSection('home')} 
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <ArrowLeft size={24} />
                            </button>
                        )}
                        <h1 className="text-3xl font-extrabold">
                            <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                                Admin Dashboard
                            </span>
                            <span className="text-gray-300"> — Battle Arena</span>
                        </h1>
                    </div>
                    {/* [NEW] Logout Button */}
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 rounded-lg bg-red-500/20 px-4 py-2 text-sm font-semibold text-red-400 transition-colors hover:bg-red-500/30 hover:text-red-300"
                    >
                        <LogOut size={16} />
                        <span>Logout</span>
                    </button>
                </header>

                <main>
                    {renderMainContent()}
                </main>
            </div>
        </div>
    );
}

export default Dashboard;

