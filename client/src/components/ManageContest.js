import React, { useState, useEffect, useCallback } from "react";
import api from "../api";
import {
  ChevronDown,
  Tag,
  Star,
  Users,
  Map,
  Clock,
  Swords,
} from "lucide-react";
import ContestDetails from "./ContestDetails";

// --- Contest List Item Component ---
const ContestListItem = ({ contest, onViewClick, status }) => {
  const percentFilled = Math.round(
    (contest.players.length / contest.totalParticipants) * 100
  );

  const getButtonProps = () => {
    if (status === "Finished") {
      const hasLeaderboard =
        contest.leaderboard && contest.leaderboard.length > 0;
      return {
        text: hasLeaderboard ? "View Leaderboard" : "Add Leaderboard",
        className: hasLeaderboard
          ? "bg-gradient-to-r from-purple-600 to-indigo-600"
          : "bg-gradient-to-r from-slate-600 to-slate-700",
      };
    }
    if (status === "Upcoming") {
      return {
        text: "Update Contest",
        className: "bg-gradient-to-r from-blue-600 to-indigo-600",
      };
    }
    return {
      text: "View Details",
      className: "bg-gradient-to-r from-green-500 to-teal-500",
    };
  };

  const currentButton = getButtonProps();

  return (
    <div className="w-full max-w-xl mx-auto rounded-xl overflow-hidden bg-[#1e2746] border border-gray-700/50 shadow-lg hover:scale-[1.01] transition-transform">
      <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-500">
        <img
          src="https://upload.wikimedia.org/wikipedia/en/e/e7/Free_Fire_game_icon.png"
          alt="icon"
          className="w-7 h-7 rounded-md"
        />
        <div className="text-base sm:text-lg font-bold text-white truncate">
          ⚔️ {contest.gameTitle}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 p-3 border-b border-gray-700/50">
        <div className="bg-slate-800/50 rounded-md p-2 text-center shadow">
          <p className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400">
            <Tag size={12} /> Entry
          </p>
          <p className="text-sm font-bold text-white mt-1">{contest.entryFee} PTS</p>
        </div>

        <div className="bg-slate-800/50 rounded-md p-2 text-center shadow">
          <p className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400">
            <Star size={12} /> Prize
          </p>
          <p className="text-sm font-bold text-yellow-400 mt-1">₹{contest.totalPrize}</p>
        </div>

        <div className="bg-slate-800/50 rounded-md p-2 text-center shadow">
          <p className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400">
            <Swords size={12} /> Per Kill
          </p>
          <p className="text-sm font-bold text-white mt-1">₹{contest.perKillReward || 0}</p>
        </div>
      </div>

      <div className="px-3 pt-3">
        <div className="h-2 rounded bg-gray-700 overflow-hidden">
          <div className="h-full bg-green-500" style={{ width: `${percentFilled}%` }}></div>
        </div>
        <p className="text-[10px] text-right text-gray-400 mt-1">
          Filled {contest.players.length}/{contest.totalParticipants}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3 p-3">
        <div className="bg-slate-800/50 rounded-md p-2 text-center shadow">
          <p className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400">
            <Clock size={12} /> Start
          </p>
          <p className="text-xs font-semibold text-white mt-1">
            {new Date(contest.startTime).toLocaleString("en-IN", {
              day: "numeric",
              month: "short",
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            })}
          </p>
        </div>

        <div className="bg-slate-800/50 rounded-md p-2 text-center shadow">
          <p className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400">
            <Users size={12} /> Players
          </p>
          <p className="text-xs font-semibold text-white mt-1">{contest.totalParticipants}</p>
        </div>

        <div className="bg-slate-800/50 rounded-md p-2 text-center shadow">
          <p className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400">
            <Map size={12} /> Map
          </p>
          <p className="text-xs font-semibold text-white mt-1">{contest.map}</p>
        </div>
      </div>

      <button
        onClick={onViewClick}
        className={`w-full py-2 text-white font-bold text-sm rounded-b-xl hover:opacity-90 transition ${currentButton.className}`}
      >
        {currentButton.text}
      </button>
    </div>
  );
};

// --- ManageContest Component ---
function ManageContest() {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("Live");
  const [gameMode, setGameMode] = useState("All");
  const [teamType, setTeamType] = useState("All");
  const [selectedContest, setSelectedContest] = useState(null);

  const fetchContests = useCallback(async () => {
    if (!selectedContest) {
      setLoading(true);
      setError("");
      try {
        const params = new URLSearchParams({
          statusFilter,
          gameMode,
          teamType: gameMode === "Battle Royale" ? teamType : "All",
        });
        const { data } = await api.get(`/api/admin/contests?${params.toString()}`);
        setContests(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch contests.");
      } finally {
        setLoading(false);
      }
    }
  }, [statusFilter, gameMode, teamType, selectedContest]);

  useEffect(() => {
    fetchContests();
    const interval = setInterval(() => fetchContests(), 15000);
    return () => clearInterval(interval);
  }, [fetchContests]);

  useEffect(() => {
    setTeamType("All");
  }, [gameMode]);

  const handleViewContest = async (contestId) => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get(`/api/admin/contests/${contestId}`);
      setSelectedContest(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch contest details.");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToList = () => {
    setSelectedContest(null);
    fetchContests();
  };

  if (loading && !selectedContest && contests.length === 0) {
    return <p className="text-center text-gray-400 py-10">Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 py-10">{error}</p>;
  }

  if (selectedContest) {
    return <ContestDetails contest={selectedContest} onBack={handleBackToList} />;
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-white mb-6">Manage Contests</h2>

      {/* Filters */}
      <div className="space-y-4 mb-6">
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <div className="relative w-full sm:w-64">
            <select
              value={gameMode}
              onChange={(e) => setGameMode(e.target.value)}
              className="w-full appearance-none bg-gray-800/50 p-4 rounded-xl text-white font-semibold focus:outline-none text-base"
            >
              <option value="All">Choose Game Mode</option>
              <option value="Battle Royale">Battle Royale</option>
              <option value="Clash Squad">Clash Squad</option>
              <option value="Lone Wolf">Lone Wolf</option>
            </select>
            <ChevronDown
              size={22}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
          </div>

          {gameMode === "Battle Royale" && (
            <div className="relative w-full sm:w-64 animate-fade-in">
              <select
                value={teamType}
                onChange={(e) => setTeamType(e.target.value)}
                className="w-full appearance-none bg-gray-800/50 p-4 rounded-xl text-white font-semibold focus:outline-none text-base"
              >
                <option value="All">Choose BR Type</option>
                <option value="Solo">Solo</option>
                <option value="Duo">Duo</option>
                <option value="Squad">Squad</option>
              </select>
              <ChevronDown
                size={22}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
            </div>
          )}
        </div>

        <div className="flex justify-center">
          <div className="bg-gray-800/50 p-2 rounded-xl flex items-center gap-2">
            {["Live", "Upcoming", "Finished"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`flex-1 text-center font-semibold py-2 px-5 rounded-lg transition-colors text-base ${
                  statusFilter === status
                    ? "bg-purple-600 text-white"
                    : "text-gray-400 hover:bg-gray-700"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Contest List */}
      {contests.length > 0 ? (
        <div className="space-y-4">
          {contests.map((contest) => (
            <ContestListItem
              key={contest._id}
              contest={contest}
              status={statusFilter}
              onViewClick={() => handleViewContest(contest._id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-gray-800/50 rounded-xl">
          <p className="text-gray-400">
            No contests found for the selected filters.
          </p>
        </div>
      )}
    </div>
  );
}

export default ManageContest;
