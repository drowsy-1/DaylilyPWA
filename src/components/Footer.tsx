import './Footer.css';

interface FooterProps {
  isMenuOpen: boolean;
  onToggleMenu: () => void;
  onNavigate: (page: 'home' | 'trait-fields') => void;
}

function Footer({ isMenuOpen, onToggleMenu, onNavigate }: FooterProps) {
  const menuItems = [
    { label: 'Logout', action: () => console.log('Logout') },
    { label: 'Account', action: () => console.log('Account') },
    { label: 'Settings', action: () => console.log('Settings') },
    { label: 'Observation Cycle', action: () => console.log('Observation Cycle') },
    { label: 'Trait Fields', action: () => onNavigate('trait-fields') },
    { label: 'Observations', action: () => onNavigate('home') },
    { label: 'Inventory', action: () => console.log('Inventory') },
    { label: 'Breeding', action: () => console.log('Breeding') },
    { label: 'Store', action: () => console.log('Store') },
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
        <button className="footer-btn" aria-label="Home">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="16" cy="16" r="14" />
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
