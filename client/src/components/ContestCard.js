// src/components/ContestCard.js

import React from 'react';
import { Tag, Star, Users, Map, Clock, Swords } from 'lucide-react';

// --- SIRF EK ICON IMPORT KAREIN ---
import contestIcon from '../images/contest-icon.png'; // Make sure this file exists

const ContestCard = ({ contest, onViewClick, status }) => {
  // --- Dynamic icon waala poora logic hata diya gaya hai ---

  const percentFilled = Math.round(
    (contest.players.length / contest.totalParticipants) * 100
  );

  const getButtonProps = () => {
    if (status === "Finished") {
      const hasLeaderboard = contest.leaderboard && contest.leaderboard.length > 0;
      return {
        text: hasLeaderboard ? "View Leaderboard" : "Add Leaderboard",
        className: hasLeaderboard ? "bg-gradient-to-r from-purple-600 to-indigo-600" : "bg-gradient-to-r from-slate-600 to-slate-700",
      };
    }
    if (status === "Upcoming") {
      return { text: "Update Contest", className: "bg-gradient-to-r from-blue-600 to-indigo-600" };
    }
    return { text: "View Details", className: "bg-gradient-to-r from-green-500 to-teal-500" };
  };

  const currentButton = getButtonProps();

  return (
    <div className="w-full max-w-xl mx-auto rounded-xl overflow-hidden bg-[#1e2746] border border-gray-700/50 shadow-lg hover:scale-[1.01] transition-transform">
      <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-500">
        {/* --- Hardcoded icon yahan use karein --- */}
       // src/components/ContestCard.js

<img
  src={contestIcon}
  alt="Contest Icon"
  className="w-7 h-7 rounded-md drop-shadow-[0_1px_1px_rgba(255,255,255,0.5)]"
/>
        <div className="text-base sm:text-lg font-bold text-white truncate">
          ⚔️ {contest.gameTitle}
        </div>
      </div>

      {/* Baaki ka component ka JSX waisa hi rahega... */}
      <div className="grid grid-cols-3 gap-3 p-3 border-b border-gray-700/50">
        <div className="bg-slate-800/50 rounded-md p-2 text-center shadow">
            <p className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400"><Tag size={12} /> Entry</p>
            <p className="text-sm font-bold text-white mt-1">{contest.entryFee} PTS</p>
        </div>
        <div className="bg-slate-800/50 rounded-md p-2 text-center shadow">
            <p className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400"><Star size={12} /> Prize</p>
            <p className="text-sm font-bold text-yellow-400 mt-1">₹{contest.totalPrize}</p>
        </div>
        <div className="bg-slate-800/50 rounded-md p-2 text-center shadow">
            <p className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400"><Swords size={12} /> Per Kill</p>
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
            <p className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400"><Clock size={12} /> Start</p>
            <p className="text-xs font-semibold text-white mt-1">
                {new Date(contest.startTime).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit", hour12: true })}
            </p>
        </div>
        <div className="bg-slate-800/50 rounded-md p-2 text-center shadow">
            <p className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400"><Users size={12} /> Players</p>
            <p className="text-xs font-semibold text-white mt-1">{contest.totalParticipants}</p>
        </div>
        <div className="bg-slate-800/50 rounded-md p-2 text-center shadow">
            <p className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400"><Map size={12} /> Map</p>
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

export default ContestCard;