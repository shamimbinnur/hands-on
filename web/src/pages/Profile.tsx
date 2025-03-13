import { useEffect, useState } from "react";
import { useAuthStore } from "../store";
import {
  fetchUserById,
  updateUserProfile,
} from "../services/api/user/userService";
import { User } from "../services/api/user/types";
import ProfileHeader from "../components/profile/ProfileHeader";
import ProfileTabs from "../components/profile/ProfileTabs";
import TabContent from "../components/profile/TabContent";
import Loader from "../components/common/Loader";
import ProfileEditModal from "../components/profile/ProfileEditModal";

type Tab = "overview" | "activities" | "causes";

export default function Profile() {
  const { user } = useAuthStore();
  const [userData, setUserData] = useState<User>();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const setProfile = async () => {
    console.log(user);
    const data = await fetchUserById(user?.id as string);
    setUserData(data);
    console.log(userData);
  };

  useEffect(() => {
    try {
      setProfile();
    } catch (error) {
      console.error(error);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {userData ? (
        <>
          <ProfileEditModal
            onClose={() => setIsModalOpen(false)}
            isOpen={isModalOpen}
            user={userData as User}
            onUpdate={updateUserProfile}
            setProfile={setProfile}
          />

          <ProfileHeader
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            user={userData}
          />

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>

          <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <TabContent activeTab={activeTab} user={userData} />
          </div>
        </>
      ) : (
        <Loader />
      )}
    </div>
  );
}
