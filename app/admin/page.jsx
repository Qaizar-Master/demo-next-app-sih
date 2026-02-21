"use client";
import React, { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/client-api";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    ShieldCheck, Users, CheckCircle, XCircle, Clock, Loader2,
    RefreshCw, Star, MessageSquare, Leaf, ChevronDown, ChevronUp,
    AlertTriangle, Trophy, Zap, X,
} from "lucide-react";
import toast from "react-hot-toast";

// ─── Tabs ──────────────────────────────────────────────────────────────────
const TABS = [
    { id: "community", label: "Community Requests", icon: Users },
    { id: "actions", label: "Eco-Action Reviews", icon: Leaf },
];

// ─── Helper badge colours ───────────────────────────────────────────────────
const statusStyles = {
    PENDING: "bg-yellow-100 text-yellow-800",
    APPROVED: "bg-green-100  text-green-800",
    REJECTED: "bg-red-100    text-red-800",
    AI_APPROVED: "bg-blue-100 text-blue-800",
};

// ─── Review Dialog ──────────────────────────────────────────────────────────
function ReviewDialog({ title, onClose, onSubmit, showPoints = false, defaultPoints = 25 }) {
    const [note, setNote] = useState("");
    const [pts, setPts] = useState(defaultPoints);
    const [loading, setLoading] = useState(false);

    const submit = async (status) => {
        setLoading(true);
        try {
            await onSubmit(status, note, pts);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6"
            >
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
                </div>

                {showPoints && (
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Points to Award</label>
                        <input
                            type="number"
                            min={0}
                            max={500}
                            value={pts}
                            onChange={(e) => setPts(Number(e.target.value))}
                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                        />
                    </div>
                )}

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Admin Note (optional)</label>
                    <textarea
                        rows={3}
                        placeholder="Reason for approval/rejection..."
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 outline-none resize-none"
                    />
                </div>

                <div className="flex gap-3">
                    <Button variant="outline" className="flex-1" onClick={onClose} disabled={loading}>Cancel</Button>
                    <Button
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white"
                        onClick={() => submit("REJECTED")}
                        disabled={loading}
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4 mr-1" />}
                        Reject
                    </Button>
                    <Button
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => submit("APPROVED")}
                        disabled={loading}
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4 mr-1" />}
                        Approve
                    </Button>
                </div>
            </motion.div>
        </div>
    );
}

