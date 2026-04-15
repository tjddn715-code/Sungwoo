export default function Header({ lastUpdated }) {
  const formatTime = (iso) => {
    if (!iso) return null;
    const d = new Date(iso);
    return d.toLocaleString('ko-KR', {
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <header className="mb-5">
      <div className="flex items-end justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-2xl font-bold text-[#1a56db] leading-tight">
            업종 뉴스 브리핑
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            식기렌탈 · 외식 · 급식 산업 최신 뉴스
          </p>
        </div>
        {lastUpdated && (
          <span className="text-xs text-gray-400">
            마지막 업데이트: {formatTime(lastUpdated)}
          </span>
        )}
      </div>
    </header>
  );
}
