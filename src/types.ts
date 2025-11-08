export interface Category {
  ID: number;
  CategoryName: string;
  CategoryDescription?: string;
  MaximumAmount?: number;
  Status: boolean;
  // RequestCount removed from UI
  ApprovalCriteria?: string;
  CreatedOn?: string;
  CreatedBy?: string;
  UpdatedOn?: string;
  UpdatedBy?: string;
}

export interface CategoryHistory {
  ID: number;
  CATEGORY_ID: number;
  CategoryName?: string;
  CategoryDescription?: string;
  MaximumAmount?: number;
  Status?: boolean;
  ApprovalCriteria?: string;
  Comments: string;
  CreatedOn: string;
  CreatedBy?: string;
}


export interface RequestItem {
  id: number;
  user_id: string;
  total_amount?: number;
  approved_amount?: number;
  invoice_date?: string;
  invoice_number?: string;
  category_name?: string;
  current_status: string;
  comments?: string;
  approvaltype: string;
  created_on: string;
  updated_on: string;
  created_by: string;
  updated_by: string;
}
 
export interface Paginated<T> {
  items: T[];
  page: number;
  page_size: number;
  total: number;
}
export interface Insights {
  total: number;
  approved: number;
  rejected: number;
  pending: number;
}
export interface CategoryCreate {
  CategoryName: string;
  CategoryDescription?: string;
  MaximumAmount?: number;
  Status?: boolean;
  ApprovalCriteria: string; // required
}
