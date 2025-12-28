import './Footer.css';

interface FooterProps {
  isMenuOpen: boolean;
  onToggleMenu: () => void;
  onNavigate: (page: 'home' | 'trait-fields' | 'observation-cycles' | 'inventory') => void;
}

function Footer({ isMenuOpen, onToggleMenu, onNavigate }: FooterProps) {
  const menuItems = [
    { label: 'Home', action: () => onNavigate('home') },
    { label: 'Observations', action: () => onNavigate('home') },
    { label: 'Inventory', action: () => onNavigate('inventory') },
    { label: 'Breeding', action: () => console.log('Breeding') },
    { label: 'Store', action: () => console.log('Store') },
    { label: 'Trait Fields', action: () => onNavigate('trait-fields') },
    { label: 'Observation Cycle', action: () => onNavigate('observation-cycles') },
    { label: 'Settings', action: () => console.log('Settings') },
    { label: 'Account', action: () => console.log('Account') },
    { label: 'Logout', action: () => console.log('Logout') },
  ];

  return (
    <>
      {isMenuOpen && (
        <div className="menu-overlay" onClick={onToggleMenu}>
          <div className="menu-panel" onClick={(e) => e.stopPropagation()}>
            <div className="menu-header">
              <h2>Menu</h2>
              <button className="menu-close" onClick={onToggleMenu} aria-label="Close menu">
                ✕
              </button>
            </div>
            <ul className="menu-list">
              {menuItems.map((item, index) => (
                <li key={index}>
                  <button className="menu-item" onClick={item.action}>
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      
      <footer className="footer">
        <button className="footer-btn" onClick={() => onNavigate('home')} aria-label="Home">
          <svg width="38" height="38" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
            <defs>
              <path id="petal" d="M50 5C 42 22, 44 36, 46 52L 54 52C 56 36, 58 22, 50 5 Z" />
              <path id="sepal" d="M50 0C 38 18, 40 38, 44 56L 56 56C 60 38, 62 18, 50 0 Z" />
            </defs>
            
            {/* Alternating petals and sepals */}
            <use href="#petal" transform="rotate(0 50 50)" />
            <use href="#sepal" transform="rotate(60 50 50)" />
            <use href="#petal" transform="rotate(120 50 50)" />
            <use href="#sepal" transform="rotate(180 50 50)" />
            <use href="#petal" transform="rotate(240 50 50)" />
            <use href="#sepal" transform="rotate(300 50 50)" />
            
            {/* Center circle */}
            <circle cx="50" cy="50" r="4.5" />
            
            {/* Stamens */}
            <line x1="50" y1="50" x2="50" y2="32" />
            <circle cx="50" cy="31" r="1.6" />
            <line x1="46" y1="50" x2="43" y2="36" />
            <circle cx="42.5" cy="35" r="1.6" />
            <line x1="54" y1="50" x2="57" y2="36" />
            <circle cx="57.5" cy="35" r="1.6" />
          </svg>
        </button>
        
        <button className="footer-btn" aria-label="Camera">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="4" y="8" width="24" height="18" rx="2" />
            <circle cx="16" cy="17" r="5" />
            <circle cx="24" cy="11" r="1" fill="currentColor" />
          </svg>
        </button>
        
        <button className="footer-btn footer-btn-add" aria-label="Add">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="20" y1="8" x2="20" y2="32" />
            <line x1="8" y1="20" x2="32" y2="20" />
          </svg>
        </button>
        
        <button className="footer-btn" aria-label="Search">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="14" cy="14" r="8" />
            <line x1="20" y1="20" x2="26" y2="26" />
          </svg>
        </button>
        
        <button className="footer-btn" onClick={onToggleMenu} aria-label="Menu">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="6" y1="10" x2="26" y2="10" />
            <line x1="6" y1="16" x2="26" y2="16" />
            <line x1="6" y1="22" x2="26" y2="22" />
          </svg>
        </button>
      </footer>
    </>
  );
}

export default Footer;
