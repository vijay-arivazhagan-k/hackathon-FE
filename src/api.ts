import axios from 'axios';
import { Paginated, RequestItem, Category, Insights } from './types';

const client = axios.create({
  baseURL: 'http://127.0.0.1:8001/api',
});

export async function fetchRequests(page: number, pageSize: number, duration?: string, status?: string): Promise<Paginated<RequestItem>> {
  const params: any = { page, page_size: pageSize };
  if (duration) params.duration = duration;
  if (status) params.status = status;
  const { data } = await client.get('/requests/', { params });
  return data;
}

export async function fetchPending(page: number, pageSize: number): Promise<Paginated<RequestItem>> {
  // Use the same endpoint with status filter
  const { data } = await client.get('/requests/', { 
    params: { page, page_size: pageSize, status: 'pending' } 
  });
  return data;
}

export async function fetchCategories(page: number, pageSize: number): Promise<Paginated<Category>> {
  const { data } = await client.get('/categories/', { params: { page, page_size: pageSize } });
  return data;
}

export async function fetchRequest(id: number): Promise<RequestItem> {
  const { data } = await client.get(`/requests/${id}`);
  return data;
}

export async function updateRequestStatus(
  id: number, 
  status: string, 
  comments: string, 
  approvedAmount?: number
): Promise<RequestItem> {
  const payload: any = { 
    status: status.charAt(0).toUpperCase() + status.slice(1).toLowerCase(), 
    comments, 
    updated_by: 'ADMIN' 
  };
  
  if (approvedAmount !== undefined) {
    payload.approved_amount = approvedAmount;
  }
  
  const { data } = await client.patch(`/requests/${id}/status`, payload);
  return data;
}

export async function fetchInsights(duration?: string): Promise<Insights> {
  const params: any = {};
  if (duration) params.duration = duration;
  const { data } = await client.get('/requests/insights/summary', { params });
  return data;
}



export async function fetchCategory(id: number): Promise<Category> {
  const { data } = await client.get(`/categories/${id}`);
  return data;
}

export async function fetchCategoryHistory(id: number): Promise<any[]> {
  const { data } = await client.get(`/categories/${id}/history`);
  return data;
}

export async function updateCategory(id: number, payload: Partial<Category>): Promise<Category> {
  const { data } = await client.patch(`/categories/${id}`, payload);
  return data;
}

export async function fetchReports(params: { start?: string; end?: string; category_id?: number; status?: string; page: number; page_size: number }): Promise<Paginated<RequestItem>> {
  // Reports use the requests endpoint with additional filters
  const { data } = await client.get('/requests/', { params });
  return data;
}

export function exportReports(params: { start?: string; end?: string; category_id?: number; status?: string }) {
  const query = new URLSearchParams(params as any).toString();
  // Note: Export functionality needs to be implemented in the backend
  window.location.href = `http://127.0.0.1:8001/api/requests/export?${query}`;
}

// Category creation with file upload
export async function createCategory(formData: FormData): Promise<Category> {
  const { data } = await client.post('/categories/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

// Category update with file upload
export async function updateCategoryWithFile(id: number, formData: FormData): Promise<Category> {
  const { data } = await client.patch(`/categories/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}
