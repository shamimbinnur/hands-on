import React from "react";

type TabType = "overview" | "activities" | "causes";

interface ProfileTabsProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

const ProfileTabs: React.FC<ProfileTabsProps> = ({
  activeTab,
  setActiveTab,
}) => {
  return (
    <div className="border-b border-gray-200 mt-8">
      <nav className="-mb-px flex space-x-8">
        <button
          onClick={() => setActiveTab("overview")}
          className={`${
            activeTab === "overview"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab("activities")}
          className={`${
            activeTab === "activities"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
        >
          Activities
        </button>
        <button
          onClick={() => setActiveTab("causes")}
          className={`${
            activeTab === "causes"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
        >
          Causes
        </button>
      </nav>
    </div>
  );
};

export default ProfileTabs;
