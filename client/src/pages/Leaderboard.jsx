import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
    Trophy,
    Medal,
    Crown,
    Search,
    ArrowUpDown,
    BarChart3,
    Sparkles,
    ChevronRight,
    Award,
    Zap,
    TrendingUp,
    RefreshCw,
    X,
    Users,
    User,
    Menu,
    ChevronDown,
    LogOut
} from "lucide-react";

export default function LeaderboardApp() {
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("total-desc");
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [error, setError] = useState("");
    const [activeTab, setActiveTab] = useState("Leaderboard");
    const [showMentorMenu, setShowMentorMenu] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [mentorData, setMentorData] = useState(null);

    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

    useEffect(() => {
        const storedMentor = sessionStorage.getItem("mentor");

        if (storedMentor) {
            try {
                setMentorData(JSON.parse(storedMentor));
            } catch {
                sessionStorage.removeItem("mentor");
            }
        }
    }, []);

    const handleLogout = () => {
        sessionStorage.removeItem("mentorToken");
        sessionStorage.removeItem("mentor");
        setMentorData(null);
        setShowMentorMenu(false);
        window.location.href = "/login";
    };

    useEffect(() => {
        const fetchLeaderboard = async () => {
            setLoading(true);
            setError("");

            try {
                const response = await axios.get(`${API_URL}/api/leaderboard`);

                const data = Array.isArray(response.data)
                    ? response.data
                    : response.data.leaderboard || response.data.data || [];

                const normalizedData = data.map((team, index) => ({
                    teamId: team.teamId || team._id || team.team?._id || `team-${index + 1}`,
                    rank: team.rank || index + 1,
                    teamName: team.teamName || team.team?.teamName || team.name || "Unnamed Team",
                    logoBg: team.logoBg || "bg-purple-500/10 text-purple-600 border-purple-200",
                    checkpoint1: team.checkpoint1 ?? team.cp1 ?? null,
                    checkpoint2: team.checkpoint2 ?? team.cp2 ?? null,
                    checkpoint3: team.checkpoint3 ?? team.cp3 ?? null,
                    checkpoint4: team.checkpoint4 ?? team.cp4 ?? null,
                    total: Number(team.total ?? 0),
                    members: Array.isArray(team.members)
                        ? team.members.map((member) =>
                            typeof member === "string" ? member : member.name
                        )
                        : [],
                    project: team.project || team.team?.project || team.tagline || team.team?.tagline || ""
                }));

                // Backend returns the leaderboard already ranked by total score.
                // Re-rank here as a safety measure so the UI stays correct after sorting/filtering.
                normalizedData.sort((a, b) => b.total - a.total);
                normalizedData.forEach((team, index) => {
                    team.rank = index + 1;
                });

                setLeaderboard(normalizedData);
            } catch (error) {
                console.error("Failed to load leaderboard:", error);
                setError(
                    error.response?.data?.message ||
                    "Failed to load leaderboard. Please try again."
                );
                setLeaderboard([]);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, [API_URL]);

    const filteredAndSortedLeaderboard = useMemo(() => {
        let result = [...leaderboard];

        if (searchQuery.trim() !== "") {
            const q = searchQuery.toLowerCase();
            result = result.filter(
                (t) =>
                    t.teamName.toLowerCase().includes(q) ||
                    (t.project || "").toLowerCase().includes(q)
            );
        }

        result.sort((a, b) => {
            if (sortBy === "total-desc") return b.total - a.total;
            if (sortBy === "total-asc") return a.total - b.total;
            if (sortBy === "cp1-desc") return b.checkpoint1 - a.checkpoint1;
            if (sortBy === "cp4-desc") return b.checkpoint4 - a.checkpoint4;
            if (sortBy === "name-asc") return a.teamName.localeCompare(b.teamName);
            return 0;
        });

        return result;
    }, [leaderboard, searchQuery, sortBy]);

    // Top 3 for Podium directly from raw ranked list
    const topThree = useMemo(() => {
        const sortedByRank = [...leaderboard].sort((a, b) => a.rank - b.rank);
        return sortedByRank.slice(0, 3);
    }, [leaderboard]);

    const openTeamDetails = async (team) => {
        try {
            const response = await axios.get(
                `${API_URL}/api/teams/${team.teamId}`
            );

            const teamData = response.data.team || response.data;

            setSelectedTeam({
                ...team,
                members: Array.isArray(teamData.members)
                    ? teamData.members.map((member) =>
                        typeof member === "string"
                            ? member
                            : member.name
                    )
                    : []
            });
        } catch (error) {
            console.error("Failed to load team members:", error);

            // Still open the modal with whatever data we already have
            setSelectedTeam(team);
        }
    };

    return (
        <div className="min-h-screen bg-[#0d091a] text-slate-100 font-sans antialiased selection:bg-purple-500 selection:text-white">

            <style>
                {`
                .mu-symbol-gradient {
          background: linear-gradient(135deg, #60A5FA 0%, #A855F7 50%, #EC4899 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
                `}
            </style>

            <header className="bg-[#090D1E] text-white sticky top-0 z-40 border-b border-white/10 px-4 sm:px-8 lg:px-16 py-3.5 shadow-md">

                <div className="max-w-7xl mx-auto">

                    <div className="flex items-center justify-between">

                        {/* Logo */}

                        <Link
                            to="/"
                            className="flex items-center"
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

                        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">

                            <Link
                                to="/"
                                className="text-slate-300 hover:text-white transition-colors"
                            >
                                Home
                            </Link>

                            <Link
                                to="/checkpoint"
                                className="text-slate-300 hover:text-white transition-colors"
                            >
                                Checkpoints
                            </Link>

                            <Link
                                to="/teams"
                                className="text-slate-300 hover:text-white transition-colors"
                            >
                                Teams
                            </Link>

                            <Link
                                to="/leaderboard"
                                className="relative text-white font-bold py-1"
                            >
                                Leaderboard

                                <span className="absolute bottom-0 left-0 w-full h-[2.5px] bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-full" />
                            </Link>

                        </nav>


                        {/* Desktop Mentor Menu */}

                        {/* <div className="hidden md:block relative">

                            <button
                                onClick={() =>
                                    setShowMentorMenu(!showMentorMenu)
                                }
                                className="bg-white/10 hover:bg-white/15 text-white text-xs font-semibold px-4 py-2.5 rounded-full border border-white/15 flex items-center gap-2 transition-all cursor-pointer"
                            >

                                <div className="w-5 h-5 rounded-full bg-purple-500/30 flex items-center justify-center text-purple-300">
                                    <User size={13} />
                                </div>

                                <span>
                                    {mentorData?.username || "Mentor"}
                                </span>

                                <ChevronDown
                                    size={14}
                                    className={`transition-transform duration-200 ${showMentorMenu
                                        ? "rotate-180"
                                        : ""
                                        }`}
                                />

                            </button>


                            {showMentorMenu && (
                                <div className="absolute right-0 mt-2 w-56 bg-[#0D1224] border border-white/15 rounded-2xl shadow-2xl p-2 z-50 text-xs">

                                    <div className="px-3 py-2 border-b border-white/10 mb-1">

                                        <p className="font-bold text-white">
                                            Mentor Portal
                                        </p>

                                        <p className="text-[10px] text-slate-400">
                                            {mentorData?.username ||
                                                "Authorized Mentor"}
                                        </p>

                                    </div>

                                    <button
                                        onClick={() =>
                                            setShowMentorMenu(false)
                                        }
                                        className="w-full text-left px-3 py-2 text-slate-300 hover:bg-white/10 rounded-xl transition-colors font-medium"
                                    >
                                        Evaluation Guidelines
                                    </button>

                                    <button
                                        onClick={() =>
                                            setShowMentorMenu(false)
                                        }
                                        className="w-full text-left px-3 py-2 text-slate-300 hover:bg-white/10 rounded-xl transition-colors font-medium"
                                    >
                                        My Submissions
                                    </button>

                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-3 py-2 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors font-medium flex items-center gap-2"
                                    >
                                        <LogOut size={14} />
                                        Sign Out
                                    </button>

                                </div>
                            )}

                        </div> */}


                        {/* Mobile Menu Button */}

                        <button
                            onClick={() =>
                                setShowMobileMenu(!showMobileMenu)
                            }
                            className="md:hidden w-10 h-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center"
                        >
                            {showMobileMenu ? (
                                <X size={20} />
                            ) : (
                                <Menu size={20} />
                            )}
                        </button>

                    </div>


                    {/* Mobile Menu */}

                    {showMobileMenu && (
                        <div className="md:hidden mt-4 pt-4 pb-2 border-t border-white/10 space-y-1">

                            <Link
                                to="/"
                                onClick={() =>
                                    setShowMobileMenu(false)
                                }
                                className="block px-4 py-3 rounded-xl text-sm text-slate-300 hover:text-white hover:bg-white/10"
                            >
                                Home
                            </Link>

                            <Link
                                to="/checkpoint"
                                onClick={() =>
                                    setShowMobileMenu(false)
                                }
                                className="block px-4 py-3 rounded-xl text-sm font-bold text-white bg-white/10"
                            >
                                Checkpoints
                            </Link>

                            <Link
                                to="/teams"
                                onClick={() =>
                                    setShowMobileMenu(false)
                                }
                                className="block px-4 py-3 rounded-xl text-sm text-slate-300 hover:text-white hover:bg-white/10"
                            >
                                Teams
                            </Link>

                            <Link
                                to="/leaderboard"
                                onClick={() =>
                                    setShowMobileMenu(false)
                                }
                                className="block px-4 py-3 rounded-xl text-sm text-slate-300 hover:text-white hover:bg-white/10"
                            >
                                Leaderboard
                            </Link>

                            <button
                                onClick={handleLogout}
                                className="w-full text-left px-4 py-3 rounded-xl text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-2"
                            >
                                <LogOut size={16} />
                                Sign Out
                            </button>

                        </div>
                    )}

                </div>

            </header>

            {/* HERO SECTION */}
            { }
            <section className="relative pt-12 pb-16 overflow-hidden bg-gradient-to-b from-[#0d091a] via-[#120a2b] to-[#0f0b1f]">
                {/* Glow ambient background circles */}
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                        {/* Left Column - Titles */}
                        <div className="lg:col-span-8 space-y-3 text-center lg:text-left">
                            <span className="inline-block text-xs font-bold tracking-widest text-purple-300 uppercase bg-purple-900/40 px-3.5 py-1.5 rounded-full border border-purple-500/30">
                                IDEAS TODAY. A BETTER TOMORROW.
                            </span>
                            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-100 to-purple-400">
                                Leaderboard
                            </h1>
                            <p className="text-slate-300 text-base sm:text-lg max-w-xl font-normal">
                                Celebrating the teams who turn ideas into impact. Track total
                                performance across all four checkpoints.
                            </p>
                        </div>

                        {/* Right Column - Quote Card & Sponsor */}
                        <div className="lg:col-span-4 flex flex-col items-center lg:items-end space-y-4">
                            <div className="w-full max-w-sm bg-purple-950/40 border border-purple-500/20 backdrop-blur-md rounded-2xl p-5 shadow-xl">
                                <div className="flex items-start gap-3">
                                    <span className="text-3xl text-purple-400 leading-none select-none font-serif">
                                        “
                                    </span>
                                    <p className="text-sm italic font-medium text-purple-100">
                                        Teamwork turns ideas into reality.
                                    </p>
                                    <span className="text-3xl text-purple-400 leading-none select-none font-serif self-end">
                                        ”
                                    </span>
                                </div>
                                <div className="mt-3 pt-3 border-t border-purple-800/40 flex items-center justify-between text-xs text-slate-400">
                                    <span>MAKEμ 2026 Edition</span>
                                    <div className="h-1 w-8 bg-purple-500 rounded-full" />
                                </div>
                            </div>

                            {/* Sponsor badge */}
                            <div className="w-full max-w-sm bg-[#160d33] border border-purple-800/30 rounded-xl p-3 px-4 flex items-center justify-between shadow-lg">
                                <span className="text-xs text-slate-400 font-medium">
                                    Powered by
                                </span>
                                <div className="flex items-center gap-1.5 font-bold text-sm tracking-wide">
                                    <span className="text-purple-400 text-base font-mono">μ</span><span className="text-white">Learn IDK</span>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* MAIN CONTAINER FOR PODIUM AND TABLE */}
            { }
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
                {/* PODIUM SECTION */}
                {!loading && topThree.length >= 3 && (
                    <section className="relative">
                        <div className="text-center mb-6">
                            <span className="text-xs font-semibold text-purple-400 tracking-wider uppercase">
                                HALL OF FAME
                            </span>
                            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center justify-center gap-2">
                                <Trophy className="w-5 h-5 text-amber-400" />
                                Top Performers
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end max-w-4xl mx-auto">
                            {/* RANK 2 - ByteBenders (Left) */}
                            <div className="order-2 md:order-1 bg-white text-slate-900 rounded-2xl p-6 shadow-xl border-2 border-slate-200 relative flex flex-col items-center text-center transform transition duration-300 hover:-translate-y-1">
                                {/* Silver badge */}
                                <div className="absolute -top-5 w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-md flex items-center justify-center text-slate-700 font-bold text-lg">
                                    2
                                </div>
                                <div className="mt-3 mb-2 w-14 h-14 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 shadow-inner">
                                    <Medal className="w-8 h-8 text-slate-500" />
                                </div>
                                <h3 className="font-bold text-lg text-slate-800">
                                    {topThree[1]?.teamName}
                                </h3>
                                <span className="text-xs text-slate-500 mt-0.5 mb-3 font-medium">
                                    Total Score
                                </span>
                                <div className="text-3xl font-extrabold text-slate-900">
                                    {topThree[1]?.total}
                                </div>
                                <button
                                    onClick={() => openTeamDetails(topThree[1])}
                                    className="mt-4 text-xs font-semibold text-purple-600 hover:text-purple-800 flex items-center gap-1"
                                >
                                    View Details <ChevronRight className="w-3.5 h-3.5" />
                                </button>
                            </div>

                            {/* RANK 1 - TechTide (Center - HIGHLIGHTED) */}
                            <div className="order-1 md:order-2 bg-gradient-to-b from-amber-50 to-white text-slate-900 rounded-2xl p-7 shadow-2xl border-2 border-amber-300 relative flex flex-col items-center text-center transform transition duration-300 hover:-translate-y-2 md:-mt-6">
                                {/* Sparkle decorative icons */}
                                <Sparkles className="absolute top-3 left-3 w-5 h-5 text-amber-400 animate-pulse" />
                                <Sparkles className="absolute top-3 right-3 w-5 h-5 text-amber-400 animate-pulse" />

                                {/* Gold Crown Badge */}
                                <div className="absolute -top-6 w-12 h-12 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 border-2 border-white shadow-lg flex items-center justify-center text-amber-950 font-black text-xl">
                                    <Crown className="w-7 h-7 text-amber-900 fill-amber-400" />
                                </div>

                                <div className="mt-4 mb-2 w-16 h-16 rounded-full bg-amber-100/80 border border-amber-200 flex items-center justify-center text-amber-600 shadow-inner">
                                    <Trophy className="w-9 h-9 text-amber-500 fill-amber-400" />
                                </div>

                                <h3 className="font-black text-xl text-slate-900 tracking-tight">
                                    {topThree[0]?.teamName}
                                </h3>
                                <span className="text-xs text-amber-700 font-semibold uppercase tracking-wider mt-0.5 mb-2">
                                    Tournament Leader
                                </span>

                                <div className="text-4xl font-black text-amber-600">
                                    {topThree[0]?.total}
                                </div>
                                <span className="text-xs text-slate-400 font-medium">
                                    / 100 total pts
                                </span>

                                <button
                                    onClick={() => openTeamDetails(topThree[0])}
                                    className="mt-4 px-4 py-1.5 rounded-full bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs transition shadow-md flex items-center gap-1"
                                >
                                    Champion Card <ChevronRight className="w-3.5 h-3.5" />
                                </button>
                            </div>

                            {/* RANK 3 - NovaMinds (Right) */}
                            <div className="order-3 md:order-3 bg-white text-slate-900 rounded-2xl p-6 shadow-xl border-2 border-amber-800/20 relative flex flex-col items-center text-center transform transition duration-300 hover:-translate-y-1">
                                {/* Bronze badge */}
                                <div className="absolute -top-5 w-10 h-10 rounded-full bg-amber-100 border-2 border-white shadow-md flex items-center justify-center text-amber-800 font-bold text-lg">
                                    3
                                </div>
                                <div className="mt-3 mb-2 w-14 h-14 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center text-amber-700 shadow-inner">
                                    <Award className="w-8 h-8 text-amber-700" />
                                </div>
                                <h3 className="font-bold text-lg text-slate-800">
                                    {topThree[2]?.teamName}
                                </h3>
                                <span className="text-xs text-slate-500 mt-0.5 mb-3 font-medium">
                                    Total Score
                                </span>
                                <div className="text-3xl font-extrabold text-slate-900">
                                    {topThree[2]?.total}
                                </div>
                                <button
                                    onClick={() => openTeamDetails(topThree[2])}
                                    className="mt-4 text-xs font-semibold text-purple-600 hover:text-purple-800 flex items-center gap-1"
                                >
                                    View Details <ChevronRight className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                    </section>
                )}

                {/* OVERALL LEADERBOARD TABLE SECTION */}
                { }
                <section className="bg-white text-slate-800 rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
                    {/* Table Header Controls */}
                    <div className="p-6 sm:p-8 bg-slate-50 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shadow-sm">
                                <BarChart3 className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                                    Overall Leaderboard
                                </h2>
                                <p className="text-xs sm:text-sm text-slate-500">
                                    Cumulative scores across all checkpoints.
                                </p>
                            </div>
                        </div>

                        {/* Controls: Search & Sort */}
                        <div className="flex flex-wrap items-center gap-3">
                            {/* Search Bar */}
                            <div className="relative flex-1 sm:w-64">
                                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    placeholder="Search team or project..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-slate-300 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition shadow-sm"
                                />
                            </div>

                            {/* Sort Selector */}
                            <div className="flex items-center gap-2 bg-white border border-slate-300 rounded-xl px-3 py-2 shadow-sm">
                                <ArrowUpDown className="w-4 h-4 text-slate-400" />
                                <span className="text-xs font-medium text-slate-500 hidden sm:inline">
                                    Sort by:
                                </span>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="bg-transparent text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer"
                                >
                                    <option value="total-desc">Total Score (High to Low)</option>
                                    <option value="total-asc">Total Score (Low to High)</option>
                                    {/* <option value="cp1-desc">Checkpoint 1 Score</option>
                                    <option value="cp4-desc">Checkpoint 4 Score</option> */}
                                    <option value="name-asc">Team Name (A-Z)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Loading state or Table View */}
                    {loading ? (
                        <div className="py-20 text-center flex flex-col items-center justify-center space-y-3">
                            <RefreshCw className="w-8 h-8 text-purple-600 animate-spin" />
                            <p className="text-sm font-semibold text-slate-600">
                                Loading leaderboard...
                            </p>
                        </div>
                    ) : error ? (
                        <div className="py-16 text-center text-slate-500">
                            <p className="font-semibold text-red-500">{error}</p>
                            <button
                                onClick={() => window.location.reload()}
                                className="mt-4 px-4 py-2 rounded-lg bg-purple-600 text-white text-sm font-semibold hover:bg-purple-700 transition"
                            >
                                Retry
                            </button>
                        </div>
                    ) : filteredAndSortedLeaderboard.length === 0 ? (
                        <div className="py-16 text-center text-slate-500">
                            No teams matching your search.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            { }
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-100/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                        <th className="py-4 px-6 w-16 text-center">#</th>
                                        <th className="py-4 px-6">Team Name</th>
                                        <th className="py-4 px-4 text-center">Checkpoint 1</th>
                                        <th className="py-4 px-4 text-center">Checkpoint 2</th>
                                        <th className="py-4 px-4 text-center">Checkpoint 3</th>
                                        <th className="py-4 px-4 text-center">Checkpoint 4</th>
                                        <th className="py-4 px-6 text-right">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-sm">
                                    {filteredAndSortedLeaderboard.map((team) => {
                                        const isTopThree = team.rank <= 3;
                                        return (
                                            <tr
                                                key={team.teamId}
                                                onClick={() => setSelectedTeam(team)}
                                                className="hover:bg-purple-50/50 transition cursor-pointer group"
                                            >
                                                {/* Rank Badge */}
                                                <td className="py-4 px-6 text-center font-bold">
                                                    {team.rank === 1 ? (
                                                        <span className="w-7 h-7 mx-auto rounded-full bg-amber-400 text-white flex items-center justify-center text-xs shadow-sm font-black">
                                                            1
                                                        </span>
                                                    ) : team.rank === 2 ? (
                                                        <span className="w-7 h-7 mx-auto rounded-full bg-slate-300 text-slate-800 flex items-center justify-center text-xs shadow-sm font-black">
                                                            2
                                                        </span>
                                                    ) : team.rank === 3 ? (
                                                        <span className="w-7 h-7 mx-auto rounded-full bg-amber-700/80 text-white flex items-center justify-center text-xs shadow-sm font-black">
                                                            3
                                                        </span>
                                                    ) : (
                                                        <span className="text-slate-500 text-xs font-semibold">
                                                            {team.rank}
                                                        </span>
                                                    )}
                                                </td>

                                                {/* Team Name + Logo */}
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center space-x-3">
                                                        <div
                                                            className={`w-8 h-8 rounded-full border flex items-center justify-center text-sm font-bold ${team.logoBg}`}
                                                        >
                                                            {team.teamName.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <span className="font-bold text-slate-900 group-hover:text-purple-700 transition">
                                                                {team.teamName}
                                                            </span>
                                                            {team.project && (
                                                                <p className="text-xs text-slate-400 hidden sm:block font-normal">
                                                                    {team.project}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Checkpoints */}
                                                <td className="py-4 px-4 text-center font-medium text-slate-600">
                                                    {team.checkpoint1 ?? "—"}
                                                </td>
                                                <td className="py-4 px-4 text-center font-medium text-slate-600">
                                                    {team.checkpoint2 ?? "—"}
                                                </td>
                                                <td className="py-4 px-4 text-center font-medium text-slate-600">
                                                    {team.checkpoint3 ?? "—"}
                                                </td>
                                                <td className="py-4 px-4 text-center font-medium text-slate-600">
                                                    {team.checkpoint4 ?? "—"}
                                                </td>

                                                {/* Total Score Badge */}
                                                <td className="py-4 px-6 text-right">
                                                    <span
                                                        className={`inline-block px-3 py-1 rounded-full text-xs font-black ${isTopThree
                                                            ? "bg-purple-100 text-purple-900 font-black"
                                                            : "bg-slate-100 text-slate-800"
                                                            }`}
                                                    >
                                                        {typeof team.total === "number"
                                                            ? team.total
                                                            : Number(team.total).toFixed(2)}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>

                {/* INSPIRATIONAL BANNER / CTA CARD */}
                { }
                <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#180e3b] via-[#241352] to-[#130b2e] border border-purple-800/40 p-8 sm:p-10 shadow-2xl text-white">
                    <div className="absolute top-0 right-0 w-full h-full opacity-10 bg-[radial-gradient(#a855f7_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

                    <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                        <div className="md:col-span-8 space-y-2">
                            <span className="text-3xl text-purple-400 font-serif">“</span>
                            <p className="text-lg sm:text-2xl font-bold tracking-tight text-purple-100 italic">
                                Great ideas don't just compete, they inspire.
                            </p>
                            <p className="text-xs font-semibold text-purple-300 uppercase tracking-widest pt-1">
                                — MAKE<span className="normal-case font-mono">μ</span> 2026
                            </p>
                        </div>

                        <div className="md:col-span-4 flex flex-col items-start md:items-end justify-center space-y-4">
                            <p className="text-sm text-slate-300 font-medium">
                                Keep building. The best is yet to come.
                            </p>
                            <Link
                                to="/teams"
                                className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-purple-900/50 hover:shadow-purple-700/60 transition duration-200 flex items-center gap-2 group"
                            >
                                Back to Teams
                                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

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

            {/* TEAM DETAIL MODAL */}
            { }
            {selectedTeam && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-[#150d33] border border-purple-700/40 rounded-3xl max-w-md w-full p-6 text-white shadow-2xl relative space-y-6">
                        {/* Close Button */}
                        <button
                            onClick={() => setSelectedTeam(null)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-full hover:bg-purple-900/50 transition"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        {/* Header */}
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

                        {/* Project info */}
                        <div className="bg-purple-950/50 border border-purple-800/30 rounded-2xl p-4 space-y-1">
                            <div className="text-xs text-slate-400 font-medium">
                                Project Name
                            </div>
                            <div className="text-sm font-semibold text-purple-200">
                                {selectedTeam.project}
                            </div>
                        </div>

                        {/* Checkpoint breakdown */}
                        <div className="space-y-2">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                Checkpoint Performance
                            </h4>
                            <div className="grid grid-cols-4 gap-2 text-center">
                                {[
                                    { label: "CP 1", val: selectedTeam.checkpoint1 },
                                    { label: "CP 2", val: selectedTeam.checkpoint2 },
                                    { label: "CP 3", val: selectedTeam.checkpoint3 },
                                    { label: "CP 4", val: selectedTeam.checkpoint4 }
                                ].map((cp, idx) => (
                                    <div
                                        key={idx}
                                        className="bg-[#1e1346] border border-purple-800/20 rounded-xl p-2"
                                    >
                                        <div className="text-[10px] text-slate-400 font-bold">
                                            {cp.label}
                                        </div>
                                        <div className="text-base font-extrabold text-white mt-1">
                                            {cp.val ?? "-"}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Members */}
                        {selectedTeam.members && (
                            <div className="space-y-2">
                                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
                                    <Users className="w-3.5 h-3.5 text-purple-400" /> Team Members
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {selectedTeam.members.map((m, idx) => (
                                        <span
                                            key={idx}
                                            className="text-xs font-medium bg-purple-900/40 text-purple-200 border border-purple-700/30 px-3 py-1 rounded-full"
                                        >
                                            {m}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Total Footer */}
                        <div className="pt-4 border-t border-purple-800/40 flex items-center justify-between">
                            <span className="text-sm font-medium text-slate-300">
                                Total Score
                            </span>
                            <span className="text-2xl font-black text-amber-400">
                                {selectedTeam.total}
                            </span>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}