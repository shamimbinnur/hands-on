import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import {
  AlertCircle,
  ArrowLeft,
  Clock,
  Calendar,
  Users,
  MessageCircle,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Loader2,
  Mail,
  MapPin,
  HandHelping,
} from "lucide-react";
import { fetchHelpRequestById } from "../../services/api/help/helpService";
import { useAuthStore } from "../../store";
import DeleteHelpReqButton from "../../components/helpDetails/DeleteHelpReq";
import Avatar from "../../components/common/Avatar";
import { HelpRequest } from "../../services/api/help/types";
import OfferHelpModal from "../../components/EventDetails/OfferHelp";

const HelpRequestDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { user } = useAuthStore();

  const [helpRequest, setHelpRequest] = useState<HelpRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    "details" | "activity" | "helpers"
  >("details");

  // Modal state
  const [isOfferHelpModalOpen, setIsOfferHelpModalOpen] = useState(false);

  useEffect(() => {
    const loadHelpRequest = async () => {
      if (!id) return;

      setIsLoading(true);
      setError(null);

      try {
        const data = await fetchHelpRequestById(id);
        setHelpRequest(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load help request"
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadHelpRequest();
  }, [id]);

  // Helper functions
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const getStatusColor = (status: string): string => {
    const statusMap: Record<string, string> = {
      open: "bg-blue-100 text-blue-800 border-blue-200",
      "in-progress": "bg-purple-100 text-purple-800 border-purple-200",
      completed: "bg-green-100 text-green-800 border-green-200",
      cancelled: "bg-gray-100 text-gray-800 border-gray-200",
    };

    return (
      statusMap[status.toLowerCase()] ||
      "bg-gray-100 text-gray-800 border-gray-200"
    );
  };

  const getUrgencyColor = (level: string): string => {
    const urgencyMap: Record<string, string> = {
      high: "bg-red-100 text-red-800 border-red-200",
      medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
      low: "bg-green-100 text-green-800 border-green-200",
    };

    return (
      urgencyMap[level.toLowerCase()] ||
      "bg-gray-100 text-gray-800 border-gray-200"
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "open":
        return <AlertCircle size={18} className="text-blue-600" />;
      case "in-progress":
        return <Clock size={18} className="text-purple-600" />;
      case "completed":
        return <CheckCircle size={18} className="text-green-600" />;
      case "cancelled":
        return <XCircle size={18} className="text-gray-600" />;
      default:
        return <AlertCircle size={18} className="text-gray-600" />;
    }
  };

  const getUrgencyIcon = (level: string) => {
    switch (level.toLowerCase()) {
      case "high":
        return <AlertTriangle size={18} className="text-red-600" />;
      case "medium":
        return <AlertTriangle size={18} className="text-yellow-600" />;
      case "low":
        return <AlertTriangle size={18} className="text-green-600" />;
      default:
        return <AlertTriangle size={18} className="text-gray-600" />;
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center">
        <Loader2 size={48} className="text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Loading help request details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-blue-600 mb-6"
        >
          <ArrowLeft size={18} />
          <span>Back to Help Requests</span>
        </button>

        <div className="p-6 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle size={24} className="text-red-600 mt-0.5" />
          <div>
            <h2 className="text-lg font-medium text-red-700 mb-2">
              Error Loading Help Request
            </h2>
            <p className="text-red-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!helpRequest) {
    return (
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-blue-600 mb-6"
        >
          <ArrowLeft size={18} />
          <span>Back to Help Requests</span>
        </button>

        <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg text-center">
          <p className="text-gray-600">Help request not found</p>
          <button
            onClick={() => navigate("/help-requests")}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Return to Help Requests
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Breadcrumb navigation */}
        <nav className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors font-medium"
          >
            <ArrowLeft size={16} />
            <span>Back to Help Requests</span>
          </button>
        </nav>

        {/* Main content area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Main info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header with title and badges */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 pb-5">
                <div className="flex flex-wrap justify-between gap-4 items-start mb-4">
                  <h1 className="text-2xl font-bold text-gray-900 flex-1">
                    {helpRequest.title}
                  </h1>

                  <div className="flex gap-3 flex-shrink-0">
                    <span
                      className={`px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5 border ${getStatusColor(
                        helpRequest.status
                      )}`}
                    >
                      {getStatusIcon(helpRequest.status)}
                      {helpRequest.status.charAt(0).toUpperCase() +
                        helpRequest.status.slice(1)}
                    </span>

                    <span
                      className={`px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5 border ${getUrgencyColor(
                        helpRequest.urgencyLevel
                      )}`}
                    >
                      {getUrgencyIcon(helpRequest.urgencyLevel)}
                      {helpRequest.urgencyLevel.charAt(0).toUpperCase() +
                        helpRequest.urgencyLevel.slice(1)}{" "}
                      Urgency
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-gray-500" />
                    <span>
                      Posted on{" "}
                      <time
                        dateTime={helpRequest.createdAt}
                        className="font-medium text-gray-700"
                      >
                        {formatDate(helpRequest.createdAt)}
                      </time>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Users size={16} className="text-gray-500" />
                    <span>
                      <span className="font-medium text-gray-700">
                        {helpRequest.helpers.length}
                      </span>{" "}
                      helper
                      {helpRequest.helpers.length !== 1 ? "s" : ""}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-gray-500" />
                    <span>
                      Last updated{" "}
                      <time
                        dateTime={helpRequest.updatedAt}
                        className="font-medium text-gray-700"
                      >
                        {formatDate(helpRequest.updatedAt)}
                      </time>
                    </span>
                  </div>
                </div>
              </div>

              {/* Tab navigation */}
              <div className="border-t border-gray-100">
                <nav className="flex">
                  <button
                    className={`px-6 py-3 text-sm font-medium flex items-center gap-2 ${
                      activeTab === "details"
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-gray-600 hover:text-gray-800"
                    }`}
                    onClick={() => setActiveTab("details")}
                  >
                    <AlertCircle size={16} />
                    Details
                  </button>

                  <button
                    className={`px-6 py-3 text-sm font-medium flex items-center gap-2 ${
                      activeTab === "activity"
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-gray-600 hover:text-gray-800"
                    }`}
                    onClick={() => setActiveTab("activity")}
                  >
                    <MessageCircle size={16} />
                    Activity Log
                  </button>

                  <button
                    className={`px-6 py-3 text-sm font-medium flex items-center gap-2 ${
                      activeTab === "helpers"
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-gray-600 hover:text-gray-800"
                    }`}
                    onClick={() => setActiveTab("helpers")}
                  >
                    <Users size={16} />
                    Helpers
                  </button>
                </nav>
              </div>
            </div>

            {/* Tab content */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              {activeTab === "details" && (
                <div className="p-6">
                  <div className="prose max-w-none text-gray-700">
                    <p className="text-gray-500 mb-2 text-sm">Description</p>
                    <p className="text-gray-800 text-base whitespace-pre-wrap leading-relaxed mb-8">
                      {helpRequest.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <h3 className="text-md font-medium text-gray-800 mb-4">
                      Location Information
                    </h3>
                    <div className="bg-blue-50 rounded-lg p-4 flex items-start gap-3">
                      <MapPin
                        size={20}
                        className="text-blue-600 mt-0.5 flex-shrink-0"
                      />
                      <div>
                        <p className="text-blue-900">
                          This help request is for assistance in your local
                          community.
                        </p>
                        <p className="text-blue-700 text-sm mt-1">
                          Please check with the requestor for specific location
                          details.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex gap-4">
                    <OfferHelpModal
                      helpRequestId={helpRequest.id}
                      isOpen={isOfferHelpModalOpen}
                      onClose={() => setIsOfferHelpModalOpen(false)}
                      onSuccess={() => setIsOfferHelpModalOpen(false)}
                    />
                    {helpRequest.requestorId != user?.id && (
                      <button
                        onClick={() => setIsOfferHelpModalOpen(true)}
                        className="text-white bg-green-700 hover:bg-green-800 px-4 py-2 rounded font-medium transition-colors cursor-pointer"
                      >
                        Offer Help
                      </button>
                    )}

                    {helpRequest.requestorId == user?.id && (
                      <DeleteHelpReqButton
                        reqId={helpRequest.id}
                        reqTitle={helpRequest.title}
                      />
                    )}
                  </div>
                </div>
              )}

              {activeTab === "activity" && (
                <div className="p-6">
                  <div className="mb-4 pb-2 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-lg font-medium text-gray-800">
                      Activity Timeline
                    </h2>
                    <span className="text-sm text-gray-500">
                      {helpRequest.helpers.length === 0
                        ? "No activity yet"
                        : "2 activities"}
                    </span>
                  </div>

                  <div className="space-y-6">
                    <div className="relative pl-8 pb-6 border-l-2 border-blue-200">
                      <div className="absolute -left-2.5 top-0">
                        <div className="w-5 h-5 rounded-full bg-blue-500 border-4 border-white shadow"></div>
                      </div>
                      <div className="mb-1">
                        <span className="font-medium text-gray-900">
                          Request Created
                        </span>
                        <span className="ml-2 text-sm text-gray-500">
                          {formatDate(helpRequest.createdAt)}
                        </span>
                      </div>
                      <p className="text-gray-700">
                        {helpRequest.requestor.name} created this help request
                      </p>
                    </div>

                    {helpRequest.helpers.length > 0 && (
                      <div className="relative pl-8">
                        <div className="absolute -left-2.5 top-0">
                          <div className="w-5 h-5 rounded-full bg-purple-500 border-4 border-white shadow"></div>
                        </div>
                        <div className="mb-1">
                          <span className="font-medium text-gray-900">
                            Helper Joined
                          </span>
                          <span className="ml-2 text-sm text-gray-500">
                            {formatDate(helpRequest.updatedAt)}
                          </span>
                        </div>
                        <p className="text-gray-700">
                          {helpRequest.helpers[0].name} offered to help with
                          this request
                        </p>
                      </div>
                    )}

                    {helpRequest.helpers.length === 0 && (
                      <div className="text-center py-10 text-gray-500">
                        <p>Waiting for helpers to join this request</p>
                        <button
                          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                          onClick={() => {
                            /* Handle be first to help logic */
                          }}
                        >
                          Be the first to help
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "helpers" && (
                <div className="p-6">
                  <div className="mb-4 pb-2 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="text-lg font-medium text-gray-800">
                      People Helping
                    </h2>
                    <span className="text-sm text-gray-500">
                      {helpRequest.helpers.length} helper
                      {helpRequest.helpers.length !== 1 ? "s" : ""}
                    </span>
                  </div>

                  {helpRequest.helpers && helpRequest.helpers.length > 0 ? (
                    <div className="space-y-4">
                      {helpRequest.helpers.map((helper) => (
                        <div
                          key={helper.id}
                          className="p-4 bg-gray-50 rounded-lg border border-gray-100 flex items-center gap-4 hover:border-blue-200 transition-colors"
                        >
                          {helper.profileImage ? (
                            <img
                              src={helper.profileImage}
                              alt={helper.name}
                              className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-lg border-2 border-white shadow-sm">
                              {helper.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">
                              {helper.name}
                            </div>
                            <div className="text-sm text-gray-600 mt-0.5">
                              Joined {formatDate(helpRequest.updatedAt)}
                            </div>
                          </div>
                          <button
                            className="px-4 py-2 text-blue-600 hover:text-blue-800 rounded-md hover:bg-blue-50 transition-colors flex items-center gap-1.5"
                            onClick={() => {
                              /* Handle message logic */
                            }}
                          >
                            <Mail size={16} />
                            Message
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-8 text-center">
                      <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <Users size={24} className="text-gray-400" />
                      </div>
                      <h3 className="text-gray-800 font-medium mb-2">
                        No helpers yet
                      </h3>
                      <p className="text-gray-600 mb-6 max-w-sm mx-auto">
                        Be the first person to help with this request and make a
                        difference in your community.
                      </p>
                      <button
                        className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
                        onClick={() => {
                          /* Handle be first to help logic */
                        }}
                      >
                        <HandHelping size={18} />
                        Volunteer to Help
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right column - Requestor info & stats */}
          <div className="space-y-6">
            {/* Requestor info card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-800 mb-4">
                  About the Requestor
                </h2>
                <div className="flex flex-col items-center text-center p-4">
                  <Avatar
                    size="xl"
                    name={helpRequest.requestor.name}
                    className="mb-4"
                  />
                  <div className="font-semibold text-lg text-gray-900 mb-1">
                    {helpRequest.requestor.name}
                  </div>
                </div>
              </div>
            </div>

            {/* Request details card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-800 mb-4">
                  Request Details
                </h2>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Status</p>
                    <p
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        helpRequest.status
                      )}`}
                    >
                      {getStatusIcon(helpRequest.status)}
                      {helpRequest.status.charAt(0).toUpperCase() +
                        helpRequest.status.slice(1)}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 mb-1">Urgency Level</p>
                    <p
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${getUrgencyColor(
                        helpRequest.urgencyLevel
                      )}`}
                    >
                      {getUrgencyIcon(helpRequest.urgencyLevel)}
                      {helpRequest.urgencyLevel.charAt(0).toUpperCase() +
                        helpRequest.urgencyLevel.slice(1)}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 mb-1">Date Created</p>
                    <p className="text-gray-800 font-medium">
                      {formatDate(helpRequest.createdAt)}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 mb-1">Last Updated</p>
                    <p className="text-gray-800 font-medium">
                      {formatDate(helpRequest.updatedAt)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpRequestDetail;
