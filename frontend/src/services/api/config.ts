/**
 * Base URL the real backend will live at, once it exists. Not referenced by
 * any request yet — every services/api/* function is still backed by the
 * mock layer in services/mock/. This just establishes where that switch-over
 * will read its configuration from.
 */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''
