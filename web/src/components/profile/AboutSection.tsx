import React from "react";

interface AboutSectionProps {
  bio: string | null;
}

const AboutSection: React.FC<AboutSectionProps> = ({ bio }) => {
  return (
    <div className="bg-white shadow rounded-lg mb-8">
      <div className="px-6 py-5 border-b border-gray-200">
        <h3 className="text-lg font-medium leading-6 text-gray-900">About</h3>
      </div>

      <div className="px-6 py-5">
        <p className="text-gray-500">{bio || "No bio provided yet."}</p>
      </div>
    </div>
  );
};

export default AboutSection;
