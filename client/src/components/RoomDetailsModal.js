import React from 'react';
import { AlertTriangle, Info } from "lucide-react";

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
                            You have **10 minutes** from the start time to join the custom room in the game.
                        </span>
                    </p>
                    <p className="flex items-start gap-2">
                        <Info size={24} className="text-sky-400 shrink-0" />
                        <span>
                            Please stay in your assigned slot. Changing slots can result in being kicked from the room.
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

export default RoomDetailsModal;