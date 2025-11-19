import { Spinner } from "@heroui/react";

export function VotingLoader() {
	return (
		<div className="min-h-screen flex items-center justify-center">
			<div className="space-y-4 text-center">
				<Spinner size="lg" className="mx-auto" />
				<p className="text-gray-600">투표 정보를 불러오는 중...</p>
			</div>
		</div>
	);
}
