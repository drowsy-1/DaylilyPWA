import { useState, useMemo } from 'react';
import './InventoryPage.css';
import { mockInventoryData, type MockVariety } from '../data/mockInventory';
import TabGroup from '../components/TabGroup';

type FilterType = 'all' | 'varieties' | 'seedlings';
type Tab = 'observations' | 'inventory' | 'breeding' | 'store';

interface AdvancedFilters {
  hybridizer: string;
  yearFrom: string;
  yearTo: string;
  firstYearFrom: string;
  firstYearTo: string;
  bloomSizeMin: string;
  bloomSizeMax: string;
  ploidy: string;
  bloomSeasons: string[];
  rebloom: boolean;
  foliageType: string;
  type: string;
}

interface InventoryPageProps {
  onNavigate?: (page: 'home' | 'trait-fields' | 'observation-cycles' | 'inventory') => void;
}

function InventoryPage({ onNavigate }: InventoryPageProps) {
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('inventory');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilters>({
    hybridizer: '',
    yearFrom: '',
    yearTo: '',
    firstYearFrom: '',
    firstYearTo: '',
    bloomSizeMin: '',
    bloomSizeMax: '',
    ploidy: '',
    bloomSeasons: [],
    rebloom: false,
    foliageType: '',
    type: ''
  });

  const handleTabChange = (tab: Tab) => {
    if (tab === 'observations' && onNavigate) {
      onNavigate('home');
    } else {
      setActiveTab(tab);
    }
  };

  const updateAdvancedFilter = (key: keyof AdvancedFilters, value: any) => {
    setAdvancedFilters(prev => {
      const newFilters = {
        ...prev,
        [key]: value
      };
      
      // Clear hybridizer and year filters when selecting seedlings only
      if (key === 'type' && value === 'seedlings') {
        newFilters.hybridizer = '';
        newFilters.yearFrom = '';
        newFilters.yearTo = '';
      }
      
      return newFilters;
    });
  };

  const toggleBloomSeason = (season: string) => {
    setAdvancedFilters(prev => ({
      ...prev,
      bloomSeasons: prev.bloomSeasons.includes(season)
        ? prev.bloomSeasons.filter(s => s !== season)
        : [...prev.bloomSeasons, season]
    }));
  };

  const clearAdvancedFilters = () => {
    setAdvancedFilters({
      hybridizer: '',
      yearFrom: '',
      yearTo: '',
      firstYearFrom: '',
      firstYearTo: '',
      bloomSizeMin: '',
      bloomSizeMax: '',
      ploidy: '',
      bloomSeasons: [],
      rebloom: false,
      foliageType: '',
      type: ''
    });
  };

  const bloomSeasonOptions = [
    'Extra Early', 'Early', 'Early-Midseason', 'Midseason', 
    'Midseason-Late', 'Late', 'Very Late'
  ];

  const filteredInventory = useMemo(() => {
    let filtered = mockInventoryData;

    // Apply type filter
    if (filter === 'varieties') {
      filtered = filtered.filter(item => item.observationData.type === 'Registered Variety');
    } else if (filter === 'seedlings') {
      filtered = filtered.filter(item => item.observationData.type === 'Seedling');
    }

    // Apply basic search filter
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.hybridizer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.seedlingNum && item.seedlingNum.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.observationData.nickname && item.observationData.nickname.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply advanced filters only if panel is shown
    if (showAdvancedFilters) {
      // Type filter (from advanced filters)
      if (advancedFilters.type) {
        if (advancedFilters.type === 'varieties') {
          filtered = filtered.filter(item => item.observationData.type === 'Registered Variety');
        } else if (advancedFilters.type === 'seedlings') {
          filtered = filtered.filter(item => item.observationData.type === 'Seedling');
        }
      }

      // Hybridizer search
      if (advancedFilters.hybridizer) {
        filtered = filtered.filter(item => 
          item.hybridizer.toLowerCase().includes(advancedFilters.hybridizer.toLowerCase())
        );
      }

      // Year range (introduction year)
      if (advancedFilters.yearFrom) {
        filtered = filtered.filter(item => 
          item.year && item.year >= parseInt(advancedFilters.yearFrom)
        );
      }
      if (advancedFilters.yearTo) {
        filtered = filtered.filter(item => 
          item.year && item.year <= parseInt(advancedFilters.yearTo)
        );
      }

      // First year on record range
      if (advancedFilters.firstYearFrom) {
        filtered = filtered.filter(item => 
          item.observationData.first_year_on_record && 
          item.observationData.first_year_on_record >= parseInt(advancedFilters.firstYearFrom)
        );
      }
      if (advancedFilters.firstYearTo) {
        filtered = filtered.filter(item => 
          item.observationData.first_year_on_record && 
          item.observationData.first_year_on_record <= parseInt(advancedFilters.firstYearTo)
        );
      }

      // Bloom size range
      if (advancedFilters.bloomSizeMin) {
        filtered = filtered.filter(item => 
          item.bloomSize && item.bloomSize >= parseFloat(advancedFilters.bloomSizeMin)
        );
      }
      if (advancedFilters.bloomSizeMax) {
        filtered = filtered.filter(item => 
          item.bloomSize && item.bloomSize <= parseFloat(advancedFilters.bloomSizeMax)
        );
      }

      // Ploidy
      if (advancedFilters.ploidy) {
        filtered = filtered.filter(item => item.ploidy === advancedFilters.ploidy);
      }

      // Bloom seasons
      if (advancedFilters.bloomSeasons.length > 0) {
        filtered = filtered.filter(item => 
          item.bloomSeason && advancedFilters.bloomSeasons.includes(item.bloomSeason)
        );
      }

      // Rebloom
      if (advancedFilters.rebloom) {
        filtered = filtered.filter(item => item.rebloom === true);
      }

      // Foliage type
      if (advancedFilters.foliageType) {
        filtered = filtered.filter(item => item.foliageType === advancedFilters.foliageType);
      }
    }

    return filtered;
  }, [filter, searchTerm, showAdvancedFilters, advancedFilters]);

  const getDisplayName = (variety: MockVariety) => {
    if (variety.observationData.type === 'Seedling') {
      return variety.seedlingNum || variety.name;
    }
    return variety.name;
  };

  const getSubtitle = (variety: MockVariety) => {
    if (variety.observationData.type === 'Seedling') {
      return variety.observationData.nickname || variety.name;
    }
    return `${variety.hybridizer}, ${variety.year || 'Unknown'}`;
  };

  const formatCharacteristics = (variety: MockVariety) => {
    const chars = [];
    
    if (variety.scapeHeight) {
      chars.push(`height ${variety.scapeHeight} inches`);
    }
    
    if (variety.bloomSize) {
      chars.push(`bloom ${variety.bloomSize} inches`);
    }
    
    if (variety.bloomSeason) {
      const seasonMap: Record<string, string> = {
        'Extra Early': 'EE',
        'Early': 'E',
        'Early-Midseason': 'EM',
        'Midseason': 'M',
        'Midseason-Late': 'ML',
        'Late': 'L',
        'Very Late': 'VL'
      };
      chars.push(`season ${seasonMap[variety.bloomSeason] || variety.bloomSeason}`);
    }
    
    if (variety.rebloom) {
      chars.push('Rebloom');
    }
    
    if (variety.foliageType) {
      chars.push(variety.foliageType);
    }
    
    if (variety.ploidy) {
      chars.push(variety.ploidy);
    }
    
    if (variety.budCount) {
      chars.push(`${variety.budCount} buds`);
    }
    
    if (variety.branches) {
      chars.push(`${variety.branches} branches`);
    }
    
    if (variety.form) {
      chars.push(variety.form);
    }
    
    if (variety.fragrance && variety.fragrance !== 'Unknown') {
      chars.push(variety.fragrance);
    }

    return chars.join(', ');
  };

  const getColorDescription = (variety: MockVariety) => {
    if (variety.colorDescription) {
      return variety.colorDescription.length > 100 
        ? variety.colorDescription.substring(0, 100) + '...'
        : variety.colorDescription;
    }
    return '';
  };

  return (
    <div className="inventory-page">
      <div className="inventory-header">
        <h1>Inventory</h1>
        <p>Manage your daylily varieties and seedlings</p>
      </div>

      <TabGroup activeTab={activeTab} onTabChange={handleTabChange} />

      <div className="inventory-controls">
        <div className="filter-controls">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({mockInventoryData.length})
          </button>
          <button
            className={`filter-btn ${filter === 'varieties' ? 'active' : ''}`}
            onClick={() => setFilter('varieties')}
          >
            Varieties ({mockInventoryData.filter(item => item.observationData.type === 'Registered Variety').length})
          </button>
          <button
            className={`filter-btn ${filter === 'seedlings' ? 'active' : ''}`}
            onClick={() => setFilter('seedlings')}
          >
            Seedlings ({mockInventoryData.filter(item => item.observationData.type === 'Seedling').length})
          </button>
        </div>

        <input
          type="text"
          placeholder="Search varieties, hybridizers, or seedling numbers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="advanced-filters-section">
        <button 
          className="advanced-filters-toggle"
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
        >
          <span>Advanced Filters</span>
          <span className={`toggle-icon ${showAdvancedFilters ? 'expanded' : ''}`}>▼</span>
        </button>

        {showAdvancedFilters && (
          <div className="advanced-filters-panel">
            <div className="filters-grid">
              {/* Type Filter */}
              <div className="filter-group">
                <label className="filter-label">Type</label>
                <select
                  className="filter-input"
                  value={advancedFilters.type}
                  onChange={(e) => updateAdvancedFilter('type', e.target.value)}
                >
                  <option value="">Any</option>
                  <option value="varieties">Varieties Only</option>
                  <option value="seedlings">Seedlings Only</option>
                </select>
              </div>

              {/* Hybridizer - only show if not filtering for seedlings only */}
              {advancedFilters.type !== 'seedlings' && (
                <div className="filter-group">
                  <label className="filter-label">Hybridizer</label>
                  <input
                    type="text"
                    className="filter-input"
                    placeholder="Search by hybridizer"
                    value={advancedFilters.hybridizer}
                    onChange={(e) => updateAdvancedFilter('hybridizer', e.target.value)}
                  />
                </div>
              )}

              {/* Year Range - only show for varieties or when type is not specified */}
              {advancedFilters.type !== 'seedlings' && (
                <div className="filter-group">
                  <label className="filter-label">Introduction Year Range</label>
                  <div className="range-inputs">
                    <input
                      type="number"
                      className="filter-input"
                      placeholder="From"
                      value={advancedFilters.yearFrom}
                      onChange={(e) => updateAdvancedFilter('yearFrom', e.target.value)}
                    />
                    <input
                      type="number"
                      className="filter-input"
                      placeholder="To"
                      value={advancedFilters.yearTo}
                      onChange={(e) => updateAdvancedFilter('yearTo', e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* First Year on Record Range */}
              <div className="filter-group">
                <label className="filter-label">First Year on Record</label>
                <div className="range-inputs">
                  <input
                    type="number"
                    className="filter-input"
                    placeholder="From"
                    value={advancedFilters.firstYearFrom}
                    onChange={(e) => updateAdvancedFilter('firstYearFrom', e.target.value)}
                  />
                  <input
                    type="number"
                    className="filter-input"
                    placeholder="To"
                    value={advancedFilters.firstYearTo}
                    onChange={(e) => updateAdvancedFilter('firstYearTo', e.target.value)}
                  />
                </div>
              </div>

              {/* Bloom Size */}
              <div className="filter-group">
                <label className="filter-label">Bloom Size (inches)</label>
                <div className="range-inputs">
                  <input
                    type="number"
                    className="filter-input"
                    placeholder="Min"
                    step="0.1"
                    value={advancedFilters.bloomSizeMin}
                    onChange={(e) => updateAdvancedFilter('bloomSizeMin', e.target.value)}
                  />
                  <input
                    type="number"
                    className="filter-input"
                    placeholder="Max"
                    step="0.1"
                    value={advancedFilters.bloomSizeMax}
                    onChange={(e) => updateAdvancedFilter('bloomSizeMax', e.target.value)}
                  />
                </div>
              </div>

              {/* Ploidy */}
              <div className="filter-group">
                <label className="filter-label">Ploidy</label>
                <select
                  className="filter-input"
                  value={advancedFilters.ploidy}
                  onChange={(e) => updateAdvancedFilter('ploidy', e.target.value)}
                >
                  <option value="">Any</option>
                  <option value="Diploid">Diploid</option>
                  <option value="Tetraploid">Tetraploid</option>
                </select>
              </div>

              {/* Bloom Season */}
              <div className="filter-group full-width">
                <label className="filter-label">Bloom Season</label>
                <div className="checkbox-grid">
                  {bloomSeasonOptions.map(season => (
                    <label key={season} className="checkbox-option">
                      <input
                        type="checkbox"
                        checked={advancedFilters.bloomSeasons.includes(season)}
                        onChange={() => toggleBloomSeason(season)}
                      />
                      <span className="checkbox-custom">✓</span>
                      <span>{season}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Rebloom */}
              <div className="filter-group">
                <label className="checkbox-option">
                  <input
                    type="checkbox"
                    checked={advancedFilters.rebloom}
                    onChange={(e) => updateAdvancedFilter('rebloom', e.target.checked)}
                  />
                  <span className="checkbox-custom">✓</span>
                  <span>Rebloom</span>
                </label>
              </div>

              {/* Foliage Type */}
              <div className="filter-group">
                <label className="filter-label">Foliage Type</label>
                <select
                  className="filter-input"
                  value={advancedFilters.foliageType}
                  onChange={(e) => updateAdvancedFilter('foliageType', e.target.value)}
                >
                  <option value="">Any</option>
                  <option value="Dormant">Dormant</option>
                  <option value="Evergreen">Evergreen</option>
                  <option value="Semi-Evergreen">Semi-Evergreen</option>
                </select>
              </div>
            </div>

            <div className="filter-actions">
              <button className="filter-btn secondary" onClick={clearAdvancedFilters}>
                Clear All
              </button>
              <button className="filter-btn primary" onClick={() => setShowAdvancedFilters(false)}>
                Apply Filters
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="inventory-stats">
        <span className="stat-item">Showing {filteredInventory.length} items</span>
        <span className="stat-item">In Stock: {filteredInventory.filter(item => item.inventoryStatus === 'In Stock').length}</span>
      </div>

      <div className="inventory-list">
        {filteredInventory.map((variety, index) => (
          <div key={index} className="inventory-item">
            <div className="item-image">
              <div className="placeholder-image">
                <svg width="60" height="60" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
                  <defs>
                    <path id="petal" d="M50 5C 42 22, 44 36, 46 52L 54 52C 56 36, 58 22, 50 5 Z" />
                    <path id="sepal" d="M50 0C 38 18, 40 38, 44 56L 56 56C 60 38, 62 18, 50 0 Z" />
                  </defs>
                  
                  <use href="#petal" transform="rotate(0 50 50)" />
                  <use href="#sepal" transform="rotate(60 50 50)" />
                  <use href="#petal" transform="rotate(120 50 50)" />
                  <use href="#sepal" transform="rotate(180 50 50)" />
                  <use href="#petal" transform="rotate(240 50 50)" />
                  <use href="#sepal" transform="rotate(300 50 50)" />
                  
                  <circle cx="50" cy="50" r="4.5" />
                </svg>
              </div>
            </div>

            <div className="item-content">
              <div className="item-header">
                <h3 className="item-name">
                  {getDisplayName(variety)}
                </h3>
                <div className="item-subtitle">
                  {getSubtitle(variety)}
                </div>
              </div>

              <div className="item-characteristics">
                {formatCharacteristics(variety)}
              </div>

              {getColorDescription(variety) && (
                <div className="item-color">
                  {getColorDescription(variety)}
                </div>
              )}

              <div className="item-footer">
                <div className="item-status">
                  <span className={`status-badge ${variety.inventoryStatus.toLowerCase().replace(' ', '-')}`}>
                    {variety.inventoryStatus}
                  </span>
                  {variety.quantity > 1 && (
                    <span className="quantity-badge">
                      Qty: {variety.quantity}
                    </span>
                  )}
                </div>
                
                {variety.locationInGarden && (
                  <div className="item-location">
                    📍 {variety.locationInGarden}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredInventory.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">🌻</div>
          <h3>No items found</h3>
          <p>Try adjusting your filters or search terms</p>
        </div>
      )}
    </div>
  );
}

export default InventoryPage;