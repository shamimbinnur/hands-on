export interface PaginationOptions {
  page?: number;
  limit?: number;
}

export interface PaginationMetadata {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedResponse<T> {
  helpRequests: T[];
  pagination: PaginationMetadata;
}

// Existing types (for reference)
export interface HelpRequestsFilter {
  urgencyLevel?: string;
  status?: string;
}

export interface HelpRequest {
  id: string;
  title: string;
  description: string;
  urgencyLevel: string;
  status: string;
  requestorId: string;
  createdAt: string;
  updatedAt: string;
  requestor: {
    id: string;
    name: string;
    profileImage: string;
  };
  helpers: {
    id: string;
    name: string;
    profileImage: string;
  }[];
  helperCount: number;
}

export interface CreateHelpRequestData {
  title: string;
  description: string;
  urgencyLevel: string;
}

export interface UpdateHelpRequestData {
  title?: string;
  description?: string;
  urgencyLevel?: string;
  status?: string;
}
