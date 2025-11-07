/**
 * useRequests Hook
 * Custom hook for request data management
 */

import { useState, useEffect, useCallback } from 'react';
import { requestService } from '../services';
import { RequestItem, Paginated, Insights } from '../types';

interface UseRequestsResult {
  requests: RequestItem[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    pageSize: number;
    total: number;
  };
  loadRequests: (
    page?: number,
    pageSize?: number,
    filters?: {
      duration?: string;
      status?: string;
      start?: string;
      end?: string;
      category_id?: string;
    }
  ) => Promise<void>;
  refreshRequests: () => Promise<void>;
}

export const useRequests = (
  initialPage: number = 1,
  initialPageSize: number = 20,
  initialFilters?: {
    status?: string;
    start?: string;
    end?: string;
    category_id?: string;
  }
): UseRequestsResult => {
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState(initialFilters || {});
  const [pagination, setPagination] = useState({
    page: initialPage,
    pageSize: initialPageSize,
    total: 0,
  });

  const loadRequests = useCallback(
    async (
      page?: number,
      pageSize?: number,
      newFilters?: {
        status?: string;
        start?: string;
        end?: string;
        category_id?: string;
      }
    ) => {
      try {
        setLoading(true);
        setError(null);

        const currentPage = page ?? pagination.page;
        const currentPageSize = pageSize ?? pagination.pageSize;
        const currentFilters = newFilters ?? filters;

        if (newFilters) {
          setFilters(newFilters);
        }

        const result: Paginated<RequestItem> = await requestService.getRequests(
          currentPage,
          currentPageSize,
          currentFilters
        );

        setRequests(result.items);
        setPagination({
          page: result.page,
          pageSize: result.page_size,
          total: result.total,
        });
      } catch (err: any) {
        setError(err?.message || 'Failed to load requests');
        console.error('Error loading requests:', err);
      } finally {
        setLoading(false);
      }
    },
    [pagination.page, pagination.pageSize, filters]
  );

  const refreshRequests = useCallback(async () => {
    await loadRequests(pagination.page, pagination.pageSize, filters);
  }, [loadRequests, pagination.page, pagination.pageSize, filters]);

  useEffect(() => {
    loadRequests(initialPage, initialPageSize, initialFilters);
  }, []);

  return {
    requests,
    loading,
    error,
    pagination,
    loadRequests,
    refreshRequests,
  };
};

interface UseRequestResult {
  request: RequestItem | null;
  loading: boolean;
  error: string | null;
  loadRequest: (id: number) => Promise<void>;
  refreshRequest: () => Promise<void>;
}

export const useRequest = (id?: number): UseRequestResult => {
  const [request, setRequest] = useState<RequestItem | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadRequest = useCallback(async (requestId: number) => {
    try {
      setLoading(true);
      setError(null);

      const result = await requestService.getRequestById(requestId);
      setRequest(result);
    } catch (err: any) {
      setError(err?.message || 'Failed to load request');
      console.error('Error loading request:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshRequest = useCallback(async () => {
    if (request?.id) {
      await loadRequest(request.id);
    }
  }, [request?.id, loadRequest]);

  useEffect(() => {
    if (id) {
      loadRequest(id);
    }
  }, [id]);

  return {
    request,
    loading,
    error,
    loadRequest,
    refreshRequest,
  };
};

interface UseInsightsResult {
  insights: Insights | null;
  loading: boolean;
  error: string | null;
  loadInsights: (filters?: {
    start?: string;
    end?: string;
    duration?: string;
  }) => Promise<void>;
  refreshInsights: () => Promise<void>;
}

export const useInsights = (initialFilters?: {
  start?: string;
  end?: string;
  duration?: string;
}): UseInsightsResult => {
  const [insights, setInsights] = useState<Insights | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState(initialFilters || {});

  const loadInsights = useCallback(async (newFilters?: {
    start?: string;
    end?: string;
    duration?: string;
  }) => {
    try {
      setLoading(true);
      setError(null);

      const currentFilters = newFilters ?? filters;
      if (newFilters) {
        setFilters(newFilters);
      }

      const result = await requestService.getInsights(currentFilters);
      setInsights(result);
    } catch (err: any) {
      setError(err?.message || 'Failed to load insights');
      console.error('Error loading insights:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const refreshInsights = useCallback(async () => {
    await loadInsights(filters);
  }, [loadInsights, filters]);

  useEffect(() => {
    loadInsights(initialFilters);
  }, []);

  return {
    insights,
    loading,
    error,
    loadInsights,
    refreshInsights,
  };
};
