import { createLink } from "@tanstack/react-router";
import { Button } from "@heroui/react";
import type { ButtonProps } from "@heroui/react";
import React from "react";

/**
 * TanStack Router와 통합된 HeroUI Button 컴포넌트
 *
 * 페이지 이동을 위한 링크 버튼으로, 다음 기능을 제공합니다:
 * - HeroUI Button의 모든 스타일링 및 variant 지원
 * - TanStack Router의 타입 안전한 라우팅
 * - 자동 프리로딩 (preload prop)
 * - 활성 상태 스타일링 (activeProps)
 *
 * @example
 * ```tsx
 * <ButtonLink
 *   to="/votes/new"
 *   color="primary"
 *   size="lg"
 *   preload="intent"
 * >
 *   투표 생성
 * </ButtonLink>
 * ```
 */
export const ButtonLink = createLink(
  React.forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
    return <Button {...props} ref={ref} />;
  })
);
