import React from 'react';
import { Link } from 'react-router-dom';
import { Tag, Star, Swords, Users, Clock, MapPin } from 'lucide-react';

// Use the single consistent icon
import contestIcon from '../images/contest-icon.png';

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
                    src={contestIcon}
                    alt="game icon"
                    className="w-6 h-6 rounded-md"
                />
                <div className="text-base font-bold text-white truncate">
                    ⚔️ {contest.gameTitle || contest.title}
                </div>
            </div>
            <div className="grid grid-cols-3 gap-2 p-2 border-b border-gray-700/50">
                <div className="bg-slate-800/50 rounded-md p-1 text-center shadow">
                    <p className="flex items-center justify-center gap-1 text-[10px] text-gray-400"><Tag size={12} /> Entry</p>
                    <p className="text-xs font-bold text-white mt-0.5">{contest.entryFee} PTS</p>
                </div>
                <div className="bg-slate-800/50 rounded-md p-1 text-center shadow">
                    <p className="flex items-center justify-center gap-1 text-[10px] text-gray-400"><Star size={12} /> Prize</p>
                    <p className="text-xs font-bold text-yellow-400 mt-0.5">₹{contest.totalPrize || contest.prizePool}</p>
                </div>
                <div className="bg-slate-800/50 rounded-md p-1 text-center shadow">
                    <p className="flex items-center justify-center gap-1 text-[10px] text-gray-400"><Swords size={12} /> Per Kill</p>
                    <p className="text-xs font-bold text-white mt-0.5">₹{contest.perKillReward || 0}</p>
                </div>
            </div>
            <div className="px-2 pt-2 flex-grow">
                <div className="h-1.5 rounded bg-gray-700 overflow-hidden">
                    <div className="h-full bg-green-500" style={{ width: `${percentFilled}%` }}></div>
                </div>
                <p className="text-[10px] text-right text-gray-400">Filled {contest.players.length}/{contest.totalParticipants}</p>
            </div>
            <div className="grid grid-cols-3 gap-2 p-2">
                <div className="text-center">
                    <p className="flex items-center justify-center gap-1 text-[10px] text-gray-400"><Clock size={12} /> Start</p>
                    <p className="text-[11px] font-semibold text-white">{new Date(contest.startTime).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</p>
                </div>
                <div className="text-center">
                    <p className="flex items-center justify-center gap-1 text-[10px] text-gray-400"><Users size={12} /> Players</p>
                    <p className="text-[11px] font-semibold text-white">{contest.totalParticipants}</p>
                </div>
                <div className="text-center">
                    <p className="flex items-center justify-center gap-1 text-[10px] text-gray-400"><MapPin size={12} /> Map</p>
                    <p className="text-[11px] font-semibold text-white truncate">{contest.map}</p>
                </div>
            </div>
            {getButton()}
        </div>
    );
};

export default MyContestCard;