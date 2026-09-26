import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import {
    Users,
    Layers,
    ClipboardList,
    BarChart2,
    Edit3,
    Send,
    ChevronDown,
    ChevronUp,
    User,
    Calendar,
    CheckCircle2,
    Sparkles,
    Info,
    LogOut,
    Menu,
    X
} from "lucide-react";


const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000";


// --------------------------------------------------
// CHECKPOINT DEFINITIONS
// --------------------------------------------------

const CHECKPOINT_DEFINITIONS = [
    {
        id: 1,
        title: "Checkpoint 1 – Problem Statement",
        shortTitle: "Problem Statement",
        subtitle: "Understand the problem",
        description:
            "Assess the clarity, relevance and creativity of the problem chosen.",
        date: "Sep 20, 2026"
    },
    {
        id: 2,
        title: "Checkpoint 2 – Solution Design",
        shortTitle: "Solution Design",
        subtitle: "Approach & methodology",
        description:
            "Evaluate the proposed solution, architecture and approach.",
        date: "Sep 20, 2026"
    },
    {
        id: 3,
        title: "Checkpoint 3 – Prototype / Implementation",
        shortTitle: "Prototype / Implementation",
        subtitle: "Working model / progress",
        description:
            "Assess the working prototype, features and progress.",
        date: "Sep 20, 2026"
    },
    {
        id: 4,
        title: "Checkpoint 4 – Final Presentation",
        shortTitle: "Final Presentation",
        subtitle: "Demo & impact",
        description:
            "Evaluate the final demo, impact and overall execution.",
        date: "Sep 20, 2026"
    }
];


