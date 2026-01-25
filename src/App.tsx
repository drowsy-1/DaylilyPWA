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
import AddSeedlingGroupPage from './pages/AddSeedlingGroupPage';
import ContinueVarietyPage from './pages/ContinueVarietyPage';
import ContinueSeedlingPage from './pages/ContinueSeedlingPage';
import ContinueSeedlingGroupPage from './pages/ContinueSeedlingGroupPage';
import TraitObservationPage from './pages/TraitObservationPage';
import CrossesPage from './pages/CrossesPage';
import AssignedCrossesPage from './pages/AssignedCrossesPage';
import ObservationHistoryPage from './pages/ObservationHistoryPage';
import { getInventoryStats } from './data/mockInventory';
import type { NoteData } from './pages/AddNotePage';
import type { VarietyData } from './pages/AddVarietyPage';
import type { SeedlingData } from './pages/AddSeedlingPage';
import type { SeedlingGroupData } from './pages/AddSeedlingGroupPage';
import type { Page, CrossData, CrossAssignment, PlantDetailContext } from './types';
import { DEFAULT_SUMMARY_FIELDS } from './types';
import SummaryFieldsPage from './pages/SummaryFieldsPage';
import PlantDetailPage from './pages/PlantDetailPage';

type Tab = 'observations' | 'inventory' | 'breeding' | 'store';

interface NavigationData {
  year?: number;
}

interface ObservationContext {
  plantType: 'variety' | 'seedling';
  plantId: string;
  plantData: VarietyData | SeedlingData;
}

