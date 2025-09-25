"use client";

import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { Users2, School } from "lucide-react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";

const fadeIn = {
	initial: { opacity: 0, y: 16 },
	animate: { opacity: 1, y: 0 },
	transition: { duration: 0.6, ease: "easeOut" },
};

export default function Hero() {
	return (
		<section className="relative">
			<div className="flex justify-center items-center pt-20 px-4">
				<motion.div {...fadeIn} className="w-full max-w-4xl">
					<Card className="border-slate-200/70">
						<CardHeader className="text-center space-y-3">
							<CardTitle className="text-4xl sm:text-5xl font-bold tracking-tight">An AI‑Powered Gamified Learning Platform</CardTitle>
							<CardDescription className="text-lg sm:text-xl text-slate-600">
								Turn classrooms into playful missions. Create classes, indulge in eco‑themed games, and  climb leaderboards while learning.
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="flex flex-col sm:flex-row gap-3 justify-center">
						<SignedIn>
							<Button asChild size="lg" className="bg-sky-600 hover:bg-sky-700 text-white">
								<Link href="/select-role">Get Started</Link>
							</Button>
						</SignedIn>
						<SignedOut>
							<Button asChild size="lg" className="bg-sky-600 hover:bg-sky-700 text-white">
								<Link href="/sign-in">Get Started</Link>
							</Button>
						</SignedOut>
						</div>
						<Separator className="my-6" />
						<div className="flex items-center justify-center gap-6 text-slate-700">
							<div className="flex items-center gap-2 text-sm"><Users2 className="h-4 w-4 text-sky-600" /> Students</div>
							<div className="flex items-center gap-2 text-sm"><School className="h-4 w-4 text-emerald-600" /> Teachers</div>
						</div>
						</CardContent>
					</Card>
				</motion.div>
			</div>
		</section>
	);
}


