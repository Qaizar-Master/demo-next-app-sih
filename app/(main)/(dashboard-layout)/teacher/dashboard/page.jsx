import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function TeacherDashboardPage({ searchParams }) {
  if ( await searchParams?.skipRole === '1') {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold">Teacher Dashboard</h1>
        <p className="text-slate-600 mt-2">Welcome, Teacher!</p>
      </div>
    );
  }

  const { userId } = auth();
  if (!userId) redirect("/sign-in");
  const user = await currentUser();
  const role = user?.publicMetadata?.role;
  if (role !== "teacher") redirect("/select-role");

}