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
		// ky가 HTTP 에러 시 자동으로 HTTPError를 throw하므로 별도 hooks 불필요
	});
};

// 싱글톤 인스턴스
export const apiClient = createApiClient();
