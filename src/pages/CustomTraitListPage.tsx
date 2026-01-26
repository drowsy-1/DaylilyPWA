import { useState } from 'react';
import './CustomTraitListPage.css';
import { useTraitData } from '../contexts/TraitDataContext';
import type { Page } from '../types';

interface CustomTraitListPageProps {
  onNavigate: (page: Page, data?: unknown) => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

function CustomTraitListPage({ onNavigate, isDark, onToggleTheme }: CustomTraitListPageProps) {
  const {
    customTraitsData,
    deleteCustomTrait,
    deleteCustomGroup,
    deleteCustomArea
  } = useTraitData();

  const [expandedAreas, setExpandedAreas] = useState<Set<string>>(new Set());
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: 'trait' | 'group' | 'area'; area: string; group?: string; field?: string } | null>(null);

  const toggleArea = (areaName: string) => {
    const newExpanded = new Set(expandedAreas);
    if (newExpanded.has(areaName)) {
      newExpanded.delete(areaName);
    } else {
      newExpanded.add(areaName);
    }
    setExpandedAreas(newExpanded);
  };

  // Get custom areas
  const customAreas = customTraitsData?.customAreas || [];

  // Get custom groups added to default areas
  const customGroupsByArea = customTraitsData?.customGroups || {};

  // Get custom traits added to default groups
  const customTraitsByGroup = customTraitsData?.customTraits || {};

  // Check if there are any custom items
  const hasCustomItems =
    customAreas.length > 0 ||
    Object.keys(customGroupsByArea).length > 0 ||
    Object.keys(customTraitsByGroup).length > 0;

  // Get count of custom traits in a custom area
  const getCustomAreaTraitCount = (areaName: string) => {
    const area = customAreas.find(a => a.name === areaName);
    if (!area) return 0;
    return area.groups.reduce((sum, g) => sum + g.traits.length, 0);
  };

  // Handle delete confirmation
  const handleDelete = () => {
    if (!deleteConfirm) return;

    if (deleteConfirm.type === 'trait' && deleteConfirm.group && deleteConfirm.field) {
      deleteCustomTrait(deleteConfirm.area, deleteConfirm.group, deleteConfirm.field);
    } else if (deleteConfirm.type === 'group' && deleteConfirm.group) {
      deleteCustomGroup(deleteConfirm.area, deleteConfirm.group);
    } else if (deleteConfirm.type === 'area') {
      deleteCustomArea(deleteConfirm.area);
    }

    setDeleteConfirm(null);
  };

  // Find trait info for editing
  const handleEditTrait = (areaName: string, groupName: string, traitField: string) => {
    onNavigate('edit-custom-trait', { areaName, groupName, traitField });
  };

