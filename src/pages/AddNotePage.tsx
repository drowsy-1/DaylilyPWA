import { useState } from 'react';
import { mockInventoryData } from '../data/mockInventory';
import './AddNotePage.css';

interface AddNotePageProps {
  onNavigate: (page: 'home') => void;
  onSave: (note: NoteData) => void;
}

export interface NoteData {
  id: string;
  dateTime: string;
  tags: string[];
  plantType: 'variety' | 'seedling' | null;
  plantSelection: string;
  location: string;
  customDate: string;
  seasonObservation: string;
  noteText: string;
  photos: File[];
}

function AddNotePage({ onNavigate, onSave }: AddNotePageProps) {
  const [plantType, setPlantType] = useState<'variety' | 'seedling' | null>(null);
  const [plantSelection, setPlantSelection] = useState('');
  const [location, setLocation] = useState('');
  const [customDate, setCustomDate] = useState('');
  const [seasonObservation, setSeasonObservation] = useState('');
  const [noteText, setNoteText] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [photos, setPhotos] = useState<File[]>([]);

  // Get varieties and seedlings from mock data
  const varieties = mockInventoryData.filter(item => item.observationData?.type === 'Registered Variety');
  const seedlings = mockInventoryData.filter(item => item.observationData?.type === 'Seedling');

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
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

  const handleSave = () => {
    const noteData: NoteData = {
      id: crypto.randomUUID(),
      dateTime: new Date().toISOString(),
      tags,
      plantType,
      plantSelection,
      location,
      customDate,
      seasonObservation,
      noteText,
      photos
    };
    onSave(noteData);
    onNavigate('home');
  };

  const handleCancel = () => {
    onNavigate('home');
  };

  const plantOptions = plantType === 'variety' ? varieties : plantType === 'seedling' ? seedlings : [];

  return (
    <div className="add-note-page">
      <div className="page-header">
        <button className="back-btn" onClick={handleCancel}>
          <span className="back-icon">←</span>
        </button>
        <h1>Add Notes</h1>
        <div className="header-spacer"></div>
      </div>

      <div className="page-content">
        <div className="auto-timestamp">
          <span className="timestamp-icon">🕐</span>
          <span className="timestamp-text">
            {new Date().toLocaleString()}
          </span>
          <span className="timestamp-label">(auto-logged)</span>
        </div>

        {/* Tags Section */}
        <div className="form-section">
          <label className="form-label">Tags (optional)</label>
          <div className="tags-container">
            {tags.map(tag => (
              <span key={tag} className="tag">
                {tag}
                <button className="tag-remove" onClick={() => handleRemoveTag(tag)}>&times;</button>
              </span>
            ))}
          </div>
          <div className="tag-input-row">
            <input
              type="text"
              className="form-input tag-input"
              placeholder="Add tag for filtering..."
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button className="add-tag-btn" onClick={handleAddTag}>Add</button>
          </div>
        </div>

        {/* Plant Type Selection */}
        <div className="form-section">
          <label className="form-label">Select Plant Type</label>
          <div className="selection-buttons">
            <button
              className={`selection-btn ${plantType === 'variety' ? 'active' : ''}`}
              onClick={() => { setPlantType('variety'); setPlantSelection(''); }}
            >
              Variety
            </button>
            <button
              className={`selection-btn ${plantType === 'seedling' ? 'active' : ''}`}
              onClick={() => { setPlantType('seedling'); setPlantSelection(''); }}
            >
              Seedling
            </button>
          </div>
        </div>

        {/* Plant Selection Dropdown */}
        {plantType && (
          <div className="form-section">
            <label className="form-label">
              Select {plantType === 'variety' ? 'Variety' : 'Seedling # / Group'}
            </label>
            <select
              className="form-select"
              value={plantSelection}
              onChange={e => setPlantSelection(e.target.value)}
            >
              <option value="">-- Select --</option>
              {plantOptions.map(plant => (
                <option key={plant.name} value={plant.name}>
                  {plant.name} {plant.seedlingNum ? `(${plant.seedlingNum})` : ''}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Location */}
        <div className="form-section">
          <label className="form-label">Location</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g., Section A-1, Bed 3..."
            value={location}
            onChange={e => setLocation(e.target.value)}
          />
        </div>

        {/* Custom Date / Season */}
        <div className="form-section">
          <label className="form-label">Custom Date / Year / Season (optional)</label>
          <div className="date-season-row">
            <input
              type="date"
              className="form-input date-input"
              value={customDate}
              onChange={e => setCustomDate(e.target.value)}
            />
            <select
              className="form-select season-select"
              value={seasonObservation}
              onChange={e => setSeasonObservation(e.target.value)}
            >
              <option value="">Season...</option>
              <option value="spring">Spring</option>
              <option value="early-summer">Early Summer</option>
              <option value="mid-summer">Mid Summer</option>
              <option value="late-summer">Late Summer</option>
              <option value="fall">Fall</option>
              <option value="winter">Winter</option>
            </select>
          </div>
        </div>

        {/* Note Text */}
        <div className="form-section">
          <label className="form-label">Note</label>
          <textarea
            className="form-textarea"
            placeholder="Enter your observation notes..."
            rows={4}
            value={noteText}
            onChange={e => setNoteText(e.target.value)}
          />
        </div>

        {/* Photo Upload */}
        <div className="form-section">
          <label className="form-label">Photos</label>
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
              <span>Upload / Take Photo</span>
            </label>
          </div>
          {photos.length > 0 && (
            <div className="photo-previews">
              {photos.map((photo, index) => (
                <div key={index} className="photo-preview">
                  <img src={URL.createObjectURL(photo)} alt={`Preview ${index + 1}`} />
                  <button className="remove-photo" onClick={() => handleRemovePhoto(index)}>&times;</button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="page-footer">
          <button className="cancel-btn" onClick={handleCancel}>Cancel</button>
          <button className="save-btn" onClick={handleSave}>Save Note</button>
        </div>
      </div>
    </div>
  );
}

export default AddNotePage;
