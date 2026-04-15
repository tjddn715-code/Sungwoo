export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3">
      <div className="w-10 h-10 border-4 border-gray-200 border-t-[#1a56db] rounded-full animate-spin" />
      <p className="text-sm text-gray-400">뉴스를 불러오는 중...</p>
    </div>
  );
}
