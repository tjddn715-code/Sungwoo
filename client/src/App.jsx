import { useState } from 'react';
import Header from './components/Header.jsx';
import TabBar from './components/TabBar.jsx';
import NewsFeed from './components/NewsFeed.jsx';

const TABS = [
  { id: 'dishware', label: '🍽️ 식기 렌탈' },
  { id: 'restaurant', label: '🍜 외식 산업' },
  { id: 'catering', label: '🏫 급식 산업' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('dishware');
  const [lastUpdated, setLastUpdated] = useState(null);
  const [refreshKey, setRefreshKey] = useState({
    dishware: 0,
    restaurant: 0,
    catering: 0,
  });

  const handleRefresh = (tabId) => {
    setRefreshKey((prev) => ({ ...prev, [tabId]: prev[tabId] + 1 }));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-[900px] mx-auto px-4 py-6">
        <Header lastUpdated={lastUpdated} />
        <TabBar
          tabs={TABS}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onRefresh={handleRefresh}
        />
        <NewsFeed
          category={activeTab}
          refreshKey={refreshKey[activeTab]}
          onDataLoaded={setLastUpdated}
        />
      </div>
    </div>
  );
}
