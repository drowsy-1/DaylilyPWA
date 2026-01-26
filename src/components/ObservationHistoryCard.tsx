import { useState } from 'react';
import { useTraitData } from '../contexts/TraitDataContext';
import { getTraitLabel as getTraitLabelFromMerged } from '../utils/traitMerger';
import './ObservationHistoryCard.css';

export interface FlattenedObservation {
  plantName: string;
  plantId: string;
  plantType: 'seedling' | 'variety';
  hybridizer: string;
  seedlingNum: string | null;
  nickname: string | null;
  location: string | null;
  observationDate: string;
  source: 'individual' | 'cycle';
  cycleName?: string;
  traitValues: Record<string, any>;
  notes?: string;
  photos?: string[];
  observer?: string;
  conditions?: string;
}

interface ObservationHistoryCardProps {
  observation: FlattenedObservation;
  selectedTraits: string[];
  onNavigateToPlant?: (plantId: string) => void;
}

// Format value for display
function formatValue(value: any): string {
  if (value === null || value === undefined) return '—';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (Array.isArray(value)) return value.join(', ');
  return String(value);
}

// Format date for display
function formatObservationDate(dateStr: string): { date: string; time: string } {
  const date = new Date(dateStr);
  const dateFormatted = date.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
  const timeFormatted = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit'
  });
  return { date: dateFormatted, time: timeFormatted };
}

function ObservationHistoryCard({
  observation,
  selectedTraits,
  onNavigateToPlant
}: ObservationHistoryCardProps) {
  const { mergedTraitData } = useTraitData();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showFullObservation, setShowFullObservation] = useState(false);

  // Get human-readable label for a trait field
  const getTraitLabel = (field: string): string => {
    return getTraitLabelFromMerged(mergedTraitData, field);
  };

  const { date } = formatObservationDate(observation.observationDate);
  const traitCount = Object.keys(observation.traitValues).length;

  // Determine which traits to show
  const traitsToShow = showFullObservation
    ? Object.keys(observation.traitValues)
    : selectedTraits.length > 0
      ? selectedTraits.filter(trait => observation.traitValues[trait] !== undefined)
      : Object.keys(observation.traitValues).slice(0, 5); // Show first 5 by default

  const hasMoreTraits = !showFullObservation && traitCount > traitsToShow.length;

  return (
    <div className={`observation-history-card ${isExpanded ? 'expanded' : ''}`}>
      {/* Collapsed header - always visible */}
      <div className="card-header" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="card-header-main">
          <div className="date-info">
            <span className="observation-date">{date}</span>
            <span className={`source-badge ${observation.source}`}>
              {observation.source === 'cycle' ? 'Cycle' : 'Individual'}
            </span>
          </div>
          <div className="plant-info">
            <span
              className="plant-name"
              onClick={(e) => {
                if (onNavigateToPlant) {
                  e.stopPropagation();
                  onNavigateToPlant(observation.plantId);
                }
              }}
            >
              {observation.plantName}
            </span>
            {observation.nickname && (
              <span className="plant-nickname">"{observation.nickname}"</span>
            )}
          </div>
        </div>
        <div className="card-header-meta">
          <span className={`type-badge ${observation.plantType}`}>
            {observation.plantType === 'seedling' ? 'Seedling' : 'Variety'}
          </span>
          <span className="trait-count">{traitCount} trait{traitCount !== 1 ? 's' : ''}</span>
          <span className={`expand-icon ${isExpanded ? 'expanded' : ''}`}>▼</span>
        </div>
      </div>

      {/* Expanded content */}
      {isExpanded && (
        <div className="card-content">
          {/* Plant metadata */}
          <div className="plant-metadata">
            <div className="metadata-item">
              <span className="metadata-label">Hybridizer:</span>
              <span className="metadata-value">{observation.hybridizer}</span>
            </div>
            {observation.location && (
              <div className="metadata-item">
                <span className="metadata-label">Location:</span>
                <span className="metadata-value">{observation.location}</span>
              </div>
            )}
            {observation.seedlingNum && (
              <div className="metadata-item">
                <span className="metadata-label">Seedling #:</span>
                <span className="metadata-value">{observation.seedlingNum}</span>
              </div>
            )}
            {observation.cycleName && (
              <div className="metadata-item">
                <span className="metadata-label">Cycle:</span>
                <span className="metadata-value">{observation.cycleName}</span>
              </div>
            )}
            {observation.observer && (
              <div className="metadata-item">
                <span className="metadata-label">Observer:</span>
                <span className="metadata-value">{observation.observer}</span>
              </div>
            )}
          </div>

          {/* Trait values */}
          {traitsToShow.length > 0 && (
            <div className="trait-values">
              <h4 className="traits-heading">
                {showFullObservation ? 'All Traits' : selectedTraits.length > 0 ? 'Selected Traits' : 'Key Traits'}
              </h4>
              <div className="traits-grid">
                {traitsToShow.map(field => (
                  <div key={field} className="trait-row">
                    <span className="trait-label">{getTraitLabel(field)}</span>
                    <span className="trait-value">{formatValue(observation.traitValues[field])}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes and conditions */}
          {observation.notes && (
            <div className="observation-notes">
              <span className="notes-label">Notes:</span>
              <span className="notes-text">{observation.notes}</span>
            </div>
          )}
          {observation.conditions && (
            <div className="observation-conditions">
              <span className="conditions-label">Conditions:</span>
              <span className="conditions-text">{observation.conditions}</span>
            </div>
          )}

          {/* Photos indicator */}
          {observation.photos && observation.photos.length > 0 && (
            <div className="photos-indicator">
              <span className="photos-icon">📷</span>
              <span>{observation.photos.length} photo{observation.photos.length !== 1 ? 's' : ''}</span>
            </div>
          )}

          {/* Show full observation button */}
          {hasMoreTraits && (
            <button
              className="show-full-btn"
              onClick={(e) => {
                e.stopPropagation();
                setShowFullObservation(true);
              }}
            >
              Show Full Observation ({traitCount} traits)
            </button>
          )}
          {showFullObservation && (
            <button
              className="show-full-btn secondary"
              onClick={(e) => {
                e.stopPropagation();
                setShowFullObservation(false);
              }}
            >
              Show Less
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default ObservationHistoryCard;
