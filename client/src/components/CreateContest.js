import React, { useState } from "react";
// Icons import karein
import { Map, Swords, User, ArrowLeft } from "lucide-react";
// [NEW] Naye form components ko import karein
import CreateBRContestForm from "./CreateBRContestForm";
// import CreateCSContestForm from './CreateCSContestForm'; // Baad me uncomment karenge
// import CreateLWContestForm from './CreateLWContestForm'; // Baad me uncomment karenge

// Mode selection card ke liye component
const ModeCard = ({ title, description, icon, onClick }) => (
  <button
    onClick={onClick}
    className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6 text-left w-full h-full transform hover:-translate-y-1 transition-all duration-300 hover:border-purple-500 hover:shadow-lg hover:shadow-purple-500/10"
  >
    <div className="flex items-center gap-4 mb-3">
      <div className="bg-gray-900 p-3 rounded-lg">{icon}</div>
      <div>
        <h3 className="text-lg font-bold text-white">{title}</h3>
        <p className="text-sm text-gray-400">{description}</p>
      </div>
    </div>
  </button>
);

function CreateContest() {
  const [selectedMode, setSelectedMode] = useState(null);

  // Agar koi mode select nahi hua hai, to selection screen dikhayein
  if (!selectedMode) {
    return (
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">
          Create New Contest
        </h2>
        <p className="text-gray-400 mb-8">Step 1: Select a Game Mode</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ModeCard
            title="Battle Royale"
            description="Classic full map survival."
            icon={<Map size={24} className="text-orange-400" />}
            onClick={() => setSelectedMode("Battle Royale")}
          />
          <ModeCard
            title="Clash Squad"
            description="Fast-paced 4v4 combat."
            icon={<Swords size={24} className="text-red-400" />}
            onClick={() => setSelectedMode("Clash Squad")}
          />
          <ModeCard
            title="Lone Wolf"
            description="Intense 1v1 or 2v2 duels."
            icon={<User size={24} className="text-blue-400" />}
            onClick={() => setSelectedMode("Lone Wolf")}
          />
        </div>
      </div>
    );
  }

  // Agar koi mode select ho gaya hai, to uske liye sahi form dikhayein
  return (
    <div>
      {/* [UPDATED] Yahan par mode ke hisab se form render hoga */}
      {selectedMode === "Battle Royale" && (
        <CreateBRContestForm
          mode={selectedMode}
          onBack={() => setSelectedMode(null)}
        />
      )}

      {/* Baaki modes ke liye placeholders */}
      {selectedMode === "Clash Squad" && (
        <div>
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => setSelectedMode(null)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
            <div>
              <h2 className="text-3xl font-bold text-white">
                Create a <span className="text-purple-400">Clash Squad</span>{" "}
                Contest
              </h2>
              <p className="text-gray-400">This form is under development.</p>
            </div>
          </div>
          <div className="bg-gray-800/50 p-8 rounded-xl">
            <p>Clash Squad Form coming soon...</p>
          </div>
        </div>
      )}
      {selectedMode === "Lone Wolf" && (
        <div>
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => setSelectedMode(null)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
            <div>
              <h2 className="text-3xl font-bold text-white">
                Create a <span className="text-purple-400">Lone Wolf</span>{" "}
                Contest
              </h2>
              <p className="text-gray-400">This form is under development.</p>
            </div>
          </div>
          <div className="bg-gray-800/50 p-8 rounded-xl">
            <p>Lone Wolf Form coming soon...</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default CreateContest;