const Checkpoints = () => {
    const navigate = useNavigate();

    // --------------------------------------------------
    // AUTH
    // --------------------------------------------------

    const token = sessionStorage.getItem("mentorToken");

    const mentorData = useMemo(() => {
        try {
            return JSON.parse(sessionStorage.getItem("mentor") || "null");
        } catch {
            return null;
        }
    }, []);


    // --------------------------------------------------
    // STATE
    // --------------------------------------------------

    const [selectedCheckpointId, setSelectedCheckpointId] = useState(1);

    const [expandedCheckpoints, setExpandedCheckpoints] = useState({
        1: true,
        2: false,
        3: false,
        4: false
    });

    const [teams, setTeams] = useState([]);

    const [evaluations, setEvaluations] = useState({
        1: [],
        2: [],
        3: [],
        4: []
    });

    const [formCheckpoint, setFormCheckpoint] = useState("1");
    const [formTeam, setFormTeam] = useState("");
    const [formScore, setFormScore] = useState("");
    const [formRemarks, setFormRemarks] = useState("");

    const [editingAssessmentId, setEditingAssessmentId] =
        useState(null);

    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [toastMessage, setToastMessage] = useState(null);

    const [showMentorMenu, setShowMentorMenu] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);


    // --------------------------------------------------
    // AXIOS CONFIG
    // --------------------------------------------------

    const authConfig = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };


    // --------------------------------------------------
    // TOAST
    // --------------------------------------------------

    const showToast = (type, text) => {
        setToastMessage({ type, text });

        setTimeout(() => {
            setToastMessage(null);
        }, 3500);
    };


    // --------------------------------------------------
    // REDIRECT IF NO TOKEN
    // --------------------------------------------------

    useEffect(() => {
        if (!token) {
            navigate("/login", { replace: true });
        }
    }, [token, navigate]);


    // --------------------------------------------------
    // LOAD TEAMS
    // --------------------------------------------------

    const loadTeams = async () => {
        try {
            const response = await axios.get(
                `${API_URL}/api/teams`
            );

            const data = response.data;

            if (Array.isArray(data)) {
                setTeams(data);
            } else if (Array.isArray(data.teams)) {
                setTeams(data.teams);
            } else {
                setTeams([]);
            }

        } catch (error) {
            console.error("Failed to load teams:", error);

            if (error.response?.status === 401) {
                handleLogout();
                return;
            }

            showToast(
                "error",
                "Unable to load teams."
            );
        }
    };


    // --------------------------------------------------
    // LOAD ALL ASSESSMENTS
    // --------------------------------------------------

    const loadAllAssessments = async () => {
        try {
            const allAssessments = {
                1: [],
                2: [],
                3: [],
                4: []
            };

            for (let checkpoint = 1; checkpoint <= 4; checkpoint++) {
                try {
                    const response = await axios.get(
                        `${API_URL}/api/assessments/checkpoint/${checkpoint}`,
                        authConfig
                    );

                    const data = response.data;

                    const list = Array.isArray(data)
                        ? data
                        : Array.isArray(data.assessments)
                            ? data.assessments
                            : [];

                    allAssessments[checkpoint] = list;

                } catch (error) {
                    console.error(
                        `Failed to load checkpoint ${checkpoint}:`,
                        error
                    );

                    if (error.response?.status === 401) {
                        handleLogout();
                        return;
                    }
                }
            }

            setEvaluations(allAssessments);

        } catch (error) {
            console.error(
                "Failed to load all assessments:",
                error
            );
        }
    };


    // --------------------------------------------------
    // INITIAL LOAD
    // --------------------------------------------------

    useEffect(() => {
        if (!token) return;

        const loadData = async () => {
            setIsLoading(true);

            await Promise.all([
                loadTeams(),
                loadAllAssessments()
            ]);

            setIsLoading(false);
        };

        loadData();
    }, []);


    // --------------------------------------------------
    // TEAM NAME HELPER
    // --------------------------------------------------

    const getTeamName = (team) => {
        return (
            team.teamName ||
            team.name ||
            team.title ||
            "Unnamed Team"
        );
    };


    // --------------------------------------------------
    // ASSESSMENT TEAM ID HELPER
    // --------------------------------------------------

    const getAssessmentTeamId = (assessment) => {
        if (!assessment?.team) return "";

        if (typeof assessment.team === "string") {
            return assessment.team;
        }

        return assessment.team._id || assessment.team.id || "";
    };


    // --------------------------------------------------
    // ASSESSMENT TEAM NAME HELPER
    // --------------------------------------------------

    const getAssessmentTeamName = (assessment) => {
        if (!assessment?.team) {
            return "Unknown Team";
        }

        if (typeof assessment.team === "string") {
            const foundTeam = teams.find(
                (team) =>
                    team._id === assessment.team ||
                    team.id === assessment.team
            );

            return foundTeam
                ? getTeamName(foundTeam)
                : assessment.team;
        }

        return (
            assessment.team.teamName ||
            assessment.team.name ||
            assessment.team.title ||
            "Unknown Team"
        );
    };


    // --------------------------------------------------
    // SCORE HELPER
    // --------------------------------------------------

    const getAssessmentScore = (assessment) => {
        return (
            assessment.score ??
            assessment.marks ??
            0
        );
    };


    // --------------------------------------------------
    // REMARKS HELPER
    // --------------------------------------------------

    const getAssessmentRemarks = (assessment) => {
        return (
            assessment.remarks ||
            assessment.comment ||
            "No remarks provided."
        );
    };


    // --------------------------------------------------
    // DATE/TIME HELPER
    // --------------------------------------------------

    const getAssessmentTime = (assessment) => {
        const date =
            assessment.createdAt ||
            assessment.updatedAt;

        if (!date) return "-";

        return new Date(date).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        });
    };


    // --------------------------------------------------
    // TOGGLE ACCORDION
    // --------------------------------------------------

    const toggleAccordion = (id) => {
        setExpandedCheckpoints((prev) => ({
            ...prev,
            [id]: !prev[id]
        }));
    };


    // --------------------------------------------------
    // CHECKPOINT SELECTION
    // --------------------------------------------------

    const handleCheckpointSelect = (id) => {
        setSelectedCheckpointId(id);
        setFormCheckpoint(String(id));

        setExpandedCheckpoints((prev) => ({
            ...prev,
            [id]: true
        }));

        cancelEditing();
    };


    // --------------------------------------------------
    // ASSESSMENT MENTOR HELPER
    // --------------------------------------------------

    const getAssessmentMentorId = (assessment) => {
        if (!assessment?.mentor) return "";

        if (typeof assessment.mentor === "string") {
            return assessment.mentor;
        }

        return assessment.mentor._id || assessment.mentor.id || "";
    };

    const getAssessmentMentorName = (assessment) => {
        if (!assessment?.mentor) return "Mentor";

        if (typeof assessment.mentor === "string") {
            return "Mentor";
        }

        return (
            assessment.mentor.name ||
            assessment.mentor.username ||
            "Mentor"
        );
    };

    const isMyAssessment = (assessment) => {
        if (!mentorData?.id) return false;

        return (
            String(getAssessmentMentorId(assessment)) ===
            String(mentorData.id)
        );
    };

    // --------------------------------------------------
    // FIND EXISTING ASSESSMENT FOR CURRENT MENTOR
    // --------------------------------------------------

    const findMyAssessment = (checkpointId, teamId) => {
        const list = evaluations[checkpointId] || [];

        return list.find(
            (assessment) =>
                isMyAssessment(assessment) &&
                String(getAssessmentTeamId(assessment)) === String(teamId)
        );
    };


    // --------------------------------------------------
    // EDIT ASSESSMENT
    // --------------------------------------------------

    const handleEdit = (assessment) => {
        if (!isMyAssessment(assessment)) {
            showToast(
                "error",
                "You can only edit your own assessment."
            );
            return;
        }

        const teamId = getAssessmentTeamId(assessment);

        setEditingAssessmentId(
            assessment._id || assessment.id
        );

        setFormCheckpoint(
            String(assessment.checkpoint)
        );

        setFormTeam(teamId);

        setFormScore(
            String(getAssessmentScore(assessment))
        );

        setFormRemarks(
            assessment.remarks || ""
        );

        setSelectedCheckpointId(
            Number(assessment.checkpoint)
        );

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };


    // --------------------------------------------------
    // CANCEL EDIT
    // --------------------------------------------------

    const cancelEditing = () => {
        setEditingAssessmentId(null);
        setFormTeam("");
        setFormScore("");
        setFormRemarks("");
    };


    // --------------------------------------------------
    // SUBMIT / UPDATE SCORE
    // --------------------------------------------------

    const handleSubmitScore = async (e) => {
        e.preventDefault();

        if (!token) {
            navigate("/login", { replace: true });
            return;
        }

        if (!formTeam) {
            showToast(
                "error",
                "Please select a team."
            );
            return;
        }

        if (
            formScore === "" ||
            isNaN(formScore) ||
            Number(formScore) < 0 ||
            Number(formScore) > 25
        ) {
            showToast(
                "error",
                "Please enter a valid score between 0 and 25."
            );
            return;
        }

        const checkpoint = Number(formCheckpoint);

        setIsSubmitting(true);

        try {
            let response;

            const payload = {
                teamId: formTeam,
                checkpoint,
                score: Number(formScore),
                remarks:
                    formRemarks.trim() ||
                    "Evaluated by mentor."
            };


            // UPDATE EXISTING ASSESSMENT
            if (editingAssessmentId) {
                response = await axios.put(
                    `${API_URL}/api/assessments/${editingAssessmentId}`,
                    {
                        score: Number(formScore),
                        remarks:
                            formRemarks.trim() ||
                            "Evaluated by mentor."
                    },
                    authConfig
                );

                showToast(
                    "success",
                    "Assessment updated successfully!"
                );

            } else {

                // CHECK IF THIS MENTOR ALREADY ASSESSED THIS TEAM
                const existing = findMyAssessment(
                    checkpoint,
                    formTeam
                );

                if (existing) {
                    showToast(
                        "error",
                        "You have already evaluated this team. Use Edit instead."
                    );

                    setIsSubmitting(false);
                    return;
                }

                response = await axios.post(
                    `${API_URL}/api/assessments`,
                    payload,
                    authConfig
                );

                showToast(
                    "success",
                    "Score submitted successfully!"
                );
            }


            // Reload assessments from backend
            await loadAllAssessments();

            setExpandedCheckpoints((prev) => ({
                ...prev,
                [checkpoint]: true
            }));

            setSelectedCheckpointId(checkpoint);

            cancelEditing();

        } catch (error) {
            console.error(
                "Assessment submission error:",
                error
            );

            if (error.response?.status === 401) {
                handleLogout();
                return;
            }

            showToast(
                "error",
                error.response?.data?.message ||
                "Unable to save assessment."
            );

        } finally {
            setIsSubmitting(false);
        }
    };


    // --------------------------------------------------
    // LOGOUT
    // --------------------------------------------------

    const handleLogout = () => {
        sessionStorage.removeItem("mentorToken");
        sessionStorage.removeItem("mentor");

        navigate("/login", {
            replace: true
        });
    };


    // --------------------------------------------------
    // STATISTICS
    // --------------------------------------------------

    const stats = useMemo(() => {
        let totalAssessments = 0;
        let scoreSum = 0;

        Object.values(evaluations).forEach((list) => {
            totalAssessments += list.length;

            list.forEach((item) => {
                scoreSum += Number(
                    getAssessmentScore(item)
                );
            });
        });

        const averageScore =
            totalAssessments > 0
                ? (scoreSum / totalAssessments).toFixed(1)
                : "0.0";

        return {
            teamsCount: teams.length,
            checkpointsCount: 4,
            totalAssessments,
            averageScore
        };
    }, [evaluations, teams]);


    // --------------------------------------------------
    // LOADING SCREEN
    // --------------------------------------------------

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#F3F6FA] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
                    <p className="text-sm font-semibold text-slate-500">
                        Loading mentor portal...
                    </p>
                </div>
            </div>
        );
    }


    // --------------------------------------------------
    // UI
    // --------------------------------------------------

    return (
        <div className="min-h-screen bg-[#F3F6FA] text-slate-800 font-sans selection:bg-purple-500 selection:text-white">

            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        * {
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .mu-symbol-gradient {
          background: linear-gradient(135deg, #60A5FA 0%, #A855F7 50%, #EC4899 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .mu-heading-gradient {
          background: linear-gradient(135deg, #0F172A 0%, #3B0764 60%, #6B21A8 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .btn-purple-gradient {
          background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #A855F7 100%);
          box-shadow: 0 4px 15px -2px rgba(139, 92, 246, 0.4);
          transition: all 0.25s ease;
        }

        .btn-purple-gradient:hover {
          background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 50%, #9333EA 100%);
          box-shadow: 0 6px 20px -2px rgba(139, 92, 246, 0.6);
          transform: translateY(-1px);
        }

        .hero-banner-bg {
          background: linear-gradient(180deg, #EBF3FF 0%, #F5F3FF 50%, #F8FAFC 100%);
        }

        .active-sidebar-pill {
          background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 50%, #9333EA 100%);
          color: white;
          box-shadow: 0 10px 20px -5px rgba(124, 58, 237, 0.35);
        }

        .dark-table-header {
          background-color: #0D1224;
        }
      `}</style>


            {/* --------------------------------------------------
          TOAST
      -------------------------------------------------- */}

            {toastMessage && (
                <div
                    className={`fixed top-20 right-6 z-[100] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border animate-bounce ${toastMessage.type === "error"
                        ? "bg-red-600 text-white border-red-500"
                        : "bg-slate-900 text-white border-white/20"
                        }`}
                >
                    {toastMessage.type === "error" ? (
                        <Info size={18} />
                    ) : (
                        <CheckCircle2
                            className="text-emerald-400"
                            size={18}
                        />
                    )}

                    <span className="text-xs font-semibold">
                        {toastMessage.text}
                    </span>
                </div>
            )}


            {/* --------------------------------------------------
          NAVBAR
      -------------------------------------------------- */}

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
                                className="relative text-white font-bold py-1"
                            >
                                Checkpoints

                                <span className="absolute bottom-0 left-0 w-full h-[2.5px] bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-full" />
                            </Link>

                            <Link
                                to="/teams"
                                className="text-slate-300 hover:text-white transition-colors"
                            >
                                Teams
                            </Link>

                            <Link
                                to="/leaderboard"
                                className="text-slate-300 hover:text-white transition-colors"
                            >
                                Leaderboard
                            </Link>

                        </nav>


                        {/* Desktop Mentor Menu */}

                        <div className="hidden md:block relative">

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

                        </div>


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


            {/* --------------------------------------------------
          HERO
      -------------------------------------------------- */}

            <section className="hero-banner-bg relative overflow-hidden pt-10 pb-12 px-4 sm:px-8 lg:px-16 border-b border-slate-200/60">

                <div className="absolute -top-10 left-1/3 w-96 h-96 bg-purple-300/20 rounded-full blur-[100px] pointer-events-none" />

                <div className="absolute top-1/2 right-10 w-80 h-80 bg-blue-300/20 rounded-full blur-[90px] pointer-events-none" />


                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">

                    <div className="lg:col-span-6 space-y-2">

                        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900">
                            Checkpoints
                        </h1>

                        <p className="text-base sm:text-lg font-bold text-slate-800 tracking-tight">
                            Evaluate. Encourage. Build Better.
                        </p>

                        <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-lg leading-relaxed">
                            Assess each team at different stages of the hackathon and help them grow.
                        </p>

                    </div>


                    <div className="lg:col-span-4 bg-white/80 backdrop-blur-md border border-slate-200/80 p-5 rounded-2xl shadow-sm space-y-2">

                        <p className="text-xs font-semibold italic text-slate-700 leading-relaxed">
                            “ Progress is built one checkpoint at a time. ”
                        </p>

                        <p className="text-[11px] font-bold text-slate-400 text-right">
                            — Makeμ 2026
                        </p>

                    </div>


                    <div className="lg:col-span-2 flex lg:justify-end items-center">

                        <div className="text-right">

                            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                                Powered by
                            </p>

                            <div className="flex items-baseline justify-end gap-0.5">
                                <span className="text-2xl font-black text-blue-600 tracking-tight">
                                    μLearn
                                </span>

                                <span className="text-xs font-black text-purple-600">
                                    IDK
                                </span>
                            </div>

                        </div>

                    </div>

                </div>

            </section>


            {/* --------------------------------------------------
          MAIN
      -------------------------------------------------- */}

            <main className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-8 space-y-8">


                {/* STATS */}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">

                    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">

                        <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                            <Users size={22} />
                        </div>

                        <div>
                            <p className="text-2xl font-black text-slate-900 tracking-tight">
                                {stats.teamsCount}
                            </p>

                            <p className="text-xs font-medium text-slate-500">
                                Teams
                            </p>
                        </div>

                    </div>


                    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">

                        <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                            <Layers size={22} />
                        </div>

                        <div>
                            <p className="text-2xl font-black text-slate-900 tracking-tight">
                                4
                            </p>

                            <p className="text-xs font-medium text-slate-500">
                                Checkpoints
                            </p>
                        </div>

                    </div>


                    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">

                        <div className="w-12 h-12 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center shrink-0">
                            <ClipboardList size={22} />
                        </div>

                        <div>
                            <p className="text-2xl font-black text-slate-900 tracking-tight">
                                {stats.totalAssessments}
                            </p>

                            <p className="text-xs font-medium text-slate-500">
                                Assessments
                            </p>
                        </div>

                    </div>


                    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">

                        <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                            <BarChart2 size={22} />
                        </div>

                        <div>
                            <p className="text-2xl font-black text-slate-900 tracking-tight">
                                {stats.averageScore}
                            </p>

                            <p className="text-xs font-medium text-slate-500">
                                Avg. Score
                            </p>
                        </div>

                    </div>

                </div>


                {/* TWO COLUMN */}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">


                    {/* LEFT SIDEBAR */}

                    <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm space-y-4">

                        <h3 className="text-base font-bold text-slate-900 px-1">
                            Checkpoints
                        </h3>


                        <div className="space-y-3">

                            {CHECKPOINT_DEFINITIONS.map((cp) => {

                                const isSelected =
                                    selectedCheckpointId === cp.id;

                                return (
                                    <button
                                        key={cp.id}
                                        onClick={() =>
                                            handleCheckpointSelect(cp.id)
                                        }
                                        className={`w-full text-left p-4 rounded-2xl transition-all duration-200 flex items-center gap-4 border cursor-pointer ${isSelected
                                            ? "active-sidebar-pill border-transparent"
                                            : "bg-white border-slate-100 hover:border-slate-200 text-slate-800 hover:bg-slate-50/80"
                                            }`}
                                    >

                                        <div
                                            className={`w-8 h-8 rounded-full font-extrabold text-xs flex items-center justify-center shrink-0 ${isSelected
                                                ? "bg-white/20 text-white"
                                                : "bg-blue-600 text-white"
                                                }`}
                                        >
                                            {cp.id}
                                        </div>


                                        <div className="space-y-0.5 overflow-hidden">

                                            <p
                                                className={`text-sm font-bold truncate ${isSelected
                                                    ? "text-white"
                                                    : "text-slate-900"
                                                    }`}
                                            >
                                                {cp.shortTitle}
                                            </p>

                                            <p
                                                className={`text-xs truncate ${isSelected
                                                    ? "text-purple-100"
                                                    : "text-slate-500 font-medium"
                                                    }`}
                                            >
                                                {cp.subtitle}
                                            </p>

                                        </div>

                                    </button>
                                );

                            })}

                        </div>

                    </div>


                    {/* RIGHT */}

                    <div className="lg:col-span-8 space-y-8">


                        {/* FORM */}

                        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-6">

                            <div className="flex items-start gap-3.5">

                                <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20">
                                    <Edit3 size={18} />
                                </div>

                                <div>

                                    <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
                                        {editingAssessmentId
                                            ? "Edit Assessment"
                                            : "Add Score"}
                                    </h3>

                                    <p className="text-xs text-slate-500 font-medium">
                                        {editingAssessmentId
                                            ? "Update your previous assessment."
                                            : "Enter the team details for the selected checkpoint."}
                                    </p>

                                </div>

                            </div>


                            <form
                                onSubmit={handleSubmitScore}
                                className="space-y-4"
                            >

                                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">


                                    {/* CHECKPOINT */}

                                    <div className="sm:col-span-4 space-y-1.5">

                                        <label className="text-xs font-bold text-slate-700">
                                            Checkpoint{" "}
                                            <span className="text-purple-600">
                                                *
                                            </span>
                                        </label>

                                        <select
                                            value={formCheckpoint}
                                            onChange={(e) => {
                                                setFormCheckpoint(e.target.value);

                                                if (!editingAssessmentId) {
                                                    setSelectedCheckpointId(
                                                        Number(e.target.value)
                                                    );
                                                }
                                            }}
                                            disabled={Boolean(editingAssessmentId)}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all cursor-pointer disabled:opacity-60"
                                        >

                                            {CHECKPOINT_DEFINITIONS.map(
                                                (cp) => (
                                                    <option
                                                        key={cp.id}
                                                        value={cp.id}
                                                    >
                                                        Checkpoint {cp.id} –{" "}
                                                        {cp.shortTitle}
                                                    </option>
                                                )
                                            )}

                                        </select>

                                    </div>


                                    {/* TEAM */}

                                    <div className="sm:col-span-4 space-y-1.5">

                                        <label className="text-xs font-bold text-slate-700">
                                            Team Name{" "}
                                            <span className="text-purple-600">
                                                *
                                            </span>
                                        </label>

                                        <select
                                            value={formTeam}
                                            onChange={(e) =>
                                                setFormTeam(e.target.value)
                                            }
                                            disabled={Boolean(editingAssessmentId)}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all cursor-pointer disabled:opacity-60"
                                        >

                                            <option value="">
                                                Select team
                                            </option>

                                            {teams.map((team) => (

                                                <option
                                                    key={team._id || team.id}
                                                    value={team._id || team.id}
                                                >
                                                    {getTeamName(team)}
                                                </option>

                                            ))}

                                        </select>

                                    </div>


                                    {/* SCORE */}

                                    <div className="sm:col-span-4 space-y-1.5">

                                        <label className="text-xs font-bold text-slate-700">
                                            Score{" "}
                                            <span className="text-purple-600">
                                                *
                                            </span>
                                        </label>

                                        <input
                                            type="number"
                                            min="0"
                                            max="25"
                                            step="1"
                                            placeholder="0 - 25"
                                            value={formScore}
                                            onChange={(e) =>
                                                setFormScore(e.target.value)
                                            }
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                                        />

                                    </div>

                                </div>


                                {/* REMARKS */}

                                <div className="space-y-1.5">

                                    <label className="text-xs font-bold text-slate-700">
                                        Remarks
                                    </label>

                                    <textarea
                                        rows={2}
                                        placeholder="Enter remarks (optional)"
                                        value={formRemarks}
                                        onChange={(e) =>
                                            setFormRemarks(e.target.value)
                                        }
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all resize-none"
                                    />

                                </div>


                                {/* ACTION BUTTONS */}

                                <div className="flex justify-end gap-3 pt-1">

                                    {editingAssessmentId && (
                                        <button
                                            type="button"
                                            onClick={cancelEditing}
                                            className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-6 py-3 rounded-xl transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="btn-purple-gradient text-white text-xs font-bold px-6 py-3 rounded-xl flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
                                    >

                                        {isSubmitting ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />

                                                <span>
                                                    {editingAssessmentId
                                                        ? "Updating..."
                                                        : "Submitting..."}
                                                </span>
                                            </>
                                        ) : (
                                            <>
                                                {editingAssessmentId ? (
                                                    <Edit3 size={15} />
                                                ) : (
                                                    <Send size={15} />
                                                )}

                                                <span>
                                                    {editingAssessmentId
                                                        ? "Update Score"
                                                        : "Submit Score"}
                                                </span>
                                            </>
                                        )}

                                    </button>

                                </div>

                            </form>

                        </div>


                        {/* EVALUATION TABLES */}

                        <div className="space-y-4">

                            {CHECKPOINT_DEFINITIONS.map(
                                (cp) => {

                                    const isExpanded =
                                        expandedCheckpoints[cp.id];

                                    const list =
                                        evaluations[cp.id] || [];

                                    return (
                                        <div
                                            key={cp.id}
                                            className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden transition-all duration-300"
                                        >

                                            {/* HEADER */}

                                            <div
                                                onClick={() =>
                                                    toggleAccordion(cp.id)
                                                }
                                                className="p-5 flex items-center justify-between cursor-pointer select-none hover:bg-slate-50/80 transition-colors"
                                            >

                                                <div className="flex items-center gap-4">

                                                    <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-extrabold text-xs flex items-center justify-center shrink-0 shadow-sm">
                                                        {cp.id}
                                                    </div>

                                                    <div>

                                                        <h4 className="text-base font-extrabold text-slate-900 tracking-tight">
                                                            {cp.title}
                                                        </h4>

                                                        <p className="text-xs text-slate-500 font-medium leading-normal">
                                                            {cp.description}
                                                        </p>

                                                    </div>

                                                </div>


                                                <div className="flex items-center gap-3 shrink-0 ml-2">

                                                    <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-slate-500 bg-slate-100/80 px-3 py-1.5 rounded-full border border-slate-200/50">

                                                        <Calendar
                                                            size={13}
                                                            className="text-slate-400"
                                                        />

                                                        <span>
                                                            {cp.date}
                                                        </span>

                                                    </div>

                                                    <div className="text-slate-400 p-1">

                                                        {isExpanded ? (
                                                            <ChevronUp
                                                                size={18}
                                                            />
                                                        ) : (
                                                            <ChevronDown
                                                                size={18}
                                                            />
                                                        )}

                                                    </div>

                                                </div>

                                            </div>


                                            {/* CONTENT */}

                                            {isExpanded && (
                                                <div className="p-4 sm:p-6 pt-0 border-t border-slate-100">

                                                    {list.length === 0 ? (

                                                        <div className="py-8 text-center text-slate-400 space-y-2">

                                                            <Info
                                                                size={24}
                                                                className="mx-auto text-slate-300"
                                                            />

                                                            <p className="text-xs font-semibold">
                                                                No assessments have been submitted
                                                                for this checkpoint yet.
                                                            </p>

                                                        </div>

                                                    ) : (

                                                        <div className="overflow-x-auto rounded-2xl border border-slate-800 shadow-sm">

                                                            <table className="w-full text-left text-xs border-collapse">

                                                                <thead>

                                                                    <tr className="dark-table-header text-white uppercase text-[11px] font-extrabold tracking-wider border-b border-slate-800">

                                                                        <th className="py-3.5 px-4 w-12 text-center">
                                                                            #
                                                                        </th>

                                                                        <th className="py-3.5 px-4 font-bold">
                                                                            Team Name
                                                                        </th>

                                                                        <th className="py-3.5 px-4 font-bold">
                                                                            Evaluated By
                                                                        </th>

                                                                        <th className="py-3.5 px-4 font-bold text-center">
                                                                            Score
                                                                            <br />
                                                                            <span className="text-[9px] text-slate-400 font-normal capitalize">
                                                                                (25)
                                                                            </span>
                                                                        </th>

                                                                        <th className="py-3.5 px-4 font-bold max-w-xs">
                                                                            Remarks
                                                                        </th>

                                                                        <th className="py-3.5 px-4 font-bold">
                                                                            Time
                                                                        </th>

                                                                        <th className="py-3.5 px-4 font-bold text-center">
                                                                            Action
                                                                        </th>

                                                                    </tr>

                                                                </thead>


                                                                <tbody className="divide-y divide-slate-100 bg-white text-slate-800 font-medium">

                                                                    {list.map(
                                                                        (
                                                                            item,
                                                                            idx
                                                                        ) => {

                                                                            const assessmentId =
                                                                                item._id ||
                                                                                item.id;

                                                                            const isEditing =
                                                                                editingAssessmentId ===
                                                                                assessmentId;

                                                                            return (
                                                                                <tr
                                                                                    key={
                                                                                        assessmentId
                                                                                    }
                                                                                    className={`hover:bg-slate-50/80 transition-colors ${isEditing
                                                                                        ? "bg-purple-50/40"
                                                                                        : ""
                                                                                        }`}
                                                                                >

                                                                                    <td className="py-3.5 px-4 text-center text-slate-400 font-bold">
                                                                                        {idx + 1}
                                                                                    </td>

                                                                                    <td className="py-3.5 px-4 font-extrabold text-slate-900">
                                                                                        {getAssessmentTeamName(
                                                                                            item
                                                                                        )}
                                                                                    </td>

                                                                                    <td className="py-3.5 px-4 text-slate-600 font-semibold">
                                                                                        <div className="flex items-center gap-2">
                                                                                            <div className="w-7 h-7 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-[10px] font-extrabold">
                                                                                                <User size={13} />
                                                                                            </div>
                                                                                            <span>
                                                                                                {getAssessmentMentorName(item)}
                                                                                            </span>
                                                                                            {isMyAssessment(item) && (
                                                                                                <span className="text-[9px] font-extrabold uppercase tracking-wide text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
                                                                                                    You
                                                                                                </span>
                                                                                            )}
                                                                                        </div>
                                                                                    </td>

                                                                                    <td className="py-3.5 px-4 text-center font-bold text-purple-700 bg-purple-50/30">
                                                                                        {getAssessmentScore(
                                                                                            item
                                                                                        )}
                                                                                        <span className="text-slate-400 font-medium">
                                                                                            {" "}
                                                                                            / 25
                                                                                        </span>
                                                                                    </td>

                                                                                    <td className="py-3.5 px-4 text-slate-600 leading-relaxed max-w-xs">
                                                                                        {getAssessmentRemarks(
                                                                                            item
                                                                                        )}
                                                                                    </td>

                                                                                    <td className="py-3.5 px-4 text-slate-500 font-medium">
                                                                                        {getAssessmentTime(
                                                                                            item
                                                                                        )}
                                                                                    </td>

                                                                                    <td className="py-3.5 px-4 text-center">

                                                                                        {isMyAssessment(item) ? (
                                                                                            <button
                                                                                                type="button"
                                                                                                onClick={() =>
                                                                                                    handleEdit(item)
                                                                                                }
                                                                                                className="inline-flex items-center gap-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 px-3 py-1.5 rounded-lg font-bold transition-colors"
                                                                                            >
                                                                                                <Edit3 size={13} />
                                                                                                <span>Edit</span>
                                                                                            </button>
                                                                                        ) : (
                                                                                            <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-500 px-3 py-1.5 rounded-lg font-bold">
                                                                                                View
                                                                                            </span>
                                                                                        )}

                                                                                    </td>

                                                                                </tr>
                                                                            );

                                                                        }
                                                                    )}

                                                                </tbody>

                                                            </table>

                                                        </div>

                                                    )}

                                                </div>
                                            )}

                                        </div>
                                    );

                                }
                            )}

                        </div>

                    </div>

                </div>

            </main>


            {/* --------------------------------------------------
          FOOTER
      -------------------------------------------------- */}

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

                    {/* Quick Nav Links
                    <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-slate-300">
                        <a href="home" className="hover:text-white transition-colors">Home</a>
                        <span className="text-slate-700">|</span>
                        <a href="checkpoint" className="hover:text-white transition-colors">Checkpoint</a>
                        <span className="text-slate-700">|</span>
                        <a href="teams" className="hover:text-white transition-colors">Teams</a>
                        <span className="text-slate-700">|</span>
                        <a href="leaderboard" className="hover:text-white transition-colors">Leaderboard</a>
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


export default Checkpoints;