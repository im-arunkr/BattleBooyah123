import React, { useState } from "react";
// [FIX] 'axios' ko hatakar 'api' ko import kiya gaya hai
import api from "../api";
import { ArrowLeft, User, Users, Shield } from "lucide-react";

// Team Type selection card ke liye component
const TeamTypeCard = ({ title, icon, onClick }) => (
  <button
    onClick={onClick}
    className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4 sm:p-6 text-center w-full transform hover:-translate-y-1 transition-all duration-300 hover:border-purple-500 hover:shadow-lg hover:shadow-purple-500/10"
  >
    <div className="flex flex-col items-center gap-3">
      {icon}
      <h3 className="text-md sm:text-lg font-bold text-white">{title}</h3>
    </div>
  </button>
);

// Form field ke liye ek alag component
const FormField = ({
  label,
  id,
  type,
  value,
  onChange,
  placeholder,
  required = true,
}) => {
  return (
    <div>
      <label
        className="block text-gray-300 text-xs sm:text-sm font-bold mb-2"
        htmlFor={id}
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full bg-gray-900 border border-gray-700 rounded-lg py-2 px-3 sm:py-2.5 sm:px-4 text-white focus:outline-none focus:border-purple-500"
      />
    </div>
  );
};

// Dropdown/Select field ke liye component
const SelectField = ({ label, id, value, onChange, children }) => (
  <div>
    <label
      className="block text-gray-300 text-xs sm:text-sm font-bold mb-2"
      htmlFor={id}
    >
      {label}
    </label>
    <select
      id={id}
      value={value}
      onChange={onChange}
      className="w-full bg-gray-900 border border-gray-700 rounded-lg py-2 px-3 sm:py-2.5 sm:px-4 text-white focus:outline-none focus:border-purple-500"
    >
      {children}
    </select>
  </div>
);

