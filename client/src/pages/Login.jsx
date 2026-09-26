import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
    User,
    Lock,
    Eye,
    EyeOff,
    LogIn,
    Info,
    Users,
    Quote,
    Check,
    Sparkles
} from "lucide-react";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";


const MentorLogin = () => {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!username || !password) {
            setStatusMessage({
                type: "error",
                text: "Please enter both username and password."
            });
            return;
        }

        setIsLoading(true);
        setStatusMessage(null);

        try {
            const response = await axios.post(`${API_URL}/api/auth/login`,
                {
                    username: username.trim(),
                    password
                }
            );

            const { token, mentor } = response.data;

            // Store authentication information
            sessionStorage.setItem("mentorToken", token);
            sessionStorage.setItem("mentor", JSON.stringify(mentor));

            setStatusMessage({
                type: "success",
                text: "Login successful! Redirecting..."
            });

            // Redirect to mentor checkpoint page
            setTimeout(() => {
                navigate("/checkpoint", { replace: true });
            }, 500);

        } catch (error) {
            console.error("Login error:", error);

            const message =
                error.response?.data?.message ||
                "Unable to login. Please try again.";

            setStatusMessage({
                type: "error",
                text: message
            });

        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#070913] flex items-center justify-center p-4 sm:p-6 lg:p-12 font-sans selection:bg-purple-500 selection:text-white">

            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400;1,500&display=swap');

        * {
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .mu-symbol-gradient {
          background: linear-gradient(135deg, #60A5FA 0%, #A855F7 50%, #EC4899 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .mu-heading-gradient {
          background: linear-gradient(135deg, #A855F7 0%, #818CF8 50%, #60A5FA 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .btn-mentor-gradient {
          background: linear-gradient(135deg, #3B82F6 0%, #6366F1 50%, #8B5CF6 100%);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .btn-mentor-gradient:hover {
          background: linear-gradient(135deg, #2563EB 0%, #4F46E5 50%, #7C3AED 100%);
          box-shadow: 0 10px 25px -5px rgba(99, 102, 241, 0.5);
          transform: translateY(-1px);
        }

        .dark-panel-bg {
          background: radial-gradient(
            circle at 10% 20%,
            rgba(30, 27, 75, 0.8) 0%,
            rgba(11, 15, 35, 1) 60%,
            rgba(7, 9, 19, 1) 100%
          );
        }

        .custom-glow {
          box-shadow: 0 0 80px 10px rgba(139, 92, 246, 0.15);
        }
      `}</style>

            {/* Main Container Card */}
            <div className="w-full max-w-5xl bg-[#0B0F23] border border-white/10 rounded-3xl overflow-hidden shadow-2xl custom-glow grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">

                {/* LEFT PANEL */}
                <div className="lg:col-span-6 relative flex flex-col justify-between p-8 sm:p-12 overflow-hidden dark-panel-bg text-white">

                    <div
                        className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-screen pointer-events-none transition-opacity duration-700 scale-105"
                        style={{
                            backgroundImage:
                                "url('https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1600&auto=format&fit=crop')"
                        }}
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F23] via-[#0B0F23]/70 to-[#0B0F23]/40 pointer-events-none" />

                    <div className="absolute top-20 right-6 hidden sm:block opacity-30 pointer-events-none font-mono text-[11px] text-purple-300 bg-purple-950/40 p-3 rounded-xl border border-purple-500/20 backdrop-blur-sm leading-relaxed">
                        <p>
                            <span className="text-pink-400">import</span>{" "}
                            &#123; <span className="text-indigo-300">μLearn</span> &#125;{" "}
                            <span className="text-pink-400">from</span>{" "}
                            <span className="text-amber-300">'@μLearn'</span>;
                        </p>

                        <p>
                            <span className="text-pink-400">const</span>{" "}
                            <span className="text-blue-300">mentor</span> ={" "}
                            <span className="text-amber-300">true</span>;
                        </p>

                        <p>
                            <span className="text-indigo-300">μLearn</span>.
                            <span className="text-purple-300">guide</span>(
                            <span className="text-cyan-300">teams</span>);
                        </p>
                    </div>

                    <div className="absolute -top-12 -left-12 w-80 h-80 bg-blue-600/20 rounded-full blur-[110px] pointer-events-none" />
                    <div className="absolute top-1/2 right-0 w-72 h-72 bg-purple-600/25 rounded-full blur-[100px] pointer-events-none" />
                    <div className="absolute -bottom-16 -left-8 w-80 h-80 bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />

                    {/* Logo */}
                    <div className="relative z-10 space-y-1">
                        <div className="flex items-center gap-1 text-2xl font-black tracking-tight">
                            <span>Make</span>
                            <span className="mu-symbol-gradient text-3xl font-bold ml-[1px]">
                                μ
                            </span>
                        </div>

                        <p className="text-[11px] text-slate-400 font-medium tracking-wider flex items-center gap-1.5">
                            <span className="uppercase">Hackathon 2026</span>
                            <span className="text-slate-600">•</span>
                            <span className="text-purple-400 font-bold normal-case">
                                by μLearn IDK
                            </span>
                        </p>
                    </div>

                    {/* Hero */}
                    <div className="relative z-10 my-10 space-y-6">

                        <p className="text-xs font-bold tracking-[0.25em] text-slate-400 uppercase">
                            GUIDE. SUPPORT. EMPOWER.
                        </p>

                        <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight text-white">
                            Mentors
                            <br />
                            Make a
                            <br />
                            <span className="mu-heading-gradient">Bigger</span>
                            <br />
                            Tomorrow.
                        </h1>

                        <div className="w-12 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full" />

                        <p className="text-sm text-slate-300 max-w-sm leading-relaxed font-normal">
                            Your experience fuels new possibilities. Thank you for guiding
                            teams in Makeμ 2026, powered by μLearn.
                        </p>
                    </div>

                    {/* Quote */}
                    <div className="relative z-10 space-y-2">
                        <Quote size={28} className="text-blue-400 opacity-90 rotate-180" />

                        <p className="text-sm font-medium italic text-slate-200">
                            “Great mentors create greater possibilities.”
                        </p>

                        <p className="text-xs font-semibold text-slate-400">
                            — Makeμ 2026 × μLearn IDK
                        </p>
                    </div>
                </div>

                {/* RIGHT PANEL */}
                <div className="lg:col-span-6 bg-[#F8FAFC] p-8 sm:p-12 flex flex-col justify-center relative text-slate-900">

                    {/* Mentor Badge */}
                    <div className="absolute top-8 right-8 hidden sm:flex flex-col items-center text-center">
                        <div className="w-14 h-14 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-2 shadow-sm">
                            <Users size={24} />
                        </div>

                        <p className="text-[9px] font-extrabold text-slate-400 tracking-wider uppercase leading-tight">
                            SAME IDEAS.
                            <br />
                            BRIGHTER
                            <br />
                            TOMORROWS.
                        </p>
                    </div>

                    {/* Header */}
                    <div className="space-y-2 mb-8 pr-0 sm:pr-24">
                        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                            Mentor Login
                        </h2>

                        <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
                            Sign in to access team submissions, evaluations and other mentor
                            tools.
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* Status */}
                        {statusMessage && (
                            <div
                                className={`p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 ${statusMessage.type === "error"
                                    ? "bg-red-50 border border-red-200 text-red-600"
                                    : "bg-emerald-50 border border-emerald-200 text-emerald-700"
                                    }`}
                            >
                                <Sparkles size={16} />
                                <span>{statusMessage.text}</span>
                            </div>
                        )}

                        {/* Username */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-700 tracking-wide">
                                Username
                            </label>

                            <div className="relative flex items-center">
                                <div className="absolute left-3.5 text-slate-400 pointer-events-none">
                                    <User size={18} />
                                </div>

                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Enter your username"
                                    className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
                                    required
                                    autoComplete="username"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-700 tracking-wide">
                                Password
                            </label>

                            <div className="relative flex items-center">
                                <div className="absolute left-3.5 text-slate-400 pointer-events-none">
                                    <Lock size={18} />
                                </div>

                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    className="w-full pl-11 pr-11 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
                                    required
                                    autoComplete="current-password"
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 text-slate-400 hover:text-slate-600 transition-colors p-1"
                                >
                                    {showPassword ? (
                                        <EyeOff size={18} />
                                    ) : (
                                        <Eye size={18} />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Remember Me */}
                        <div className="flex items-center gap-2.5 pt-1">
                            <button
                                type="button"
                                onClick={() => setRememberMe(!rememberMe)}
                                className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${rememberMe
                                    ? "bg-indigo-600 border-indigo-600 text-white"
                                    : "border-slate-300 bg-white hover:border-slate-400"
                                    }`}
                            >
                                {rememberMe && <Check size={12} strokeWidth={3} />}
                            </button>

                            <span
                                onClick={() => setRememberMe(!rememberMe)}
                                className="text-xs font-semibold text-slate-600 cursor-pointer selection:bg-none select-none"
                            >
                                Remember me
                            </span>
                        </div>

                        {/* Login Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full btn-mentor-gradient text-white text-sm font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 mt-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <LogIn size={18} />
                                    <span>Login as Mentor</span>
                                </>
                            )}
                        </button>
                    </form>

                    {/* Bottom Info */}
                    <div className="mt-8 pt-6 border-t border-slate-200/80">
                        <div className="bg-indigo-50/70 border border-indigo-100/90 rounded-2xl p-4 flex items-start gap-3 text-xs">

                            <div className="p-1 bg-indigo-100/80 rounded-lg text-indigo-600 shrink-0 mt-0.5">
                                <Info size={16} />
                            </div>

                            <div className="space-y-0.5 text-slate-600 font-medium leading-relaxed">
                                <p className="font-semibold text-slate-800">
                                    Only authorized μLearn mentors can access this portal.
                                </p>

                                <p className="text-slate-500">
                                    If you face any issues, please contact the μLearn IDK
                                    organizing team.
                                </p>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default MentorLogin;