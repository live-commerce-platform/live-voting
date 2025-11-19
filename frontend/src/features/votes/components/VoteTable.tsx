import {
	Button,
	Spinner,
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
} from "@heroui/react";
import { useNavigate } from "@tanstack/react-router";
import { PlusCircle, XCircle } from "lucide-react";
import { ButtonLink } from "@/components/ButtonLink";
import { useAuthStore } from "@/features/auth/stores/authStore";
import { useCloseVote } from "../hooks/useCloseVote";
import type { Vote } from "../types/vote.types";
import { VoteStatusBadge } from "./VoteStatusBadge";

interface VoteTableProps {
	data?: Vote[];
	isLoading: boolean;
}

const columns = [
	{ key: "title", label: "투표 주제" },
	{ key: "author", label: "작성자", align: "center" as const },
	{ key: "status", label: "상태", align: "center" as const },
	{ key: "actions", label: "작업", align: "center" as const },
];

export const VoteTable = ({ data = [], isLoading }: VoteTableProps) => {
	const navigate = useNavigate();
	const closeVoteMutation = useCloseVote();
	const currentUser = useAuthStore((state) => state.currentUser);

	const handleRowClick = (vote: Vote) => {
		if (vote.status === "OPEN") {
			navigate({ to: `/votes/$id/voting`, params: { id: vote.id } });
		} else {
			navigate({ to: `/votes/$id/result`, params: { id: vote.id } });
		}
	};

	const handleCloseVote = (voteId: string) => {
		closeVoteMutation.mutate(voteId);
	};

	const renderCell = (vote: Vote, columnKey: React.Key) => {
		switch (columnKey) {
			case "title":
				return (
					<span className="font-semibold text-default-900 group-hover:underline">
						{vote.title}
					</span>
				);
			case "author":
				return <span className="text-default-600">{vote.author}</span>;
			case "status":
				return <VoteStatusBadge status={vote.status} />;
			case "actions":
				return (
					<div onClick={(e) => e.stopPropagation()}>
						{vote.status === "OPEN" && vote.authorId === currentUser?.id && (
							<Button
								variant="flat"
								color="danger"
								size="sm"
								startContent={<XCircle className="w-4 h-4" />}
								onPress={() => handleCloseVote(vote.id)}
								isLoading={closeVoteMutation.isPending}
							>
								종료
							</Button>
						)}
					</div>
				);
			default:
				return null;
		}
	};

	return (
		<div className="space-y-6">
			<div className="flex justify-end">
				<ButtonLink
					to="/votes/new"
					color="primary"
					size="lg"
					className="font-semibold"
					startContent={<PlusCircle className="size-6" />}
					preload="intent"
				>
					투표 생성
				</ButtonLink>
			</div>

			<Table aria-label="투표 목록">
				<TableHeader columns={columns}>
					{(column) => (
						<TableColumn key={column.key} align={column.align}>
							{column.label}
						</TableColumn>
					)}
				</TableHeader>
				<TableBody
					items={data}
					isLoading={isLoading}
					loadingContent={<Spinner label="로딩중..." size="lg" />}
					emptyContent={
						<div className="py-12 text-center text-default-500">
							투표가 없습니다.
						</div>
					}
				>
					{(vote) => (
						<TableRow
							key={vote.id}
							className="cursor-pointer group transition-colors hover:bg-default-100 h-16"
							onClick={() => handleRowClick(vote)}
						>
							{(columnKey) => (
								<TableCell>{renderCell(vote, columnKey)}</TableCell>
							)}
						</TableRow>
					)}
				</TableBody>
			</Table>
		</div>
	);
};
