import { useState } from "react";
import CreateEventModal from "./CreateEventModal";

interface ButtonProps {
  onEventCreated: () => void;
}

const CreateEventButton: React.FC<ButtonProps> = ({
  onEventCreated,
}: {
  onEventCreated: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <CreateEventModal
        onClose={() => setIsOpen(false)}
        onEventCreated={onEventCreated}
        isOpen={isOpen}
      />
      <button
        onClick={() => setIsOpen(true)}
        className="px-2 py-2 border rounded-md text-sm cursor-pointer h-fit text-white bg-blue-600 hover:bg-blue-700 transition-colors"
      >
        Create Event
      </button>
    </>
  );
};

export default CreateEventButton;
