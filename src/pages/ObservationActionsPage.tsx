import './ObservationActionsPage.css';
import type { Page } from '../types';

interface ObservationActionsPageProps {
  onNavigate: (page: Page) => void;
  onOpenCamera: () => void;
}

function ObservationActionsPage({ onNavigate, onOpenCamera }: ObservationActionsPageProps) {
  const actions = [
    {
      id: 'add-plant',
      label: 'Add Seedling / Variety',
      description: 'Add a new plant to your inventory',
      icon: '+',
    },
    {
      id: 'continue-variety',
      label: 'Continue Variety Observation',
      description: 'Resume observation on a variety',
      icon: '→',
    },
    {
      id: 'continue-seedling',
      label: 'Continue Seedling Observation',
      description: 'Resume observation on a seedling',
      icon: '→',
    },
    {
      id: 'continue-seedling-group',
      label: 'Continue Seedling Group',
      description: 'Resume observation on a seedling group',
      icon: '→',
    },
    {
      id: 'add-note',
      label: 'Add Notes',
      description: 'Record general observations or notes',
      icon: '+',
    },
    {
      id: 'camera',
      label: 'Take Photo',
      description: 'Capture a photo and add to notes',
      icon: '📷',
      isCamera: true,
    },
  ];

  return (
    <div className="observation-actions-page">
      <div className="page-header">
        <button className="back-btn" onClick={() => onNavigate('home')}>
          <span className="back-icon">←</span>
        </button>
        <h1>Observation Actions</h1>
        <div className="header-spacer"></div>
      </div>

      <div className="page-content">
        <div className="actions-list">
          {actions.map(action => (
            <button
              key={action.id}
              className="action-card"
              onClick={() => {
                if (action.isCamera) {
                  onOpenCamera();
                } else {
                  onNavigate(action.id as Page);
                }
              }}
            >
              <div className="action-icon">
                <span className="icon-circle">{action.icon}</span>
              </div>
              <div className="action-info">
                <span className="action-label">{action.label}</span>
                <span className="action-description">{action.description}</span>
              </div>
              <span className="action-arrow">→</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ObservationActionsPage;
