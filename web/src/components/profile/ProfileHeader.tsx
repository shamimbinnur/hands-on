import React from "react";
import { User, Mail, Calendar, Edit } from "lucide-react";
import { formatJoinedDate } from "../../utils/formatDate";
import { User as UserType } from "../../services/api/user/types";

interface ProfileHeaderProps {
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  user: UserType;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  isModalOpen,
  setIsModalOpen,
  user,
}) => {
  return (
    <div className="bg-white shadow">
      <div className="max-w-6xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center md:items-start">
          {/* Profile image */}
          <div className="mb-4 md:mb-0 md:mr-8">
            {user.profileImage === "default-profile.jpg" ? (
              <div className="h-32 w-32 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
                <User size={64} />
              </div>
            ) : (
              <img
                className="h-32 w-32 rounded-full object-cover border-4 border-white shadow"
                src={user.profileImage || ""}
                alt={`${user.name}'s profile`}
              />
            )}
          </div>

          {/* User info */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
            <div className="flex flex-col md:flex-row md:items-center mt-2 space-y-2 md:space-y-0 md:space-x-4">
              <div className="flex items-center justify-center md:justify-start text-gray-500">
                <Mail size={16} className="mr-1" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center justify-center md:justify-start text-gray-500">
                <Calendar size={16} className="mr-1" />
                <span>
                  Joined{" "}
                  {formatJoinedDate(user.joinedDate as unknown as string)}
                </span>
              </div>
            </div>

            {/* Edit profile button */}
            <button
              onClick={() => setIsModalOpen(!isModalOpen)}
              className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Edit size={16} className="mr-2" />
              Edit Profile
            </button>
          </div>

          {/* Stats */}
          <div className="flex mt-6 md:mt-0 space-x-6">
            <div className="text-center">
              <span className="text-xl font-semibold text-gray-900">
                {user.totalHours}
              </span>
              <p className="text-sm text-gray-500">Hours</p>
            </div>
            <div className="text-center">
              <span className="text-xl font-semibold text-gray-900">
                {user.totalPoints}
              </span>
              <p className="text-sm text-gray-500">Points</p>
            </div>
            <div className="text-center">
              <span className="text-xl font-semibold text-gray-900">
                {user.causes?.length || 0}
              </span>
              <p className="text-sm text-gray-500">Causes</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
