"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Users2, School } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { redirectToRole } from "@/lib/redirectToRole";

export default function SelectRolePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  function setRole(role) {
    setLoading(true);
    // Use the shared redirect helper which adds the skip flag and uses router
    redirectToRole(role, router, { skipFlag: true });
  }

  return (
    <div className="grid">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="mt-4 text-3xl font-bold">How will you use EcoChamps?</h1>
          <p className="mt-2 text-slate-600">Choose a role to personalize your experience and access the right tools.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-sky-50 p-2">
                    <Users2 className="h-6 w-6 text-sky-600" />
                  </div>
                  <CardTitle className="text-lg">Student</CardTitle>
                </div>
                <Badge className="bg-sky-100 text-sky-800">For learners</Badge>
              </div>
              <CardDescription className="mt-2 text-slate-600">Join classes, play eco-themed games, and track your progress with leaderboards and badges.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-600">Get hands-on with interactive challenges 
                  and friendly competitions.</p>
                <Button size="lg" onClick={() => setRole("student")} disabled={loading}>Student</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-emerald-50 p-2">
                    <School className="h-6 w-6 text-emerald-600" />
                  </div>
                  <CardTitle className="text-lg">Teacher</CardTitle>
                </div>
                <Badge className="bg-emerald-100 text-emerald-800">For educators</Badge>
              </div>
              <CardDescription className="mt-2 text-slate-600">Create and manage classrooms, assign challenges, and monitor student progress.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-600">Build engaging lessons and reward student achievements.</p>
                <Button size="lg" onClick={() => setRole("teacher")} disabled={loading}>Teacher</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator className="my-8" />
        <p className="text-center text-sm text-slate-500">You can change your role anytime from your profile settings.</p>
      </div>
    </div>
  );
}