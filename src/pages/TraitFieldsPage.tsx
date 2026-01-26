import { useState } from 'react';
import './TraitFieldsPage.css';
import { useTraitData } from '../contexts/TraitDataContext';
import type { Page } from '../types';

interface TraitFieldsPageProps {
  onNavigate: (page: Page) => void;
}

function TraitFieldsPage({ onNavigate }: TraitFieldsPageProps) {
  const { mergedTraitData } = useTraitData();
  const [expandedAreas, setExpandedAreas] = useState<Set<string>>(new Set());
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const toggleArea = (areaName: string) => {
    const newExpanded = new Set(expandedAreas);
    if (newExpanded.has(areaName)) {
      newExpanded.delete(areaName);
    } else {
      newExpanded.add(areaName);
    }
    setExpandedAreas(newExpanded);
  };

  const toggleGroup = (groupKey: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupKey)) {
      newExpanded.delete(groupKey);
    } else {
      newExpanded.add(groupKey);
    }
    setExpandedGroups(newExpanded);
  };

  return (
    <div className="trait-fields-page">
      <div className="trait-fields-header">
        <h1>Trait Fields</h1>
        <p>Manage and organize daylily observation traits</p>
      </div>

      <div className="trait-areas">
        {mergedTraitData.map((area) => {
          const isAreaExpanded = expandedAreas.has(area.name);

          return (
            <div key={area.name} className={`trait-area ${area.isCustom ? 'custom-area' : ''}`}>
              <button
                className="area-header"
                onClick={() => toggleArea(area.name)}
              >
                <span className="expand-icon">{isAreaExpanded ? '▼' : '▶'}</span>
                <span className="area-name">{area.name}</span>
                {area.isCustom && <span className="custom-badge">Custom</span>}
                <span className="area-count">({area.groups.reduce((sum, g) => sum + g.traits.length, 0)} traits)</span>
              </button>

              {isAreaExpanded && (
                <div className="trait-groups">
                  {area.groups.map((group) => {
                    const groupKey = `${area.name}-${group.name}`;
                    const isGroupExpanded = expandedGroups.has(groupKey);

                    return (
                      <div key={groupKey} className={`trait-group ${group.isCustom ? 'custom-group' : ''}`}>
                        <button
                          className="group-header"
                          onClick={() => toggleGroup(groupKey)}
                        >
                          <span className="expand-icon">{isGroupExpanded ? '▼' : '▶'}</span>
                          <span className="group-name">{group.name}</span>
                          {group.isCustom && !area.isCustom && <span className="custom-badge">Custom</span>}
                          <span className="group-count">({group.traits.length})</span>
                        </button>

                        {isGroupExpanded && (
                          <div className="trait-list">
                            {group.traits.map((trait) => (
                              <div key={trait.field} className={`trait-item ${trait.isCustom ? 'custom-trait' : ''}`}>
                                <div className="trait-info">
                                  <span className="trait-name">{trait.label}</span>
                                  <span className="trait-field">{trait.field}</span>
                                </div>
                                <div className="trait-meta">
                                  {trait.isCustom && <span className="custom-badge small">Custom</span>}
                                  {trait.type && (
                                    <span className="trait-type">{trait.type}</span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="trait-actions">
        <button className="add-edit-btn" onClick={() => onNavigate('custom-trait-list')}>
          + Add / Edit Custom Trait
        </button>
      </div>
    </div>
  );
}

export default TraitFieldsPage;
