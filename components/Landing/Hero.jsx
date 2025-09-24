"use client";

import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { SignUpButton } from "@clerk/nextjs";
import { Users2, School } from "lucide-react";

const fadeIn = {
	initial: { opacity: 0, y: 16 },
	animate: { opacity: 1, y: 0 },
	transition: { duration: 0.6, ease: "easeOut" },
};

export default function Hero() {
	return (
		<section className="relative">
			<div className=" flex justify-center items-center pt-20">
				<motion.div {...fadeIn} >
					<h1 className="text-4xl sm:text-5xl font-bold ">An AI-Powered Gamified learning Platform</h1>
					<p className=" flex justify-center items-center text-2xl text-slate-600 ">
					
						EcoChamps turns classrooms into playful missions. <br/>
						Teachers create classes and assign eco-themed games. <br/>
						Students compete on leaderboards and gain Eco-points while learning.
					</p>
					<div className="flex flex-col sm:flex-row gap-3">
						
						<SignUpButton mode="modal">
							<Button size="lg" className="bg-sky-600 hover:bg-sky-700 text-white">Get Started</Button>
						</SignUpButton>
					</div>
					<div className="flex items-center gap-6 pt-2">
						<div className="flex items-center gap-2 text-sm text-slate-700"><Users2 className="h-4 w-4 text-sky-600" /> Students</div>
						<div className="flex items-center gap-2 text-sm text-slate-700"><School className="h-4 w-4 text-emerald-600" /> Teachers</div>
					</div>
				</motion.div>
			</div>
		</section>
	);
}


