import { Button, Form, Input } from "@heroui/react";
import { useState } from "react";
import { useCreateVote } from "../hooks/useCreateVote";
import { Plus, Trash } from "lucide-react";
import { useAuthStore } from "@/features/auth/stores/authStore";

export const VoteForm = () => {
  const [title, setTitle] = useState("");
  const [candidates, setCandidates] = useState(["", ""]);
  const [errors, setErrors] = useState<{
    title?: string;
    candidates?: string;
    candidateErrors?: Record<number, string>;
  }>({});

  const { mutate: createVote, isPending } = useCreateVote();
  const currentUser = useAuthStore((state) => state.currentUser);

  const handleAddCandidate = () => {
    setCandidates([...candidates, ""]);
  };

  const handleRemoveCandidate = (index: number) => {
    if (candidates.length <= 2) return;
    setCandidates(candidates.filter((_, i) => i !== index));
  };

  const handleCandidateChange = (index: number, value: string) => {
    const newCandidates = [...candidates];
    newCandidates[index] = value;
    setCandidates(newCandidates);
  };

  const validateForm = (): boolean => {
    const newErrors: {
      title?: string;
      candidates?: string;
      candidateErrors?: Record<number, string>;
    } = {};

    // 투표명 검증
    if (!title.trim()) {
      newErrors.title = "투표명을 입력해주세요";
    }

    // 후보 개별 검증
    const candidateErrors: Record<number, string> = {};
    candidates.forEach((candidate, index) => {
      if (!candidate.trim()) {
        candidateErrors[index] = "후보를 입력해주세요";
      }
    });

    // 유효한 후보 개수 검증
    const validCandidates = candidates.filter((c) => c.trim());
    if (validCandidates.length < 2) {
      newErrors.candidates = "최소 2개 이상의 후보를 입력해주세요";
    }

    // 개별 후보 에러가 있으면 추가
    if (Object.keys(candidateErrors).length > 0) {
      newErrors.candidateErrors = candidateErrors;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;
    if (!currentUser) return;

    const validCandidates = candidates.filter((c) => c.trim());

    createVote({
      title: title.trim(),
      candidates: validCandidates,
      authorId: currentUser.id,
    });
  };

  const handleCancel = () => {
    window.history.back();
  };

  return (
    <Form
      validationErrors={
        Object.fromEntries(
          Object.entries({
            title: errors.title,
            candidates: errors.candidates,
          }).filter(([_, v]) => v !== undefined)
        ) as Record<string, string>
      }
      validationBehavior="aria"
      onSubmit={handleSubmit}
      className="max-w-xl flex flex-col gap-4"
    >
      {/* 투표명 입력 */}
      <Input
        name="title"
        label="투표명"
        labelPlacement="outside"
        placeholder="투표 제목을 입력하세요"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        isRequired
        size="lg"
        classNames={{
          label: "text-gray-700 font-medium",
          input: "text-gray-900",
        }}
      />

      {/* 후보 입력 */}
      <div className="flex flex-col w-full gap-3">
        <div className="flex items-center justify-between">
          <label className="text-gray-700 font-medium text-sm">
            후보 <span className="text-danger">*</span>
          </label>
          {errors.candidates && (
            <span className="text-danger text-xs">{errors.candidates}</span>
          )}
        </div>

        {candidates.map((candidate, index) => (
          <div key={index} className="flex gap-2">
            <Input
              name={`candidate-${index}`}
              placeholder={`후보 ${index + 1}`}
              value={candidate}
              onChange={(e) => handleCandidateChange(index, e.target.value)}
              size="lg"
              isInvalid={!!errors.candidateErrors?.[index]}
              errorMessage={errors.candidateErrors?.[index]}
              classNames={{
                input: "text-gray-900 flex-1",
              }}
            />
            <Button
              type="button"
              color="danger"
              variant="flat"
              onPress={() => handleRemoveCandidate(index)}
              isDisabled={candidates.length <= 2}
              size="lg"
              isIconOnly
            >
              <Trash className="size-5" />
            </Button>
          </div>
        ))}

        <Button
          type="button"
          color="primary"
          variant="ghost"
          onPress={handleAddCandidate}
          size="lg"
          className="w-full"
          startContent={<Plus className="size-6" />}
        >
          후보 추가
        </Button>
      </div>

      {/* 버튼 그룹 */}
      <div className="flex gap-3 pt-2 justify-end">
        <Button
          type="button"
          variant="flat"
          onPress={handleCancel}
          isDisabled={isPending}
          size="lg"
        >
          취소
        </Button>
        <Button type="submit" color="primary" isLoading={isPending} size="lg">
          저장
        </Button>
      </div>
    </Form>
  );
};
