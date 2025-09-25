import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import { Wallet, Loader2, ThumbsUp, Check } from 'lucide-react';
import BottomNav from '../components/BottomNav';

const ClashSquadPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- State for the voting system ---
  const [voteCount, setVoteCount] = useState(0);
  const [hasVoted, setHasVoted] = useState(false);
  const [isVoting, setIsVoting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // user + votes API
        const [userResponse, voteResponse] = await Promise.all([
          api.get('/api/users/me'),
          api.get('/api/votes/Clash%20Squad'),
        ]);

        setUser(userResponse.data);
        setVoteCount(voteResponse.data.totalVotes);
        setHasVoted(voteResponse.data.hasVoted);
      } catch (error) {
        console.error('Failed to fetch page data', error);

        // logout sirf tab jab user API fail ho
        if (error.response?.status === 401) {
          localStorage.removeItem('user_token');
          navigate('/login');
        } else {
          alert(error.response?.data?.message || 'Could not load page data.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  const handleVote = async () => {
    setIsVoting(true);
    try {
      const { data } = await api.post('/api/votes/Clash%20Squad');
      setVoteCount(data.totalVotes);
      setHasVoted(true);
    } catch (error) {
      console.error('Failed to cast vote', error);
      alert(error.response?.data?.message || 'Could not cast vote.');
    } finally {
      setIsVoting(false);
    }
  };

  const customStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Teko:wght@700&family=Inter:wght@400;600;700&display=swap');
    .font-display { font-family: 'Teko', sans-serif; }
    .font-sans { font-family: 'Inter', sans-serif; }
    .text-gradient-animated { background: linear-gradient(90deg, #ff3b3b, #3b82f6, #87ceeb, #ff3b3b); background-size: 300% auto; -webkit-background-clip: text; background-clip: text; color: transparent; animation: gradient-shine 4s linear infinite; }
    @keyframes gradient-shine { to { background-position: 300% center; } }
  `;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f]">
        <Loader2 className="animate-spin text-blue-500" size={48} />
      </div>
    );
  }

  return (
    <>
      <style>{customStyles}</style>
      <div className="min-h-screen bg-[#0a0a0f] font-sans text-white pb-24">
        {/* Header */}
        <header className="fixed top-0 left-0 w-full z-40 bg-[#0a0a0f]/80 backdrop-blur-md border-b border-[#27272a]">
          <div className="container mx-auto px-6 py-3 flex justify-between items-center">
            <Link
              to="/dashboard"
              className="text-3xl font-display font-bold tracking-wider text-white"
            >
              Battle<span className="text-gradient-animated">Booyah</span>
            </Link>
            <div className="flex items-center gap-2 bg-[#121218] border border-[#27272a] px-3 py-1.5 rounded-lg">
              <Wallet className="text-blue-400" size={20} />
              <span className="font-bold text-white text-sm">
                ₹{user?.points?.toFixed(2) || '0.00'}
              </span>
            </div>
          </div>
        </header>

        {/* Main */}
        <main className="container mx-auto px-6 pt-28 pb-16 text-center flex flex-col items-center">
          <h1 className="text-5xl md:text-7xl font-display uppercase tracking-wider text-gradient-animated">
            Clash Squad Arena
          </h1>
          <p className="mt-2 text-lg text-gray-400">Intense 4v4 combat. Coming Soon!</p>

          {/* Voting Box */}
          <div className="mt-12 p-8 bg-[#121218] border border-[#27272a] rounded-xl max-w-2xl w-full shadow-lg">
            <h2 className="text-2xl font-bold text-white">
              Want to play Clash Squad contests?
            </h2>
            <p className="text-gray-400 mt-2">
              Vote now to let us know you're interested! The more votes we get, the sooner we'll launch it.
            </p>

            <div className="mt-6">
              <button
                onClick={handleVote}
                disabled={hasVoted || isVoting}
                className={`w-full max-w-xs mx-auto flex items-center justify-center gap-3 font-bold py-3 px-6 rounded-lg text-lg transition-all duration-300
                  ${
                    hasVoted
                      ? 'bg-green-600 text-white cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/30 disabled:opacity-50'
                  }`}
              >
                {isVoting ? (
                  <Loader2 className="animate-spin" />
                ) : hasVoted ? (
                  <>
                    <Check size={24} /> Voted!
                  </>
                ) : (
                  <>
                    <ThumbsUp size={24} /> Vote for Clash Squad
                  </>
                )}
              </button>
            </div>
            <p className="mt-4 text-gray-500 text-sm">
              Total Votes: <span className="font-bold text-white">{voteCount}</span>
            </p>
          </div>
        </main>

        <BottomNav />
      </div>
    </>
  );
};

export default ClashSquadPage;
