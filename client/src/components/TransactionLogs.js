import React, { useState } from 'react';
// [FIX] 'axios' ko hatakar 'api' ko import kiya gaya hai
import api from '../api'; 
import { Search } from 'lucide-react';

function TransactionLogs() {
    const [searchTerm, setSearchTerm] = useState('');
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [searchedUser, setSearchedUser] = useState('');

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchTerm) {
            setError('Please enter a UserID to search.');
            return;
        }
        setLoading(true);
        setError('');
        setTransactions([]);
        setSearchedUser(searchTerm);

        try {
            // [FIX] Manual token handling aur config object hata diya gaya hai
            // 'axios.get' ko 'api.get' se badla gaya hai aur URL theek kiya gaya hai
            const { data } = await api.get(`/api/admin/transactions?search=${searchTerm}`);
            setTransactions(data);

        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch transactions.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2 className="text-3xl font-bold text-white mb-6">Transaction Logs</h2>
            
            {/* Search Bar */}
            <div className="bg-gray-800/50 p-6 rounded-xl mb-6">
                <form onSubmit={handleSearch} className="flex gap-2">
                    <div className="relative flex-grow">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:border-purple-500"
                            placeholder="Find transactions by UserID..."
                        />
                    </div>
                    <button type="submit" disabled={loading} className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:opacity-50">
                        {loading ? 'Searching...' : 'Search'}
                    </button>
                </form>
            </div>

            {/* Loading and Error States */}
            {loading && <p className="text-center text-gray-400">Loading transactions...</p>}
            {error && !loading && <p className="text-center text-red-500">{error}</p>}
            
            {/* Transactions Table */}
            {transactions.length > 0 && (
                <div className="bg-gray-800/50 rounded-xl overflow-hidden animate-fade-in">
                    <h3 className="text-xl font-semibold text-white p-4 border-b border-gray-700">History for: {searchedUser}</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-800">
                                <tr>
                                    <th className="p-4 text-sm font-semibold text-gray-300 uppercase tracking-wider">Date & Time</th>
                                    <th className="p-4 text-sm font-semibold text-gray-300 uppercase tracking-wider">Description</th>
                                    <th className="p-4 text-sm font-semibold text-gray-300 uppercase tracking-wider">Type</th>
                                    <th className="p-4 text-sm font-semibold text-gray-300 uppercase tracking-wider">Amount</th>
                                    <th className="p-4 text-sm font-semibold text-gray-300 uppercase tracking-wider">Closing Points</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                {transactions.map((tx) => (
                                    <tr key={tx._id} className="hover:bg-gray-800 transition-colors">
                                        <td className="p-4 text-gray-400 text-sm whitespace-nowrap">{new Date(tx.createdAt).toLocaleString()}</td>
                                        <td className="p-4 text-white">{tx.description}</td>
                                        <td className={`p-4 font-semibold capitalize ${tx.type === 'credit' ? 'text-green-400' : 'text-red-400'}`}>
                                            {tx.type}
                                        </td>
                                        <td className={`p-4 font-semibold whitespace-nowrap ${tx.type === 'credit' ? 'text-green-400' : 'text-red-400'}`}>
                                            {tx.type === 'credit' ? '+' : '-'} {tx.amount}
                                        </td>
                                        <td className="p-4 text-white font-bold">{tx.closingBalance}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

export default TransactionLogs;
