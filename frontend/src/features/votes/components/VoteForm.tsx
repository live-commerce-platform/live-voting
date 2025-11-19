import { Button, Form, Input } from "@heroui/react";
import { Check, Plus, Trash, X } from "lucide-react";
import { useId, useState } from "react";
import { useAuthStore } from "@/features/auth/stores/authStore";
import { useCreateVote } from "../hooks/useCreateVote";

interface CandidateItem {
	id: string;
	value: string;
}

export const VoteForm = () => {
	const candidatesListId = useId();
	const [title, setTitle] = useState("");
	const [candidates, setCandidates] = useState<CandidateItem[]>([
		{ id: crypto.randomUUID(), value: "" },
		{ id: crypto.randomUUID(), value: "" },
	]);
	const [errors, setErrors] = useState<{
		title?: string;
		candidates?: string;
		candidateErrors?: Record<string, string>;
	}>({});

	const { mutate: createVote, isPending } = useCreateVote();
	const currentUser = useAuthStore((state) => state.currentUser);

	const handleAddCandidate = () => {
		setCandidates([...candidates, { id: crypto.randomUUID(), value: "" }]);
	};

	const handleRemoveCandidate = (id: string) => {
		if (candidates.length <= 2) return;
		setCandidates(candidates.filter((c) => c.id !== id));
	};

	const handleCandidateChange = (id: string, value: string) => {
		setCandidates(candidates.map((c) => (c.id === id ? { ...c, value } : c)));
	};

	const validateForm = (): boolean => {
		const newErrors: {
			title?: string;
			candidates?: string;
			candidateErrors?: Record<string, string>;
		} = {};

		// 투표명 검증
		if (!title.trim()) {
			newErrors.title = "투표명을 입력해주세요";
		}

		// 후보 개별 검증
		const candidateErrors: Record<string, string> = {};
		candidates.forEach((candidate) => {
			if (!candidate.value.trim()) {
				candidateErrors[candidate.id] = "후보를 입력해주세요";
			}
		});

		// 유효한 후보 개수 검증
		const validCandidates = candidates.filter((c) => c.value.trim());
		if (validCandidates.length < 2) {
			newErrors.candidates = "최소 2개 이상의 후보를 입력해주세요";
		}

		// 개별 후보 에러가 있으면 추가
		if (Object.keys(candidateErrors).length > 0) {
			newErrors.candidateErrors = candidateErrors;
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) return;
		if (!currentUser) return;

		const validCandidates = candidates
			.filter((c) => c.value.trim())
			.map((c) => c.value);

		createVote({
			title: title.trim(),
			candidates: validCandidates,
			authorId: currentUser.id,
		});
	};

	const handleCancel = () => {
		window.history.back();
	};

	return (
		<Form
			validationErrors={
				Object.fromEntries(
					Object.entries({
						title: errors.title,
						candidates: errors.candidates,
					}).filter(([_, v]) => v !== undefined),
				) as Record<string, string>
			}
			validationBehavior="aria"
			onSubmit={handleSubmit}
			className="flex flex-col gap-8"
		>
			{/* 투표명 입력 */}
			<Input
				name="title"
				label="투표명"
				labelPlacement="outside"
				placeholder="투표 제목을 입력하세요"
				value={title}
				onChange={(e) => setTitle(e.target.value)}
				isRequired
				size="lg"
				classNames={{
					label: "text-gray-700 font-medium",
					input: "text-gray-900",
				}}
			/>

			{/* 후보 입력 */}
			<div className="flex flex-col w-full gap-3">
				<div className="flex items-center justify-between">
					<label
						htmlFor={candidatesListId}
						className="text-gray-700 font-medium text-sm"
					>
						후보 <span className="text-danger">*</span>
					</label>
					{errors.candidates && (
						<span className="text-danger text-xs">{errors.candidates}</span>
					)}
				</div>

				<fieldset id={candidatesListId} className="border-none p-0 m-0">
					<legend className="sr-only">투표 후보 목록</legend>
					{candidates.map((candidate, index) => (
						<div key={candidate.id} className="flex gap-2 mb-3 last:mb-0">
							<Input
								name={`candidate-${candidate.id}`}
								placeholder={`후보 ${index + 1}`}
								value={candidate.value}
								onChange={(e) =>
									handleCandidateChange(candidate.id, e.target.value)
								}
								size="lg"
								isInvalid={!!errors.candidateErrors?.[candidate.id]}
								errorMessage={errors.candidateErrors?.[candidate.id]}
								classNames={{
									input: "text-gray-900 flex-1",
								}}
							/>
							<Button
								type="button"
								color="danger"
								variant="flat"
								onPress={() => handleRemoveCandidate(candidate.id)}
								isDisabled={candidates.length <= 2}
								size="lg"
								isIconOnly
								aria-label={`후보 ${index + 1} 제거`}
							>
								<Trash className="size-5" />
							</Button>
						</div>
					))}
				</fieldset>

				<Button
					type="button"
					color="primary"
					variant="ghost"
					onPress={handleAddCandidate}
					size="lg"
					className="w-full"
					startContent={<Plus className="size-6" />}
				>
					후보 추가
				</Button>
			</div>

			{/* 버튼 그룹 */}
			<div className="flex gap-3 justify-center w-full">
				<Button
					type="button"
					variant="flat"
					onPress={handleCancel}
					isDisabled={isPending}
					size="lg"
					startContent={<X size={18} />}
				>
					취소
				</Button>
				<Button
					type="submit"
					color="primary"
					isLoading={isPending}
					size="lg"
					startContent={<Check size={18} />}
				>
					저장
				</Button>
			</div>
		</Form>
	);
};
