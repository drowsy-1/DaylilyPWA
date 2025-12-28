// Mock inventory data for Rice-JA, Reeder, and Mahieu varieties
// This is a simple standalone file with no dependencies

export interface MockVariety {
  name: string;
  hybridizer: string;
  year: number | null;
  ploidy: 'Diploid' | 'Tetraploid' | null;
  scapeHeight: number | null;
  bloomSize: number | null;
  bloomSeason: string | null;
  foliageType: string | null;
  bloomHabit: string | null;
  budCount: number | null;
  branches: number | null;
  colorDescription: string | null;
  form: string | null;
  fragrance: string | null;
  parentage: string | null;
  seedlingNum: string | null;
  awards: string | null;
  rebloom: boolean;
  inventoryStatus: 'In Stock' | 'Out of Stock' | 'On Order';
  quantity: number;
  locationInGarden: string | null;
  acquisitionDate: string | null;
  source: string | null;
  pricePaid: number | null;
  notes: string | null;
  // Extended observation data matching trait fields
  observationData: Record<string, any>;
  observationCycles: ObservationCycle[];
  individualTraitObservations: TraitObservation[];
}

export interface ObservationCycle {
  year: number;
  cycleName: string;
  startDate: string;
  endDate: string | null;
  observations: Record<string, any>;
  photos: string[];
  notes: string;
  completed: boolean;
}

// Individual trait observation that can be tracked independently
export interface TraitObservation {
  traitField: string;
  value: any;
  observationDate: string;
  notes?: string;
  excludeFromAutomaticCycle: boolean;
  photos?: string[];
  observer?: string;
  conditions?: string; // weather, time of day, etc.
}