  return (
    <div className="custom-trait-list-page">
      {/* Header */}
      <div className="page-header">
        <button className="back-btn" onClick={() => onNavigate('trait-fields')} aria-label="Back to Trait Fields">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <button className="theme-toggle" onClick={onToggleTheme} aria-label="Toggle theme">
          {isDark ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </button>
      </div>

      <div className="page-content">
        <div className="page-title">
          <h1>Custom Traits</h1>
          <p>Manage your custom trait fields, groups, and areas</p>
        </div>

        {!hasCustomItems ? (
          <div className="empty-state">
            <div className="empty-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <h2>No Custom Traits Yet</h2>
            <p>Add custom trait fields, groups, or areas to extend the default trait structure.</p>
          </div>
        ) : (
          <div className="custom-traits-list">
            {/* Custom Areas */}
            {customAreas.length > 0 && (
              <section className="list-section">
                <h2 className="section-title">Custom Areas</h2>
                {customAreas.map(area => (
                  <div key={area.name} className="custom-area-item">
                    <button
                      className="area-header"
                      onClick={() => toggleArea(area.name)}
                    >
                      <span className="expand-icon">{expandedAreas.has(area.name) ? '▼' : '▶'}</span>
                      <span className="area-name">{area.name}</span>
                      <span className="area-count">({getCustomAreaTraitCount(area.name)} traits)</span>
                    </button>

                    <div className="area-actions">
                      <button
                        className="action-btn delete"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteConfirm({ type: 'area', area: area.name });
                        }}
                        title="Delete area"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                      </button>
                    </div>

                    {expandedAreas.has(area.name) && (
                      <div className="area-content">
                        {area.groups.map(group => (
                          <div key={group.name} className="group-item">
                            <div className="group-header-row">
                              <span className="group-name">{group.name}</span>
                              <span className="group-count">({group.traits.length} traits)</span>
                              <button
                                className="action-btn delete small"
                                onClick={() => setDeleteConfirm({ type: 'group', area: area.name, group: group.name })}
                                title="Delete group"
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <polyline points="3 6 5 6 21 6" />
                                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                </svg>
                              </button>
                            </div>
                            {group.traits.length > 0 && (
                              <div className="traits-list">
                                {group.traits.map(trait => (
                                  <div key={trait.field} className="trait-item">
                                    <div className="trait-info">
                                      <span className="trait-label">{trait.label}</span>
                                      <span className="trait-field">{trait.field}</span>
                                    </div>
                                    <div className="trait-actions">
                                      <span className="trait-type">{trait.type}</span>
                                      <button
                                        className="action-btn edit"
                                        onClick={() => handleEditTrait(area.name, group.name, trait.field)}
                                        title="Edit trait"
                                      >
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                        </svg>
                                      </button>
                                      <button
                                        className="action-btn delete"
                                        onClick={() => setDeleteConfirm({ type: 'trait', area: area.name, group: group.name, field: trait.field })}
                                        title="Delete trait"
                                      >
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                          <polyline points="3 6 5 6 21 6" />
                                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                        </svg>
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </section>
            )}

            {/* Custom Groups added to default areas */}
            {Object.keys(customGroupsByArea).length > 0 && (
              <section className="list-section">
                <h2 className="section-title">Custom Groups (in Default Areas)</h2>
                {Object.entries(customGroupsByArea).map(([areaName, groups]) => (
                  <div key={areaName} className="default-area-additions">
                    <h3 className="area-name-header">{areaName}</h3>
                    {groups.map(group => (
                      <div key={group.name} className="group-item">
                        <div className="group-header-row">
                          <span className="group-name">{group.name}</span>
                          <span className="group-count">({group.traits.length} traits)</span>
                          <button
                            className="action-btn delete small"
                            onClick={() => setDeleteConfirm({ type: 'group', area: areaName, group: group.name })}
                            title="Delete group"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            </svg>
                          </button>
                        </div>
                        {group.traits.length > 0 && (
                          <div className="traits-list">
                            {group.traits.map(trait => (
                              <div key={trait.field} className="trait-item">
                                <div className="trait-info">
                                  <span className="trait-label">{trait.label}</span>
                                  <span className="trait-field">{trait.field}</span>
                                </div>
                                <div className="trait-actions">
                                  <span className="trait-type">{trait.type}</span>
                                  <button
                                    className="action-btn edit"
                                    onClick={() => handleEditTrait(areaName, group.name, trait.field)}
                                    title="Edit trait"
                                  >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                    </svg>
                                  </button>
                                  <button
                                    className="action-btn delete"
                                    onClick={() => setDeleteConfirm({ type: 'trait', area: areaName, group: group.name, field: trait.field })}
                                    title="Delete trait"
                                  >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                      <polyline points="3 6 5 6 21 6" />
                                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </section>
            )}

            {/* Custom Traits added to default groups */}
            {Object.keys(customTraitsByGroup).length > 0 && (
              <section className="list-section">
                <h2 className="section-title">Custom Traits (in Default Groups)</h2>
                {Object.entries(customTraitsByGroup).map(([key, traits]) => {
                  const [areaName, groupName] = key.split('::');
                  return (
                    <div key={key} className="default-group-additions">
                      <h3 className="location-header">
                        <span className="area-part">{areaName}</span>
                        <span className="separator">›</span>
                        <span className="group-part">{groupName}</span>
                      </h3>
                      <div className="traits-list">
                        {traits.map(trait => (
                          <div key={trait.field} className="trait-item">
                            <div className="trait-info">
                              <span className="trait-label">{trait.label}</span>
                              <span className="trait-field">{trait.field}</span>
                            </div>
                            <div className="trait-actions">
                              <span className="trait-type">{trait.type}</span>
                              <button
                                className="action-btn edit"
                                onClick={() => handleEditTrait(areaName, groupName, trait.field)}
                                title="Edit trait"
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                </svg>
                              </button>
                              <button
                                className="action-btn delete"
                                onClick={() => setDeleteConfirm({ type: 'trait', area: areaName, group: groupName, field: trait.field })}
                                title="Delete trait"
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <polyline points="3 6 5 6 21 6" />
                                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </section>
            )}
          </div>
        )}

        {/* Add buttons */}
        <div className="add-actions">
          <button className="add-btn" onClick={() => onNavigate('add-custom-trait')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Custom Trait
          </button>
        </div>
      </div>

      {/* Delete confirmation modal */}
      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Confirm Delete</h3>
            <p>
              Are you sure you want to delete this {deleteConfirm.type}?
              {deleteConfirm.type === 'area' && ' All groups and traits within it will also be deleted.'}
              {deleteConfirm.type === 'group' && ' All traits within it will also be deleted.'}
            </p>
            <div className="modal-actions">
              <button className="modal-btn cancel" onClick={() => setDeleteConfirm(null)}>
                Cancel
              </button>
              <button className="modal-btn delete" onClick={handleDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomTraitListPage;
