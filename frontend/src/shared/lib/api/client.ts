import ky, { type KyInstance } from "ky";

// API 클라이언트 설정
const createApiClient = (): KyInstance => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

  return ky.create({
    prefixUrl: baseUrl,
    timeout: 10000, // 10초
    retry: {
      limit: 2,
      methods: ["get", "put", "delete"], // POST는 재시도 제외 (중복 생성 방지)
      statusCodes: [408, 413, 429, 500, 502, 503, 504],
    },
    hooks: {
      afterResponse: [
        async (_request, _options, response) => {
          // 400 Bad Request 에러 처리
          if (response.status === 400) {
            let errorMessage = "잘못된 요청입니다.";

            try {
              const body = await response.text();
              // 백엔드가 문자열 메시지를 직접 보내는 경우
              if (body && body.length > 0) {
                // JSON 문자열인지 확인 (따옴표로 감싸진 경우)
                try {
                  errorMessage = JSON.parse(body);
                } catch {
                  // 일반 문자열인 경우
                  errorMessage = body;
                }
              }
            } catch {
              // 에러 파싱 실패 시 기본 메시지 사용
            }

            throw new Error(errorMessage);
          }

          return response;
        }
      ]
    }
  });
};

// 싱글톤 인스턴스
export const apiClient = createApiClient();
