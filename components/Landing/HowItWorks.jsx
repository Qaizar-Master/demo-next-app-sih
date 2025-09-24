"use client";

import { motion } from "framer-motion";
import { Badge } from "../ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Trophy } from "lucide-react";

const fadeIn = {
	initial: { opacity: 0, y: 16 },
	animate: { opacity: 1, y: 0 },
	transition: { duration: 0.6, ease: "easeOut" },
};

export default function HowItWorks() {
	const steps = [
		{ title: "Sign up", desc: "Create an account for your role.", badge: "Step 1" },
		{ title: "Join Classroom", desc: "Students join classes set by teachers.", badge: "Step 2" },
		{ title: "Play & Compete", desc: "Complete eco-missions and climb ranks.", badge: "Step 3" },
	];

	return (
		<section id="how" className="py-16 sm:py-24">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<motion.div {...fadeIn} className="text-center max-w-2xl mx-auto">
					<h2 className="text-3xl font-bold tracking-tight">How it works</h2>
					<p className="mt-3 text-slate-600">Three simple steps to start learning through play.</p>
				</motion.div>
				<div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
					{steps.map((s, i) => (
						<motion.div key={s.title} {...fadeIn} transition={{ delay: i * 0.06, duration: 0.5 }}>
							<Card className="h-full">
								<CardHeader className="space-y-2">
									<div className="flex items-center justify-between">
										<Badge variant="secondary">{s.badge}</Badge>
										<Trophy className="h-4 w-4 text-sky-600" />
									</div>
									<CardTitle>{s.title}</CardTitle>
									<CardDescription>{s.desc}</CardDescription>
								</CardHeader>
							</Card>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}


