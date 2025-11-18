import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/votes/new")({
  component: VoteNewPage,
});

function VoteNewPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">투표 생성</h1>
      <p className="text-default-600">
        투표 생성 페이지는 아직 구현되지 않았습니다.
      </p>
    </div>
  );
}
