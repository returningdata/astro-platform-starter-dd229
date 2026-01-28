export const ROLE_IDS = {
  "owner": "1465907327004840161",
  "enterprise_community": "1465908896865456250",
  "creator": "1465908882885967933",
  "elite": "1465908932512977059",
  "pro": "1465908935402717184",
  "starter": "1465908938703638569",
  "free": "1465909115761983658"
};

export const PLAN_ORDER = [
  "guest",
  "free",
  "starter",
  "pro",
  "elite",
  "creator",
  "enterprise_community",
  "owner"
];

export const PLAN_FEATURES = {
  guest: { chat: true, images: false, files: false, studio: false, exports: false, priority: false, admin: false },
  free:  { chat: true, images: false, files: false, studio: false, exports: false, priority: false, admin: false },
  starter: { chat: true, images: true, files: false, studio: false, exports: false, priority: false, admin: false },
  pro: { chat: true, images: true, files: true, studio: true, exports: true, priority: true, admin: false },
  elite: { chat: true, images: true, files: true, studio: true, exports: true, priority: true, admin: false },
  creator: { chat: true, images: true, files: true, studio: true, exports: true, priority: true, admin: false },
  enterprise_community: { chat: true, images: true, files: true, studio: true, exports: true, priority: true, admin: false },
  owner: { chat: true, images: true, files: true, studio: true, exports: true, priority: true, admin: true }
};
