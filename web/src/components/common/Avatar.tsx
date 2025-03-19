import React from "react";

interface AvatarProps {
  name: string;
  size?: "sm" | "md" | "lg" | "xl";
  bgColor?: string;
  textColor?: string;
  className?: string;
  randomColor?: boolean;
}

/**
 * Avatar component that displays initials from a name
 *
 * @param name - Full name to generate initials from
 * @param size - Size of the avatar (sm, md, lg, xl)
 * @param bgColor - Background color tailwind class
 * @param textColor - Text color tailwind class
 * @param className - Additional custom classes
 * @param randomColor - Whether to use a random background color
 */
const Avatar: React.FC<AvatarProps> = ({
  name,
  size = "md",
  bgColor = "bg-blue-500",
  textColor = "text-white",
  className = "",
  randomColor = false,
}) => {
  // Generate initials from the name (takes first letter of each word)
  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((part) => part.charAt(0).toUpperCase())
      .join("")
      .substring(0, 2); // Limit to 2 characters
  };

  // Generate a random background color based on the name
  const getRandomColor = (): string => {
    const colors = [
      "bg-blue-500",
      "bg-red-500",
      "bg-green-500",
      "bg-yellow-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-teal-500",
      "bg-orange-500",
      "bg-cyan-500",
    ];

    // Use the name to create a consistent color for the same name
    const nameHash = name
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const colorIndex = nameHash % colors.length;

    return colors[colorIndex];
  };

  // Size mapping
  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
    xl: "w-16 h-16 text-lg",
  };

  // Determine which background color to use
  const backgroundColor = randomColor ? getRandomColor() : bgColor;

  return (
    <div
      className={`${sizeClasses[size]} ${backgroundColor} ${textColor} rounded-full flex items-center justify-center font-medium ${className}`}
      aria-label={name}
    >
      {getInitials(name)}
    </div>
  );
};

export default Avatar;
