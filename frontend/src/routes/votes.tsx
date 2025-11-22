import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useAuthStore } from "@/features/auth/stores/authStore";
import { UserChip } from "@/components/UserChip";

export const Route = createFileRoute("/votes")({
  beforeLoad: () => {
    const { isAuthenticated } = useAuthStore.getState();
    if (!isAuthenticated) {
      throw redirect({ to: "/" });
    }
  },
  component: VotesLayout,
});

function VotesLayout() {
  const currentUser = useAuthStore((state) => state.currentUser);

  return (
    <>
      {currentUser && <UserChip user={currentUser} />}
      <Outlet />
    </>
  );
}
