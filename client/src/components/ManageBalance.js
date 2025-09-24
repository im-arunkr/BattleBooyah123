import React, { useState } from "react";
// [FIX] 'axios' ko hatakar 'api' ko import kiya gaya hai
import api from "../api";
import { Search, UserCheck } from "lucide-react";

function ManageBalance() {
  const [searchTerm, setSearchTerm] = useState("");
  const [foundUser, setFoundUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const [points, setPoints] = useState("");
  const [action, setAction] = useState("add");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleFindUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    setFoundUser(null);

    try {
      // [FIX] Manual token handling aur config object hata diya gaya hai
      // 'axios.get' ko 'api.get' se badal diya gaya hai
      const { data } = await api.get(`/api/admin/users?search=${searchTerm}`);

      if (data && data.length > 0) {
        setFoundUser(data[0]);
      } else {
        setError("No user found with this UserID or Mobile Number.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to find user.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBalance = async (e) => {
    e.preventDefault();

    const numericPoints = Number(points);
    if (isNaN(numericPoints) || numericPoints <= 0) {
      setError("Please enter a valid positive number for points.");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      // [FIX] Manual token handling aur config object hata diya gaya hai
      // 'axios.post' ko 'api.post' se badal diya gaya hai
      const { data } = await api.post("/api/admin/manage-balance", {
        userId: foundUser.userId,
        points: numericPoints,
        action,
      });

      setMessage(data.message);
      setFoundUser(data.user);
      setPoints(""); // Points input ko reset karein
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update points.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-white mb-6">Manage User Points</h2>

      {/* Find User Section */}
      <div className="bg-gray-800/50 p-6 rounded-xl mb-6">
        <form onSubmit={handleFindUser} className="flex gap-2">
          <div className="relative flex-grow">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:border-purple-500"
              placeholder="Find by UserID or Mobile Number..."
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? "Searching..." : "Find User"}
          </button>
        </form>
      </div>

      {/* Display Found User and Manage Balance Form */}
      {foundUser && (
        <div className="bg-gray-800/50 p-6 rounded-xl animate-fade-in">
          <div className="flex items-center gap-3 border-b border-gray-700 pb-4 mb-4">
            <UserCheck size={24} className="text-green-400" />
            <div>
              <p className="text-white font-bold text-lg">{foundUser.userId}</p>
              <p className="text-gray-400 text-sm">
                Current Points:{" "}
                <span className="text-green-400 font-semibold">
                  {foundUser.points}
                </span>
              </p>
            </div>
          </div>

          <form onSubmit={handleUpdateBalance}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 text-sm font-bold mb-2">
                  Action
                </label>
                <div className="flex gap-4 p-2 bg-gray-900 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setAction("add")}
                    className={`flex-1 py-2 rounded-md transition-colors ${action === "add" ? "bg-green-600 text-white" : "bg-gray-700 text-gray-300"}`}
                  >
                    Add Points
                  </button>
                  <button
                    type="button"
                    onClick={() => setAction("subtract")}
                    className={`flex-1 py-2 rounded-md transition-colors ${action === "subtract" ? "bg-red-600 text-white" : "bg-gray-700 text-gray-300"}`}
                  >
                    Withdrawal
                  </button>
                </div>
              </div>
              <div>
                <label
                  className="block text-gray-300 text-sm font-bold mb-2"
                  htmlFor="points"
                >
                  Points
                </label>
                <input
                  id="points"
                  type="number"
                  value={points}
                  onChange={(e) => setPoints(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-purple-500"
                  placeholder="Enter points"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full bg-gradient-to-r from-orange-500 to-purple-600 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update Points"}
            </button>
          </form>
        </div>
      )}

      {/* Messages */}
      <div className="text-center mt-4 h-6">
        {message && <p className="text-green-400">{message}</p>}
        {error && <p className="text-red-500">{error}</p>}
      </div>
    </div>
  );
}

export default ManageBalance;
