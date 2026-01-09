import './AddPlantPage.css';

type AddPlantOption = 'add-variety' | 'add-seedling' | 'add-seedling-group' | 'continue-seedling-group';

interface AddPlantPageProps {
  onNavigate: (page: 'home' | 'add-variety' | 'add-seedling' | 'add-seedling-group' | 'continue-seedling-group') => void;
}

function AddPlantPage({ onNavigate }: AddPlantPageProps) {
  const options: { id: AddPlantOption; label: string; description: string }[] = [
    {
      id: 'add-variety',
      label: 'Add New Variety',
      description: 'Search and import a registered variety'
    },
    {
      id: 'add-seedling',
      label: 'Add New Seedling',
      description: 'Add a single seedling with cross info'
    },
    {
      id: 'add-seedling-group',
      label: 'Add New Seedling Group',
      description: 'Add multiple seedlings from the same cross'
    },
    {
      id: 'continue-seedling-group',
      label: 'Continue Seedling Group',
      description: 'Resume adding to an existing group'
    }
  ];

  return (
    <div className="add-plant-page">
      <div className="page-header">
        <button className="back-btn" onClick={() => onNavigate('home')}>
          <span className="back-icon">←</span>
        </button>
        <h1>Add Seedling / Variety</h1>
        <div className="header-spacer"></div>
      </div>

      <div className="page-content">
        <div className="options-list">
          {options.map(option => (
            <button
              key={option.id}
              className="option-card"
              onClick={() => onNavigate(option.id)}
            >
              <div className="option-icon">
                <span className="icon-circle">+</span>
              </div>
              <div className="option-info">
                <span className="option-label">{option.label}</span>
                <span className="option-description">{option.description}</span>
              </div>
              <span className="option-arrow">→</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AddPlantPage;
