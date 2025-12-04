import { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import WorkspaceOverview from './components/WorkspaceOverview';
import TabGroup from './components/TabGroup';
import ObservationsTab from './components/ObservationsTab';
import Footer from './components/Footer';
import TraitFieldsPage from './pages/TraitFieldsPage';

type Tab = 'observations' | 'inventory' | 'breeding' | 'store';
type Page = 'home' | 'trait-fields';

function App() {
  const [isDark, setIsDark] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('observations');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>('home');

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
    setIsMenuOpen(false);
  };

  return (
    <div className={`app ${isDark ? 'dark' : 'light'}`}>
      {currentPage === 'home' ? (
        <>
          <Header isDark={isDark} onToggleTheme={() => setIsDark(!isDark)} />
          <WorkspaceOverview 
            name="Demo Daylilies" 
            location="place, state"
            varieties={0}
            seedlings={0}
            totalActive={0}
          />
          <TabGroup activeTab={activeTab} onTabChange={setActiveTab} />
          
          <main className="content">
            {activeTab === 'observations' && <ObservationsTab />}
            {activeTab === 'inventory' && <div>Inventory Content</div>}
          </main>
        </>
      ) : currentPage === 'trait-fields' ? (
        <>
          <Header isDark={isDark} onToggleTheme={() => setIsDark(!isDark)} />
          <TraitFieldsPage isDark={isDark} />
        </>
      ) : null}

      <Footer 
        isMenuOpen={isMenuOpen} 
        onToggleMenu={() => setIsMenuOpen(!isMenuOpen)}
        onNavigate={handleNavigate}
      />
    </div>
  );
}

export default App;
