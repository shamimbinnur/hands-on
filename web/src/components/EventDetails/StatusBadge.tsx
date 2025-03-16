export const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const getStatusColor = () => {
    switch (status.toLowerCase()) {
      case "upcoming":
        return "bg-blue-100 text-blue-800";
      case "in progress":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor()}`}
    >
      {status}
    </span>
  );
};
