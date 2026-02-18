"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { CheckCircle2, Trophy, Users2 } from "lucide-react";

const fadeIn = {
	initial: { opacity: 0, y: 20 },
	whileInView: { opacity: 1, y: 0 },
	viewport: { once: true },
	transition: { duration: 0.5, ease: "easeOut" },
};

export default function Features() {
	const features = [
		{
			icon: CheckCircle2,
			title: "Track Real Actions",
			desc: "From recycling to energy saving, log your daily eco-actions. Our AI verifies your impact to ensure every effort counts.",
			color: "text-emerald-500",
			bg: "bg-emerald-50"
		},
		{
			icon: Trophy,
			title: "Earn Digital Rewards",
			desc: "Transform your eco-points into badges, leaderboard rankings, and (coming soon) real-world discounts with partner brands.",
			color: "text-amber-500",
			bg: "bg-amber-50"
		},
		{
			icon: Users2,
			title: "Community Power",
			desc: "Create or join communities. Pool your points to unlock massive community goals like planting a local forest.",
			color: "text-sky-500",
			bg: "bg-sky-50"
		}
	];

	return (
		<section className="py-24 bg-white">
			<div className="container mx-auto px-4">
				<motion.div {...fadeIn} className="text-center max-w-2xl mx-auto mb-16">
					<h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Why EcoChamps?</h2>
					<p className="text-lg text-slate-600">
						We bridge the gap between good intentions and measurable impact through gamification and community.
					</p>
				</motion.div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					{features.map((f, i) => (
						<motion.div
							key={f.title}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: i * 0.1, duration: 0.5 }}
						>
							<Card className="h-full border-none shadow-lg hover:shadow-xl transition-shadow bg-white">
								<CardHeader>
									<div className={`w-12 h-12 rounded-lg ${f.bg} flex items-center justify-center mb-4`}>
										<f.icon className={`h-6 w-6 ${f.color}`} />
									</div>
									<CardTitle className="text-xl font-bold text-slate-900">{f.title}</CardTitle>
								</CardHeader>
								<CardContent>
									<CardDescription className="text-base text-slate-600 leading-relaxed">
										{f.desc}
									</CardDescription>
								</CardContent>
							</Card>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}


