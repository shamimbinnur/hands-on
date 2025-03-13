import React, { useState } from "react";
import { UpdateUserData, User } from "../../services/api/user/types";

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onUpdate: (
    userId: string,
    userData: UpdateUserData
  ) => Promise<User | undefined>;
  setProfile: () => void;
}

const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
  isOpen,
  onClose,
  user,
  onUpdate,
  setProfile,
}) => {
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio);
  const [skills, setSkills] = useState(user.skills.join(", "));
  const [causes, setCauses] = useState(user.causes.join(", "));
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const updateData = {
        name,
        bio,
        skills: skills
          .split(",")
          .map((skill) => skill.trim())
          .filter((skill) => skill !== ""),
        causes: causes
          .split(",")
          .map((cause) => cause.trim())
          .filter((cause) => cause !== ""),
      };

      await onUpdate(user.id, updateData as UpdateUserData);
      await setProfile();
      onClose();
    } catch (error) {
      console.error("Update failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Edit Profile</h2>
          <button onClick={onClose} className="text-gray-500">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block mb-1">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block mb-1">Bio</label>
              <textarea
                value={bio || ""}
                onChange={(e) => setBio(e.target.value)}
                className="w-full p-2 border rounded"
                rows={3}
              />
            </div>

            <div>
              <label className="block mb-1">Skills (comma-separated)</label>
              <input
                type="text"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="coding, design, marketing"
              />
            </div>

            <div>
              <label className="block mb-1">Causes (comma-separated)</label>
              <input
                type="text"
                value={causes}
                onChange={(e) => setCauses(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="education, environment, healthcare"
              />
            </div>

            <div>
              <label className="block mb-1">New Password (optional)</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded"
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileEditModal;