export const mockInventoryData: MockVariety[] = [
  // Rice-JA varieties
  {
    name: "Energy Gain of One",
    hybridizer: "Rice-JA",
    year: 2023,
    ploidy: "Diploid",
    scapeHeight: 40,
    bloomSize: 8.0,
    bloomSeason: "Early-Midseason",
    foliageType: "Dormant",
    bloomHabit: "Diurnal",
    budCount: 18,
    branches: 3,
    colorDescription: "Pale lavender",
    form: "Unusual Form",
    fragrance: null,
    parentage: "(Blue Dolphin × Purple Eclipse)",
    seedlingNum: "R87",
    awards: null,
    rebloom: false,
    inventoryStatus: "In Stock",
    quantity: 1,
    locationInGarden: "Section A-1",
    acquisitionDate: "2024-03-15",
    source: "Direct from hybridizer",
    pricePaid: 75.00,
    notes: "First year in garden, strong growth",
    observationData: {
      // Basic Identifiers
      type: "Registered Variety",
      variety_name: "Energy Gain of One",
      nickname: "Energy",
      seedling_number: "R87",
      location: "Section A-1",
      year_introduced: 2023,
      first_year_on_record: 2024,
      ploidy: "Diploid",
      hybridizer_name: "Rice-JA",
      
      // Plant Architecture - Foliage
      foliage_type: "Dormant",
      foliage_height: 28,
      foliage_color: "Medium green",
      foliage_density: "Dense",
      foliage_architecture: "Upright",
      foliage_thickness: "Medium",
      foliage_undulation: false,
      leaf_cross_section: "Flat",
      leaf_glossiness: "Semi-glossy",
      spring_sickness_present: false,
      drought_dormancy: false,
      early_fall_dormancy: true,
      late_season_foliage_quality: "Good",
      
      // Clump & Growth
      relative_clump_size: "Medium",
      fan_count: 8,
      fan_multiplication_rate: "Average",
      fan_fragility: false,
      summer_dormancy: false,
      transplant_recovery_speed: "Fast",
      container_performance: "Good",
      
      // Scape Physical Traits
      scape_height: 40,
      scape_strength_rigidity: 8,
      scape_base_connection_strength: "Strong",
      scape_color: "Green",
      scape_angle: "Upright",
      scape_distance_from_foliage: "Well above",
      
      // Branching
      branch_count: 3,
      branch_form: "Well spaced",
      branch_spacing: "Good",
      alternating_branches: true,
      lateral_budding: false,
      self_branching_secondary: false,
      
      // Bud Traits
      bud_count_per_scape: 18,
      bud_spacing: "Good",
      bud_size: "Medium",
      bud_exterior_color: "Pale lavender",
      bud_bumps_thrips_indicator: false,
      terminal_budding: true,
      bud_building_in_adverse_conditions: true,
      bud_drop_tendency: "Low",
      
      // Rebloom
      rebloom: false,
      instant_rebloom: false,
      rebloom_timing: null,
      
      // Bloom Timing & Behavior
      bloom_season: "Early-Midseason",
      bloom_period_length: 28,
      bloom_duration_daily: "Diurnal",
      peak_blooms_per_day: 3,
      average_daily_bloom_load: 2,
      opening_speed: "Normal",
      opening_time_of_day: "06:30",
      open_failures: false,
      closing_time: "20:00",
      rain_response: "Stays open",
      
      // Flower Characteristics - Form
      form_type: "Unusual Form",
      double_expression_percentage: null,
      double_type: null,
      spider_ratio: null,
      unusual_form_subtype: "Crispate",
      polymerous_percentage: null,
      polymerous_avg_petal_count: null,
      
      // Dimensions
      bloom_size: 8.0,
      petal_width: 1.8,
      petal_length: 3.2,
      sepal_width: 1.6,
      sepal_length: 3.0,
      flower_depth: "Shallow",
      
      // Shape & Posture
      petal_shape: "Oval",
      recurved_petals: "Slight",
      flower_orientation: "Outfacing",
      bloom_symmetry: 8,
      petal_matching_uniformity: 7,
      
      // Surface & Color Stability
      petal_texture: "Smooth",
      substance: 7,
      diamond_dusting: "Light",
      metallic_sheen: false,
      surface_finish: "Satin",
      reverse_color: "Lighter lavender",
      fade_resistance: "Good",
      color_fade_speed: "Slow",
      fade_to_color: "White",
      sunburn_on_petals: false,
      heat_fade_resistance: "Good",
      color_intensity_in_heat: "Maintains",
      color_intensity_in_cool: "Intensifies",
      morning_vs_evening_color_difference: "Slightly deeper in morning",
      
      // Color Features
      base_color: "Pale lavender",
      color_intensity: "Medium",
      color_pattern: "Self",
      
      // Eye Zone
      eye_or_watermark_present: false,
      eye_color: null,
      eye_size: null,
      eye_shape: null,
      eye_pattern: null,
      eye_definition: null,
      eye_visibility_in_sun: null,
      
      // Throat
      throat_color: "Green-yellow",
      throat_size: "Medium",
      throat_pattern: "Solid",
      
      // Edge Characteristics
      edge_type: "Ruffled",
      edge_color: "Same as petal",
      edge_formation_depth: "Light",
      edge_formation_on_petal_tips: true,
      edge_formation_on_sepals: false,
      edge_width: 0.1,
      edge_consistency: "Good",
      
      // Parentage
      pod_parent: "Blue Dolphin",
      pollen_parent: "Purple Eclipse",
      registered_pedigree: "(Blue Dolphin × Purple Eclipse)",
      
      // Reproductive Traits
      pollen_fertility: "Good",
      pollen_production_consistency: "Consistent",
      pollen_viability_in_heat: "Good",
      pollen_storage_ability: "Unknown",
      pollen_color: "Yellow",
      crosses_easily_on_dips: true,
      crosses_easily_on_tets: false,
      
      pod_fertility: "Good",
      pod_set_reliability: "Good",
      pod_set_in_heat: "Fair",
      accepts_dip_pollen: true,
      accepts_tet_pollen: false,
      seed_count_per_pod: 12,
      seed_viability_rate: 85,
      embryo_abortion_rate: 15,
      
      // Inventory
      availability: "Limited",
      price: 75.00,
      status: "In Stock"
    },
    observationCycles: [
      {
        year: 2024,
        cycleName: "First Year Establishment",
        startDate: "2024-03-15",
        endDate: "2024-10-15",
        observations: {
          establishment_success: "Excellent",
          first_bloom_date: "2024-06-12",
          total_scapes_produced: 4,
          bloom_performance: "Exceeded expectations",
          foliage_health: "Excellent",
          pest_issues: "None observed",
          disease_issues: "None observed"
        },
        photos: [
          "energy_gain_first_bloom_2024.jpg",
          "energy_gain_full_plant_2024.jpg"
        ],
        notes: "Exceptional first year performance. Plant established quickly and produced 4 strong scapes with excellent bloom quality. Color true to description.",
        completed: true
      }
    ],
    individualTraitObservations: [
      {
        traitField: "substance",
        value: 8,
        observationDate: "2024-06-15",
        notes: "Measured during peak bloom in ideal conditions",
        excludeFromAutomaticCycle: true,
        observer: "Garden Manager",
        conditions: "Morning observation, 72°F, no wind"
      },
      {
        traitField: "pollen_fertility",
        value: "Excellent",
        observationDate: "2024-06-20",
        notes: "Heavy pollen production, used successfully in 5 crosses",
        excludeFromAutomaticCycle: false,
        photos: ["energy_gain_pollen_2024.jpg"],
        observer: "Breeding Program"
      },
      {
        traitField: "heat_fade_resistance",
        value: "Good",
        observationDate: "2024-07-28",
        notes: "Observed during 95°F heat wave - minimal fading",
        excludeFromAutomaticCycle: true,
        conditions: "Afternoon, 95°F, full sun, high humidity"
      }
    ]
  },
  {
    name: "Extra Effort",
    hybridizer: "Rice-JA",
    year: 2014,
    ploidy: "Tetraploid",
    scapeHeight: 34,
    bloomSize: 6.0,
    bloomSeason: "Midseason",
    foliageType: "Dormant",
    bloomHabit: "Diurnal",
    budCount: 17,
    branches: 3,
    colorDescription: "butter yellow self with fine saw tooth fringing on the petals, sepals are longer than the petals",
    form: null,
    fragrance: null,
    parentage: "((sdlg × sdlg) × (sdlg × sdlg))",
    seedlingNum: "13-11",
    awards: null,
    rebloom: false,
    inventoryStatus: "In Stock",
    quantity: 2,
    locationInGarden: "Section A-2",
    acquisitionDate: "2023-08-20",
    source: "Regional society sale",
    pricePaid: 45.00,
    notes: "Excellent performer, multiplying well",
    observationData: {
      // Basic Identifiers
      type: "Registered Variety",
      variety_name: "Extra Effort",
      nickname: "Butter Yellow",
      seedling_number: "13-11",
      location: "Section A-2",
      year_introduced: 2014,
      first_year_on_record: 2023,
      ploidy: "Tetraploid",
      hybridizer_name: "Rice-JA",
      
      // Key observations different from Energy Gain
      foliage_type: "Dormant",
      foliage_height: 24,
      foliage_color: "Blue-green",
      foliage_density: "Very Dense",
      relative_clump_size: "Large",
      fan_count: 15,
      fan_multiplication_rate: "Fast",
      
      scape_height: 34,
      scape_strength_rigidity: 9,
      branch_count: 3,
      bud_count_per_scape: 17,
      
      bloom_season: "Midseason",
      bloom_size: 6.0,
      form_type: "Single",
      base_color: "Butter yellow",
      
      // Edge characteristics - saw tooth fringing
      edge_type: "Saw tooth",
      edge_formation_depth: "Deep",
      edge_formation_on_petal_tips: true,
      edge_formation_on_sepals: true,
      edge_consistency: "Excellent",
      
      // Petal vs sepal difference
      petal_length: 2.8,
      sepal_length: 3.4,
      petal_width: 1.6,
      sepal_width: 1.4,
      
      substance: 8,
      heat_fade_resistance: "Excellent",
      color_intensity_in_heat: "Maintains",
      
      // Reproductive traits - tetraploid
      pollen_fertility: "Good",
      crosses_easily_on_dips: false,
      crosses_easily_on_tets: true,
      pod_fertility: "Excellent",
      accepts_tet_pollen: true,
      seed_count_per_pod: 18,
      
      registered_pedigree: "((sdlg × sdlg) × (sdlg × sdlg))"
    },
    observationCycles: [
      {
        year: 2023,
        cycleName: "Establishment Year",
        startDate: "2023-08-20",
        endDate: "2023-11-01",
        observations: {
          establishment_success: "Good",
          late_season_performance: "Strong root development",
          foliage_quality: "Excellent through fall"
        },
        photos: ["extra_effort_fall_2023.jpg"],
        notes: "Planted late in season but established well. No blooms first year as expected.",
        completed: true
      },
      {
        year: 2024,
        cycleName: "First Bloom Year",
        startDate: "2024-04-01",
        endDate: null,
        observations: {
          first_bloom_date: "2024-07-08",
          total_scapes_produced: 6,
          bloom_performance: "Outstanding",
          edge_formation_quality: "Excellent saw tooth pattern",
          color_stability: "No fading in heat",
          multiplication_rate: "Doubled in size"
        },
        photos: [
          "extra_effort_first_bloom_2024.jpg",
          "extra_effort_edge_detail_2024.jpg",
          "extra_effort_clump_2024.jpg"
        ],
        notes: "Exceptional performance. The saw tooth edge is very distinctive and consistent. Plant doubled in size and produced 6 strong scapes.",
        completed: false
      }
    ],
    individualTraitObservations: [
      {
        traitField: "edge_formation_depth",
        value: "Deep",
        observationDate: "2024-07-10",
        notes: "Saw tooth edge very pronounced and consistent across all blooms",
        excludeFromAutomaticCycle: true,
        photos: ["extra_effort_edge_macro_2024.jpg"],
        conditions: "Morning light, optimal for edge photography"
      },
      {
        traitField: "fan_multiplication_rate",
        value: "Fast",
        observationDate: "2024-09-15",
        notes: "Plant doubled from 8 to 16 fans in one season",
        excludeFromAutomaticCycle: false,
        observer: "Garden Manager"
      }
    ]
  },
  {
    name: "Reining",
    hybridizer: "Rice-JA",
    year: 2009,
    ploidy: "Tetraploid",
    scapeHeight: 24,
    bloomSize: 5.5,
    bloomSeason: "Early-Midseason",
    foliageType: "Semi-Evergreen",
    bloomHabit: "Diurnal",
    budCount: 20,
    branches: 3,
    colorDescription: "rose pink with light gold edge above green throat",
    form: null,
    fragrance: null,
    parentage: "(unknown × unknown)",
    seedlingNum: "R-78",
    awards: "JC 2009",
    rebloom: true,
    inventoryStatus: "In Stock",
    quantity: 1,
    locationInGarden: "Section B-1",
    acquisitionDate: "2024-01-10",
    source: "Online purchase",
    pricePaid: 35.00,
    notes: "Reliable rebloomer",
    observationData: {
      // Basic Identifiers
      type: "Registered Variety",
      variety_name: "Reining",
      seedling_number: "R-78",
      location: "Section B-1",
      year_introduced: 2009,
      first_year_on_record: 2024,
      ploidy: "Tetraploid",
      hybridizer_name: "Rice-JA",
      
      // Semi-evergreen characteristics
      foliage_type: "Semi-Evergreen",
      foliage_height: 18,
      foliage_color: "Medium green",
      early_fall_dormancy: false,
      late_season_foliage_quality: "Excellent",
      
      // Compact plant
      relative_clump_size: "Small to Medium",
      fan_count: 6,
      scape_height: 24,
      scape_strength_rigidity: 7,
      branch_count: 3,
      bud_count_per_scape: 20,
      
      // Rebloom characteristics
      rebloom: true,
      instant_rebloom: false,
      rebloom_timing: "Late summer",
      
      bloom_season: "Early-Midseason",
      bloom_size: 5.5,
      base_color: "Rose pink",
      
      // Edge characteristics
      edge_type: "Gold edge",
      edge_color: "Light gold",
      edge_formation_depth: "Medium",
      edge_width: 0.2,
      edge_consistency: "Very good",
      
      // Throat
      throat_color: "Green",
      throat_size: "Medium",
      
      // Color stability
      fade_resistance: "Good",
      heat_fade_resistance: "Good",
      color_intensity_in_heat: "Maintains",
      
      // Awards recognition
      awards: "JC 2009",
      
      registered_pedigree: "(unknown × unknown)"
    },
    observationCycles: [
      {
        year: 2024,
        cycleName: "First Year - Rebloom Study",
        startDate: "2024-01-10",
        endDate: null,
        observations: {
          establishment_success: "Excellent",
          first_bloom_date: "2024-06-05",
          first_bloom_period_length: 21,
          total_scapes_first_flush: 3,
          rebloom_date: "2024-08-15",
          rebloom_period_length: 18,
          total_scapes_rebloom: 2,
          rebloom_quality: "Excellent - same size and color",
          edge_consistency: "Gold edge consistent in both flushes",
          heat_tolerance: "Excellent",
          foliage_persistence: "Stayed green through winter"
        },
        photos: [
          "reining_first_bloom_2024.jpg",
          "reining_edge_detail_2024.jpg",
          "reining_rebloom_2024.jpg",
          "reining_winter_foliage_2024.jpg"
        ],
        notes: "Outstanding rebloomer. First flush in early June with 3 scapes, excellent rebloom in mid-August with 2 more scapes. Color and edge quality identical in both flushes. Semi-evergreen foliage stayed attractive through mild winter.",
        completed: false
      }
    ],
    individualTraitObservations: [
      {
        traitField: "rebloom_timing",
        value: "10 weeks after first flush",
        observationDate: "2024-08-15",
        notes: "Consistent 10-week interval between bloom flushes",
        excludeFromAutomaticCycle: false,
        observer: "Rebloom Study"
      },
      {
        traitField: "edge_consistency",
        value: "Excellent",
        observationDate: "2024-08-20",
        notes: "Gold edge identical in rebloom - no degradation",
        excludeFromAutomaticCycle: true,
        photos: ["reining_rebloom_edge_2024.jpg"]
      },
      {
        traitField: "foliage_winter_persistence",
        value: "Good",
        observationDate: "2024-12-15",
        notes: "Semi-evergreen foliage maintained through 20°F temperatures",
        excludeFromAutomaticCycle: true,
        conditions: "After first hard freeze, 20°F overnight"
      }
    ]
  },
  {
    name: "Laguna",
    hybridizer: "Rice-JA",
    year: 2010,
    ploidy: "Tetraploid",
    scapeHeight: 28,
    bloomSize: 7.0,
    bloomSeason: "Midseason-Late",
    foliageType: "Dormant",
    bloomHabit: "Diurnal",
    budCount: 18,
    branches: 3,
    colorDescription: "violet bitone with pink eye above green throat",
    form: "Unusual FormCascade",
    fragrance: null,
    parentage: "(unknown sdlg × unknown sdlg)",
    seedlingNum: "31",
    awards: null,
    rebloom: false,
    inventoryStatus: "In Stock",
    quantity: 1,
    locationInGarden: "Section B-2",
    acquisitionDate: "2023-09-15",
    source: "Garden tour purchase",
    pricePaid: 55.00,
    notes: "Unique cascade form",
    observationData: {
      type: "Registered Variety",
      variety_name: "Laguna",
      seedling_number: "31",
      ploidy: "Tetraploid",
      hybridizer_name: "Rice-JA",
      foliage_type: "Dormant",
      scape_height: 28,
      bloom_size: 7.0,
      bloom_season: "Midseason-Late",
      base_color: "Violet",
      color_pattern: "Bitone",
      eye_or_watermark_present: true,
      eye_color: "Pink",
      throat_color: "Green",
      form_type: "Unusual FormCascade",
      registered_pedigree: "(unknown sdlg × unknown sdlg)"
    },
    observationCycles: [],
    individualTraitObservations: [
      {
        traitField: "eye_color",
        value: "Pink",
        observationDate: "2024-07-15",
        notes: "Distinctive pink eye zone, very consistent",
        excludeFromAutomaticCycle: false,
        observer: "Garden Manager"
      },
      {
        traitField: "form_type",
        value: "Unusual FormCascade",
        observationDate: "2024-07-15",
        notes: "Cascade form very pronounced, petals hang gracefully",
        excludeFromAutomaticCycle: true,
        photos: ["laguna_cascade_form_2024.jpg"]
      }
    ]
  },

  // Reeder varieties
  {
    name: "Flamingos on Ice",
    hybridizer: "Reeder",
    year: 2019,
    ploidy: "Diploid",
    scapeHeight: 34,
    bloomSize: 6.0,
    bloomSeason: "Midseason",
    foliageType: "Semi-Evergreen",
    bloomHabit: "Diurnal",
    budCount: 14,
    branches: 3,
    colorDescription: "Pale pink lavender with darker rose lavender edge on petals above chartreuse to grass green throat",
    form: null,
    fragrance: null,
    parentage: "(Beautiful Edgings × Got Nuts)",
    seedlingNum: "BEGNG17",
    awards: null,
    rebloom: false,
    inventoryStatus: "In Stock",
    quantity: 1,
    locationInGarden: "Section C-1",
    acquisitionDate: "2024-02-28",
    source: "Direct from hybridizer",
    pricePaid: 65.00,
    notes: "Beautiful edge pattern",
    observationData: {
      type: "Registered Variety",
      variety_name: "Flamingos on Ice",
      seedling_number: "BEGNG17",
      ploidy: "Diploid",
      hybridizer_name: "Reeder",
      foliage_type: "Semi-Evergreen",
      scape_height: 34,
      bloom_size: 6.0,
      bloom_season: "Midseason",
      base_color: "Pale pink lavender",
      edge_type: "Colored edge",
      edge_color: "Rose lavender",
      throat_color: "Chartreuse to grass green",
      registered_pedigree: "(Beautiful Edgings × Got Nuts)"
    },
    observationCycles: [],
    individualTraitObservations: [
      {
        traitField: "edge_color",
        value: "Rose lavender",
        observationDate: "2024-06-20",
        notes: "Edge color very consistent, darker than base color",
        excludeFromAutomaticCycle: false,
        observer: "Garden Manager"
      },
      {
        traitField: "throat_color",
        value: "Chartreuse to grass green",
        observationDate: "2024-06-20",
        notes: "Throat transitions from chartreuse at base to grass green",
        excludeFromAutomaticCycle: true,
        conditions: "Morning observation, optimal lighting"
      }
    ]
  },
  {
    name: "Vorlon Revelation",
    hybridizer: "Reeder",
    year: 2016,
    ploidy: "Diploid",
    scapeHeight: 50,
    bloomSize: 9.0,
    bloomSeason: "Early-Midseason",
    foliageType: "Semi-Evergreen",
    bloomHabit: "Diurnal",
    budCount: 33,
    branches: 4,
    colorDescription: "bud building, clear cream with rose band, extending rose veins slightly up into the petal above chartreuse to green throat",
    form: null,
    fragrance: null,
    parentage: "(Heavenly Treasure × Wuthering Heights)",
    seedlingNum: "HTWUT12",
    awards: null,
    rebloom: false,
    inventoryStatus: "In Stock",
    quantity: 2,
    locationInGarden: "Section C-2",
    acquisitionDate: "2023-07-12",
    source: "Regional society sale",
    pricePaid: 80.00,
    notes: "Tall scapes, excellent bud count",
    observationData: {
      type: "Registered Variety",
      variety_name: "Vorlon Revelation",
      seedling_number: "HTWUT12",
      ploidy: "Diploid",
      hybridizer_name: "Reeder",
      foliage_type: "Semi-Evergreen",
      scape_height: 50,
      bloom_size: 9.0,
      bloom_season: "Early-Midseason",
      bud_count_per_scape: 33,
      base_color: "Clear cream",
      color_pattern: "Banded",
      eye_or_watermark_present: true,
      eye_color: "Rose",
      veining_present: true,
      veining_color: "Rose",
      throat_color: "Chartreuse to green",
      registered_pedigree: "(Heavenly Treasure × Wuthering Heights)"
    },
    observationCycles: [],
    individualTraitObservations: [
      {
        traitField: "bud_count_per_scape",
        value: 33,
        observationDate: "2024-07-05",
        notes: "Excellent bud count, well-spaced along tall scape",
        excludeFromAutomaticCycle: false,
        observer: "Garden Manager"
      },
      {
        traitField: "veining_intensity",
        value: "Strong",
        observationDate: "2024-07-08",
        notes: "Rose veining extends well into petals from band",
        excludeFromAutomaticCycle: true,
        photos: ["vorlon_revelation_veining_2024.jpg"]
      }
    ]
  },

  // Mahieu varieties
  {
    name: "Fuchsia Cockatoo",
    hybridizer: "Mahieu",
    year: 2003,
    ploidy: "Diploid",
    scapeHeight: 36,
    bloomSize: 8.0,
    bloomSeason: "Midseason",
    foliageType: "Semi-Evergreen",
    bloomHabit: "Diurnal",
    budCount: 24,
    branches: 4,
    colorDescription: "deep fuchsia rose bitone with white midribs above lemon chartreuse throat",
    form: null,
    fragrance: null,
    parentage: "(Green Tarantula × Wilson Spider)",
    seedlingNum: "MAH-D97-272E",
    awards: null,
    rebloom: false,
    inventoryStatus: "In Stock",
    quantity: 1,
    locationInGarden: "Section D-1",
    acquisitionDate: "2023-06-10",
    source: "Garden society exchange",
    pricePaid: 40.00,
    notes: "Striking color contrast with white midribs",
    observationData: {
      // Basic Identifiers
      type: "Registered Variety",
      variety_name: "Fuchsia Cockatoo",
      seedling_number: "MAH-D97-272E",
      location: "Section D-1",
      year_introduced: 2003,
      first_year_on_record: 2023,
      ploidy: "Diploid",
      hybridizer_name: "Mahieu",
      
      // Plant characteristics
      foliage_type: "Semi-Evergreen",
      foliage_height: 26,
      foliage_color: "Dark green",
      relative_clump_size: "Medium",
      fan_count: 10,
      
      scape_height: 36,
      scape_strength_rigidity: 8,
      branch_count: 4,
      bud_count_per_scape: 24,
      
      bloom_season: "Midseason",
      bloom_size: 8.0,
      form_type: "Single",
      
      // Distinctive color pattern
      base_color: "Deep fuchsia rose",
      color_pattern: "Bitone",
      color_intensity: "Very intense",
      
      // Midrib characteristics - key feature
      midrib_color: "White",
      midrib_width: 0.3,
      veining_present: true,
      veining_color: "White",
      veining_intensity: "Strong",
      
      // Throat
      throat_color: "Lemon chartreuse",
      throat_size: "Large",
      throat_pattern: "Solid",
      
      // Color stability
      fade_resistance: "Excellent",
      heat_fade_resistance: "Good",
      color_intensity_in_heat: "Maintains",
      morning_vs_evening_color_difference: "More intense in morning",
      
      // Spider parentage influence
      petal_length: 3.8,
      sepal_length: 3.6,
      petal_width: 1.4,
      sepal_width: 1.2,
      
      // Substance and texture
      substance: 7,
      petal_texture: "Smooth",
      surface_finish: "Velvety",
      
      registered_pedigree: "(Green Tarantula × Wilson Spider)"
    },
    observationCycles: [
      {
        year: 2023,
        cycleName: "Establishment and First Bloom",
        startDate: "2023-06-10",
        endDate: "2023-10-30",
        observations: {
          establishment_success: "Good",
          first_bloom_date: "2023-07-20",
          total_scapes_produced: 2,
          bloom_performance: "Good for first year",
          midrib_contrast: "Excellent - very striking white midribs",
          color_intensity: "Outstanding deep fuchsia",
          throat_color: "Bright chartreuse as described"
        },
        photos: [
          "fuchsia_cockatoo_first_bloom_2023.jpg",
          "fuchsia_cockatoo_midrib_detail_2023.jpg"
        ],
        notes: "Excellent first year bloom. The white midribs create stunning contrast against the deep fuchsia petals. Chartreuse throat is very bright and distinctive.",
        completed: true
      },
      {
        year: 2024,
        cycleName: "Second Year Performance",
        startDate: "2024-04-01",
        endDate: null,
        observations: {
          bloom_date: "2024-07-12",
          total_scapes_produced: 4,
          bloom_performance: "Excellent",
          midrib_consistency: "White midribs very consistent",
          color_stability: "No fading even in heat",
          plant_vigor: "Strong growth, good increase",
          breeding_notes: "Used as pod parent - good pod set"
        },
        photos: [
          "fuchsia_cockatoo_full_bloom_2024.jpg",
          "fuchsia_cockatoo_breeding_2024.jpg"
        ],
        notes: "Outstanding second year. Plant doubled in size and produced 4 strong scapes. Color pattern very consistent. Successfully used in breeding program.",
        completed: false
      }
    ],
    individualTraitObservations: [
      {
        traitField: "midrib_color",
        value: "White",
        observationDate: "2024-07-12",
        notes: "Striking white midribs create excellent contrast against fuchsia petals",
        excludeFromAutomaticCycle: false,
        observer: "Garden Manager",
        photos: ["fuchsia_cockatoo_midrib_detail_2024.jpg"]
      },
      {
        traitField: "color_intensity",
        value: "Very intense",
        observationDate: "2024-07-15",
        notes: "Deep fuchsia color very saturated, no fading in heat",
        excludeFromAutomaticCycle: true,
        conditions: "Full sun, 90°F, midday observation"
      },
      {
        traitField: "pod_fertility",
        value: "Good",
        observationDate: "2024-08-10",
        notes: "Successfully set pods when used as pod parent in breeding",
        excludeFromAutomaticCycle: false,
        observer: "Breeding Program"
      }
    ]
  },
  {
    name: "Orchid Mutation",
    hybridizer: "Mahieu-Burris",
    year: 2007,
    ploidy: "Diploid",
    scapeHeight: 40,
    bloomSize: 5.5,
    bloomSeason: "Extra Early",
    foliageType: "Dormant",
    bloomHabit: "Diurnal",
    budCount: 22,
    branches: 5,
    colorDescription: "flesh pink lemon taupe bitone with stippled taupe band above sunny lemon to bright kiwi throat",
    form: null,
    fragrance: null,
    parentage: "((sdlg × sdlg) × (Rosy Lights × sdlg))",
    seedlingNum: "MB-39",
    awards: null,
    rebloom: false,
    inventoryStatus: "In Stock",
    quantity: 1,
    locationInGarden: "Section D-2",
    acquisitionDate: "2024-04-05",
    source: "Online auction",
    pricePaid: 60.00,
    notes: "Unique stippled pattern, very early bloomer",
    observationData: {
      type: "Registered Variety",
      variety_name: "Orchid Mutation",
      seedling_number: "MB-39",
      ploidy: "Diploid",
      hybridizer_name: "Mahieu-Burris",
      foliage_type: "Dormant",
      scape_height: 40,
      bloom_size: 5.5,
      bloom_season: "Extra Early",
      base_color: "Flesh pink lemon taupe",
      color_pattern: "Bitone",
      stippling_bubbling: true,
      stippling_color: "Taupe",
      throat_color: "Sunny lemon to bright kiwi",
      registered_pedigree: "((sdlg × sdlg) × (Rosy Lights × sdlg))"
    },
    observationCycles: [],
    individualTraitObservations: [
      {
        traitField: "stippling_bubbling",
        value: true,
        observationDate: "2024-06-15",
        notes: "Distinctive stippled taupe band pattern",
        excludeFromAutomaticCycle: false,
        observer: "Garden Manager"
      },
      {
        traitField: "bloom_season",
        value: "Extra Early",
        observationDate: "2024-05-28",
        notes: "First daylily to bloom in garden - very early",
        excludeFromAutomaticCycle: true,
        conditions: "First bloom of season"
      }
    ]
  },
  {
    name: "Orchid Spangles",
    hybridizer: "Mahieu-Burris",
    year: 2007,
    ploidy: "Diploid",
    scapeHeight: 50,
    bloomSize: 8.0,
    bloomSeason: "Midseason",
    foliageType: "Dormant",
    bloomHabit: "Diurnal",
    budCount: 38,
    branches: 6,
    colorDescription: "creamy lemon with faint lavender halo and cream edge above creamy lemon to kiwi green throat",
    form: null,
    fragrance: null,
    parentage: "((Capulina × Lola Branham) × Triumphant Lord)",
    seedlingNum: "MB-25",
    awards: null,
    rebloom: false,
    inventoryStatus: "In Stock",
    quantity: 1,
    locationInGarden: "Section D-3",
    acquisitionDate: "2023-10-20",
    source: "Direct from hybridizer",
    pricePaid: 70.00,
    notes: "Tall with excellent bud count, subtle coloring",
    observationData: {
      type: "Registered Variety",
      variety_name: "Orchid Spangles",
      seedling_number: "MB-25",
      ploidy: "Diploid",
      hybridizer_name: "Mahieu-Burris",
      foliage_type: "Dormant",
      scape_height: 50,
      bloom_size: 8.0,
      bloom_season: "Midseason",
      bud_count_per_scape: 38,
      branch_count: 6,
      base_color: "Creamy lemon",
      eye_or_watermark_present: true,
      eye_color: "Faint lavender",
      edge_type: "Cream edge",
      edge_color: "Cream",
      throat_color: "Creamy lemon to kiwi green",
      registered_pedigree: "((Capulina × Lola Branham) × Triumphant Lord)"
    },
    observationCycles: [],
    individualTraitObservations: [
      {
        traitField: "bud_count_per_scape",
        value: 38,
        observationDate: "2024-07-10",
        notes: "Outstanding bud count on tall 50-inch scapes",
        excludeFromAutomaticCycle: false,
        observer: "Garden Manager"
      },
      {
        traitField: "eye_visibility_in_sun",
        value: "Subtle but visible",
        observationDate: "2024-07-12",
        notes: "Faint lavender halo more visible in morning light",
        excludeFromAutomaticCycle: true,
        conditions: "Full sun, midday observation"
      }
    ]
  },

  // Additional variety for demonstration
  {
    name: "Demo Seedling 2024-01",
    hybridizer: "Your Garden",
    year: null,
    ploidy: "Diploid",
    scapeHeight: 32,
    bloomSize: 6.5,
    bloomSeason: "Midseason",
    foliageType: "Semi-Evergreen",
    bloomHabit: "Diurnal",
    budCount: 16,
    branches: 3,
    colorDescription: "yellow with red eye",
    form: null,
    fragrance: "Fragrant",
    parentage: "(Energy Gain of One × Fuchsia Cockatoo)",
    seedlingNum: "YG-24-01",
    awards: null,
    rebloom: false,
    inventoryStatus: "In Stock",
    quantity: 1,
    locationInGarden: "Seedling Bed A",
    acquisitionDate: "2024-05-01",
    source: "Own cross",
    pricePaid: null,
    notes: "First year seedling from own breeding program",
    observationData: {
      // Basic Identifiers
      type: "Seedling",
      variety_name: "Demo Seedling 2024-01",
      nickname: "Yellow Eye",
      seedling_number: "YG-24-01",
      location: "Seedling Bed A",
      year_introduced: null,
      first_year_on_record: 2024,
      ploidy: "Diploid",
      hybridizer_name: "Your Garden",
      
      // First year seedling observations
      foliage_type: "Semi-Evergreen",
      foliage_height: 22,
      foliage_color: "Medium green",
      relative_clump_size: "Small",
      fan_count: 3,
      
      scape_height: 32,
      scape_strength_rigidity: 6,
      branch_count: 3,
      bud_count_per_scape: 16,
      
      bloom_season: "Midseason",
      bloom_size: 6.5,
      form_type: "Single",
      
      // Color characteristics
      base_color: "Yellow",
      color_pattern: "Eye pattern",
      
      // Eye characteristics
      eye_or_watermark_present: true,
      eye_color: "Red",
      eye_size: "Medium",
      eye_shape: "Round",
      eye_pattern: "Solid",
      eye_definition: "Sharp",
      eye_visibility_in_sun: "Excellent",
      
      // Throat
      throat_color: "Yellow-green",
      throat_size: "Small",
      
      // Fragrance
      fragrance: "Fragrant",
      
      // Breeding information
      pod_parent: "Energy Gain of One",
      pollen_parent: "Fuchsia Cockatoo",
      registered_pedigree: "(Energy Gain of One × Fuchsia Cockatoo)",
      
      // Breeding potential
      pollen_fertility: "Unknown - first year",
      pod_fertility: "Unknown - first year"
    },
    observationCycles: [
      {
        year: 2024,
        cycleName: "First Bloom Evaluation",
        startDate: "2024-05-01",
        endDate: null,
        observations: {
          germination_date: "2024-03-15",
          transplant_date: "2024-05-01",
          establishment_success: "Excellent",
          first_bloom_date: "2024-07-25",
          total_scapes_produced: 1,
          bloom_performance: "Good for first year seedling",
          color_evaluation: "Bright yellow with distinct red eye",
          eye_pattern_quality: "Sharp, well-defined red eye",
          fragrance_strength: "Light but pleasant",
          breeding_potential: "Promising - good color contrast",
          selection_decision: "Keep for further evaluation"
        },
        photos: [
          "demo_seedling_first_bloom_2024.jpg",
          "demo_seedling_eye_detail_2024.jpg",
          "demo_seedling_plant_2024.jpg"
        ],
        notes: "Promising first year seedling. Good color contrast between yellow petals and red eye. Light fragrance inherited from Fuchsia Cockatoo parent. Will evaluate for another year before making final selection decision.",
        completed: false
      }
    ],
    individualTraitObservations: [
      {
        traitField: "eye_definition",
        value: "Sharp",
        observationDate: "2024-07-25",
        notes: "Red eye very well-defined against yellow background",
        excludeFromAutomaticCycle: false,
        observer: "Breeding Program"
      },
      {
        traitField: "fragrance",
        value: "Light fragrance",
        observationDate: "2024-07-26",
        notes: "Pleasant light fragrance, inherited from Fuchsia Cockatoo",
        excludeFromAutomaticCycle: true,
        conditions: "Morning, calm air"
      }
    ]
  }
];

