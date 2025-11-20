import { Button } from "@heroui/react";
import type { ErrorBoundaryFallbackProps } from "@suspensive/react";
import { RefreshCw } from "lucide-react";

export function LoginErrorFallback({ error, reset }: ErrorBoundaryFallbackProps) {
  // 에러 메시지 추출
  const errorMessage = error instanceof Error ? error.message : "멤버 목록을 불러올 수 없습니다";

  return (
    <div className="flex items-center justify-center">
      <div className="text-center space-y-4">
        <p className="text-red-600 text-lg font-semibold">
          오류가 발생했습니다
        </p>
        <p className="text-gray-600">{errorMessage}</p>
        <Button
          color="primary"
          size="lg"
          onPress={reset}
          startContent={<RefreshCw size={18} />}
        >
          다시 시도
        </Button>
      </div>
    </div>
  );
}
