import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Trophy,
  Users,
  Sparkles,
  Calendar,
  MapPin,
  Lightbulb,
  Code2,
  FileText,
  Presentation,
  Settings,
  BarChart3,
  Send,
  User,
  Quote,
  Menu,
  X
} from "lucide-react";

const LandingContent = () => {
  const [activeTab, setActiveTab] = useState("Home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#080B1A] text-white font-sans selection:bg-purple-500 selection:text-white">
      { }
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
        
        * {
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .mu-gradient-text {
          background: linear-gradient(135deg, #FFFFFF 0%, #E2E8F0 50%, #A855F7 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .mu-symbol-gradient {
          background: linear-gradient(135deg, #60A5FA 0%, #A855F7 50%, #EC4899 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .btn-purple-gradient {
          background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #A855F7 100%);
          box-shadow: 0 4px 20px -2px rgba(139, 92, 246, 0.5);
          transition: all 0.3s ease;
        }

        .btn-purple-gradient:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px -2px rgba(139, 92, 246, 0.7);
        }

        .laptop-glow {
          position: relative;
        }
        .laptop-glow::before {
          content: '';
          position: absolute;
          top: 20%;
          left: 10%;
          width: 80%;
          height: 70%;
          background: radial-gradient(circle, rgba(59, 130, 246, 0.45) 0%, rgba(147, 51, 234, 0.3) 50%, transparent 70%);
          filter: blur(60px);
          z-index: 0;
        }

        .cta-banner-bg {
          background: linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 27, 75, 0.9) 100%),
                      url('https://images.unsplash.com/photo-1511497584788-87676104235f?q=80&w=1600&auto=format&fit=crop');
          background-size: cover;
          background-position: center;
        }
      `}</style>

      { }
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#080B1A]/80 border-b border-white/5 px-6 lg:px-16 py-4 transition-all">
        <div className="max-w-7xl mx-auto">

          {/* Main Navbar */}
          <div className="flex items-center justify-between">

            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2 group"
              onClick={() => {
                setActiveTab("Home");
                setMobileMenuOpen(false);
              }}
            >
              <div>
                <div className="text-2xl font-black tracking-tight flex items-center">
                  <span>Make</span>
                  <span className="mu-symbol-gradient text-3xl font-bold ml-[1px]">
                    μ
                  </span>
                </div>

                <p className="text-[10px] text-slate-400 font-medium tracking-wider uppercase -mt-1">
                  Hackathon 2026
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">

              <Link
                to="/"
                onClick={() => setActiveTab("Home")}
                className={`relative text-sm font-medium transition-colors ${activeTab === "Home"
                    ? "text-white font-semibold"
                    : "text-slate-400 hover:text-slate-200"
                  }`}
              >
                Home

                {activeTab === "Home" && (
                  <span className="absolute -bottom-2 left-0 w-full h-[2px] bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
                )}
              </Link>

              <Link
                to="/checkpoint"
                onClick={() => setActiveTab("Checkpoint")}
                className={`relative text-sm font-medium transition-colors ${activeTab === "Checkpoint"
                    ? "text-white font-semibold"
                    : "text-slate-400 hover:text-slate-200"
                  }`}
              >
                Checkpoint

                {activeTab === "Checkpoint" && (
                  <span className="absolute -bottom-2 left-0 w-full h-[2px] bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
                )}
              </Link>

              <Link
                to="/teams"
                onClick={() => setActiveTab("Teams")}
                className={`relative text-sm font-medium transition-colors ${activeTab === "Teams"
                    ? "text-white font-semibold"
                    : "text-slate-400 hover:text-slate-200"
                  }`}
              >
                Teams

                {activeTab === "Teams" && (
                  <span className="absolute -bottom-2 left-0 w-full h-[2px] bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
                )}
              </Link>

              <Link
                to="/leaderboard"
                onClick={() => setActiveTab("Leaderboard")}
                className={`relative text-sm font-medium transition-colors ${activeTab === "Leaderboard"
                    ? "text-white font-semibold"
                    : "text-slate-400 hover:text-slate-200"
                  }`}
              >
                Leaderboard

                {activeTab === "Leaderboard" && (
                  <span className="absolute -bottom-2 left-0 w-full h-[2px] bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
                )}
              </Link>

            </nav>

            {/* Desktop Mentor Login */}
            <Link
              to="/login"
              className="hidden md:flex btn-purple-gradient text-white text-xs font-semibold px-5 py-2.5 rounded-full items-center gap-2"
            >
              <User size={15} />
              <span>Mentor Login</span>
            </Link>

            {/* Mobile Hamburger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-slate-200 p-2 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? (
                <X size={25} />
              ) : (
                <Menu size={25} />
              )}
            </button>

          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-3 border-t border-white/10 pt-4">

              <nav className="flex flex-col gap-1">

                <Link
                  to="/"
                  onClick={() => {
                    setActiveTab("Home");
                    setMobileMenuOpen(false);
                  }}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === "Home"
                      ? "bg-white/10 text-white"
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                    }`}
                >
                  Home
                </Link>

                <Link
                  to="/checkpoint"
                  onClick={() => {
                    setActiveTab("Checkpoint");
                    setMobileMenuOpen(false);
                  }}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === "Checkpoint"
                      ? "bg-white/10 text-white"
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                    }`}
                >
                  Checkpoint
                </Link>

                <Link
                  to="/teams"
                  onClick={() => {
                    setActiveTab("Teams");
                    setMobileMenuOpen(false);
                  }}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === "Teams"
                      ? "bg-white/10 text-white"
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                    }`}
                >
                  Teams
                </Link>

                <Link
                  to="/leaderboard"
                  onClick={() => {
                    setActiveTab("Leaderboard");
                    setMobileMenuOpen(false);
                  }}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === "Leaderboard"
                      ? "bg-white/10 text-white"
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                    }`}
                >
                  Leaderboard
                </Link>

                {/* Mobile Mentor Login */}
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-purple-gradient text-white text-sm font-semibold px-5 py-3 rounded-lg flex items-center justify-center gap-2 mt-2"
                >
                  <User size={16} />
                  Mentor Login
                </Link>

              </nav>

            </div>
          )}

        </div>
      </header>

      { }
      <section id="home" className="relative pt-12 pb-24 px-6 lg:px-16 overflow-hidden">
        {/* Background ambient lighting */}
        <div className="absolute top-10 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-40 left-10 w-80 h-80 bg-blue-600/15 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Left Content */}
          <div className="lg:col-span-7 z-10 space-y-6">
            <div className="inline-block">
              <span className="text-xs font-bold tracking-[0.2em] text-slate-400 uppercase leading-relaxed">
                IDEAS TODAY.
                <br />
                A BETTER TOMORROW.
              </span>
            </div>

            <div className="space-y-1">
              <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tight leading-none">
                Make<span className="mu-symbol-gradient font-semibold">μ</span>
              </h1>
              <p className="text-2xl sm:text-3xl font-extrabold tracking-wider text-slate-200 uppercase">
                HACKATHON 2026
              </p>
            </div>

            <div className="space-y-2 max-w-xl">
              <p className="text-base text-slate-300 font-medium">
                A 24-hour hackathon to turn ideas into real impact.
              </p>
              <p className="text-sm text-slate-400 font-normal">
                Innovate &nbsp;•&nbsp; Collaborate &nbsp;•&nbsp; Build &nbsp;•&nbsp; Learn
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link
                to="/teams"
                className="btn-purple-gradient text-white text-sm font-semibold px-6 py-3.5 rounded-full flex items-center gap-2.5"
              >
                <Send size={16} className="rotate-45" />
                <span>Get Started</span>
              </Link>

              <Link
                to="/teams"
                className="bg-white/5 hover:bg-white/10 text-slate-200 text-sm font-semibold px-6 py-3.5 rounded-full border border-white/15 flex items-center gap-2.5 transition-all"
              >
                <Users size={16} />
                <span>View Teams</span>
              </Link>
            </div>
          </div>

          {/* Hero Right Visuals */}
          <div className="lg:col-span-5 relative flex flex-col items-center lg:items-end">
            {/* Powered By Card */}
            <div className="bg-[#0D1226]/80 border border-white/10 backdrop-blur-md p-4 rounded-xl shadow-xl mb-6 self-end max-w-xs">
              <p className="text-[11px] text-slate-400 font-medium">Powered by</p>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-2xl font-black tracking-tight text-white">μlearn</span>
                <span className="text-xs font-extrabold text-purple-400 ml-1">IDK</span>
              </div>
            </div>

            {/* Laptop Mockup */}
            <div className="laptop-glow w-full max-w-md relative z-10">
              <div className="relative bg-[#02040A] border border-slate-700/60 rounded-xl p-3 shadow-2xl overflow-hidden transform -rotate-2 hover:rotate-0 transition-transform duration-500">
                {/* Laptop Window Bar */}
                <div className="flex items-center gap-1.5 mb-2 px-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                </div>
                {/* Laptop Screen Content */}
                <div className="bg-gradient-to-br from-[#090D21] via-[#050814] to-[#010206] rounded-lg p-8 h-56 flex flex-col items-center justify-center border border-slate-800/80">
                  <div className="space-y-2 text-center">
                    <p className="text-blue-400 font-mono text-sm tracking-widest font-semibold">PLAN</p>
                    <p className="text-blue-400 font-mono text-sm tracking-widest font-semibold">BUILD</p>
                    <p className="text-purple-400 font-mono text-sm tracking-widest font-semibold">TEST</p>
                    <p className="text-cyan-400 font-mono text-sm tracking-widest font-semibold">REPEAT</p>
                  </div>
                </div>
              </div>
              {/* Laptop Base */}
              <div className="w-full h-3 bg-slate-800 rounded-b-xl border-t border-slate-700 mx-auto max-w-[95%]" />
            </div>

            {/* Laptop Quote Badge */}
            <div className="mt-6 text-right max-w-xs">
              <p className="text-xs italic text-slate-300 font-medium">
                “Great ideas start with a team and a deadline.”
              </p>
              <div className="w-8 h-0.5 bg-purple-500 ml-auto mt-2 rounded-full" />
            </div>
          </div>
        </div>
      </section>

      { }
      <section id="checkpoint" className="bg-[#F8FAFC] text-slate-900 py-20 px-6 lg:px-16">
        <div className="max-w-7xl mx-auto space-y-16">
          {/* Top Narrative + Feature Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* About Narrative */}
            <div className="lg:col-span-6 space-y-4">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                About <span className="text-purple-600">Makeμ</span>
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed max-w-xl">
                Makeμ is a 24-hour hackathon organized by μLearn IDK, bringing together bright minds to solve real-world problems through technology, creativity and collaboration. It's more than a competition – it's a platform to learn, build and make a difference.
              </p>
            </div>

            {/* 4 Feature Cards */}
            <div className="lg:col-span-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { icon: Lightbulb, title: "Innovate", subtitle: "Boldly" },
                { icon: Users, title: "Collaborate", subtitle: "Freely" },
                { icon: Settings, title: "Build", subtitle: "Solutions" },
                { icon: BarChart3, title: "Create", subtitle: "Impact" }
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center space-y-2"
                >
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                    <item.icon size={20} />
                  </div>
                  <div className="text-xs font-bold text-slate-800">
                    <p>{item.title}</p>
                    <p className="text-slate-500 font-medium">{item.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats Bar Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
              {/* Date */}
              <div className="flex items-start gap-4 pt-4 sm:pt-0 sm:pl-4 first:pl-0">
                <div className="p-3 bg-purple-50 text-purple-600 rounded-xl shrink-0">
                  <Calendar size={22} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Date</h4>
                  <p className="text-sm font-semibold text-slate-700 mt-0.5">Sep 26 – 27, 2026</p>
                  <p className="text-xs text-slate-400 font-medium">(24 Hours)</p>
                </div>
              </div>

              {/* Venue */}
              <div className="flex items-start gap-4 pt-4 sm:pt-0 sm:pl-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl shrink-0">
                  <MapPin size={22} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Venue</h4>
                  <p className="text-sm font-semibold text-slate-700 mt-0.5">Government Engineering</p>
                  <p className="text-xs text-slate-500 font-medium">College, Idukki</p>
                </div>
              </div>

              {/* Teams */}
              <div className="flex items-start gap-4 pt-4 sm:pt-0 sm:pl-4">
                <div className="p-3 bg-purple-50 text-purple-600 rounded-xl shrink-0">
                  <Users size={22} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Teams</h4>
                  <p className="text-sm font-semibold text-slate-700 mt-0.5">15 Teams</p>
                </div>
              </div>

              {/* Checkpoints */}
              <div className="flex items-start gap-4 pt-4 sm:pt-0 sm:pl-4">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl shrink-0">
                  <Trophy size={22} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Checkpoints</h4>
                  <p className="text-sm font-semibold text-slate-700 mt-0.5">4 Evaluation Stages</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      { }
      <section className="bg-white text-slate-900 py-20 px-6 lg:px-16 border-t border-slate-100">
        <div className="max-w-7xl mx-auto space-y-16">
          {/* Section Heading */}
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
              Hackathon Journey
            </h2>
            <p className="text-sm text-slate-500 font-medium">
              From ideas to impact — in four exciting stages.
            </p>
          </div>

          {/* Timeline Nodes */}
          <div className="relative">
            {/* Horizontal Line connector */}
            <div className="hidden lg:block absolute top-6 left-[10%] right-[10%] h-0.5 bg-purple-200 z-0" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
              {[
                {
                  step: "01",
                  title: "Problem Statement",
                  desc: "Understand the problem and define your approach.",
                  icon: FileText,
                  color: "bg-blue-600 text-white"
                },
                {
                  step: "02",
                  title: "Solution Design",
                  desc: "Ideate and design your solution.",
                  icon: Lightbulb,
                  color: "bg-purple-600 text-white"
                },
                {
                  step: "03",
                  title: "Prototype / Implementation",
                  desc: "Build and test your prototype.",
                  icon: Code2,
                  color: "bg-purple-600 text-white"
                },
                {
                  step: "04",
                  title: "Final Presentation",
                  desc: "Showcase your solution and impact.",
                  icon: Presentation,
                  color: "bg-purple-600 text-white"
                }
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center text-center space-y-3 group">
                  {/* Step Icon */}
                  <div
                    className={`w-12 h-12 rounded-2xl ${item.color} flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 duration-300`}
                  >
                    <item.icon size={20} />
                  </div>

                  <span className="text-xs font-bold text-slate-400 tracking-wider mt-1">
                    {item.step}
                  </span>

                  <h3 className="text-base font-bold text-slate-900">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      { }
      <section className="py-12 px-6 lg:px-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="cta-banner-bg rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8 border border-slate-800">
            {/* Left Quote */}
            <div className="space-y-3 max-w-lg">
              <Quote size={28} className="text-blue-400 rotate-180 opacity-80" />
              <h3 className="text-xl sm:text-2xl font-bold leading-snug italic text-slate-100">
                “Innovation happens when curious minds work together.”
              </h3>
              <p className="text-xs font-semibold text-slate-400 tracking-wide">
                — Makeμ 2026
              </p>
            </div>

            {/* Right Action */}
            <div className="flex flex-col sm:flex-row items-center gap-6 w-full lg:w-auto justify-end">
              <span className="text-sm font-semibold text-slate-200 text-center lg:text-right">
                Ready to see what teams are building?
              </span>

              <Link
                to="/teams"
                className="btn-purple-gradient text-white text-xs font-bold px-6 py-3.5 rounded-full flex items-center gap-2 shrink-0"
              >
                <span>View Teams</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      { }
      <footer className="bg-[#080B1A] border-t border-slate-800/80 py-12 px-6 lg:px-16 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Brand Details */}
          <div className="space-y-2 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-1">
              <span className="text-xl font-black text-white">Make</span>
              <span className="mu-symbol-gradient text-2xl font-bold">μ</span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">
              Hackathon 2026
            </p>
            <p className="text-xs text-slate-300 font-medium">
              Ideas. Innovation. Impact.
            </p>
            <p className="text-xs text-slate-500">
              A hackathon by μLearn IDK
            </p>
          </div>

          {/* Quick Nav Links */}
          {/* <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-slate-300">
            <a href="#home" className="hover:text-white transition-colors">Home</a>
            <span className="text-slate-700">|</span>
            <a href="#checkpoint" className="hover:text-white transition-colors">Checkpoint</a>
            <span className="text-slate-700">|</span>
            <a href="#teams" className="hover:text-white transition-colors">Teams</a>
            <span className="text-slate-700">|</span>
            <a href="#leaderboard" className="hover:text-white transition-colors">Leaderboard</a>
          </div> */}

          {/* Socials & Note */}
          <div className="flex flex-col items-center md:items-end gap-3">
            <div className="flex items-center gap-4 text-slate-400">
              

              <a
                href="https://www.instagram.com/mulearn.geci?stkn=MXdld3Byd3dnbGFhMg=="
                className="hover:text-white transition-colors p-1.5 bg-white/5 rounded-full border border-white/10"
              >
                IG
              </a>

              <a
                href="https://www.linkedin.com/company/mulearn-geci/"
                className="hover:text-white transition-colors p-1.5 bg-white/5 rounded-full border border-white/10"
              >
                in
              </a>

              
            </div>
            <p className="text-[11px] text-slate-500">
              Build today for a brighter tomorrow.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingContent;