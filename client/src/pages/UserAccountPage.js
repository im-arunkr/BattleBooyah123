import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api"; // UPDATED: Now imports our smart api helper
import {
  User, Lock, Wallet, LogOut, Loader2, ArrowLeft, CreditCard, CheckCircle2, AlertCircle
} from "lucide-react";

const UserAccountPage = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");

  // State for password change form
  const [passwordData, setPasswordData] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [passwordMessage, setPasswordMessage] = useState({ type: "", text: "" });
  const [passwordLoading, setPasswordLoading] = useState(false);

  // State for transactions
  const [transactions, setTransactions] = useState([]);
  const [transactionsLoading, setTransactionsLoading] = useState(false);

  // Fetch initial user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // UPDATED: API call now uses the 'api' helper
        const response = await api.get("/api/users/me");
        setUser(response.data);
      } catch (error) {
        console.error("Failed to fetch user data", error);
        localStorage.removeItem("user_token");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [navigate]);

  // Fetch transactions only when the transactions tab is active
  useEffect(() => {
    const fetchTransactions = async () => {
      if (activeTab === 'transactions' && transactions.length === 0) {
        setTransactionsLoading(true);
        try {
          // UPDATED: API call now uses the 'api' helper
          const response = await api.get("/api/users/my-transactions");
          setTransactions(response.data);
        } catch (error) {
          console.error("Failed to fetch transactions", error);
        } finally {
          setTransactionsLoading(false);
        }
      }
    };
    fetchTransactions();
  }, [activeTab]);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordMessage({ type: "", text: "" });

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMessage({ type: "error", text: "New passwords do not match." });
      setPasswordLoading(false);
      return;
    }
    try {
      // UPDATED: API call now uses the 'api' helper
      const response = await api.post("/api/users/change-password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setPasswordMessage({ type: "success", text: response.data.message });
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      setPasswordMessage({ type: "error", text: error.response?.data?.message || "An error occurred." });
    } finally {
        setPasswordLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user_token");
    navigate("/");
  };
  
  const customStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Teko:wght@400;700&family=Inter:wght@400;600;700&display=swap');
    :root { --color-red: #ff3b3b; --color-blue: #3b82f6; --bg-primary: #0a0a0f; --bg-secondary: #121218; --border-color: #27272a; }
    .font-display { font-family: 'Teko', sans-serif; }
    .font-sans { font-family: 'Inter', sans-serif; }
    .text-gradient-animated { background: linear-gradient(90deg, var(--color-red), var(--color-blue), #87ceeb, var(--color-red)); background-size: 300% auto; -webkit-background-clip: text; background-clip: text; color: transparent; animation: gradient-shine 4s linear infinite; }
    @keyframes gradient-shine { to { background-position: 300% center; } }
    .input-field { background-color: var(--bg-primary); border: 1px solid var(--border-color); color: #d1d5db; border-radius: 0.375rem; padding: 0.75rem 1rem; width: 100%; }
    .input-field:focus { outline: none; border-color: var(--color-blue); }
  `;

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f]"><Loader2 className="animate-spin text-blue-500" size={48} /></div>;
  }

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <div className="animate-fade-in">
            <h2 className="text-3xl font-display text-white mb-6">Profile Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-400">UserID</label>
                <p className="text-lg p-3 bg-[#0a0a0f] rounded-md border border-[#27272a] mt-1">{user?.userId}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-400">Registered Mobile Number</label>
                <p className="text-lg p-3 bg-[#0a0a0f] rounded-md border border-[#27272a] mt-1">{user?.mobileNumber}</p>
              </div>
            </div>
          </div>
        );
      case "password":
        return (
          <div className="animate-fade-in">
            <h2 className="text-3xl font-display text-white mb-6">Change Password</h2>
            <form onSubmit={handlePasswordChange} className="space-y-4 max-w-sm">
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">Current Password</label>
                <input type="password" value={passwordData.currentPassword} onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })} className="input-field" required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">New Password</label>
                <input type="password" value={passwordData.newPassword} onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} className="input-field" required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">Confirm New Password</label>
                <input type="password" value={passwordData.confirmPassword} onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })} className="input-field" required />
              </div>
              {passwordMessage.text && (
                <div className={`p-3 rounded-md flex items-center gap-3 text-sm ${passwordMessage.type === "success" ? 'bg-green-500/10 text-green-300' : 'bg-red-500/10 text-red-300'}`}>
                  {passwordMessage.type === 'success' ? <CheckCircle2 size={20}/> : <AlertCircle size={20}/>}
                  {passwordMessage.text}
                </div>
              )}
              <button type="submit" disabled={passwordLoading} className="w-full font-bold py-3 px-4 rounded-lg text-white bg-blue-600 hover:bg-blue-500 transition disabled:opacity-50">
                {passwordLoading ? <Loader2 className="animate-spin mx-auto" size={20}/> : "Update Password"}
              </button>
            </form>
          </div>
        );
      case "transactions":
        return (
          <div className="animate-fade-in">
            <h2 className="text-3xl font-display text-white mb-6">My Transactions</h2>
            {transactionsLoading ? (
              <div className="flex justify-center items-center h-40"><Loader2 className="animate-spin text-blue-500" /></div>
            ) : transactions.length > 0 ? (
              <div className="max-h-[50vh] overflow-y-auto">
                <table className="w-full text-left text-sm">
                  <thead className="sticky top-0 bg-[#121218]">
                    <tr>
                      <th className="p-2 text-gray-400">Date</th>
                      <th className="p-2 text-gray-400">Description</th>
                      <th className="p-2 text-gray-400 text-right">Amount</th>
                      <th className="p-2 text-gray-400 text-right">Balance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#27272a]">
                    {transactions.map(tx => (
                      <tr key={tx._id}>
                        <td className="p-2 text-gray-400">{new Date(tx.createdAt).toLocaleDateString()}</td>
                        <td className="p-2">{tx.description}</td>
                        <td className={`p-2 text-right font-semibold ${tx.type === 'credit' ? 'text-green-400' : 'text-red-400'}`}>
                          {tx.type === 'credit' ? '+' : '-'} ₹{tx.amount.toFixed(2)}
                        </td>
                        <td className="p-2 text-right">₹{tx.closingBalance.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : <p className="text-gray-500 text-center py-8">No transactions found.</p>}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <style>{customStyles}</style>
      <div className="min-h-screen bg-[#0a0a0f] font-sans text-white">
        <header className="bg-[#121218] border-b border-[#27272a] sticky top-0 z-50">
          <div className="container mx-auto px-6 py-3 flex justify-between items-center">
            <Link to="/dashboard" className="text-3xl font-display font-bold tracking-wider">
              Battle<span className="text-gradient-animated">Booyah</span>
            </Link>
            <div className="flex items-center gap-2 bg-[#0a0a0f] border border-[#27272a] px-3 py-1.5 rounded-lg">
                <Wallet className="text-blue-400" size={20}/>
                <span className="font-bold text-lg">₹{user?.points?.toFixed(2) || '0.00'}</span>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-6 py-8">
            <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 mb-6">
                <ArrowLeft size={16}/> Back to Dashboard
            </Link>
            <div className="bg-[#121218] border border-[#27272a] rounded-lg p-4 md:p-6">
                <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                    {/* --- TABS --- */}
                    <div className="flex md:flex-col gap-2 md:w-1/4">
                         <button onClick={() => setActiveTab("profile")} className={`w-full text-left p-3 rounded-md flex items-center gap-3 transition ${activeTab === "profile" ? "bg-blue-500/20 text-white font-semibold" : "text-gray-400 hover:bg-gray-800"}`}>
                            <User size={20} /> <span className="hidden md:inline">Profile</span>
                        </button>
                        <button onClick={() => setActiveTab("password")} className={`w-full text-left p-3 rounded-md flex items-center gap-3 transition ${activeTab === "password" ? "bg-blue-500/20 text-white font-semibold" : "text-gray-400 hover:bg-gray-800"}`}>
                            <Lock size={20} /> <span className="hidden md:inline">Password</span>
                        </button>
                        <button onClick={() => setActiveTab("transactions")} className={`w-full text-left p-3 rounded-md flex items-center gap-3 transition ${activeTab === "transactions" ? "bg-blue-500/20 text-white font-semibold" : "text-gray-400 hover:bg-gray-800"}`}>
                            <CreditCard size={20} /> <span className="hidden md:inline">Transactions</span>
                        </button>
                        <button onClick={handleLogout} className={`w-full text-left p-3 rounded-md flex items-center gap-3 transition text-red-500 hover:bg-red-500/10 md:mt-auto`}>
                            <LogOut size={20} /> <span className="hidden md:inline">Logout</span>
                        </button>
                    </div>
                    {/* --- CONTENT --- */}
                    <div className="flex-1 p-4 md:p-6 bg-[#0a0a0f] rounded-md">
                        {renderContent()}
                    </div>
                </div>
            </div>
        </main>
      </div>
    </>
  );
};

export default UserAccountPage;

