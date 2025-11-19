import { Spinner } from "@heroui/react";

export function SuspenseLoader() {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center">
      <Spinner size="lg" />
    </div>
  );
}
