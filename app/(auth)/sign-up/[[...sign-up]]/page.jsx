"use client";

import { SignUp } from "@clerk/nextjs";
import { SignedOut, SignedIn } from "@clerk/nextjs";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

function RedirectToDashboard() {
    const router = useRouter();
    useEffect(() => {
        router.replace('/select-role');
    }, [router]);
    return null;
}

export default function SignUpPage() {
    return (
        <div className="grid">
            <SignedOut>
                <SignUp routing="path" signInUrl="/sign-in" />
            </SignedOut>
            <SignedIn>
                <RedirectToDashboard />
            </SignedIn>
        </div>
    );
}


