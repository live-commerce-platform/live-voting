import { addToast } from "@heroui/react";
import type { ReactNode } from "react";

/**
 * 투표 생성 알림 토스트
 *
 * 새로운 투표가 생성되었을 때 우측 상단에 토스트를 표시합니다.
 *
 * @param title - 투표 제목
 * @param description - 투표 설명 또는 작성자 정보
 */
export function showVoteNotification(title: string, description: string) {
	return addToast({
		title,
		description,
		timeout: 5000,
	});
}

/**
 * 범용 성공 토스트
 *
 * @param title - 토스트 제목
 * @param description - 토스트 설명 (선택사항)
 * @param options - 추가 옵션
 */
export function showSuccessToast(
	title: string,
	description?: string,
	options?: {
		timeout?: number;
		endContent?: ReactNode;
	},
) {
	return addToast({
		title,
		description,
		color: "success",
		variant: "flat",
		timeout: options?.timeout ?? 5000,
		endContent: options?.endContent,
	});
}

/**
 * 범용 에러 토스트
 *
 * @param title - 토스트 제목
 * @param description - 토스트 설명 (선택사항)
 * @param options - 추가 옵션
 */
export function showErrorToast(
	title: string,
	description?: string,
	options?: {
		timeout?: number;
		endContent?: ReactNode;
	},
) {
	return addToast({
		title,
		description,
		color: "danger",
		variant: "flat",
		timeout: options?.timeout ?? 5000,
		endContent: options?.endContent,
	});
}

/**
 * 범용 정보 토스트
 *
 * @param title - 토스트 제목
 * @param description - 토스트 설명 (선택사항)
 * @param options - 추가 옵션
 */
export function showInfoToast(
	title: string,
	description?: string,
	options?: {
		timeout?: number;
		endContent?: ReactNode;
	},
) {
	return addToast({
		title,
		description,
		color: "default",
		variant: "flat",
		timeout: options?.timeout ?? 5000,
		endContent: options?.endContent,
	});
}

/**
 * 범용 경고 토스트
 *
 * @param title - 토스트 제목
 * @param description - 토스트 설명 (선택사항)
 * @param options - 추가 옵션
 */
export function showWarningToast(
	title: string,
	description?: string,
	options?: {
		timeout?: number;
		endContent?: ReactNode;
	},
) {
	return addToast({
		title,
		description,
		color: "warning",
		variant: "flat",
		timeout: options?.timeout ?? 5000,
		endContent: options?.endContent,
	});
}