function CreateBRContestForm({ mode, onBack }) {
  const [teamType, setTeamType] = useState(null);

  // Form fields ke liye state
  const [viewType, setViewType] = useState("TPP");
  const [customContestId, setCustomContestId] = useState("");
  const [gameTitle, setGameTitle] = useState("");
  const [entryFee, setEntryFee] = useState("");
  const [totalPrize, setTotalPrize] = useState("");
  const [perKillReward, setPerKillReward] = useState("");
  const [map, setMap] = useState("Bermuda");

  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [ampm, setAmPm] = useState("AM");

  const [totalParticipants, setTotalParticipants] = useState(48);
  const [prizeBreakup, setPrizeBreakup] = useState("");
  const [bonusUsable, setBonusUsable] = useState("");

  // Loading aur messages ke liye state
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    // Time ko 24-hour format me convert karein
    let militaryHour = parseInt(startTime.split(":")[0], 10);
    const minute = startTime.split(":")[1];

    if (ampm === "PM" && militaryHour < 12) {
      militaryHour += 12;
    }
    if (ampm === "AM" && militaryHour === 12) {
      // Midnight case (12 AM -> 00)
      militaryHour = 0;
    }

    const fullStartTime = new Date(
      `${startDate}T${String(militaryHour).padStart(2, "0")}:${minute}:00`,
    );

    const contestData = {
      gameMode: mode,
      teamType,
      viewType,
      customContestId,
      gameTitle,
      entryFee,
      totalPrize,
      perKillReward,
      map,
      startTime: fullStartTime,
      totalParticipants,
      prizeBreakup,
      bonusUsable,
    };

    try {
      // [FIX] 'axios' ko 'api' se badla gaya aur manual token ko hataya gaya
      const { data } = await api.post("/api/admin/contests", contestData);

      setMessage(data.message);
      // Form ko reset karein
      setGameTitle("");
      setEntryFee("");
      setTotalPrize("");
      // ... baaki fields bhi reset kar sakte hain
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create contest.");
    } finally {
      setLoading(false);
    }
  };

  // Agar teamType select nahi hua hai, to selection screen dikhayein
  if (!teamType) {
    return (
      <div className="bg-gray-800/50 p-4 sm:p-8 rounded-xl animate-fade-in">
        <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
          <button
            onClick={onBack}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Select Battle Royale Type
            </h2>
            <p className="text-gray-400 text-sm">
              Choose a format for the contest
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <TeamTypeCard
            title="Solo"
            icon={<User size={28} className="text-white" />}
            onClick={() => setTeamType("Solo")}
          />
          <TeamTypeCard
            title="Duo"
            icon={<Users size={28} className="text-white" />}
            onClick={() => setTeamType("Duo")}
          />
          <TeamTypeCard
            title="Squad"
            icon={<Shield size={28} className="text-white" />}
            onClick={() => setTeamType("Squad")}
          />
        </div>
      </div>
    );
  }

  // Agar teamType select ho gaya hai, to form dikhayein
  return (
    <div className="bg-gray-800/50 p-4 sm:p-8 rounded-xl animate-fade-in">
      <style>{`
                input[type="date"]::-webkit-calendar-picker-indicator,
                input[type="time"]::-webkit-calendar-picker-indicator {
                    filter: invert(1);
                    cursor: pointer;
                }
            `}</style>
      <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
        <button
          onClick={() => setTeamType(null)}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            Create <span className="text-purple-400">{teamType}</span> Contest
          </h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <SelectField
            label="Select View Type"
            id="viewType"
            value={viewType}
            onChange={(e) => setViewType(e.target.value)}
          >
            <option value="TPP">TPP</option>
            <option value="FPP">FPP</option>
          </SelectField>

          <FormField
            label="Custom Contest ID (Optional)"
            id="customContestId"
            type="text"
            value={customContestId}
            onChange={(e) => setCustomContestId(e.target.value)}
            placeholder="Leave blank for auto-generated"
            required={false}
          />

          <FormField
            label="Game Title"
            id="gameTitle"
            type="text"
            value={gameTitle}
            onChange={(e) => setGameTitle(e.target.value)}
            placeholder="e.g., Weekend Bonanza"
          />

          <FormField
            label="Entry Fee (Points)"
            id="entryFee"
            type="number"
            value={entryFee}
            onChange={(e) => setEntryFee(e.target.value)}
            placeholder="e.g., 50"
          />

          <FormField
            label="Total Prize (Points)"
            id="totalPrize"
            type="number"
            value={totalPrize}
            onChange={(e) => setTotalPrize(e.target.value)}
            placeholder="e.g., 2000"
          />

          <FormField
            label="Per Kill Reward (Points)"
            id="perKillReward"
            type="number"
            value={perKillReward}
            onChange={(e) => setPerKillReward(e.target.value)}
            placeholder="e.g., 5"
          />

          <SelectField
            label="Map"
            id="map"
            value={map}
            onChange={(e) => setMap(e.target.value)}
          >
            <option value="Bermuda">Bermuda</option>
            <option value="Kalahari">Kalahari</option>
            <option value="Purgatory">Purgatory</option>
            <option value="Alpine">Alpine</option>
          </SelectField>

          {/* Single Start Time Field (Date + Time + AM/PM) */}
          <div>
            <label
              className="block text-gray-300 text-xs sm:text-sm font-bold mb-2"
              htmlFor="startTime"
            >
              Start Time
            </label>
            <div className="flex gap-2">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="flex-1 bg-gray-900 border border-gray-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-purple-500"
                required
              />
              <input
                id="startTime"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="flex-1 bg-gray-900 border border-gray-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-purple-500"
                required
              />
              <select
                value={ampm}
                onChange={(e) => setAmPm(e.target.value)}
                className="w-24 bg-gray-900 border border-gray-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-purple-500"
              >
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </div>
          </div>

          <FormField
            label="Total Participants"
            id="totalParticipants"
            type="number"
            value={totalParticipants}
            onChange={(e) => setTotalParticipants(e.target.value)}
          />

          <FormField
            label="Prize Pool Breakup"
            id="prizeBreakup"
            type="text"
            value={prizeBreakup}
            onChange={(e) => setPrizeBreakup(e.target.value)}
            placeholder="e.g. 1:100,2:50,3:25"
          />

          <FormField
            label="Bonus Usable (%)"
            id="bonusUsable"
            type="text"
            value={bonusUsable}
            onChange={(e) => setBonusUsable(e.target.value)}
            placeholder="e.g., 10"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-8 w-full bg-gradient-to-r from-orange-500 to-purple-600 text-white font-bold py-3 px-4 rounded-lg transition-all disabled:opacity-50"
        >
          {loading ? "Creating..." : `Create ${teamType} Contest`}
        </button>

        {/* Success and Error messages */}
        {message && (
          <p className="mt-4 text-center text-green-400">{message}</p>
        )}
        {error && <p className="mt-4 text-center text-red-500">{error}</p>}
      </form>
    </div>
  );
}

export default CreateBRContestForm;
