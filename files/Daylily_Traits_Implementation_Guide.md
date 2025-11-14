# Daylily Traits - Implementation Quick Reference

## Database Schema Planning Guide

---

## TIER 1: CORE FIELDS (Main Variety Table)
**These 20 fields should be in your primary `varieties` table**

### Identifiers (7)
```sql
- id (UUID, primary key)
- variety_name (VARCHAR, UNIQUE, NOT NULL)
- seedling_number (VARCHAR)
- registration_number (VARCHAR)
- hybridizer (VARCHAR)
- year_introduced (INTEGER)
- ploidy (ENUM: Diploid/Tetraploid/Triploid)
- foliage_type (ENUM: Dormant/Evergreen/Semi-Evergreen)
```

### Core Measurements (8)
```sql
- scape_height (NUMERIC, inches)
- bloom_size (NUMERIC, inches)
- branch_count (INTEGER)
- bud_count_per_scape (INTEGER)
- pollen_fertility (ENUM: none/low/moderate/high/very high)
- pod_fertility (ENUM: none/low/moderate/high/very high)
- base_color (VARCHAR)
- form_type (VARCHAR: single/double/spider/unusual form/polymerous)
```

### Descriptions (5)
```sql
- color_description (TEXT)
- public_description (TEXT)
- private_notes (TEXT)
- source (VARCHAR: AHS Database/Manual Entry/etc.)
- image_primary_url (VARCHAR)
```

**Total Core: 20 fields**

---

## TIER 2: STANDARD OBSERVATIONS (Observations Table)
**These 56 fields should be in repeatable `observations` table**

> **Note:** Fan/scape ratio metrics (6 fields) are HIGH PRIORITY for breeding programs. They quantify true floriferousness independent of clump size—critical for parent selection and seedling evaluation.

### Per-Observation Measurements (12)
```sql
- observation_date (DATE)
- observation_year (INTEGER)
- scape_height_measured (NUMERIC)
- bloom_size_measured (NUMERIC)
- bud_count_measured (INTEGER)
- branches_measured (INTEGER)
- peak_blooms_per_day (INTEGER)
- bloom_period_length (INTEGER, days)
- opening_time_of_day (TIME)
- closing_time (TIME)
- foliage_height (NUMERIC, inches)
- clump_size_rating (1-3: small/medium/large)
```

### Fan Count & Scape Production Metrics (6)
```sql
- fan_count_spring (INTEGER, count in spring before bloom)
- fan_count_fall (INTEGER, count at end of season)
- scape_count_first_bloom (INTEGER, scapes produced in first flush)
- fan_to_scape_ratio_first_bloom (NUMERIC, calculated: scapes/fans)
- scape_count_rebloom (INTEGER, if rebloomer)
- fan_to_scape_ratio_rebloom (NUMERIC, calculated: rebloom scapes/fans)
```

### Performance Ratings (15)
```sql
- overall_vigor (1-10)
- scape_strength (1-10)
- bloom_symmetry (1-10)
- substance (1-10)
- color_intensity (1-10)
- fade_resistance (1-10)
- heat_tolerance (1-10)
- cold_hardiness (1-10)
- disease_resistance (1-10)
- pest_resistance (1-10)
- weather_tolerance (1-10)
- drought_tolerance (1-10)
- exhibition_quality (1-10)
- instant_impact_rating (1-10)
- breeding_potential_rating (1-10)
```

### Color Observations (10)
```sql
- eye_present (BOOLEAN)
- eye_color (VARCHAR)
- eye_size (ENUM: small/medium/large/extra large)
- throat_color (VARCHAR)
- edge_present (BOOLEAN)
- edge_color (VARCHAR)
- edge_width (NUMERIC, inches)
- color_fade_observed (BOOLEAN)
- color_intensity_in_heat (ENUM: fades/holds/intensifies)
- diamond_dusting (ENUM: none/light/medium/heavy)
```

