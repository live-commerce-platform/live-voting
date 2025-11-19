import { Button, cn, Form, Radio, RadioGroup } from "@heroui/react";
import { BarChart3, CheckSquare, List } from "lucide-react";
import { useState } from "react";
import { ButtonLink } from "@/components/ButtonLink";
import { useSubmitVote } from "../hooks/useSubmitVote";
import type { VoteDetail, VoteRecord } from "../types/vote.types";
import { VoteStatusBadge } from "./VoteStatusBadge";

interface VotingFormProps {
	vote: VoteDetail;
	existingRecord?: VoteRecord | null;
	currentUserId: string;
}

export function VotingForm({
	vote,
	existingRecord,
	currentUserId,
}: VotingFormProps) {
	const [selectedCandidate, setSelectedCandidate] = useState<string>(
		existingRecord?.candidateId || "",
	);

	const { mutate: submitVote, isPending } = useSubmitVote(vote.id);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!selectedCandidate) return;

		submitVote({
			voteId: vote.id,
			candidateId: selectedCandidate,
			voterId: currentUserId,
		});
	};

	const isVoteChanged =
		existingRecord && existingRecord.candidateId !== selectedCandidate;
	const buttonText = existingRecord
		? isVoteChanged
			? "투표 변경하기"
			: "이미 투표한 내용입니다"
		: "투표하기";

	return (
		<div className="min-h-screen">
			<div className="container mx-auto px-4 py-12 max-w-2xl">
				<div className="space-y-8">
					{/* 투표 제목 */}
					<div className="text-center space-y-2">
						<VoteStatusBadge status={vote.status} />
						<h1 className="text-3xl font-bold text-gray-900">{vote.title}</h1>
						{existingRecord && (
							<p className="text-sm text-gray-600">
								이전에 투표한 내용이 선택되어 있습니다. 변경할 수 있습니다.
							</p>
						)}
					</div>

					{/* 투표 폼 */}
					<Form
						validationBehavior="aria"
						onSubmit={handleSubmit}
						className="gap-8"
					>
						<RadioGroup
							label="후보를 선택하세요"
							value={selectedCandidate}
							onValueChange={setSelectedCandidate}
							isRequired
							classNames={{
								base: "w-full",
							}}
						>
							{vote.candidates.map((candidate) => (
								<Radio
									key={candidate.id}
									value={candidate.id}
									classNames={{
										base: cn(
											"m-0 bg-content1 hover:bg-content2 max-w-full",
											"cursor-pointer rounded-lg p-4 border-2",
											"data-[selected=true]:border-primary border-default",
										),
									}}
								>
									{candidate.name}
								</Radio>
							))}
						</RadioGroup>

						{/* 제출 버튼 */}

						<Button
							type="submit"
							color="primary"
							isLoading={isPending}
							isDisabled={
								!selectedCandidate || (!!existingRecord && !isVoteChanged)
							}
							size="lg"
							className="w-full"
							startContent={<CheckSquare size={18} />}
						>
							{buttonText}
						</Button>
					</Form>

					{/* 네비게이션 버튼 */}
					<div className="flex gap-3 justify-center">
						<ButtonLink
							to="/votes"
							variant="flat"
							size="lg"
							startContent={<List size={18} />}
						>
							목록으로
						</ButtonLink>
						<ButtonLink
							to="/votes/$id/result"
							params={{ id: vote.id }}
							size="lg"
							color="success"
							startContent={<BarChart3 size={18} />}
						>
							결과보기
						</ButtonLink>
					</div>
				</div>
			</div>
		</div>
	);
}
