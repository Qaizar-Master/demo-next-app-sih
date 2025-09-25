"use client";

import { SignIn } from "@clerk/nextjs";
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

export default function SignInPage() {
    return (    
        <div className="grid ">
            <SignedOut>
                <SignIn routing="path" signUpUrl="/sign-up" />
            </SignedOut>
            <SignedIn>
                <RedirectToDashboard />
            </SignedIn>
        </div>
    );
}