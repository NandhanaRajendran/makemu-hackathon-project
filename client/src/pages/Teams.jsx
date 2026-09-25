import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  Search,
  ArrowRight,
  ArrowUpRight,
  X,
  Users,
  Trophy,
  UserCheck,
  Waves,
  Leaf,
  Brain,
  Zap,
  Box,
  Infinity as InfinityIcon,
  Diamond,
  Rocket,
  Sprout,
  Cpu,
  Gamepad2,
  Star,
  ChevronLeft,
  ChevronRight,
  User
} from "lucide-react";

const GithubIcon = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const InstagramIcon = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const LinkedinIcon = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const YoutubeIcon = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.56 49.56 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
    <path d="m10 15 5-3-5-3z" />
  </svg>
);

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const TEAM_STYLES = [
  { icon: Waves, iconBg: "bg-blue-50 text-blue-600" },
  { icon: Leaf, iconBg: "bg-emerald-50 text-emerald-600" },
  { icon: Brain, iconBg: "bg-purple-50 text-purple-600" },
  { icon: Zap, iconBg: "bg-pink-50 text-pink-600" },
  { icon: Box, iconBg: "bg-indigo-50 text-indigo-600" },
  { icon: InfinityIcon, iconBg: "bg-blue-50 text-blue-600" },
  { icon: Diamond, iconBg: "bg-sky-50 text-sky-600" },
  { icon: Rocket, iconBg: "bg-violet-50 text-violet-600" },
  { icon: Sprout, iconBg: "bg-teal-50 text-teal-600" },
  { icon: Cpu, iconBg: "bg-cyan-50 text-cyan-600" },
  { icon: Gamepad2, iconBg: "bg-purple-50 text-purple-600" },
  { icon: Star, iconBg: "bg-indigo-50 text-indigo-600" }
];

const AVATAR_BACKGROUNDS = [
  "bg-blue-500", "bg-purple-500", "bg-emerald-500",
  "bg-amber-500", "bg-pink-500", "bg-indigo-500"
];

const getTeamName = (team) =>
  team?.teamName || team?.name || team?.title || "Unnamed Team";

const getMemberName = (member) =>
  typeof member === "string"
    ? member
    : member?.name || member?.memberName || "Unnamed Member";

