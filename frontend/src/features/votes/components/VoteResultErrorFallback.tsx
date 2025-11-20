import { Button } from "@heroui/react"
import { ButtonLink } from "@/components/ButtonLink"
import type { ErrorBoundaryFallbackProps } from "@suspensive/react"
import { RefreshCw, List } from "lucide-react"

export function VoteResultErrorFallback({
  error,
  reset,
}: ErrorBoundaryFallbackProps) {
  // 에러 메시지 추출
  const errorMessage = error instanceof Error ? error.message : "요청하신 투표가 존재하지 않거나 결과를 조회할 수 없습니다.";

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center space-y-8">
          <h1 className="text-3xl font-bold text-gray-900">
            오류가 발생했습니다
          </h1>
          <p className="text-gray-600">
            {errorMessage}
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              color="primary"
              size="lg"
              onPress={reset}
              startContent={<RefreshCw size={18} />}
            >
              다시 시도
            </Button>
            <ButtonLink
              to="/votes"
              variant="flat"
              size="lg"
              startContent={<List size={18} />}
            >
              목록으로
            </ButtonLink>
          </div>
        </div>
      </div>
    </div>
  )
}
