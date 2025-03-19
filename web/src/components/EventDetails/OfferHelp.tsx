import React, { useState } from "react";
import { offerHelp } from "../../services/api/help/helpService";

interface OfferHelpModalProps {
  helpRequestId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const OfferHelpModal: React.FC<OfferHelpModalProps> = ({
  helpRequestId,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If the modal is not open, don't render anything
  if (!isOpen) return null;

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await offerHelp(helpRequestId);
      console.log("Help offered successfully:", result.message);

      // Call the success callback if provided
      if (onSuccess) {
        onSuccess();
      }

      // Close the modal
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Modal backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal content */}
      <div className="flex min-h-full items-center justify-center p-4 text-center">
        <div className="relative transform overflow-hidden rounded-lg bg-white p-6 text-left shadow-xl transition-all w-full max-w-md">
          <div className="mb-4">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Offer Help
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Are you sure you want to offer help for this request? The
              requester will be notified and can choose to accept your offer.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="button"
              className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </>
              ) : (
                "Offer Help"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfferHelpModal;
