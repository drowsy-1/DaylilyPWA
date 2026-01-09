import { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import WorkspaceOverview from './components/WorkspaceOverview';
import TabGroup from './components/TabGroup';
import ObservationsTab from './components/ObservationsTab';
import Footer from './components/Footer';
import TraitFieldsPage from './pages/TraitFieldsPage';
import ObservationCyclesPage from './pages/ObservationCyclesPage';
import InventoryPage from './pages/InventoryPage';
import AddNotePage from './pages/AddNotePage';
import AddPlantPage from './pages/AddPlantPage';
import AddVarietyPage from './pages/AddVarietyPage';
import AddSeedlingPage from './pages/AddSeedlingPage';
import { getInventoryStats } from './data/mockInventory';
import type { NoteData } from './pages/AddNotePage';
import type { VarietyData } from './pages/AddVarietyPage';
import type { SeedlingData } from './pages/AddSeedlingPage';

type Tab = 'observations' | 'inventory' | 'breeding' | 'store';
type Page = 'home' | 'trait-fields' | 'observation-cycles' | 'inventory' | 'add-note' | 'add-plant' | 'add-variety' | 'add-seedling' | 'add-seedling-group' | 'continue-seedling-group' | 'continue-observation';

function App() {
  const [isDark, setIsDark] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('observations');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [notes, setNotes] = useState<NoteData[]>([]);
  const [varieties, setVarieties] = useState<VarietyData[]>([]);
  const [seedlings, setSeedlings] = useState<SeedlingData[]>([]);

  // Get real inventory stats
  const inventoryStats = getInventoryStats();

  const handleSaveNote = (note: NoteData) => {
    setNotes([note, ...notes]);
    console.log('Note saved:', note);
  };

  const handleSaveVariety = (variety: VarietyData) => {
    setVarieties([variety, ...varieties]);
    console.log('Variety saved:', variety);
  };

  const handleSaveSeedling = (seedling: SeedlingData) => {
    setSeedlings([seedling, ...seedlings]);
    console.log('Seedling saved:', seedling);
  };

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

  const handleTabChange = (tab: Tab) => {
    if (tab === 'inventory') {
      handleNavigate('inventory');
    } else {
      setActiveTab(tab);
    }
  };

  return (
    <div className={`app ${isDark ? 'dark' : 'light'}`}>
      {currentPage === 'home' ? (
        <>
          <Header isDark={isDark} onToggleTheme={() => setIsDark(!isDark)} />
          <WorkspaceOverview 
            name="Demo Daylilies" 
            location="place, state"
            varieties={inventoryStats.hybridizers.riceJA + inventoryStats.hybridizers.reeder + inventoryStats.hybridizers.mahieu}
            seedlings={inventoryStats.total - (inventoryStats.hybridizers.riceJA + inventoryStats.hybridizers.reeder + inventoryStats.hybridizers.mahieu)}
            totalActive={inventoryStats.inStock}
          />
          <TabGroup activeTab={activeTab} onTabChange={handleTabChange} />
          
          <main className="content">
            {activeTab === 'observations' && <ObservationsTab onNavigate={handleNavigate} />}
            {activeTab === 'breeding' && <div>Breeding Content</div>}
          </main>
        </>
      ) : currentPage === 'trait-fields' ? (
        <>
          <Header isDark={isDark} onToggleTheme={() => setIsDark(!isDark)} />
          <TraitFieldsPage />
        </>
      ) : currentPage === 'observation-cycles' ? (
        <>
          <Header isDark={isDark} onToggleTheme={() => setIsDark(!isDark)} />
          <ObservationCyclesPage />
        </>
      ) : currentPage === 'inventory' ? (
        <>
          <Header isDark={isDark} onToggleTheme={() => setIsDark(!isDark)} />
          <InventoryPage onNavigate={handleNavigate} />
        </>
      ) : currentPage === 'add-note' ? (
        <AddNotePage onNavigate={handleNavigate} onSave={handleSaveNote} />
      ) : currentPage === 'add-plant' ? (
        <AddPlantPage onNavigate={handleNavigate} />
      ) : currentPage === 'add-variety' ? (
        <AddVarietyPage onNavigate={handleNavigate} onSave={handleSaveVariety} />
      ) : currentPage === 'add-seedling' ? (
        <AddSeedlingPage onNavigate={handleNavigate} onSave={handleSaveSeedling} />
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
