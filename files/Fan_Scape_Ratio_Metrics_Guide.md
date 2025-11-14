# Fan Count & Scape Production Metrics - Breeding Importance

## Overview

The fan-to-scape ratio is a critical breeding metric that measures a daylily's flowering performance relative to its clump size. These measurements help breeders identify varieties that are truly floriferous vs. those that simply have large clumps.

---

## Added Fields (6 total)

### Spring Baseline
**fan_count_spring** - Number of fans at the start of the growing season (before bloom)
- **When to measure:** Early spring as growth begins
- **Why important:** Baseline for calculating ratios and growth rates

### First Bloom Performance  
**scape_count_first_bloom** - Total scapes produced during initial bloom flush
- **When to measure:** Count all scapes during main bloom period
- **Why important:** Primary flowering performance metric

**fan_to_scape_ratio_first_bloom** - Scapes per fan during first bloom
- **Calculation:** scape_count_first_bloom ÷ fan_count_spring
- **Why important:** True measure of floriferousness
- **Good ratio:** > 1.0 (more scapes than fans)
- **Excellent ratio:** > 2.0 (double or more scapes than fans)

### Rebloom Performance (if applicable)
**scape_count_rebloom** - Scapes produced during rebloom period
- **When to measure:** Count all rebloom scapes separately
- **Why important:** Evaluates rebloom vigor, not just presence

**fan_to_scape_ratio_rebloom** - Scapes per fan during rebloom
- **Calculation:** scape_count_rebloom ÷ fan_count_spring
- **Why important:** Some varieties bloom heavily initially but poorly on rebloom
- **Good ratio:** > 0.5 (half as many rebloom scapes as initial fans)
- **Excellent ratio:** > 1.0 (equals or exceeds fan count)

### End of Season Growth
**fan_count_fall** - Number of fans at end of growing season
- **When to measure:** Late fall after bloom season complete
- **Why important:** Measures multiplication rate and vigor
- **Derived metric:** fan_increase = fall - spring

---

## Why These Metrics Matter for Breeding

### 1. True Floriferousness
A variety with 20 fans producing 15 scapes (ratio 0.75) is LESS floriferous than a variety with 5 fans producing 8 scapes (ratio 1.6), even though it has more total scapes.

**Example:**
- Variety A: 30 fans → 25 scapes = 0.83 ratio (underwhelming)
- Variety B: 8 fans → 12 scapes = 1.5 ratio (excellent)

### 2. Garden Performance Prediction
Varieties with high ratios will provide better garden display from smaller clumps, making them:
- Better for new gardens (fast impact)
- More valuable commercially (smaller divisions still impressive)
- More space-efficient in breeding programs

### 3. Multiplication vs. Blooming Trade-offs
Some varieties multiply rapidly (high fall fan count) but bloom poorly (low scape count). Others bloom heavily but don't increase fans quickly.

**Tracking both reveals:**
- **High bloom, high multiplication** = Superior garden performance
- **High bloom, low multiplication** = Good for breeding but slow to increase
- **Low bloom, high multiplication** = May have value for landscape but poor breeding choice
- **Low bloom, low multiplication** = Cull candidate

### 4. Rebloom Quality Assessment
Many varieties claim to "rebloom" but produce only 1-2 weak scapes later in season. The ratio helps quantify rebloom performance:

**Rebloom ratio thresholds:**
- < 0.2 = "Occasional rebloom" (not reliable)
- 0.2 - 0.5 = "Moderate rebloom" (produces some scapes)
- 0.5 - 1.0 = "Good rebloom" (substantial secondary bloom)
- > 1.0 = "Excellent rebloom" (nearly equals first bloom)

### 5. Breeding Value Estimates
When combined with other traits, these ratios help predict offspring performance:
- Parents with high ratios tend to produce floriferous offspring
- Ratios can be tracked across generations
- Bayesian models can incorporate ratio data for better breeding value predictions

---

## Measurement Best Practices

### Fan Counting Standards
**What counts as a fan:**
- A distinct rosette of leaves from a single growing point
- Multiple-fan divisions count each fan separately
- Small fans (< 3 leaves) may not bloom—count anyway for accuracy

**When to count:**
- **Spring:** When plants have fully emerged but before scaping begins
- **Fall:** After first hard frost or when growth has clearly stopped

### Scape Counting Standards
**What counts as a scape:**
- Any flowering stem that emerges, even if buds blast
- Count separately for first bloom vs. rebloom
- Don't count aborted scapes that never develop buds

**Timing:**
- Count when all scapes have emerged for that flush
- For rebloomers, wait until rebloom flush is complete

### Recording Protocol
```
Observation Date: 2025-05-15 (Spring Count)
- fan_count_spring: 12

Observation Date: 2025-07-01 (First Bloom Complete)
- scape_count_first_bloom: 18
- fan_to_scape_ratio_first_bloom: 1.5 (18÷12)

Observation Date: 2025-09-15 (Rebloom Complete)
- scape_count_rebloom: 6
- fan_to_scape_ratio_rebloom: 0.5 (6÷12)

Observation Date: 2025-10-30 (End of Season)
- fan_count_fall: 16
- fan_increase: 4 (16-12)
```

---

## Integration with Existing Metrics

### Combining with Bud Count
**Total bloom potential** = (scape_count × avg_bud_count) ÷ fan_count_spring

Example:
- 8 fans → 14 scapes × 25 buds = 350 total buds
- Bloom potential ratio: 350 ÷ 8 = 43.75 buds per fan

### Combining with Branching
**Display density** = (scape_count × branch_count) ÷ fan_count

Higher values indicate more flowers open simultaneously.

