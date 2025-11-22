import { Chip } from "@heroui/react";
import { User } from "lucide-react";
import type { Member } from "@/features/auth/types/member.types";

interface UserChipProps {
  user: Member;
}

export const UserChip = ({ user }: UserChipProps) => {
  return (
    <div className="fixed top-4 left-4 z-50">
      <Chip
        variant="flat"
        color="primary"
        size="lg"
        startContent={<User size={16} />}
        className="font-medium shadow-lg"
      >
        <span className="flex items-center gap-1">
          <span className="font-semibold">{user.name}</span>
          <span className="text-xs opacity-70">({user.id})</span>
        </span>
      </Chip>
    </div>
  );
};
