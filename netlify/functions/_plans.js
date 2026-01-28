import { ROLE_IDS, PLAN_FEATURES, PLAN_ORDER } from "./_config.js";

export function computePlanFromRoles(roles = []) {
  const has = (id) => roles.includes(id);
  if (has(ROLE_IDS.owner)) return "owner";
  if (has(ROLE_IDS.enterprise_community)) return "enterprise_community";
  if (has(ROLE_IDS.creator)) return "creator";
  if (has(ROLE_IDS.elite)) return "elite";
  if (has(ROLE_IDS.pro)) return "pro";
  if (has(ROLE_IDS.starter)) return "starter";
  if (has(ROLE_IDS.free)) return "free";
  return "guest";
}

export function getFeatures(plan) {
  return PLAN_FEATURES[plan] || PLAN_FEATURES.guest;
}

export function comparePlans(a, b) {
  return PLAN_ORDER.indexOf(a) - PLAN_ORDER.indexOf(b);
}
