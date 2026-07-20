// src/config/env.js
//
// Placeholder for future backend wiring. Nothing reads this yet - the app
// runs entirely on src/data/mockData.js's api facade. When a real backend
// exists, its base URL goes here (fed by an env var so it isn't hardcoded
// per environment), and mockData.js's api.* function bodies become fetch()
// calls against it - no screen code should need to change.

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || '';
