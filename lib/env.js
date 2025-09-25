// Centralized environment variable validation and accessors

const requiredClientVars = [
	"NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
];

function assertRequiredVarsExist() {
	if (process.env.NODE_ENV === "production") {
		const missing = requiredClientVars.filter((v) => !process.env[v]);
		if (missing.length > 0) {
			throw new Error(
				`Missing required environment variables: ${missing.join(", ")}`
			);
		}
	}
}

assertRequiredVarsExist();

export const env = {
	clerkPublishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || "",
};