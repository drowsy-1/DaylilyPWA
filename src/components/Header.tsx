import './Header.css';

interface HeaderProps {
  isDark: boolean;
  onToggleTheme: () => void;
}

function Header({ isDark, onToggleTheme }: HeaderProps) {
  return (
    <header className="header">
      <button className="theme-toggle" onClick={onToggleTheme} aria-label="Toggle theme">
        {isDark ? '☀️' : '🌙'}
      </button>
    </header>
  );
}

export default Header;