const normalizeTeam = (team, index) => {
  const style = TEAM_STYLES[index % TEAM_STYLES.length];

  return {
    ...team,
    teamName: getTeamName(team),
    tagline:
      team?.tagline ||
      team?.description ||
      "Building innovative solutions for Makeμ 2026.",
    members: Array.isArray(team?.members) ? team.members : [],
    icon: style.icon,
    iconBg: style.iconBg
  };
};

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activePage, setActivePage] = useState(1);
  const [mentorUsername, setMentorUsername] = useState("Mentor");

  const TEAMS_PER_PAGE = 6;

  const loadTeams = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(`${API_URL}/api/teams`);
      const data = response.data;

      const teamList = Array.isArray(data)
        ? data
        : Array.isArray(data.teams)
          ? data.teams
          : [];

      setTeams(teamList.map(normalizeTeam));
    } catch (err) {
      console.error("Failed to load teams:", err);
      setError(
        err.response?.data?.message ||
          "Unable to load teams. Please try again."
      );
      setTeams([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeams();

    try {
      const mentor = JSON.parse(
        sessionStorage.getItem("mentor") || "null"
      );

      if (mentor?.username) {
        setMentorUsername(mentor.username);
      }
    } catch {
      setMentorUsername("Mentor");
    }
  }, []);

  const filteredTeams = useMemo(() => {
    if (!search.trim()) return teams;

    const q = search.toLowerCase().trim();

    return teams.filter(
      (team) =>
        getTeamName(team).toLowerCase().includes(q) ||
        team.tagline?.toLowerCase().includes(q) ||
        team.members.some((member) =>
          getMemberName(member).toLowerCase().includes(q)
        )
    );
  }, [teams, search]);

  useEffect(() => {
    setActivePage(1);
  }, [search]);

  const totalParticipants = useMemo(() => {
    return teams.reduce(
      (sum, team) => sum + (team.members?.length || 0),
      0
    );
  }, [teams]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredTeams.length / TEAMS_PER_PAGE)
  );

  const paginatedTeams = useMemo(() => {
    const start = (activePage - 1) * TEAMS_PER_PAGE;
    return filteredTeams.slice(start, start + TEAMS_PER_PAGE);
  }, [filteredTeams, activePage]);

  useEffect(() => {
    if (activePage > totalPages) {
      setActivePage(totalPages);
    }
  }, [activePage, totalPages]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans selection:bg-purple-500 selection:text-white">
      {/* Dynamic CSS Styling for Gradients and Visual Fidelity */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');

        * {
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .mu-symbol-gradient {
          background: linear-gradient(135deg, #60A5FA 0%, #A855F7 50%, #EC4899 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .mu-title-gradient {
          background: linear-gradient(135deg, #60A5FA 0%, #A855F7 60%, #EC4899 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .teams-hero-bg {
          background: radial-gradient(circle at 70% 30%, #1E1B4B 0%, #080B1A 70%, #030611 100%);
        }

        .btn-arrow-hover {
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .btn-arrow-hover:hover {
          background-color: #6366F1;
          color: #FFFFFF;
          transform: translateY(-1px) scale(1.05);
        }

        .team-card-shadow {
          box-shadow: 0 4px 20px -2px rgba(15, 23, 42, 0.03);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .team-card-shadow:hover {
          box-shadow: 0 12px 30px -4px rgba(99, 102, 241, 0.12);
          transform: translateY(-3px);
        }
      `}</style>

      {/* NAVBAR */}
      <header className="bg-[#080B1A] text-white sticky top-0 z-40 border-b border-white/10 px-4 sm:px-8 lg:px-16 py-3.5 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div>
              <div className="text-2xl font-black tracking-tight flex items-center">
                <span>Make</span>
                <span className="mu-symbol-gradient text-3xl font-bold ml-[1px]">μ</span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium tracking-wider uppercase -mt-1">
                Hackathon 2026
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <Link to="/" className="text-slate-300 hover:text-white transition-colors">
              Home
            </Link>
            <Link to="/checkpoint" className="text-slate-300 hover:text-white transition-colors">
              Checkpoint
            </Link>
            <a href="#" className="relative text-white font-bold py-1">
              Teams
              <span className="absolute bottom-0 left-0 w-full h-[2.5px] bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-full" />
            </a>
            <Link to="/leaderboard" className="text-slate-300 hover:text-white transition-colors">
              Leaderboard
            </Link>
          </nav>

          {/* User / Mentor Badge */}
          <div className="flex items-center gap-3">
            <button className="bg-white/10 hover:bg-white/15 text-white text-xs font-semibold px-4 py-2 rounded-full border border-white/15 flex items-center gap-2 transition-all cursor-pointer">
              <User size={14} className="text-purple-300" />
              <span>{mentorUsername}</span>
            </button>
          </div>
        </div>
      </header>

      {/* HERO BANNER SECTION */}
      <section className="teams-hero-bg text-white relative overflow-hidden pt-12 pb-16 px-4 sm:px-8 lg:px-16 border-b border-white/10">
        {/* Soft Background Orbs */}
        <div className="absolute top-10 right-1/3 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/2 left-10 w-80 h-80 bg-blue-600/15 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          
          {/* Main Title & Subtitle */}
          <div className="lg:col-span-7 space-y-3">
            <p className="text-xs font-bold tracking-[0.25em] text-slate-400 uppercase">
              PEOPLE BEHIND BIGGER IDEAS.
            </p>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
              Participating <br className="hidden sm:inline" />
              <span className="mu-title-gradient">Teams</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 font-medium max-w-xl leading-relaxed pt-1">
              Meet the brilliant minds building innovative solutions at Makeμ 2026.
            </p>
          </div>

          {/* Right Floating Quote Box + Powered By Badge */}
          <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end gap-6 justify-between">
            {/* Quote Box */}
            <div className="bg-[#0E132B]/80 backdrop-blur-md border border-white/15 p-5 rounded-2xl shadow-2xl max-w-sm space-y-2">
              <p className="text-xs sm:text-sm font-semibold italic text-slate-200 leading-relaxed">
                “ Different minds.<br />
                Shared purpose.<br />
                Greater impact. ”
              </p>
              <div className="w-8 h-0.5 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full" />
            </div>

            {/* Powered By Badge */}
            <div className="text-right">
              <p className="text-[11px] text-slate-400 font-semibold tracking-wider">Powered by</p>
              <div className="flex items-baseline justify-end gap-0.5 mt-0.5">
                <span className="text-2xl font-black tracking-tight text-purple-400">μLearn</span>
                <span className="text-xs font-extrabold text-white ml-1">IDK</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* MAIN CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-8 space-y-8">
        
        {/* STATS OVERVIEW CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          
          {/* Card 1: Teams */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Users size={22} />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900 tracking-tight">{teams.length}</p>
              <p className="text-xs font-semibold text-slate-500">Teams</p>
            </div>
          </div>

          {/* Card 2: Participants */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <UserCheck size={22} />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900 tracking-tight">{totalParticipants}</p>
              <p className="text-xs font-semibold text-slate-500">Participants</p>
            </div>
          </div>

          {/* Card 3: Winning Team */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center shrink-0">
              <Trophy size={22} />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900 tracking-tight">
                {teams.length}
              </p>
              <p className="text-xs font-semibold text-slate-500">Registered Teams</p>
            </div>
          </div>

        </div>

        {/* SEARCH BAR TOOLBAR */}
        <div className="relative">
          <div className="relative flex items-center">
            <Search className="absolute left-4 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search teams by name or member..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200/90 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all shadow-sm"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-4 text-slate-400 hover:text-slate-600 transition-colors p-1"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* TEAMS GRID SECTION */}
        <section className="space-y-6">
          {loading ? (
            <div className="py-20 text-center text-slate-400 space-y-3">
              <div className="w-8 h-8 border-3 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs font-semibold">Loading teams...</p>
            </div>
          ) : error ? (
            <div className="bg-white rounded-3xl border border-red-100 p-12 text-center space-y-4">
              <Users size={32} className="mx-auto text-red-300" />
              <div>
                <p className="text-sm font-bold text-slate-800">Unable to load teams</p>
                <p className="text-xs text-slate-400 mt-1">{error}</p>
              </div>
              <button
                onClick={loadTeams}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : filteredTeams.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-500 space-y-3">
              <Users size={32} className="mx-auto text-slate-300" />
              <p className="text-sm font-bold text-slate-800">No teams found matching "{search}"</p>
              <p className="text-xs text-slate-400">Try searching for another team name or member name.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedTeams.map((team) => {
                const IconComponent = team.icon || Users;

                return (
                  <article
                    key={team._id}
                    className="bg-white rounded-2xl border border-slate-200/80 p-5 team-card-shadow flex flex-col justify-between space-y-6"
                  >
                    {/* Card Header: Left Icon + Title & Tagline */}
                    <div className="flex items-start gap-4">
                      {/* Icon Container */}
                      <div className={`w-12 h-12 rounded-2xl ${team.iconBg || "bg-blue-50 text-blue-600"} flex items-center justify-center shrink-0 shadow-sm`}>
                        <IconComponent size={22} />
                      </div>

                      {/* Title and Tagline */}
                      <div className="space-y-1 overflow-hidden">
                        <h3 className="text-base font-extrabold text-slate-900 truncate">
                          {team.teamName}
                        </h3>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-2">
                          {team.tagline || "Building something meaningful."}
                        </p>
                      </div>
                    </div>

                    {/* Card Footer: Avatars + Members count + View Button */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      
                      {/* Left: Avatar Stack + Count */}
                      <div className="flex items-center gap-2.5">
                        <div className="flex -space-x-2 overflow-hidden">
                          {team.members.slice(0, 3).map((member, idx) => {
                            const memberName = getMemberName(member);

                            return (
                              <div
                                key={member._id || member.id || idx}
                                className={`w-7 h-7 rounded-full ${
                                  member.avatarBg ||
                                  AVATAR_BACKGROUNDS[idx % AVATAR_BACKGROUNDS.length]
                                } text-white text-[10px] font-bold flex items-center justify-center border-2 border-white shadow-xs`}
                                title={memberName}
                              >
                                {memberName.charAt(0).toUpperCase()}
                              </div>
                            );
                          })}
                        </div>

                        <span className="text-xs font-semibold text-slate-500">
                          {team.members.length} members
                        </span>
                      </div>

                      {/* Right: Action Arrow Button */}
                      <button
                        onClick={() => setSelectedTeam(team)}
                        className="w-8 h-8 rounded-full bg-slate-100/80 text-slate-600 btn-arrow-hover flex items-center justify-center cursor-pointer"
                        title="View Team Details"
                      >
                        <ArrowRight size={15} />
                      </button>

                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {/* PAGINATION BAR */}
          <div className="flex items-center justify-center gap-2 pt-6">
            <button
              onClick={() => setActivePage((prev) => Math.max(prev - 1, 1))}
              disabled={activePage === 1}
              className="w-9 h-9 rounded-xl border border-slate-200 bg-white text-slate-600 flex items-center justify-center text-xs font-semibold hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              <ChevronLeft size={16} />
            </button>

            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (page) => (
                <button
                  key={page}
                  onClick={() => setActivePage(page)}
                  className={`w-9 h-9 rounded-xl text-xs font-extrabold flex items-center justify-center transition-all cursor-pointer ${
                    activePage === page
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                      : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {page}
                </button>
              )
            )}

            <button
              onClick={() => setActivePage((prev) => Math.min(prev + 1, totalPages))}
              disabled={activePage === totalPages}
              className="w-9 h-9 rounded-xl border border-slate-200 bg-white text-slate-600 flex items-center justify-center text-xs font-semibold hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </section>

      </main>

      {/* TEAM DETAIL MODAL POPUP */}
      {selectedTeam && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setSelectedTeam(null)}
        >
          <div
            className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative border border-slate-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedTeam(null)}
              className="absolute top-6 right-6 w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            {/* Modal Header */}
            <div className="space-y-1 pr-8">
              <span className="text-[10px] font-black text-indigo-600 tracking-widest uppercase">
                PARTICIPATING TEAM
              </span>

              <div className="flex items-center gap-3 pt-1">
                <div className={`w-10 h-10 rounded-xl ${selectedTeam.iconBg || "bg-blue-50 text-blue-600"} flex items-center justify-center shrink-0`}>
                  {selectedTeam.icon ? <selectedTeam.icon size={20} /> : <Users size={20} />}
                </div>

                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                  {selectedTeam.teamName}
                </h2>
              </div>

              <p className="text-xs text-slate-500 font-medium leading-relaxed pt-1">
                {selectedTeam.tagline || "Building innovative solutions for Makeμ 2026."}
              </p>
            </div>

            {/* Team Members List */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Team Members ({selectedTeam.members.length})
              </h4>

              <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                {selectedTeam.members.map((member, index) => {
                  const memberName = getMemberName(member);
                  const isTeamLead =
                    typeof member === "object" && member?.isTeamLead === true;

                  return (
                    <div
                      key={member._id || member.id || index}
                      className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/80 border border-slate-100"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-full ${
                            member.avatarBg ||
                            AVATAR_BACKGROUNDS[index % AVATAR_BACKGROUNDS.length]
                          } text-white font-extrabold text-xs flex items-center justify-center shadow-xs`}
                        >
                          {memberName.charAt(0).toUpperCase()}
                        </div>

                        <span className="text-xs font-bold text-slate-900">
                          {memberName}
                        </span>
                      </div>

                      {isTeamLead && (
                        <span className="text-[10px] font-extrabold text-indigo-600 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-full uppercase tracking-wider">
                          Team Lead
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedTeam(null)}
                className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-6 py-3 rounded-xl transition-colors cursor-pointer"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
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
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-slate-300">
            <a href="#home" className="hover:text-white transition-colors">Home</a>
            <span className="text-slate-700">|</span>
            <a href="#checkpoint" className="hover:text-white transition-colors">Checkpoint</a>
            <span className="text-slate-700">|</span>
            <a href="#teams" className="hover:text-white transition-colors">Teams</a>
            <span className="text-slate-700">|</span>
            <a href="#leaderboard" className="hover:text-white transition-colors">Leaderboard</a>
          </div>

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

export default Teams;