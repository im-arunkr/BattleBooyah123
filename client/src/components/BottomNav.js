import React from "react";
import { ListChecks, Home, Trophy, User, Gamepad2 } from "lucide-react";

const BottomNav = () => {
  const isActive = (path) => {
    if (path === "/dashboard") {
      return (
        window.location.pathname.endsWith(path) ||
        window.location.pathname.endsWith("/")
      );
    }
    return window.location.pathname.endsWith(path);
  };

  const WaveLine = () => (
    <svg className="absolute bottom-0 left-0 w-full h-16" preserveAspectRatio="none" viewBox="0 0 375 80">
      <defs>
        <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: "#ff3b3b" }} />
          <stop offset="50%" style={{ stopColor: "#3b82f6" }} />
          <stop offset="100%" style={{ stopColor: "#87ceeb" }} />
        </linearGradient>
        <linearGradient id="upperFill" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#3b82f6", stopOpacity: 0.15 }} />
          <stop offset="100%" style={{ stopColor: "transparent", stopOpacity: 0 }} />
        </linearGradient>
        <linearGradient id="lowerFill" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#121218", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#1e293b", stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      <path d="M0 40 A37.5 40 0 0 1 75 40 A37.5 40 0 0 0 150 40 
                A37.5 40 0 0 1 225 40 A37.5 40 0 0 0 300 40 
                A37.5 40 0 0 1 375 40 L375 80 L0 80 Z"
            fill="url(#lowerFill)" />
      <path d="M0 40 A37.5 40 0 0 1 75 40 A37.5 40 0 0 0 150 40 
                A37.5 40 0 0 1 225 40 A37.5 40 0 0 0 300 40 
                A37.5 40 0 0 1 375 40 L375 0 L0 0 Z"
            fill="url(#upperFill)" />
      <path d="M0 40 A37.5 40 0 0 1 75 40 A37.5 40 0 0 0 150 40 
                A37.5 40 0 0 1 225 40 A37.5 40 0 0 0 300 40 
                A37.5 40 0 0 1 375 40"
            stroke="url(#waveGradient)" strokeWidth="2" fill="none" />
    </svg>
  );

  const NavLink = ({ to, icon: Icon, label, shift = 0, refreshOnly = false }) => {
    const active = isActive(to);
    const handleClick = (e) => {
      if (refreshOnly) {
        e.preventDefault();
        window.location.reload();
      }
    };
    return refreshOnly ? (
      <button
        onClick={handleClick}
        className="flex flex-col items-center gap-1 transition-transform duration-300 group hover:-translate-y-1"
        style={{ transform: `translateX(${shift}px)` }}
      >
        <Icon size={20} className="text-gray-400 group-hover:text-white" />
        <span className="text-[9px] font-bold tracking-wider text-gray-500 group-hover:text-white">{label}</span>
      </button>
    ) : (
      <a
        href={to}
        className="flex flex-col items-center gap-1 transition-transform duration-300 group hover:-translate-y-1"
        style={{ transform: `translateX(${shift}px)` }}
      >
        <Icon size={20} className={`transition-colors duration-300 ${active ? "text-cyan-400" : "text-gray-400 group-hover:text-white"}`} />
        <span className={`text-[9px] font-bold tracking-wider transition-colors duration-300 ${active ? "text-cyan-400" : "text-gray-500 group-hover:text-white"}`}>
          {label}
        </span>
      </a>
    );
  };

  return (
    <nav className="fixed bottom-0 left-0 z-50 w-full h-16" style={{ background: "#121218" }}>
      <div className="relative w-full h-full">
        <WaveLine />
        <div className="absolute inset-0 flex items-center justify-around z-10">
          <NavLink to="/my-contests" icon={ListChecks} label="CONTESTS" shift={-10} />
          <NavLink to="#" icon={Trophy} label="WINNERS" shift={-10} refreshOnly /> {/* just refresh */}
          <NavLink to="/dashboard" icon={Home} label="HOME" shift={-8} />
          <NavLink to="#" icon={Gamepad2} label="GAMES" refreshOnly /> {/* just refresh */}
          <NavLink to="/account" icon={User} label="ACCOUNT" />
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;
