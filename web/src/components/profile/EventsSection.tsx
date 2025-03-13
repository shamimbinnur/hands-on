import React from "react";

interface EventsSectionProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  events: any[];
}

const EventsSection: React.FC<EventsSectionProps> = ({ events }) => {
  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-5 border-b border-gray-200">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          Upcoming Events
        </h3>
      </div>

      <div className="divide-y divide-gray-200">
        {events.length > 0 ? (
          events.map((event) => (
            <div key={event.id} className="px-6 py-4">
              <h4 className="font-medium">{event.title}</h4>
              <p className="text-gray-500 text-sm">{event.description}</p>
              <div className="flex text-xs text-gray-400 mt-1">
                <span>{event.date}</span>
                {event.location && (
                  <span className="ml-2">• {event.location}</span>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="px-6 py-5">
            <p className="text-gray-500">No upcoming events.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsSection;
