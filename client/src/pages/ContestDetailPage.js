import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../api";
import {
  Loader2,
  ArrowLeft,
  Wallet,
  Gamepad2,
  ChevronDown,
  XCircle,
  CheckCircle2,
} from "lucide-react";
import BottomNav from "../components/BottomNav";

// --- Join Form Modal (UPDATED for better size and text) ---
const JoinFormModal = ({ contest, user, onConfirm, onCancel }) => {
  const teamSizeMap = { Solo: 1, Duo: 2, Squad: 4 };
  const teamSize = teamSizeMap[contest.teamType] || 1;

  const [teamName, setTeamName] = useState("");
  const [playerDetails, setPlayerDetails] = useState(
    Array(teamSize).fill({ username: "", userId: "" }),
  );
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState(
    Array(teamSize).fill(""),
  );
  const [isChecking, setIsChecking] = useState(false);

  const handleInputChange = (index, field, value) => {
    const newDetails = [...playerDetails];
    newDetails[index] = { ...newDetails[index], [field]: value };
    setPlayerDetails(newDetails);

    if (validationErrors[index]) {
      const newErrors = [...validationErrors];
      newErrors[index] = "";
      setValidationErrors(newErrors);
    }
  };

  const handleSubmit = async () => {
    setError("");
    let isValid = true;

    for (const player of playerDetails) {
      if (!player.username.trim() || !player.userId.trim()) {
        setError("All player names and IDs are required.");
        isValid = false;
      }
    }

    if (
      (contest.teamType === "Duo" || contest.teamType === "Squad") &&
      !teamName.trim()
    ) {
      setError("Team name is required for Duo and Squad contests.");
      isValid = false;
    }

    if (!isConfirmed) {
      setError("You must agree to the terms to continue.");
      isValid = false;
    }
    if (!isValid) return;

    setIsChecking(true);
    try {
      const userIdsToCheck = playerDetails.map((p) => p.userId);
      const response = await api.post(
        `/api/contests/${contest._id}/check-participants`,
        { userIds: userIdsToCheck },
      );

      const { existingIds } = response.data;
      if (existingIds.length > 0) {
        const newErrors = Array(teamSize).fill("");
        playerDetails.forEach((player, index) => {
          if (existingIds.includes(player.userId)) {
            newErrors[index] = "This ID is already registered.";
          }
        });
        setValidationErrors(newErrors);
        setError("Some User IDs are already taken.");
        setIsChecking(false);
        return;
      }

      onConfirm({ teamName, playerDetails });
    } catch (err) {
      console.error("Error checking participants:", err);
      setError(
        err.response?.data?.message ||
          "Could not verify player IDs. Try again.",
      );
    } finally {
      setIsChecking(false);
    }
  };

  const canSubmit =
    isConfirmed &&
    playerDetails.every((p) => p.username.trim() && p.userId.trim()) &&
    (contest.teamType === "Solo" || teamName.trim());

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      {/* Increased max-width and padding */}
      <div className="card-sharp max-w-md w-full p-6">
        <div className="text-center">
          <Gamepad2 size={32} className="mx-auto text-[var(--color-blue)]" />
          {/* Increased heading size */}
          <h2 className="text-2xl font-display text-white mt-2">
            Enter Details
          </h2>
        </div>

        {(contest.teamType === "Duo" || contest.teamType === "Squad") && (
          <div className="mt-4">
            <input
              type="text"
              placeholder="Team Name"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              // Increased text size and padding
              className="input-field py-2.5 text-base"
            />
          </div>
        )}

        <div className="mt-4 max-h-[35vh] overflow-y-auto space-y-3 hide-scrollbar pr-2">
          {playerDetails.map((player, index) => (
            <div
              key={index}
              className="bg-[var(--bg-primary)] p-3 rounded-lg border border-[var(--border-color)]"
            >
              <h3 className="font-semibold text-[var(--color-blue)] text-base mb-2">
                Player {index + 1}
              </h3>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="FF Username"
                  value={player.username}
                  onChange={(e) =>
                    handleInputChange(index, "username", e.target.value)
                  }
                  className="input-field py-2.5 text-base"
                />
                <div>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="FF UserID"
                    value={player.userId}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      handleInputChange(index, "userId", value);
                    }}
                    className={`input-field py-2.5 text-base ${validationErrors[index] ? "border-red-500" : ""}`}
                  />
                  {validationErrors[index] && (
                    <p className="text-red-500 text-xs mt-1">
                      {validationErrors[index]}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Increased text size */}
        <div className="mt-4 text-sm">
          <label
            htmlFor="confirmation"
            className="flex items-start gap-2 cursor-pointer text-gray-400 p-2 rounded hover:bg-black/20"
          >
            <input
              id="confirmation"
              type="checkbox"
              checked={isConfirmed}
              onChange={(e) => setIsConfirmed(e.target.checked)}
              className="mt-1 h-4 w-4 shrink-0 rounded border-gray-400 bg-gray-700 text-[var(--color-blue)]"
            />
            <span>
              I confirm all details are correct & required map is downloaded.
            </span>
          </label>
        </div>

        {error && (
          <p className="text-red-500 text-sm mt-3 text-center animate-pulse">
            {error}
          </p>
        )}

        <div className="mt-4 flex flex-col items-center gap-2">
          <button
            onClick={handleSubmit}
            disabled={!canSubmit || isChecking}
            // Increased text size
            className={`btn btn-primary w-full py-3 text-base ${!canSubmit || isChecking ? "" : "btn-pulse"}`}
          >
            {isChecking ? <Loader2 className="animate-spin" /> : "Confirm & Pay"}
          </button>
          <button
            onClick={onCancel}
            className="font-medium text-gray-400 hover:text-[var(--color-red)] text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

// ... InsufficientPointsModal and JoinSuccessModal components remain unchanged ...
// --- Insufficient Points Modal ---
const InsufficientPointsModal = ({ onClose }) => {
    const phoneNumber = "919608039938";
    const message = "Recharge";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="card-sharp max-w-sm w-full text-center p-8">
                <XCircle size={48} className="mx-auto text-[var(--color-red)]" />
                <h2 className="text-3xl font-display text-white mt-4">Insufficient Points</h2>
                <p className="text-gray-400 mt-2">You don't have enough points to join this contest. Please recharge to continue.</p>
                <div className="mt-6 flex flex-col gap-3">
                    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">Recharge Now</a>
                    <button onClick={onClose} className="btn btn-secondary">Close</button>
                </div>
            </div>
        </div>
    );
};

// --- Join Success Modal ---
const JoinSuccessModal = ({ onClose }) => (
  <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="card-sharp max-w-md w-full text-center p-8">
      <CheckCircle2 size={56} className="mx-auto text-green-400" />
      <h2 className="text-3xl font-display text-white mt-4">
        Successfully Joined!
      </h2>
      <p className="text-gray-300 mt-3">
        Room ID & Password will be available in{" "}
        <span className="text-cyan-400 font-semibold">MY CONTESTS</span> section
        at contest start time.
      </p>
      <div className="mt-6">
        <button onClick={onClose} className="btn btn-primary">
          OK
        </button>
      </div>
    </div>
  </div>
);

// --- Joining Loader Modal ---
const JoiningLoaderModal = () => (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="flex flex-col items-center">
        <Loader2 size={48} className="text-white animate-spin" />
        <p className="text-white text-lg font-semibold mt-4">
          Joining Contest...
        </p>
      </div>
    </div>
);


const ContestDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [contest, setContest] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPrize, setShowPrize] = useState(true);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showInsufficientPointsModal, setShowInsufficientPointsModal] = useState(false);
  const [showJoinSuccessModal, setShowJoinSuccessModal] = useState(false);
  const [isJoining, setIsJoining] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userResponse, contestResponse] = await Promise.all([
          api.get("/api/users/me"),
          api.get(`/api/contests/${id}`),
        ]);
        setUser(userResponse.data);
        setContest(contestResponse.data);
      } catch (error) {
        console.error("Failed to fetch data", error);
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, navigate]);

  const handleJoinClick = () => {
    if (!user || !contest) return;
    if (user.points < contest.entryFee) {
      setShowInsufficientPointsModal(true);
    } else {
      setShowJoinModal(true);
    }
  };

  const handleConfirmJoin = async ({ teamName, playerDetails }) => {
    setShowJoinModal(false);
    setIsJoining(true);
    try {
        await api.post(`/api/contests/${id}/join`, {
            teamType: contest.teamType,
            teamName,
            players: playerDetails.map((p) => ({
                inGameUsername: p.username,
                inGameUserId: p.userId,
            })),
        });
        setShowJoinSuccessModal(true);
    } catch (error) {
        alert("Failed to join contest: " + (error.response?.data?.message || "Server error"));
        throw error;
    } finally {
        setIsJoining(false);
    }
  };

  const customStyles = `
        @import url('https://fonts.googleapis.com/css2?family=Teko:wght@400;700&family=Inter:wght@400;600;700&display=swap');
        :root { --color-red: #ff3b3b; --color-blue: #3b82f6; --color-sky: #87ceeb; --bg-primary: #0a0a0f; --bg-secondary: #121218; --border-color: #27272a; }
        .font-display { font-family: 'Teko', sans-serif; }
        .font-sans { font-family: 'Inter', sans-serif; }
        .text-gradient-animated { background: linear-gradient(90deg, var(--color-red), var(--color-blue), var(--color-sky), var(--color-red)); background-size: 300% auto; -webkit-background-clip: text; background-clip: text; color: transparent; animation: gradient-shine 4s linear infinite; }
        @keyframes gradient-shine { to { background-position: 300% center; } }
        .card-sharp { background-color: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 0.5rem; position: relative; overflow: hidden; }
        .card-sharp::before { content: ''; position: absolute; left: 0; top: 0; width: 4px; height: 100%; background: linear-gradient(180deg, var(--color-red), var(--color-blue)); }
        .btn { font-weight: bold; padding: 0.8rem 1.2rem; border-radius: 0.375rem; transition: transform 0.2s ease, box-shadow 0.2s ease, background-position 0.5s ease; display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; width: 100%; text-align: center; }
        .btn:hover { transform: translateY(-2px); }
        .btn:disabled { cursor: not-allowed; transform: none; }
        .btn-primary { background: linear-gradient(90deg, var(--color-red), var(--color-blue)); background-size: 200% auto; color: #fff; }
        .btn-primary:hover { background-position: right center; box-shadow: 0 0 25px rgba(59, 130, 246, 0.5); }
        .btn-primary:disabled { background: #555; box-shadow: none; opacity: 0.6; }
        .btn-pulse { animation: pulse-shadow 2s infinite; }
        @keyframes pulse-shadow {
            0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.6); }
            70% { box-shadow: 0 0 15px 10px rgba(59, 130, 246, 0); }
            100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
        }
        .btn-secondary { background-color: var(--border-color); color: #fff; border: 1px solid #444; }
        .btn-secondary:hover { background-color: #333; border-color: #555; }
        .input-field { background-color: var(--bg-primary); border: 1px solid var(--border-color); color: #d1d5db; border-radius: 0.375rem; padding: 0.75rem 1rem; width: 100%; transition: border-color 0.2s ease, box-shadow 0.2s ease; }
        .input-field:focus { outline: none; border-color: var(--color-blue); box-shadow: 0 0 10px rgba(59, 130, 246, 0.3); }
        .glass-card { background: rgba(30, 30, 30, 0.5); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); border: 1px solid var(--border-color); }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .btn-premium { position: relative; overflow: hidden; z-index: 1; transition: transform 0.2s ease-out, box-shadow 0.3s ease-in-out; }
        .btn-premium::after { content: ''; position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background-image: linear-gradient(-45deg, rgba(255, 255, 255, 0) 40%, rgba(255, 255, 255, 0.3) 50%, rgba(255, 255, 255, 0) 60%); transform: translateX(-100%); transition: transform 0.8s cubic-bezier(0.2, 1, 0.3, 1); }
        .btn-premium:hover::after { transform: translateX(100%); }
        .btn-premium:hover { transform: translateY(-3px); box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2), 0 0 30px rgba(59, 130, 246, 0.6); }
        .btn-premium:active { transform: translateY(-1px) scale(0.98); }
        .btn-premium:disabled { background: linear-gradient(90deg, #555, #333); cursor: not-allowed; opacity: 0.7; transform: none; box-shadow: none; }
        .btn-premium:disabled::after { display: none; }
  `;

  if (loading || !contest || !user) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "var(--bg-primary)" }}
      >
        <Loader2 className="animate-spin text-white" size={40} />
      </div>
    );
  }

  const hasJoined = false;
  const prizeList = contest?.prizeBreakup
    ? contest.prizeBreakup
        .split(",")
        .map((item) => ({
          rank: item.split(":")[0],
          prize: item.split(":")[1],
        }))
    : [];

  return (
    <>
      {isJoining && <JoiningLoaderModal />}
      {showJoinModal && (
        <JoinFormModal
          contest={contest}
          user={user}
          onConfirm={handleConfirmJoin}
          onCancel={() => setShowJoinModal(false)}
        />
      )}
      {showInsufficientPointsModal && (
        <InsufficientPointsModal onClose={() => setShowInsufficientPointsModal(false)} />
      )}
      {showJoinSuccessModal && (
        <JoinSuccessModal onClose={() => navigate('/my-contests')} />
      )}

      <style>{customStyles}</style>

      <div
        className="min-h-screen font-sans text-white pb-20"
        style={{ background: "var(--bg-primary)" }}
      >
        <header
          className="fixed top-0 left-0 w-full z-40 bg-primary/80 backdrop-blur-md"
          style={{
            background: "rgba(10, 10, 15, 0.8)",
            borderBottom: "1px solid var(--border-color)",
          }}
        >
          <div className="container mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
            <Link
              to="/dashboard"
              className="text-3xl font-display font-bold tracking-wider text-white"
            >
              Battle<span className="text-gradient-animated">Booyah</span>
            </Link>
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
              style={{
                background: "var(--bg-secondary)",
                border: "1px solid var(--border-color)",
              }}
            >
              <Wallet className="text-[var(--color-blue)]" size={20} />
              <span className="font-bold text-white text-sm">
                ₹{user?.points?.toFixed(2) || "0.00"}
              </span>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 pt-24 pb-12">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-white mb-3 transition-colors"
          >
            <ArrowLeft size={16} /> Back
          </button>
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-display uppercase tracking-wider bg-gradient-to-r from-emerald-400 via-cyan-400 to-indigo-500 bg-clip-text text-transparent">
              {contest.gameTitle}
            </h1>
            <p className="mt-1 text-sm text-gray-400">
              {new Date(contest.startTime)
                .toLocaleString("en-GB", {
                  timeZone: "Asia/Kolkata",
                  dateStyle: "full",
                  timeStyle: "short",
                })
                .replace(/ (\d{4}),/, ", $1 at")}
            </p>
          </div>
          <div className="hidden md:block">
            <div className="mt-4 grid grid-cols-5 gap-2 text-center">
                <div className="p-1 glass-card rounded-md"><p className="text-[10px] text-gray-400">GAME</p><p className="text-sm font-bold text-gray-100">{contest.gameMode}</p></div>
                <div className="p-1.5 glass-card rounded-md text-center"><p className="text-xs text-gray-400">MAP</p><p className="text-base font-bold text-gray-100">{contest.map}</p></div>
                <div className="p-1 glass-card rounded-md"><p className="text-[10px] text-gray-400">MODE</p><p className="text-sm font-bold text-gray-100">{contest.teamType}</p></div>
                <div className="p-1 glass-card rounded-md"><p className="text-[10px] text-gray-400">VIEW</p><p className="text-sm font-bold text-gray-100">{contest.viewType}</p></div>
                <div className="p-1.5 glass-card rounded-md text-center"><p className="text-xs text-gray-400">PARTICIPANTS</p><p className="text-base font-bold text-gray-100">{contest.players.length} / {contest.totalParticipants}</p></div>
            </div>
            <div className="mt-3 flex justify-center">
                <div className="grid grid-cols-3 gap-2 w-full max-w-lg">
                    <div className="p-1 glass-card rounded-md text-center"><p className="text-[10px] text-gray-400">ENTRY</p><p className="text-sm font-bold text-[var(--color-blue)]">₹{contest.entryFee}</p></div>
                    <div className="p-1.5 glass-card rounded-md text-center"><p className="text-[10px] text-gray-400">PER KILL</p><p className="text-sm font-bold text-green-400">₹{contest.perKillReward}</p></div>
                    <div className="p-1 glass-card rounded-md text-center"><p className="text-[10px] text-gray-400">PRIZE</p><p className="text-sm font-bold text-purple-400">₹{contest.totalPrize}</p></div>
                </div>
            </div>
          </div>
          <div className="md:hidden mt-4 space-y-3">
            <div className="grid grid-cols-3 gap-2 w-full text-center">
                <div className="p-2 glass-card rounded-md"><p className="text-[10px] text-gray-400">GAME</p><p className="text-sm font-bold">{contest.gameMode}</p></div>
                <div className="p-2 glass-card rounded-md"><p className="text-[10px] text-gray-400">MAP</p><p className="text-sm font-bold">{contest.map}</p></div>
                <div className="p-2 glass-card rounded-md"><p className="text-[10px] text-gray-400">MODE</p><p className="text-sm font-bold">{contest.teamType}</p></div>
            </div>
            <div className="grid grid-cols-3 gap-2 w-[70%] mx-auto text-center">
                <div className="p-2 glass-card rounded-md"><p className="text-[10px] text-gray-400">ENTRY</p><p className="text-sm font-bold text-[var(--color-blue)]">₹{contest.entryFee}</p></div>
                <div className="p-2 glass-card rounded-md"><p className="text-[10px] text-gray-400">PER KILL</p><p className="text-sm font-bold text-green-400">₹{contest.perKillReward}</p></div>
                <div className="p-2 glass-card rounded-md"><p className="text-[10px] text-gray-400">PRIZE</p><p className="text-sm font-bold text-purple-400">₹{contest.totalPrize}</p></div>
            </div>
            <div className="grid grid-cols-2 gap-2 w-[40%] mx-auto text-center">
                <div className="p-2 glass-card rounded-md"><p className="text-[10px] text-gray-400">SPOTS</p><p className="text-sm font-bold">{contest.players.length}/{contest.totalParticipants}</p></div>
                <div className="p-2 glass-card rounded-md"><p className="text-[10px] text-gray-400">VIEW</p><p className="text-sm font-bold">{contest.viewType}</p></div>
            </div>
          </div>
          <div className="mt-8 flex flex-col items-center">
            <button
              onClick={() => setShowPrize(!showPrize)}
              className="p-2 glass-card rounded-md text-sm font-semibold flex items-center gap-1.5 transition"
            >
              Prize Pool Breakup
              <ChevronDown
                className={`transition-transform ${showPrize ? "rotate-180" : ""}`}
                size={18}
              />
            </button>
            {showPrize && prizeList.length > 0 && (
              <div className="mt-2 w-full max-w-sm glass-card rounded-md p-2">
                <table className="w-full text-center">
                  <thead className="border-b border-[var(--border-color)]">
                    <tr>
                        <th className="py-1 font-semibold text-gray-400 text-xs">Standing</th>
                        <th className="py-1 font-semibold text-gray-400 text-xs">Prize (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {prizeList.map((item) => (
                      <tr key={item.rank} className="border-b border-[var(--border-color)]/50 last:border-b-0 text-sm">
                        <td className="py-1.5 text-cyan-400 font-semibold">Rank {item.rank}</td>
                        <td className="py-1.5 font-bold text-purple-400">₹{item.prize}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          {/* --- UPDATED Join Contest Button --- */}
          <div className="mt-6 flex justify-center">
  <button
    className="relative overflow-hidden text-base px-6 py-1.5 rounded-full font-bold tracking-wide
               bg-white
               shadow-lg shadow-blue-500/50
               transition-all duration-300 ease-out
               hover:scale-105 hover:shadow-[0_0_25px_rgba(59,130,246,0.9)]
               disabled:opacity-50 disabled:cursor-not-allowed"
    disabled={hasJoined}
    onClick={handleJoinClick}
  >
    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent
                     animate-[shine_4s_linear_infinite] 
                     hover:animate-[shine_1.5s_linear_infinite] 
                     opacity-70 hover:opacity-100 rounded-full"></span>

    <span className="relative z-10 text-gradient-animated font-display text-lg">
      {hasJoined ? "Joined" : "Join Now"}
    </span>
  </button>
</div>

        </main>
        <BottomNav />
      </div>
    </>
  );
};

export default ContestDetailPage;