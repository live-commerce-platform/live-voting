import { addToast } from "@heroui/react";
import { Button } from "@heroui/react";
import { CheckSquareIcon } from "lucide-react";
import type { ReactNode } from "react";

/**
 * 투표 생성 알림 토스트
 *
 * 새로운 투표가 생성되었을 때 우측 상단에 토스트를 표시하고,
 * "투표하기" 버튼을 통해 투표 페이지로 바로 이동할 수 있습니다.
 *
 * @param title - 투표 제목
 * @param description - 투표 설명 또는 작성자 정보
 * @param onAction - "투표하기" 버튼 클릭 시 실행할 함수
 */
export function showVoteNotification(
  title: string,
  description: string,
  onAction: () => void
) {
  return addToast({
    title,
    description,
    timeout: 5000,
    endContent: (
      <Button size="sm" variant="flat" color="primary" onPress={onAction}>
        <CheckSquareIcon size={18} />
        투표하기
      </Button>
    ),
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
  }
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
  }
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
  }
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
  }
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
