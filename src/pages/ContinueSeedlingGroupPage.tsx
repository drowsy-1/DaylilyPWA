import { useState, useMemo } from 'react';
import { useTraitData } from '../contexts/TraitDataContext';
import type { MergedTrait } from '../utils/traitMerger';
import TraitField from '../components/TraitField';
import type { Page } from '../types';
import type { SeedlingGroupData } from './AddSeedlingGroupPage';
import './ContinueSeedlingGroupPage.css';

interface ContinueSeedlingGroupPageProps {
  onNavigate: (page: Page) => void;
  seedlingGroups: SeedlingGroupData[];
  onUpdateSeedlingGroup: (updatedSeedlings: SeedlingGroupData[]) => void;
}

interface GroupedSeedlings {
  crossId: string;
  crossLabel: string;
  year: number;
  location: string;
  seedlings: SeedlingGroupData[];
}

function getCurrentSeason(): string {
  const month = new Date().getMonth();
  if (month >= 2 && month <= 4) return 'Spring';
  if (month >= 5 && month <= 8) return 'Summer';
  if (month >= 9 && month <= 10) return 'Fall';
  return 'Winter';
}

function ContinueSeedlingGroupPage({ onNavigate, seedlingGroups, onUpdateSeedlingGroup }: ContinueSeedlingGroupPageProps) {
  const { mergedTraitData } = useTraitData();
  const currentSeason = getCurrentSeason();

  // Step management
  const [step, setStep] = useState<'select' | 'observation'>('select');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected group (used for setting up seedlings data when entering observation mode)
  const [, setSelectedGroup] = useState<GroupedSeedlings | null>(null);

  // Observation tracking
  const [currentSeedlingIndex, setCurrentSeedlingIndex] = useState(0);
  const [seedlingsData, setSeedlingsData] = useState<SeedlingGroupData[]>([]);
  const [currentObservations, setCurrentObservations] = useState<Record<string, any>>({});
  const [currentPhotos, setCurrentPhotos] = useState<File[]>([]);

  // Seasonality toggle
  const [showAllTraits, setShowAllTraits] = useState(false);

  // Expansion state for trait areas/groups
  const [expandedAreas, setExpandedAreas] = useState<Set<string>>(() => new Set(mergedTraitData.map(a => a.name)));
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(() => {
    const allGroupKeys = new Set<string>();
    mergedTraitData.forEach(area => {
      area.groups.forEach(group => {
        allGroupKeys.add(`${area.name}-${group.name}`);
      });
    });
    return allGroupKeys;
  });

  // Group seedlings by cross
  const groupedSeedlings = useMemo(() => {
    const groups: Map<string, GroupedSeedlings> = new Map();

    seedlingGroups.forEach(seedling => {
      const key = `${seedling.crossId}-${seedling.year}`;
      if (!groups.has(key)) {
        groups.set(key, {
          crossId: seedling.crossId,
          crossLabel: `${seedling.podParent} × ${seedling.pollenParent}`,
          year: seedling.year,
          location: seedling.location,
          seedlings: []
        });
      }
      groups.get(key)!.seedlings.push(seedling);
    });

    return Array.from(groups.values());
  }, [seedlingGroups]);

  // Filter groups based on search
  const filteredGroups = groupedSeedlings.filter(group => {
    if (!searchQuery.trim()) return true;
    const lowerQuery = searchQuery.toLowerCase();
    return (
      group.crossLabel.toLowerCase().includes(lowerQuery) ||
      group.location?.toLowerCase().includes(lowerQuery) ||
      group.year.toString().includes(lowerQuery)
    );
  });

  // Filter traits based on seasonality
  const filterTraits = (traits: MergedTrait[]): MergedTrait[] => {
    if (showAllTraits) {
      return traits.filter(t => !t.defaultTiming?.excludeFromAutomaticCycle);
    }
    return traits.filter(t => {
      if (t.defaultTiming?.excludeFromAutomaticCycle) return false;
      if (!t.defaultTiming?.season) return false;
      return t.defaultTiming.season === currentSeason;
    });
  };

  // Filtered areas for observation form
  const filteredAreas = useMemo(() => {
    return mergedTraitData
      .filter(area => area.name !== '1. Basic Identifiers')
      .map(area => ({
        ...area,
        groups: area.groups.map(group => ({
          ...group,
          traits: filterTraits(group.traits)
        })).filter(group => group.traits.length > 0)
      }))
      .filter(area => area.groups.length > 0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showAllTraits, currentSeason, mergedTraitData]);

  const totalVisibleTraits = filteredAreas.reduce(
    (sum, area) => sum + area.groups.reduce((gSum, g) => gSum + g.traits.length, 0),
    0
  );

  const handleSelectGroup = (group: GroupedSeedlings) => {
    setSelectedGroup(group);
    setSeedlingsData([...group.seedlings]);
    setCurrentSeedlingIndex(0);
    setCurrentObservations(group.seedlings[0]?.observations || {});
    setCurrentPhotos(group.seedlings[0]?.photos || []);
    setStep('observation');
  };

  const handleFieldChange = (field: string, value: any) => {
    setCurrentObservations(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setCurrentPhotos([...currentPhotos, ...Array.from(e.target.files)]);
    }
  };

  const handleRemovePhoto = (index: number) => {
    setCurrentPhotos(currentPhotos.filter((_, i) => i !== index));
  };

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

  // Save current seedling observations
  const saveCurrentSeedling = (): SeedlingGroupData => {
    const currentSeedling = seedlingsData[currentSeedlingIndex];
    return {
      ...currentSeedling,
      photos: currentPhotos,
      observations: {
        ...currentSeedling.observations,
        ...currentObservations
      }
    };
  };

  const handleSaveAndNext = () => {
    const updatedSeedling = saveCurrentSeedling();
    const newSeedlingsData = [...seedlingsData];
    newSeedlingsData[currentSeedlingIndex] = updatedSeedling;
    setSeedlingsData(newSeedlingsData);

    if (currentSeedlingIndex < seedlingsData.length - 1) {
      const nextIndex = currentSeedlingIndex + 1;
      setCurrentSeedlingIndex(nextIndex);
      setCurrentObservations(newSeedlingsData[nextIndex]?.observations || {});
      setCurrentPhotos(newSeedlingsData[nextIndex]?.photos || []);
      window.scrollTo(0, 0);
    }
  };

  const handleSaveAndPrevious = () => {
    const updatedSeedling = saveCurrentSeedling();
    const newSeedlingsData = [...seedlingsData];
    newSeedlingsData[currentSeedlingIndex] = updatedSeedling;
    setSeedlingsData(newSeedlingsData);

    if (currentSeedlingIndex > 0) {
      const prevIndex = currentSeedlingIndex - 1;
      setCurrentSeedlingIndex(prevIndex);
      setCurrentObservations(newSeedlingsData[prevIndex]?.observations || {});
      setCurrentPhotos(newSeedlingsData[prevIndex]?.photos || []);
      window.scrollTo(0, 0);
    }
  };

  const handleFinishGroup = () => {
    const updatedSeedling = saveCurrentSeedling();
    const finalSeedlingsData = [...seedlingsData];
    finalSeedlingsData[currentSeedlingIndex] = updatedSeedling;

    onUpdateSeedlingGroup(finalSeedlingsData);
    onNavigate('home');
  };

  const handleBack = () => {
    if (step === 'observation') {
      setStep('select');
      setSelectedGroup(null);
      setSeedlingsData([]);
      setCurrentSeedlingIndex(0);
      setCurrentObservations({});
      setCurrentPhotos([]);
    } else {
      onNavigate('home');
    }
  };

  const isLastSeedling = currentSeedlingIndex === seedlingsData.length - 1;
  const currentSeedling = seedlingsData[currentSeedlingIndex];

  return (
    <div className="continue-seedling-group-page">
      <div className="page-header">
        <button className="back-btn" onClick={handleBack}>
          <span className="back-icon">←</span>
        </button>
        <h1>{step === 'select' ? 'Continue Seedling Group' : 'Observe Seedlings'}</h1>
        <div className="header-spacer"></div>
      </div>

      <div className="page-content">
        {/* Step 1: Select Group */}
        {step === 'select' && (
          <div className="step-content">
            {groupedSeedlings.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🌱</div>
                <h2>No Seedling Groups Added</h2>
                <p>You haven't added any seedling groups yet. Add a seedling group first to continue observations.</p>
                <button className="add-btn" onClick={() => onNavigate('add-seedling-group')}>
                  Add New Seedling Group
                </button>
              </div>
            ) : (
              <>
                <div className="search-section">
                  <input
                    type="text"
                    className="search-input"
                    placeholder="Search seedling groups..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    autoFocus
                  />
                </div>

                <div className="results-label">
                  Select a group ({filteredGroups.length} available):
                </div>

                <div className="groups-list">
                  {filteredGroups.map((group, index) => (
                    <button
                      key={`${group.crossId}-${group.year}-${index}`}
                      className="group-item"
                      onClick={() => handleSelectGroup(group)}
                    >
                      <div className="group-info">
                        <span className="group-cross">{group.crossLabel}</span>
                        <span className="group-meta">
                          {group.year} • {group.seedlings.length} seedlings
                          {group.location && ` • ${group.location}`}
                        </span>
                      </div>
                      <span className="group-arrow">→</span>
                    </button>
                  ))}
                </div>

                {filteredGroups.length === 0 && searchQuery && (
                  <div className="no-results">
                    <p>No seedling groups found matching "{searchQuery}"</p>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Step 2: Observation Entry */}
        {step === 'observation' && currentSeedling && (
          <div className="observation-step">
            {/* Seedling Header */}
            <div className="seedling-header">
              <div className="seedling-progress">
                Seedling {currentSeedlingIndex + 1} of {seedlingsData.length}
              </div>
              <div className="seedling-number">{currentSeedling.seedlingNumber}</div>
              <div className="seedling-cross">
                {currentSeedling.podParent} × {currentSeedling.pollenParent}
              </div>
              {currentSeedling.location && <div className="seedling-location">{currentSeedling.location}</div>}
            </div>

            {/* Season Toggle */}
            <div className="season-toggle-row">
              <span className="toggle-label">Show traits:</span>
              <div className="season-toggle">
                <button
                  className={`toggle-option ${!showAllTraits ? 'active' : ''}`}
                  onClick={() => setShowAllTraits(false)}
                >
                  {currentSeason}
                </button>
                <button
                  className={`toggle-option ${showAllTraits ? 'active' : ''}`}
                  onClick={() => setShowAllTraits(true)}
                >
                  All
                </button>
              </div>
            </div>

            <div className="trait-info">
              Showing {totalVisibleTraits} {showAllTraits ? 'observable' : currentSeason.toLowerCase()} traits
            </div>

            {/* Trait Areas */}
            <div className="trait-areas">
              {filteredAreas.map((area) => (
                <div key={area.name} className="trait-area">
                  <button
                    className="area-header"
                    onClick={() => toggleArea(area.name)}
                  >
                    <span className="area-expand">{expandedAreas.has(area.name) ? '▼' : '▶'}</span>
                    <span className="area-name">{area.name}</span>
                    <span className="area-count">
                      {area.groups.reduce((sum, g) => sum + g.traits.length, 0)}
                    </span>
                  </button>

                  {expandedAreas.has(area.name) && (
                    <div className="area-content">
                      {area.groups.map((group) => {
                        const groupKey = `${area.name}-${group.name}`;
                        const isGroupExpanded = expandedGroups.has(groupKey);

                        return (
                          <div key={groupKey} className="trait-group">
                            <button
                              className="group-header"
                              onClick={() => toggleGroup(groupKey)}
                            >
                              <span className="group-expand">{isGroupExpanded ? '▼' : '▶'}</span>
                              <span className="group-name">{group.name}</span>
                              <span className="group-count">{group.traits.length}</span>
                            </button>

                            {isGroupExpanded && (
                              <div className="group-content">
                                <div className="traits-grid">
                                  {group.traits.map((trait) => (
                                    <TraitField
                                      key={trait.field}
                                      trait={trait}
                                      value={currentObservations[trait.field]}
                                      onChange={handleFieldChange}
                                    />
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Photo Section */}
            <div className="photo-section">
              <div className="section-label">Photos</div>

              <div className="photo-upload-area">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  capture="environment"
                  id="seedling-photo"
                  className="photo-input"
                  onChange={handlePhotoUpload}
                />
                <label htmlFor="seedling-photo" className="photo-upload-btn">
                  <span className="upload-icon">📷</span>
                  <span>Take Photo</span>
                </label>

                <input
                  type="file"
                  accept="image/*"
                  multiple
                  id="seedling-gallery"
                  className="photo-input"
                  onChange={handlePhotoUpload}
                />
                <label htmlFor="seedling-gallery" className="photo-upload-btn">
                  <span className="upload-icon">📁</span>
                  <span>From Gallery</span>
                </label>
              </div>

              {currentPhotos.length > 0 && (
                <div className="photo-previews">
                  {currentPhotos.map((photo, index) => (
                    <div key={index} className="photo-preview">
                      <img src={URL.createObjectURL(photo)} alt={`Preview ${index + 1}`} />
                      <button className="remove-photo" onClick={() => handleRemovePhoto(index)}>×</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Navigation Footer */}
            <div className="observation-footer">
              <button
                className="nav-btn prev-btn"
                onClick={handleSaveAndPrevious}
                disabled={currentSeedlingIndex === 0}
              >
                ← Save & Previous
              </button>

              {!isLastSeedling ? (
                <button
                  className="nav-btn next-btn"
                  onClick={handleSaveAndNext}
                >
                  Save & Next →
                </button>
              ) : (
                <div className="nav-btn-placeholder"></div>
              )}
            </div>

            <button
              className={`save-exit-btn ${isLastSeedling ? 'primary' : ''}`}
              onClick={handleFinishGroup}
            >
              Save and Exit
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ContinueSeedlingGroupPage;
