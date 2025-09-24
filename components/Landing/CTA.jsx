"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { SignInButton, SignUpButton } from "@clerk/nextjs";

export default function CTA() {
	return (
		<section className="py-16 sm:py-20">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<Card className="bg-gradient-to-r from-emerald-600 to-sky-600 text-white">
					<CardHeader className="text-center space-y-3">
						<CardTitle className="text-2xl">Ready to level up your classroom?</CardTitle>
						<CardDescription className="text-emerald-50">
							Get started in minutes. Invite students, assign eco-games, track progress.
						</CardDescription>
					</CardHeader>
						<CardContent className="flex flex-col sm:flex-row items-center justify-center gap-3">
							<SignUpButton mode="modal">
								<Button size="lg" variant="secondary" className="text-slate-900">Sign Up</Button>
							</SignUpButton>
							<SignInButton mode="modal">
								<Button size="lg" variant="outline" className="bg-transparent text-white border-white">Login</Button>
							</SignInButton>
						</CardContent>
				</Card>
			</div>
		</section>
	);
}