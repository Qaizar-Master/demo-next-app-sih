"use client";

import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "../ui/navigation-menu";
import { Button } from "../ui/button";
import { Leaf, Sparkles, LogIn } from "lucide-react";
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function Header() {
	return (
		<header className="sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-white/70 border-b border-slate-200/60">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="flex h-16 items-center justify-between">
					<Link href="/" className="flex items-center gap-2">
						<Leaf className="h-6 w-6 text-emerald-600" />
						<span className="font-semibold text-2xl">EcoChamps</span>
					</Link>
					<div className="flex items-center gap-2">
						<SignedOut>
						<SignInButton mode="modal" afterSignInUrl="/select-role">
								<Button variant="ghost" size="sm">
									<LogIn className="mr-2 h-4 w-4" /> Login
								</Button>
							</SignInButton>
						<SignUpButton mode="modal" afterSignUpUrl="/select-role">
								<Button size="sm">
									<Sparkles className="mr-2 h-4 w-4" /> Get Started
								</Button>
							</SignUpButton>
						</SignedOut>
						<SignedIn>
							<UserButton redirectUrl="/" appearance={{ elements: { userButtonAvatarBox: "h-8 w-8" } }} />
						</SignedIn>
					</div>
				</div>
			</div>
		</header>
	);
}
