import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Mail, Loader2, CheckCircle } from "lucide-react";

const AdminForgotPassword = () => {
  const [emailOrMobile, setEmailOrMobile] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const config = {
        headers: { "Content-Type": "application/json" },
      };

      // This API endpoint will be created in the next step on the backend
      await axios.post(
        `${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/admin/forgot-password`,
        { emailOrMobile },
        config,
      );

      // For security, we always show a generic success message
      setMessage(
        "If an account with that email or mobile exists, a password reset link has been sent.",
      );
      setEmailOrMobile("");
    } catch (err) {
      // For security, we also show a generic error message
      setError("There was an issue processing your request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const customStyles = `
        @import url('https://fonts.googleapis.com/css2?family=Teko:wght@700&family=Inter:wght@400;600;700&display=swap');
        :root { --color-red: #ff3b3b; --color-blue: #3b82f6; --color-sky: #87ceeb; --bg-primary: #0a0a0f; --bg-secondary: #121218; --border-color: #27272a; }
        .font-display { font-family: 'Teko', sans-serif; }
        .font-sans { font-family: 'Inter', sans-serif; }
        .text-gradient-animated { background: linear-gradient(90deg, #ff3b3b, #3b82f6, #87ceeb, #ff3b3b); background-size: 300% auto; -webkit-background-clip: text; background-clip: text; color: transparent; animation: gradient-shine 4s linear infinite; }
        @keyframes gradient-shine { to { background-position: 300% center; } }
        .btn { font-weight: bold; padding: 0.8rem 1.2rem; border-radius: 0.375rem; transition: all 0.3s; display: inline-flex; align-items: center; justify-content: center; width: 100%;}
        .btn:hover { transform: translateY(-2px); }
        .btn-primary { background: linear-gradient(90deg, var(--color-red), var(--color-blue)); background-size: 200% auto; color: #fff; }
        .btn-primary:hover { background-position: right center; box-shadow: 0 0 25px rgba(59, 130, 246, 0.5); }
        .btn:disabled { cursor: not-allowed; background: #555; opacity: 0.6; transform: none; box-shadow: none; }
        .input-field { background-color: var(--bg-primary); border: 1px solid var(--border-color); color: #d1d5db; border-radius: 0.375rem; padding: 0.75rem 1rem; width: 100%; }
        .input-field:focus { outline: none; border-color: var(--color-blue); }
    `;

  return (
    <>
      <style>{customStyles}</style>
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f] font-sans p-4">
        <div className="w-full max-w-md bg-[#121218] p-8 rounded-lg border border-[#27272a]">
          <div className="text-center">
            <h1 className="text-4xl font-display uppercase tracking-wider text-white">
              Reset <span className="text-gradient-animated">Password</span>
            </h1>
            <p className="text-gray-500 mt-2">
              Enter your email or mobile to receive a reset link
            </p>
          </div>

          {message ? (
            <div className="mt-8 text-center p-4 bg-green-900/50 border border-green-500/30 rounded-lg">
              <CheckCircle className="mx-auto text-green-400" size={40} />
              <p className="mt-3 text-green-300">{message}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div>
                <label
                  htmlFor="emailOrMobile"
                  className="block text-sm font-semibold text-gray-400 mb-2"
                >
                  Admin Email or Mobile
                </label>
                {/* UPDATED: Icon removed and layout simplified */}
                <input
                  id="emailOrMobile"
                  type="text"
                  placeholder="Enter your email or mobile number"
                  value={emailOrMobile}
                  onChange={(e) => setEmailOrMobile(e.target.value)}
                  className="input-field w-full"
                  required
                />
              </div>

              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "Send Reset Link"
                  )}
                </button>
              </div>
            </form>
          )}

          <p className="mt-6 text-center text-gray-500">
            Remember your password?{" "}
            <Link
              to="/admin/login"
              className="font-semibold text-blue-500 hover:text-blue-400"
            >
              Log In
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default AdminForgotPassword;
