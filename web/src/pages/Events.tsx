import React, { useState, useEffect, useRef, useCallback } from "react";
import { fetchEvents } from "../services/api/event/eventService";
import { EventCard } from "../components/events/EventCard";
import { Event } from "../services/api/event/types";
import { LoadingSpinner } from "../components/events/LoadingSpinner";

const ITEMS_PER_PAGE = 6; // Adjusted for single row layout

const Events: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // Start with loading state
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);

  // Intersection Observer setup for infinite scrolling
  const observer = useRef<IntersectionObserver | null>(null);
  const lastEventElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;

      // Disconnect previous observer before creating a new one
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            setCurrentPage((prevPage) => prevPage + 1);
          }
        },
        {
          rootMargin: "200px", // Load earlier for smoother experience
        }
      );

      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  // Fetch events when page changes
  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetchEvents({
          page: currentPage,
          limit: ITEMS_PER_PAGE,
        });

        if (currentPage === 1) {
          setEvents(response.events);
        } else {
          setEvents((prev) => [...prev, ...response.events]);
        }

        setHasMore(response.pagination.hasNext);
      } catch (error) {
        console.error("Error fetching events:", error);
        setError("Failed to load events. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, [currentPage]);

  // Function to manually retry loading
  const handleRetry = () => {
    setError(null);
    setCurrentPage(1);
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Upcoming Events</h1>
        <p className="text-gray-600 mt-2">
          Discover and join our latest events
        </p>
      </header>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
              <button
                onClick={handleRetry}
                className="mt-2 text-sm font-medium text-red-700 hover:text-red-900 underline"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Events List - Single Event Per Row */}
      {events.length > 0 ? (
        <div className="space-y-6">
          {events.map((event, index) => {
            const isLastElement = index === events.length - 1;
            return isLastElement ? (
              <EventCard ref={lastEventElementRef} event={event} />
            ) : (
              <EventCard event={event} />
            );
          })}
        </div>
      ) : !loading ? (
        <div className="bg-gray-50 rounded-lg text-center p-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">
            No events found
          </h3>
          <p className="mt-1 text-gray-500">
            Check back later for upcoming events.
          </p>
        </div>
      ) : null}

      {/* Loading indicator */}
      {loading && (
        <div className="flex justify-center my-60">
          <LoadingSpinner />
        </div>
      )}

      {/* End of results message */}
      {!hasMore && events.length > 0 && !loading && (
        <div className="text-center text-gray-500 py-6 border-t mt-6">
          <p>You've reached the end of the list</p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Back to top
          </button>
        </div>
      )}
    </div>
  );
};

export default Events;
