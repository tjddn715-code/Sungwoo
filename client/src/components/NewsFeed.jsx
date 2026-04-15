import { useEffect, useState, useRef } from 'react';
import NewsCard from './NewsCard.jsx';
import LoadingSpinner from './LoadingSpinner.jsx';

export default function NewsFeed({ category, refreshKey, onDataLoaded }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const prevCategoryRef = useRef(null);

  const fetchNews = async (forceRefresh = false) => {
    setLoading(true);
    setError(null);
    try {
      const base = import.meta.env.VITE_API_URL || '';
      const url = `${base}/api/news?category=${category}${forceRefresh ? '&refresh=true' : ''}`;
      const res = await fetch(url);
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || '뉴스를 불러오지 못했습니다.');
      }
      const data = await res.json();
      setArticles(data.articles || []);
      onDataLoaded(data.cachedAt);
    } catch (err) {
      setError(err.message || '뉴스를 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const isRefresh = prevCategoryRef.current === category && refreshKey > 0;
    prevCategoryRef.current = category;
    fetchNews(isRefresh);
  }, [category, refreshKey]);

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <p className="text-sm text-gray-500">{error}</p>
        <button
          onClick={() => fetchNews(true)}
          className="px-4 py-2 bg-[#1a56db] text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
        >
          다시 시도
        </button>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-gray-400">관련 뉴스가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {articles.map((article, idx) => (
        <NewsCard key={article.link || idx} article={article} />
      ))}
    </div>
  );
}
