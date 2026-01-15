import { useState, useEffect } from 'react';
import { mockInventoryData } from '../data/mockInventory';
import './AddSeedlingPage.css';

type Page = 'home' | 'trait-fields' | 'observation-cycles' | 'inventory' | 'add-note' | 'add-plant' | 'add-variety' | 'add-seedling' | 'add-seedling-group' | 'continue-seedling-group' | 'continue-observation' | 'trait-observation';

interface ObservationContext {
  plantType: 'variety' | 'seedling';
  plantId: string;
  plantData: any;
}

interface AddSeedlingPageProps {
  onNavigate: (page: 'home' | 'add-plant') => void;
  onSave: (seedling: SeedlingData) => void;
  onNavigateWithContext?: (page: Page, context: ObservationContext) => void;
}

export interface SeedlingData {
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

interface Cross {
  id: string;
  podParent: string;
  pollenParent: string;
  year: number;
  label: string;
}

type Step = 'year' | 'cross' | 'details' | 'manual-entry';

// Mock crosses - in production this would come from the database
const getMockCrosses = (year: number): Cross[] => {
  // Generate some mock crosses based on inventory data
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

// Get next seedling number for a cross
const getNextSeedlingNumber = (crossId: string, year: number): string => {
  // In production, this would query existing seedlings
  const shortYear = year.toString().slice(-2);
  const nextNum = Math.floor(Math.random() * 10) + 1; // Mock: random 1-10
  return `${shortYear}-${crossId.split('-')[1]}-${String(nextNum).padStart(3, '0')}`;
};

function AddSeedlingPage({ onNavigate, onSave, onNavigateWithContext }: AddSeedlingPageProps) {
  const currentYear = new Date().getFullYear();

  const [step, setStep] = useState<Step>('year');
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [isManualYear, setIsManualYear] = useState(false);

  const [crosses, setCrosses] = useState<Cross[]>([]);
  const [selectedCross, setSelectedCross] = useState<Cross | null>(null);
  const [isManualCross, setIsManualCross] = useState(false);
  const [podParent, setPodParent] = useState('');
  const [pollenParent, setPollenParent] = useState('');

  const [seedlingNumber, setSeedlingNumber] = useState('');
  const [location, setLocation] = useState('');
  const [nickname, setNickname] = useState('');
  const [photos, setPhotos] = useState<File[]>([]);

  // Load crosses when year changes
  useEffect(() => {
    setCrosses(getMockCrosses(selectedYear));
  }, [selectedYear]);

  // Auto-generate seedling number when cross is selected
  useEffect(() => {
    if (selectedCross) {
      setSeedlingNumber(getNextSeedlingNumber(selectedCross.id, selectedYear));
    } else if (isManualCross && podParent && pollenParent) {
      const shortYear = selectedYear.toString().slice(-2);
      const nextNum = Math.floor(Math.random() * 100) + 1;
      setSeedlingNumber(`${shortYear}-NEW-${String(nextNum).padStart(3, '0')}`);
    }
  }, [selectedCross, isManualCross, podParent, pollenParent, selectedYear]);

  const handleYearSelect = (year: number) => {
    setSelectedYear(year);
    setIsManualYear(false);
  };

  const handleCrossSelect = (cross: Cross) => {
    setSelectedCross(cross);
    setIsManualCross(false);
    setPodParent(cross.podParent);
    setPollenParent(cross.pollenParent);
    setStep('details');
  };

  const handleManualCrossNext = () => {
    if (podParent && pollenParent) {
      setIsManualCross(true);
      setSelectedCross(null);
      setStep('details');
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPhotos([...photos, ...Array.from(e.target.files)]);
    }
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const incrementSeedlingNumber = () => {
    // Parse and increment the last part of the seedling number
    const parts = seedlingNumber.split('-');
    if (parts.length === 3) {
      const num = parseInt(parts[2]) + 1;
      setSeedlingNumber(`${parts[0]}-${parts[1]}-${String(num).padStart(3, '0')}`);
    }
  };

  const handleSave = () => {
    const seedlingData: SeedlingData = {
      id: crypto.randomUUID(),
      seedlingNumber,
      year: selectedYear,
      podParent,
      pollenParent,
      crossId: selectedCross?.id || 'manual',
      location,
      nickname,
      photos,
      dateAdded: new Date().toISOString()
    };
    onSave(seedlingData);
    onNavigate('home');
  };

  const handleSaveAndObserve = () => {
    const seedlingData: SeedlingData = {
      id: crypto.randomUUID(),
      seedlingNumber,
      year: selectedYear,
      podParent,
      pollenParent,
      crossId: selectedCross?.id || 'manual',
      location,
      nickname,
      photos,
      dateAdded: new Date().toISOString()
    };
    onSave(seedlingData);
    if (onNavigateWithContext) {
      onNavigateWithContext('trait-observation', {
        plantType: 'seedling',
        plantId: seedlingData.id,
        plantData: seedlingData
      });
    }
  };

  const handleBack = () => {
    if (step === 'year') {
      onNavigate('add-plant');
    } else if (step === 'cross') {
      setStep('year');
    } else if (step === 'details') {
      setStep('cross');
    } else if (step === 'manual-entry') {
      setStep('details');
    }
  };

  const handleNext = () => {
    if (step === 'year') {
      setStep('cross');
    } else if (step === 'details') {
      setStep('manual-entry');
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 'year': return 'Select Year';
      case 'cross': return 'Select Cross';
      case 'details': return 'Seedling Details';
      case 'manual-entry': return 'Additional Observations';
      default: return 'Add New Seedling';
    }
  };

  const yearOptions = [currentYear, currentYear - 1, currentYear - 2, currentYear - 3];

  return (
    <div className="add-seedling-page">
      <div className="page-header">
        <button className="back-btn" onClick={handleBack}>
          <span className="back-icon">←</span>
        </button>
        <h1>{getStepTitle()}</h1>
        <div className="header-spacer"></div>
      </div>

      <div className="page-content">
        {/* Step 1: Year Selection */}
        {step === 'year' && (
          <div className="step-content">
            <p className="step-description">
              Select the year this seedling was germinated.
            </p>

            <div className="year-options">
              {yearOptions.map(year => (
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
                  value={selectedYear}
                  onChange={e => setSelectedYear(parseInt(e.target.value) || currentYear)}
                  min={1990}
                  max={currentYear}
                  autoFocus
                />
              </div>
            )}

            <div className="page-footer">
              <button className="cancel-btn" onClick={() => onNavigate('add-plant')}>
                Cancel
              </button>
              <button className="next-btn" onClick={handleNext}>
                Next
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Cross Selection */}
        {step === 'cross' && (
          <div className="step-content">
            <p className="step-description">
              Select an existing cross or enter parents manually.
            </p>

            {crosses.length > 0 && (
              <div className="crosses-section">
                <div className="section-label">Crosses from {selectedYear}:</div>
                <div className="cross-options">
                  {crosses.map(cross => (
                    <button
                      key={cross.id}
                      className="cross-btn"
                      onClick={() => handleCrossSelect(cross)}
                    >
                      <span className="cross-id">{cross.id}</span>
                      <span className="cross-label">{cross.label}</span>
                      <span className="cross-arrow">→</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="manual-cross-section">
              <div className="section-label">Or enter parents manually:</div>

              <div className="form-section">
                <label className="form-label">Pod Parent</label>
                <input
                  type="text"
                  className="form-input"
                  value={podParent}
                  onChange={e => setPodParent(e.target.value)}
                  placeholder="Enter pod parent name..."
                />
              </div>

              <div className="form-section">
                <label className="form-label">Pollen Parent</label>
                <input
                  type="text"
                  className="form-input"
                  value={pollenParent}
                  onChange={e => setPollenParent(e.target.value)}
                  placeholder="Enter pollen parent name..."
                />
              </div>

              {podParent && pollenParent && (
                <div className="cross-preview">
                  <span className="preview-label">Cross:</span>
                  <span className="preview-value">{podParent} × {pollenParent}</span>
                </div>
              )}
            </div>

            <div className="page-footer">
              <button className="cancel-btn" onClick={() => setStep('year')}>
                Back
              </button>
              <button
                className="next-btn"
                onClick={handleManualCrossNext}
                disabled={!podParent || !pollenParent}
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Seedling Details */}
        {step === 'details' && (
          <div className="step-content">
            <div className="cross-info-card">
              <div className="info-row">
                <span className="info-label">Year:</span>
                <span className="info-value">{selectedYear}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Cross:</span>
                <span className="info-value">{podParent} × {pollenParent}</span>
              </div>
            </div>

            <div className="form-section">
              <label className="form-label">Seedling Number</label>
              <div className="seedling-number-row">
                <input
                  type="text"
                  className="form-input seedling-input"
                  value={seedlingNumber}
                  onChange={e => setSeedlingNumber(e.target.value)}
                  placeholder="e.g., 24-001-001"
                />
                <button
                  className="increment-btn"
                  onClick={incrementSeedlingNumber}
                  title="Auto-increment"
                >
                  +1
                </button>
              </div>
              <p className="form-hint">Format: YY-CROSS-### (auto-generated, editable)</p>
            </div>

            <div className="form-section">
              <label className="form-label">Location</label>
              <input
                type="text"
                className="form-input"
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="e.g., Seedling Bed A, Row 3"
              />
            </div>

            <div className="form-section">
              <label className="form-label">Nickname (optional)</label>
              <input
                type="text"
                className="form-input"
                value={nickname}
                onChange={e => setNickname(e.target.value)}
                placeholder="Give this seedling a memorable name..."
              />
            </div>

            {/* Photo Upload */}
            <div className="form-section">
              <label className="form-label">Photo (optional)</label>
              <div className="photo-upload-area">
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  id="seedling-photo"
                  className="photo-input"
                  onChange={handlePhotoUpload}
                />
                <label htmlFor="seedling-photo" className="photo-upload-btn">
                  <span className="upload-icon">📷</span>
                  <span>Add Photo</span>
                </label>
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

            <div className="page-footer">
              <button className="cancel-btn" onClick={() => setStep('cross')}>
                Back
              </button>
              <button
                className="next-btn"
                onClick={handleNext}
                disabled={!seedlingNumber}
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Manual Entry / Seasonal Flow */}
        {step === 'manual-entry' && (
          <div className="step-content">
            <div className="seedling-summary-card">
              <div className="summary-header">
                <span className="summary-number">{seedlingNumber}</span>
                {nickname && <span className="summary-nickname">"{nickname}"</span>}
              </div>
              <div className="summary-details">
                <span>{podParent} × {pollenParent}</span>
                {location && <span>📍 {location}</span>}
              </div>
            </div>

            <div className="manual-entry-info">
              <p>You can add detailed observations now or later from the seedling's profile.</p>
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
      </div>
    </div>
  );
}

export default AddSeedlingPage;
