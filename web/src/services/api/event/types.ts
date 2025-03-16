// Types

export interface CreateEventData {
  title: string;
  description: string;
  category: string;
  date: string;
  time: string;
  address: string;
  latitude?: number | null;
  longitude?: number | null;
  maxAttendees?: number;
  imageUrl?: string;
}
export interface Organizer {
  id: string;
  name: string;
  profileImage: string | null;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  category: string;
  status: string;
  image: string | null;
  organizer: Organizer;
  attendeeCount: number;
  attendees: string[];
  latitude: 37.7749;
  longitude: -122.4194;
}

export interface PaginationMetadata {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface EventsResponse {
  events: Event[];
  pagination: PaginationMetadata;
}

export interface EventFilters {
  category?: string;
  status?: string;
}

export interface JoinStatusResponse {
  joined: boolean;
  attendance: {
    id: string;
    userId: string;
    eventId: string;
    createdAt: string;
  } | null;
}
