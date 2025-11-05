/**
 * useCategories Hook
 * Custom hook for category data management
 */

import { useState, useEffect, useCallback } from 'react';
import { categoryService } from '../services';
import { Category, CategoryHistory, Paginated } from '../types';

interface UseCategoriesResult {
  categories: Category[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    pageSize: number;
    total: number;
  };
  loadCategories: (page?: number, pageSize?: number) => Promise<void>;
  refreshCategories: () => Promise<void>;
}

export const useCategories = (initialPage: number = 1, initialPageSize: number = 10): UseCategoriesResult => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: initialPage,
    pageSize: initialPageSize,
    total: 0,
  });

  const loadCategories = useCallback(async (page?: number, pageSize?: number) => {
    try {
      setLoading(true);
      setError(null);

      const currentPage = page ?? pagination.page;
      const currentPageSize = pageSize ?? pagination.pageSize;

      const result: Paginated<Category> = await categoryService.getCategories(currentPage, currentPageSize);

      setCategories(result.items);
      setPagination({
        page: result.page,
        pageSize: result.page_size,
        total: result.total,
      });
    } catch (err: any) {
      setError(err?.message || 'Failed to load categories');
      console.error('Error loading categories:', err);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.pageSize]);

  const refreshCategories = useCallback(async () => {
    await loadCategories(pagination.page, pagination.pageSize);
  }, [loadCategories, pagination.page, pagination.pageSize]);

  useEffect(() => {
    loadCategories();
  }, []);

  return {
    categories,
    loading,
    error,
    pagination,
    loadCategories,
    refreshCategories,
  };
};

interface UseCategoryResult {
  category: Category | null;
  history: CategoryHistory[];
  loading: boolean;
  error: string | null;
  loadCategory: (id: number) => Promise<void>;
  loadHistory: (id: number) => Promise<void>;
  refreshCategory: () => Promise<void>;
}

export const useCategory = (id?: number): UseCategoryResult => {
  const [category, setCategory] = useState<Category | null>(null);
  const [history, setHistory] = useState<CategoryHistory[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadCategory = useCallback(async (categoryId: number) => {
    try {
      setLoading(true);
      setError(null);

      const result = await categoryService.getCategoryById(categoryId);
      setCategory(result);
    } catch (err: any) {
      setError(err?.message || 'Failed to load category');
      console.error('Error loading category:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadHistory = useCallback(async (categoryId: number) => {
    try {
      const result = await categoryService.getCategoryHistory(categoryId);
      setHistory(result);
    } catch (err: any) {
      console.error('Error loading category history:', err);
    }
  }, []);

  const refreshCategory = useCallback(async () => {
    if (category?.ID) {
      await loadCategory(category.ID);
      await loadHistory(category.ID);
    }
  }, [category?.ID, loadCategory, loadHistory]);

  useEffect(() => {
    if (id) {
      loadCategory(id);
      loadHistory(id);
    }
  }, [id]);

  return {
    category,
    history,
    loading,
    error,
    loadCategory,
    loadHistory,
    refreshCategory,
  };
};
