import { useState, useMemo } from 'react';
import { traitData } from '../data/traitData';
import type { Trait } from '../data/traitData';
import TraitField from '../components/TraitField';
import type { VarietyData } from './AddVarietyPage';
import type { SeedlingData } from './AddSeedlingPage';
import './TraitObservationPage.css';

type Page = 'home' | 'trait-fields' | 'observation-cycles' | 'inventory' | 'add-note' | 'add-plant' | 'add-variety' | 'add-seedling' | 'add-seedling-group' | 'continue-seedling-group' | 'continue-observation' | 'trait-observation';

interface TraitObservationPageProps {
  plantType: 'variety' | 'seedling';
  plantId: string;
  plantData: VarietyData | SeedlingData;
  onNavigate: (page: Page) => void;
  onSave: (observations: Record<string, any>) => void;
}

function getCurrentSeason(): string {
  const month = new Date().getMonth();
  if (month >= 2 && month <= 4) return 'Spring';   // Mar-May
  if (month >= 5 && month <= 8) return 'Summer';   // Jun-Sep
  if (month >= 9 && month <= 10) return 'Fall';    // Oct-Nov
  return 'Winter';
}

export default function TraitObservationPage({
  plantType,
  plantId,
  plantData,
  onNavigate,
  onSave
}: TraitObservationPageProps) {
  const [showAllTraits, setShowAllTraits] = useState(false);
  const [expandedAreas, setExpandedAreas] = useState<Set<string>>(new Set(traitData.map(a => a.name)));
  // Initialize all groups as expanded
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(() => {
    const allGroupKeys = new Set<string>();
    traitData.forEach(area => {
      area.groups.forEach(group => {
        allGroupKeys.add(`${area.name}-${group.name}`);
      });
    });
    return allGroupKeys;
  });
  const [observations, setObservations] = useState<Record<string, any>>({});

  const currentSeason = getCurrentSeason();

  // Filter traits based on seasonality toggle
  const filterTraits = (traits: Trait[]): Trait[] => {
    if (showAllTraits) {
      // Show all except excludeFromAutomaticCycle
      return traits.filter(t => !t.defaultTiming?.excludeFromAutomaticCycle);
    }
    // Show only current season traits
    return traits.filter(t => {
      if (t.defaultTiming?.excludeFromAutomaticCycle) return false;
      if (!t.defaultTiming?.season) return false;
      return t.defaultTiming.season === currentSeason;
    });
  };

  // Filter areas and groups to only show those with visible traits
  const filteredAreas = useMemo(() => {
    return traitData
      .filter(area => area.name !== '1. Basic Identifiers') // Exclude basic identifiers (shown in header)
      .map(area => ({
        ...area,
        groups: area.groups.map(group => ({
          ...group,
          traits: filterTraits(group.traits)
        })).filter(group => group.traits.length > 0)
      }))
      .filter(area => area.groups.length > 0);
  }, [showAllTraits, currentSeason]);

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

  const handleFieldChange = (field: string, value: any) => {
    setObservations(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    onSave({
      plantId,
      plantType,
      observations,
      observationDate: new Date().toISOString(),
      season: currentSeason
    });
    onNavigate('home');
  };

  // Get identity display based on plant type
  const getIdentityDisplay = () => {
    if (plantType === 'variety') {
      const variety = plantData as VarietyData;
      return {
        title: variety.name,
        subtitle: [
          variety.hybridizer,
          variety.year ? `(${variety.year})` : null,
          variety.ploidy
        ].filter(Boolean).join(' • '),
        location: variety.location
      };
    } else {
      const seedling = plantData as SeedlingData;
      return {
        title: seedling.seedlingNumber,
        subtitle: [
          seedling.nickname ? `"${seedling.nickname}"` : null,
          `${seedling.podParent} × ${seedling.pollenParent}`
        ].filter(Boolean).join(' • '),
        location: seedling.location
      };
    }
  };

  const identity = getIdentityDisplay();
  const totalVisibleTraits = filteredAreas.reduce(
    (sum, area) => sum + area.groups.reduce((gSum, g) => gSum + g.traits.length, 0),
    0
  );

  return (
    <div className="trait-observation-page">
      {/* Header */}
      <div className="observation-header">
        <button className="back-btn" onClick={() => onNavigate('home')}>
          ←
        </button>
        <h1 className="observation-title">Trait Observations</h1>
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

      {/* Identity Card */}
      <div className="identity-card">
        <div className="identity-type">{plantType === 'variety' ? 'Variety' : 'Seedling'}</div>
        <div className="identity-title">{identity.title}</div>
        {identity.subtitle && <div className="identity-subtitle">{identity.subtitle}</div>}
        {identity.location && <div className="identity-location">{identity.location}</div>}
      </div>

      {/* Trait count info */}
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
                                value={observations[trait.field]}
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

      {/* Footer */}
      <div className="observation-footer">
        <button className="save-btn" onClick={handleSave}>
          Save Observations
        </button>
      </div>
    </div>
  );
}
