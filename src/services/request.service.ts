/**
 * Request Service
 * Business logic for request-related operations
 */

import { apiService } from './api.service';
import { RequestItem, Paginated, Insights } from '../types';

export class RequestService {
  private readonly endpoint = '/requests';

  /**
   * Fetch paginated list of requests with filters
   */
  async getRequests(
    page: number = 1,
    pageSize: number = 20,
    filters?: {
      status?: string;
      start?: string;
      end?: string;
      category_id?: string;
    }
  ): Promise<Paginated<RequestItem>> {
    const params: any = { page, page_size: pageSize };
    if (filters?.status && filters.status !== 'all') params.status = filters.status;
    if (filters?.start) params.start = filters.start;
    if (filters?.end) params.end = filters.end;
    if (filters?.category_id && filters.category_id !== 'all') params.category_id = filters.category_id;
    
    console.log('🔍 Fetching requests with params:', params);
    const result = await apiService.get<Paginated<RequestItem>>(this.endpoint + '/', { params });
    console.log('✅ Received requests:', result);
    
    return result;
  }

  /**
   * Fetch pending requests
   */
  async getPendingRequests(page: number = 1, pageSize: number = 20): Promise<Paginated<RequestItem>> {
    return this.getRequests(page, pageSize, { status: 'Pending' });
  }

  /**
   * Fetch single request by ID
   */
  async getRequestById(id: number): Promise<RequestItem> {
    return apiService.get<RequestItem>(`${this.endpoint}/${id}`);
  }

  /**
   * Update request status
   */
  async updateRequestStatus(
    id: number,
    status: string,
    comments: string,
    updatedBy: string = 'Admin'
  ): Promise<RequestItem> {
    // Ensure status is properly capitalized (e.g., "Approved", "Rejected", "Pending")
    const normalizedStatus = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
    return apiService.patch<RequestItem>(`${this.endpoint}/${id}/status`, {
      status: normalizedStatus,
      comments,
      updated_by: updatedBy,
    });
  }

  /**
   * Fetch insights/statistics
   */
  async getInsights(filters?: {
    start?: string;
    end?: string;
    duration?: string;
  }): Promise<Insights> {
    const params: any = {};
    if (filters?.start) params.start = filters.start;
    if (filters?.end) params.end = filters.end;
    if (filters?.duration) params.duration = filters.duration;

    return apiService.get<Insights>(`${this.endpoint}/insights/summary`, { params });
  }

  /**
   * Export requests as file
   */
  exportRequests(filters?: {
    start?: string;
    end?: string;
    category_id?: number;
    status?: string;
  }): void {
    const params: any = {};
    if (filters?.start) params.start = filters.start;
    if (filters?.end) params.end = filters.end;
    if (filters?.category_id) params.category_id = filters.category_id.toString();
    if (filters?.status && filters.status !== 'all') params.status = filters.status;

    const query = new URLSearchParams(params).toString();
    const baseURL = apiService.getBaseURL();
    window.location.href = `${baseURL}${this.endpoint}/export?${query}`;
  }

  /**
   * Get status color scheme
   */
  getStatusColor(status: string): { bg: string; color: string } {
    const statusColors: Record<string, { bg: string; color: string }> = {
      approved: { bg: '#e8f5e8', color: '#4caf50' },
      rejected: { bg: '#ffebee', color: '#f44336' },
      pending: { bg: '#fff3e0', color: '#ff9800' },
      default: { bg: '#f8f9fa', color: '#24114f' },
    };

    return statusColors[status.toLowerCase()] || statusColors.default;
  }

  /**
   * Validate request update data
   */
  validateStatusUpdate(data: {
    status?: string;
    comments?: string;
  }): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.status) {
      errors.push('Status is required');
    }

    const validStatuses = ['approved', 'rejected', 'pending'];
    if (data.status && !validStatuses.includes(data.status.toLowerCase())) {
      errors.push('Invalid status value');
    }

    if (!data.comments || data.comments.trim() === '') {
      errors.push('Comments are required');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

// Export singleton instance
export const requestService = new RequestService();
