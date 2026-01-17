import { useState, useMemo } from 'react';
import type { Page } from '../types';
import type { SeedlingData } from './AddSeedlingPage';
import { mockInventoryData, type MockVariety } from '../data/mockInventory';
import './ContinueSeedlingPage.css';

interface ObservationContext {
  plantType: 'variety' | 'seedling';
  plantId: string;
  plantData: SeedlingData;
}

interface ContinueSeedlingPageProps {
  onNavigate: (page: Page) => void;
  seedlings: SeedlingData[];
  onNavigateWithContext: (page: Page, context: ObservationContext) => void;
}

// Convert MockVariety (seedling type) to SeedlingData format
function convertMockToSeedlingData(mock: MockVariety): SeedlingData {
  const observationData = mock.observationData || {};
  return {
    id: `mock-${mock.seedlingNum?.replace(/\s+/g, '-').toLowerCase() || mock.name.replace(/\s+/g, '-').toLowerCase()}`,
    seedlingNumber: mock.seedlingNum || observationData.seedling_number || mock.name,
    year: mock.year || observationData.first_year_on_record || new Date().getFullYear(),
    podParent: observationData.pod_parent || '',
    pollenParent: observationData.pollen_parent || '',
    crossId: 'mock',
    location: mock.locationInGarden || observationData.location || '',
    nickname: observationData.nickname || '',
    photos: [],
    dateAdded: mock.acquisitionDate || ''
  };
}

function ContinueSeedlingPage({ onNavigate, seedlings, onNavigateWithContext }: ContinueSeedlingPageProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Combine mock inventory seedlings with user-added seedlings
  const allSeedlings = useMemo(() => {
    // Filter mock inventory for seedlings only (type === 'Seedling')
    const mockSeedlings = mockInventoryData
      .filter(m => m.observationData?.type === 'Seedling')
      .map(convertMockToSeedlingData);

    // Combine with user-added seedlings, user-added first
    return [...seedlings, ...mockSeedlings];
  }, [seedlings]);

  const filteredSeedlings = allSeedlings.filter(s => {
    if (!searchQuery.trim()) return true;
    const lowerQuery = searchQuery.toLowerCase();
    return (
      s.seedlingNumber.toLowerCase().includes(lowerQuery) ||
      s.podParent?.toLowerCase().includes(lowerQuery) ||
      s.pollenParent?.toLowerCase().includes(lowerQuery) ||
      s.nickname?.toLowerCase().includes(lowerQuery) ||
      s.location?.toLowerCase().includes(lowerQuery)
    );
  });

  const handleSelectSeedling = (seedling: SeedlingData) => {
    onNavigateWithContext('trait-observation', {
      plantType: 'seedling',
      plantId: seedling.id,
      plantData: seedling
    });
  };

  return (
    <div className="continue-seedling-page">
      <div className="page-header">
        <button className="back-btn" onClick={() => onNavigate('home')}>
          <span className="back-icon">←</span>
        </button>
        <h1>Continue Seedling Observation</h1>
        <div className="header-spacer"></div>
      </div>

      <div className="page-content">
        <div className="step-content">
          {allSeedlings.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🌱</div>
              <h2>No Seedlings Available</h2>
              <p>No seedlings found in inventory. Add a seedling first to continue observations.</p>
              <button className="add-btn" onClick={() => onNavigate('add-seedling')}>
                Add New Seedling
              </button>
            </div>
          ) : (
            <>
              <div className="search-section">
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search seedlings..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  autoFocus
                />
              </div>

              <div className="results-label">
                Select a seedling ({filteredSeedlings.length} available):
              </div>

              <div className="seedlings-list">
                {filteredSeedlings.map(seedling => (
                  <button
                    key={seedling.id}
                    className="seedling-item"
                    onClick={() => handleSelectSeedling(seedling)}
                  >
                    <div className="seedling-info">
                      <span className="seedling-number">
                        {seedling.seedlingNumber}
                        {seedling.nickname && <span className="seedling-nickname"> "{seedling.nickname}"</span>}
                      </span>
                      <span className="seedling-meta">
                        {seedling.podParent && seedling.pollenParent
                          ? `${seedling.podParent} × ${seedling.pollenParent}`
                          : 'Cross info not available'}
                        {seedling.location && ` • ${seedling.location}`}
                      </span>
                    </div>
                    <span className="seedling-arrow">→</span>
                  </button>
                ))}
              </div>

              {filteredSeedlings.length === 0 && searchQuery && (
                <div className="no-results">
                  <p>No seedlings found matching "{searchQuery}"</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ContinueSeedlingPage;