// Helper functions for working with the mock data
export function getVarietiesByHybridizer(hybridizer: string): MockVariety[] {
  return mockInventoryData.filter(variety => 
    variety.hybridizer.toLowerCase().includes(hybridizer.toLowerCase())
  );
}

export function getVarietiesByPloidy(ploidy: 'Diploid' | 'Tetraploid'): MockVariety[] {
  return mockInventoryData.filter(variety => variety.ploidy === ploidy);
}

export function getInStockVarieties(): MockVariety[] {
  return mockInventoryData.filter(variety => variety.inventoryStatus === 'In Stock');
}

export function getTotalInventoryValue(): number {
  return mockInventoryData.reduce((total, variety) => {
    return total + (variety.pricePaid || 0) * variety.quantity;
  }, 0);
}

export function getInventoryStats() {
  const total = mockInventoryData.length;
  const inStock = getInStockVarieties().length;
  const diploids = getVarietiesByPloidy('Diploid').length;
  const tetraploids = getVarietiesByPloidy('Tetraploid').length;
  const riceJA = getVarietiesByHybridizer('Rice-JA').length;
  const reeder = getVarietiesByHybridizer('Reeder').length;
  const mahieu = getVarietiesByHybridizer('Mahieu').length;
  const totalValue = getTotalInventoryValue();

  return {
    total,
    inStock,
    diploids,
    tetraploids,
    hybridizers: {
      riceJA,
      reeder,
      mahieu
    },
    totalValue
  };
}