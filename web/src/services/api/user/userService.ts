import { User, UpdateUserData, VolunteerLog } from "./types";
import Cookies from "js-cookie";

const API_BASE_URL = import.meta.env.API_URL || "http://localhost:5858/api";

export const fetchUserById = async (userId: string): Promise<User> => {
  const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch user");
  }

  const userData = await response.json();

  return {
    ...userData,
    joinedDate: new Date(userData.joinedDate),
  };
};

export const fetchAllUsers = async (): Promise<User[]> => {
  const response = await fetch(`${API_BASE_URL}/users`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Cookies.get("token")}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch users");
  }

  const usersData = await response.json();

  // Convert string dates to Date objects for all users
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return usersData.map((user: any) => ({
    ...user,
    joinedDate: new Date(user.joinedDate),
  }));
};

export const updateUserProfile = async (
  userId: string,
  userData: UpdateUserData
): Promise<User> => {
  const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Cookies.get("token")}`,
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to update user");
  }

  return await response.json();
};

/**
 * Fetch a user's volunteer history
 * @param userId The ID of the user
 * @returns Promise containing the user's volunteer logs
 */
export const fetchUserVolunteerHistory = async (
  userId: string
): Promise<VolunteerLog[]> => {
  const response = await fetch(`${API_BASE_URL}/users/${userId}/history`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch volunteer history");
  }

  const logsData = await response.json();

  // Convert string dates to Date objects
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return logsData.map((log: any) => ({
    ...log,
    createdAt: new Date(log.createdAt),
    event: {
      ...log.event,
      date: new Date(log.event.date),
    },
  }));
};
