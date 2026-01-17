import { useState, useMemo } from 'react';
import type { Page } from '../types';
import type { VarietyData } from './AddVarietyPage';
import { mockInventoryData, type MockVariety } from '../data/mockInventory';
import './ContinueVarietyPage.css';

interface ObservationContext {
  plantType: 'variety' | 'seedling';
  plantId: string;
  plantData: VarietyData;
}

interface ContinueVarietyPageProps {
  onNavigate: (page: Page) => void;
  varieties: VarietyData[];
  onNavigateWithContext: (page: Page, context: ObservationContext) => void;
}

// Convert MockVariety to VarietyData format
function convertMockToVarietyData(mock: MockVariety): VarietyData {
  return {
    id: `mock-${mock.name.replace(/\s+/g, '-').toLowerCase()}`,
    name: mock.name,
    hybridizer: mock.hybridizer,
    year: mock.year,
    scape_height: mock.scapeHeight,
    bloom_size: mock.bloomSize,
    bloom_season: mock.bloomSeason || '',
    ploidy: mock.ploidy || '',
    foliage_type: mock.foliageType || '',
    bloom_habit: mock.bloomHabit || '',
    bud_count: mock.budCount,
    branches: mock.branches,
    seedling_num: mock.seedlingNum || '',
    color_description: mock.colorDescription || '',
    parentage: mock.parentage || '',
    image_url: '',
    fragrance: mock.fragrance || '',
    form: mock.form || '',
    awards: mock.awards || '',
    sculpting: '',
    notes: mock.notes || '',
    rebloom: mock.rebloom,
    region: '',
    city: '',
    state: '',
    country: '',
    location: mock.locationInGarden || '',
    photos: [],
    dateAdded: mock.acquisitionDate || ''
  };
}

function ContinueVarietyPage({ onNavigate, varieties, onNavigateWithContext }: ContinueVarietyPageProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Combine mock inventory varieties with user-added varieties
  const allVarieties = useMemo(() => {
    // Filter mock inventory for varieties only (exclude seedlings)
    const mockVarieties = mockInventoryData
      .filter(m => m.observationData?.type !== 'Seedling')
      .map(convertMockToVarietyData);

    // Combine with user-added varieties, user-added first
    return [...varieties, ...mockVarieties];
  }, [varieties]);

  const filteredVarieties = allVarieties.filter(v => {
    if (!searchQuery.trim()) return true;
    const lowerQuery = searchQuery.toLowerCase();
    return (
      v.name.toLowerCase().includes(lowerQuery) ||
      v.hybridizer?.toLowerCase().includes(lowerQuery) ||
      v.location?.toLowerCase().includes(lowerQuery)
    );
  });

  const handleSelectVariety = (variety: VarietyData) => {
    onNavigateWithContext('trait-observation', {
      plantType: 'variety',
      plantId: variety.id,
      plantData: variety
    });
  };

  return (
    <div className="continue-variety-page">
      <div className="page-header">
        <button className="back-btn" onClick={() => onNavigate('home')}>
          <span className="back-icon">←</span>
        </button>
        <h1>Continue Variety Observation</h1>
        <div className="header-spacer"></div>
      </div>

      <div className="page-content">
        <div className="step-content">
          <div className="search-section">
            <input
              type="text"
              className="search-input"
              placeholder="Search varieties..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              autoFocus
            />
          </div>

          <div className="results-label">
            Select a variety ({filteredVarieties.length} available):
          </div>

          <div className="varieties-list">
            {filteredVarieties.map(variety => (
              <button
                key={variety.id}
                className="variety-item"
                onClick={() => handleSelectVariety(variety)}
              >
                <div className="variety-info">
                  <span className="variety-name">{variety.name}</span>
                  <span className="variety-meta">
                    {variety.hybridizer && `${variety.hybridizer} `}
                    {variety.year && `(${variety.year})`}
                    {variety.location && ` • ${variety.location}`}
                  </span>
                </div>
                <span className="variety-arrow">→</span>
              </button>
            ))}
          </div>

          {filteredVarieties.length === 0 && searchQuery && (
            <div className="no-results">
              <p>No varieties found matching "{searchQuery}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ContinueVarietyPage;
