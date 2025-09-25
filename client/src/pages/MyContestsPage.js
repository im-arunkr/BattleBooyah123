import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import { Wallet, Loader2 } from "lucide-react";
import BottomNav from "../components/BottomNav";
import RoomDetailsModal from "../components/RoomDetailsModal"; // IMPORTED
import MyContestCard from "../components/MyContestCard";     // IMPORTED

const MyContestsPage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [myContests, setMyContests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("Live");
    const [selectedContest, setSelectedContest] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [userResponse, contestsResponse] = await Promise.all([
                    api.get("/api/users/me"),
                    api.get("/api/contests/my-contests"),
                ]);
                setUser(userResponse.data);
                setMyContests(contestsResponse.data);
            } catch (error) {
                console.error("Failed to fetch data", error);
                localStorage.removeItem("user_token");
                navigate("/login");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [navigate]);

    const liveContests = [];
    const upcomingContests = [];
    const finishedContests = [];
    const now = new Date();

    myContests.forEach((contest) => {
        if (contest.leaderboard && contest.leaderboard.length > 0) {
            finishedContests.push(contest);
        } else {
            const startTime = new Date(contest.startTime);
            const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
            if (startTime > now) {
                upcomingContests.push(contest);
            } else if (startTime <= now && startTime > oneHourAgo) {
                liveContests.push(contest);
            } else {
                finishedContests.push(contest);
            }
        }
    });

    const contestsToDisplay =
        activeTab === "Live"
            ? liveContests
            : activeTab === "Upcoming"
            ? upcomingContests
            : finishedContests;

    const customStyles = `
        @import url('https://fonts.googleapis.com/css2?family=Teko:wght@700&family=Inter:wght@400;600;700&display=swap');
        .font-display { font-family: 'Teko', sans-serif; }
        .font-sans { font-family: 'Inter', sans-serif; }
        .text-gradient-animated { background: linear-gradient(90deg, #ff3b3b, #3b82f6, #87ceeb, #ff3b3b); background-size: 300% auto; -webkit-background-clip: text; background-clip: text; color: transparent; animation: gradient-shine 4s linear infinite; }
        @keyframes gradient-shine { to { background-position: 300% center; } }
    `;

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f]">
                <Loader2 className="animate-spin text-blue-500" size={48} />
            </div>
        );
    }

    return (
        <>
            {selectedContest && (
                <RoomDetailsModal
                    contest={selectedContest}
                    onClose={() => setSelectedContest(null)}
                />
            )}
            <style>{customStyles}</style>
            <div className="min-h-screen bg-[#0a0a0f] font-sans text-white pb-24">
                <header className="fixed top-0 left-0 w-full z-40 bg-[#0a0a0f]/80 backdrop-blur-md border-b border-[#27272a]">
                    <div className="container mx-auto px-6 py-3 flex justify-between items-center">
                        <Link
                            to="/dashboard"
                            className="text-3xl font-display font-bold tracking-wider text-white"
                        >
                            Battle<span className="text-gradient-animated">Booyah</span>
                        </Link>
                        <div className="flex items-center gap-2 bg-[#121218] border border-[#27272a] px-2 py-1 rounded-lg">
                            <Wallet className="text-blue-400" size={18} />
                            <span className="font-bold text-white text-sm">
                                ₹{user?.points?.toFixed(2) || "0.00"}
                            </span>
                        </div>
                    </div>
                </header>

                <main className="container mx-auto px-6 pt-24 pb-16">
                    <div className="mt-8 border-b border-[#27272a] flex justify-center">
                        <div className="flex items-center gap-4 md:gap-8">
                            {["Live", "Upcoming", "Finished"].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`font-display text-2xl md:text-3xl uppercase tracking-wider pb-3 transition-colors duration-300 ${activeTab === tab ? "text-blue-500 border-b-2 border-blue-500" : "text-gray-600 hover:text-white"}`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mt-8">
                        {contestsToDisplay.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {contestsToDisplay.map((contest) => (
                                    <MyContestCard
                                        key={contest._id}
                                        contest={contest}
                                        status={activeTab}
                                        onViewRoomDetails={() => setSelectedContest(contest)}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-10 bg-gray-800/20 rounded-xl">
                                <p className="text-gray-500">
                                    You have no {activeTab.toLowerCase()} contests.
                                </p>
                            </div>
                        )}
                    </div>
                </main>
                
                <BottomNav />
            </div>
        </>
    );
};

export default MyContestsPage;