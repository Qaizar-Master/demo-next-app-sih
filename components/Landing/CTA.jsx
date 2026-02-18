"use client";

import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { SignInButton, SignUpButton, SignedOut, SignedIn } from "@clerk/nextjs";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CTA() {
	return (
		<section className="py-20 px-4">
			<div className="max-w-5xl mx-auto">
				<Card className="bg-gradient-to-r from-slate-900 to-slate-800 text-white border-none overflow-hidden relative">
					{/* Decorative circles */}
					<div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl" />
					<div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-64 h-64 bg-sky-500/20 rounded-full blur-3xl" />

					<CardContent className="p-12 text-center relative z-10">
						<h2 className="text-3xl md:text-5xl font-bold mb-6">
							Ready to Make a Difference?
						</h2>
						<p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
							Join thousands of EcoChamps who are turning their everyday actions into global impact.
							Start today—for free.
						</p>

						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<SignedOut>
								<SignUpButton mode="modal" afterSignUpUrl="/select-role">
									<Button size="xl" className="h-14 px-8 text-lg bg-white text-slate-900 hover:bg-slate-100 border-none">
										Start Your Journey
									</Button>
								</SignUpButton>
								<SignInButton mode="modal" afterSignInUrl="/select-role">
									<Button size="xl" variant="outline" className="h-14 px-8 text-lg border-slate-600 text-white hover:bg-slate-800 hover:text-white bg-transparent">
										Log In
									</Button>
								</SignInButton>
							</SignedOut>

							<SignedIn>
								<Button asChild size="xl" className="h-14 px-8 text-lg bg-emerald-500 hover:bg-emerald-600 text-white border-none">
									<Link href="/dashboard">
										Continue to Dashboard <ArrowRight className="ml-2 h-5 w-5" />
									</Link>
								</Button>
							</SignedIn>
						</div>
					</CardContent>
				</Card>
			</div>
		</section>
	);
}