### Environmental Context (6)
```sql
- weather_conditions (VARCHAR)
- temperature_range (VARCHAR)
- rainfall_status (ENUM: Normal/Drought/Excessive)
- sun_exposure (ENUM: Full Sun/Part Shade/Shade)
- wind_conditions (ENUM: Calm/Breezy/Windy)
- observation_notes (TEXT)
```

### Bloom Behavior (7)
```sql
- bloom_season_observed (ENUM: EE/E/EM/M/ML/L/EL)
- rebloom_occurred (BOOLEAN)
- opening_speed (ENUM: slow/moderate/fast)
- sun_open_failures (BOOLEAN)
- rain_damage (BOOLEAN)
- spent_bloom_cleanup (ENUM: self-cleaning/needs help)
- flower_orientation (ENUM: upfacing/outfacing/downfacing/recurved)
```

**Total Standard Observations: 56 fields**

---

## TIER 3A: ADVANCED MORPHOLOGY (Custom Traits - High Priority)
**Implement these as custom_trait_values for detailed analysis**

### Teeth System (10 fields)
```
teeth_present, teeth_count, teeth_size, teeth_color, 
teeth_pattern, teeth_on_petals, teeth_on_sepals,
teeth_curled, teeth_straight, teeth_consistency
```

### Edge/Ruffles System (8 fields)
```
ruffles_present, ruffle_size, ruffle_intensity,
edge_type, edge_consistency, edge_pattern,
picotee_width, bubble_edge_present
```

### Pleating System (5 fields)
```
pleating_present, pleating_depth, pleating_coverage,
pleating_consistency, pleating_visibility_in_sun
```

### Eye Detail System (8 fields)
```
eye_shape, eye_pattern, eye_definition, 
eye_visibility_in_sun, eye_visibility_in_shade,
eye_on_sepals, eye_multicolor, eye_halo_present
```

### Watermark/Veining (6 fields)
```
watermark_present, watermark_color, watermark_shape,
veining_present, veining_color, veining_intensity
```

**Total Advanced Morphology (High Priority): 37 fields**

---

## TIER 3B: ADVANCED MORPHOLOGY (Custom Traits - Medium Priority)

### Detailed Flower Structure (15 fields)
```
petal_width, petal_length, petal_shape, sepal_width, sepal_length,
flower_depth, recurved_petals, petal_texture, surface_finish,
metallic_sheen, reverse_color, petal_matching_uniformity,
double_expression_percentage, polymerous_avg_petal_count, spider_ratio
```

### Foliage Architecture (9 fields)
```
foliage_color, foliage_density, foliage_architecture,
foliage_thickness, foliage_undulation, leaf_cross_section,
leaf_glossiness, spring_sickness_present, foliage_off_season_quality
```

### Scape Details (6 fields)
```
scape_color, scape_angle, scape_distance_from_foliage,
branch_form, branch_spacing, alternating_branches
```

### Bud Details (6 fields)
```
bud_spacing, bud_size, bud_color, bud_building_type,
bud_drop_tendency, bud_bumps_thrips_indicator
```

**Total Advanced Morphology (Medium Priority): 36 fields**

---

## TIER 3C: SPECIALIZED TRAITS (Custom Traits - Lower Priority)

### Reproductive Details (15 fields)
```
pollen_production_consistency, pollen_viability_in_heat, pollen_storage_ability,
pod_set_reliability, pod_set_in_heat, seed_count_per_pod, seed_viability_rate,
crosses_easily_on_dips, crosses_easily_on_tets, accepts_dip_pollen, 
accepts_tet_pollen, pod_color, pod_size, pod_maturation_period, seed_size
```

### Fragrance System (5 fields)
```
fragrance_present, fragrance_strength, fragrance_tone,
fragrance_time_of_day, fragrance_in_heat
```

### Growth Characteristics (10 fields)
```
fan_count, fan_multiplication_rate, fan_fragility,
summer_dormancy, transplant_recovery_speed, container_performance,
growth_rate, division_frequency_needed, years_to_reach_maturity,
first_year_performance
```

