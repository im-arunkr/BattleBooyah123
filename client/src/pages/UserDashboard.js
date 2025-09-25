import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api"; 
import {
  Instagram,
  Youtube,
  Github,
  Wallet,
  Skull,
  Swords,
  Crown,
  Loader2,
} from "lucide-react";

import BottomNav from "../components/BottomNav";

// --- Custom Hook for Mobile Detection ---
const useIsMobile = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < breakpoint);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [breakpoint]);
  return isMobile;
};

// --- Generic Carousel Component ---
const AutoCarousel = ({ items, renderItem, sectionName }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % items.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [items.length]);

  useEffect(() => {
    if (scrollRef.current) {
      const scrollContainer = scrollRef.current;
      const itemWidth = scrollContainer.scrollWidth / items.length;
      scrollContainer.scrollTo({
        left: itemWidth * activeIndex,
        behavior: "smooth",
      });
    }
  }, [activeIndex, items.length]);

  return (
    <div>
      <div
        ref={scrollRef}
        className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar"
      >
        {items.map((item, index) => (
          <div
            key={`${sectionName}-${index}`}
            className="w-full flex-shrink-0 snap-center px-3"
          >
            {renderItem(item, index)}
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-2 mt-6">
        {items.map((_, index) => (
          <button
            key={`dot-${sectionName}-${index}`}
            onClick={() => setActiveIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`w-2 h-2 rounded-full transition-colors duration-300 ${
              activeIndex === index
                ? "bg-blue-500"
                : "bg-gray-600 hover:bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

const UserDashboard = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, duration = 3000) => {
    if (!notification) {
      setNotification(message);
      setTimeout(() => setNotification(null), duration);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await api.get("/api/users/me");
        setUser(userResponse.data);
      } catch (error) {
        console.error("Failed to fetch user data", error);
        localStorage.removeItem("user_token");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  const gameModes = [
    {
      icon: <Skull size={52} className="text-red-400" />,
      title: "Battle Royale",
      desc: "High stakes, high rewards. Be the last one standing.",
      imageUrl:
        "https://images.pexels.com/photos/7862599/pexels-photo-7862599.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    },
    {
      icon: <Swords size={52} className="text-blue-400" />,
      title: "Clash Squad",
      desc: "Teamwork and strategy are key to dominating the opposition.",
      imageUrl:
        "https://images.pexels.com/photos/15091942/pexels-photo-15091942/free-photo-of-man-in-a-gas-mask-and-a-black-hoodie.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    },
    {
      icon: <Crown size={52} className="text-yellow-400" />,
      title: "Lone Wolf",
      desc: "A pure test of skill. Raw aim decides the winner.",
      imageUrl:
        "https://images.pexels.com/photos/8100784/pexels-photo-8100784.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      route: "/games/lone-wolf",
    },
  ];

  const creatableModes = [
    {
      icon: <Swords size={32} />,
      title: "Clash Squad",
      desc: "Host freestyle tournaments for your squad. Create custom 1v1, 2v2, or full 4v4 battles and prove your team's dominance.",
    },
    {
      icon: <Crown size={32} />,
      title: "Lone Wolf",
      desc: "Settle the score with pure skill. Set up your own 1v1 or 2v2 Lone Wolf challenges and find out who is the true champion.",
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("user_token");
    navigate("/login");
  };

  const customStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Teko:wght@400;700&family=Inter:wght@400;600;700&display=swap');
    :root { --color-red: #ff3b3b; --color-blue: #3b82f6; --color-sky: #87ceeb; --bg-primary: #0a0a0f; --bg-secondary: #121218; --border-color: #27272a; }
    html { scroll-behavior: smooth; }
    body { background-color: var(--bg-primary); background-image: url('https://www.transparenttextures.com/patterns/asfalt-dark.png'), linear-gradient(180deg, var(--bg-primary) 0%, var(--bg-secondary) 100%); background-repeat: repeat; background-attachment: fixed; color: #d1d5db; }
    .font-display { font-family: 'Teko', sans-serif; }
    .font-sans { font-family: 'Inter', sans-serif; }
    .text-gradient-animated { background: linear-gradient(90deg, var(--color-red), var(--color-blue), var(--color-sky), var(--color-red)); background-size: 300% auto; -webkit-background-clip: text; background-clip: text; color: transparent; animation: gradient-shine 4s linear infinite; }
    @keyframes gradient-shine { to { background-position: 300% center; } }
    .card-sharp { background-color: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 0.5rem; position: relative; overflow: hidden; transition: transform 0.3s ease, border-color 0.3s ease; height: 100%; }
    .card-sharp:hover { transform: translateY(-8px) scale(1.02); border-color: #555; }
    .angled-section { position: relative; padding: 3rem 0; } 
    .angled-section::before { content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-color: var(--bg-secondary); transform: skewY(-2deg); z-index: -1; }
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    .cursor-pointer { cursor: pointer; }
    .toast-center { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); color: #fff; font-weight: 600; font-size: 1.125rem; text-align: center; z-index: 1000; }
  `;

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "var(--bg-primary)" }}
      >
        <Loader2 className="animate-spin text-blue-500" size={48} />
      </div>
    );
  }

  return (
    <>
      <style>{customStyles}</style>
      <div className="bg-primary text-gray-300 font-sans">
        {notification && <div className="toast-center">{notification}</div>}

        {/* Header */}
        <header className="fixed top-0 left-0 w-full z-50 bg-primary/80 backdrop-blur-md border-b border-border-color">
          <div className="container mx-auto px-6 py-3 flex justify-between items-center">
            <Link
              to="/"
              className="text-3xl font-display font-bold tracking-wider text-white"
            >
              Battle
              <span className="text-gradient-animated">Booyah</span>
            </Link>
            <div className="flex items-center gap-4 md:gap-6">
              <div className="flex items-center gap-2 bg-secondary border border-border-color px-3 py-1 rounded-lg">
                <Wallet className="text-blue-400" size={20} />
                <span className="font-bold text-white text-sm">
                  ₹{user?.points?.toFixed(2) || "0.00"}
                </span>
              </div>
            </div>
          </div>
        </header>

        <main className="pt-20 pb-12">
          {/* Welcome Section */}
          <section className="container mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-display uppercase tracking-wider">
              Welcome Back,{" "}
              <span className="text-gradient-animated">
                {user?.userId || "Player"}
              </span>
            </h1>
            <p className="mt-2 text-lg text-gray-400">
              Ready to dominate the battlefield?
            </p>
          </section>

          {/* Game Mode Selection */}
          <section className="container mx-auto px-6 mt-16">
            <div className="grid md:grid-cols-3 gap-8">
              {gameModes.map((mode) => (
                <Link
                  key={mode.title}
                  to={`/games/${mode.title.toLowerCase().replace(/\s+/g, "-")}`}
                  style={{ backgroundImage: `url(${mode.imageUrl})` }}
                  className="group card-sharp block bg-cover bg-center h-80 p-0"
                >
                  <div className="absolute inset-0 bg-black/60 group-hover:bg-black/70 transition-colors duration-300 rounded-md"></div>
                  <div className="relative z-10 flex flex-col text-center items-center justify-center h-full p-8">
                    <div className="mb-4">{mode.icon}</div>
                    <h3 className="font-display text-4xl uppercase tracking-wider text-white mb-3">
                      {mode.title}
                    </h3>
                    <p className="font-sans text-gray-300">{mode.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Create Your Own Contest Section */}
          <div className="angled-section mt-12">
            <section className="container mx-auto px-0 relative z-100 text-center">
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display leading-tight text-gradient-animated">
                Create Your Own Contest
              </h2>
              <div className="mt-8">
                {isMobile ? (
                  <AutoCarousel
                    sectionName="creatable-modes"
                    items={creatableModes}
                    renderItem={(item) => (
                      <div
                        className="w-full cursor-pointer relative"
                        onClick={() =>
                          showNotification("Feature coming soon, stay tuned.")
                        }
                      >
                        <div className="flex flex-col items-center justify-center p-6">
                          <div className="p-4 rounded-full text-blue-400 mb-4">
                            {item.icon}
                          </div>
                          <h3 className="text-2xl font-display text-gradient-animated">
                            {item.title}
                          </h3>
                          <p className="mt-2 text-gray-400 text-center">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    )}
                  />
                ) : (
                  <div className="flex flex-col sm:flex-row gap-8 text-left">
                    {creatableModes.map((mode, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-4 flex-1 cursor-pointer"
                        onClick={() =>
                          showNotification("Feature coming soon, stay tuned.")
                        }
                      >
                        <div className="p-3 rounded-lg text-blue-400 mt-1 flex-shrink-0">
                          {mode.icon}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gradient-animated">
                            {mode.title}
                          </h3>
                          <p className="text-gray-400 mt-1">{mode.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-black border-t border-border-color pt-12 pb-8">
          <div className="container mx-auto px-6">
            {isMobile ? (
              <div className="text-center text-gray-500">
                <h3 className="text-3xl font-display font-bold text-gradient-animated">
                  Battle<span className="text-gradient-animated">Booyah</span>
                </h3>
                <p className="mt-2 max-w-sm mx-auto text-sm">
                  India's premier esports destination. Compete, win, and rise
                  to the top.
                </p>
                <div className="flex justify-center gap-6 mt-6">
                  <a
                    href="https://www.instagram.com/im_arunkr/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Instagram />
                  </a>
                  <a
                    href="https://github.com/im-arunkr"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github />
                  </a>
                  <a
                    href="https://www.youtube.com/@arungaming4323"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Youtube />
                  </a>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="col-span-1 md:col-span-2">
                  <h3 className="text-3xl font-display font-bold text-gradient-animated">
                    Battle
                    <span className="text-gradient-animated">Booyah</span>
                  </h3>
                  <p className="mt-2 text-gray-500 max-w-sm">
                    India's premier esports destination. Compete, win, and
                    rise to the top of the leaderboards.
                  </p>
                  <div className="flex gap-4 mt-4">
                    <Instagram />
                    <Github />
                    <Youtube />
                  </div>
                </div>
              </div>
            )}
          </div>
        </footer>

        <BottomNav />
      </div>
    </>
  );
};

export default UserDashboard;
