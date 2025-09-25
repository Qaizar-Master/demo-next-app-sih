/**
 * Client-side helper to navigate to a role-specific dashboard.
 * Accepts a Next.js `router` (from `useRouter()`), chooses a path and pushes/replaces.
 *
 * Usage:
 * import { redirectToRole } from '@/lib/redirectToRole';
 * const router = useRouter();
 * redirectToRole('student', router, { skipFlag: true });
 */
export function redirectToRole(role, router, { skipFlag = false, replace = false } = {}) {
  let path = '/';

  if (role === 'student') path = '/student/dashboard';
  else if (role === 'teacher') path = '/teacher/dashboard';

  if (skipFlag) {
    const sep = path.includes('?') ? '&' : '?';
    path = `${path}${sep}skipRole=1`;
  }

  // Prefer router but fall back to window.location
  try {
    if (replace) router.replace(path);
    else router.push(path);
  } catch (e) {
    if (typeof window !== 'undefined') window.location.href = path;
  }
}
