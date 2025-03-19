import axios from "axios";
import Cookies from "js-cookie";
import {
  CreateHelpRequestData,
  HelpRequest,
  HelpRequestsFilter,
  UpdateHelpRequestData,
  PaginatedResponse,
  PaginationOptions,
} from "./types";

// API Endpoints
const API_URL = "http://localhost:5858";
const HELP_REQUESTS_ENDPOINT = `${API_URL}/api/help-requests`;

// New function to support pagination
export const fetchHelpRequests = async (
  options: PaginationOptions = { page: 1, limit: 10 },
  filters: HelpRequestsFilter = {}
): Promise<PaginatedResponse<HelpRequest>> => {
  try {
    const response = await axios.get(HELP_REQUESTS_ENDPOINT, {
      params: {
        ...filters,
        page: options.page,
        limit: options.limit,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch help requests"
      );
    }
    throw new Error("An unexpected error occurred");
  }
};

export const fetchHelpRequestById = async (
  id: string
): Promise<HelpRequest> => {
  try {
    const response = await axios.get<HelpRequest>(
      `${HELP_REQUESTS_ENDPOINT}/${id}`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch help request"
      );
    }
    throw new Error("An unexpected error occurred");
  }
};

export const createHelpRequest = async (
  helpRequestData: CreateHelpRequestData
): Promise<HelpRequest> => {
  try {
    const response = await axios.post<HelpRequest>(
      HELP_REQUESTS_ENDPOINT,
      helpRequestData,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to create help request"
      );
    }
    throw new Error("An unexpected error occurred");
  }
};

export const updateHelpRequest = async (
  id: string,
  updateData: UpdateHelpRequestData
): Promise<HelpRequest> => {
  try {
    const response = await axios.put<HelpRequest>(
      `${HELP_REQUESTS_ENDPOINT}/${id}`,
      updateData,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to update help request"
      );
    }
    throw new Error("An unexpected error occurred");
  }
};

export const deleteHelpRequest = async (
  id: string
): Promise<{ message: string }> => {
  try {
    const response = await axios.delete<{ message: string }>(
      `${HELP_REQUESTS_ENDPOINT}/${id}`,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to delete help request"
      );
    }
    throw new Error("An unexpected error occurred");
  }
};

export const offerHelp = async (id: string): Promise<{ message: string }> => {
  try {
    const response = await axios.post<{ message: string }>(
      `${HELP_REQUESTS_ENDPOINT}/${id}/offer-help`,
      {},
      {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to offer help");
    }
    throw new Error("An unexpected error occurred");
  }
};

export const withdrawHelp = async (
  id: string
): Promise<{ message: string }> => {
  try {
    const response = await axios.post<{ message: string }>(
      `${HELP_REQUESTS_ENDPOINT}/${id}/withdraw-help`,
      {},
      {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to withdraw help"
      );
    }
    throw new Error("An unexpected error occurred");
  }
};