function App() {
  const [isDark, setIsDark] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('observations');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [notes, setNotes] = useState<NoteData[]>([]);
  const [varieties, setVarieties] = useState<VarietyData[]>([]);
  const [seedlings, setSeedlings] = useState<SeedlingData[]>([]);
  const [seedlingGroups, setSeedlingGroups] = useState<SeedlingGroupData[]>([]);
  const [crosses, setCrosses] = useState<CrossData[]>([]);
  const [crossAssignments, setCrossAssignments] = useState<CrossAssignment[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [observationContext, setObservationContext] = useState<ObservationContext | null>(null);
  const [summaryFields, setSummaryFields] = useState<string[]>(DEFAULT_SUMMARY_FIELDS);
  const [plantDetailContext, setPlantDetailContext] = useState<PlantDetailContext | null>(null);
  const [observationHistoryFilters, setObservationHistoryFilters] = useState<Record<string, string> | null>(null);
  const [observationHistoryReturnTo, setObservationHistoryReturnTo] = useState<{ page: Page; data?: unknown } | null>(null);

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

  const handleSaveSeedlingGroup = (seedlingsData: SeedlingGroupData[]) => {
    setSeedlingGroups([...seedlingsData, ...seedlingGroups]);
    console.log('Seedling group saved:', seedlingsData);
  };

  const handleSaveCross = (cross: CrossData) => {
    setCrosses([cross, ...crosses]);
    console.log('Cross saved:', cross);
  };

  const handleAssignCrosses = (crossIds: string[], year: number) => {
    const newAssignments: CrossAssignment[] = crossIds
      .filter(crossId => !crossAssignments.some(a => a.crossId === crossId && a.year === year))
      .map(crossId => ({
        id: crypto.randomUUID(),
        crossId,
        year,
        crossCount: 0,
        dateAssigned: new Date().toISOString(),
        completed: false,
      }));
    setCrossAssignments([...crossAssignments, ...newAssignments]);
    console.log('Crosses assigned:', newAssignments);
  };

  const handleUpdateCrossCount = (assignmentId: string, count: number) => {
    setCrossAssignments(crossAssignments.map(a =>
      a.id === assignmentId
        ? { ...a, crossCount: count }
        : a
    ));
    // Update lastUsed on the cross
    const assignment = crossAssignments.find(a => a.id === assignmentId);
    if (assignment) {
      setCrosses(crosses.map(c =>
        c.id === assignment.crossId
          ? { ...c, lastUsed: new Date().toISOString() }
          : c
      ));
    }
  };

  
  const handleUpdateSeedlingGroup = (updatedSeedlings: SeedlingGroupData[]) => {
    // Update existing seedlings in the seedlingGroups array
    const updatedIds = new Set(updatedSeedlings.map(s => s.id));
    const remainingGroups = seedlingGroups.filter(s => !updatedIds.has(s.id));
    setSeedlingGroups([...updatedSeedlings, ...remainingGroups]);
    console.log('Seedling group updated:', updatedSeedlings);
  };

  const handleSaveObservations = (observations: Record<string, any>) => {
    console.log('Observations saved:', observations);
    // TODO: Save observations to state/storage
  };

  const handleNavigateWithContext = (page: Page, context: ObservationContext) => {
    setObservationContext(context);
    setCurrentPage(page);
    setIsMenuOpen(false);
  };

  const handleNavigateToPlantDetail = (context: PlantDetailContext) => {
    setPlantDetailContext(context);
    setCurrentPage('plant-detail');
    setIsMenuOpen(false);
  };

  const handleSaveSummaryFields = (fields: string[]) => {
    setSummaryFields(fields);
    // TODO: Persist to localStorage
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

  const handleNavigate = (page: Page, data?: unknown) => {
    setCurrentPage(page);
    setIsMenuOpen(false);
    if (data && typeof data === 'object') {
      if ('year' in data) {
        setSelectedYear((data as NavigationData).year!);
      }
      if (page === 'plant-detail' && 'plantId' in data && 'plantType' in data) {
        setPlantDetailContext(data as PlantDetailContext);
      }
      if (page === 'observation-history') {
        if ('varietyName' in data) {
          setObservationHistoryFilters(data as Record<string, string>);
        } else {
          setObservationHistoryFilters(null);
        }
        if ('returnTo' in data) {
          setObservationHistoryReturnTo((data as { returnTo: { page: Page; data?: unknown } }).returnTo);
        } else {
          setObservationHistoryReturnTo(null);
        }
      }
    } else if (page === 'observation-history') {
      setObservationHistoryFilters(null);
      setObservationHistoryReturnTo(null);
    }
  };

  const handleTabChange = (tab: Tab) => {
    if (tab === 'inventory') {
      handleNavigate('inventory');
    } else if (tab === 'breeding') {
      handleNavigate('crosses');
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
      ) : currentPage === 'summary-fields' ? (
        <SummaryFieldsPage
          selectedFields={summaryFields}
          onSave={handleSaveSummaryFields}
          onNavigate={handleNavigate}
          isDark={isDark}
          onToggleTheme={() => setIsDark(!isDark)}
        />
      ) : currentPage === 'inventory' ? (
        <>
          <Header isDark={isDark} onToggleTheme={() => setIsDark(!isDark)} />
          <InventoryPage
            onNavigate={handleNavigate}
            onNavigateToPlantDetail={handleNavigateToPlantDetail}
            summaryFields={summaryFields}
          />
        </>
      ) : currentPage === 'plant-detail' && plantDetailContext ? (
        <PlantDetailPage
          plantType={plantDetailContext.plantType}
          plantId={plantDetailContext.plantId}
          summaryFields={summaryFields}
          onNavigate={handleNavigate}
          isDark={isDark}
          onToggleTheme={() => setIsDark(!isDark)}
        />
      ) : currentPage === 'observation-history' ? (
        <ObservationHistoryPage
          onNavigate={handleNavigate}
          isDark={isDark}
          onToggleTheme={() => setIsDark(!isDark)}
          initialFilters={observationHistoryFilters || undefined}
        />
      ) : currentPage === 'crosses' ? (
        <CrossesPage
          onNavigate={handleNavigate}
          crosses={crosses}
          crossAssignments={crossAssignments}
          onSaveCross={handleSaveCross}
          onAssignCrosses={handleAssignCrosses}
        />
      ) : currentPage === 'assigned-crosses' ? (
        <AssignedCrossesPage
          year={selectedYear}
          crosses={crosses}
          crossAssignments={crossAssignments}
          onNavigate={handleNavigate}
          onSaveCross={handleSaveCross}
          onUpdateCrossCount={handleUpdateCrossCount}
          onAssignCrosses={handleAssignCrosses}
        />
      ) : currentPage === 'add-note' ? (
        <AddNotePage onNavigate={handleNavigate} onSave={handleSaveNote} />
      ) : currentPage === 'add-plant' ? (
        <AddPlantPage onNavigate={handleNavigate} />
      ) : currentPage === 'add-variety' ? (
        <AddVarietyPage
          onNavigate={handleNavigate}
          onSave={handleSaveVariety}
          onNavigateWithContext={handleNavigateWithContext}
        />
      ) : currentPage === 'add-seedling' ? (
        <AddSeedlingPage
          onNavigate={handleNavigate}
          onSave={handleSaveSeedling}
          onNavigateWithContext={handleNavigateWithContext}
        />
      ) : currentPage === 'add-seedling-group' ? (
        <AddSeedlingGroupPage
          onNavigate={handleNavigate}
          onSaveSeedlingGroup={handleSaveSeedlingGroup}
        />
      ) : currentPage === 'continue-variety' ? (
        <ContinueVarietyPage
          onNavigate={handleNavigate}
          varieties={varieties}
          onNavigateWithContext={handleNavigateWithContext}
        />
      ) : currentPage === 'continue-seedling' ? (
        <ContinueSeedlingPage
          onNavigate={handleNavigate}
          seedlings={seedlings}
          onNavigateWithContext={handleNavigateWithContext}
        />
      ) : currentPage === 'continue-seedling-group' ? (
        <ContinueSeedlingGroupPage
          onNavigate={handleNavigate}
          seedlingGroups={seedlingGroups}
          onUpdateSeedlingGroup={handleUpdateSeedlingGroup}
        />
      ) : currentPage === 'trait-observation' && observationContext ? (
        <TraitObservationPage
          plantType={observationContext.plantType}
          plantId={observationContext.plantId}
          plantData={observationContext.plantData}
          onNavigate={handleNavigate}
          onSave={handleSaveObservations}
        />
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