### Stress Responses (8 fields)
```
thrips_damage_visibility, sunburn_on_foliage, sunburn_on_petals,
cold_spring_recovery_speed, root_rot_resistance, wind_storm_breakage,
storm_petal_response, rain_petal_spotting
```

### Landscape/Garden Value (8 fields)
```
landscape_impact, mass_planting_suitability, garden_presence,
flower_clustering, bloom_orientation_consistency, scape_presentation,
foliage_winter_interest, mixed_border_performance
```

### Exhibition/Show (6 fields)
```
symmetry_score, sunproof_form, flaw_visibility,
show_stem_presentation, peak_bloom_timing_predictability, 
photo_performance_rating
```

### Commercial (5 fields)
```
market_appeal, customer_favorite, shipping_quality,
retail_presentation_value, price_point_category
```

### Cultural Requirements (6 fields)
```
water_requirements, fertilizer_response, soil_preference,
sunlight_tolerance, performs_best_in_zones, propagation_difficulty
```

### Breeding Utility (7 fields)
```
ease_of_use_as_parent, breeding_goal_categories,
passes_trait_reliably, dominant_traits, recessive_traits,
line_breeding_value, outcross_compatibility
```

**Total Specialized Traits (Lower Priority): 70 fields**

---

## TIER 4: CALCULATED/DERIVED FIELDS (Auto-generated)
**These are calculated by the system, not entered by user**

### From Pedigree Analysis (10 fields)
```
direct_children, total_descendants, in_degree_centrality,
out_degree_centrality, pagerank, katz_centrality, betweenness_centrality,
avg_generation_impact, descendant_success_rate, breeding_span
```

### From Bayesian Models (6 fields)
```
height_breeding_value, bloom_size_breeding_value,
branches_breeding_value, bud_count_breeding_value,
breeding_value_reliability, genetic_value_index
```

### From Genetic Analysis (3 fields)
```
inbreeding_coefficient, genetic_diversity_contribution, community_id
```

### Performance Aggregates (5 fields)
```
average_vigor_across_years, performance_consistency,
mature_clump_performance, data_completeness_score, observation_count
```

**Total Calculated Fields: 24 fields**

---

## IMPLEMENTATION ROADMAP

### Phase 1: MVP (Weeks 1-4)
- Tier 1: Core Fields (20)
- Basic observations structure
- Image management
- **Goal**: Functional inventory system

### Phase 2: Observations (Weeks 5-8)
- Tier 2: Standard Observations (50)
- Multiple observations per variety
- Year-over-year tracking
- **Goal**: Performance tracking system

### Phase 3: Advanced Morphology (Weeks 9-12)
- Tier 3A: High Priority Custom Traits (37)
- Custom trait definition system
- Teeth, pleating, eye detail tracking
- **Goal**: Detailed breeding evaluation

### Phase 4: Comprehensive System (Months 4-6)
- Tier 3B & 3C: All custom traits (106)
- Full color system
- Fragrance, growth, stress response tracking
- **Goal**: Professional breeding management

### Phase 5: Analytics Integration (Month 7+)
- Tier 4: Calculated fields (24)
- Breeding value predictions
- Pedigree analysis
- **Goal**: AI-powered breeding recommendations

---

## STORAGE STRATEGY BY TIER

### Tier 1 (Core)
**Storage**: Main `varieties` table columns
**Reason**: Always needed, rarely changes, high-performance queries

### Tier 2 (Observations)
**Storage**: `observations` table with variety_id foreign key
**Reason**: Multiple entries per year, time-series data

### Tier 3 (Advanced)
**Storage**: `custom_trait_values` table with flexible value columns
**Reason**: User-configurable, not all varieties need all traits

### Tier 4 (Calculated)
**Storage**: Columns in `varieties` table OR separate analytics tables
**Reason**: Periodically recalculated, read-only for users

