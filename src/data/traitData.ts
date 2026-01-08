export interface Trait {
  field: string;
  label: string;
  type?: string;
  defaultTiming?: {
    year?: number;
    season?: string;
    month?: string;
    weeks?: string[];
    excludeFromAutomaticCycle?: boolean;
  };
}

export interface TraitGroup {
  name: string;
  traits: Trait[];
}

export interface TraitArea {
  name: string;
  groups: TraitGroup[];
}

export const traitData: TraitArea[] = [
  {
    name: '1. Basic Identifiers',
    groups: [
      {
        name: 'Core Information',
        traits: [
          { 
            field: 'type', 
            label: 'Type', 
            type: 'select', // seedling / variety
            defaultTiming: { excludeFromAutomaticCycle: true }
          },
          { 
            field: 'variety_name', 
            label: 'Variety Name', 
            type: 'text',
            defaultTiming: { excludeFromAutomaticCycle: true }
          },
          { 
            field: 'seedling_nickname', 
            label: 'Seedling Nickname', 
            type: 'text',
            defaultTiming: { excludeFromAutomaticCycle: true }
          },
          { 
            field: 'seedling_number', 
            label: 'Seedling Number', 
            type: 'text', // ##-####-###
            defaultTiming: { excludeFromAutomaticCycle: true }
          },
          { 
            field: 'location', 
            label: 'Location', 
            type: 'text', // bed number, row number, position number
            defaultTiming: { excludeFromAutomaticCycle: true }
          },
          { 
            field: 'year_introduced', 
            label: 'Year Introduced', 
            type: 'number', // int four digits
            defaultTiming: { excludeFromAutomaticCycle: true }
          },
          { 
            field: 'first_year_on_record', 
            label: '1st Year on Record', 
            type: 'number', // int four digits
            defaultTiming: { excludeFromAutomaticCycle: true }
          },
          { 
            field: 'ploidy', 
            label: 'Ploidy', 
            type: 'select', // diploid/tetraploid/triploid/other/unknown
            defaultTiming: { excludeFromAutomaticCycle: true }
          },
          { 
            field: 'hybridizer_name', 
            label: 'Hybridizer Name', 
            type: 'text',
            defaultTiming: { excludeFromAutomaticCycle: true }
          },
        ],
      },
    ],
  },
  {
    name: '2. Plant Architecture',
    groups: [
      {
        name: 'Foliage Characteristics',
        traits: [
          { 
            field: 'foliage_type', 
            label: 'Foliage Type', 
            type: 'select', // evergreen, semi-evergreen, dormant
            defaultTiming: { season: 'Spring' }
          },
          { 
            field: 'foliage_height', 
            label: 'Foliage Height', 
            type: 'number', // int inches
            defaultTiming: { season: 'Summer' }
          },
          { 
            field: 'foliage_color', 
            label: 'Foliage Color', 
            type: 'select', // yellow/yellow-green/light green/medium green/dark green/blue green/variegated/other
            defaultTiming: { season: 'Spring' }
          },
          { 
            field: 'foliage_density', 
            label: 'Foliage Density', 
            type: 'rating', // 1-5 low to high
            defaultTiming: { season: 'Spring' }
          },
          { 
            field: 'foliage_architecture', 
            label: 'Foliage Architecture', 
            type: 'select', // heavily weeping, weeping, gently weeping, upright, vertical/straight
            defaultTiming: { season: 'Spring' }
          },
          { 
            field: 'foliage_thickness', 
            label: 'Foliage Thickness (Width)', 
            type: 'select', // grassile, thin, medium, wider, very wide
            defaultTiming: { season: 'Spring' }
          },
          { 
            field: 'foliage_edge_undulation', 
            label: 'Foliage Edge Undulation', 
            type: 'select', // straight, mild, medium, pronounced
            defaultTiming: { season: 'Spring' }
          },
          { 
            field: 'leaf_cross_section', 
            label: 'Leaf Cross Section', 
            type: 'select', // flat, angled, v shaped
            defaultTiming: { season: 'Spring' }
          },
          { 
            field: 'leaf_glossiness', 
            label: 'Leaf Glossiness', 
            type: 'select', // dull, medium, glossy, powdered
            defaultTiming: { season: 'Spring' }
          },
          { 
            field: 'spring_sickness_present', 
            label: 'Spring Sickness Present', 
            type: 'boolean',
            defaultTiming: { season: 'Spring' }
          },
          { 
            field: 'drought_dormancy', 
            label: 'Drought Dormancy', 
            type: 'boolean',
            defaultTiming: { season: 'Summer' }
          },
          { 
            field: 'summer_dormancy', 
            label: 'Summer Dormancy', 
            type: 'boolean',
            defaultTiming: { month: 'July' }
          },
          { 
            field: 'early_fall_dormancy', 
            label: 'Early Fall Dormancy', 
            type: 'boolean',
            defaultTiming: { season: 'Fall' }
          },
          { 
            field: 'late_season_foliage_quality', 
            label: 'Late Season Foliage Quality', 
            type: 'rating', // 1 poor - 5 very good
            defaultTiming: { season: 'Fall' }
          },
        ],
      },
      {
        name: 'Clump & Growth Habits',
        traits: [
          { 
            field: 'relative_clump_size', 
            label: 'Relative Clump Size', 
            type: 'select', // extra small, small, medium, large, very large
            defaultTiming: { season: 'Spring' }
          },
          { 
            field: 'fan_count', 
            label: 'Fan Count', 
            type: 'number',
            defaultTiming: { season: 'Spring' }
          },
          { 
            field: 'fan_multiplication_rate', 
            label: 'Fan Multiplication Rate', 
            type: 'number', // calculated = fall / spring
            defaultTiming: { excludeFromAutomaticCycle: true }
          },
          { 
            field: 'fan_fragility', 
            label: 'Fan Fragility', 
            type: 'select', // fragile, average, sturdy
            defaultTiming: { excludeFromAutomaticCycle: true }
          },
          { 
            field: 'transplant_recovery_speed', 
            label: 'Transplant Recovery Speed', 
            type: 'select', // stunted, slow, average, good, very good
            defaultTiming: { excludeFromAutomaticCycle: true }
          },
          { 
            field: 'container_performance', 
            label: 'Container Performance', 
            type: 'rating', // 1-10 very poor - very good
            defaultTiming: { excludeFromAutomaticCycle: true }
          },
        ],
      },
      {
        name: 'Scape Physical Traits',
        traits: [
          { 
            field: 'scape_height', 
            label: 'Scape Height (inches)', 
            type: 'number', // int inches
            defaultTiming: { season: 'Summer' }
          },
          { 
            field: 'scape_strength_rigidity', 
            label: 'Scape Strength Rigidity', 
            type: 'rating', // 1-10 low to high
            defaultTiming: { season: 'Summer' }
          },
          { 
            field: 'scape_base_connection_strength', 
            label: 'Scape Base Connection Strength', 
            type: 'rating', // 1-10 very poor - very good
            defaultTiming: { season: 'Summer' }
          },
          { 
            field: 'scape_color', 
            label: 'Scape Color', 
            type: 'select', // yellow green, medium green, dark green, brown green, near black, black
            defaultTiming: { season: 'Summer' }
          },
          { 
            field: 'scape_angle', 
            label: 'Scape Angle', 
            type: 'number', // 90 - 25 degrees
            defaultTiming: { season: 'Summer' }
          },
          { 
            field: 'scape_tip_distance_from_foliage', 
            label: 'Scape Tip Distance above Foliage', 
            type: 'number', // calculated = scape height - foliage height
            defaultTiming: { excludeFromAutomaticCycle: true }
          },
        ],
      },
      {
        name: 'Branching Structure',
        traits: [
          { 
            field: 'branch_count', 
            label: 'Branch Count', 
            type: 'number', //int 
            defaultTiming: { season: 'Summer' }
          },
          { 
            field: 'branch_form', 
            label: 'Branch Form', 
            type: 'select', // witches broom, tight y, regular, candelabra
            defaultTiming: { season: 'Summer' }
          },
          { 
            field: 'branch_spacing', 
            label: 'Branch Spacing', 
            type: 'select', // low medium high
            defaultTiming: { season: 'Summer' }
          },
          { 
            field: 'alternating_branches', // may need to be removed (might be redundant)
            label: 'Alternating Branches', 
            type: 'boolean', 
            defaultTiming: { season: 'Summer' }
          },
          { 
            field: 'lateral_budding', // bud building?
            label: 'Lateral Budding', 
            type: 'boolean',
            defaultTiming: { season: 'Summer' }
          },
          { 
            field: 'self_branching_secondary', // bracting tendency
            label: 'Self Branching Secondary', 
            type: 'boolean',
            defaultTiming: { season: 'Summer' }
          },
        ],
      },
      {
        name: 'Bud Traits',
        traits: [
          { 
            field: 'bud_count_per_scape', 
            label: 'Bud Count per Scape', 
            type: 'number', // int 
            defaultTiming: { season: 'Summer' }
          },
          { 
            field: 'bud_spacing', 
            label: 'Bud Spacing', 
            type: 'select', // tight, average, spaced
            defaultTiming: { season: 'Summer' }
          },
          { 
            field: 'bud_size', 
            label: 'Bud Size', 
            type: 'select', // small medium large
            defaultTiming: { season: 'Summer' }
          },
          { 
            field: 'bud_exterior_color', 
            label: 'Bud Exterior Color', 
            type: 'text',
            defaultTiming: { season: 'Summer' }
          },
          { 
            field: 'bud_bumps_thrips_indicator', 
            label: 'Bud Bumps', 
            type: 'rating', // 1-10 few to many
            defaultTiming: { season: 'Spring' }
          },
            { 
              field: 'terminal_budding', // bud building
            label: 'Terminal Budding', 
            type: 'boolean',
            defaultTiming: { season: 'Summer' }
          },
          { 
            field: 'bud_building_in_adverse_conditions', 
            label: 'Bud Building in Adverse Conditions', 
            type: 'boolean',
            defaultTiming: { season: 'Summer' }
          },
          { 
            field: 'bud_drop_tendency', 
            label: 'Bud Drop Tendency', 
            type: 'rating', // 1-5 low-high
            defaultTiming: { season: 'Summer' }
          },
        ],
      },
      {
        name: 'Rebloom Characteristics',
        traits: [
          { 
            field: 'rebloom', 
            label: 'Rebloom', 
            type: 'boolean',
            defaultTiming: { season: 'Summer' }
          },
          { 
            field: 'instant_rebloom', 
            label: 'Instant Rebloom', 
            type: 'boolean',
            defaultTiming: { season: 'Summer' }
          },
        ],
      },
    ],
  },
  {
    name: '3. Bloom Timing & Behavior',
    groups: [
      {
        name: 'Season & Duration',
        traits: [
          { 
            field: 'bloom_season', 
            label: 'Bloom Season', 
            type: 'select', // extra early, early, early mid, mid, mid late, late, very late
            defaultTiming: { season: 'Summer' }
          },
          { 
            field: 'bloom_period_length', 
            label: 'Bloom Period Length (days)', 
            type: 'number', // calculated = Last bloom - first bloom
            defaultTiming: { excludeFromAutomaticCycle: true }
          },
          { 
            field: 'bloom_duration_daily_hours', 
            label: 'Bloom Duration Daily (hours)', 
            type: 'number',
            defaultTiming: { season: 'Summer' }
          },
          { 
            field: 'peak_blooms_per_day', 
            label: 'Peak Blooms per Day', 
            type: 'number',
            defaultTiming: { season: 'Summer' }
          },
          { 
            field: 'average_daily_bloom_load', 
            label: 'Average Daily Bloom Load', 
            type: 'number', // calculated = bud count / bloom period length
            defaultTiming: { excludeFromAutomaticCycle: true }
          },
        ],
      },
      {
        name: 'Daily Bloom Behavior',
        traits: [
          { 
            field: 'opening_speed', 
            label: 'Opening Speed', 
            type: 'rating', // 1-5 slow medium fast
            defaultTiming: { season: 'Summer' }
          },
          { 
            field: 'opening_time_of_day', 
            label: 'Opening Time of Day', 
            type: 'select', // midnight, early morning, morning, late morning, late afternoon, early evening, evening, late evening, night
            defaultTiming: { season: 'Summer' }
          },
          { 
            field: 'open_failures', 
            label: 'Open Failures', 
            type: 'select', // none, few, some, many
            defaultTiming: { season: 'Summer' }
          },
          { 
            field: 'wilt_time', 
            label: 'Wilt Time', 
            type: 'select', // midnight, early morning, morning, late morning, late afternoon, early evening, evening, late evening, night
            defaultTiming: { season: 'Summer' }
          },
          { 
            field: 'rain_response', 
            label: 'Rain Response', 
            type: 'select', // none, delayed open, no open
            defaultTiming: { season: 'Summer' }
          },
          { 
            field: 'petal_rain_tolerance', 
            label: 'Petal Rain Tolerance', 
            type: 'select', // no damage, minimal damaged edges, damaged edges, some damage, damaged, severe damage
            defaultTiming: { season: 'Summer' }
          },
        ],
      },
    ],
  },
  {
    name: '4. Flower Characteristics',
    groups: [
      {
        name: 'Main Form Classification',
        traits: [
          { 
            field: 'form_type', 
            label: 'Form Type', 
            type: 'select', // unusual form, standard, rounded, spider
            defaultTiming: { season: 'Summer' }
          },
          { 
            field: 'double_expression_percentage', 
            label: 'Double Expression %', 
            type: 'number',
            defaultTiming: { season: 'Summer' }
          },
          { 
            field: 'double_type', 
            label: 'Double Type', 
            type: 'select', // stigma transformation, hose n hose
            defaultTiming: { season: 'Summer' }
          },
          { 
            field: 'spider_ratio', 
            label: 'Spider Ratio', 
            type: 'number', // calculated = length : width
            defaultTiming: { excludeFromAutomaticCycle: true }
          },
          { 
            field: 'unusual_form_subtype', 
            label: 'Unusual Form Subtype', 
            type: 'select', // crispate, pinched crispate, twisted crispate, quilled crispate, cascade, spatulate
            defaultTiming: { season: 'Summer' }
          },
          { 
            field: 'polymerous_percentage', 
            label: 'Polymerous %', 
            type: 'number',
            defaultTiming: { season: 'Summer' }
          },
          { 
            field: 'polymerous_avg_petal_count', 
            label: 'Polymerous Avg Petal Count', 
            type: 'select', // 3,4,5,6,7,8
            defaultTiming: { season: 'Summer' }
          },
        ],
      },
      {
        name: 'Flower Dimensions',
        traits: [
          { 
            field: 'bloom_size', 
            label: 'Bloom Size (inches)', 
            type: 'number',
            defaultTiming: { season: 'Summer' }
          },
          { 
            field: 'petal_width', 
            label: 'Petal Width', 
            type: 'number',
            defaultTiming: { season: 'Summer' }
          },
          { 
            field: 'petal_length', 
            label: 'Petal Length', 
            type: 'number',
            defaultTiming: { season: 'Summer' }
          },
          { 
            field: 'sepal_width', 
            label: 'Sepal Width', 
            type: 'number',
            defaultTiming: { season: 'Summer' }
          },
          { 
            field: 'sepal_length', 
            label: 'Sepal Length', 
            type: 'number',
            defaultTiming: { season: 'Summer' }
          },
          { 
            field: 'flower_depth', 
            label: 'Flower Depth', 
            type: 'select', // flat, some, average, deep, trumpet
            defaultTiming: { season: 'Summer' }
          },
        ],
      },
      {
        name: 'Shape & Posture',
        traits: [
          { 
            field: 'petal_shape', 
            label: 'Petal Shape', 
            type: 'select', // wider towards base, mid section, tip
            defaultTiming: { season: 'Summer' }
          },
          { 
            field: 'recurved_petals', 
            label: 'Recurved Petals', 
            type: 'select', // no, some, strongly
            defaultTiming: { season: 'Summer' }
          },
          { 
            field: 'flower_orientation', 
            label: 'Flower Orientation', 
            type: 'select', // sideways, upright, vertically
            defaultTiming: { season: 'Summer' }
          },
          { 
            field: 'bloom_symmetry', 
            label: 'Bloom Symmetry', 
            type: 'select', // bilaterally or radially
            defaultTiming: { season: 'Summer' }
          },
          { 
            field: 'petal_matching_uniformity', 
            label: 'Petal Matching Uniformity', 
            type: 'rating', // 1-5 not uniform - identical
            defaultTiming: { season: 'Summer' }
          },
        ],
      },
      {
        name: 'Surface & Color Stability',
        traits: [
          { 
            field: 'petal_texture', 
            label: 'Petal Texture', 
            type: 'select', // slick / smooth / less smooth / coarse
            defaultTiming: { season: 'Summer' }
          },
          { 
            field: 'substance', 
            label: 'Substance', 
            type: 'rating', // 1-10 low to high
            defaultTiming: { season: 'Summer' }
          },
          { 
            field: 'diamond_dusting', 
            label: 'Diamond Dusting', 
            type: 'select', // no, low, medium, high
            defaultTiming: { season: 'Summer' }
          },
          { 
            field: 'metallic_sheen', 
            label: 'Metallic Sheen', 
            type: 'boolean',
            defaultTiming: { season: 'Summer' }
          },
          { 
            field: 'surface_finish', 
            label: 'Surface Finish', 
            type: 'text',
            defaultTiming: { season: 'Summer' }
          },
          { 
            field: 'reverse_color', 
            label: 'Reverse Color', 
            type: 'boolean',
            defaultTiming: { season: 'Summer' }
          },
          { 
            field: 'fade_resistance', 
            label: 'Fade Resistance', 
            type: 'rating', // 1-5 very low to very high
            defaultTiming: { season: 'Summer' }
          },
          { 
            field: 'color_fade_speed', 
            label: 'Color Fade Speed', 
            type: 'rating', // 1-5 none, slow, medium, high
            defaultTiming: { season: 'Summer' }
          },
          {
            field: 'fade_to_color',
            label: 'Fade to Color',
            type: 'text',
            defaultTiming: { season: 'Summer' }
          },
          { 
            field: 'sunburn_on_petals', 
            label: 'Sunburn on Petals', 
            type: 'boolean',
            defaultTiming: { season: 'Summer' }
          },
          { 
            field: 'heat_fade_resistance', 
            label: 'Heat Fade Resistance', 
            type: 'rating', // 1-5 low to high
            defaultTiming: { season: 'Summer' }
          },
          { 
            field: 'color_intensity_in_heat', 
            label: 'Color Intensity in Heat', 
            type: 'rating', // 1-5  low to high
            defaultTiming: { season: 'Summer' }
          },
          { 
            field: 'color_intensity_in_cool', 
            label: 'Color Intensity in Cool', 
            type: 'rating', // 1-5 low to high
            defaultTiming: { season: 'Summer' }
          },
          { 
            field: 'morning_vs_evening_color_difference', 
            label: 'Morning vs Evening Color Difference', 
            type: 'text',
            defaultTiming: { season: 'Summer' }
          },
        ],
      },
      {
        name: 'Edge Characteristics',
        traits: [
          { 
            field: 'edge_type', 
            label: 'Edge Type (Structural)', 
            type: 'select', // plain, ruffled, teeth
            defaultTiming: { season: 'Summer' }
          },
          { 
            field: 'edge_color_type', 
            label: 'Edge Color Type', 
            type: 'select', // wire, picotee, border, multiple
            defaultTiming: { season: 'Summer' }
          },
          { 
            field: 'edge_color', 
            label: 'Edge Color', 
            type: 'text',
            defaultTiming: { season: 'Summer' }
          },
          { 
            field: 'edge_formation_depth', 
            label: 'Edge Formation Depth', 
            type: 'rating', // 1-5 low, medium, high, extreme
            defaultTiming: { season: 'Summer' }
          },
          { 
            field: 'edge_formation_on_petal_tips', 
            label: 'Edge Formation on Petal Tips', 
            type: 'boolean',
            defaultTiming: { season: 'Summer' }
          },
          { 
            field: 'edge_formation_on_sepals', 
            label: 'Edge Formation on Sepals', 
            type: 'boolean',
            defaultTiming: { season: 'Summer' }
          },
          { 
            field: 'edge_width', 
            label: 'Edge Width', 
            type: 'number',
            defaultTiming: { season: 'Summer' }
          },
          { 
            field: 'edge_consistency', 
            label: 'Edge Consistency', 
            type: 'rating', // 1-5 low to high
            defaultTiming: { season: 'Summer' }
          },
        ],
      },
      {
        name: 'Pleating & Sculpting',
        traits: [
          { 
            field: 'pleating_present', 
            label: 'Pleating Present', 
            type: 'boolean',
            defaultTiming: { season: 'Summer' }
          },
          { 
            field: 'pleating_depth', 
            label: 'Pleating Depth', 
            type: 'select',
            defaultTiming: { season: 'Summer' }
          },
          { 
            field: 'pleating_coverage', 
            label: 'Pleating Coverage', 
            type: 'select',
            defaultTiming: { season: 'Summer' }
          },
          { 
            field: 'sculpting_type', 
            label: 'Sculpting Type', 
            type: 'select', // midrib cristate, other cristate, barbed/bearded cristate, severe bearding, other/multiple
            defaultTiming: { season: 'Summer' }
          },
        ],
      },
      {
        name: 'Base Color',
        traits: [
          { 
            field: 'base_color', 
            label: 'Base Color', 
            type: 'text',
            defaultTiming: { season: 'Summer' }
          },
          { 
            field: 'color_intensity', 
            label: 'Color Intensity', 
            type: 'select',
            defaultTiming: { season: 'Summer' }
          },
          { 
            field: 'color_pattern', 
            label: 'Color Pattern', 
            type: 'select',
            defaultTiming: { season: 'Summer' }
          },
        ],
      },
      {
        name: 'Eye Zone',
        traits: [
          { 
            field: 'eye_or_watermark_present', 
            label: 'Eye or Watermark Present', 
            type: 'select', // self, subtle watermark, watermark, distinct watermark, subtle eye, eye, distinct eye
            defaultTiming: { season: 'Summer' }
          },
          { 
            field: 'eye_color', 
            label: 'Eye Color', 
            type: 'text',
            defaultTiming: { season: 'Summer' }
          },
          { 
            field: 'eye_size', 
            label: 'Eye Size', 
            type: 'rating', // 1-5 small to large
            defaultTiming: { season: 'Summer' }
          },
          { 
            field: 'eye_shape', 
            label: 'Eye Shape', 
            type: 'select', // round, oval, angular, irregular, delta v double barbed
            defaultTiming: { season: 'Summer' }
          },
          { 
            field: 'eye_patterned', 
            label: 'Eye Patterned', 
            type: 'boolean',
            defaultTiming: { season: 'Summer' }
          },
          { 
            field: 'eye_definition', 
            label: 'Eye Definition', 
            type: 'rating', // 1-5 low to high
            defaultTiming: { season: 'Summer' }
          },
          { 
            field: 'eye_visibility_in_sun', 
            label: 'Eye Visibility in Sun', 
            type: 'rating', // 1-5 low to high
            defaultTiming: { season: 'Summer' }
          },
          { 
            field: 'eye_visibility_under_blacklight', 
            label: 'Eye Visibility Under Blacklight', 
            type: 'rating', // 1-5 low to high
            defaultTiming: { season: 'Summer' }
          },
        ],
      },
      {
        name: 'Throat',
        traits: [
          { 
            field: 'throat_color', 
            label: 'Throat Color', 
            type: 'select', // yellow, yellow-gold, gold, yellow-green, green, gold-green
            defaultTiming: { season: 'Summer' }
          },
          { 
            field: 'throat_size', 
            label: 'Throat Size', 
            type: 'rating', // 1-5 small to large
            defaultTiming: { season: 'Summer' }
          },
        ],
      },
      {
        name: 'Additional Color Features',
        traits: [
          { 
            field: 'veining_present', 
            label: 'Veining Present', 
            type: 'boolean',
            defaultTiming: { season: 'Summer' }
          },
          { 
            field: 'veining_color', 
            label: 'Veining Color', 
            type: 'text',
            defaultTiming: { season: 'Summer' }
          },
          { 
            field: 'veining_intensity', 
            label: 'Veining Intensity', 
            type: 'rating', // 1-5 low to high
            defaultTiming: { season: 'Summer' }
          },
          { 
            field: 'midrib_color', 
            label: 'Midrib Color', 
            type: 'text',
            defaultTiming: { season: 'Summer' }
          },
          { 
            field: 'midrib_width', 
            label: 'Midrib Width', 
            type: 'rating', // 1-5 thin to wide
            defaultTiming: { season: 'Summer' }
          },
          { 
            field: 'petal_striping', 
            label: 'Petal Striping', 
            type: 'boolean',
            defaultTiming: { season: 'Summer' }
          },
          { 
            field: 'stippling_bubbling', 
            label: 'Stippling/Bubbling', 
            type: 'boolean',
            defaultTiming: { season: 'Summer' }
          },
          { 
            field: 'stippling_color', 
            label: 'Stippling Color', 
            type: 'text',
            defaultTiming: { season: 'Summer' }
          },
          { 
            field: 'color_saturation_uniformity', 
            label: 'Color Saturation Uniformity', 
            type: 'rating', // 1-5 low to high
            defaultTiming: { season: 'Summer' }
          },
        ],
      },
      {
        name: 'Color Stability',
        traits: [
          { 
            field: 'fade_resistance', 
            label: 'Fade Resistance', 
            type: 'rating', // 1-5 very low to very high
            defaultTiming: { season: 'Summer' }
          },
          { 
            field: 'color_fade_speed', 
            label: 'Color Fade Speed', 
            type: 'rating', // 1-5 none, slow, medium, high
            defaultTiming: { season: 'Summer' }
          },
          { 
            field: 'fade_to_color', 
            label: 'Fade to Color', 
            type: 'text',
            defaultTiming: { season: 'Summer' }
          },
          { 
            field: 'sunburn_on_petals', 
            label: 'Sunburn on Petals', 
            type: 'boolean',
            defaultTiming: { season: 'Summer' }
          },
          { 
            field: 'heat_fade_resistance', 
            label: 'Heat Fade Resistance', 
            type: 'rating', // 1-5 low to high
            defaultTiming: { season: 'Summer' }
          },
          { 
            field: 'color_intensity_in_heat', 
            label: 'Color Intensity in Heat', 
            type: 'rating', // 1-5 low to high
            defaultTiming: { season: 'Summer' }
          },
          { 
            field: 'color_intensity_in_cool', 
            label: 'Color Intensity in Cool', 
            type: 'rating', // 1-5 low to high',
            defaultTiming: { season: 'Summer' }
          },
          { 
            field: 'morning_vs_evening_color_difference', 
            label: 'Morning vs Evening Color Difference', 
            type: 'text',
            defaultTiming: { season: 'Summer' }
          },
        ],
      },
    ],
  },
  {
    name: '5. Parentage',
    groups: [
      {
        name: 'Main Parentage',
        traits: [
          { 
            field: 'pod_parent', 
            label: 'Pod Parent', 
            type: 'text',
            defaultTiming: { excludeFromAutomaticCycle: true }
          },
          { 
            field: 'pollen_parent', 
            label: 'Pollen Parent', 
            type: 'text',
            defaultTiming: { excludeFromAutomaticCycle: true }
          },
          { 
            field: 'registered_pedigree', 
            label: 'Registered Pedigree', 
            type: 'text',
            defaultTiming: { excludeFromAutomaticCycle: true }
          },
        ],
      },
    ],
  },
  {
    name: '6. Inventory',
    groups: [
      {
        name: 'Inventory Management',
        traits: [
          { 
            field: 'availability', 
            label: 'Availability', 
            type: 'select', // display, held for increase, limited, available
            defaultTiming: { excludeFromAutomaticCycle: true }
          },
          { 
            field: 'price', 
            label: 'Price', 
            type: 'number',
            defaultTiming: { excludeFromAutomaticCycle: true }
          },
          { 
            field: 'status', 
            label: 'Status', 
            type: 'select',
            defaultTiming: { excludeFromAutomaticCycle: true }
          },
        ],
      },
    ],
  },
  {
    name: '7. Reproductive Traits',
    groups: [
      {
        name: 'Pollen Fertility',
        traits: [
          { 
            field: 'pollen_fertility', 
            label: 'Pollen Fertility', 
            type: 'rating', // 1-5 very low to very high
            defaultTiming: { season: 'Summer' }
          },
          { 
            field: 'pollen_production_consistency', 
            label: 'Pollen Production Consistency', 
            type: 'rating', // 1-5 low to high',
            defaultTiming: { season: 'Summer' }
          },
          { 
            field: 'pollen_viability_in_heat', 
            label: 'Pollen Viability in Heat', 
            type: 'rating', // 1-5 low to high,
            defaultTiming: { season: 'Summer' }
          },
          { 
            field: 'pollen_storage_ability', 
            label: 'Pollen Storage Ability', 
            type: 'rating', // 1-5 low to high
            defaultTiming: { excludeFromAutomaticCycle: true }
          },
          { 
            field: 'pollen_color', 
            label: 'Pollen Color', 
            type: 'text',
            defaultTiming: { season: 'Summer' }
          },
          { 
            field: 'produces_tet_compatible_pollen', 
            label: 'Produces Tet Compatible Pollen', 
            type: 'boolean',
            defaultTiming: { season: 'Summer' }
          },
          { 
            field: 'produces_dip_compatible_pollen', 
            label: 'Produces Dip Compatible Pollen', 
            type: 'boolean',
            defaultTiming: { season: 'Summer' }
          },
        ],
      },
      {
        name: 'Pod Fertility',
        traits: [
          { 
            field: 'pod_fertility', 
            label: 'Pod Fertility', 
            type: 'rating', // 0-5 very low to very high
            defaultTiming: { season: 'Summer' }
          },
          { 
            field: 'pod_set_reliability', 
            label: 'Pod Set Reliability', 
            type: 'rating', // 0-5 low to high',
            defaultTiming: { season: 'Summer' }
          },
          { 
            field: 'pod_set_in_heat', 
            label: 'Pod Set in Heat', 
            type: 'rating', // 1-5 low to high
            defaultTiming: { season: 'Summer' }
          },
          { 
            field: 'accepts_dip_pollen', 
            label: 'Accepts Dip Pollen', 
            type: 'boolean',
            defaultTiming: { season: 'Summer' }
          },
          { 
            field: 'accepts_tet_pollen', 
            label: 'Accepts Tet Pollen', 
            type: 'boolean',
            defaultTiming: { season: 'Summer' }
          },
          { 
            field: 'seed_count_per_pod', 
            label: 'Seed Count per Pod', 
            type: 'number',
            defaultTiming: { season: 'Fall' }
          },
          { 
            field: 'seed_viability_rate', 
            label: 'Seed Viability Rate (%)', 
            type: 'number',
            defaultTiming: { excludeFromAutomaticCycle: true }
          },
          { 
            field: 'embryo_abortion_rate', 
            label: 'Embryo Abortion Rate', 
            type: 'number',
            defaultTiming: { season: 'Fall' }
          },
        ],
      },
      {
        name: 'Pod Characteristics',
        traits: [
          { 
            field: 'pod_color', 
            label: 'Pod Color', 
            type: 'text',
            defaultTiming: { season: 'Fall' }
          },
          { 
            field: 'pod_size', 
            label: 'Pod Size', 
            type: 'rating', // 1-5 extra small, small, medium, large, extra large
            defaultTiming: { season: 'Fall' }
          },
          { 
            field: 'pod_shape', 
            label: 'Pod Shape', 
            type: 'select', // round, ovular, elongated, Oblanceolate
            defaultTiming: { season: 'Fall' }
          },
          { 
            field: 'pod_maturation_period', 
            label: 'Pod Maturation Period (days)', 
            type: 'number',
            defaultTiming: { excludeFromAutomaticCycle: true }
          },
          { 
            field: 'seed_size', 
            label: 'Seed Size', 
            type: 'rating', // 1-5 extra small, small, medium, large, extra large
            defaultTiming: { season: 'Fall' }
          },
          { 
            field: 'seed_fullness', 
            label: 'Seed Fullness', 
            type: 'rating', // 1-5 crinkly, semi full, full
            defaultTiming: { season: 'Fall' }
          },
        ],
      },
    ],
  },
];
