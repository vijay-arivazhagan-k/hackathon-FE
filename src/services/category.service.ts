/**
 * Category Service
 * Business logic for category-related operations
 */

import { apiService } from './api.service';
import { Category, CategoryHistory, Paginated } from '../types';

export class CategoryService {
  private readonly endpoint = '/categories';

  /**
   * Fetch paginated list of categories
   */
  async getCategories(page: number = 1, pageSize: number = 10): Promise<Paginated<Category>> {
    return apiService.get<Paginated<Category>>(this.endpoint, {
      params: { page, page_size: pageSize },
    });
  }

  /**
   * Fetch single category by ID
   */
  async getCategoryById(id: number): Promise<Category> {
    return apiService.get<Category>(`${this.endpoint}/${id}`);
  }

  /**
   * Fetch category history
   */
  async getCategoryHistory(id: number): Promise<CategoryHistory[]> {
    return apiService.get<CategoryHistory[]>(`${this.endpoint}/${id}/history`);
  }

  /**
   * Create new category
   */
  async createCategory(data: {
    CategoryName: string;
    CategoryDescription?: string;
    MaximumAmount?: number;
    Status?: boolean;
    RequestCount?: number;
    ApprovalCriteria?: string;
  }): Promise<Category> {
    const formData = new FormData();
    formData.append('CategoryName', data.CategoryName);
    
    if (data.CategoryDescription) {
      formData.append('CategoryDescription', data.CategoryDescription);
    }
    if (data.MaximumAmount !== undefined) {
      formData.append('MaximumAmount', data.MaximumAmount.toString());
    }
    if (data.Status !== undefined) {
      formData.append('Status', data.Status.toString());
    }
    if (data.RequestCount !== undefined) {
      formData.append('RequestCount', data.RequestCount.toString());
    }
    if (data.ApprovalCriteria) {
      formData.append('ApprovalCriteria', data.ApprovalCriteria);
    }

    return apiService.uploadFile<Category>(this.endpoint + '/', formData);
  }

  /**
   * Update category
   */
  async updateCategory(
    id: number,
    data: Partial<Category> & { Comments?: string }
  ): Promise<Category> {
    const formData = new FormData();

    if (data.CategoryName) {
      formData.append('CategoryName', data.CategoryName);
    }
    if (data.CategoryDescription !== undefined) {
      formData.append('CategoryDescription', data.CategoryDescription);
    }
    if (data.MaximumAmount !== undefined) {
      formData.append('MaximumAmount', data.MaximumAmount.toString());
    }
    if (data.Status !== undefined) {
      formData.append('Status', data.Status.toString());
    }
    if (data.RequestCount !== undefined) {
      formData.append('RequestCount', data.RequestCount.toString());
    }
    if (data.ApprovalCriteria !== undefined) {
      formData.append('ApprovalCriteria', data.ApprovalCriteria);
    }
    if (data.Comments) {
      formData.append('Comments', data.Comments);
    }

    return apiService.uploadFile<Category>(`${this.endpoint}/${id}`, formData);
  }

  /**
   * Validate category data before submission
   */
  validateCategoryData(data: {
    CategoryName?: string;
    MaximumAmount?: number;
  }): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.CategoryName || data.CategoryName.trim() === '') {
      errors.push('Category name is required');
    }

    if (data.MaximumAmount !== undefined && data.MaximumAmount < 0) {
      errors.push('Maximum amount must be a positive number');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

// Export singleton instance
export const categoryService = new CategoryService();
