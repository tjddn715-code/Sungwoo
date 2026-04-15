import { Router } from 'express';
import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';

const router = Router();

const CATEGORY_MAP = {
  dishware: '식기 렌탈',
  restaurant: '외식 산업',
  catering: '급식 산업',
};

// 메모리 캐시
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5분

function stripHtml(html) {
  if (!html) return '';
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .trim()
    .slice(0, 100);
}

router.get('/', async (req, res) => {
  const { category, refresh } = req.query;

  if (!category || !CATEGORY_MAP[category]) {
    return res.status(400).json({ error: '올바르지 않은 카테고리입니다.' });
  }

  const keyword = CATEGORY_MAP[category];
  const cacheKey = category;
  const now = Date.now();

  // 캐시 확인 (refresh=true가 아닌 경우)
  if (refresh !== 'true' && cache.has(cacheKey)) {
    const cached = cache.get(cacheKey);
    if (now - cached.timestamp < CACHE_TTL) {
      console.log(`[캐시 히트] category=${category}`);
      return res.json(cached.data);
    }
  }

  console.log(`[캐시 미스] category=${category}, keyword=${keyword} — RSS 호출 중`);

  try {
    const encodedKeyword = encodeURIComponent(keyword);
    const rssUrl = `https://news.google.com/rss/search?q=${encodedKeyword}&hl=ko&gl=KR&ceid=KR:ko`;

    const response = await axios.get(rssUrl, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; NewsAggregator/1.0)',
      },
    });

    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
    });
    const parsed = parser.parse(response.data);

    const items = parsed?.rss?.channel?.item || [];
    const itemArray = Array.isArray(items) ? items : [items];

    const articles = itemArray.slice(0, 30).map((item) => {
      let source = '';
      if (item.source) {
        if (typeof item.source === 'string') {
          source = item.source;
        } else if (item.source['#text']) {
          source = item.source['#text'];
        } else if (typeof item.source === 'object') {
          source = item.source['@_url'] ? '' : String(item.source);
        }
      }

      return {
        title: item.title ? String(item.title).replace(/ - [^-]+$/, '') : '',
        link: item.link || '',
        pubDate: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
        source,
        description: stripHtml(item.description),
      };
    });

    const cachedAt = new Date().toISOString();
    const responseData = {
      category,
      keyword,
      articles,
      cachedAt,
      count: articles.length,
    };

    cache.set(cacheKey, { data: responseData, timestamp: now });

    return res.json(responseData);
  } catch (err) {
    console.error(`[에러] RSS 호출 실패:`, err.message);
    return res.status(502).json({ error: '뉴스를 불러오지 못했습니다.' });
  }
});

export default router;
