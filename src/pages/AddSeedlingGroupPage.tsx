import { useState, useEffect, useMemo } from 'react';
import { mockInventoryData } from '../data/mockInventory';
import { useTraitData } from '../contexts/TraitDataContext';
import type { MergedTrait } from '../utils/traitMerger';
import TraitField from '../components/TraitField';
import type { Page, PlantLocation } from '../types';
import { useLocationConfig } from '../hooks/useLocationConfig';
import LocationSelector from '../components/LocationSelector';
import './AddSeedlingGroupPage.css';

interface AddSeedlingGroupPageProps {
  onNavigate: (page: Page) => void;
  onSaveSeedlingGroup: (seedlings: SeedlingGroupData[]) => void;
}

export interface SeedlingGroupData {
  id: string;
  seedlingNumber: string;
  year: number;
  podParent: string;
  pollenParent: string;
  crossId: string;
  location: string;
  photos: File[];
  observations: Record<string, any>;
  dateAdded: string;
}

interface Cross {
  id: string;
  podParent: string;
  pollenParent: string;
  year: number;
  label: string;
}

type Step = 'cross' | 'year' | 'location' | 'count' | 'observation';

// Mock crosses - in production this would come from the database
const getMockCrosses = (year: number): Cross[] => {
  const crosses: Cross[] = [];
  const plants = mockInventoryData.filter(p => p.observationData?.pod_fertility || p.observationData?.pollen_fertility);

  if (plants.length >= 2) {
    crosses.push({
      id: `${year}-001`,
      podParent: plants[0].name,
      pollenParent: plants[1].name,
      year,
      label: `${plants[0].name} × ${plants[1].name}`
    });
    if (plants.length >= 4) {
      crosses.push({
        id: `${year}-002`,
        podParent: plants[2].name,
        pollenParent: plants[3].name,
        year,
        label: `${plants[2].name} × ${plants[3].name}`
      });
    }
  }
  return crosses;
};

function getCurrentSeason(): string {
  const month = new Date().getMonth();
  if (month >= 2 && month <= 4) return 'Spring';
  if (month >= 5 && month <= 8) return 'Summer';
  if (month >= 9 && month <= 10) return 'Fall';
  return 'Winter';
}

