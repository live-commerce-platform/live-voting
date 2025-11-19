import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { isHTTPError } from "@/shared/lib/api";

export function getContext() {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				staleTime: 1000 * 60 * 5, // 5분
				gcTime: 1000 * 60 * 10, // 10분 (구 cacheTime)
				retry: (failureCount, error) => {
					// HTTP 4xx 에러는 재시도 안 함 (클라이언트 에러)
					if (
						isHTTPError(error) &&
						error.response.status >= 400 &&
						error.response.status < 500
					) {
						return false;
					}
					return failureCount < 2;
				},
				refetchOnWindowFocus: false, // 개발 중 편의성
			},
			mutations: {
				retry: 1, // 뮤테이션은 1회만 재시도
			},
		},
	});
	return {
		queryClient,
	};
}

export function Provider({
	children,
	queryClient,
}: {
	children: React.ReactNode;
	queryClient: QueryClient;
}) {
	return (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
}
