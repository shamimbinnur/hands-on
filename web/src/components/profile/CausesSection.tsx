import React from "react";
import { Edit, Heart } from "lucide-react";

interface CausesSectionProps {
  causes: string[];
}

const CausesSection: React.FC<CausesSectionProps> = ({ causes }) => {
  return (
    <div className="bg-white shadow rounded-lg mb-8">
      <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Causes</h3>
        <button className="text-sm text-blue-600 hover:text-blue-800">
          <Edit size={16} />
        </button>
      </div>

      <div className="px-6 py-5">
        {causes && causes.length > 0 ? (
          <div className="space-y-3">
            {causes.map((cause, index) => (
              <div key={index} className="flex items-center">
                <Heart size={16} className="text-red-500 mr-2" />
                <span>{cause}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">
            No causes added yet. Add causes you're passionate about.
          </p>
        )}
      </div>
    </div>
  );
};

export default CausesSection;
