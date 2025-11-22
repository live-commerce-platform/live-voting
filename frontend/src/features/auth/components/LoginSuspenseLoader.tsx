export function LoginSuspenseLoader() {
  return (
    <div className="space-y-6">
      {/* Select 스켈레톤 */}
      <div className="w-full">
        <div className="w-full h-[56px] bg-gray-200 rounded-xl animate-pulse"></div>
      </div>

      {/* Button 스켈레톤 */}
      <div className="w-full h-[40px] bg-gray-200 rounded-xl animate-pulse"></div>
    </div>
  );
}
