"use client";

import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { User, School, ArrowRight, Leaf, Globe, Zap } from "lucide-react";
import Link from "next/link";
import { Badge } from "../ui/badge";

const fadeIn = {
	initial: { opacity: 0, y: 20 },
	animate: { opacity: 1, y: 0 },
	transition: { duration: 0.6, ease: "easeOut" },
};

export default function Hero() {
	return (
		<section className="relative overflow-hidden pt-32 pb-20 lg:pt-20 lg:pb-20">
			{/* Background Elements */}
			<div className="absolute inset-0 -z-10">
				<div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-sky-50 to-white" />
				<div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-200/20 rounded-full blur-3xl" />
				<div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-sky-200/20 rounded-full blur-3xl" />
			</div>

			<div className="container mx-auto px-4 text-center">
				<motion.div {...fadeIn} className="max-w-4xl mx-auto space-y-8 border-2 border-solid rounded-lg">
					<br/>
					<h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900">
						Be the <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-sky-600">Change</span>.<br />
						Earn the <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-emerald-600">Glory</span>.
					</h1>

					<p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
						The world's first platform that transforms your environmental actions into digital rewards and community impact. Track your carbon footprint, compete in challenges, and lead the way to a greener future.
					</p>

					<div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
						<SignedOut>
							<Button asChild size="xl" className="h-14 px-8 text-lg rounded-full bg-gradient-to-r from-emerald-600 to-sky-600 hover:from-emerald-700 hover:to-sky-700 shadow-lg hover:shadow-xl transition-all">
								<Link href="/sign-up">
									Join the Movement <ArrowRight className="ml-2 h-5 w-5" />
								</Link>
							</Button>
							<Button asChild variant="outline" size="xl" className="h-14 px-8 text-lg rounded-full border-slate-200 hover:bg-slate-50">
								<Link href="/sign-in">Login</Link>
							</Button>
						</SignedOut>
						
						<SignedIn>
							<Button asChild size="xl" className="h-14 px-8 text-lg rounded-full bg-gradient-to-r from-emerald-600 to-sky-600 hover:from-emerald-700 hover:to-sky-700 shadow-lg hover:shadow-xl transition-all">
								<Link href="/dashboard">
									Go to Dashboard <ArrowRight className="ml-2 h-5 w-5" />
								</Link>
							</Button>
						</SignedIn>
					</div>

					{/* Role Selection Preview */}
					<div className="pt-12 text-sm font-medium text-slate-500 flex justify-center gap-8">
						<div className="flex items-center gap-2">
							<div className="p-2 bg-emerald-100 rounded-lg">
								<User className="h-5 w-5 text-emerald-600" />
							</div>
							<span>Individual Action</span>
						</div>
						<div className="flex items-center gap-2">
							<div className="p-2 bg-sky-100 rounded-lg">
								<School className="h-5 w-5 text-sky-600" />
							</div>
							<span>Community Leadership</span>
						</div>
					</div>
					<br/>
				</motion.div>

				{/* Impact Stats */}
				<motion.div 
					initial={{ opacity: 0, y: 40 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.3, duration: 0.6 }}
					className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
				>
					<div className="p-6 rounded-2xl bg-white/50 backdrop-blur-sm border border-emerald-100 shadow-sm">
						<Leaf className="h-8 w-8 text-emerald-500 mx-auto mb-3" />
						<div className="text-3xl font-bold text-slate-900">12,450+</div>
						<div className="text-sm text-slate-600">Trees Planted via Rewards</div>
					</div>
					<div className="p-6 rounded-2xl bg-white/50 backdrop-blur-sm border border-sky-100 shadow-sm">
						<Globe className="h-8 w-8 text-sky-500 mx-auto mb-3" />
						<div className="text-3xl font-bold text-slate-900">50K+ kg</div>
						<div className="text-sm text-slate-600">CO2 Emissions Reduced</div>
					</div>
					<div className="p-6 rounded-2xl bg-white/50 backdrop-blur-sm border border-amber-100 shadow-sm">
						<Zap className="h-8 w-8 text-amber-500 mx-auto mb-3" />
						<div className="text-3xl font-bold text-slate-900">8,900+</div>
						<div className="text-sm text-slate-600">Challenges Completed</div>
					</div>
				</motion.div>
			</div>
		</section>
	);
}


