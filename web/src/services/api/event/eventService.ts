import axios from "axios";
import { EventsResponse, Event, JoinStatusResponse } from "./types";

const API_URL = "http://localhost:5858";

export interface FetchEventsParams {
  page?: number;
  limit?: number;
}

export const fetchEvents = async (
  params: FetchEventsParams = {}
): Promise<EventsResponse> => {
  try {
    const { page = 1, limit = 10, ...filters } = params;
    const response = await axios.get(`${API_URL}/api/events`, {
      params: {
        page,
        limit,
        ...filters,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch events"
      );
    }
    throw new Error("An unexpected error occurred");
  }
};

export const fetchEventById = async (id: string): Promise<Event> => {
  try {
    const response = await axios.get<Event>(`${API_URL}/api/events/${id}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to fetch event");
    }
    throw new Error("An unexpected error occurred");
  }
};

export const joinEvent = async (id: string): Promise<{ message: string }> => {
  try {
    const response = await axios.post<{ message: string }>(
      `${API_URL}/api/events/${id}/join`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Handle specific error cases that might come from the backend
      const errorMsg = error.response?.data?.message || "Failed to join event";
      throw new Error(errorMsg);
    }
    throw new Error("An unexpected error occurred");
  }
};

export const leaveEvent = async (id: string): Promise<{ message: string }> => {
  try {
    const response = await axios.post<{ message: string }>(
      `${API_URL}/api/events/${id}/leave`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMsg = error.response?.data?.message || "Failed to leave event";
      throw new Error(errorMsg);
    }
    throw new Error("An unexpected error occurred");
  }
};

export const checkJoinStatus = async (
  id: string
): Promise<JoinStatusResponse> => {
  try {
    const response = await axios.get<JoinStatusResponse>(
      `${API_URL}/api/events/${id}/joined`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to check join status"
      );
    }
    throw new Error("An unexpected error occurred");
  }
};