export default function AddSeedlingGroupPage({ onNavigate, onSaveSeedlingGroup }: AddSeedlingGroupPageProps) {
  const { mergedTraitData } = useTraitData();
  const currentYear = new Date().getFullYear();
  const currentSeason = getCurrentSeason();

  // Step management
  const [step, setStep] = useState<Step>('cross');

  // Cross selection
  const [crosses, setCrosses] = useState<Cross[]>([]);
  const [selectedCross, setSelectedCross] = useState<Cross | null>(null);
  const [isManualCross, setIsManualCross] = useState(false);
  const [podParent, setPodParent] = useState('');
  const [pollenParent, setPollenParent] = useState('');

  // Year selection
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [isManualYear, setIsManualYear] = useState(false);
  const [manualYear, setManualYear] = useState('');

  // Location
  const [plantLocation, setPlantLocation] = useState<PlantLocation>({});
  const { formatLocationShort } = useLocationConfig();

  // Seedling count
  const [seedlingCount, setSeedlingCount] = useState<number>(1);

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

  // Load crosses when year changes
  useEffect(() => {
    setCrosses(getMockCrosses(selectedYear));
  }, [selectedYear]);

  // Generate seedling number
  const generateSeedlingNumber = (index: number): string => {
    const shortYear = selectedYear.toString().slice(-2);
    const crossCode = selectedCross?.id.split('-')[1] || 'NEW';
    return `${shortYear}-${crossCode}-${String(index + 1).padStart(3, '0')}`;
  };

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

  // Handlers
  const handleCrossSelect = (cross: Cross) => {
    setSelectedCross(cross);
    setIsManualCross(false);
    setPodParent(cross.podParent);
    setPollenParent(cross.pollenParent);
  };

  const handleManualCross = () => {
    setSelectedCross(null);
    setIsManualCross(true);
  };

  const handleYearSelect = (year: number) => {
    setSelectedYear(year);
    setIsManualYear(false);
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

  // Save current seedling and move to next/previous
  const saveCurrentSeedling = (): SeedlingGroupData => {
    const locationString = formatLocationShort(plantLocation);
    return {
      id: crypto.randomUUID(),
      seedlingNumber: generateSeedlingNumber(currentSeedlingIndex),
      year: selectedYear,
      podParent: selectedCross?.podParent || podParent,
      pollenParent: selectedCross?.pollenParent || pollenParent,
      crossId: selectedCross?.id || 'manual',
      location: locationString,
      photos: currentPhotos,
      observations: currentObservations,
      dateAdded: new Date().toISOString()
    };
  };

  const handleSaveAndNext = () => {
    const seedlingData = saveCurrentSeedling();

    // Update or add seedling data
    const newSeedlingsData = [...seedlingsData];
    newSeedlingsData[currentSeedlingIndex] = seedlingData;
    setSeedlingsData(newSeedlingsData);

    if (currentSeedlingIndex < seedlingCount - 1) {
      // Move to next seedling
      setCurrentSeedlingIndex(currentSeedlingIndex + 1);
      // Load existing data if going back to a previously entered seedling
      const nextSeedling = newSeedlingsData[currentSeedlingIndex + 1];
      if (nextSeedling) {
        setCurrentObservations(nextSeedling.observations);
        setCurrentPhotos(nextSeedling.photos);
      } else {
        setCurrentObservations({});
        setCurrentPhotos([]);
      }
      // Scroll to top of page
      window.scrollTo(0, 0);
    }
  };

  const handleSaveAndPrevious = () => {
    const seedlingData = saveCurrentSeedling();

    const newSeedlingsData = [...seedlingsData];
    newSeedlingsData[currentSeedlingIndex] = seedlingData;
    setSeedlingsData(newSeedlingsData);

    if (currentSeedlingIndex > 0) {
      setCurrentSeedlingIndex(currentSeedlingIndex - 1);
      const prevSeedling = newSeedlingsData[currentSeedlingIndex - 1];
      if (prevSeedling) {
        setCurrentObservations(prevSeedling.observations);
        setCurrentPhotos(prevSeedling.photos);
      }
    }
  };

  const handleAddAnotherSeedling = () => {
    // Save current first
    const seedlingData = saveCurrentSeedling();
    const newSeedlingsData = [...seedlingsData];
    newSeedlingsData[currentSeedlingIndex] = seedlingData;

    // Increase count and move to new seedling
    setSeedlingCount(seedlingCount + 1);
    setCurrentSeedlingIndex(seedlingCount);
    setSeedlingsData(newSeedlingsData);
    setCurrentObservations({});
    setCurrentPhotos([]);
    // Scroll to top of page
    window.scrollTo(0, 0);
  };

  const handleFinishGroup = () => {
    const seedlingData = saveCurrentSeedling();
    const finalSeedlingsData = [...seedlingsData];
    finalSeedlingsData[currentSeedlingIndex] = seedlingData;

    onSaveSeedlingGroup(finalSeedlingsData.filter(Boolean));
    onNavigate('home');
  };

  const handleBack = () => {
    if (step === 'cross') {
      onNavigate('add-plant');
    } else if (step === 'year') {
      setStep('cross');
    } else if (step === 'location') {
      setStep('year');
    } else if (step === 'count') {
      setStep('location');
    } else if (step === 'observation') {
      setStep('count');
    }
  };

  const handleNext = () => {
    if (step === 'cross' && (selectedCross || (isManualCross && podParent && pollenParent))) {
      setStep('year');
    } else if (step === 'year') {
      setStep('location');
    } else if (step === 'location') {
      setStep('count');
    } else if (step === 'count' && seedlingCount > 0) {
      setStep('observation');
    }
  };

  const isLastSeedling = currentSeedlingIndex === seedlingCount - 1;

  return (
    <div className="add-seedling-group-page">
      {/* Header */}
      <div className="page-header">
        <button className="back-btn" onClick={handleBack}>
          <span className="back-icon">←</span>
        </button>
        <h1>Add Seedling Group</h1>
        <div className="header-spacer"></div>
      </div>

      <div className="page-content">
        {/* Step 1: Cross Selection */}
        {step === 'cross' && (
          <div className="step-content">
            <div className="step-label">Select or Create Cross</div>

            <div className="crosses-list">
              {crosses.map(cross => (
                <button
                  key={cross.id}
                  className={`cross-btn ${selectedCross?.id === cross.id ? 'active' : ''}`}
                  onClick={() => handleCrossSelect(cross)}
                >
                  <span className="cross-label">{cross.label}</span>
                  <span className="cross-id">{cross.id}</span>
                </button>
              ))}

              <button
                className={`cross-btn manual ${isManualCross ? 'active' : ''}`}
                onClick={handleManualCross}
              >
                <span className="cross-label">+ New Cross</span>
              </button>
            </div>

            {isManualCross && (
              <div className="manual-cross-inputs">
                <div className="form-section">
                  <label className="form-label">Pod Parent</label>
                  <input
                    type="text"
                    className="form-input"
                    value={podParent}
                    onChange={e => setPodParent(e.target.value)}
                    placeholder="Enter pod parent name"
                  />
                </div>
                <div className="form-section">
                  <label className="form-label">Pollen Parent</label>
                  <input
                    type="text"
                    className="form-input"
                    value={pollenParent}
                    onChange={e => setPollenParent(e.target.value)}
                    placeholder="Enter pollen parent name"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Year Selection */}
        {step === 'year' && (
          <div className="step-content">
            <p className="step-description">
              Select the year these seedlings were germinated.
            </p>

            <div className="year-options">
              {[currentYear, currentYear - 1, currentYear - 2, currentYear - 3].map(year => (
                <button
                  key={year}
                  className={`year-btn ${selectedYear === year && !isManualYear ? 'active' : ''}`}
                  onClick={() => handleYearSelect(year)}
                >
                  {year}
                  {year === currentYear && <span className="year-badge">Current</span>}
                </button>
              ))}

              <button
                className={`year-btn other-year ${isManualYear ? 'active' : ''}`}
                onClick={() => setIsManualYear(true)}
              >
                Other Year
              </button>
            </div>

            {isManualYear && (
              <div className="manual-year-input">
                <label className="form-label">Enter Year</label>
                <input
                  type="number"
                  className="form-input"
                  value={manualYear || selectedYear}
                  onChange={e => {
                    setManualYear(e.target.value);
                    if (e.target.value) {
                      setSelectedYear(parseInt(e.target.value));
                    }
                  }}
                  min="1990"
                  max={currentYear}
                  autoFocus
                />
              </div>
            )}
          </div>
        )}

        {/* Step 3: Location */}
        {step === 'location' && (
          <div className="step-content">
            <div className="step-label">Enter Location</div>
            <p className="step-hint">Where are these seedlings planted?</p>

            <LocationSelector
              value={plantLocation}
              onChange={setPlantLocation}
            />
          </div>
        )}

        {/* Step 4: Seedling Count */}
        {step === 'count' && (
          <div className="step-content">
            <div className="step-label">Number of Seedlings</div>
            <p className="step-hint">How many seedlings are in this group?</p>

            <div className="count-input-wrapper">
              <button
                className="count-btn"
                onClick={() => setSeedlingCount(Math.max(1, seedlingCount - 1))}
              >
                −
              </button>
              <input
                type="number"
                className="count-input"
                value={seedlingCount}
                onChange={e => setSeedlingCount(Math.max(1, parseInt(e.target.value) || 1))}
                min="1"
              />
              <button
                className="count-btn"
                onClick={() => setSeedlingCount(seedlingCount + 1)}
              >
                +
              </button>
            </div>

            <div className="count-preview">
              Will create seedlings: {generateSeedlingNumber(0)} through {generateSeedlingNumber(seedlingCount - 1)}
            </div>
          </div>
        )}

        {/* Step 5: Observation Entry */}
        {step === 'observation' && (
          <div className="observation-step">
            {/* Seedling Header */}
            <div className="seedling-header">
              <div className="seedling-progress">
                Seedling {currentSeedlingIndex + 1} of {seedlingCount}
              </div>
              <div className="seedling-number">{generateSeedlingNumber(currentSeedlingIndex)}</div>
              <div className="seedling-cross">
                {selectedCross?.label || `${podParent} × ${pollenParent}`}
              </div>
              {formatLocationShort(plantLocation) && <div className="seedling-location">{formatLocationShort(plantLocation)}</div>}
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
                <button
                  className="nav-btn prev-btn"
                  onClick={handleAddAnotherSeedling}
                >
                  + Add Additional Seedling
                </button>
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

      {/* Footer Navigation for setup steps */}
      {step !== 'observation' && (
        <div className="page-footer">
          <button className="cancel-btn" onClick={() => onNavigate('add-plant')}>
            Cancel
          </button>
          <button
            className="next-btn"
            onClick={handleNext}
            disabled={
              (step === 'cross' && !selectedCross && !(isManualCross && podParent && pollenParent)) ||
              (step === 'count' && seedlingCount < 1)
            }
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
