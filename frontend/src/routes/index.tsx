import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button, Select, SelectItem } from "@heroui/react";
import type { Selection } from "@heroui/react";
import { useState } from "react";
import { Suspense, ErrorBoundary } from "@suspensive/react";
import { SuspenseQuery } from "@suspensive/react-query";
import { fetchMembers } from "@/features/auth/api/members.api";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { SuspenseLoader } from "@/components/fallbacks/SuspenseLoader";
import { ErrorFallback } from "@/components/fallbacks/ErrorFallback";
import type { Member } from "@/features/auth/types/member.types";

export const Route = createFileRoute("/")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  const handleSelectionChange = (keys: Selection, members: Member[]) => {
    setSelectedKeys(keys);
    const memberId = Array.from(keys)[0] as string;
    const member = members.find((m) => m.id === memberId);
    setSelectedMember(member || null);
  };

  const handleLogin = () => {
    if (!selectedMember) return;
    login(selectedMember);
    navigate({ to: "/votes" });
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="w-full max-w-md space-y-8">
            {/* 헤더 */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Live Voting
              </h1>
              <p className="text-gray-600 text-lg">
                참여할 멤버를 선택해주세요
              </p>
            </div>

            {/* 로그인 폼 - members 데이터 필요 */}
            <ErrorBoundary fallback={ErrorFallback}>
              <Suspense fallback={<SuspenseLoader />}>
                <SuspenseQuery queryKey={["members"]} queryFn={fetchMembers}>
                  {({ data: members }) => (
                    <div className="space-y-6">
                      <Select
                        label="멤버 선택"
                        placeholder="멤버를 선택하세요"
                        selectedKeys={selectedKeys}
                        onSelectionChange={(keys) => handleSelectionChange(keys, members)}
                        className="w-full"
                        size="lg"
                        variant="bordered"
                        color="primary"
                      >
                        {members.map((member) => (
                          <SelectItem key={member.id}>{member.name}</SelectItem>
                        ))}
                      </Select>

                      <Button
                        color="primary"
                        size="lg"
                        className="w-full"
                        isDisabled={!selectedMember}
                        onPress={handleLogin}
                      >
                        로그인
                      </Button>
                    </div>
                  )}
                </SuspenseQuery>
              </Suspense>
            </ErrorBoundary>

            {/* 데모 안내 */}
            <p className="text-center text-sm text-gray-500 mt-6">
              멤버를 선택하여 로그인하세요.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
