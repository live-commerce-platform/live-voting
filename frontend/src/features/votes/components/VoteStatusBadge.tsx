import { Chip } from "@heroui/react";
import type { VoteStatus } from "../types/vote.types";

interface VoteStatusBadgeProps {
	status: VoteStatus;
}

export const VoteStatusBadge = ({ status }: VoteStatusBadgeProps) => {
	return (
		<Chip
			color={status === "OPEN" ? "success" : "default"}
			variant="flat"
			size="md"
			className="font-medium"
		>
			{status === "OPEN" ? "진행중" : "종료됨"}
		</Chip>
	);
};