### Tracking Over Time
Year-over-year comparisons reveal:
- Maturation patterns (ratios typically increase with clump maturity)
- Stress responses (ratios drop in adverse years)
- Consistency (reliable varieties maintain ratios across years)

---

## Database Implementation

### Storage Location
These fields belong in the **observations** table (not main variety table) because they:
- Change year-to-year
- Depend on environmental conditions
- Require repeated measurements for meaningful analysis
- Are affected by plant maturity, weather, cultural practices

### SQL Schema Addition
```sql
ALTER TABLE observations ADD COLUMN IF NOT EXISTS 
  fan_count_spring INTEGER CHECK (fan_count_spring >= 0);

ALTER TABLE observations ADD COLUMN IF NOT EXISTS 
  fan_count_fall INTEGER CHECK (fan_count_fall >= 0);

ALTER TABLE observations ADD COLUMN IF NOT EXISTS 
  scape_count_first_bloom INTEGER CHECK (scape_count_first_bloom >= 0);

ALTER TABLE observations ADD COLUMN IF NOT EXISTS 
  fan_to_scape_ratio_first_bloom NUMERIC(5,2);

ALTER TABLE observations ADD COLUMN IF NOT EXISTS 
  scape_count_rebloom INTEGER;

ALTER TABLE observations ADD COLUMN IF NOT EXISTS 
  fan_to_scape_ratio_rebloom NUMERIC(5,2);

-- Trigger to auto-calculate ratios
CREATE OR REPLACE FUNCTION calculate_fan_scape_ratios()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.fan_count_spring > 0 THEN
    NEW.fan_to_scape_ratio_first_bloom := 
      NEW.scape_count_first_bloom::NUMERIC / NEW.fan_count_spring::NUMERIC;
    
    IF NEW.scape_count_rebloom IS NOT NULL THEN
      NEW.fan_to_scape_ratio_rebloom := 
        NEW.scape_count_rebloom::NUMERIC / NEW.fan_count_spring::NUMERIC;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER calc_fan_ratios 
BEFORE INSERT OR UPDATE ON observations
FOR EACH ROW EXECUTE FUNCTION calculate_fan_scape_ratios();
```

### UI Considerations
**Entry Form Layout:**
```
[ Spring Baseline Counts ]
Fan Count (Spring): [___]

[ First Bloom Performance ]
Scape Count (First Bloom): [___]
→ Ratio: 1.5 (auto-calculated)

[ Rebloom Performance ] (if applicable)
Scape Count (Rebloom): [___]
→ Ratio: 0.5 (auto-calculated)

[ End of Season ]
Fan Count (Fall): [___]
→ Fan Increase: +4 (auto-calculated)
```

---

## Analysis & Reporting

### Query Examples

**Find varieties with excellent scape production:**
```sql
SELECT v.name, v.hybridizer,
       AVG(o.fan_to_scape_ratio_first_bloom) as avg_ratio,
       AVG(o.fan_count_spring) as avg_fans,
       AVG(o.scape_count_first_bloom) as avg_scapes
FROM varieties v
JOIN observations o ON o.variety_id = v.id
WHERE o.fan_to_scape_ratio_first_bloom IS NOT NULL
GROUP BY v.id
HAVING AVG(o.fan_to_scape_ratio_first_bloom) > 1.5
ORDER BY avg_ratio DESC;
```

**Find best rebloomers:**
```sql
SELECT v.name,
       AVG(o.fan_to_scape_ratio_rebloom) as rebloom_ratio,
       COUNT(o.id) as years_observed
FROM varieties v
JOIN observations o ON o.variety_id = v.id
WHERE o.fan_to_scape_ratio_rebloom IS NOT NULL
GROUP BY v.id
HAVING AVG(o.fan_to_scape_ratio_rebloom) > 0.5
   AND COUNT(o.id) >= 3
ORDER BY rebloom_ratio DESC;
```

**Find fast multipliers with good bloom:**
```sql
SELECT v.name,
       AVG(o.fan_count_fall - o.fan_count_spring) as avg_fan_increase,
       AVG(o.fan_to_scape_ratio_first_bloom) as avg_bloom_ratio
FROM varieties v
JOIN observations o ON o.variety_id = v.id
WHERE o.fan_count_spring IS NOT NULL 
  AND o.fan_count_fall IS NOT NULL
GROUP BY v.id
HAVING AVG(o.fan_count_fall - o.fan_count_spring) > 5
   AND AVG(o.fan_to_scape_ratio_first_bloom) > 1.0
ORDER BY avg_bloom_ratio DESC;
```

---

## Breeding Program Applications

### Parent Selection
When choosing breeding parents, consider:
- **High ratio varieties** (>1.5) likely pass floriferousness to offspring
- **Consistent ratios** across years indicate genetic vs. environmental trait
- **Both parents with good ratios** increase likelihood of floriferous offspring

### Seedling Evaluation
Use ratios to make selection decisions:
- Track ratios from first bloom year
- Compare to parent ratios
- Cull seedlings with ratios < 0.8 unless exceptional in other traits

### Line Breeding
Track ratios across pedigrees:
- Identify lineages with consistently high ratios
- Use in cross predictions
- Include in breeding value calculations

---

## Summary

These 6 new fields provide quantitative measures of:
1. **Floriferousness** - true bloom performance independent of clump size
2. **Rebloom quality** - actual rebloom vigor, not just presence/absence  
3. **Multiplication rate** - how fast varieties increase
4. **Maturation patterns** - how performance changes over time
5. **Breeding value** - which varieties pass on prolific blooming

**Implementation priority:** HIGH for breeding programs focused on garden performance and commercial viability.

**Time investment:** ~10 minutes per variety per year for all measurements.

**Value:** Eliminates guesswork about which varieties are truly floriferous vs. just having large clumps.
