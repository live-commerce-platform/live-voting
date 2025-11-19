import { Progress } from "@heroui/react";
import { motion } from "framer-motion";
import type { VoteCandidate } from "../types/vote.types";

interface VoteResultItemProps {
	candidate: VoteCandidate;
	totalVotes: number;
	rank: number;
}

export const VoteResultItem = ({
	candidate,
	totalVotes,
	rank,
}: VoteResultItemProps) => {
	const percentage =
		totalVotes > 0 ? (candidate.voteCount / totalVotes) * 100 : 0;
	const isFirstPlace = rank === 1;

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4, delay: rank * 0.1 }}
			className="space-y-3"
		>
			<div className="flex items-center justify-between">
				<h3
					className={`font-semibold ${
						isFirstPlace ? "text-5xl text-gray-900" : "text-2xl text-gray-800"
					}`}
				>
					{candidate.name}
				</h3>
				<span
					className={`${
						isFirstPlace
							? "text-2xl font-bold text-gray-900"
							: "text-lg text-default-600"
					}`}
				>
					{candidate.voteCount}표 ({percentage.toFixed(1)}%)
				</span>
			</div>

			<motion.div
				initial={{ width: 0 }}
				animate={{ width: "100%" }}
				transition={{ duration: 1.5, delay: rank * 0.1, ease: "easeOut" }}
			>
				<Progress
					value={percentage}
					color={isFirstPlace ? "success" : "primary"}
					size="lg"
					className="w-full"
					aria-label={`${candidate.name} 득표율: ${percentage.toFixed(1)}%`}
				/>
			</motion.div>
		</motion.div>
	);
};
