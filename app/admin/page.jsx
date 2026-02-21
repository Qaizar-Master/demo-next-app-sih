"use client";
import React, { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/client-api";
import { motion, AnimatePresence } from "framer-motion";
import { Inter } from "next/font/google";
import {
    ShieldCheck, Users, CheckCircle, XCircle, Clock, Loader2,
    RefreshCw, Star, Leaf, ChevronDown, ChevronUp,
    AlertTriangle, X, ImageIcon, Circle,
} from "lucide-react";
import toast from "react-hot-toast";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

// ─── Status pill ─────────────────────────────────────────────────────────────
const STATUS = {
    PENDING: { dot: "bg-amber-400", text: "text-amber-700", bg: "bg-amber-50", label: "Pending" },
    APPROVED: { dot: "bg-emerald-400", text: "text-emerald-700", bg: "bg-emerald-50", label: "Approved" },
    REJECTED: { dot: "bg-red-400", text: "text-red-700", bg: "bg-red-50", label: "Rejected" },
    AI_APPROVED: { dot: "bg-sky-400", text: "text-sky-700", bg: "bg-sky-50", label: "AI Approved" },
};
function StatusPill({ status }) {
    const s = STATUS[status] ?? STATUS.PENDING;
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${s.bg} ${s.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
            {s.label}
        </span>
    );
}

// ─── Avatar ───────────────────────────────────────────────────────────────────
function Avatar({ url, name, size = "sm" }) {
    const dim = size === "sm" ? "w-8 h-8 text-xs" : "w-10 h-10 text-sm";
    return url ? (
        <img src={url} alt="" className={`${dim} rounded-full object-cover ring-1 ring-black/5`} />
    ) : (
        <div className={`${dim} rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center font-semibold text-slate-600`}>
            {name?.[0]?.toUpperCase() ?? "?"}
        </div>
    );
}

// ─── Modal ────────────────────────────────────────────────────────────────────
function Modal({ title, onClose, onSubmit, showPoints = false, defaultPoints = 25 }) {
    const [note, setNote] = useState("");
    const [pts, setPts] = useState(defaultPoints);
    const [busy, setBusy] = useState(false);

    const act = async (status) => {
        setBusy(true);
        try { await onSubmit(status, note, pts); }
        finally { setBusy(false); }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
            <motion.div
                initial={{ scale: 0.96, opacity: 0, y: 8 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-sm overflow-hidden"
            >
                {/* Modal header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                    <p className="font-semibold text-slate-800 text-sm">{title}</p>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="px-5 py-4 space-y-4">
                    {showPoints && (
                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1.5">Points to award</label>
                            <input
                                type="number" min={0} max={500} value={pts}
                                onChange={(e) => setPts(Number(e.target.value))}
                                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-300 outline-none bg-slate-50 transition"
                            />
                        </div>
                    )}
                    <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1.5">Admin note <span className="font-normal text-slate-400">(optional)</span></label>
                        <textarea
                            rows={3} value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="Reason for this decision..."
                            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-300 outline-none resize-none bg-slate-50 transition"
                        />
                    </div>
                </div>

                <div className="px-5 py-4 border-t border-slate-100 flex gap-2">
                    <button
                        onClick={onClose} disabled={busy}
                        className="flex-1 px-4 py-2 text-sm font-medium text-slate-600 rounded-lg border border-slate-200 hover:bg-slate-50 transition disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => act("REJECTED")} disabled={busy}
                        className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-1.5"
                    >
                        {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <XCircle className="w-3.5 h-3.5" />}
                        Reject
                    </button>
                    <button
                        onClick={() => act("APPROVED")} disabled={busy}
                        className="flex-1 px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-1.5"
                    >
                        {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
                        Approve
                    </button>
                </div>
            </motion.div>
        </div>
    );
}

// ─── Section wrapper ──────────────────────────────────────────────────────────
function Section({ children }) {
    return (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            {children}
        </div>
    );
}

// ─── Community Requests ───────────────────────────────────────────────────────
function CommunityRequestsTab() {
    const [requests, setRequests] = useState([]);
    const [filter, setFilter] = useState("PENDING");
    const [loading, setLoading] = useState(true);
    const [reviewing, setReviewing] = useState(null);

    const load = useCallback(async () => {
        setLoading(true);
        try { setRequests(await api.adminGetCommunityRequests(filter)); }
        catch (e) { toast.error(e.message ?? "Failed to load"); }
        setLoading(false);
    }, [filter]);

    useEffect(() => { load(); }, [load]);

    const handleReview = async (status, adminNote) => {
        try {
            const res = await api.adminReviewCommunityRequest(reviewing.id, status, adminNote);
            toast.success(status === "APPROVED" ? `Community approved! Join code: ${res.community?.joinCode ?? "—"}` : "Request rejected");
            setReviewing(null); load();
        } catch (e) { toast.error(e.message ?? "Review failed"); }
    };

    const filters = ["PENDING", "APPROVED", "REJECTED"];

    return (
        <>
            <Section>
                {/* Toolbar */}
                <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
                    <div className="flex gap-1">
                        {filters.map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${filter === f
                                    ? "bg-slate-900 text-white"
                                    : "text-slate-500 hover:bg-slate-100"
                                    }`}
                            >
                                {f.charAt(0) + f.slice(1).toLowerCase()}
                            </button>
                        ))}
                    </div>
                    <button onClick={load} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                        <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                </div>

                {/* Body */}
                {loading ? (
                    <div className="flex justify-center py-16">
                        <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
                    </div>
                ) : requests.length === 0 ? (
                    <div className="text-center py-16 text-slate-400 text-sm">
                        No {filter.toLowerCase()} requests
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        <AnimatePresence>
                            {requests.map((r, i) => (
                                <motion.div
                                    key={r.id}
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                    transition={{ delay: i * 0.03 }}
                                    className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50/60 transition-colors"
                                >
                                    <Avatar url={r.user?.avatarUrl} name={r.user?.fullName} />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="text-sm font-semibold text-slate-800 truncate">{r.communityName}</span>
                                            <StatusPill status={r.status} />
                                        </div>
                                        <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400">
                                            <span>{r.user?.fullName ?? "Unknown"}</span>
                                            <span>·</span>
                                            <span className="flex items-center gap-0.5">
                                                <Star className="w-2.5 h-2.5" />
                                                {r.user?.totalPoints ?? 0} pts
                                            </span>
                                            <span>·</span>
                                            <span>{new Date(r.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}</span>
                                        </div>
                                        {r.description && (
                                            <p className="mt-1 text-xs text-slate-500 truncate max-w-xs">{r.description}</p>
                                        )}
                                        {r.adminNote && (
                                            <p className="mt-1 text-xs text-slate-400 italic">Note: {r.adminNote}</p>
                                        )}
                                    </div>
                                    {r.status === "PENDING" && (
                                        <button
                                            onClick={() => setReviewing(r)}
                                            className="px-3 py-1.5 text-xs font-medium bg-slate-900 text-white rounded-lg hover:bg-slate-700 transition-colors flex-shrink-0"
                                        >
                                            Review
                                        </button>
                                    )}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </Section>

            {reviewing && (
                <Modal
                    title={`Review request — "${reviewing.communityName}"`}
                    onClose={() => setReviewing(null)}
                    onSubmit={handleReview}
                    showPoints={false}
                />
            )}
        </>
    );
}

// ─── Eco-Action Reviews ───────────────────────────────────────────────────────
function EcoActionsTab() {
    const [actions, setActions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [reviewing, setReviewing] = useState(null);
    const [expanded, setExpanded] = useState(null);

    const load = async () => {
        setLoading(true);
        try { setActions(await api.adminGetPendingActions()); }
        catch (e) { toast.error(e.message ?? "Failed to load"); }
        setLoading(false);
    };
    useEffect(() => { load(); }, []);

    const handleReview = async (status, adminNote, pts) => {
        try {
            await api.adminReviewAction(reviewing.id, status, pts, adminNote);
            toast.success(status === "APPROVED" ? `Action approved! +${pts} pts` : "Action rejected");
            setReviewing(null); load();
        } catch (e) { toast.error(e.message ?? "Review failed"); }
    };

    return (
        <>
            <Section>
                <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
                    <p className="text-xs font-medium text-slate-500">
                        {actions.length} pending review{actions.length !== 1 ? "s" : ""}
                    </p>
                    <button onClick={load} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                        <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center py-16">
                        <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
                    </div>
                ) : actions.length === 0 ? (
                    <div className="text-center py-16 text-slate-400 text-sm">
                        <CheckCircle className="w-8 h-8 mx-auto mb-2 opacity-30" />
                        All clear — no pending reviews
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        <AnimatePresence>
                            {actions.map((a, i) => {
                                const isOpen = expanded === a.id;
                                return (
                                    <motion.div
                                        key={a.id}
                                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                        transition={{ delay: i * 0.03 }}
                                        className="px-5 py-3.5 hover:bg-slate-50/60 transition-colors"
                                    >
                                        <div className="flex items-center gap-4">
                                            <Avatar url={a.user?.avatarUrl} name={a.user?.fullName} />
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className="text-sm font-semibold text-slate-800 truncate">{a.title || a.category}</span>
                                                    <StatusPill status={a.status} />
                                                    {a.aiConfidence !== null && a.aiConfidence !== undefined && (
                                                        <span className="text-xs text-slate-400">AI {Math.round(a.aiConfidence * 100)}%</span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400">
                                                    <span>{a.user?.fullName ?? "Unknown"}</span>
                                                    {a.community?.name && <><span>·</span><span>{a.community.name}</span></>}
                                                    <span>·</span>
                                                    <span>{new Date(a.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 flex-shrink-0">
                                                {(a.beforeImage || a.afterImage) && (
                                                    <button
                                                        onClick={() => setExpanded(isOpen ? null : a.id)}
                                                        className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                                                        title="Toggle photos"
                                                    >
                                                        {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ImageIcon className="w-3.5 h-3.5" />}
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => setReviewing(a)}
                                                    className="px-3 py-1.5 text-xs font-medium bg-slate-900 text-white rounded-lg hover:bg-slate-700 transition-colors"
                                                >
                                                    Review
                                                </button>
                                            </div>
                                        </div>

                                        {/* Expandable images */}
                                        <AnimatePresence>
                                            {isOpen && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="mt-3 grid grid-cols-2 gap-3 pl-12">
                                                        {a.beforeImage && (
                                                            <div>
                                                                <p className="text-xs text-slate-400 mb-1 font-medium uppercase tracking-wide">Before</p>
                                                                <img src={a.beforeImage} alt="before" className="w-full h-28 object-cover rounded-xl border border-slate-200" />
                                                            </div>
                                                        )}
                                                        {a.afterImage && (
                                                            <div>
                                                                <p className="text-xs text-slate-400 mb-1 font-medium uppercase tracking-wide">After</p>
                                                                <img src={a.afterImage} alt="after" className="w-full h-28 object-cover rounded-xl border border-slate-200" />
                                                            </div>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                )}
            </Section>

            {reviewing && (
                <Modal
                    title={`Review action — "${reviewing.title || reviewing.category}"`}
                    onClose={() => setReviewing(null)}
                    onSubmit={handleReview}
                    showPoints
                    defaultPoints={25}
                />
            )}
        </>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
const TABS = [
    { id: "community", label: "Community Requests", icon: Users },
    { id: "actions", label: "Eco-Action Reviews", icon: Leaf },
];

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
                <Loader2 className="w-7 h-7 animate-spin text-slate-400" />
            </div>
        );
    }

    if (!profile?.isAdmin) {
        return (
            <div className={`${inter.className} min-h-screen flex items-center justify-center p-8 bg-slate-50`}>
                <div className="text-center max-w-xs">
                    <div className="w-14 h-14 bg-red-50 border border-red-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <AlertTriangle className="w-6 h-6 text-red-500" />
                    </div>
                    <h1 className="text-xl font-semibold text-slate-900 mb-1">Access Denied</h1>
                    <p className="text-sm text-slate-500 mb-3">You need admin privileges to view this page.</p>
                    <p className="text-xs text-slate-400">
                        Set <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono">isAdmin = true</code> on your Profile in Supabase.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className={`${inter.className} min-h-screen bg-slate-50`}>
            {/* Top bar */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-10 text-center">
                <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-center gap-3">
                    <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center">
                        <ShieldCheck className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-semibold text-slate-900 leading-none">Admin Dashboard</h1>
                    </div>
                </div>
            </header>

            <div className="max-w-3xl mx-auto px-6 py-6 space-y-5">
                {/* Tab bar */}
                <div className="flex gap-0.5 bg-slate-100 rounded-xl p-1 w-fit">
                    {TABS.map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            onClick={() => setTab(id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === id
                                ? "bg-white text-slate-900 shadow-sm"
                                : "text-slate-500 hover:text-slate-700"
                                }`}
                        >
                            <Icon className="w-3.5 h-3.5" />
                            {label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={tab}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.15 }}
                    >
                        {tab === "community" && <CommunityRequestsTab />}
                        {tab === "actions" && <EcoActionsTab />}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
