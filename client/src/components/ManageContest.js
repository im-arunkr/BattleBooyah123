import React, { useState, useEffect, useCallback } from "react";
import api from "../api";
import { ChevronDown } from "lucide-react";
import ContestDetails from "./ContestDetails";
import ContestCard from "../components/ContestCard"; // STEP 1: Naya reusable component import kiya

// --- Purana 'ContestListItem' component yahan se hata diya gaya hai ---

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
            // STEP 2: Yahan <ContestListItem> ki jagah <ContestCard> use kiya
            <ContestCard
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