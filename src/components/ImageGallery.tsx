import { useState } from 'react';
import './ImageGallery.css';
import type { PlantImage } from '../utils/observationAggregation';

interface ImageGalleryProps {
  images: PlantImage[];
  plantName?: string;
  thumbnailUrl?: string;
  onSetThumbnail?: (imageUrl: string) => void;
}

type FilterSource = 'all' | 'cycle' | 'observation' | 'note' | 'base';

function ImageGallery({ images, plantName, thumbnailUrl, onSetThumbnail }: ImageGalleryProps) {
  const [filter, setFilter] = useState<FilterSource>('all');
  const [selectedImage, setSelectedImage] = useState<PlantImage | null>(null);
  const [selectedForDownload, setSelectedForDownload] = useState<Set<string>>(new Set());
  const [selectionMode, setSelectionMode] = useState(false);

  const filteredImages = filter === 'all'
    ? images
    : images.filter(img => img.source === filter);

  // Count by source for filter buttons
  const sourceCounts = images.reduce((acc, img) => {
    acc[img.source] = (acc[img.source] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getSourceLabel = (source: string) => {
    switch (source) {
      case 'cycle':
        return 'Observation Cycle';
      case 'observation':
        return 'Trait Observation';
      case 'note':
        return 'Note';
      case 'base':
        return 'Base Image';
      default:
        return source;
    }
  };

  const toggleImageSelection = (imageUrl: string) => {
    setSelectedForDownload(prev => {
      const newSet = new Set(prev);
      if (newSet.has(imageUrl)) {
        newSet.delete(imageUrl);
      } else {
        newSet.add(imageUrl);
      }
      return newSet;
    });
  };

  const selectAllImages = () => {
    setSelectedForDownload(new Set(filteredImages.map(img => img.url)));
  };

  const clearSelection = () => {
    setSelectedForDownload(new Set());
  };

  const handleDownloadSelected = async () => {
    // In a real implementation, this would download actual image files
    // For now, we'll show an alert with the selected images
    const selectedImages = images.filter(img => selectedForDownload.has(img.url));

    if (selectedImages.length === 0) {
      alert('No images selected for download');
      return;
    }

    // For demonstration - in production, this would use proper file download
    alert(`Download ${selectedImages.length} image(s):\n${selectedImages.map(img => img.url).join('\n')}`);

    // Reset selection mode after download
    setSelectionMode(false);
    setSelectedForDownload(new Set());
  };

  const handleDownloadSingle = (image: PlantImage) => {
    // In a real implementation, this would trigger a file download
    alert(`Download: ${image.url}`);
  };

  const handleSetAsThumbnail = (imageUrl: string) => {
    if (onSetThumbnail) {
      onSetThumbnail(imageUrl);
    }
    setSelectedImage(null);
  };

  if (images.length === 0) {
    return (
      <div className="image-gallery empty">
        <div className="empty-icon">📷</div>
        <p>No images yet</p>
      </div>
    );
  }

  return (
    <div className="image-gallery">
      <div className="gallery-header">
        <div className="gallery-title">
          <h3>{images.length} Photo{images.length !== 1 ? 's' : ''}</h3>
          {selectionMode && (
            <span className="selection-count">
              {selectedForDownload.size} selected
            </span>
          )}
        </div>

        <div className="gallery-actions">
          {selectionMode ? (
            <>
              <button className="gallery-btn" onClick={selectAllImages}>
                Select All
              </button>
              <button className="gallery-btn" onClick={clearSelection}>
                Clear
              </button>
              <button
                className="gallery-btn primary"
                onClick={handleDownloadSelected}
                disabled={selectedForDownload.size === 0}
              >
                Download ({selectedForDownload.size})
              </button>
              <button className="gallery-btn" onClick={() => {
                setSelectionMode(false);
                setSelectedForDownload(new Set());
              }}>
                Cancel
              </button>
            </>
          ) : (
            <button className="gallery-btn" onClick={() => setSelectionMode(true)}>
              Select for Download
            </button>
          )}
        </div>
      </div>

      {Object.keys(sourceCounts).length > 1 && (
        <div className="filter-row">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({images.length})
          </button>
          {sourceCounts.cycle && (
            <button
              className={`filter-btn ${filter === 'cycle' ? 'active' : ''}`}
              onClick={() => setFilter('cycle')}
            >
              Cycles ({sourceCounts.cycle})
            </button>
          )}
          {sourceCounts.observation && (
            <button
              className={`filter-btn ${filter === 'observation' ? 'active' : ''}`}
              onClick={() => setFilter('observation')}
            >
              Observations ({sourceCounts.observation})
            </button>
          )}
          {sourceCounts.note && (
            <button
              className={`filter-btn ${filter === 'note' ? 'active' : ''}`}
              onClick={() => setFilter('note')}
            >
              Notes ({sourceCounts.note})
            </button>
          )}
        </div>
      )}

      <div className="gallery-grid">
        {filteredImages.map((image, idx) => (
          <div
            key={`${image.url}-${idx}`}
            className={`gallery-item ${selectionMode ? 'selectable' : ''} ${selectedForDownload.has(image.url) ? 'selected' : ''} ${thumbnailUrl === image.url ? 'is-thumbnail' : ''}`}
            onClick={() => {
              if (selectionMode) {
                toggleImageSelection(image.url);
              } else {
                setSelectedImage(image);
              }
            }}
          >
            {selectionMode && (
              <div className="selection-checkbox">
                {selectedForDownload.has(image.url) ? '✓' : ''}
              </div>
            )}
            {thumbnailUrl === image.url && (
              <div className="thumbnail-badge">Thumbnail</div>
            )}
            <div className="image-placeholder">
              <svg width="40" height="40" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
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
              <span className="image-filename">{image.url}</span>
            </div>
            <div className="image-info">
              <span className="source-tag">{image.source}</span>
              {image.date && <span className="image-date">{formatDate(image.date)}</span>}
            </div>
          </div>
        ))}
      </div>

      {selectedImage && (
        <div className="lightbox" onClick={() => setSelectedImage(null)}>
          <div className="lightbox-content" onClick={e => e.stopPropagation()}>
            <button className="lightbox-close" onClick={() => setSelectedImage(null)}>
              ×
            </button>
            <div className="lightbox-image">
              <div className="image-placeholder large">
                <svg width="80" height="80" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
                  <defs>
                    <path id="petal-lg" d="M50 5C 42 22, 44 36, 46 52L 54 52C 56 36, 58 22, 50 5 Z" />
                    <path id="sepal-lg" d="M50 0C 38 18, 40 38, 44 56L 56 56C 60 38, 62 18, 50 0 Z" />
                  </defs>
                  <use href="#petal-lg" transform="rotate(0 50 50)" />
                  <use href="#sepal-lg" transform="rotate(60 50 50)" />
                  <use href="#petal-lg" transform="rotate(120 50 50)" />
                  <use href="#sepal-lg" transform="rotate(180 50 50)" />
                  <use href="#petal-lg" transform="rotate(240 50 50)" />
                  <use href="#sepal-lg" transform="rotate(300 50 50)" />
                  <circle cx="50" cy="50" r="4.5" />
                </svg>
                <span className="image-filename">{selectedImage.url}</span>
              </div>
            </div>
            <div className="lightbox-details">
              {plantName && <h4>{plantName}</h4>}
              <p className="source">{getSourceLabel(selectedImage.source)}</p>
              {selectedImage.sourceName && (
                <p className="source-name">{selectedImage.sourceName}</p>
              )}
              {selectedImage.date && (
                <p className="date">{formatDate(selectedImage.date)}</p>
              )}
            </div>
            <div className="lightbox-actions">
              <button
                className="lightbox-btn"
                onClick={() => handleDownloadSingle(selectedImage)}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Download
              </button>
              {onSetThumbnail && (
                <button
                  className={`lightbox-btn ${thumbnailUrl === selectedImage.url ? 'active' : ''}`}
                  onClick={() => handleSetAsThumbnail(selectedImage.url)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                  {thumbnailUrl === selectedImage.url ? 'Current Thumbnail' : 'Set as Thumbnail'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ImageGallery;