---

## QUERY PATTERNS BY TIER

### Tier 1 Queries (Fast)
```sql
-- Get all available diploid varieties
SELECT * FROM varieties 
WHERE ploidy = 'Diploid' 
  AND availability_status = 'Available'
ORDER BY name;
```

### Tier 2 Queries (Moderate)
```sql
-- Get variety with all observations
SELECT v.*, o.* 
FROM varieties v
LEFT JOIN observations o ON o.variety_id = v.id
WHERE v.id = 'variety-uuid'
ORDER BY o.observation_date DESC;
```

### Tier 3 Queries (Complex)
```sql
-- Get all varieties with teeth, rated highly
SELECT v.name, v.hybridizer, v.year_introduced,
       t1.boolean_value as has_teeth,
       t2.select_value as teeth_size,
       o.breeding_potential_rating
FROM varieties v
INNER JOIN custom_trait_values t1 ON t1.variety_id = v.id 
  AND t1.trait_id = 'teeth_present_trait_id'
  AND t1.boolean_value = true
INNER JOIN custom_trait_values t2 ON t2.variety_id = v.id
  AND t2.trait_id = 'teeth_size_trait_id'
LEFT JOIN observations o ON o.variety_id = v.id
WHERE o.breeding_potential_rating >= 8
GROUP BY v.id
ORDER BY v.name;
```

### Tier 4 Queries (Analytics)
```sql
-- Get top breeding candidates by multiple criteria
SELECT v.name, v.hybridizer,
       v.height_breeding_value,
       v.bloom_size_breeding_value,
       v.breeding_value_reliability,
       v.pagerank,
       v.pollen_fertility
FROM varieties v
WHERE v.breeding_value_reliability > 0.8
  AND v.pollen_fertility IN ('high', 'very high')
  AND v.height_breeding_value > 0
  AND v.bloom_size_breeding_value > 0
ORDER BY (v.height_breeding_value + v.bloom_size_breeding_value) DESC
LIMIT 20;
```

---

## SUMMARY TABLE

| Tier | Field Count | Storage | Implementation Phase | Example Use Case |
|------|-------------|---------|---------------------|------------------|
| Tier 1 | 20 | Main table | MVP (Weeks 1-4) | Inventory listings |
| Tier 2 | 56 | Observations | Phase 2 (Weeks 5-8) | Yearly evaluations |
| Tier 3A | 37 | Custom traits | Phase 3 (Weeks 9-12) | Breeding selection |
| Tier 3B | 36 | Custom traits | Phase 4 (Months 4-6) | Detailed analysis |
| Tier 3C | 70 | Custom traits | Phase 4 (Months 4-6) | Comprehensive tracking |
| Tier 4 | 24 | Calculated | Phase 5 (Month 7+) | AI recommendations |
| **TOTAL** | **243** | **Mixed** | **7+ months** | **Full system** |

---

## CRITICAL IMPLEMENTATION NOTES

### 1. Start Simple
Don't try to implement all 277 fields at once. Start with Tier 1 (20 fields) and add tiers as needed.

### 2. Custom Traits Are Your Friend
Tiers 3A, 3B, and 3C (143 fields) should all use the same `custom_trait_values` table with a flexible schema. This lets you add new traits without database migrations.

### 3. Observations vs. Variety Table
If a trait can change year-to-year (size, vigor, color intensity), put it in observations. If it's inherent (hybridizer, ploidy), put it in main table.

### 4. Required vs. Optional
Only 7 fields should be truly required:
- variety_name (unique identifier)
- ploidy (critical for breeding)
- foliage_type (critical for hardiness)
- All others should be optional

### 5. Default Values
Provide sensible defaults:
- Ratings default to NULL (not measured yet)
- Booleans default to NULL (unknown)
- Counts default to NULL (not counted yet)
- Never default to 0 (that means "measured as zero")

This phased approach lets you start using the system immediately while building toward comprehensive breeding management capabilities.
