"use client";
import React, { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/client-api";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
    Users, Search, Plus, Trophy, Star, LogIn, LogOut,
    Globe, Lock, Loader2, CheckCircle, AlertCircle, X,
    Leaf, Crown, Info,
} from "lucide-react";
import Layout from "@/components/side-bar/page";
import toast from "react-hot-toast";

// ─── Join Community Modal ────────────────────────────────────────────────────
function JoinModal({ community, onClose, onJoined }) {
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);

    const handleJoin = async () => {
        if (!code.trim()) { toast.error("Enter join code"); return; }
        setLoading(true);
        try {
            await api.joinCommunity(community.id, code.trim());
            toast.success(`Joined ${community.name}! 🌱`);
            onJoined();
            onClose();
        } catch (e) {
            toast.error(e.message ?? "Could not join community");
        }
        setLoading(false);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6"
            >
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-900">Join {community.name}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <p className="text-gray-600 mb-4 text-sm">Enter the invite code shared by your community admin.</p>
                <input
                    type="text"
                    placeholder="Enter join code..."
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleJoin()}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl mb-4 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                />
                <div className="flex gap-3">
                    <Button variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
                    <Button className="flex-1 bg-green-600 hover:bg-green-700" onClick={handleJoin} disabled={loading}>
                        {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <LogIn className="w-4 h-4 mr-2" />}
                        Join
                    </Button>
                </div>
            </motion.div>
        </div>
    );
}

