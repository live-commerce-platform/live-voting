import { Button } from "@heroui/react";
import { ButtonLink } from "@/components/ButtonLink";
import type { ErrorBoundaryFallbackProps } from "@suspensive/react";

export function VotingErrorFallback({ reset }: ErrorBoundaryFallbackProps) {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center space-y-8">
          <h1 className="text-3xl font-bold text-gray-900">
            투표를 찾을 수 없습니다
          </h1>
          <p className="text-gray-600">
            요청하신 투표가 존재하지 않거나 정보를 불러올 수 없습니다.
          </p>
          <div className="flex gap-4 justify-center">
            <Button color="primary" size="lg" onPress={reset}>
              다시 시도
            </Button>
            <ButtonLink to="/votes" variant="flat" size="lg">
              목록으로
            </ButtonLink>
          </div>
        </div>
      </div>
    </div>
  );
}
