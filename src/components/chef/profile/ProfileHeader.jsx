import { Eye } from "lucide-react";

export default function ProfileHeader() {
  return (
    <div className="flex justify-between items-start">

      <div>
        <h1 className="text-2xl font-bold text-text-primary">
          Kitchen Profile Management
        </h1>

        <p className="mt-2 text-text-secondary text-base">
          Configure how your kitchen appears to customers
          across the platform.
        </p>
      </div>

      <button
        className="
        flex items-center gap-2
        border-2 border-teal-600
        text-teal-600
        px-6 py-3
        rounded-full
        font-medium
      "
      >
        <Eye size={18} />
        View Public Profile
      </button>
    </div>
  );
}