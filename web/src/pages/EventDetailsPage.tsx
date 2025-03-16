import { useEffect, useState } from "react";
import { Calendar, MapPin, ChevronLeft, User, Tag } from "lucide-react";
import { formatJoinedDate } from "../utils/formatDate";
import {
  checkJoinStatus,
  fetchEventById,
} from "../services/api/event/eventService";
import { Event } from "../services/api/event/types";
import { useParams } from "react-router";
import { StatusBadge } from "../components/EventDetails/StatusBadge";
import Loader from "../components/common/Loader";
import { NavLink } from "react-router";
import JoinEvent from "../components/events/JoinEvent";
import { useAuthStore } from "../store";
import DeleteEventButton from "../components/EventDetails/DeleteEventButton";

const EventDetailsPage = () => {
  const [event, setEvent] = useState<Event>();
  const [isJoined, setIsJoined] = useState(false);
  const { id } = useParams();

  const { user } = useAuthStore();

  const load = async () => {
    try {
      const event = await fetchEventById(id as string);
      const isJoined = await checkJoinStatus(event.id);

      setEvent(event);
      setIsJoined(isJoined.joined);

      console.log(event);
      console.log(isJoined);
    } catch (error) {
      console.error("Error fetching event:", error);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  if (!event) {
    return <Loader />;
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Navigation bar */}
      <NavLink to="/event" className="bg-gray-100 border-b">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <button className="flex items-center text-blue-600 cursor-pointer hover:text-blue-800 transition-colors">
            <ChevronLeft className="h-5 w-5 mr-1" />
            Back to events
          </button>
        </div>
      </NavLink>

      {/* Event image banner */}
      {event && (
        <div className="w-full h-64 md:h-80 bg-gray-200 relative">
          <img
            src={event.image || ""}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30"></div>
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="max-w-6xl mx-auto">
              <StatusBadge status={event.status} />
              <h1 className="text-3xl md:text-4xl font-bold text-white mt-2 mb-2">
                {event.title}
              </h1>
            </div>
          </div>
        </div>
      )}

      {/* If no image, show title in the header */}
      {!event.image && (
        <div className="bg-gray-50 py-8">
          <div className="max-w-6xl mx-auto px-4">
            <StatusBadge status={event.status} />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
              {event.title}
            </h1>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row">
          {/* Left column - Event details */}
          <div className="md:w-2/3 md:pr-8">
            {/* Date and location */}
            <div className="flex flex-col md:flex-row md:items-center text-gray-600 mb-6 border-b pb-6">
              <div className="flex items-center mb-3 md:mb-0 md:mr-6">
                <Calendar className="h-5 w-5 mr-2 text-gray-500" />
                <span>{formatJoinedDate(event.date)}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-gray-500" />
                <span>Dhaka, Bangladesh</span>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <span>About this event</span>
              </h2>
              <div className="prose max-w-none text-gray-700">
                <p>{event.description}</p>
              </div>
            </div>
          </div>

          {/* Right column - Additional info */}
          <div className="md:w-1/3 md:pl-8 md:border-l border-gray-200">
            {/* Category */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                <Tag className="h-4 w-4 mr-1" />
                Category
              </h3>
              <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                {event.category}
              </span>
            </div>

            {/* Organizer */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                <User className="h-4 w-4 mr-1" />
                Organizer
              </h3>
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 mr-3">
                  {event.organizer.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">
                    {event.organizer.name}
                  </h4>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="mt-8 flex gap-2">
              <JoinEvent
                onAttendanceChange={setIsJoined}
                isAttending={isJoined}
                eventId={event.id}
              />

              {event.organizer.id === user?.id && (
                <DeleteEventButton
                  eventId={event.id}
                  eventTitle={event.title}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsPage;
