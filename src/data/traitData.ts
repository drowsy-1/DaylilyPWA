export interface Trait {
  field: string;
  label: string;
  type?: string;
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
          { field: 'type', label: 'Type', type: 'select' },
          { field: 'variety_name', label: 'Variety Name', type: 'text' },
          { field: 'nickname', label: 'Nickname', type: 'text' },
          { field: 'seedling_number', label: 'Seedling Number', type: 'text' },
          { field: 'location', label: 'Location', type: 'text' },
          { field: 'year_introduced', label: 'Year Introduced', type: 'number' },
          { field: 'first_year_on_record', label: '1st Year on Record', type: 'number' },
          { field: 'ploidy', label: 'Ploidy', type: 'select' },
          { field: 'hybridizer_name', label: 'Hybridizer Name', type: 'text' },
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
          { field: 'foliage_type', label: 'Foliage Type', type: 'select' },
          { field: 'foliage_height', label: 'Foliage Height', type: 'number' },
          { field: 'foliage_color', label: 'Foliage Color', type: 'text' },
          { field: 'foliage_density', label: 'Foliage Density', type: 'select' },
          { field: 'foliage_architecture', label: 'Foliage Architecture', type: 'select' },
          { field: 'foliage_thickness', label: 'Foliage Thickness', type: 'select' },
          { field: 'foliage_undulation', label: 'Foliage Undulation', type: 'boolean' },
          { field: 'leaf_cross_section', label: 'Leaf Cross Section', type: 'select' },
          { field: 'leaf_glossiness', label: 'Leaf Glossiness', type: 'select' },
          { field: 'spring_sickness_present', label: 'Spring Sickness Present', type: 'boolean' },
          { field: 'drought_dormancy', label: 'Drought Dormancy', type: 'boolean' },
          { field: 'early_fall_dormancy', label: 'Early Fall Dormancy', type: 'boolean' },
          { field: 'late_season_foliage_quality', label: 'Late Season Foliage Quality', type: 'select' },
        ],
      },
      {
        name: 'Clump & Growth Habits',
        traits: [
          { field: 'relative_clump_size', label: 'Relative Clump Size', type: 'select' },
          { field: 'fan_count', label: 'Fan Count', type: 'number' },
          { field: 'fan_multiplication_rate', label: 'Fan Multiplication Rate', type: 'select' },
          { field: 'fan_fragility', label: 'Fan Fragility', type: 'boolean' },
          { field: 'summer_dormancy', label: 'Summer Dormancy', type: 'boolean' },
          { field: 'transplant_recovery_speed', label: 'Transplant Recovery Speed', type: 'select' },
          { field: 'container_performance', label: 'Container Performance', type: 'select' },
        ],
      },
      {
        name: 'Scape Physical Traits',
        traits: [
          { field: 'scape_height', label: 'Scape Height (inches)', type: 'number' },
          { field: 'scape_strength_rigidity', label: 'Scape Strength Rigidity (1-10)', type: 'rating' },
          { field: 'scape_base_connection_strength', label: 'Scape Base Connection Strength', type: 'select' },
          { field: 'scape_color', label: 'Scape Color', type: 'text' },
          { field: 'scape_angle', label: 'Scape Angle', type: 'select' },
          { field: 'scape_distance_from_foliage', label: 'Scape Distance from Foliage', type: 'select' },
        ],
      },
      {
        name: 'Branching Structure',
        traits: [
          { field: 'branch_count', label: 'Branch Count', type: 'number' },
          { field: 'branch_form', label: 'Branch Form', type: 'select' },
          { field: 'branch_spacing', label: 'Branch Spacing', type: 'select' },
          { field: 'alternating_branches', label: 'Alternating Branches', type: 'boolean' },
          { field: 'lateral_budding', label: 'Lateral Budding', type: 'boolean' },
          { field: 'self_branching_secondary', label: 'Self Branching Secondary', type: 'boolean' },
        ],
      },
      {
        name: 'Bud Traits',
        traits: [
          { field: 'bud_count_per_scape', label: 'Bud Count per Scape', type: 'number' },
          { field: 'bud_spacing', label: 'Bud Spacing', type: 'select' },
          { field: 'bud_size', label: 'Bud Size', type: 'select' },
          { field: 'bud_exterior_color', label: 'Bud Exterior Color', type: 'text' },
          { field: 'bud_bumps_thrips_indicator', label: 'Bud Bumps (Thrips Indicator)', type: 'boolean' },
          { field: 'terminal_budding', label: 'Terminal Budding', type: 'boolean' },
          { field: 'bud_building_in_adverse_conditions', label: 'Bud Building in Adverse Conditions', type: 'boolean' },
          { field: 'bud_drop_tendency', label: 'Bud Drop Tendency', type: 'select' },
        ],
      },
      {
        name: 'Rebloom Characteristics',
        traits: [
          { field: 'rebloom', label: 'Rebloom', type: 'boolean' },
          { field: 'instant_rebloom', label: 'Instant Rebloom', type: 'boolean' },
          { field: 'rebloom_timing', label: 'Rebloom Timing', type: 'select' },
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
          { field: 'bloom_season', label: 'Bloom Season', type: 'select' },
          { field: 'bloom_period_length', label: 'Bloom Period Length (days)', type: 'number' },
          { field: 'bloom_duration_daily', label: 'Bloom Duration Daily', type: 'select' },
          { field: 'peak_blooms_per_day', label: 'Peak Blooms per Day', type: 'number' },
          { field: 'average_daily_bloom_load', label: 'Average Daily Bloom Load', type: 'number' },
        ],
      },
      {
        name: 'Daily Bloom Behavior',
        traits: [
          { field: 'opening_speed', label: 'Opening Speed', type: 'select' },
          { field: 'opening_time_of_day', label: 'Opening Time of Day', type: 'time' },
          { field: 'open_failures', label: 'Open Failures', type: 'boolean' },
          { field: 'closing_time', label: 'Closing Time', type: 'time' },
          { field: 'rain_response', label: 'Rain Response', type: 'select' },
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
          { field: 'form_type', label: 'Form Type', type: 'select' },
          { field: 'double_expression_percentage', label: 'Double Expression %', type: 'number' },
          { field: 'double_type', label: 'Double Type', type: 'select' },
          { field: 'spider_ratio', label: 'Spider Ratio', type: 'number' },
          { field: 'unusual_form_subtype', label: 'Unusual Form Subtype', type: 'select' },
          { field: 'polymerous_percentage', label: 'Polymerous %', type: 'number' },
          { field: 'polymerous_avg_petal_count', label: 'Polymerous Avg Petal Count', type: 'number' },
        ],
      },
      {
        name: 'Flower Dimensions',
        traits: [
          { field: 'bloom_size', label: 'Bloom Size (inches)', type: 'number' },
          { field: 'petal_width', label: 'Petal Width', type: 'number' },
          { field: 'petal_length', label: 'Petal Length', type: 'number' },
          { field: 'sepal_width', label: 'Sepal Width', type: 'number' },
          { field: 'sepal_length', label: 'Sepal Length', type: 'number' },
          { field: 'flower_depth', label: 'Flower Depth', type: 'select' },
        ],
      },
      {
        name: 'Shape & Posture',
        traits: [
          { field: 'petal_shape', label: 'Petal Shape', type: 'select' },
          { field: 'recurved_petals', label: 'Recurved Petals', type: 'select' },
          { field: 'flower_orientation', label: 'Flower Orientation', type: 'select' },
          { field: 'bloom_symmetry', label: 'Bloom Symmetry (1-10)', type: 'rating' },
          { field: 'petal_matching_uniformity', label: 'Petal Matching Uniformity (1-10)', type: 'rating' },
        ],
      },
      {
        name: 'Surface & Finish',
        traits: [
          { field: 'petal_texture', label: 'Petal Texture', type: 'select' },
          { field: 'substance', label: 'Substance (1-10)', type: 'rating' },
          { field: 'diamond_dusting', label: 'Diamond Dusting', type: 'select' },
          { field: 'metallic_sheen', label: 'Metallic Sheen', type: 'boolean' },
          { field: 'surface_finish', label: 'Surface Finish', type: 'select' },
          { field: 'reverse_color', label: 'Reverse Color', type: 'text' },
        ],
      },
      {
        name: 'Edge - Teeth',
        traits: [
          { field: 'teeth_present', label: 'Teeth Present', type: 'boolean' },
          { field: 'teeth_count', label: 'Teeth Count', type: 'select' },
          { field: 'teeth_size', label: 'Teeth Size', type: 'select' },
          { field: 'teeth_color', label: 'Teeth Color', type: 'text' },
          { field: 'teeth_pattern', label: 'Teeth Pattern', type: 'select' },
          { field: 'teeth_on_petals', label: 'Teeth on Petals', type: 'boolean' },
          { field: 'teeth_on_sepals', label: 'Teeth on Sepals', type: 'boolean' },
        ],
      },
      {
        name: 'Edge - Ruffles',
        traits: [
          { field: 'ruffles_present', label: 'Ruffles Present', type: 'boolean' },
          { field: 'ruffle_size', label: 'Ruffle Size', type: 'select' },
          { field: 'ruffle_intensity', label: 'Ruffle Intensity', type: 'select' },
          { field: 'edge_type', label: 'Edge Type', type: 'select' },
          { field: 'edge_width', label: 'Edge Width', type: 'number' },
          { field: 'edge_consistency', label: 'Edge Consistency', type: 'select' },
        ],
      },
      {
        name: 'Pleating & Sculpting',
        traits: [
          { field: 'pleating_present', label: 'Pleating Present', type: 'boolean' },
          { field: 'pleating_depth', label: 'Pleating Depth', type: 'select' },
          { field: 'pleating_coverage', label: 'Pleating Coverage', type: 'select' },
          { field: 'sculpting_type', label: 'Sculpting Type', type: 'select' },
        ],
      },
      {
        name: 'Base Color',
        traits: [
          { field: 'base_color', label: 'Base Color', type: 'text' },
          { field: 'color_intensity', label: 'Color Intensity', type: 'select' },
          { field: 'color_pattern', label: 'Color Pattern', type: 'select' },
        ],
      },
      {
        name: 'Eye Zone',
        traits: [
          { field: 'eye_present', label: 'Eye Present', type: 'boolean' },
          { field: 'eye_color', label: 'Eye Color', type: 'text' },
          { field: 'eye_size', label: 'Eye Size', type: 'select' },
          { field: 'eye_shape', label: 'Eye Shape', type: 'select' },
          { field: 'eye_pattern', label: 'Eye Pattern', type: 'select' },
          { field: 'eye_definition', label: 'Eye Definition', type: 'select' },
          { field: 'eye_visibility_in_sun', label: 'Eye Visibility in Sun', type: 'select' },
        ],
      },
      {
        name: 'Throat',
        traits: [
          { field: 'throat_color', label: 'Throat Color', type: 'text' },
          { field: 'throat_size', label: 'Throat Size', type: 'select' },
          { field: 'throat_pattern', label: 'Throat Pattern', type: 'select' },
        ],
      },
      {
        name: 'Edge/Picotee',
        traits: [
          { field: 'edge_color', label: 'Edge Color', type: 'text' },
          { field: 'edge_width_color', label: 'Edge Width', type: 'number' },
          { field: 'edge_type_color', label: 'Edge Type', type: 'select' },
          { field: 'edge_consistency_color', label: 'Edge Consistency', type: 'select' },
        ],
      },
      {
        name: 'Watermark',
        traits: [
          { field: 'watermark_present', label: 'Watermark Present', type: 'boolean' },
          { field: 'watermark_color', label: 'Watermark Color', type: 'text' },
          { field: 'watermark_shape', label: 'Watermark Shape', type: 'select' },
          { field: 'watermark_visibility', label: 'Watermark Visibility', type: 'select' },
        ],
      },
      {
        name: 'Additional Color Features',
        traits: [
          { field: 'veining_present', label: 'Veining Present', type: 'boolean' },
          { field: 'veining_color', label: 'Veining Color', type: 'text' },
          { field: 'veining_intensity', label: 'Veining Intensity', type: 'select' },
          { field: 'midrib_color', label: 'Midrib Color', type: 'text' },
          { field: 'midrib_width', label: 'Midrib Width', type: 'number' },
          { field: 'petal_striping', label: 'Petal Striping', type: 'boolean' },
          { field: 'stippling_bubbling', label: 'Stippling/Bubbling', type: 'boolean' },
          { field: 'stippling_color', label: 'Stippling Color', type: 'text' },
          { field: 'color_saturation_uniformity', label: 'Color Saturation Uniformity', type: 'select' },
        ],
      },
      {
        name: 'Color Stability',
        traits: [
          { field: 'fade_resistance', label: 'Fade Resistance', type: 'select' },
          { field: 'color_fade_speed', label: 'Color Fade Speed', type: 'select' },
          { field: 'fade_to_color', label: 'Fade to Color', type: 'text' },
          { field: 'sunburn_on_petals', label: 'Sunburn on Petals', type: 'boolean' },
          { field: 'heat_fade_resistance', label: 'Heat Fade Resistance', type: 'select' },
          { field: 'color_intensity_in_heat', label: 'Color Intensity in Heat', type: 'select' },
          { field: 'color_intensity_in_cool', label: 'Color Intensity in Cool', type: 'select' },
          { field: 'morning_vs_evening_color_difference', label: 'Morning vs Evening Color Difference', type: 'text' },
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
          { field: 'pod_parent', label: 'Pod Parent', type: 'text' },
          { field: 'pollen_parent', label: 'Pollen Parent', type: 'text' },
          { field: 'registered_pedigree', label: 'Registered Pedigree', type: 'text' },
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
          { field: 'availability', label: 'Availability', type: 'select' },
          { field: 'price', label: 'Price', type: 'number' },
          { field: 'status', label: 'Status', type: 'select' },
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
          { field: 'pollen_fertility', label: 'Pollen Fertility', type: 'select' },
          { field: 'pollen_production_consistency', label: 'Pollen Production Consistency', type: 'select' },
          { field: 'pollen_viability_in_heat', label: 'Pollen Viability in Heat', type: 'select' },
          { field: 'pollen_storage_ability', label: 'Pollen Storage Ability', type: 'text' },
          { field: 'pollen_color', label: 'Pollen Color', type: 'text' },
          { field: 'crosses_easily_on_dips', label: 'Crosses Easily on Dips', type: 'boolean' },
          { field: 'crosses_easily_on_tets', label: 'Crosses Easily on Tets', type: 'boolean' },
        ],
      },
      {
        name: 'Pod Fertility',
        traits: [
          { field: 'pod_fertility', label: 'Pod Fertility', type: 'select' },
          { field: 'pod_set_reliability', label: 'Pod Set Reliability', type: 'select' },
          { field: 'pod_set_in_heat', label: 'Pod Set in Heat', type: 'select' },
          { field: 'accepts_dip_pollen', label: 'Accepts Dip Pollen', type: 'boolean' },
          { field: 'accepts_tet_pollen', label: 'Accepts Tet Pollen', type: 'boolean' },
          { field: 'seed_count_per_pod', label: 'Seed Count per Pod', type: 'number' },
          { field: 'seed_viability_rate', label: 'Seed Viability Rate (%)', type: 'number' },
          { field: 'embryo_abortion_rate', label: 'Embryo Abortion Rate', type: 'number' },
          { field: 'conversion_parent', label: 'Conversion Parent', type: 'text' },
        ],
      },
      {
        name: 'Pod Characteristics',
        traits: [
          { field: 'pod_color', label: 'Pod Color', type: 'text' },
          { field: 'pod_size', label: 'Pod Size', type: 'select' },
          { field: 'pod_shape', label: 'Pod Shape', type: 'text' },
          { field: 'pod_maturation_period', label: 'Pod Maturation Period (days)', type: 'number' },
          { field: 'seed_size', label: 'Seed Size', type: 'select' },
          { field: 'seed_color', label: 'Seed Color', type: 'text' },
        ],
      },
    ],
  },
];
