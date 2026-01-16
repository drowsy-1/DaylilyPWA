import { useState } from 'react';
import { mockInventoryData } from '../data/mockInventory';
import type { Page } from '../types';
import './AddVarietyPage.css';

interface ObservationContext {
  plantType: 'variety' | 'seedling';
  plantId: string;
  plantData: VarietyData | SeedlingData;
}

interface SeedlingData {
  id: string;
  seedlingNumber: string;
  year: number;
  podParent: string;
  pollenParent: string;
  crossId: string;
  location: string;
  nickname: string;
  photos: File[];
  dateAdded: string;
}

interface AddVarietyPageProps {
  onNavigate: (page: 'home' | 'add-plant') => void;
  onSave: (variety: VarietyData) => void;
  onNavigateWithContext?: (page: Page, context: ObservationContext) => void;
}

export interface VarietyData {
  id: string;
  // Importable fields
  name: string;
  hybridizer: string;
  year: number | null;
  scape_height: number | null;
  bloom_size: number | null;
  bloom_season: string;
  ploidy: string;
  foliage_type: string;
  bloom_habit: string;
  bud_count: number | null;
  branches: number | null;
  seedling_num: string;
  color_description: string;
  parentage: string;
  image_url: string;
  fragrance: string;
  form: string;
  awards: string;
  sculpting: string;
  notes: string;
  rebloom: boolean;
  region: string;
  city: string;
  state: string;
  country: string;
  // User-added fields
  location: string;
  photos: File[];
  dateAdded: string;
}

type Step = 'search' | 'details' | 'location' | 'photo' | 'manual-entry';

// Mock search results - in production this would hit an API
const searchVarieties = (query: string) => {
  if (!query.trim()) return [];
  const lowerQuery = query.toLowerCase();
  return mockInventoryData
    .filter(v =>
      v.name.toLowerCase().includes(lowerQuery) ||
      v.hybridizer?.toLowerCase().includes(lowerQuery)
    )
    .slice(0, 10);
};

