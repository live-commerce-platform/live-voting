import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useAuthStore } from "@/features/auth/stores/authStore";

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
	return <Outlet />;
}
