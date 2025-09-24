"use client";

import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
	return (
		<div className="min-h-dvh grid place-items-center p-6">
			<SignUp routing="path" signInUrl="/sign-in" />
		</div>
	);
}


