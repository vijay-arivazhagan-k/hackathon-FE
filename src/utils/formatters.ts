/**
 * Formatters Utility
 * Functions for formatting data for display
 */

/**
 * Format currency amount
 */
export const formatCurrency = (amount: number | undefined): string => {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '₹0.00';
  }
  // Use Indian numbering/locale; if environment lacks 'en-IN', fallback to standard grouping
  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `₹${amount.toFixed(2)}`;
  }
};

/**
 * Format date to readable string
 */
export const formatDate = (date: string | undefined, format: 'short' | 'long' = 'short'): string => {
  if (!date) {
    return 'N/A';
  }

  const dateObj = new Date(date);
  
  if (format === 'long') {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(dateObj);
  }

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(dateObj);
};

/**
 * Format status text
 */
export const formatStatus = (status: string | undefined): string => {
  if (!status) {
    return 'Unknown';
  }

  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
};

/**
 * Truncate text to specified length
 */
export const truncateText = (text: string | undefined, maxLength: number = 50): string => {
  if (!text) {
    return '';
  }

  if (text.length <= maxLength) {
    return text;
  }

  return text.substring(0, maxLength) + '...';
};

/**
 * Format file size
 */
export const formatFileSize = (bytes: number | undefined): string => {
  if (bytes === undefined || bytes === null || bytes === 0) {
    return '0 Bytes';
  }

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Format number with thousand separators
 */
export const formatNumber = (num: number | undefined): string => {
  if (num === undefined || num === null) {
    return '0';
  }

  return new Intl.NumberFormat('en-US').format(num);
};
