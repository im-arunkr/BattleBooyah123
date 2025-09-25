import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api"; // UPDATED: Now imports our smart api helper
import {
    Wallet,
    Loader2,
    ListChecks,
    Gamepad2,
    LogOut,
    User,
    Trophy,
    AlertTriangle,
    Info,
    Tag,
    Star,
    Swords,
    Users,
    Clock,
    MapPin,
    Home
} from "lucide-react";
import BottomNav from "../components/BottomNav";

// --- Room Details Modal ---
const RoomDetailsModal = ({ contest, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 text-center max-w-sm w-full relative shadow-lg shadow-blue-500/10">
                <h2 className="text-3xl font-display bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
                    Room Details
                </h2>
                <div className="my-5 space-y-3">
                    <div>
                        <p className="text-sm text-gray-400">Room ID</p>
                        <p className="text-2xl font-bold text-white tracking-widest bg-black/40 p-2 rounded-md mt-1">
                            {contest.roomDetails?.roomId || "TBA"}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-400">Password</p>
                        <p className="text-2xl font-bold text-white tracking-widest bg-black/40 p-2 rounded-md mt-1">
                            {contest.roomDetails?.password || "TBA"}
                        </p>
                    </div>
                </div>
                <div className="text-left text-sm space-y-3 bg-slate-800 border border-slate-600 p-3 rounded-lg text-slate-300">
                    <p className="flex items-start gap-2">
                        <AlertTriangle size={24} className="text-sky-400 shrink-0" />
                        <span>
                            You have **10 minutes** from the start time to join the custom
                            room in the game.
                        </span>
                    </p>
                    <p className="flex items-start gap-2">
                        <Info size={24} className="text-sky-400 shrink-0" />
                        <span>
                            Please stay in your assigned slot. Changing slots can result in
                            being kicked from the room.
                        </span>
                    </p>
                </div>
                <button
                    onClick={onClose}
                    className="mt-6 w-full p-3 rounded-lg font-bold bg-blue-600 hover:bg-blue-500 transition shadow-md shadow-blue-600/20"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

// --- My Contest Card ---
const MyContestCard = ({ contest, status, onViewRoomDetails }) => {
    const percentFilled = Math.min(
        (contest.players.length / contest.totalParticipants) * 100,
        100,
    );

    const getButton = () => {
        switch (status) {
            case "Live":
                return (
                    <button
                        onClick={onViewRoomDetails}
                        className="w-full text-center mt-auto font-bold py-1.5 text-xs bg-gradient-to-r from-green-500 to-teal-500 text-white hover:opacity-90 transition rounded-b-xl"
                    >
                        View Room Details
                    </button>
                );
            case "Upcoming":
                return (
                    <Link
                        to={`/contest/${contest._id}`}
                        className="block w-full text-center mt-auto font-bold py-1.5 text-xs bg-gray-700 text-gray-400 transition hover:bg-gray-600 rounded-b-xl"
                    >
                        View Details
                    </Link>
                );
            case "Finished":
                return (
                    <Link
                        to={`/contest/${contest._id}/leaderboard`}
                        className="block w-full text-center mt-auto font-bold py-1.5 text-xs bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:opacity-90 transition rounded-b-xl"
                    >
                        View Leaderboard
                    </Link>
                );
            default:
                return null;
        }
    };

    return (
        <div className="w-full max-w-xl mx-auto rounded-xl overflow-hidden bg-[#1e2746] border border-gray-700/50 shadow-lg hover:scale-[1.02] transition-transform duration-300 flex flex-col h-full">
            <div className="flex items-center gap-3 px-3 py-2 bg-gradient-to-r from-blue-600 to-cyan-500">
                <img
                    src={
                        contest.gameIconUrl ||
                        "https://upload.wikimedia.org/wikipedia/en/e/e7/Free_Fire_game_icon.png"
                    }
                    alt="game icon"
                    className="w-6 h-6 rounded-md"
                />
                <div className="text-base font-bold text-white truncate">
                    ⚔️ {contest.gameTitle || contest.title}
                </div>
            </div>
            <div className="grid grid-cols-3 gap-2 p-2 border-b border-gray-700/50">
                <div className="bg-slate-800/50 rounded-md p-1 text-center shadow">
                    <p className="flex items-center justify-center gap-1 text-[10px] text-gray-400">
                        <Tag size={12} /> Entry
                    </p>
                    <p className="text-xs font-bold text-white mt-0.5">
                        {contest.entryFee} PTS
                    </p>
                </div>
                <div className="bg-slate-800/50 rounded-md p-1 text-center shadow">
                    <p className="flex items-center justify-center gap-1 text-[10px] text-gray-400">
                        <Star size={12} /> Prize
                    </p>
                    <p className="text-xs font-bold text-yellow-400 mt-0.5">
                        ₹{contest.totalPrize || contest.prizePool}
                    </p>
                </div>
                <div className="bg-slate-800/50 rounded-md p-1 text-center shadow">
                    <p className="flex items-center justify-center gap-1 text-[10px] text-gray-400">
                        <Swords size={12} /> Per Kill
                    </p>
                    <p className="text-xs font-bold text-white mt-0.5">
                        ₹{contest.perKillReward || 0}
                    </p>
                </div>
            </div>
            <div className="px-2 pt-2 flex-grow">
                <div className="h-1.5 rounded bg-gray-700 overflow-hidden">
                    <div
                        className="h-full bg-green-500"
                        style={{ width: `${percentFilled}%` }}
                    ></div>
                </div>
                <p className="text-[10px] text-right text-gray-400">
                    Filled {contest.players.length}/{contest.totalParticipants}
                </p>
            </div>
            <div className="grid grid-cols-3 gap-2 p-2">
                <div className="text-center">
                    <p className="flex items-center justify-center gap-1 text-[10px] text-gray-400">
                        <Clock size={12} /> Start
                    </p>
                    <p className="text-[11px] font-semibold text-white">
                        {new Date(contest.startTime).toLocaleTimeString("en-IN", {
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </p>
                </div>
                <div className="text-center">
                    <p className="flex items-center justify-center gap-1 text-[10px] text-gray-400">
                        <Users size={12} /> Players
                    </p>
                    <p className="text-[11px] font-semibold text-white">
                        {contest.totalParticipants}
                    </p>
                </div>
                <div className="text-center">
                    <p className="flex items-center justify-center gap-1 text-[10px] text-gray-400">
                        <MapPin size={12} /> Map
                    </p>
                    <p className="text-[11px] font-semibold text-white truncate">
                        {contest.map}
                    </p>
                </div>
            </div>
            {getButton()}
        </div>
    );
};

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
                // UPDATED: API calls now use the 'api' helper
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
                
                {/* Your bottom nav component would go here, or the full nav code */}
                   <BottomNav />
            </div>
        </>
    );
};

export default MyContestsPage;
