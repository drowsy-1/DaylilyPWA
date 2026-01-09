import './ObservationsTab.css';

interface ObservationsTabProps {
  onNavigate: (page: 'add-note' | 'add-plant' | 'continue-observation') => void;
}

function ObservationsTab({ onNavigate }: ObservationsTabProps) {
  return (
    <div className="observations-tab">
      <div className="action-buttons">
        <button className="action-btn" onClick={() => onNavigate('add-plant')}>
          <span className="btn-icon">+</span>
          Add Seedling / Variety
        </button>
        <button className="action-btn" onClick={() => onNavigate('continue-observation')}>
          <span className="btn-icon">+</span>
          Continue Observation
        </button>
        <button className="action-btn" onClick={() => onNavigate('add-note')}>
          <span className="btn-icon">+</span>
          Add Notes
        </button>
      </div>

      <section className="activity-section">
        <h2>Recent Activity:</h2>
        <div className="activity-list">
          {/* Activity items will go here */}
        </div>
      </section>

      <section className="todo-section">
        <h2>To Do:</h2>
        <div className="todo-list">
          {/* Todo items will go here */}
        </div>
      </section>
    </div>
  );
}

export default ObservationsTab;
