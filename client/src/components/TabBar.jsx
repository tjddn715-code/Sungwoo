export default function TabBar({ tabs, activeTab, onTabChange, onRefresh }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-4">
      <div className="flex items-center overflow-x-auto">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <div key={tab.id} className="flex items-center flex-1 min-w-0">
              <button
                onClick={() => onTabChange(tab.id)}
                className={`flex-1 px-4 py-3 text-sm font-medium whitespace-nowrap transition-all duration-150 border-b-2 ${
                  isActive
                    ? 'border-[#1a56db] text-[#1a56db] font-semibold'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
              {isActive && (
                <button
                  onClick={() => onRefresh(tab.id)}
                  title="새로고침"
                  className="px-3 py-3 text-gray-400 hover:text-[#1a56db] transition-colors duration-150 text-base"
                >
                  🔄
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
