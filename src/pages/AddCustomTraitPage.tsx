import { useState, useEffect, useMemo } from 'react';
import './AddCustomTraitPage.css';
import { useTraitData } from '../contexts/TraitDataContext';
import { generateFieldName, getAllFieldNames } from '../utils/traitMerger';
import type { Page } from '../types';

interface AddCustomTraitPageProps {
  onNavigate: (page: Page, data?: unknown) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  editContext?: {
    areaName: string;
    groupName: string;
    traitField: string;
  };
}

type LocationType = 'existing' | 'new-group' | 'new-area';
type TraitType = 'text' | 'number' | 'select' | 'rating' | 'boolean';

interface FormData {
  locationType: LocationType;
  selectedArea: string;
  selectedGroup: string;
  newAreaName: string;
  newGroupName: string;
  traitLabel: string;
  traitField: string;
  traitType: TraitType;
  selectOptions: string[];
  ratingMax: number;
  includeTiming: boolean;
  timingSeason: string;
  timingMonth: string;
  excludeFromCycle: boolean;
}

const SEASONS = ['Spring', 'Summer', 'Fall', 'Winter'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function AddCustomTraitPage({ onNavigate, isDark, onToggleTheme, editContext }: AddCustomTraitPageProps) {
  const {
    mergedTraitData,
    customTraitsData,
    addCustomArea,
    addCustomGroup,
    addCustomTrait,
    addTraitToCustomArea,
    updateCustomTrait
  } = useTraitData();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    locationType: 'existing',
    selectedArea: '',
    selectedGroup: '',
    newAreaName: '',
    newGroupName: '',
    traitLabel: '',
    traitField: '',
    traitType: 'text',
    selectOptions: ['', ''],
    ratingMax: 5,
    includeTiming: false,
    timingSeason: '',
    timingMonth: '',
    excludeFromCycle: false
  });

  const isEditMode = !!editContext;
  const existingFields = useMemo(() => getAllFieldNames(mergedTraitData), [mergedTraitData]);

  // Load existing trait data in edit mode
  useEffect(() => {
    if (editContext && customTraitsData) {
      // Find the trait to edit
      let trait = null;
      let isInCustomArea = false;

      // Check in custom areas
      for (const area of customTraitsData.customAreas) {
        if (area.name === editContext.areaName) {
          for (const group of area.groups) {
            if (group.name === editContext.groupName) {
              trait = group.traits.find(t => t.field === editContext.traitField);
              isInCustomArea = true;
              break;
            }
          }
        }
      }

      // Check in custom groups
      if (!trait) {
        const groups = customTraitsData.customGroups[editContext.areaName];
        if (groups) {
          for (const group of groups) {
            if (group.name === editContext.groupName) {
              trait = group.traits.find(t => t.field === editContext.traitField);
              break;
            }
          }
        }
      }

      // Check in custom traits
      if (!trait) {
        const key = `${editContext.areaName}::${editContext.groupName}`;
        const traits = customTraitsData.customTraits[key];
        if (traits) {
          trait = traits.find(t => t.field === editContext.traitField);
        }
      }

      if (trait) {
        setFormData({
          locationType: isInCustomArea ? 'new-area' : 'existing',
          selectedArea: editContext.areaName,
          selectedGroup: editContext.groupName,
          newAreaName: isInCustomArea ? editContext.areaName : '',
          newGroupName: isInCustomArea ? editContext.groupName : '',
          traitLabel: trait.label,
          traitField: trait.field,
          traitType: trait.type as TraitType,
          selectOptions: trait.options || ['', ''],
          ratingMax: 5,
          includeTiming: !!trait.defaultTiming,
          timingSeason: trait.defaultTiming?.season || '',
          timingMonth: trait.defaultTiming?.month || '',
          excludeFromCycle: trait.defaultTiming?.excludeFromAutomaticCycle || false
        });
        setStep(2); // Skip to trait definition step in edit mode
      }
    }
  }, [editContext, customTraitsData]);

  // Get available areas and groups
  const availableAreas = mergedTraitData.map(a => a.name);
  const availableGroups = formData.selectedArea
    ? mergedTraitData.find(a => a.name === formData.selectedArea)?.groups.map(g => g.name) || []
    : [];

  // Generate field name from label
  const handleLabelChange = (label: string) => {
    setFormData(prev => ({
      ...prev,
      traitLabel: label,
      traitField: isEditMode ? prev.traitField : generateFieldName(label, existingFields)
    }));
  };

  // Add select option
  const addSelectOption = () => {
    setFormData(prev => ({
      ...prev,
      selectOptions: [...prev.selectOptions, '']
    }));
  };

  // Remove select option
  const removeSelectOption = (index: number) => {
    if (formData.selectOptions.length <= 2) return;
    setFormData(prev => ({
      ...prev,
      selectOptions: prev.selectOptions.filter((_, i) => i !== index)
    }));
  };

  // Update select option
  const updateSelectOption = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      selectOptions: prev.selectOptions.map((opt, i) => i === index ? value : opt)
    }));
  };

  // Validate current step
  const isStepValid = () => {
    switch (step) {
      case 1:
        if (formData.locationType === 'existing') {
          return formData.selectedArea && formData.selectedGroup;
        } else if (formData.locationType === 'new-group') {
          return formData.selectedArea && formData.newGroupName.trim();
        } else {
          return formData.newAreaName.trim() && formData.newGroupName.trim();
        }
      case 2:
        return formData.traitLabel.trim() && formData.traitField.trim();
      case 3:
        if (formData.traitType === 'select') {
          return formData.selectOptions.filter(o => o.trim()).length >= 2;
        }
        return true;
      case 4:
        return true;
      default:
        return true;
    }
  };

  // Handle save
  const handleSave = () => {
    const traitData = {
      field: formData.traitField,
      label: formData.traitLabel,
      type: formData.traitType,
      options: formData.traitType === 'select'
        ? formData.selectOptions.filter(o => o.trim())
        : undefined,
      defaultTiming: formData.includeTiming
        ? {
            season: formData.timingSeason || undefined,
            month: formData.timingMonth || undefined,
            excludeFromAutomaticCycle: formData.excludeFromCycle || undefined
          }
        : undefined
    };

    if (isEditMode && editContext) {
      // Update existing trait
      updateCustomTrait(
        editContext.areaName,
        editContext.groupName,
        editContext.traitField,
        traitData
      );
    } else {
      // Add new trait
      if (formData.locationType === 'new-area') {
        // First create the area if it doesn't exist
        const areaExists = customTraitsData?.customAreas.some(a => a.name === formData.newAreaName);
        if (!areaExists) {
          addCustomArea(formData.newAreaName, formData.newGroupName);
        }
        // Then add the trait to it
        addTraitToCustomArea(formData.newAreaName, formData.newGroupName, traitData);
      } else if (formData.locationType === 'new-group') {
        // First create the group
        addCustomGroup(formData.selectedArea, formData.newGroupName);
        // Then add the trait - need to use addCustomTrait since the group is in a default area
        addCustomTrait(formData.selectedArea, formData.newGroupName, traitData);
      } else {
        // Add to existing group
        addCustomTrait(formData.selectedArea, formData.selectedGroup, traitData);
      }
    }

    onNavigate('custom-trait-list');
  };

  // Get step title
  const getStepTitle = () => {
    switch (step) {
      case 1: return 'Select Location';
      case 2: return 'Define Trait';
      case 3: return 'Configure Type';
      case 4: return 'Set Timing';
      case 5: return 'Review';
      default: return '';
    }
  };

  return (
    <div className="add-custom-trait-page">
      {/* Header */}
      <div className="page-header">
        <button className="back-btn" onClick={() => onNavigate('custom-trait-list')} aria-label="Back">
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
          <h1>{isEditMode ? 'Edit Custom Trait' : 'Add Custom Trait'}</h1>
          <p>Step {step} of {isEditMode ? 4 : 5}: {getStepTitle()}</p>
        </div>

        {/* Progress bar */}
        <div className="progress-bar">
          {[1, 2, 3, 4, ...(isEditMode ? [] : [5])].map(s => (
            <div
              key={s}
              className={`progress-step ${s <= step ? 'active' : ''} ${s < step ? 'completed' : ''}`}
            />
          ))}
        </div>

        {/* Step 1: Location */}
        {step === 1 && !isEditMode && (
          <div className="step-content">
            <div className="form-section">
              <label className="section-label">Where should this trait be added?</label>

              <div className="location-options">
                <label className={`location-option ${formData.locationType === 'existing' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="locationType"
                    checked={formData.locationType === 'existing'}
                    onChange={() => setFormData(prev => ({ ...prev, locationType: 'existing' }))}
                  />
                  <div className="option-content">
                    <span className="option-title">Existing Group</span>
                    <span className="option-desc">Add to an existing area and group</span>
                  </div>
                </label>

                <label className={`location-option ${formData.locationType === 'new-group' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="locationType"
                    checked={formData.locationType === 'new-group'}
                    onChange={() => setFormData(prev => ({ ...prev, locationType: 'new-group' }))}
                  />
                  <div className="option-content">
                    <span className="option-title">New Group</span>
                    <span className="option-desc">Create a new group in an existing area</span>
                  </div>
                </label>

                <label className={`location-option ${formData.locationType === 'new-area' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="locationType"
                    checked={formData.locationType === 'new-area'}
                    onChange={() => setFormData(prev => ({ ...prev, locationType: 'new-area' }))}
                  />
                  <div className="option-content">
                    <span className="option-title">New Area</span>
                    <span className="option-desc">Create a completely new area and group</span>
                  </div>
                </label>
              </div>
            </div>

            {formData.locationType === 'existing' && (
              <div className="form-section">
                <div className="form-group">
                  <label>Area</label>
                  <select
                    value={formData.selectedArea}
                    onChange={e => setFormData(prev => ({ ...prev, selectedArea: e.target.value, selectedGroup: '' }))}
                  >
                    <option value="">Select an area...</option>
                    {availableAreas.map(area => (
                      <option key={area} value={area}>{area}</option>
                    ))}
                  </select>
                </div>

                {formData.selectedArea && (
                  <div className="form-group">
                    <label>Group</label>
                    <select
                      value={formData.selectedGroup}
                      onChange={e => setFormData(prev => ({ ...prev, selectedGroup: e.target.value }))}
                    >
                      <option value="">Select a group...</option>
                      {availableGroups.map(group => (
                        <option key={group} value={group}>{group}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            )}

            {formData.locationType === 'new-group' && (
              <div className="form-section">
                <div className="form-group">
                  <label>Area</label>
                  <select
                    value={formData.selectedArea}
                    onChange={e => setFormData(prev => ({ ...prev, selectedArea: e.target.value }))}
                  >
                    <option value="">Select an area...</option>
                    {availableAreas.map(area => (
                      <option key={area} value={area}>{area}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>New Group Name</label>
                  <input
                    type="text"
                    value={formData.newGroupName}
                    onChange={e => setFormData(prev => ({ ...prev, newGroupName: e.target.value }))}
                    placeholder="e.g., Custom Measurements"
                  />
                </div>
              </div>
            )}

            {formData.locationType === 'new-area' && (
              <div className="form-section">
                <div className="form-group">
                  <label>New Area Name</label>
                  <input
                    type="text"
                    value={formData.newAreaName}
                    onChange={e => setFormData(prev => ({ ...prev, newAreaName: e.target.value }))}
                    placeholder="e.g., 8. Custom Observations"
                  />
                  <span className="form-hint">Tip: Use a number prefix to control ordering</span>
                </div>

                <div className="form-group">
                  <label>First Group Name</label>
                  <input
                    type="text"
                    value={formData.newGroupName}
                    onChange={e => setFormData(prev => ({ ...prev, newGroupName: e.target.value }))}
                    placeholder="e.g., General Traits"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Define Trait */}
        {step === 2 && (
          <div className="step-content">
            <div className="form-section">
              <div className="form-group">
                <label>Trait Label</label>
                <input
                  type="text"
                  value={formData.traitLabel}
                  onChange={e => handleLabelChange(e.target.value)}
                  placeholder="e.g., Fragrance Intensity"
                />
                <span className="form-hint">The display name shown in the UI</span>
              </div>

              <div className="form-group">
                <label>Field Name</label>
                <input
                  type="text"
                  value={formData.traitField}
                  onChange={e => setFormData(prev => ({ ...prev, traitField: e.target.value }))}
                  placeholder="custom_fragrance_intensity"
                  disabled={isEditMode}
                />
                <span className="form-hint">Auto-generated from label (must be unique)</span>
              </div>

              <div className="form-group">
                <label>Trait Type</label>
                <div className="type-options">
                  {(['text', 'number', 'select', 'rating', 'boolean'] as TraitType[]).map(type => (
                    <label key={type} className={`type-option ${formData.traitType === type ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="traitType"
                        checked={formData.traitType === type}
                        onChange={() => setFormData(prev => ({ ...prev, traitType: type }))}
                      />
                      <span className="type-name">{type}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Configure Type */}
        {step === 3 && (
          <div className="step-content">
            {formData.traitType === 'select' && (
              <div className="form-section">
                <label className="section-label">Select Options</label>
                <p className="section-desc">Add at least 2 options for this dropdown field</p>

                <div className="options-list">
                  {formData.selectOptions.map((option, index) => (
                    <div key={index} className="option-row">
                      <input
                        type="text"
                        value={option}
                        onChange={e => updateSelectOption(index, e.target.value)}
                        placeholder={`Option ${index + 1}`}
                      />
                      {formData.selectOptions.length > 2 && (
                        <button
                          type="button"
                          className="remove-option-btn"
                          onClick={() => removeSelectOption(index)}
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <button type="button" className="add-option-btn" onClick={addSelectOption}>
                  + Add Option
                </button>
              </div>
            )}

            {formData.traitType === 'rating' && (
              <div className="form-section">
                <label className="section-label">Rating Scale</label>
                <div className="form-group">
                  <label>Maximum Value</label>
                  <select
                    value={formData.ratingMax}
                    onChange={e => setFormData(prev => ({ ...prev, ratingMax: parseInt(e.target.value) }))}
                  >
                    <option value={5}>1-5</option>
                    <option value={10}>1-10</option>
                  </select>
                </div>
              </div>
            )}

            {formData.traitType === 'number' && (
              <div className="form-section">
                <div className="info-box">
                  <p>Number fields accept any numeric value. No additional configuration needed.</p>
                </div>
              </div>
            )}

            {formData.traitType === 'text' && (
              <div className="form-section">
                <div className="info-box">
                  <p>Text fields accept any text input. No additional configuration needed.</p>
                </div>
              </div>
            )}

            {formData.traitType === 'boolean' && (
              <div className="form-section">
                <div className="info-box">
                  <p>Boolean fields show a Yes/No toggle. No additional configuration needed.</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 4: Timing */}
        {step === 4 && (
          <div className="step-content">
            <div className="form-section">
              <label className="toggle-row">
                <input
                  type="checkbox"
                  checked={formData.includeTiming}
                  onChange={e => setFormData(prev => ({ ...prev, includeTiming: e.target.checked }))}
                />
                <span>Include in observation cycles</span>
              </label>

              {formData.includeTiming && (
                <>
                  <div className="form-group">
                    <label>Default Season</label>
                    <select
                      value={formData.timingSeason}
                      onChange={e => setFormData(prev => ({ ...prev, timingSeason: e.target.value }))}
                    >
                      <option value="">Any season</option>
                      {SEASONS.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Default Month</label>
                    <select
                      value={formData.timingMonth}
                      onChange={e => setFormData(prev => ({ ...prev, timingMonth: e.target.value }))}
                    >
                      <option value="">Any month</option>
                      {MONTHS.map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>

                  <label className="toggle-row">
                    <input
                      type="checkbox"
                      checked={formData.excludeFromCycle}
                      onChange={e => setFormData(prev => ({ ...prev, excludeFromCycle: e.target.checked }))}
                    />
                    <span>Exclude from automatic cycles</span>
                  </label>
                </>
              )}
            </div>
          </div>
        )}

        {/* Step 5: Review */}
        {step === 5 && (
          <div className="step-content">
            <div className="review-section">
              <h3>Review Your Custom Trait</h3>

              <div className="review-item">
                <span className="review-label">Location</span>
                <span className="review-value">
                  {formData.locationType === 'new-area'
                    ? `${formData.newAreaName} > ${formData.newGroupName}`
                    : formData.locationType === 'new-group'
                    ? `${formData.selectedArea} > ${formData.newGroupName} (new)`
                    : `${formData.selectedArea} > ${formData.selectedGroup}`
                  }
                </span>
              </div>

              <div className="review-item">
                <span className="review-label">Label</span>
                <span className="review-value">{formData.traitLabel}</span>
              </div>

              <div className="review-item">
                <span className="review-label">Field</span>
                <span className="review-value code">{formData.traitField}</span>
              </div>

              <div className="review-item">
                <span className="review-label">Type</span>
                <span className="review-value">{formData.traitType}</span>
              </div>

              {formData.traitType === 'select' && (
                <div className="review-item">
                  <span className="review-label">Options</span>
                  <span className="review-value">
                    {formData.selectOptions.filter(o => o.trim()).join(', ')}
                  </span>
                </div>
              )}

              {formData.includeTiming && (
                <div className="review-item">
                  <span className="review-label">Timing</span>
                  <span className="review-value">
                    {formData.timingSeason || 'Any season'}
                    {formData.timingMonth && ` / ${formData.timingMonth}`}
                    {formData.excludeFromCycle && ' (excluded from auto-cycles)'}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="step-navigation">
          {step > 1 && (
            <button className="nav-btn secondary" onClick={() => setStep(s => s - 1)}>
              Back
            </button>
          )}

          {step < (isEditMode ? 4 : 5) ? (
            <button
              className="nav-btn primary"
              onClick={() => setStep(s => s + 1)}
              disabled={!isStepValid()}
            >
              Next
            </button>
          ) : (
            <button
              className="nav-btn primary"
              onClick={handleSave}
              disabled={!isStepValid()}
            >
              {isEditMode ? 'Save Changes' : 'Create Trait'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default AddCustomTraitPage;
