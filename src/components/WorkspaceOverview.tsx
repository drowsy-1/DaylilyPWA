import './WorkspaceOverview.css';

interface WorkspaceOverviewProps {
  name: string;
  location: string;
  varieties: number;
  seedlings: number;
  totalActive: number;
}

function WorkspaceOverview({ name, location, varieties, seedlings, totalActive }: WorkspaceOverviewProps) {
  return (
    <div className="workspace-overview">
      <h1 className="workspace-name">{name}</h1>
      <div className="workspace-location">
        <span className="location-icon">📍</span>
        <span>Location: {location}</span>
      </div>
      <div className="workspace-stats">
        <div className="stat-box"># Varieties<br/>{varieties}</div>
        <div className="stat-box"># seedlings<br/>{seedlings}</div>
        <div className="stat-box"># total active<br/>{totalActive}</div>
      </div>
    </div>
  );
}

export default WorkspaceOverview;
