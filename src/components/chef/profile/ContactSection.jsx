import SectionCard from "./SectionCard";
import { Phone, MessageSquare, Star } from "lucide-react";

export default function ContactSection({ profile }) {
  return (
    <SectionCard>
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-stone-100 p-3 rounded-xl">
          <Phone className="text-text-secondary" />
        </div>

        <h2 className="text-4xl font-bold text-text-primary">
          Contact & Social Presence
        </h2>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">

        {/* Phone */}
        <div>
          <label className="block mb-2 font-medium text-text-secondary">
            Phone Number
          </label>

          <div
            className="
            border border-surface-low
            rounded-xl
            px-4 py-4
            flex items-center gap-3
            "
          >
            <Phone
              size={18}
              className="text-text-secondary"
            />

            <span>{profile.phone}</span>
          </div>
        </div>

        {/* WhatsApp */}
        <div>
          <label className="block mb-2 font-medium text-text-secondary">
            WhatsApp Number
          </label>

          <div
            className="
            border border-surface-low
            rounded-xl
            px-4 py-4
            flex items-center gap-3
            "
          >
            <MessageSquare
              size={18}
              className="text-text-secondary"
            />

            <span>{profile.phone}</span>
          </div>
        </div>

        {/* Instagram */}
        <div>
          <label className="block mb-2 font-medium text-text-secondary">
            Instagram Username
          </label>

          <div
            className="
            border border-surface-low
            rounded-xl
            px-4 py-4
            flex items-center gap-3
            "
          >
            <Star
              size={18}
              className="text-text-secondary"
            />

            <span>{profile.instagram}</span>
          </div>
        </div>

      </div>
    </SectionCard>
  );
}