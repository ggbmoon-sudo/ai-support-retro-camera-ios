export const KNOWN_FILTER_IDS = Object.freeze([
  "original",
  "soft_warm_400",
  "summer_gold_200",
  "street_chrome",
  "soft_sun_portrait",
  "cinema_flat",
  "silver_gradation",
  "everyday_color_400",
  "amber_night_800",
  "vivid_landscape_100",
  "slide_pop",
  "memory_negative",
  "amber_nostalgia",
  "tri_grit_400",
  "neon_tungsten_800",
  "instant_dream",
  "metro_pop",
  "diana_soft",
  "flash_party",
  "ccd_party_2008",
  "editor_classic",
  "classic-film",
  "warm-vintage",
  "faded-chrome"
]);

export const knownFilterIdSet = new Set(KNOWN_FILTER_IDS);

export function isKnownFilterId(filterId) {
  return typeof filterId === "string" && knownFilterIdSet.has(filterId);
}
