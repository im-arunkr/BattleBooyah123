import React, { useState, useEffect, useCallback } from "react";
// [FIX] 'axios' ko hatakar 'api' ko import kiya gaya hai
import api from "../api";
import { Trash2, Edit, Search, FileClock, X } from "lucide-react"; // Icons for actions

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = useCallback(async (query) => {
    setLoading(true);
    setError("");
    try {
      // [FIX] Manual token handling aur config object hata diya gaya hai
      // 'axios.get' ko 'api.get' se badla gaya hai aur URL theek kiya gaya hai
      const { data } = await api.get(`/api/admin/users?search=${query}`);
      setUsers(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch users.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers("");
  }, [fetchUsers]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers(searchTerm);
  };

  const handleReset = () => {
    setSearchTerm("");
    fetchUsers("");
  };

  const handleDeleteUser = async (userIdToDelete) => {
    // NOTE: window.confirm might not work in all environments (like iframes).
    // Consider replacing this with a custom modal in the future.
    if (
      window.confirm(
        "Are you sure you want to delete this user? This action cannot be undone.",
      )
    ) {
      try {
        // [FIX] Manual token handling aur config object hata diya gaya hai
        // 'axios.delete' ko 'api.delete' se badla gaya hai aur URL theek kiya gaya hai
        const { data } = await api.delete(`/api/admin/users/${userIdToDelete}`);
        setUsers(users.filter((user) => user._id !== userIdToDelete));
        setSuccess(data.message);
        setTimeout(() => setSuccess(""), 3000);
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Failed to delete user.";
        setError(errorMessage);
        setTimeout(() => setError(""), 3000);
      }
    }
  };

  const viewTransactions = (userId) => {
    // This is a placeholder. You might want to navigate to a new page or open a modal here.
    alert(`Viewing transaction history for user: ${userId}`);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-white">Manage Users</h2>
      </div>

      {/* Search Bar */}
      <div className="bg-gray-800/50 p-4 rounded-xl mb-6 flex items-center gap-4">
        <form onSubmit={handleSearch} className="flex-grow flex gap-2">
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
              placeholder="Search by UserID or Mobile Number..."
            />
          </div>
          <button
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            Search
          </button>
        </form>
        <button
          onClick={handleReset}
          className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
        >
          <X size={16} /> View All
        </button>
      </div>

      {/* Success and Error Messages */}
      {success && (
        <div className="text-center bg-green-500/20 text-green-400 p-3 rounded-lg mb-4">
          {success}
        </div>
      )}
      {error && (
        <div className="text-center bg-red-500/20 text-red-400 p-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {loading && <p className="text-center text-gray-400">Loading users...</p>}

      {!loading && (
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-800">
              <tr>
                <th className="p-4 text-sm font-semibold text-gray-300 uppercase tracking-wider">
                  User ID
                </th>
                <th className="p-4 text-sm font-semibold text-gray-300 uppercase tracking-wider">
                  Mobile Number
                </th>
                <th className="p-4 text-sm font-semibold text-gray-300 uppercase tracking-wider">
                  Points
                </th>
                <th className="p-4 text-sm font-semibold text-gray-300 uppercase tracking-wider">
                  Transactions
                </th>
                <th className="p-4 text-sm font-semibold text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {users.length > 0 ? (
                users.map((user) => (
                  <tr
                    key={user._id}
                    className="hover:bg-gray-800 transition-colors"
                  >
                    <td className="p-4 text-white font-medium">
                      {user.userId}
                    </td>
                    <td className="p-4 text-gray-300">{user.mobileNumber}</td>
                    <td className="p-4 text-green-400 font-semibold">
                      {user.points}
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => viewTransactions(user.userId)}
                        className="text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-2 text-sm"
                      >
                        <FileClock size={16} /> View
                      </button>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-4">
                        <button className="text-blue-400 hover:text-blue-300 transition-colors">
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          className="text-red-500 hover:text-red-400 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center p-6 text-gray-500">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ManageUsers;
