"use client";

import { motion } from "framer-motion";
import { Badge } from "../ui/badge";
import { Footprints, LogIn, Medal } from "lucide-react";

export default function HowItWorks() {
	const steps = [
		{
			title: "Sign Up & Choose Role",
			desc: "Start as an Individual to track personal habits, or apply to be a Community Leader to drive collective change.",
			icon: LogIn
		},
		{
			title: "Take Action",
			desc: "Complete daily eco-challenges, log waste sorting, and reduce energy consumption. Verify actions with photos.",
			icon: Footprints
		},
		{
			title: "Climb the Ranks",
			desc: "Earn points for every action. Compete on global leaderboards and showcase your Eco-Champion badges.",
			icon: Medal
		}
	];

	return (
		<section className="py-24 bg-slate-50 relative overflow-hidden">
			<div className="container mx-auto px-4">
				<div className="text-center max-w-2xl mx-auto mb-20">
					<Badge className="mb-4 bg-sky-100 text-sky-700 hover:bg-sky-200">How It Works</Badge>
					<h2 className="text-3xl md:text-4xl font-bold text-slate-900">Your Journey to Impact</h2>
				</div>

				<div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 relative">
					{/* Connecting Line (Desktop) */}
					<div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-slate-200 -z-10" />

					{steps.map((s, i) => (
						<motion.div
							key={s.title}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: i * 0.2, duration: 0.5 }}
							className="text-center relative"
						>
							<div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg mx-auto mb-6 border-4 border-white relative z-10">
								<div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-sky-500 rounded-full flex items-center justify-center text-white">
									<s.icon className="h-10 w-10" />
								</div>
								<div className="absolute -top-2 -right-2 w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center text-white font-bold text-sm border-2 border-white">
									{i + 1}
								</div>
							</div>

							<h3 className="text-xl font-bold text-slate-900 mb-3">{s.title}</h3>
							<p className="text-slate-600 leading-relaxed px-4">
								{s.desc}
							</p>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}


