"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Users2, Gamepad2, Trophy } from "lucide-react";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";

const fadeIn = {
	initial: { opacity: 0, y: 16 },
	animate: { opacity: 1, y: 0 },
	transition: { duration: 0.6, ease: "easeOut" },
};

export default function Features() {
	const items = [
		{ icon: Users2, title: "Classroom Connect", desc: "Join classrooms with a simple code, collaborate with peers, and take learning beyond textbooks.", color: "text-sky-600" },
		{ icon: Gamepad2, title: "Eco-Friendly Games", desc: "Play exciting challenges designed to teach, inspire, and promote sustainability because every game can make a difference.", color: "text-emerald-600" },
		{ icon: Trophy, title: "Leaderboards & Badges", desc: "Climb the leaderboard, unlock badges, and celebrate your progress as learning turns into achievement.", color: "text-sky-700" },
	];

	return (
		<section id="features" className="py-16 sm:py-24">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<motion.div {...fadeIn} className="text-center max-w-2xl mx-auto">
					<div className="flex justify-center">
					</div>
					<h2 className="mt-2 text-3xl font-bold tracking-tight">Learning reimagined. Teaching redefined.</h2>
					<p className="mt-3 text-slate-600">Built for schools and colleges. Designed for fun and outcomes.</p>
					<Separator className="mt-6" />
				</motion.div>
				<div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
					{items.map((f, i) => (
						<motion.div key={f.title} {...fadeIn} transition={{ delay: i * 0.05, duration: 0.5 }}>
							<Card className="h-full hover:shadow-md transition-shadow border-slate-200/70">
								<CardHeader>
									<CardTitle className="flex items-center gap-2 text-lg">
										<f.icon className={`h-5 w-5 ${f.color}`} />
										{f.title}
									</CardTitle>
									<CardDescription>{f.desc}</CardDescription>
								</CardHeader>
							</Card>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}


