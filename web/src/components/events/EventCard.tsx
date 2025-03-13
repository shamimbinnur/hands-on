import React from "react";
import { formatJoinedDate } from "../../utils/formatDate";
import { Calendar, Image, Users, MapPin } from "lucide-react";
import { Event } from "../../services/api/event/types";
import { NavLink } from "react-router";

interface EventCardProps {
  event: Event;
  ref?: React.Ref<HTMLDivElement>;
}

export const EventCard: React.FC<EventCardProps> = ({ event, ref }) => {
  return (
    <div
      ref={ref}
      className="border overflow-hidden border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col h-full"
    >
      <div className="relative bg-gray-100 h-48">
        {event.image ? (
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex justify-center items-center bg-gray-50">
            <Image size={65} className="text-gray-300" />
          </div>
        )}
        <div className="absolute top-4 right-4">
          <span className="bg-blue-500 text-white text-sm px-3 py-1 rounded-full">
            {event.category}
          </span>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <div className="mb-4">
          <NavLink to={`/event/${event.id}`}>
            <h2 className="text-xl font-semibold text-gray-800 hover:text-blue-600 transition-colors">
              {event.title}
            </h2>
          </NavLink>

          <p className="mt-2 text-gray-600 line-clamp-3">{event.description}</p>
        </div>

        <div className="mt-auto">
          <div className="flex flex-wrap items-center text-sm text-gray-600 gap-y-2">
            <div className="flex items-center gap-x-2 mr-4">
              <Calendar size={16} className="text-blue-500" />
              <p>{formatJoinedDate(event.date)}</p>
            </div>

            {event.location && (
              <div className="flex items-center gap-x-2 mr-4">
                <MapPin size={16} className="text-blue-500" />
                <p>{event.location}</p>
              </div>
            )}

            <div className="flex items-center gap-x-2">
              <Users size={16} className="text-blue-500" />
              <p>{event.attendeeCount} attendees</p>
            </div>
          </div>

          <div className="mt-4 flex justify-between items-center">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-300">
              Join Event
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
