import { useState } from 'react';
import './TraitObservationCard.css';
import type { AggregatedObservation } from '../utils/observationAggregation';
import { formatDisplayValue } from '../utils/observationAggregation';

interface TraitObservationCardProps {
  observation: AggregatedObservation;
}

function TraitObservationCard({ observation }: TraitObservationCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const {
    traitField,
    label,
    currentValue,
    valueType,
    observations,
    range,
    valueCount,
    hasConflicts
  } = observation;

  const displayLabel = label || traitField.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  const displayValue = formatDisplayValue(currentValue, traitField);

  const getValueTypeLabel = () => {
    switch (valueType) {
      case 'mean':
        return 'avg';
      case 'mode':
        return 'most common';
      case 'latest':
        return 'latest';
      default:
        return '';
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className={`trait-observation-card ${hasConflicts ? 'has-conflicts' : ''}`}>
      <div
        className="card-header"
        onClick={() => observations.length > 1 && setIsExpanded(!isExpanded)}
      >
        <div className="card-main">
          <span className="trait-label">{displayLabel}</span>
          <div className="value-container">
            <span className="trait-value">{displayValue}</span>
            {valueType !== 'single' && (
              <span className="value-type">({getValueTypeLabel()})</span>
            )}
          </div>
        </div>

        <div className="card-meta">
          {range && (
            <span className="range-badge">
              range: {range.min}–{range.max}
            </span>
          )}
          {hasConflicts && (
            <span className="conflict-badge" title="Values differ between observations">
              varies
            </span>
          )}
          <span className="observation-count">
            {observations.length} observation{observations.length !== 1 ? 's' : ''}
          </span>
          {observations.length > 1 && (
            <span className={`expand-icon ${isExpanded ? 'expanded' : ''}`}>
              ▼
            </span>
          )}
        </div>
      </div>

      {isExpanded && observations.length > 1 && (
        <div className="observation-history">
          {valueCount && Object.keys(valueCount).length > 1 && (
            <div className="value-distribution">
              {Object.entries(valueCount).map(([value, count]) => (
                <span key={value} className="distribution-item">
                  {value}: {count}×
                </span>
              ))}
            </div>
          )}

          <div className="history-list">
            {observations.map((obs, idx) => (
              <div key={idx} className="history-item">
                <div className="history-date">{formatDate(obs.observationDate)}</div>
                <div className="history-value">{formatDisplayValue(obs.value, traitField)}</div>
                <div className="history-meta">
                  {obs.observer && <span className="observer">{obs.observer}</span>}
                  {obs.conditions && <span className="conditions">{obs.conditions}</span>}
                </div>
                {obs.notes && <div className="history-notes">{obs.notes}</div>}
                {obs.photos && obs.photos.length > 0 && (
                  <div className="history-photos">
                    {obs.photos.map((photo, pIdx) => (
                      <span key={pIdx} className="photo-indicator" title={photo}>
                        📷
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default TraitObservationCard;
