export interface User {
  id: string;
  name: string;
  email: string;
  profileImage: string | null;
  bio: string | null;
  skills: string[];
  causes: string[];
  totalHours: number;
  totalPoints: number;
  joinedDate: Date;
}

export interface UpdateUserData {
  name?: string;
  bio?: string;
  skills?: string[];
  causes?: string[];
  profileImage?: string;
  password?: string;
}

export interface VolunteerLog {
  id: string;
  userId: string;
  eventId: string;
  hours: number;
  notes: string | null;
  createdAt: Date;
  event: {
    title: string;
    date: Date;
  };
}
