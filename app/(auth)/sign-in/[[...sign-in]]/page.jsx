"use client";

import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
	return (
		<div className="min-h-dvh grid place-items-center p-6">
			<SignIn routing="path" signUpUrl="/sign-up" />
		</div>
	);
}


