function timeAgo(isoString) {
  const now = Date.now();
  const then = new Date(isoString).getTime();
  const diff = Math.floor((now - then) / 1000);

  if (diff < 60) return '방금 전';
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  return `${Math.floor(diff / 86400)}일 전`;
}

export default function NewsCard({ article }) {
  const { title, link, pubDate, source, description } = article;

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-white border border-gray-200 rounded-lg shadow-sm p-4 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 cursor-pointer"
    >
      <div className="flex items-start gap-3 mb-2">
        {source && (
          <span className="inline-block bg-blue-50 text-[#1a56db] text-xs font-medium px-2 py-0.5 rounded whitespace-nowrap shrink-0">
            {source}
          </span>
        )}
        <span className="text-xs text-gray-400 ml-auto whitespace-nowrap shrink-0">
          {timeAgo(pubDate)}
        </span>
      </div>

      <h2 className="text-sm font-semibold text-gray-900 leading-snug mb-1.5 line-clamp-2">
        {title}
      </h2>

      {description && (
        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
          {description}
        </p>
      )}
    </a>
  );
}
