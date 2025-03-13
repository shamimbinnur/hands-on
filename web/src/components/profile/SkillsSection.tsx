import React from "react";
import { Edit } from "lucide-react";

interface SkillsSectionProps {
  skills: string[];
}

const SkillsSection: React.FC<SkillsSectionProps> = ({ skills }) => {
  return (
    <div className="bg-white shadow rounded-lg mb-8">
      <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Skills</h3>
        <button className="text-sm text-blue-600 hover:text-blue-800">
          <Edit size={16} />
        </button>
      </div>
      <div className="px-6 py-5">
        {skills && skills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
              >
                {skill}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">
            No skills added yet. Add skills to showcase your expertise.
          </p>
        )}
      </div>
    </div>
  );
};

export default SkillsSection;
