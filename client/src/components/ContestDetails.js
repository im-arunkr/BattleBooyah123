import React, { useState, useEffect } from "react";
import api from "../api";
import { ArrowLeft, PlusCircle, Trash2, Edit, Users } from "lucide-react";

// PlayerList Component (Updated to show Website UserID, Game Username, and Game Name)
// PlayerList Component (Updated for Website UserID, Game UserID, and Game Username)
// Component to show list of registered players
const PlayerList = ({ contestId }) => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const { data } = await api.get(`/api/admin/contests/${contestId}/players`);
        setPlayers(data.players);
      } catch (error) {
        console.error("Error fetching players:", error);
        setPlayers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPlayers();
  }, [contestId]);

  if (loading) return <p className="text-gray-400 mt-2">Loading players...</p>;
 

  return (
    <div className="mt-4">
      <h2 className="text-lg font-semibold mb-2">Registered Players ({players.length})</h2>
      <div className="bg-[#1e2746] rounded-lg p-2">
        <div className="grid grid-cols-3 gap-4 p-2 font-bold border-b border-gray-700">
          <div>Website UserID</div>
          <div>In-Game Username</div>
          <div>In-Game UserID</div>
        </div>
        {players.map((player, index) => (
          <div
            key={index}
            className="grid grid-cols-3 gap-4 p-2 border-b border-gray-700"
          >
            <div>{player.websiteUserId}</div>
            <div>{player.inGameUsername}</div>
            <div>{player.inGameUserId}</div>
          </div>
        ))}
      </div>
    </div>
  );
};



