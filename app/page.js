import { ClerkProvider } from "@clerk/nextjs";
import LandingPage from "../components/Landing/LandingPage";

export default function Home() {
  return (
  <ClerkProvider>
    <LandingPage />
    </ClerkProvider>
    )
}
