import type { Trait } from '../data/traitData';
import './TraitField.css';

interface TraitFieldProps {
  trait: Trait;
  value: any;
  onChange: (field: string, value: any) => void;
  disabled?: boolean;
}

export default function TraitField({ trait, value, onChange, disabled = false }: TraitFieldProps) {
  const handleChange = (newValue: any) => {
    onChange(trait.field, newValue);
  };

  const renderField = () => {
    switch (trait.type) {
      case 'text':
        return (
          <input
            type="text"
            className="trait-input"
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={`Enter ${trait.label.toLowerCase()}`}
            disabled={disabled}
          />
        );

      case 'number':
        return (
          <input
            type="number"
            className="trait-input"
            value={value || ''}
            onChange={(e) => handleChange(e.target.value ? parseFloat(e.target.value) : null)}
            placeholder="0"
            disabled={disabled}
          />
        );

      case 'select':
        return (
          <select
            className="trait-select"
            value={value || ''}
            onChange={(e) => handleChange(e.target.value || null)}
            disabled={disabled}
          >
            <option value="">Select...</option>
            {trait.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case 'rating':
        const maxRating = trait.label.toLowerCase().includes('1-10') ? 10 : 5;
        return (
          <div className="trait-rating">
            {Array.from({ length: maxRating }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                type="button"
                className={`rating-btn ${value === num ? 'active' : ''}`}
                onClick={() => handleChange(value === num ? null : num)}
                disabled={disabled}
              >
                {num}
              </button>
            ))}
          </div>
        );

      case 'boolean':
        return (
          <div className="trait-toggle">
            <button
              type="button"
              className={`toggle-btn ${value === true ? 'active' : ''}`}
              onClick={() => handleChange(value === true ? null : true)}
              disabled={disabled}
            >
              Yes
            </button>
            <button
              type="button"
              className={`toggle-btn ${value === false ? 'active' : ''}`}
              onClick={() => handleChange(value === false ? null : false)}
              disabled={disabled}
            >
              No
            </button>
          </div>
        );

      default:
        return (
          <input
            type="text"
            className="trait-input"
            value={value || ''}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={`Enter ${trait.label.toLowerCase()}`}
            disabled={disabled}
          />
        );
    }
  };

  return (
    <div className="trait-field">
      <label className="trait-label">{trait.label}</label>
      {renderField()}
    </div>
  );
}
