import React, { useState, useEffect, useRef } from "react";
import { Link } from 'react-router-dom';
// We don't need Link from react-router-dom anymore for this component
// import { Link } from "react-router-dom";
import {
  Swords,
  Crown,
  Skull,
  Instagram,
  Github,
  Youtube,
  Wallet,
  Loader2,
} from "lucide-react";


// A custom hook to detect if the screen is mobile-sized
const useIsMobile = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < breakpoint);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };
    window.addEventListener("resize", handleResize);
    // Cleanup function to remove the event listener
    return () => window.removeEventListener("resize", handleResize);
  }, [breakpoint]);

  return isMobile;
};

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  // --- Data for sections ---
  const gameModes = [
    {
      icon: <Skull size={32} />,
      title: "Battle Royale",
      desc: "Drop into Bermuda or Kalahari, loot up, and survive the shrinking safe zone. Be the last squad standing to claim your Booyah!",
    },
    {
      icon: <Swords size={32} />,
      title: "Clash Squad",
      desc: "Intense 4v4 economy rounds. Coordinate with your squad, buy the right gear, and dominate the enemy in a best-of-seven firefight.",
    },
    {
      icon: <Crown size={32} />,
      title: "Lone Wolf",
      desc: "Pure skill showdown. Challenge a rival in a 1v1 or 2v2 on the Iron Cage. No excuses, only headshots decide the victor.",
    },
  ];

  const howItWorks = [
    {
      step: 1,
      title: "Register & Create Profile",
      desc: "Sign up in seconds and set up your in-game profile. This is your first step to becoming a legend.",
    },
    {
      step: 2,
      title: "Join a Tournament",
      desc: "Browse daily and weekly tournaments. Find a match that fits your squad size, mode, and entry fee.",
    },
    {
      step: 3,
      title: "Enter the Custom Room",
      desc: "Receive your custom room ID and password before the match starts. Gear up and get ready for the drop.",
    },
    {
      step: 4,
      title: "Play, Win & Get Paid",
      desc: "Dominate the lobby, secure the Booyah, and watch your winnings get credited to your account instantly.",
    },
  ];

  const tournaments = [
    {
      frequency: "Every Week",
      title: "Weekly Rampage",
      prize: "Up to 10,000 Diamonds",
    },
    {
      frequency: "Every Month",
      title: "Monthly Grandmaster",
      prize: "Up to ₹25,000",
    },
    {
      frequency: "Special Events",
      title: "Festival Carnage",
      prize: "Rare Bundles & More",
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

  // --- Generic Carousel Component (for Mobile View) ---
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
              className={`w-2 h-2 rounded-full transition-colors duration-300 ${activeIndex === index ? "bg-blue-500" : "bg-gray-600 hover:bg-gray-400"}`}
            />
          ))}
        </div>
      </div>
    );
  };

  // --- Hooks for scroll animations on desktop ---
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 },
    );

    const elements = document.querySelectorAll(".scroll-animate");
    elements.forEach((el) => observer.observe(el));

    return () => elements.forEach((el) => observer.unobserve(el));
  }, []);

  // --- Modern Custom Styles ---
  const customStyles = `
        @import url('https://fonts.googleapis.com/css2?family=Teko:wght@400;700&family=Inter:wght@400;600;700&display=swap');
        
        :root {
            --color-red: #ff3b3b;
            --color-blue: #3b82f6;
            --color-sky: #87ceeb;
            --bg-primary: #0a0a0f;
            --bg-secondary: #121218;
            --border-color: #27272a;
        }

        html { scroll-behavior: smooth; }
        body { 
            background-color: var(--bg-primary); 
            background-image: linear-gradient(180deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
            color: #d1d5db;
        }
        .font-display { font-family: 'Teko', sans-serif; }
        .font-sans { font-family: 'Inter', sans-serif; }
        .scroll-animate { opacity: 0; transform: translateY(25px); transition: opacity 0.6s ease-out, transform 0.6s ease-out; }
        .scroll-animate.visible { opacity: 1; transform: translateY(0); }
        .text-gradient-animated {
            background: linear-gradient(90deg, var(--color-red), var(--color-blue), var(--color-sky), var(--color-red));
            background-size: 300% auto;
            -webkit-background-clip: text; background-clip: text; color: transparent;
            animation: gradient-shine 4s linear infinite;
        }
        @keyframes gradient-shine { to { background-position: 300% center; } }
        .card-sharp {
            background-color: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 0.5rem; padding: 1.75rem;
            position: relative; overflow: hidden; transition: transform 0.3s ease, border-color 0.3s ease; height: 100%;
        }
        .card-sharp::before {
            content: ''; position: absolute; left: 0; top: 0; width: 4px; height: 100%;
            background: linear-gradient(180deg, var(--color-red), var(--color-blue));
            transform: translateX(-100%); transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1);
        }
        .card-sharp:hover { transform: translateY(-6px); border-color: #444; }
        .card-sharp:hover::before { transform: translateX(0); }
        .btn {
            font-weight: bold;
            padding: 0.7rem 1.8rem;
            border-radius: 0.375rem;
            transition: transform 0.2s ease, box-shadow 0.2s ease, background-position 0.5s ease, color 0.3s ease, border-color 0.3s ease;
            display: inline-block;
        }
        .btn:hover {
            transform: scale(1.05);
        }
        .btn-primary {
            background: linear-gradient(90deg, var(--color-red), var(--color-blue));
            background-size: 200% auto;
            color: #fff;
        }
        .btn-primary:hover {
            background-position: right center;
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.4);
        }
        .btn-secondary {
            background-color: transparent;
            color: #f5f5f5;
            border: 2px solid var(--border-color);
        }
        .btn-secondary:hover {
            color: var(--color-blue);
            border-color: var(--color-blue);
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.2);
        }

        .angled-section { position: relative; padding: 5rem 0; }
        .angled-section::before {
            content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 100%;
            background-color: var(--bg-secondary); transform: skewY(-2deg); z-index: -1;
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    `;

  return (
    <>
    <style>{customStyles}</style>
            <div className="min-h-screen bg-primary font-sans text-white" style={{background: 'var(--bg-primary)'}}>
                <header className="fixed top-0 left-0 w-full z-50 bg-primary/80 backdrop-blur-md border-b border-border-color">
                    <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
                        <Link
                            to="/"
                            className="text-3xl font-display font-bold tracking-wider text-white"
                        >
                            Battle<span className="text-gradient-animated">Booyah</span>
                        </Link>
                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-6 font-semibold">
                            <a href="#gamemodes" className="text-gray-400 hover:text-white transition">
                                Game Modes
                            </a>
                            <a href="#create" className="text-gray-400 hover:text-white transition">
                                Create
                            </a>
                            <a href="#tournaments" className="text-gray-400 hover:text-white transition">
                                Tournaments
                            </a>
                            {/* --- THIS IS THE CORRECTED PART --- */}
                            <Link to="/admin/login" className="text-gray-400 hover:text-white transition">
                                Admin Login
                            </Link>
                        </div>
                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden text-white z-50"
                        >
                            {isMenuOpen ? <X /> : <Menu />}
                        </button>
                    </nav>

                    {/* Backdrop Overlay */}
                    <div
                        onClick={() => setIsMenuOpen(false)}
                        className={`fixed inset-0 z-40 transition-opacity duration-300 md:hidden ${isMenuOpen ? "opacity-100 bg-black/50" : "opacity-0 pointer-events-none"}`}
                    ></div>

                    {/* Mobile Menu - SLIDES IN FROM THE RIGHT */}
                    <div
                        className={`fixed inset-y-0 right-0 w-3/4 max-w-sm bg-secondary/95 backdrop-blur-lg border-l border-border-color z-50 transform transition-transform duration-300 ease-in-out md:hidden ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`}
                    >
                        <div className="flex flex-col items-start gap-6 py-10 px-8">
                            <button
                                onClick={() => setIsMenuOpen(false)}
                                className="self-end text-white"
                            >
                                <X size={32} />
                            </button>
                            <a
                                href="#gamemodes"
                                onClick={() => setIsMenuOpen(false)}
                                className="text-xl w-full text-center py-2 hover:bg-gray-800 rounded transition"
                            >
                                Game Modes
                            </a>
                            <a
                                href="#create"
                                onClick={() => setIsMenuOpen(false)}
                                className="text-xl w-full text-center py-2 hover:bg-gray-800 rounded transition"
                            >
                                Create
                            </a>
                            <a
                                href="#tournaments"
                                onClick={() => setIsMenuOpen(false)}
                                className="text-xl w-full text-center py-2 hover:bg-gray-800 rounded transition"
                            >
                                Tournaments
                            </a>
                            {/* --- THIS IS THE CORRECTED PART FOR MOBILE --- */}
                            <Link
                                to="/admin/login"
                                onClick={() => setIsMenuOpen(false)}
                                className="text-xl w-full text-center py-2 hover:bg-gray-800 rounded transition"
                            >
                                Admin Login
                            </Link>
                        </div>
                    </div>
                </header>

        <main>
          {/* Hero Section */}
           <section
                        className="relative flex items-center justify-center text-center overflow-hidden px-6 pt-40 pb-14 md:pt-28 md:pb-10 bg-cover bg-center"
                        style={{ backgroundImage: "none", backgroundColor: "transparent" }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/50 to-transparent"></div>
                        <div className="relative z-10">
                            <div>
                                {/* Desktop Heading & Subheading */}
                                <h1 className="hidden md:block text-5xl font-display uppercase font-bold text-gradient-animated tracking-widest">
                                    CLAIM YOUR{" "}
                                    <span className="text-gradient-animated">BOOYAH</span>
                                </h1>
                                <p className="hidden md:block mt-4 text-lg text-gray-400 font-normal max-w-3xl mx-auto">
                                    Your Battle, Your Rules, Your Glory, Step into India’s
                                    ultimate Free Fire battleground – play daily contests,
                                    challenge the best, and win real rewards.
                                </p>

                                {/* Mobile Heading & Paragraph */}
                                <h1 className="block md:hidden text-4xl font-display uppercase text-gray-400 tracking-wider font-normal">
                                    Claim Your
                                    <span
                                        className="block text-6xl font-bold tracking-widest mt-1 text-gradient-animated"
                                        style={{ textShadow: "0 0 25px rgba(59, 130, 246, 0.5)" }}
                                    >
                                        BOOYAH
                                    </span>
                                </h1>
                                <p className="block md:hidden mt-4 mx-auto text-base text-gray-400 leading-relaxed">
                                   India's Free Fire Esports Arena.
                                    <br />
                                    Where skill is rewarded.
                                    <br />
                                    Claim your victory.
                                </p>
                            </div>

                            <div
                                className="mt-8 flex items-center justify-center gap-4"
                            >
                                <a href="https://wa.me/919608039938" target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                                    Register
                                </a>
                                <Link to="/login" className="btn btn-secondary">
                                    Login
                                </Link>
                            </div>
                        </div>
                    </section>

          {/* 1. Master Every Mode */}
          <div className="angled-section">
            <section
              id="gamemodes"
              className="container mx-auto px-6 relative z-10"
            >
              {isMobile ? (
                <AutoCarousel
                  sectionName="gamemodes"
                  items={gameModes}
                  renderItem={(item) => (
                    <div className="card-sharp text-center h-full">
                      <div className="flex flex-col items-center">
                        <div className="p-4 bg-border-color rounded-full text-blue-400 mb-4">
                          {item.icon}
                        </div>
                        <h3 className="text-xl sm:text-3xl font-display text-gradient-animated">
                          {item.title}
                        </h3>
                        <p className="mt-2 text-gray-400">{item.desc}</p>
                      </div>
                    </div>
                  )}
                />
              ) : (
                <div className="grid md:grid-cols-3 gap-8">
                  {gameModes.map((mode, i) => (
                    <div
                      key={mode.title}
                      className="card-sharp text-center scroll-animate"
                      style={{ transitionDelay: `${i * 100}ms` }}
                    >
                      <div className="flex flex-col items-center">
                        <div className="p-4 bg-border-color rounded-full text-blue-400 mb-4">
                          {mode.icon}
                        </div>
                        <h3 className="text-xl sm:text-3xl font-display text-gradient-animated">
                          {mode.title}
                        </h3>
                        <p className="mt-2 text-gray-400">{mode.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* 2. Create Your Own Contest */}
          <div className="angled-section">
            <section
              id="create"
              className="container mx-auto px-6 relative z-10"
            >
              <div className="scroll-animate max-w-4xl mx-auto text-center">
                <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display leading-tight">
                  <span className="text-gradient-animated">
                    Create Your Own Contest
                  </span>
                </h2>

                <div className="mt-8">
                  {isMobile ? (
                    <AutoCarousel
                      sectionName="creatable-modes"
                      items={creatableModes}
                      renderItem={(item) => (
                        <div className="card-sharp text-center h-full">
                          <div className="flex flex-col items-center">
                            <div className="p-4 bg-border-color rounded-full text-blue-400 mb-4">
                              {item.icon}
                            </div>
                            <h3 className="text-xl sm:text-3xl font-display text-gradient-animated">
                              {item.title}
                            </h3>
                            <p className="mt-2 text-gray-400">{item.desc}</p>
                          </div>
                        </div>
                      )}
                    />
                  ) : (
                    <div className="flex flex-col sm:flex-row gap-8 text-left">
                      {creatableModes.map((mode, i) => (
                        <div key={i} className="flex items-start gap-4 flex-1">
                          <div className="p-3 bg-border-color rounded-lg text-blue-400 mt-1 flex-shrink-0">
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
              </div>
            </section>
          </div>

          {/* 3. Official Tournaments */}
          <div className="angled-section">
            <section
              id="tournaments"
              className="container mx-auto px-6 relative z-10"
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-5xl font-display text-gradient-animated scroll-animate">
                  Official Tournaments
                </h2>
                <p
                  className="text-lg text-gray-500 mt-2 scroll-animate"
                  style={{ transitionDelay: "150ms" }}
                >
                  Compete for Airdrop-level prize pools!
                </p>
              </div>
              {isMobile ? (
                <AutoCarousel
                  sectionName="tournaments"
                  items={tournaments}
                  renderItem={(item) => (
                    <div className="card-sharp text-center h-full">
                      <p className="font-semibold text-gray-400">
                        {item.frequency}
                      </p>
                      <h3 className="text-xl sm:text-4xl font-display text-white mt-2">
                        {item.title}
                      </h3>
                      <p className="text-2xl sm:text-3xl font-bold text-white mt-4">
                        {item.prize}
                      </p>
                    </div>
                  )}
                />
              ) : (
                <div className="grid md:grid-cols-3 gap-8">
                  {tournaments.map((item, i) => (
                    <div
                      key={item.title}
                      className="card-sharp text-center scroll-animate"
                      style={{ transitionDelay: `${i * 100}ms` }}
                    >
                      <p className="font-semibold text-gray-400">
                        {item.frequency}
                      </p>
                      <h3 className="text-xl sm:text-4xl font-display text-white mt-2">
                        {item.title}
                      </h3>
                      <p className="text-2xl sm:text-3xl font-bold text-white mt-4">
                        {item.prize}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* 4. Your Path to Victory */}
          <section id="howitworks" className="py-20">
            <div className="container mx-auto px-6">
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-5xl font-display text-gradient-animated scroll-animate">
                  Your Path to Victory
                </h2>
              </div>
              {isMobile ? (
                <AutoCarousel
                  sectionName="howitworks"
                  items={howItWorks}
                  renderItem={(item) => (
                    <div className="relative text-center bg-secondary border border-border-color rounded-lg p-6 h-full">
                      <div className="flex flex-col items-center">
                        <div className="mb-4 w-16 h-16 flex items-center justify-center bg-primary border-2 border-blue-500 rounded-full text-2xl font-bold text-white z-10">
                          {item.step}
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold text-gradient-animated">
                          {item.title}
                        </h3>
                        <p className="text-gray-400 text-sm">{item.desc}</p>
                      </div>
                    </div>
                  )}
                />
              ) : (
                <div className="grid md:grid-cols-4 gap-8 text-center relative">
                  <div
                    className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-border-color transform -translate-y-1/2"
                    style={{ top: "32px" }}
                  ></div>
                  {howItWorks.map((step, i) => (
                    <div
                      key={step.step}
                      className="relative scroll-animate"
                      style={{ transitionDelay: `${i * 100}ms` }}
                    >
                      <div className="flex flex-col items-center">
                        <div className="mb-4 w-16 h-16 flex items-center justify-center bg-secondary border-2 border-blue-500 rounded-full text-2xl font-bold text-white z-10">
                          {step.step}
                        </div>
                        <h3 className="text-xl font-bold text-gradient-animated">
                          {step.title}
                        </h3>
                        <p className="text-gray-400 text-sm">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </main>

        {/* Footer */}
<footer className="bg-black border-t border-border-color pt-12 pb-8">
  <div className="container mx-auto px-6">
    {isMobile ? (
      // --- MOBILE FOOTER ---
      <div className="text-center text-gray-500">
        <h3 className="text-3xl font-display font-bold text-gradient-animated">
          Battle<span className="text-gradient-animated">Booyah</span>
        </h3>
        <p className="mt-2 max-w-sm mx-auto text-sm">
          India's premier esports destination. Compete, win, and rise
          to the top.
        </p>

        <div className="flex justify-center gap-8 my-8 text-sm font-semibold">
          <ul className="space-y-3 text-left">
            <li>
              <a href="#gamemodes" className="hover:text-white transition">
                Game Modes
              </a>
            </li>
            <li>
              <a href="#create" className="hover:text-white transition">
                Create Contest
              </a>
            </li>
            <li>
              <a href="#tournaments" className="hover:text-white transition">
                Tournaments
              </a>
            </li>
          </ul>
          <ul className="space-y-3 text-left">
            <li>
              <a href="/terms" className="hover:text-white transition">
                Terms of Service
              </a>
            </li>
            <li>
              <a href="/privacy" className="hover:text-white transition">
                Privacy Policy
              </a>
            </li>
          </ul>
        </div>

        <div className="flex justify-center gap-6">
          <a
            href="https://www.instagram.com/im_arunkr/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="hover:text-blue-400 transition"
          >
            <Instagram />
          </a>
          <a
            href="https://github.com/im-arunkr"  // <- GitHub link added
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="hover:text-blue-400 transition"
          >
            <Github />
          </a>
          <a
            href="https://www.youtube.com/@arungaming4323"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Youtube"
            className="hover:text-blue-400 transition"
          >
            <Youtube />
          </a>
        </div>
        <div className="mt-8 pt-6 border-t border-border-color text-xs text-gray-600">
          <p>
            &copy; {new Date().getFullYear()} BattleBooyah. All Rights
            Reserved. Made with ❤️ in Ranchi.
          </p>
        </div>
      </div>
    ) : (
      // --- DESKTOP FOOTER ---
      <div>
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
              <a
                href="https://www.instagram.com/im_arunkr/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-gray-500 hover:text-blue-400 transition"
              >
                <Instagram />
              </a>
              <a
                href="https://github.com/im-arunkr"  // <- GitHub link added
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="text-gray-500 hover:text-blue-400 transition"
              >
                <Github />
              </a>
              <a
                href="https://www.youtube.com/@arungaming4323"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Youtube"
                className="text-gray-500 hover:text-blue-400 transition"
              >
                <Youtube />
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-white tracking-wider">
              Quick Links
            </h4>
            <ul className="mt-4 space-y-2">
              <li>
                <a href="#gamemodes" className="text-gray-500 hover:text-white transition">
                  Game Modes
                </a>
              </li>
              <li>
                <a href="#create" className="text-gray-500 hover:text-white transition">
                  Create Contest
                </a>
              </li>
              <li>
                <a href="#tournaments" className="text-gray-500 hover:text-white transition">
                  Tournaments
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white tracking-wider">
              Legal
            </h4>
            <ul className="mt-4 space-y-2">
              <li>
                <a href="/terms" className="text-gray-500 hover:text-white transition">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="/privacy" className="text-gray-500 hover:text-white transition">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 py-6 border-t border-border-color text-center text-gray-600">
          <p>
            &copy; {new Date().getFullYear()} BattleBooyah. All Rights
            Reserved. Made with ❤️ in Ranchi.
          </p>
        </div>
      </div>
    )}
  </div>
</footer>

      </div>
    </>
  );
};

export default LandingPage;

