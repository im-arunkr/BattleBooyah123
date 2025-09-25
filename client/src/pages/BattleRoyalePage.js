import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api"; // Correctly uses the api helper
import {
  Wallet,
  Loader2,
  Swords,
  Tag,
  Star,
  Users,
  MapPin,
  Clock,
} from "lucide-react";
import BottomNav from "../components/BottomNav";

// --- Ultra-Compact Contest Card component ---
const ContestCard = ({ contest }) => {
  const spotsLeft = contest.totalParticipants - contest.players.length;
  const isFull = spotsLeft <= 0;
  const percentFilled = Math.min(
    (contest.players.length / contest.totalParticipants) * 100,
    100,
  );

  return (
    <div className="w-full max-w-xl mx-auto rounded-xl overflow-hidden bg-[#1e2746] border border-gray-700/50 shadow-lg hover:scale-[1.02] transition-transform duration-300 flex flex-col">
      <div className="flex items-center gap-3 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-cyan-500">
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
      <Link
        to={`/contest/${contest._id}`}
        className={`w-full block text-center mt-auto font-bold py-0.5 text-sm transition-colors rounded-b-xl ${
          isFull
            ? "bg-gray-700 text-gray-500 cursor-not-allowed"
            : "bg-gradient-to-r from-green-500 to-teal-500 text-white hover:opacity-90"
        }`}
        onClick={(e) => isFull && e.preventDefault()}
      >
        {isFull ? "Full" : "View"}
      </Link>
    </div>
  );
};

const BattleRoyalePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMode, setSelectedMode] = useState("Solo");
  const [contests, setContests] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // --- THIS IS THE UPDATED PART ---
        // API calls now use the 'api' helper, which sets the base URL and token automatically.
        const [userResponse, contestsResponse] = await Promise.all([
          api.get("/api/users/me"),
          api.get("/api/contests/battle-royale"),
        ]);

        setUser(userResponse.data);
        setContests(contestsResponse.data);
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

  const filteredContests = contests.filter((c) => c.teamType === selectedMode);

  const customStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Teko:wght@700&family=Inter:wght@400;600;700&display=swap');
    :root { --bg-primary: #0a0a0f; --bg-secondary: #1e2746; --border-color: #27272a; }
    .font-display { font-family: 'Teko', sans-serif; }
    .font-sans { font-family: 'Inter', sans-serif; }
    .text-gradient-animated { background: linear-gradient(90deg, #ff3b3b, #3b82f6, #87ceeb, #ff3b3b); background-size: 300% auto; -webkit-background-clip: text; background-clip: text; color: transparent; animation: gradient-shine 4s linear infinite; }
    @keyframes gradient-shine { to { background-position: 300% center; } }
  `;

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "var(--bg-primary)" }}
      >
        <Loader2 className="animate-spin text-blue-500" size={48} />
      </div>
    );
  }

  return (
    <>
      <style>{customStyles}</style>
      <div
        className="min-h-screen bg-primary font-sans text-white pb-24"
        style={{ background: "var(--bg-primary)" }}
      >
        <header className="fixed top-0 left-0 w-full z-40 bg-primary/80 backdrop-blur-md border-b border-border-color">
          <div className="container mx-auto px-6 py-3 flex justify-between items-center">
            <Link
              to="/dashboard"
              className="text-3xl font-display font-bold tracking-wider text-white"
            >
              Battle<span className="text-gradient-animated">Booyah</span>
            </Link>
            <div className="flex items-center gap-2 bg-secondary border border-border-color px-3 py-1.5 rounded-lg">
              <Wallet className="text-blue-400" size={20} />
              <span className="font-bold text-white text-sm">
                ₹{user?.points?.toFixed(2) || "0.00"}
              </span>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-6 pt-28 pb-16">
          <div className="text-center">
            
            <div className="mt-12 flex justify-center items-center gap-4 sm:gap-6">
              {["Solo", "Duo", "Squad"].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setSelectedMode(mode)}
                  className={`px-5 py-1 sm:px-6 sm:py-2 rounded-full font-display text-lg sm:text-xl uppercase tracking-wider transition-all duration-300 hover:scale-105 focus:outline-none ${
                    selectedMode === mode
                      ? "bg-blue-600/20 text-white ring-2 ring-blue-500 shadow-lg"
                      : "bg-secondary text-gray-400"
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredContests.length > 0 ? (
                filteredContests.map((contest) => (
                  <ContestCard key={contest._id} contest={contest} />
                ))
              ) : (
                <div className="md:col-span-3 py-8 text-center text-gray-500">
                  <p>
                    No upcoming "{selectedMode}" tournaments found. Check back
                    soon!
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
        
        <BottomNav />
      </div>
    </>
  );
};

export default BattleRoyalePage;