// Simple form for updating only Room ID and Password
const UpdateRoomForm = ({ contest, onContestUpdate }) => {
  const [roomDetails, setRoomDetails] = useState({ roomId: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    if (contest.roomDetails) {
      setRoomDetails({
        roomId: contest.roomDetails.roomId || "",
        password: contest.roomDetails.password || "",
      });
    }
  }, [contest]);

  const handleChange = (e) => {
    setRoomDetails({ ...roomDetails, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });
    try {
      const { data } = await api.put(`/api/admin/contests/${contest._id}`, {
        roomDetails,
      });
      onContestUpdate(data.contest);
      setMessage({
        type: "success",
        text: "Room details updated successfully!",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to update.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto mt-6 p-4 bg-[#1e2746] border border-gray-700 rounded-lg">
      <h3 className="text-lg font-semibold text-white text-center mb-4">
        Quick Update: Room Details
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-300">Room ID</label>
            <input
              type="text"
              name="roomId"
              value={roomDetails.roomId}
              onChange={handleChange}
              className="w-full mt-1 p-2 bg-gray-800 rounded-md text-white border border-gray-600 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-300">
              Password
            </label>
            <input
              type="text"
              name="password"
              value={roomDetails.password}
              onChange={handleChange}
              className="w-full mt-1 p-2 bg-gray-800 rounded-md text-white border border-gray-600 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-green-600 hover:bg-green-700 rounded-md font-semibold disabled:bg-gray-500"
        >
          {loading ? "Updating..." : "Update Room"}
        </button>
        {message.text && (
          <p
            className={`text-center text-sm mt-2 ${
              message.type === "success" ? "text-green-400" : "text-red-400"
            }`}
          >
            {message.text}
          </p>
        )}
      </form>
    </div>
  );
};

// Full Contest Update Form Component
const UpdateContestForm = ({ contest, onContestUpdate, onCancel }) => {
  const toDateTimeLocal = (isoDate) => {
    if (!isoDate) return "";
    const date = new Date(isoDate);
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return date.toISOString().slice(0, 16);
  };

  const [formData, setFormData] = useState({
    ...contest,
    startTime: toDateTimeLocal(contest.startTime),
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "roomId" || name === "password") {
      setFormData((prev) => ({
        ...prev,
        roomDetails: { ...prev.roomDetails, [name]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });
    try {
      const { data } = await api.put(
        `/api/admin/contests/${contest._id}`,
        formData
      );
      onContestUpdate(data.contest);
      setMessage({ type: "success", text: "Contest updated successfully!" });
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to update contest.",
      });
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="w-full max-w-4xl mx-auto mt-8 p-6 bg-[#1e2746] border-2 border-blue-500 rounded-lg">
      <h3 className="text-xl font-semibold text-white text-center mb-6">
        Edit Full Contest Details
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-300">
                Game Title
              </label>
              <input
                type="text"
                name="gameTitle"
                value={formData.gameTitle}
                onChange={handleChange}
                className="w-full mt-1 p-2 bg-gray-800 rounded-md text-white border border-gray-600"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-300">
                Start Time
              </label>
              <input
                type="datetime-local"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                className="w-full mt-1 p-2 bg-gray-800 rounded-md text-white border border-gray-600"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-300">
                  Entry Fee
                </label>
                <input
                  type="number"
                  name="entryFee"
                  value={formData.entryFee}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 bg-gray-800 rounded-md text-white border border-gray-600"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300">
                  Total Prize
                </label>
                <input
                  type="number"
                  name="totalPrize"
                  value={formData.totalPrize}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 bg-gray-800 rounded-md text-white border border-gray-600"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-300">
                  Per Kill Reward
                </label>
                <input
                  type="number"
                  name="perKillReward"
                  value={formData.perKillReward}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 bg-gray-800 rounded-md text-white border border-gray-600"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300">
                  Participants
                </label>
                <input
                  type="number"
                  name="totalParticipants"
                  value={formData.totalParticipants}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 bg-gray-800 rounded-md text-white border border-gray-600"
                />
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-300">Map</label>
              <input
                type="text"
                name="map"
                value={formData.map}
                onChange={handleChange}
                className="w-full mt-1 p-2 bg-gray-800 rounded-md text-white border border-gray-600"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-300">
                Prize Breakup (e.g., #1:500,#2:300)
              </label>
              <textarea
                name="prizeBreakup"
                value={formData.prizeBreakup}
                onChange={handleChange}
                rows="3"
                className="w-full mt-1 p-2 bg-gray-800 rounded-md text-white border border-gray-600"
              ></textarea>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-300">
                  Room ID
                </label>
                <input
                  type="text"
                  name="roomId"
                  value={formData.roomDetails?.roomId || ""}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 bg-gray-800 rounded-md text-white border border-gray-600"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300">
                  Room Password
                </label>
                <input
                  type="text"
                  name="password"
                  value={formData.roomDetails?.password || ""}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 bg-gray-800 rounded-md text-white border border-gray-600"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="w-full py-2.5 bg-gray-600 hover:bg-gray-700 rounded-md font-semibold"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 rounded-md font-semibold disabled:bg-gray-500"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
        {message.text && (
          <p
            className={`text-center text-sm mt-2 ${
              message.type === "success" ? "text-green-400" : "text-red-400"
            }`}
          >
            {message.text}
          </p>
        )}
      </form>
    </div>
  );
};

// [UNCHANGED] LeaderboardManager Component with corrected 'userId' field
const LeaderboardManager = ({ contest, onContestUpdate }) => {
  const hasExistingLeaderboard =
    contest.leaderboard && contest.leaderboard.length > 0;
  const [leaderboard, setLeaderboard] = useState([]);
  const [isEditing, setIsEditing] = useState(!hasExistingLeaderboard);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    const initialRow = {
      rank: 1,
      userId: "",
      gameUsername: "",
      kills: 0,
      prize: 0,
    };
    const existingData =
      contest.leaderboard && contest.leaderboard.length > 0
        ? contest.leaderboard
        : [initialRow];
    setLeaderboard(existingData);
    setIsEditing(!(contest.leaderboard && contest.leaderboard.length > 0));
  }, [contest]);

  const handleInputChange = (index, event) => {
    const values = [...leaderboard];
    values[index][event.target.name] = event.target.value;
    setLeaderboard(values);
  };

  const handleAddRow = () => {
    if (leaderboard.length >= 50) {
      setMessage({ type: "error", text: "You can add a maximum of 50 ranks." });
      return;
    }
    setLeaderboard([
      ...leaderboard,
      {
        rank: leaderboard.length + 1,
        userId: "",
        gameUsername: "",
        kills: 0,
        prize: 0,
      },
    ]);
  };

  const handleRemoveRow = (index) => {
    const values = [...leaderboard];
    values.splice(index, 1);
    const updatedRanks = values.map((row, i) => ({ ...row, rank: i + 1 }));
    setLeaderboard(updatedRanks);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });
    try {
      const { data } = await api.post(
        `/api/admin/contests/${contest._id}/leaderboard`,
        { leaderboardData: leaderboard }
      );
      onContestUpdate(data);
      setMessage({ type: "success", text: "Leaderboard updated successfully!" });
      setIsEditing(false);
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to update leaderboard.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isEditing) {
    return (
      <div className="w-full max-w-4xl mx-auto mt-8 p-4 bg-[#1e2746] border border-gray-700 rounded-lg">
        <h3 className="text-lg font-semibold text-white text-center mb-4">
          Final Leaderboard
        </h3>
        <div className="hidden md:grid grid-cols-12 gap-2 mb-2 px-2 text-xs text-gray-400 font-bold">
          <div className="col-span-1">Rank</div>
          <div className="col-span-3">Website UserID</div>
          <div className="col-span-3">Game Username</div>
          <div className="col-span-2 text-center">Kills</div>
          <div className="col-span-3 text-right">Prize</div>
        </div>
        {leaderboard.map((row) => (
          <div
            key={row.rank}
            className="grid grid-cols-12 gap-2 mb-1 items-center bg-gray-800/50 p-2 rounded"
          >
            <div className="col-span-1 font-bold">{row.rank}</div>
            <div className="col-span-3">{row.userId}</div>
            <div className="col-span-3">{row.gameUsername}</div>
            <div className="col-span-2 text-center">{row.kills}</div>
            <div className="col-span-3 text-right font-semibold text-green-400">
              ₹{row.prize}
            </div>
          </div>
        ))}
        <div className="flex justify-end items-center mt-4">
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-sm font-semibold"
          >
            <Edit size={16} /> Update Leaderboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 p-4 bg-[#1e2746] border-2 border-blue-500 rounded-lg">
      <h3 className="text-lg font-semibold text-white text-center mb-4">
        {hasExistingLeaderboard ? "Update Leaderboard" : "Add Leaderboard"}
      </h3>
      <form onSubmit={handleSubmit}>
        <div className="hidden md:grid grid-cols-12 gap-2 mb-2 px-2 text-xs text-gray-400 font-bold">
          <div className="col-span-1">Rank</div>
          <div className="col-span-3">Website UserID</div>
          <div className="col-span-3">Game Username</div>
          <div className="col-span-2">Kills</div>
          <div className="col-span-2">Prize</div>
          <div className="col-span-1"></div>
        </div>

        {leaderboard.map((row, index) => (
          <div
            key={index}
            className="grid grid-cols-12 gap-2 mb-2 items-center"
          >
            <input
              type="number"
              name="rank"
              value={row.rank}
              onChange={(e) => handleInputChange(index, e)}
              placeholder="#"
              className="col-span-1 p-2 bg-gray-800 rounded border border-gray-600"
            />
            <input
              type="text"
              name="userId"
              value={row.userId}
              onChange={(e) => handleInputChange(index, e)}
              placeholder="Website UserID"
              className="col-span-3 p-2 bg-gray-800 rounded border border-gray-600"
            />
            <input
              type="text"
              name="gameUsername"
              value={row.gameUsername}
              onChange={(e) => handleInputChange(index, e)}
              placeholder="Game Username"
              className="col-span-3 p-2 bg-gray-800 rounded border border-gray-600"
            />
            <input
              type="number"
              name="kills"
              value={row.kills}
              onChange={(e) => handleInputChange(index, e)}
              placeholder="Kills"
              className="col-span-2 p-2 bg-gray-800 rounded border border-gray-600"
            />
            <input
              type="number"
              name="prize"
              value={row.prize}
              onChange={(e) => handleInputChange(index, e)}
              placeholder="Prize"
              className="col-span-2 p-2 bg-gray-800 rounded border border-gray-600"
            />
            <button
              type="button"
              onClick={() => handleRemoveRow(index)}
              className="col-span-1 text-red-500 hover:text-red-400 flex justify-center"
            >
              <Trash2 size={20} />
            </button>
          </div>
        ))}
        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={handleAddRow}
              disabled={leaderboard.length >= 50}
              className="flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 rounded-md text-sm font-semibold disabled:bg-gray-500 disabled:cursor-not-allowed"
            >
              <PlusCircle size={16} /> Add Winner
            </button>
            {hasExistingLeaderboard && (
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-md text-sm font-semibold"
              >
                Cancel
              </button>
            )}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md font-semibold disabled:bg-gray-500"
          >
            {loading ? "Submitting..." : "Submit Leaderboard"}
          </button>
        </div>
        {message.text && (
          <p
            className={`text-center text-sm mt-4 ${
              message.type === "success" ? "text-green-400" : "text-red-400"
            }`}
          >
            {message.text}
          </p>
        )}
      </form>
    </div>
  );
};

// ContestDetails Component
function ContestDetails({ contest, onBack }) {
  const [currentContest, setCurrentContest] = useState(contest);
  const [isEditing, setIsEditing] = useState(false);

  const handleContestUpdate = (updatedContest) => {
    setCurrentContest(updatedContest);
    setIsEditing(false);
  };

  const getRealStatus = (startTime) => {
    const now = new Date();
    const contestStartTime = new Date(startTime);
    const finishTime = new Date(contestStartTime.getTime() + 30 * 60 * 1000);
    if (contestStartTime > now) return "Upcoming";
    if (finishTime > now) return "Live";
    return "Finished";
  };

  const realStatus = getRealStatus(currentContest.startTime);

  return (
    <div className="w-full text-white flex flex-col p-4">
      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={onBack}
          className="p-2 bg-gray-700 rounded-full hover:bg-gray-600"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold">{currentContest.gameTitle}</h1>
      </div>

      <div className="p-4 bg-[#1e2746] border border-gray-700 rounded-lg">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-xs text-gray-400">Entry Fee</p>
            <p className="font-bold text-green-400">
              {currentContest.entryFee} PTS
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Total Prize</p>
            <p className="font-bold text-yellow-400">
              ₹{currentContest.totalPrize}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Per Kill</p>
            <p className="font-bold">₹{currentContest.perKillReward}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Participants</p>
            <p className="font-bold">
              {currentContest.players.length}/{currentContest.totalParticipants}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Mode</p>
            <p className="font-bold">{currentContest.teamType}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Map</p>
            <p className="font-bold">{currentContest.map}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Status</p>
            <p className="font-bold">{realStatus}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Start Time</p>
            <p className="font-bold text-sm">
              {new Date(currentContest.startTime).toLocaleString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          {currentContest.roomDetails?.roomId && (
            <div>
              <p className="text-xs text-gray-400">Room ID</p>
              <p className="font-bold text-cyan-400">
                {currentContest.roomDetails.roomId}
              </p>
            </div>
          )}
          {currentContest.roomDetails?.password && (
            <div>
              <p className="text-xs text-gray-400">Password</p>
              <p className="font-bold text-cyan-400">
                {currentContest.roomDetails.password}
              </p>
            </div>
          )}
        </div>
      </div>

       {/* Registered Players */}
      <PlayerList contestId={currentContest._id} />


      {realStatus === "Finished" && (
        <LeaderboardManager
          contest={currentContest}
          onContestUpdate={handleContestUpdate}
        />
      )}

      {realStatus === "Upcoming" &&
        (isEditing ? (
          <UpdateContestForm
            contest={currentContest}
            onContestUpdate={handleContestUpdate}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <>
            <div className="text-center mt-6">
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-md font-semibold"
              >
                <Edit size={16} /> Edit Full Contest
              </button>
            </div>
            <UpdateRoomForm
              contest={currentContest}
              onContestUpdate={setCurrentContest}
            />
          </>
        ))}
      
    </div>

    
  );
}

export default ContestDetails;
