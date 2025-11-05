/**
 * Constants
 * Application-wide constants and configuration
 */

/**
 * API Configuration
 */
export const API_CONFIG = {
  BASE_URL: 'http://127.0.0.1:8000/api', // Try 8000 first, then fallback to 8001
  TIMEOUT: 30000,
  VERSION: 'v1',
} as const;

/**
 * Pagination Configuration
 */
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 20,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
} as const;

/**
 * Status Values
 */
export const STATUS = {
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  PENDING: 'Pending',
  ALL: 'All',
} as const;

/**
 * Status Colors
 */
export const STATUS_COLORS = {
  Approved: {
    bg: '#e8f5e8',
    color: '#4caf50',
    text: 'Approved',
  },
  Rejected: {
    bg: '#ffebee',
    color: '#f44336',
    text: 'Rejected',
  },
  Pending: {
    bg: '#fff3e0',
    color: '#ff9800',
    text: 'Pending',
  },
  // Keep lowercase for backward compatibility
  approved: {
    bg: '#e8f5e8',
    color: '#4caf50',
    text: 'Approved',
  },
  rejected: {
    bg: '#ffebee',
    color: '#f44336',
    text: 'Rejected',
  },
  pending: {
    bg: '#fff3e0',
    color: '#ff9800',
    text: 'Pending',
  },
  default: {
    bg: '#f8f9fa',
    color: '#24114f',
    text: 'Unknown',
  },
} as const;

/**
 * Duration Options
 */
export const DURATION_OPTIONS = [
  { value: 'today', label: 'Today' },
  { value: 'this week', label: 'This Week' },
  { value: 'last week', label: 'Last Week' },
  { value: 'this month', label: 'This Month' },
  { value: 'last month', label: 'Last Month' },
] as const;

/**
 * Theme Colors
 */
export const THEME_COLORS = {
  primary: '#24114f',
  secondary: '#4a2a7a',
  background: '#f8f9fa',
  white: '#ffffff',
  success: '#4caf50',
  error: '#f44336',
  warning: '#ff9800',
  info: '#2196f3',
} as const;

/**
 * File Upload Configuration
 */
export const FILE_UPLOAD = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: [
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],
  ALLOWED_EXTENSIONS: ['.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx'],
} as const;

/**
 * Routes
 */
export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/',
  REPORT: '/report',
  PENDING: '/pending',
  CATEGORIES: '/categories',
  CATEGORY_ADD: '/categories/add',
  CATEGORY_VIEW: '/categories/:id',
  CATEGORY_EDIT: '/categories/:id/edit',
  REQUEST_DETAIL: '/requests/:id',
} as const;

/**
 * Local Storage Keys
 */
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_PREFERENCES: 'user_preferences',
  THEME: 'theme',
} as const;

/**
 * Error Messages
 */
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  NOT_FOUND: 'Resource not found.',
  UNAUTHORIZED: 'Unauthorized access. Please login.',
  FORBIDDEN: 'Access forbidden.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  UNKNOWN_ERROR: 'An unexpected error occurred.',
} as const;

/**
 * Success Messages
 */
export const SUCCESS_MESSAGES = {
  CATEGORY_CREATED: 'Category created successfully',
  CATEGORY_UPDATED: 'Category updated successfully',
  REQUEST_UPDATED: 'Request updated successfully',
  DATA_LOADED: 'Data loaded successfully',
  EXPORT_STARTED: 'Export started successfully',
} as const;
