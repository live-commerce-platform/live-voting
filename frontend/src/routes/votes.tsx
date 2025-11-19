import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { getAuthState } from "@/features/auth/stores/authStore";

export const Route = createFileRoute("/votes")({
  beforeLoad: () => {
    const { isAuthenticated } = getAuthState();
    if (!isAuthenticated) {
      throw redirect({ to: "/" });
    }
  },
  component: VotesLayout,
});

function VotesLayout() {
  return <Outlet />;
}
