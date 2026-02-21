"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
	Leaf,
	ChevronRight,
	ArrowUpRight,
	Trophy,
	Users,
	Gamepad2,
	Target,
	Shield,
	Zap,
	Globe,
	TreePine,
	Star,
	BarChart3,
	Camera,
	CheckCircle2,
} from "lucide-react";
import { SignInButton, SignUpButton, useUser } from "@clerk/nextjs";

// ─── Reusable card ──────────────────────────────────────────────────────────
function FeatureCard({ icon, title, desc, delay = 0, accent = "emerald" }) {
	const styles = {
		emerald: {
			bg: "bg-emerald-50 text-emerald-600",
			hover: "hover:border-emerald-300 hover:bg-emerald-50/50",
			textHover: "group-hover:text-emerald-700",
		},
		blue: {
			bg: "bg-blue-50 text-blue-600",
			hover: "hover:border-blue-300 hover:bg-blue-50/50",
			textHover: "group-hover:text-blue-700",
		},
		purple: {
			bg: "bg-purple-50 text-purple-600",
			hover: "hover:border-purple-300 hover:bg-purple-50/50",
			textHover: "group-hover:text-purple-700",
		},
		amber: {
			bg: "bg-amber-50 text-amber-600",
			hover: "hover:border-amber-300 hover:bg-amber-50/50",
			textHover: "group-hover:text-amber-700",
		},
	};

	const currentStyle = styles[accent];

	return (
		<motion.div
			initial={{ opacity: 0, y: 24 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true }}
			transition={{ delay, duration: 0.55 }}
			whileHover={{ scale: 1.02 }}
			className={`p-8 border border-gray-200 bg-white ${currentStyle.hover} transition-all group relative overflow-hidden rounded-3xl cursor-default shadow-sm hover:shadow-md`}
		>
			<div className={`w-12 h-12 mb-6 p-3 rounded-2xl ${currentStyle.bg} group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
				{icon}
			</div>
			<h4 className={`text-lg font-black italic uppercase tracking-tight mb-3 text-gray-800 transition-colors ${currentStyle.textHover}`}>
				{title}
			</h4>
			<p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-600 transition-colors">{desc}</p>
			<div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
				<ArrowUpRight className={`w-4 h-4 ${currentStyle.bg.split(' ')[1]}`} />
			</div>
		</motion.div>
	);
}

// ─── Stat pill ───────────────────────────────────────────────────────────────
function StatPill({ value, label, color = "emerald" }) {
	const c = {
		emerald: "text-emerald-600",
		blue: "text-blue-600",
		amber: "text-amber-600"
	};

	return (
		<div className="text-center">
			<div className={`text-5xl md:text-6xl font-black italic tracking-tighter ${c[color]}`}>{value}</div>
			<div className="text-xs font-black uppercase tracking-widest text-gray-400 mt-1">{label}</div>
		</div>
	);
}

// ─── Step card ───────────────────────────────────────────────────────────────
function StepCard({ num, title, desc, delay = 0 }) {
	return (
		<motion.div
			initial={{ opacity: 0, x: -20 }}
			whileInView={{ opacity: 1, x: 0 }}
			viewport={{ once: true }}
			transition={{ delay, duration: 0.5 }}
			className="flex gap-6 group"
		>
			<div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 font-black text-lg group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600 transition-all duration-300">
				{num}
			</div>
			<div>
				<h4 className="font-black italic uppercase tracking-tight text-gray-800 mb-1 group-hover:text-emerald-600 transition-colors">{title}</h4>
				<p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
			</div>
		</motion.div>
	);
}

// ─── Main component ──────────────────────────────────────────────────────────
export default function LandingPage() {
	// isLoaded prevents hydration mismatch without causing a full blank screen
	const { user, isLoaded } = useUser();

	return (
		<div className="bg-white text-gray-900 min-h-screen selection:bg-emerald-100 overflow-x-hidden font-sans">
			{/* ── Background tint orbs ─────────────────────────────────────────── */}
			<div className="fixed inset-0 z-0 pointer-events-none">
				<div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] bg-emerald-100/60 rounded-full blur-[140px]" />
				<div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-sky-100/50 rounded-full blur-[120px]" />
				<div className="absolute top-[50%] left-[40%] w-[30%] h-[30%] bg-purple-50/40 rounded-full blur-[100px]" />
			</div>

			{/* ── NAVIGATION ───────────────────────────────────────────────────── */}
			<nav className="fixed top-0 w-full z-50 border-b border-gray-100 bg-white/80 backdrop-blur-xl px-6 py-4 flex justify-between items-center shadow-sm">
				<div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
					<div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center shadow-md shadow-emerald-200">
						<Leaf className="w-4 h-4 text-white" />
					</div>
					<span className="text-xl font-black italic tracking-tighter text-gray-900">
						ECO<span className="text-emerald-600">CHAMPS</span>
					</span>
				</div>

				<div className="hidden md:flex gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
					{["Features", "How It Works"].map((item) => (
						<a key={item} href={`#${item.toLowerCase().replace(/ /g, "-")}`}
							className="hover:text-emerald-600 transition-colors relative group">
							{item}
							<span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-emerald-500 transition-all group-hover:w-full" />
						</a>
					))}
				</div>

				<div className="flex items-center gap-3">
					{!isLoaded ? (
						<div className="h-9 w-24 bg-gray-100 animate-pulse rounded-full" />
					) : user ? (
						<Link href="/dashboard">
							<button className="px-6 py-2 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-emerald-500 hover:scale-105 transition-all shadow-md shadow-emerald-200">
								Dashboard →
							</button>
						</Link>
					) : (
						<>
							<SignInButton mode="modal">
								<button className="px-5 py-2 bg-gray-100 border border-gray-200 text-gray-600 text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-gray-200 transition-all">
									Log In
								</button>
							</SignInButton>
							<SignUpButton mode="modal">
								<button className="px-6 py-2 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-emerald-500 hover:scale-105 transition-all shadow-md shadow-emerald-200">
									Join Free
								</button>
							</SignUpButton>
						</>
					)}
				</div>
			</nav>

			<main>
				{/* ── HERO ─────────────────────────────────────────────────────────── */}
				<section className="relative pt-48 pb-32 px-6 z-10">
					<div className="max-w-5xl mx-auto text-center">
						<motion.div
							initial={{ opacity: 0, y: 24 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8, ease: "easeOut" }}
						>
							<h1 className="text-4xl md:text-[88px] font-black italic tracking-tighter leading-[0.9] uppercase mb-8">
								<span className="text-gray-900">Save the{" "}</span>
								<span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-blue-500">
									Planet.
								</span>
								<br />
								<span className="text-gray-900">Earn the{" "}</span>
								<span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-blue-500">
									Glory.
								</span>
							</h1>

							<p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-500 leading-relaxed font-medium mb-12">
								Turn real-world eco-actions into{" "}
								<span className="text-gray-900 font-semibold">points, badges, and leaderboard dominance.</span>{" "}
								The platform where{" "}
								<span className="text-emerald-600 font-semibold">environmental impact</span> is your score.
							</p>

							<div className="flex flex-col sm:flex-row justify-center gap-4 mb-24">
								{isLoaded && user ? (
									<Link href="/dashboard">
										<button className="group relative px-10 py-4 bg-emerald-600 overflow-hidden rounded-full hover:scale-105 transition-all shadow-xl shadow-emerald-200">
											<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
											<span className="relative flex items-center gap-3 font-black uppercase tracking-widest text-xs text-white">
												<BarChart3 className="w-4 h-4" />
												Go to Dashboard
												<ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
											</span>
										</button>
									</Link>
								) : (
									<SignUpButton mode="modal">
										<button className="group relative px-8 py-4 bg-emerald-600 overflow-hidden rounded-full hover:scale-105 transition-all shadow-xl shadow-emerald-200 w-full sm:w-auto">
											<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
											<span className="relative flex items-center justify-center gap-3 font-black uppercase tracking-widest text-xs text-white">
												Join Free
												<ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
											</span>
										</button>
									</SignUpButton>
								)}
							</div>
						</motion.div>

						{/* Hero stats bar */}
						<motion.div
							initial={{ opacity: 0, y: 32 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.5, duration: 0.8 }}
							className="relative rounded-3xl border border-gray-200 bg-white p-10 grid grid-cols-2 md:grid-cols-4 gap-8 shadow-xl shadow-gray-100"
						>
							<StatPill value="50K+" label="Eco Warriors" color="emerald" />
							<StatPill value="2M+" label="Actions Logged" color="blue" />
							<StatPill value="120+" label="Challenges" color="emerald" />
							<StatPill value="98%" label="Impact Verified" color="amber" />
						</motion.div>
					</div>
				</section>

				{/* ── THE MISSION SECTION ──────────────────────────────────────────── */}
				<section className="py-32 px-6 border-t border-gray-100 bg-gray-50/70" id="features">
					<div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
						<motion.div
							initial={{ opacity: 0, x: -50 }}
							whileInView={{ opacity: 1, x: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.8 }}
						>
							<div className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600 mb-6 flex items-center gap-2">
								<Globe className="w-4 h-4" /> The Problem
							</div>
							<h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter mb-8 leading-[0.9] text-gray-900">
								Good Intentions <span className="text-gray-300">Without</span> Action
							</h2>
							<p className="text-gray-500 text-xl leading-relaxed mb-8 border-l-2 border-gray-200 pl-6">
								Most people want to help the environment but lack the{" "}
								<span className="text-gray-900 font-semibold">motivation, structure, and community</span> to make
								it consistent. EcoChamps changes that — by making sustainability a game you actually want to play.
							</p>
							<div className="space-y-3">
								{["Real actions verified by AI", "Points for every eco-win", "Compete on global leaderboards"].map((item) => (
									<div key={item} className="flex items-center gap-3 text-gray-600 text-sm">
										<CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
										{item}
									</div>
								))}
							</div>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, x: 50 }}
							whileInView={{ opacity: 1, x: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.8 }}
							className="relative group"
						>
							<div className="absolute -inset-1 bg-gradient-to-r from-emerald-300 to-blue-300 rounded-[3rem] blur-xl opacity-30 group-hover:opacity-50 transition duration-1000" />
							<div className="relative bg-white border border-gray-200 p-12 rounded-[3rem] shadow-xl">
								<div className="flex items-center gap-4 mb-6">
									<div className="p-3 bg-emerald-50 rounded-xl">
										<Zap className="w-8 h-8 text-emerald-600" />
									</div>
									<div className="text-xs font-black uppercase tracking-widest text-emerald-600">
										AI-Powered Verification
									</div>
								</div>
								<h3 className="text-4xl font-black italic uppercase tracking-tighter mb-6 leading-none text-gray-900">
									Your Action. <br />Instantly Rewarded.
								</h3>
								<p className="text-gray-500 text-lg leading-relaxed">
									Submit a before/after photo of your eco-action. Our AI analyzes it in seconds:
									<span className="block my-4 text-3xl md:text-4xl font-black italic text-emerald-600 border-l-4 border-emerald-500 pl-4 py-2 bg-emerald-50 rounded-r-xl">
										&gt; 80% = Points Awarded
									</span>
									No waiting. No gatekeeping. Real impact, real rewards.
								</p>
							</div>
						</motion.div>
					</div>
				</section>

				{/* ── FEATURES GRID ──────────────────────────────────────────────────── */}
				<section className="py-32 px-6 bg-white">
					<div className="max-w-7xl mx-auto">
						<div className="flex items-end justify-between mb-16">
							<h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-gray-900">
								The Full <span className="text-emerald-600">Arsenal</span>
							</h2>
							<div className="hidden md:block w-32 h-[2px] bg-gray-200 mb-4" />
						</div>
						<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
							<FeatureCard icon={<Camera className="w-full h-full" />} title="Eco Action Logger" desc="Document your real-world actions with photos. AI verifies and awards points instantly." delay={0} accent="emerald" />
							<FeatureCard icon={<Trophy className="w-full h-full" />} title="Global Leaderboard" desc="Compete with eco-warriors worldwide. Climb rankings, claim titles, earn eternal glory." delay={0.1} accent="amber" />
							<FeatureCard icon={<Target className="w-full h-full" />} title="Daily Challenges" desc="Fresh missions every day. Complete them to earn bonus points and rare badges." delay={0.2} accent="blue" />
							<FeatureCard icon={<Gamepad2 className="w-full h-full" />} title="Eco Mini-Games" desc="Play waste sorting, energy quizzes, and more. Learn while competing." delay={0.3} accent="purple" />
							<FeatureCard icon={<Users className="w-full h-full" />} title="Community Connect" desc="Create or join communities. Pool impact, share progress, build collective momentum." delay={0.4} accent="emerald" />
							<FeatureCard icon={<TreePine className="w-full h-full" />} title="EcoTree Tracker" desc="Watch a virtual forest grow with every action you log. Your personal impact garden." delay={0.5} accent="blue" />
						</div>
					</div>
				</section>

				{/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
				<section className="py-32 px-6 bg-gray-50/70 border-t border-gray-100" id="how-it-works">
					<div className="max-w-7xl mx-auto">
						<div className="grid lg:grid-cols-2 gap-20 items-center">
							<div>
								<div className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600 mb-6 flex items-center gap-2">
									<Shield className="w-4 h-4" /> The System
								</div>
								<h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter mb-12 leading-[0.9] text-gray-900">
									Four Steps to <span className="text-emerald-600">EcoChamp</span> Status
								</h2>
								<div className="space-y-8">
									<StepCard num="01" title="Sign Up & Set Your Mission" desc="Create your profile and choose your eco-focus: waste, energy, carbon, water, or biodiversity." delay={0} />
									<StepCard num="02" title="Take Real Action" desc="Do something good for the planet. Document it with before and after photos." delay={0.1} />
									<StepCard num="03" title="AI Verifies & Awards Points" desc="Our AI validates your action, calculates impact, and credits your account instantly." delay={0.2} />
									<StepCard num="04" title="Rise Up the Leaderboard" desc="Compete, complete challenges, earn badges, and claim your place as a certified EcoChamp." delay={0.3} />
								</div>
							</div>

							{/* Impact panel */}
							<motion.div
								initial={{ opacity: 0, scale: 0.95 }}
								whileInView={{ opacity: 1, scale: 1 }}
								viewport={{ once: true }}
								transition={{ duration: 0.8 }}
								className="relative"
							>
								<div className="absolute -inset-1 bg-gradient-to-br from-emerald-200/60 to-blue-200/40 rounded-[3rem] blur-xl" />
								<div className="relative bg-white border border-gray-200 rounded-[3rem] overflow-hidden shadow-xl">
									<div className="p-8 border-b border-gray-100">
										<div className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">Live Impact Dashboard</div>
										<div className="space-y-4">
											{[
												{ label: "Waste Diverted", value: "1.2M kg", pct: 82, color: "bg-emerald-500" },
												{ label: "CO₂ Saved", value: "340 tons", pct: 65, color: "bg-blue-500" },
												{ label: "Trees Planted", value: "18,420", pct: 74, color: "bg-green-500" },
											].map((stat) => (
												<div key={stat.label}>
													<div className="flex justify-between items-center mb-1.5">
														<span className="text-xs font-black uppercase tracking-widest text-gray-400">{stat.label}</span>
														<span className="text-sm font-black text-gray-800">{stat.value}</span>
													</div>
													<div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
														<motion.div className={`h-full ${stat.color} rounded-full`}
															initial={{ width: 0 }}
															whileInView={{ width: `${stat.pct}%` }}
															viewport={{ once: true }}
															transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
														/>
													</div>
												</div>
											))}
										</div>
									</div>
									<div className="p-8 grid grid-cols-2 gap-4">
										{[
											{ icon: <Star className="w-5 h-5" />, value: "Level 10", label: "Max: EcoChamp Legend", color: "text-amber-500", bg: "bg-amber-50 border-amber-100" },
											{ icon: <Trophy className="w-5 h-5" />, value: "#1 Rank", label: "Global Leaderboard", color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100" },
											{ icon: <Shield className="w-5 h-5" />, value: "10 Badges", label: "Collected & Counting", color: "text-blue-600", bg: "bg-blue-50 border-blue-100" },
											{ icon: <Zap className="w-5 h-5" />, value: "30 Days", label: "Active Streak", color: "text-purple-600", bg: "bg-purple-50 border-purple-100" },
										].map((item) => (
											<div key={item.label} className={`p-4 ${item.bg} rounded-2xl border transition-all hover:shadow-sm group`}>
												<div className={`${item.color} mb-2 group-hover:scale-110 transition-transform`}>{item.icon}</div>
												<div className={`font-black italic text-lg ${item.color}`}>{item.value}</div>
												<div className="text-[10px] text-gray-400 uppercase tracking-widest mt-0.5">{item.label}</div>
											</div>
										))}
									</div>
								</div>
							</motion.div>
						</div>
					</div>
				</section>

				{/* ── CTA ──────────────────────────────────────────────────────────── */}
				<section className="py-32 px-6 bg-gradient-to-b from-white to-emerald-50/40 border-t border-gray-100">
					<div className="max-w-4xl mx-auto text-center">
						<motion.div
							initial={{ opacity: 0, y: 24 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.8 }}
						>
							<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200 mb-8">
								<Leaf className="w-3 h-3 text-emerald-600" />
								<span className="text-[10px] font-black uppercase tracking-widest text-emerald-700">Join the Movement</span>
							</div>
							<h2 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-[0.9] mb-8 text-gray-900">
								The Planet<br />
								<span className="text-emerald-600">Needs You.</span>
							</h2>
							<p className="text-gray-500 text-lg max-w-xl mx-auto mb-10">
								50,000 eco-warriors have already started. Your actions logged, verified, and rewarded could change everything.
							</p>

							{/* ADDED CTA BUTTONS HERE */}
							<div className="flex justify-center">
								{isLoaded && user ? (
									<Link href="/dashboard">
										<button className="px-10 py-4 bg-emerald-600 text-white text-xs font-black uppercase tracking-widest rounded-full hover:bg-emerald-500 hover:scale-105 transition-all shadow-xl shadow-emerald-200">
											Go to Dashboard →
										</button>
									</Link>
								) : (
									<SignUpButton mode="modal">
										<button className="px-10 py-4 bg-emerald-600 text-white text-xs font-black uppercase tracking-widest rounded-full hover:bg-emerald-500 hover:scale-105 transition-all shadow-xl shadow-emerald-200">
											Start Your Journey
										</button>
									</SignUpButton>
								)}
							</div>
						</motion.div>
					</div>
				</section>
			</main>

			{/* ── FOOTER ───────────────────────────────────────────────────────── */}
			<footer className="py-20 px-6 border-t border-gray-200 bg-gray-50">
				<div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-end">
					<div>
						<div className="flex items-center gap-2 mb-8">
							<div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center shadow-sm">
								<Leaf className="w-4 h-4 text-white" />
							</div>
							<span className="text-xl font-black italic tracking-tighter text-gray-900">ECO<span className="text-emerald-600">CHAMPS</span></span>
						</div>
						<div className="flex flex-wrap gap-6 mb-8 text-[10px] font-black uppercase tracking-widest text-gray-400">
							{["Features", "How it Works"].map(link => (
								<a key={link} href={`#${link.toLowerCase().replace(/ /g, "-")}`} className="hover:text-emerald-600 transition-colors">
									{link}
								</a>
							))}
						</div>
						<div className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-300">
							© {new Date().getFullYear()} EcoChamps. All Rights Reserved.
						</div>
					</div>
					<div className="text-right">
						<blockquote className="text-2xl md:text-3xl font-bold italic mb-6 leading-tight text-gray-600">
							&quot;The greatest threat to our planet is the belief that someone else will save it.&quot;
						</blockquote>
						<p className="text-xs font-black uppercase tracking-widest text-emerald-600">
							— Robert Swan, OBE
						</p>
					</div>
				</div>
			</footer>
		</div>
	);
}