// ─── Community Requests Tab ─────────────────────────────────────────────────
function CommunityRequestsTab() {
    const [requests, setRequests] = useState([]);
    const [filter, setFilter] = useState("PENDING");
    const [loading, setLoading] = useState(true);
    const [reviewing, setReviewing] = useState(null); // request being reviewed

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const data = await api.adminGetCommunityRequests(filter);
            setRequests(data);
        } catch (e) {
            toast.error(e.message ?? "Failed to load requests");
        }
        setLoading(false);
    }, [filter]);

    useEffect(() => { load(); }, [load]);

    const handleReview = async (status, adminNote) => {
        try {
            const res = await api.adminReviewCommunityRequest(reviewing.id, status, adminNote);
            toast.success(
                status === "APPROVED"
                    ? `✅ Community approved! Join code: ${res.community?.joinCode ?? "—"}`
                    : "❌ Request rejected"
            );
            setReviewing(null);
            load();
        } catch (e) {
            toast.error(e.message ?? "Review failed");
        }
    };

    return (
        <div className="space-y-4">
            {/* Filter tabs */}
            <div className="flex gap-2 flex-wrap">
                {["PENDING", "APPROVED", "REJECTED"].map((s) => (
                    <button
                        key={s}
                        onClick={() => setFilter(s)}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${filter === s
                                ? s === "PENDING" ? "bg-yellow-500 text-white" : s === "APPROVED" ? "bg-green-600 text-white" : "bg-red-500 text-white"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                    >
                        {s.charAt(0) + s.slice(1).toLowerCase()}
                    </button>
                ))}
                <button onClick={load} className="ml-auto text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100">
                    <RefreshCw className="w-4 h-4" />
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-green-500" /></div>
            ) : requests.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                    <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>No {filter.toLowerCase()} requests</p>
                </div>
            ) : (
                <AnimatePresence>
                    {requests.map((r, i) => (
                        <motion.div
                            key={r.id}
                            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.04 }}
                        >
                            <Card className="border border-gray-200 hover:shadow-md transition-shadow">
                                <CardContent className="p-5">
                                    <div className="flex items-start justify-between gap-4 flex-wrap">
                                        <div className="flex items-start gap-3 flex-1 min-w-0">
                                            {r.user?.avatarUrl ? (
                                                <img src={r.user.avatarUrl} className="w-10 h-10 rounded-full object-cover" alt="" />
                                            ) : (
                                                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold">
                                                    {r.user?.fullName?.[0] ?? "?"}
                                                </div>
                                            )}
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <h3 className="font-bold text-gray-900">{r.communityName}</h3>
                                                    <Badge className={`text-xs ${statusStyles[r.status]}`}>{r.status}</Badge>
                                                </div>
                                                <p className="text-sm text-gray-500 mt-0.5">{r.description || "No description"}</p>
                                                <div className="mt-2 flex items-center gap-3 text-xs text-gray-400">
                                                    <span>By <strong>{r.user?.fullName ?? "Unknown"}</strong></span>
                                                    <span>·</span>
                                                    <span className="flex items-center gap-1"><Star className="w-3 h-3" /> {r.user?.totalPoints ?? 0} pts</span>
                                                    <span>·</span>
                                                    <span>{new Date(r.createdAt).toLocaleDateString()}</span>
                                                </div>
                                                {r.adminNote && (
                                                    <p className="mt-2 text-xs text-gray-500 italic bg-gray-50 rounded px-2 py-1">
                                                        Note: {r.adminNote}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {r.status === "PENDING" && (
                                            <Button
                                                size="sm"
                                                className="bg-indigo-600 hover:bg-indigo-700 text-white flex-shrink-0"
                                                onClick={() => setReviewing(r)}
                                            >
                                                Review
                                            </Button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </AnimatePresence>
            )}

            {reviewing && (
                <ReviewDialog
                    title={`Review: "${reviewing.communityName}"`}
                    onClose={() => setReviewing(null)}
                    onSubmit={handleReview}
                    showPoints={false}
                />
            )}
        </div>
    );
}

// ─── Eco-Action Reviews Tab ─────────────────────────────────────────────────
function EcoActionsTab() {
    const [actions, setActions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [reviewing, setReviewing] = useState(null);
    const [expanded, setExpanded] = useState(null);

    const load = async () => {
        setLoading(true);
        try {
            const data = await api.adminGetPendingActions();
            setActions(data);
        } catch (e) {
            toast.error(e.message ?? "Failed to load actions");
        }
        setLoading(false);
    };

    useEffect(() => { load(); }, []);

    const handleReview = async (status, adminNote, pts) => {
        try {
            await api.adminReviewAction(reviewing.id, status, pts, adminNote);
            toast.success(status === "APPROVED" ? `✅ Action approved! +${pts} pts` : "❌ Action rejected");
            setReviewing(null);
            load();
        } catch (e) {
            toast.error(e.message ?? "Review failed");
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">{actions.length} pending action{actions.length !== 1 ? "s" : ""}</p>
                <button onClick={load} className="text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100">
                    <RefreshCw className="w-4 h-4" />
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-green-500" /></div>
            ) : actions.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                    <CheckCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>No pending actions — all clear!</p>
                </div>
            ) : (
                <AnimatePresence>
                    {actions.map((a, i) => (
                        <motion.div
                            key={a.id}
                            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.04 }}
                        >
                            <Card className="border border-gray-200 hover:shadow-md transition-shadow">
                                <CardContent className="p-5">
                                    <div className="flex items-start justify-between gap-4 flex-wrap">
                                        <div className="flex items-start gap-3 flex-1 min-w-0">
                                            {a.user?.avatarUrl ? (
                                                <img src={a.user.avatarUrl} className="w-10 h-10 rounded-full object-cover" alt="" />
                                            ) : (
                                                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold">
                                                    {a.user?.fullName?.[0] ?? "?"}
                                                </div>
                                            )}
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <h3 className="font-bold text-gray-900">{a.title || a.category}</h3>
                                                    <Badge className={`text-xs ${statusStyles[a.status]}`}>{a.status}</Badge>
                                                    {a.aiConfidence !== null && (
                                                        <span className="text-xs text-gray-400">AI: {Math.round(a.aiConfidence * 100)}%</span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-gray-400 mt-0.5">
                                                    {a.user?.fullName ?? "Unknown user"} · {a.community?.name ? `📍 ${a.community.name}` : "No community"} · {new Date(a.createdAt).toLocaleDateString()}
                                                </p>

                                                {/* Expandable images */}
                                                <button
                                                    onClick={() => setExpanded(expanded === a.id ? null : a.id)}
                                                    className="mt-2 text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                                                >
                                                    {expanded === a.id ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                                                    {expanded === a.id ? "Hide photos" : "View before/after photos"}
                                                </button>

                                                {expanded === a.id && (
                                                    <div className="mt-3 grid grid-cols-2 gap-3">
                                                        {a.beforeImage && (
                                                            <div>
                                                                <p className="text-xs text-gray-400 mb-1">Before</p>
                                                                <img src={a.beforeImage} alt="before" className="w-full h-32 object-cover rounded-xl border" />
                                                            </div>
                                                        )}
                                                        {a.afterImage && (
                                                            <div>
                                                                <p className="text-xs text-gray-400 mb-1">After</p>
                                                                <img src={a.afterImage} alt="after" className="w-full h-32 object-cover rounded-xl border" />
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <Button
                                            size="sm"
                                            className="bg-indigo-600 hover:bg-indigo-700 text-white flex-shrink-0"
                                            onClick={() => setReviewing(a)}
                                        >
                                            Review
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </AnimatePresence>
            )}

            {reviewing && (
                <ReviewDialog
                    title={`Review: "${reviewing.title || reviewing.category}"`}
                    onClose={() => setReviewing(null)}
                    onSubmit={handleReview}
                    showPoints
                    defaultPoints={25}
                />
            )}
        </div>
    );
}

// ─── Page ───────────────────────────────────────────────────────────────────
export default function AdminDashboard() {
    const [tab, setTab] = useState("community");
    const [profile, setProfile] = useState(null);
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        api.getProfile()
            .then((p) => { setProfile(p); setChecking(false); })
            .catch(() => setChecking(false));
    }, []);

    if (checking) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-green-500" />
            </div>
        );
    }

    if (!profile?.isAdmin) {
        return (
            <div className="min-h-screen flex items-center justify-center p-8">
                <div className="text-center max-w-sm">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertTriangle className="w-10 h-10 text-red-500" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
                    <p className="text-gray-500">You need admin privileges to view this page.</p>
                    <p className="text-xs text-gray-400 mt-2">
                        Set <code className="bg-gray-100 px-1 rounded">isAdmin = true</code> on your Profile in Supabase.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 p-4 md:p-8">
            <div className="max-w-4xl mx-auto space-y-6">

                {/* Header */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                            <ShieldCheck className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                            <p className="text-gray-500 text-sm">Manage community requests and eco-action reviews</p>
                        </div>
                    </div>
                </motion.div>

                {/* Tab navigation */}
                <div className="flex gap-2 bg-white rounded-2xl p-1.5 shadow-sm border border-gray-200 w-fit">
                    {TABS.map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            onClick={() => setTab(id)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${tab === id
                                    ? "bg-indigo-600 text-white shadow-md"
                                    : "text-gray-600 hover:bg-gray-100"
                                }`}
                        >
                            <Icon className="w-4 h-4" />
                            {label}
                        </button>
                    ))}
                </div>

                {/* Tab content */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={tab}
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        {tab === "community" && <CommunityRequestsTab />}
                        {tab === "actions" && <EcoActionsTab />}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
