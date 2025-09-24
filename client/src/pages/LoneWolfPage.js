import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Wallet, Loader2, ListChecks, Gamepad2, LogOut, User, Trophy, ThumbsUp, Check } from 'lucide-react';
import BottomNav from '../components/BottomNav';

const LoneWolfPage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState(null);

    // --- Voting state ---
    const [voteCount, setVoteCount] = useState(0);
    const [hasVoted, setHasVoted] = useState(false);
    const [isVoting, setIsVoting] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("user_token");
            if (!token) {
                navigate("/login");
                return;
            }
            const api = axios.create({
                headers: { Authorization: `Bearer ${token}` },
            });
            try {
                const userResponse = await api.get("http://localhost:5000/api/users/me");
                setUser(userResponse.data);
                // Dummy vote count
                setVoteCount(87);
            } catch (error) {
                console.error("Failed to fetch user data", error);
                localStorage.removeItem("user_token");
                navigate("/login");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [navigate]);

    const handleVote = () => {
        if (hasVoted) return;
        setIsVoting(true);
        setTimeout(() => {
            setHasVoted(true);
            setVoteCount(prev => prev + 1);
            setIsVoting(false);
        }, 1000);
    };

    const handleLogout = () => {
        localStorage.removeItem("user_token");
        navigate("/login");
    };

    const customStyles = `
        @import url('https://fonts.googleapis.com/css2?family=Teko:wght@700&family=Inter:wght@400;600;700&display=swap');
        .font-display { font-family: 'Teko', sans-serif; }
        .font-sans { font-family: 'Inter', sans-serif; }
        .text-gradient-animated { background: linear-gradient(90deg, #ff3b3b, #3b82f6, #87ceeb, #ff3b3b); background-size: 300% auto; -webkit-background-clip: text; background-clip: text; color: transparent; animation: gradient-shine 4s linear infinite; }
        @keyframes gradient-shine { to { background-position: 300% center; } }
    `;

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f]"><Loader2 className="animate-spin text-blue-500" size={48} /></div>;
    }

    return (
        <>
            <style>{customStyles}</style>
            <div className="min-h-screen bg-[#0a0a0f] font-sans text-white pb-24">
                <header className="fixed top-0 left-0 w-full z-40 bg-[#0a0a0f]/80 backdrop-blur-md border-b border-[#27272a]">
                    <div className="container mx-auto px-6 py-3 flex justify-between items-center">
                        <Link to="/dashboard" className="text-3xl font-display font-bold tracking-wider text-white">
                            Battle<span className="text-gradient-animated">Booyah</span>
                        </Link>
                        <div className="flex items-center gap-2 bg-[#121218] border border-[#27272a] px-3 py-1.5 rounded-lg">
                            <Wallet className="text-blue-400" size={20} />
                            <span className="font-bold text-white text-sm">₹{user?.points?.toFixed(2) || '0.00'}</span>
                        </div>
                    </div>
                </header>

                <main className="flex flex-col items-center justify-center w-full h-[calc(100vh-64px)] px-6 text-center">

                    
                    <div className="mt-12 p-8 bg-[#121218] border border-[#27272a] rounded-xl max-w-2xl w-full shadow-lg">
                        <h2 className="text-2xl font-bold text-white">Want to play Lone Wolf contests?</h2>
                        <p className="text-gray-400 mt-2">Vote now to let us know you're interested! More votes = faster launch.</p>
                        
                        <div className="mt-6">
                            <button 
                                onClick={handleVote}
                                disabled={hasVoted || isVoting}
                                className={`w-full max-w-xs mx-auto flex items-center justify-center gap-3 font-bold py-3 px-6 rounded-lg text-lg transition-all duration-300
                                    ${hasVoted 
                                        ? 'bg-green-600 text-white cursor-not-allowed' 
                                        : 'bg-blue-600 text-white hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/30 disabled:opacity-50'}` 
                                }
                            >
                                {isVoting ? <Loader2 className="animate-spin" /> :
                                 hasVoted ? <><Check size={24}/> Voted!</> :
                                 <><ThumbsUp size={24}/> Vote for Lone Wolf</>
                                }
                            </button>
                        </div>
                        <p className="mt-4 text-gray-500 text-sm">Total Votes: <span className="font-bold text-white">{voteCount}</span></p>
                    </div>
                </main>
  {/* Bottom Navigation */}
                <BottomNav />
                
            </div>
        </>
    );
};

export default LoneWolfPage;
