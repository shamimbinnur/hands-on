import React, { useState, useEffect, useRef, useCallback } from "react";
import { fetchEvents } from "../services/api/event/eventService";
import { EventCard } from "../components/events/EventCard";
import { Event } from "../services/api/event/types";
import { LoadingSpinner } from "../components/events/LoadingSpinner";

const ITEMS_PER_PAGE = 4;

const Events: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Intersection Observer setup for infinite scrolling
  const observer = useRef<IntersectionObserver | null>(null);
  const lastEventElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;

      // Disconnect previous observer before creating a new one
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setCurrentPage((prevPage) => prevPage + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  // Fetch events when page changes
  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true);

      try {
        const response = await fetchEvents({
          page: currentPage,
          limit: ITEMS_PER_PAGE,
        });

        if (currentPage === 1) {
          setEvents(response.events);
          console.log(response);
        } else {
          setEvents((prev) => [...prev, ...response.events]);
        }

        setHasMore(response.pagination.hasNext);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, [currentPage]);

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Events</h1>

      {/* Events List */}
      <div className="space-y-8">
        {events.map((event, index) => {
          const isLastElement = index === events.length - 1;
          return isLastElement ? (
            <EventCard key={event.id} event={event} ref={lastEventElementRef} />
          ) : (
            <EventCard key={event.id} event={event} />
          );
        })}
      </div>

      {loading && <LoadingSpinner />}

      {!hasMore && events.length > 0 && (
        <div className="text-center text-gray-500 p-4">
          No more events to load
        </div>
      )}

      {!loading && events.length === 0 && (
        <div className="text-center text-gray-500 p-4">No events found</div>
      )}
    </div>
  );
};

export default Events;
