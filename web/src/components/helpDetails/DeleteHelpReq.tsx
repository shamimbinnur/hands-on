import { useState } from "react";
import { useNavigate } from "react-router";
import { deleteHelpRequest } from "../../services/api/help/helpService";

interface DeleteHelpReqProps {
  reqId: string;
  reqTitle: string;
}

const DeleteHelpReqButton = ({ reqId, reqTitle }: DeleteHelpReqProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleDeleteHelpReq = async () => {
    try {
      setIsDeleting(true);
      await deleteHelpRequest(reqId);
      // Close modal and redirect to events page after successful deletion
      setShowModal(false);
      navigate("/help");
    } catch (error) {
      console.error("Error deleting help request:", error);
      alert("Failed to delete request. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="text-white bg-red-700 hover:bg-red-800 px-4 py-2 rounded font-medium transition-colors cursor-pointer"
      >
        Delete Request
      </button>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Confirm Deletion
            </h3>
            <p className="mb-6 text-gray-700">
              Are you sure you want to delete{" "}
              <span className="font-semibold">"{reqTitle}"</span>? This action
              cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                disabled={isDeleting}
                className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteHelpReq}
                disabled={isDeleting}
                className={`px-4 py-2 rounded text-white transition-colors ${
                  isDeleting ? "bg-red-400" : "bg-red-700 hover:bg-red-800"
                }`}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeleteHelpReqButton;