// ─── Create Community Request Modal ──────────────────────────────────────────
function CreateModal({ userPoints, onClose, onRequested }) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const MIN_PTS = 500;
    const canCreate = userPoints >= MIN_PTS;

    const handleSubmit = async () => {
        if (!name.trim()) { toast.error("Community name required"); return; }
        setLoading(true);
        try {
            await api.requestCommunity(name.trim(), description.trim());
            toast.success("Request submitted! Awaiting admin approval 🎉");
            onRequested();
            onClose();
        } catch (e) {
            toast.error(e.message ?? "Could not submit request");
        }
        setLoading(false);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6"
            >
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-900">Request New Community</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {!canCreate ? (
                    <div className="text-center py-6">
                        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Star className="w-8 h-8 text-yellow-500" />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">Not enough eco-points</h3>
                        <p className="text-gray-500 text-sm mb-4">
                            You need <strong>{MIN_PTS}</strong> eco-points to create a community.<br />
                            You currently have <strong className="text-green-600">{userPoints}</strong>.
                        </p>
                        <Progress value={(userPoints / MIN_PTS) * 100} className="mb-2 h-2" />
                        <p className="text-xs text-gray-400">{MIN_PTS - userPoints} more points needed</p>
                        <Button className="mt-4" variant="outline" onClick={onClose}>Got it</Button>
                    </div>
                ) : (
                    <>
                        <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-4 flex items-start gap-2 text-sm text-green-800">
                            <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            Your request will be reviewed by an admin. You'll be notified once approved.
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Community Name *</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Green Warriors Mumbai"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    rows={3}
                                    placeholder="What will your community focus on?"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 outline-none resize-none"
                                />
                            </div>
                        </div>
                        <div className="flex gap-3 mt-5">
                            <Button variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
                            <Button className="flex-1 bg-green-600 hover:bg-green-700" onClick={handleSubmit} disabled={loading}>
                                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                                Submit Request
                            </Button>
                        </div>
                    </>
                )}
            </motion.div>
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function CommunityConnectPage() {
    const [profile, setProfile] = useState(null);
    const [communities, setCommunities] = useState([]);
    const [myCommunityIds, setMyCommunityIds] = useState(new Set());
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [joinTarget, setJoinTarget] = useState(null);   // community to join
    const [showCreate, setShowCreate] = useState(false);
    const [leavingId, setLeavingId] = useState(null);

    const load = useCallback(async (query = "") => {
        try {
            const [comm, prof] = await Promise.all([
                api.getCommunities(query),
                api.getProfile(),
            ]);
            setCommunities(comm);
            setProfile(prof);
            const myIds = new Set(
                (prof?.memberships ?? [])
                    .filter((m) => m.active !== false)
                    .map((m) => m.communityId ?? m.community?.id)
            );
            setMyCommunityIds(myIds);
        } catch (e) {
            console.error("Community load error:", e);
        }
    }, []);

    useEffect(() => {
        const init = async () => {
            setIsLoading(true);
            await load();
            setIsLoading(false);
        };
        init();
    }, [load]);

    // Debounced search
    useEffect(() => {
        const t = setTimeout(() => load(searchQuery), 350);
        return () => clearTimeout(t);
    }, [searchQuery, load]);

    const handleLeave = async (communityId) => {
        setLeavingId(communityId);
        try {
            await api.leaveCommunity(communityId);
            toast.success("Left community");
            await load(searchQuery);
        } catch (e) {
            toast.error(e.message ?? "Could not leave");
        }
        setLeavingId(null);
    };

    const userPoints = profile?.totalPoints ?? 0;

    return (
        <Layout>
            <div className="p-4 md:p-8 space-y-8 max-w-5xl mx-auto">

                {/* Header */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                            <Users className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Community Connect</h1>
                            <p className="text-gray-500 text-sm">Join eco-communities and grow together 🌍</p>
                        </div>
                    </div>
                </motion.div>

                {/* Stats + Create */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white">
                        <CardContent className="p-5 flex items-center gap-3">
                            <Globe className="w-8 h-8 opacity-80" />
                            <div>
                                <div className="text-2xl font-bold">{communities.length}</div>
                                <div className="text-green-100 text-sm">Active Communities</div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                        <CardContent className="p-5 flex items-center gap-3">
                            <Users className="w-8 h-8 opacity-80" />
                            <div>
                                <div className="text-2xl font-bold">{myCommunityIds.size}</div>
                                <div className="text-blue-100 text-sm">Communities Joined</div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white">
                        <CardContent className="p-5 flex items-center gap-3">
                            <Star className="w-8 h-8 opacity-80" />
                            <div>
                                <div className="text-2xl font-bold">{userPoints.toLocaleString()}</div>
                                <div className="text-yellow-100 text-sm">Your Eco-Points</div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Search + Create button */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search communities..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none bg-white shadow-sm"
                        />
                    </div>
                    <Button
                        onClick={() => setShowCreate(true)}
                        className="bg-green-600 hover:bg-green-700 text-white rounded-xl px-5 flex items-center gap-2 shadow-md"
                    >
                        <Plus className="w-4 h-4" />
                        Create Community
                    </Button>
                </div>

                {/* Community Grid */}
                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-10 h-10 animate-spin text-green-500" />
                    </div>
                ) : communities.length === 0 ? (
                    <div className="text-center py-20 text-gray-400">
                        <Users className="w-16 h-16 mx-auto mb-4 opacity-30" />
                        <p className="text-lg font-medium">No communities found</p>
                        <p className="text-sm">Try a different search or create the first one!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <AnimatePresence>
                            {communities.map((c, i) => {
                                const isMember = myCommunityIds.has(c.id);
                                const memberCount = c._count?.members ?? 0;
                                return (
                                    <motion.div
                                        key={c.id}
                                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ delay: i * 0.04 }}
                                    >
                                        <Card className={`h-full flex flex-col shadow-sm hover:shadow-lg transition-shadow border-2 ${isMember ? "border-green-300 bg-green-50/40" : "border-transparent"
                                            }`}>
                                            <CardContent className="p-5 flex flex-col h-full gap-3">
                                                {/* Top row */}
                                                <div className="flex items-start justify-between">
                                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center shadow-md flex-shrink-0">
                                                        <Leaf className="w-6 h-6 text-white" />
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        {isMember && (
                                                            <Badge className="bg-green-100 text-green-800 text-xs">
                                                                <CheckCircle className="w-3 h-3 mr-1" />Member
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Name + description */}
                                                <div className="flex-1">
                                                    <h3 className="font-bold text-gray-900 text-lg leading-tight mb-1">{c.name}</h3>
                                                    {c.description && (
                                                        <p className="text-gray-500 text-sm line-clamp-2">{c.description}</p>
                                                    )}
                                                </div>

                                                {/* Meta */}
                                                <div className="flex items-center justify-between text-sm text-gray-500">
                                                    <span className="flex items-center gap-1">
                                                        <Users className="w-4 h-4" /> {memberCount} member{memberCount !== 1 ? "s" : ""}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Trophy className="w-4 h-4 text-yellow-500" />
                                                        {(c.totalPoints ?? 0).toLocaleString()} pts
                                                    </span>
                                                </div>

                                                {/* Creator */}
                                                {c.creator && (
                                                    <div className="flex items-center gap-2 text-xs text-gray-400">
                                                        <Crown className="w-3 h-3 text-yellow-400" />
                                                        <span>Created by {c.creator.fullName ?? "Admin"}</span>
                                                    </div>
                                                )}

                                                {/* Action buttons */}
                                                <div className="flex gap-2 pt-1">
                                                    {isMember ? (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="flex-1 text-red-500 border-red-200 hover:bg-red-50"
                                                            onClick={() => handleLeave(c.id)}
                                                            disabled={leavingId === c.id}
                                                        >
                                                            {leavingId === c.id
                                                                ? <Loader2 className="w-4 h-4 animate-spin" />
                                                                : <><LogOut className="w-4 h-4 mr-1" />Leave</>}
                                                        </Button>
                                                    ) : (
                                                        <Button
                                                            size="sm"
                                                            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                                                            onClick={() => setJoinTarget(c)}
                                                        >
                                                            <LogIn className="w-4 h-4 mr-1" />Join
                                                        </Button>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            {/* Modals */}
            {joinTarget && (
                <JoinModal
                    community={joinTarget}
                    onClose={() => setJoinTarget(null)}
                    onJoined={() => load(searchQuery)}
                />
            )}
            {showCreate && (
                <CreateModal
                    userPoints={userPoints}
                    onClose={() => setShowCreate(false)}
                    onRequested={() => load(searchQuery)}
                />
            )}
        </Layout>
    );
}
