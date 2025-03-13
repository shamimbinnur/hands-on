import React from "react";
import AboutSection from "./AboutSection";
import SkillsSection from "./SkillsSection";
import CausesSection from "./CausesSection";
import EventsSection from "./EventsSection";
import { User } from "../../services/api/user/types";

interface TabContentProps {
  activeTab: "overview" | "activities" | "causes";
  user: User;
}

const TabContent: React.FC<TabContentProps> = ({ activeTab, user }) => {
  const renderOverviewTab = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main content */}
      <div className="lg:col-span-2">
        <AboutSection bio={user.bio} />
        <SkillsSection skills={user.skills} />
      </div>

      {/* Sidebar */}
      <div className="lg:col-span-1">
        <CausesSection causes={user.causes} />
        <EventsSection events={[]} />
      </div>
    </div>
  );

  const renderActivitiesTab = () => (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-5 border-b border-gray-200">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          Activities
        </h3>
      </div>
      <div className="px-6 py-5">
        <p className="text-gray-500">No activities to display.</p>
      </div>
    </div>
  );

  const renderCausesTab = () => (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-5 border-b border-gray-200">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Causes</h3>
      </div>
      <div className="px-6 py-5">
        <p className="text-gray-500">No causes to display.</p>
      </div>
    </div>
  );

  switch (activeTab) {
    case "overview":
      return renderOverviewTab();
    case "activities":
      return renderActivitiesTab();
    case "causes":
      return renderCausesTab();
    default:
      return renderOverviewTab();
  }
};

export default TabContent;
