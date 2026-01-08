import './ObservationsTab.css';

function ObservationsTab() {
  return (
    <div className="observations-tab">
      <div className="action-buttons">
        <button className="action-btn">+ variety / seedling</button>
        <button className="action-btn">continue observation</button>
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
