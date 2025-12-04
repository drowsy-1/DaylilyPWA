import './TabGroup.css';

type Tab = 'observations' | 'inventory' | 'breeding' | 'store';

interface TabGroupProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

function TabGroup({ activeTab, onTabChange }: TabGroupProps) {
  const allTabs: { id: Tab; label: string; enabled: boolean; mobileOnly?: boolean }[] = [
    { id: 'observations', label: 'Observations', enabled: true },
    { id: 'breeding', label: 'Crosses', enabled: true },
    { id: 'inventory', label: 'Inventory', enabled: true },
    { id: 'store', label: 'Store', enabled: false, mobileOnly: true },
  ];

  return (
    <div className="tab-group">
      {allTabs.map((tab) => (
        <button
          key={tab.id}
          className={`tab ${activeTab === tab.id ? 'active' : ''} ${!tab.enabled ? 'disabled' : ''} ${tab.mobileOnly ? 'mobile-only' : ''}`}
          onClick={() => tab.enabled && onTabChange(tab.id)}
          disabled={!tab.enabled}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export default TabGroup;
