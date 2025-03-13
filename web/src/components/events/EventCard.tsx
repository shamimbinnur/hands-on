import React from "react";
import { formatJoinedDate } from "../../utils/formatDate";
import { Calendar, Citrus, Image, Users } from "lucide-react";
import { Event } from "../../services/api/event/types";

interface EventCardProps {
  event: Event;
  ref?: React.Ref<HTMLDivElement>;
}

export const EventCard: React.FC<EventCardProps> = ({ event, ref }) => {
  return (
    <div
      ref={ref}
      className="border max-w-2xl mx-auto rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="border py-20 text-gray-300 mb-6 flex justify-center items-center rounded-md">
        <Image size={65} />
      </div>

      <div>
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-semibold">{event.title}</h2>

          <button className="bg-blue-500 cursor-pointer text-white px-4 py-2 rounded-md mt-4">
            Join
          </button>
        </div>
      </div>

      <div className="flex items-center text-gray-600 gap-x-4">
        <div className="flex items-center gap-x-2">
          <Calendar size={16} className="inline-block" />
          <p>{formatJoinedDate(event.date)}</p>
        </div>

        <div className="flex items-center gap-x-2">
          <Citrus size={16} className="inline-block" />
          <p>{event.category}</p>
        </div>

        <div className="flex items-center gap-x-2">
          <Users size={16} className="inline-block" />
          <p>{event.attendeeCount}</p>
        </div>
      </div>
      <p className="mt-2 text-lg">{event.description}</p>
    </div>
  );
};
