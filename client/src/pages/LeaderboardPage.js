import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  Loader2,
  ArrowLeft,
  Crown,
  Trophy,
  Wallet,
  Sword,
  IndianRupee,
} from "lucide-react";
import { motion } from "framer-motion";
import BottomNav from "../components/BottomNav";

const LeaderboardPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [leaderboardData, setLeaderboardData] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("user_token");
      if (!token) {
        navigate("/login");
        return;
      }
      try {
        const api = axios.create({
          headers: { Authorization: `Bearer ${token}` },
        });
        const [leaderboardResponse, userResponse] = await Promise.all([
          api.get(`http://localhost:5000/api/contests/${id}/leaderboard`),
          api.get("http://localhost:5000/api/users/me"),
        ]);

        setLeaderboardData(leaderboardResponse.data);
        setUser(userResponse.data);
      } catch (err) {
        setError(
          err.response?.data?.message || "Leaderboard not published yet.",
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f]">
        <Loader2 className="animate-spin text-blue-400" size={36} />
      </div>
    );
  }

  if (
    error ||
    !leaderboardData ||
    !leaderboardData.results ||
    leaderboardData.results.length === 0
  ) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white bg-[#0a0a0f] p-4 font-sans">
        <Trophy size={44} className="text-slate-600" />
        <h1 className="text-2xl font-extrabold text-blue-400 mt-3">
          Results Not Available
        </h1>
        <p className="text-sm text-gray-400 mt-1 text-center">{error}</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-5 py-2 bg-blue-600 text-sm font-semibold rounded-lg hover:bg-blue-500 transition inline-flex items-center gap-2"
        >
          <ArrowLeft size={16} /> Go Back
        </button>
        <div className="fixed bottom-0 left-0 w-full">
          <BottomNav />
        </div>
      </div>
    );
  }

  const customStyles = `
        @import url('https://fonts.googleapis.com/css2?family=Teko:wght@500;700&family=Inter:wght@400;600;700&display=swap');
        .font-display { font-family: 'Teko', sans-serif; }
        .font-sans { font-family: 'Inter', sans-serif; }
        .text-gradient-animated { background: linear-gradient(90deg, #ff3b3b, #3b82f6, #87ceeb, #ff3b3b); background-size: 300% auto; -webkit-background-clip: text; background-clip: text; color: transparent; animation: gradient-shine 4s linear infinite; }
        @keyframes gradient-shine { to { background-position: 300% center; } }
        .shadow-gold { box-shadow: 0 0 25px rgba(251, 191, 36, 0.4); }
        .shadow-silver { box-shadow: 0 0 20px rgba(209, 213, 219, 0.3); }
        .shadow-bronze { box-shadow: 0 0 15px rgba(205, 127, 50, 0.4); }
    `;

  const sortedResults = leaderboardData.results.sort((a, b) => a.rank - b.rank);
  const top3 = sortedResults.slice(0, 3);
  const others = sortedResults.slice(3);

  return (
    <>
      <style>{customStyles}</style>
      <div className="min-h-screen bg-[#0a0a0f] text-white pb-20 relative font-sans">
        <header className="fixed top-0 left-0 w-full z-40 bg-[#0a0a0f]/80 backdrop-blur-md border-b border-[#27272a]">
          <div className="container mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
            <Link
              to="/dashboard"
              className="text-3xl font-display font-bold tracking-wider text-white"
            >
              Battle<span className="text-gradient-animated">Booyah</span>
            </Link>
            <div className="flex items-center gap-2 bg-[#121218] border border-[#27272a] px-3 py-1.5 rounded-lg">
              <Wallet className="text-blue-400" size={20} />
              <span className="font-bold text-white text-sm">
                ₹{user?.points?.toFixed(2) || "0.00"}
              </span>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-3 pt-24 pb-10">
          {/* Top 3 Podium - Directly on the page body */}
          <div className="flex justify-center items-end gap-2 sm:gap-3 mb-8">
            {top3.find((p) => p.rank === 2) && (
              <PodiumCard player={top3.find((p) => p.rank === 2)} rank={2} />
            )}
            {top3.find((p) => p.rank === 1) && (
              <PodiumCard player={top3.find((p) => p.rank === 1)} rank={1} />
            )}
            {top3.find((p) => p.rank === 3) && (
              <PodiumCard player={top3.find((p) => p.rank === 3)} rank={3} />
            )}
          </div>

          {/* Rest of Leaderboard - Directly on the page body */}
          {others.length > 0 && (
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-12 gap-3 mb-3 px-2 text-sm text-gray-400 font-bold uppercase tracking-wider">
                <div className="col-span-3 text-left">Rank</div>
                <div className="col-span-3 text-left">Player</div>
                <div className="col-span-3 text-center">Kills</div>
                <div className="col-span-3 text-right">Prize</div>
              </div>
              <div className="space-y-1.5">
                {others.map((player, idx) => {
                  const isCurrentUser = player.userId === user?._id;
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className={`grid grid-cols-12 gap-3 items-center p-2 rounded-lg transition-all duration-300 ${
                        isCurrentUser
                          ? "bg-blue-500/20 ring-2 ring-blue-400"
                          : "bg-slate-800/40 odd:bg-slate-800/20 hover:bg-slate-700/50"
                      }`}
                    >
                      <div className="col-span-3 flex items-center justify-start font-bold text-base text-gray-200">
                        #{player.rank}
                      </div>
                      <div
                        className="col-span-3 font-semibold truncate text-white text-sm"
                        title={player.gameUsername}
                      >
                        {isCurrentUser && (
                          <span className="text-blue-400 font-bold mr-1">
                            (You)
                          </span>
                        )}
                        {player.gameUsername || "-"}
                      </div>
                      <div className="col-span-3 flex items-center justify-center gap-1.5 text-red-400 font-semibold text-sm">
                        <Sword size={14} />
                        <span>{player.kills}</span>
                      </div>
                      <div className="col-span-3 flex items-center justify-end gap-1 text-green-400 font-bold text-sm">
                        <IndianRupee size={14} />
                        <span>{player.prize}</span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}
        </main>
        <BottomNav />
      </div>
    </>
  );
};

// Helper component for Podium cards
const PodiumCard = ({ player, rank }) => {
  const rankStyles = {
    1: {
      height: "h-40",
      scale: "scale-105",
      crownColor: "text-yellow-400",
      borderColor: "border-yellow-400",
      shadow: "shadow-gold",
      bg: "bg-gradient-to-b from-yellow-500/20 to-transparent",
    },
    2: {
      height: "h-36",
      scale: "",
      crownColor: "text-gray-300",
      borderColor: "border-gray-400",
      shadow: "shadow-silver",
      bg: "bg-gradient-to-b from-gray-400/20 to-transparent",
    },
    3: {
      height: "h-28",
      scale: "",
      crownColor: "text-orange-400",
      borderColor: "border-orange-500",
      shadow: "shadow-bronze",
      bg: "bg-gradient-to-b from-orange-500/20 to-transparent",
    },
  };
  const style = rankStyles[rank];

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rank * 0.1, type: "spring", stiffness: 100 }}
      className={`flex flex-col items-center w-24 sm:w-28 ${style.scale}`}
    >
      <Crown
        className={`${style.crownColor} drop-shadow-lg`}
        size={rank === 1 ? 28 : 24}
      />

      {/* Top part: Name only */}
      <div
        className={`w-full mt-1.5 rounded-t-lg flex justify-center items-center text-center p-2 h-16 ${style.bg}`}
      >
        <span className="text-sm font-bold truncate w-full px-1">
          {player.gameUsername}
        </span>
      </div>

      {/* Bottom part: Rank, Kills, and Prize */}
      <div
        className={`${style.height} w-full rounded-b-lg border-2 ${style.borderColor} ${style.shadow} bg-[#1a1a24] flex flex-col items-center justify-evenly p-2`}
      >
        <span className="font-display text-5xl font-bold text-gray-400">
          {rank}
        </span>
        <div className="flex flex-col items-center">
          <span className="text-xs text-red-400 font-semibold">
            {player.kills} Kills
          </span>
          <span className="text-yellow-300 text-base font-bold mt-1">
            ₹{player.prize}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default LeaderboardPage;
