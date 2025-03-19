import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  AlertCircle,
  Filter,
  Clock,
  Users,
  ChevronRight,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { fetchHelpRequests } from "../../services/api/help/helpService";
import {
  HelpRequest,
  PaginationOptions,
  HelpRequestsFilter,
} from "../../services/api/help/types";
import CreateHelpRequestModal from "../../components/help/helpReqModal";
import Avatar from "../../components/common/Avatar";

const HelpRequestsPage: React.FC = () => {
  // State for help requests and loading status
  const [helpRequests, setHelpRequests] = useState<HelpRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  // State for modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Pagination and filter state
  const [pagination, setPagination] = useState<PaginationOptions>({
    page: 1,
    limit: 10,
  });
  const [filters, setFilters] = useState<HelpRequestsFilter>({});

  // Reference to the observer for infinite scrolling
  const observer = useRef<IntersectionObserver | null>(null);
  const lastHelpRequestRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPagination((prev) => ({ ...prev, page: (prev.page || 1) + 1 }));
        }
      });

      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore]
  );

  // Load help requests
  const loadHelpRequests = async (resetList = false) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetchHelpRequests(pagination, filters);

      if (resetList) {
        setHelpRequests(response.helpRequests);
      } else {
        setHelpRequests((prev) => [...prev, ...response.helpRequests]);
      }

      setHasMore(response.pagination.hasNext);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load help requests"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Effect to load help requests when pagination or filters change
  useEffect(() => {
    loadHelpRequests(pagination.page === 1);
  }, [pagination.page, filters]);

  // Handler for filter changes
  const handleFilterChange = (newFilters: HelpRequestsFilter) => {
    setFilters(newFilters);
    setPagination({ page: 1, limit: pagination.limit });
  };

  // Refresh handler
  const handleRefresh = () => {
    setPagination({ page: 1, limit: pagination.limit });
  };

  // Urgency level badge component
  const UrgencyBadge: React.FC<{ level: string }> = ({ level }) => {
    const urgencyMap: Record<string, { color: string; label: string }> = {
      high: {
        color: "bg-red-100 text-red-800 border-red-200",
        label: "High Urgency",
      },
      medium: {
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        label: "Medium Urgency",
      },
      low: {
        color: "bg-green-100 text-green-800 border-green-200",
        label: "Low Urgency",
      },
    };

    const config = urgencyMap[level.toLowerCase()] || {
      color: "bg-gray-100 text-gray-800 border-gray-200",
      label: level,
    };

    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full ${config.color} border`}
        aria-label={config.label}
      >
        {level}
      </span>
    );
  };

  // Status badge component
  const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
    const statusMap: Record<string, { color: string; label: string }> = {
      open: {
        color: "bg-blue-100 text-blue-800 border-blue-200",
        label: "Open Status",
      },
      "in-progress": {
        color: "bg-purple-100 text-purple-800 border-purple-200",
        label: "In Progress Status",
      },
      completed: {
        color: "bg-green-100 text-green-800 border-green-200",
        label: "Completed Status",
      },
      cancelled: {
        color: "bg-gray-100 text-gray-800 border-gray-200",
        label: "Cancelled Status",
      },
    };

    const config = statusMap[status.toLowerCase()] || {
      color: "bg-gray-100 text-gray-800 border-gray-200",
      label: status,
    };

    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full ${config.color} border`}
        aria-label={config.label}
      >
        {status}
      </span>
    );
  };

  // Format date helper
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Help Requests</h1>
        <CreateHelpRequestModal
          onClose={() => setIsModalOpen(false)}
          isOpen={isModalOpen}
          onSuccess={() => loadHelpRequests(true)}
        />

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
          <button
            className="px-5 py-2 text-white bg-blue-600 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
            onClick={() => setIsModalOpen(true)}
          >
            Create
          </button>

          {/* Filter controls */}
          <div className="flex items-center gap-2 bg-white p-1 rounded-lg shadow-sm border w-full sm:w-auto">
            <Filter size={16} className="text-gray-500 ml-2" />

            <select
              className="px-3 py-2 border-0 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent text-sm"
              value={filters.status || ""}
              onChange={(e) =>
                handleFilterChange({
                  ...filters,
                  status: e.target.value || undefined,
                })
              }
              aria-label="Filter by status"
            >
              <option value="">All Statuses</option>
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <select
              className="px-3 py-2 border-0 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent text-sm"
              value={filters.urgencyLevel || ""}
              onChange={(e) =>
                handleFilterChange({
                  ...filters,
                  urgencyLevel: e.target.value || undefined,
                })
              }
              aria-label="Filter by urgency level"
            >
              <option value="">All Urgency Levels</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-lg shadow-sm border hover:bg-blue-50 transition-colors duration-200"
            aria-label="Refresh help requests list"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <RefreshCw size={16} />
            )}
            <span className="text-sm font-medium">Refresh</span>
          </button>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div
          className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-3"
          role="alert"
        >
          <AlertCircle size={20} />
          <p>{error}</p>
        </div>
      )}

      {/* Help requests list */}
      <div className="grid grid-cols-1 gap-4">
        {helpRequests.length === 0 && !isLoading ? (
          <div className="p-8 text-center bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-gray-500">
              No help requests found matching your criteria
            </p>
            <button
              onClick={handleRefresh}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          helpRequests.map((request, index) => (
            <div
              key={request.id}
              ref={
                index === helpRequests.length - 1 ? lastHelpRequestRef : null
              }
              className="p-5 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-3">
                <h2 className="text-lg font-medium text-gray-800">
                  {request.title}
                </h2>
                <div className="flex flex-wrap gap-2">
                  <UrgencyBadge level={request.urgencyLevel} />
                  <StatusBadge status={request.status} />
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {request.description}
              </p>

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mt-4 pt-3 border-t border-gray-100">
                <div className="flex items-center gap-4">
                  <Avatar name={request.requestor.name} randomColor />
                  <span className="text-md font-medium text-gray-700">
                    {request.requestor.name}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    <span>{formatDate(request.createdAt)}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Users size={14} />
                    <span>
                      {request.helperCount} helper
                      {request.helperCount !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 text-right">
                <a
                  href={`/help-requests/${request.id}`}
                  className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium group"
                  aria-label={`View details for request: ${request.title}`}
                >
                  <span>View Details</span>
                  <ChevronRight
                    size={16}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </a>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Loading indicator */}
      {isLoading && (
        <div className="flex justify-center my-6">
          <div className="loader" aria-label="Loading">
            <Loader2 size={36} className="text-blue-500 animate-spin" />
          </div>
        </div>
      )}

      {/* End of results message */}
      {!hasMore && helpRequests.length > 0 && (
        <div className="text-center mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-500">You've reached the end of the list</p>
        </div>
      )}
    </div>
  );
};

export default HelpRequestsPage;
