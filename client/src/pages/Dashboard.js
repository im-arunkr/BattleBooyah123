import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
    LayoutDashboard, UserPlus, Gamepad2, ListOrdered, Wallet, Users, FileClock, LogOut, Loader2, Menu, ArrowLeft
} from "lucide-react";

// --- Components from your project ---
import CreateContest from "../components/CreateContest";
import CreateUser from "../components/CreateUser";
import ManageUsers from "../components/ManageUsers";
import ManageBalance from "../components/ManageBalance";
import ManageContest from "../components/ManageContest";
import TransactionLogs from "../components/TransactionLogs";

// --- A custom hook to check if the screen is mobile-sized ---
const useIsMobile = (breakpoint = 768) => {
    const [isMobile, setIsMobile] = useState(window.innerWidth < breakpoint);
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < breakpoint);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [breakpoint]);
    return isMobile;
};

// --- Sidebar Navigation Link Component (for Desktop) ---
const NavLink = ({ icon, label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors duration-200 text-sm ${
            active 
            ? 'bg-blue-600/20 text-white font-semibold' 
            : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'
        }`}
    >
        {icon}
        <span className="font-semibold">{label}</span>
    </button>
);

// --- Navigation Card Component (for Mobile) ---
const MobileNavLink = ({ icon, label, onClick, color }) => (
    <button
        onClick={onClick}
        className="bg-[#181825] p-3 rounded-lg border border-[#27272a] flex flex-col items-center justify-center text-center gap-2 transition-transform hover:-translate-y-1 shadow-lg"
    >
        <div className={`p-2 rounded-lg ${color}`}>{icon}</div>
        <span className="font-semibold text-xs text-white">{label}</span>
    </button>
);

// --- Stat Card Component ---
const StatCard = ({ title, value, icon, color }) => (
    <div className="bg-[#181825] p-4 rounded-lg border border-[#27272a] flex items-center gap-4 shadow-lg">
        <div className={`p-3 rounded-full ${color}`}>{icon}</div>
        <div>
            <p className="text-sm text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
        </div>
    </div>
);

// --- NEW: Compact Stat Card for Mobile ---
const MobileStatCard = ({ title, value, icon, color }) => (
    <div className="bg-[#181825] p-3 rounded-lg border border-[#27272a] text-center">
        <div className={`p-2 inline-block rounded-full ${color}`}>
            {icon}
        </div>
        <p className="text-xl font-bold text-white mt-2">{value}</p>
        <p className="text-xs text-gray-400">{title}</p>
    </div>
);


function Dashboard() {
    const [activeSection, setActiveSection] = useState("home");
    const [stats, setStats] = useState({ totalUsers: 0, liveContests: 0, totalEarnings: 0 });
    const [loading, setLoading] = useState(true);
    const isMobile = useIsMobile();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                const api = axios.create({ headers: { Authorization: `Bearer ${token}` } });
                // const { data } = await api.get('/api/admin/stats');
                // setStats(data);
                setTimeout(() => {
                    setStats({ totalUsers: 125, liveContests: 8, totalEarnings: '₹50k' });
                    setLoading(false);
                }, 1000);
            } catch (error) {
                console.error("Failed to fetch admin stats", error);
                setLoading(false);
            }
        };
        fetchStats();
    }, []);
    
    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.reload();
    };

    const handleNavClick = (sectionId) => {
        setActiveSection(sectionId);
        if (isMobile) {
            setIsSidebarOpen(false);
        }
    };

    const navItems = [
        { id: 'home', label: 'Dashboard', icon: <LayoutDashboard size={18} />, color: "bg-gray-500/20 text-gray-300" },
        { id: 'create-user', label: 'Create User', icon: <UserPlus size={18} />, color: "bg-yellow-500/20 text-yellow-300" },
        { id: 'create-contest', label: 'Create Contest', icon: <Gamepad2 size={18} />, color: "bg-green-500/20 text-green-300" },
        { id: 'manage-contest', label: 'Manage Contests', icon: <ListOrdered size={18} />, color: "bg-emerald-500/20 text-emerald-300" },
        { id: 'manage-users', label: 'Manage Users', icon: <Users size={18} />, color: "bg-indigo-500/20 text-indigo-300" },
        { id: 'manage-balance', label: 'Manage Balance', icon: <Wallet size={18} />, color: "bg-pink-500/20 text-pink-300" },
        { id: 'transaction-logs', label: 'Transactions', icon: <FileClock size={18} />, color: "bg-orange-500/20 text-orange-300" },
    ];

    const DashboardHome = () => {
        if (loading) {
            return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-blue-500" size={32}/></div>;
        }
        return (
            <div className="space-y-6">
                {/* UPDATED: Mobile view now uses a non-scrolling grid of compact cards */}
                {isMobile ? (
                     <div className="grid grid-cols-3 gap-3">
                        <MobileStatCard title="Total Users" value={stats.totalUsers} icon={<Users size={20} />} color="bg-blue-500/20 text-blue-300" />
                        <MobileStatCard title="Live Contests" value={stats.liveContests} icon={<Gamepad2 size={20} />} color="bg-green-500/20 text-green-300" />
                        <MobileStatCard title="Earnings" value={stats.totalEarnings} icon={<Wallet size={20} />} color="bg-yellow-500/20 text-yellow-300" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <StatCard title="Total Users" value={stats.totalUsers} icon={<Users size={22} />} color="bg-blue-500/20 text-blue-300" />
                        <StatCard title="Live Contests" value={stats.liveContests} icon={<Gamepad2 size={22} />} color="bg-green-500/20 text-green-300" />
                        <StatCard title="Total Earnings" value={stats.totalEarnings} icon={<Wallet size={22} />} color="bg-yellow-500/20 text-yellow-300" />
                    </div>
                )}
               
                {isMobile && (
                    <div>
                        <h3 className="text-xl font-bold text-gray-300 mb-4">Quick Actions</h3>
                        <div className="grid grid-cols-3 gap-3">
                            {navItems.filter(item => item.id !== 'home').map(item => (
                                <MobileNavLink
                                    key={item.id}
                                    icon={item.icon}
                                    label={item.label}
                                    color={item.color}
                                    onClick={() => setActiveSection(item.id)}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const renderMainContent = () => {
        switch (activeSection) {
            case "home": return <DashboardHome />;
            case "create-user": return <CreateUser />;
            case "create-contest": return <CreateContest />;
            case "manage-contest": return <ManageContest />;
            case "manage-balance": return <ManageBalance />;
            case "manage-users": return <ManageUsers />;
            case "transaction-logs": return <TransactionLogs />;
            default: return null;
        }
    };

    const SidebarContent = () => (
        <div className="flex flex-col h-full">
            <div>
                <h1 className="text-2xl font-bold text-center mb-8 text-white">
                    Battle<span className="text-blue-500">Booyah</span>
                    <p className="text-xs text-gray-500 mt-1">Admin Panel</p>
                </h1>
                <nav className="space-y-1.5">
                    {navItems.map(item => (
                        <NavLink 
                            key={item.id}
                            icon={item.icon}
                            label={item.label}
                            active={activeSection === item.id}
                            onClick={() => handleNavClick(item.id)}
                        />
                    ))}
                </nav>
            </div>
            <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg mt-auto text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
            >
                <LogOut size={18} />
                <span className="font-semibold text-sm">Logout</span>
            </button>
        </div>
    );

    return (
        <div className="min-h-screen text-white font-['Inter'] bg-[#0a0a0f]">
            <div className="md:flex">
                <aside className={`fixed top-0 left-0 w-64 bg-[#121218] p-4 border-r border-[#27272a] h-screen z-20 transform transition-transform md:hidden ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <SidebarContent />
                </aside>
                {isSidebarOpen && <div className="fixed inset-0 bg-black/60 z-10 md:hidden" onClick={() => setIsSidebarOpen(false)}></div>}

                <aside className="w-64 bg-[#121218] p-4 border-r border-[#27272a] h-screen sticky top-0 hidden md:flex md:flex-col">
                    <SidebarContent />
                </aside>
                
                <div className="flex-1 p-4 md:p-8">
                    <header className="mb-6 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            {activeSection !== 'home' ? (
                                <button className="text-gray-400 hover:text-white" onClick={() => setActiveSection('home')}>
                                    <ArrowLeft size={24} />
                                </button>
                            ) : (
                                <button className="md:hidden text-gray-400 hover:text-white" onClick={() => setIsSidebarOpen(true)}>
                                    <Menu size={24} />
                                </button>
                            )}
                            <h2 className="text-2xl md:text-3xl font-bold text-white capitalize">
                                {activeSection.replace('-', ' ')}
                            </h2>
                        </div>
                        <button onClick={handleLogout} className="flex items-center gap-2 p-2 rounded-lg bg-red-500/10 text-red-400 md:hidden">
                           <LogOut size={16} />
                        </button>
                    </header>
                    <main>
                        {renderMainContent()}
                    </main>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;