function AddVarietyPage({ onNavigate, onSave, onNavigateWithContext }: AddVarietyPageProps) {
  const [step, setStep] = useState<Step>('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<typeof mockInventoryData>([]);
  const [selectedVariety, setSelectedVariety] = useState<typeof mockInventoryData[0] | null>(null);
  const [isManualEntry, setIsManualEntry] = useState(false);

  // Form fields
  const [varietyName, setVarietyName] = useState('');
  const [hybridizer, setHybridizer] = useState('');
  const [year, setYear] = useState('');
  const [ploidy, setPloidy] = useState('');
  const [foliageType, setFoliageType] = useState('');
  const [bloomSeason, setBloomSeason] = useState('');
  const [bloomSize, setBloomSize] = useState('');
  const [scapeHeight, setScapeHeight] = useState('');
  const [budCount, setBudCount] = useState('');
  const [branches, setBranches] = useState('');
  const [colorDescription, setColorDescription] = useState('');
  const [parentage, setParentage] = useState('');
  const [form, setForm] = useState('');
  const [fragrance, setFragrance] = useState('');
  const [rebloom, setRebloom] = useState(false);
  const [awards, setAwards] = useState('');
  const [notes, setNotes] = useState('');

  const [location, setLocation] = useState('');
  const [photos, setPhotos] = useState<File[]>([]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length >= 2) {
      setSearchResults(searchVarieties(query));
    } else {
      setSearchResults([]);
    }
  };

  const handleSelectVariety = (variety: typeof mockInventoryData[0]) => {
    setSelectedVariety(variety);
    // Auto-populate fields
    setVarietyName(variety.name);
    setHybridizer(variety.hybridizer || '');
    setYear(variety.year?.toString() || '');
    setPloidy(variety.ploidy || '');
    setFoliageType(variety.foliageType || '');
    setBloomSeason(variety.bloomSeason || '');
    setBloomSize(variety.bloomSize?.toString() || '');
    setScapeHeight(variety.scapeHeight?.toString() || '');
    setBudCount(variety.budCount?.toString() || '');
    setBranches(variety.branches?.toString() || '');
    setColorDescription(variety.colorDescription || '');
    setParentage(variety.parentage || '');
    setForm(variety.form || '');
    setFragrance(variety.fragrance || '');
    setRebloom(variety.rebloom || false);
    setAwards(variety.awards || '');
    setNotes(variety.notes || '');
    setLocation(variety.locationInGarden || '');
    setStep('details');
  };

  const handleManualEntry = () => {
    setIsManualEntry(true);
    setVarietyName(searchQuery);
    setStep('details');
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPhotos([...photos, ...Array.from(e.target.files)]);
    }
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    const varietyData: VarietyData = {
      id: crypto.randomUUID(),
      name: varietyName,
      hybridizer,
      year: year ? parseInt(year) : null,
      scape_height: scapeHeight ? parseFloat(scapeHeight) : null,
      bloom_size: bloomSize ? parseFloat(bloomSize) : null,
      bloom_season: bloomSeason,
      ploidy,
      foliage_type: foliageType,
      bloom_habit: '',
      bud_count: budCount ? parseInt(budCount) : null,
      branches: branches ? parseInt(branches) : null,
      seedling_num: '',
      color_description: colorDescription,
      parentage,
      image_url: '',
      fragrance,
      form,
      awards,
      sculpting: '',
      notes,
      rebloom,
      region: '',
      city: '',
      state: '',
      country: '',
      location,
      photos,
      dateAdded: new Date().toISOString()
    };
    onSave(varietyData);
    onNavigate('home');
  };

  const handleSaveAndObserve = () => {
    const varietyData: VarietyData = {
      id: crypto.randomUUID(),
      name: varietyName,
      hybridizer,
      year: year ? parseInt(year) : null,
      scape_height: scapeHeight ? parseFloat(scapeHeight) : null,
      bloom_size: bloomSize ? parseFloat(bloomSize) : null,
      bloom_season: bloomSeason,
      ploidy,
      foliage_type: foliageType,
      bloom_habit: '',
      bud_count: budCount ? parseInt(budCount) : null,
      branches: branches ? parseInt(branches) : null,
      seedling_num: '',
      color_description: colorDescription,
      parentage,
      image_url: '',
      fragrance,
      form,
      awards,
      sculpting: '',
      notes,
      rebloom,
      region: '',
      city: '',
      state: '',
      country: '',
      location,
      photos,
      dateAdded: new Date().toISOString()
    };
    onSave(varietyData);
    if (onNavigateWithContext) {
      onNavigateWithContext('trait-observation', {
        plantType: 'variety',
        plantId: varietyData.id,
        plantData: varietyData
      });
    }
  };

  const handleBack = () => {
    if (step === 'search') {
      onNavigate('add-plant');
    } else if (step === 'details') {
      setStep('search');
      setSelectedVariety(null);
      setIsManualEntry(false);
    } else if (step === 'location') {
      setStep('details');
    } else if (step === 'photo') {
      setStep('location');
    } else if (step === 'manual-entry') {
      setStep('photo');
    }
  };

  const handleNext = () => {
    if (step === 'details') {
      setStep('location');
    } else if (step === 'location') {
      setStep('photo');
    } else if (step === 'photo') {
      setStep('manual-entry');
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 'search': return 'Search Variety';
      case 'details': return isManualEntry ? 'Enter Variety Details' : 'Confirm Details';
      case 'location': return 'Add Location';
      case 'photo': return 'Add Photo';
      case 'manual-entry': return 'Additional Observations';
      default: return 'Add New Variety';
    }
  };

  return (
    <div className="add-variety-page">
      <div className="page-header">
        <button className="back-btn" onClick={handleBack}>
          <span className="back-icon">←</span>
        </button>
        <h1>{getStepTitle()}</h1>
        <div className="header-spacer"></div>
      </div>

      <div className="page-content">
        {/* Step 1: Search */}
        {step === 'search' && (
          <div className="step-content">
            <div className="search-section">
              <input
                type="text"
                className="search-input"
                placeholder="Search variety name..."
                value={searchQuery}
                onChange={e => handleSearch(e.target.value)}
                autoFocus
              />
            </div>

            {searchResults.length > 0 && (
              <div className="search-results">
                <div className="results-label">Select a variety:</div>
                {searchResults.map(variety => (
                  <button
                    key={variety.name}
                    className="result-item"
                    onClick={() => handleSelectVariety(variety)}
                  >
                    <div className="result-info">
                      <span className="result-name">{variety.name}</span>
                      <span className="result-meta">
                        {variety.hybridizer} {variety.year ? `(${variety.year})` : ''}
                      </span>
                    </div>
                    <span className="result-arrow">→</span>
                  </button>
                ))}
              </div>
            )}

            {searchQuery.length >= 2 && searchResults.length === 0 && (
              <div className="no-results">
                <p>No varieties found matching "{searchQuery}"</p>
                <button className="manual-entry-btn" onClick={handleManualEntry}>
                  Enter Manually
                </button>
              </div>
            )}

            {searchQuery.length >= 2 && (
              <button className="manual-entry-link" onClick={handleManualEntry}>
                Or enter details manually →
              </button>
            )}
          </div>
        )}

        {/* Step 2: Details (auto-populated or manual) */}
        {step === 'details' && (
          <div className="step-content">
            {!isManualEntry && selectedVariety && (
              <div className="auto-populated-notice">
                <span className="notice-icon">✓</span>
                Fields auto-populated from database
              </div>
            )}

            <div className="form-grid">
              <div className="form-section full-width">
                <label className="form-label">Variety Name *</label>
                <input
                  type="text"
                  className="form-input"
                  value={varietyName}
                  onChange={e => setVarietyName(e.target.value)}
                  placeholder="Enter variety name"
                />
              </div>

              <div className="form-section">
                <label className="form-label">Hybridizer</label>
                <input
                  type="text"
                  className="form-input"
                  value={hybridizer}
                  onChange={e => setHybridizer(e.target.value)}
                  placeholder="Hybridizer name"
                />
              </div>

              <div className="form-section">
                <label className="form-label">Year</label>
                <input
                  type="number"
                  className="form-input"
                  value={year}
                  onChange={e => setYear(e.target.value)}
                  placeholder="Year introduced"
                />
              </div>

              <div className="form-section">
                <label className="form-label">Ploidy</label>
                <select
                  className="form-select"
                  value={ploidy}
                  onChange={e => setPloidy(e.target.value)}
                >
                  <option value="">Select...</option>
                  <option value="Diploid">Diploid</option>
                  <option value="Tetraploid">Tetraploid</option>
                  <option value="Triploid">Triploid</option>
                  <option value="Unknown">Unknown</option>
                </select>
              </div>

              <div className="form-section">
                <label className="form-label">Foliage Type</label>
                <select
                  className="form-select"
                  value={foliageType}
                  onChange={e => setFoliageType(e.target.value)}
                >
                  <option value="">Select...</option>
                  <option value="Dormant">Dormant</option>
                  <option value="Semi-Evergreen">Semi-Evergreen</option>
                  <option value="Evergreen">Evergreen</option>
                </select>
              </div>

              <div className="form-section">
                <label className="form-label">Bloom Season</label>
                <select
                  className="form-select"
                  value={bloomSeason}
                  onChange={e => setBloomSeason(e.target.value)}
                >
                  <option value="">Select...</option>
                  <option value="Extra Early">Extra Early</option>
                  <option value="Early">Early</option>
                  <option value="Early-Midseason">Early-Midseason</option>
                  <option value="Midseason">Midseason</option>
                  <option value="Midseason-Late">Midseason-Late</option>
                  <option value="Late">Late</option>
                  <option value="Very Late">Very Late</option>
                </select>
              </div>

              <div className="form-section">
                <label className="form-label">Bloom Size (in)</label>
                <input
                  type="number"
                  step="0.1"
                  className="form-input"
                  value={bloomSize}
                  onChange={e => setBloomSize(e.target.value)}
                  placeholder="e.g., 6.5"
                />
              </div>

              <div className="form-section">
                <label className="form-label">Scape Height (in)</label>
                <input
                  type="number"
                  className="form-input"
                  value={scapeHeight}
                  onChange={e => setScapeHeight(e.target.value)}
                  placeholder="e.g., 32"
                />
              </div>

              <div className="form-section">
                <label className="form-label">Bud Count</label>
                <input
                  type="number"
                  className="form-input"
                  value={budCount}
                  onChange={e => setBudCount(e.target.value)}
                  placeholder="e.g., 20"
                />
              </div>

              <div className="form-section">
                <label className="form-label">Branches</label>
                <input
                  type="number"
                  className="form-input"
                  value={branches}
                  onChange={e => setBranches(e.target.value)}
                  placeholder="e.g., 3"
                />
              </div>

              <div className="form-section full-width">
                <label className="form-label">Color Description</label>
                <textarea
                  className="form-textarea"
                  value={colorDescription}
                  onChange={e => setColorDescription(e.target.value)}
                  placeholder="Describe the flower color..."
                  rows={2}
                />
              </div>

              <div className="form-section full-width">
                <label className="form-label">Parentage</label>
                <input
                  type="text"
                  className="form-input"
                  value={parentage}
                  onChange={e => setParentage(e.target.value)}
                  placeholder="(Pod Parent × Pollen Parent)"
                />
              </div>

              <div className="form-section">
                <label className="form-label">Form</label>
                <select
                  className="form-select"
                  value={form}
                  onChange={e => setForm(e.target.value)}
                >
                  <option value="">Select...</option>
                  <option value="Single">Single</option>
                  <option value="Double">Double</option>
                  <option value="Spider">Spider</option>
                  <option value="Unusual Form">Unusual Form</option>
                  <option value="Polymerous">Polymerous</option>
                </select>
              </div>

              <div className="form-section">
                <label className="form-label">Fragrance</label>
                <select
                  className="form-select"
                  value={fragrance}
                  onChange={e => setFragrance(e.target.value)}
                >
                  <option value="">Select...</option>
                  <option value="None">None</option>
                  <option value="Fragrant">Fragrant</option>
                  <option value="Very Fragrant">Very Fragrant</option>
                </select>
              </div>

              <div className="form-section checkbox-section">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={rebloom}
                    onChange={e => setRebloom(e.target.checked)}
                  />
                  <span>Rebloom</span>
                </label>
              </div>

              <div className="form-section">
                <label className="form-label">Awards</label>
                <input
                  type="text"
                  className="form-input"
                  value={awards}
                  onChange={e => setAwards(e.target.value)}
                  placeholder="e.g., HM, AM, SM"
                />
              </div>

              <div className="form-section full-width">
                <label className="form-label">Notes</label>
                <textarea
                  className="form-textarea"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Additional notes..."
                  rows={2}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Location */}
        {step === 'location' && (
          <div className="step-content">
            <div className="form-section">
              <label className="form-label">Garden Location</label>
              <input
                type="text"
                className="form-input"
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="e.g., Section A-1, Bed 3, Row 2"
                autoFocus
              />
              <p className="form-hint">
                Enter the location where this variety is planted in your garden.
              </p>
            </div>

            <div className="location-suggestions">
              <div className="suggestions-label">Quick select:</div>
              <div className="suggestion-chips">
                {['Section A', 'Section B', 'Section C', 'Bed 1', 'Bed 2', 'Bed 3'].map(loc => (
                  <button
                    key={loc}
                    className={`suggestion-chip ${location.includes(loc) ? 'active' : ''}`}
                    onClick={() => setLocation(prev => prev ? `${prev}, ${loc}` : loc)}
                  >
                    {loc}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Photo */}
        {step === 'photo' && (
          <div className="step-content">
            <div className="photo-options">
              <div className="photo-upload-area">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  capture="environment"
                  id="photo-upload"
                  className="photo-input"
                  onChange={handlePhotoUpload}
                />
                <label htmlFor="photo-upload" className="photo-upload-btn">
                  <span className="upload-icon">📷</span>
                  <span>Take Photo</span>
                </label>
              </div>

              <div className="photo-upload-area">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  id="photo-import"
                  className="photo-input"
                  onChange={handlePhotoUpload}
                />
                <label htmlFor="photo-import" className="photo-upload-btn">
                  <span className="upload-icon">📁</span>
                  <span>Import from Gallery</span>
                </label>
              </div>

              <button
                className="skip-btn"
                onClick={handleNext}
              >
                Skip for now →
              </button>
            </div>

            {photos.length > 0 && (
              <div className="photo-previews">
                {photos.map((photo, index) => (
                  <div key={index} className="photo-preview">
                    <img src={URL.createObjectURL(photo)} alt={`Preview ${index + 1}`} />
                    <button className="remove-photo" onClick={() => handleRemovePhoto(index)}>×</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 5: Manual Entry / Additional Observations */}
        {step === 'manual-entry' && (
          <div className="step-content">
            <div className="manual-entry-info">
              <p>You can add detailed observations now or later from the plant's profile.</p>
            </div>

            <div className="observation-categories">
              <button className="category-btn save-btn-highlight" onClick={handleSave}>
                <span className="category-icon">🌱</span>
                <span className="category-label">Save & Add Observations Later</span>
              </button>

              <div className="category-divider">or add observations now:</div>

              <button className="category-btn" onClick={handleSaveAndObserve}>
                <span className="category-icon">📋</span>
                <span className="category-label">Add Trait Observations</span>
                <span className="category-arrow">→</span>
              </button>
            </div>
          </div>
        )}

        {/* Footer with navigation */}
        {step !== 'search' && step !== 'manual-entry' && (
          <div className="page-footer">
            <button className="cancel-btn" onClick={() => onNavigate('add-plant')}>
              Cancel
            </button>
            <button
              className="next-btn"
              onClick={handleNext}
              disabled={step === 'details' && !varietyName}
            >
              {step === 'photo' ? 'Continue' : 'Next'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default AddVarietyPage;
