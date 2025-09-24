"use client";

import Header from "./Header";
import Hero from "./Hero";
import Features from "./Features";
import HowItWorks from "./HowItWorks";
import CTA from "./CTA";
import Footer from "./Footer";
import { Separator } from "../ui/separator";
 

export default function LandingPage() {
	return (
		<div className="min-h-dvh bg-gradient-to-b from-white to-sky-50 text-slate-900">
			<Header />

			<main>
                <Hero />
				<Features />
				<Separator className="my-8" />
				<HowItWorks />
				<CTA />
			</main>

			<Footer />
		</div>
	);
}