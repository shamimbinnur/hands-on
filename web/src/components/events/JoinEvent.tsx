import React, { useState } from "react";
import { Loader, UserPlus, UserMinus } from "lucide-react";
import { joinEvent, leaveEvent } from "../../services/api/event/eventService";

interface JoinLeaveButtonProps {
  eventId: string;
  isAttending: boolean;
  onAttendanceChange?: (isAttending: boolean) => void;
  disabled?: boolean;
  className?: string;
}

const JoinLeaveButton: React.FC<JoinLeaveButtonProps> = ({
  eventId,
  isAttending,
  onAttendanceChange,
  disabled = false,
  className = "",
}) => {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (loading || disabled) return;
    setLoading(true);
    try {
      if (isAttending) {
        // Leave event
        await leaveEvent(eventId);
        if (onAttendanceChange) {
          onAttendanceChange(false);
        }
      } else {
        // Join event
        await joinEvent(eventId);
        if (onAttendanceChange) {
          onAttendanceChange(true);
        }
      }
    } catch (error) {
      console.error("Error changing attendance status:", error);
    } finally {
      setLoading(false);
    }
  };

  // Button styling based on state
  const buttonColors = isAttending
    ? "bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white"
    : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 text-white";
  const disabledStyles = "bg-gray-300 text-gray-500 cursor-not-allowed";

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled || loading}
      className={`
        px-4 py-2 rounded
        font-medium
        transition-colors
        cursor-pointer
        focus:outline-none focus:ring-2 focus:ring-offset-2
        ${disabled || loading ? disabledStyles : buttonColors}
        ${className}
      `}
    >
      {loading ? (
        <span className="flex items-center justify-center">
          <Loader className="animate-spin -ml-1 mr-2 h-4 w-4" />
          {isAttending ? "Leaving..." : "Joining..."}
        </span>
      ) : (
        <span className="flex items-center justify-center">
          {isAttending ? (
            <UserMinus className="mr-2 h-4 w-4" />
          ) : (
            <UserPlus className="mr-2 h-4 w-4" />
          )}
          {isAttending ? "Leave Event" : "Join Event"}
        </span>
      )}
    </button>
  );
};

export default JoinLeaveButton;
