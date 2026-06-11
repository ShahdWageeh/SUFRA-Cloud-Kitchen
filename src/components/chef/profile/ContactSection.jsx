import SectionCard from "./SectionCard";
import { ChefHat, Phone, MessageSquare, Mail } from "lucide-react";

export default function ContactSection({ profile, contactInfo, onChange }) {
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

        {/* Name */}
        <div>
          <label className="block mb-2 font-medium text-text-secondary">
            Chef Name
          </label>

          <div className="border border-surface-low rounded-xl px-4 py-4">
            <div className="flex items-center gap-3">
              <ChefHat size={18} className="text-text-secondary" />
              <input
                type="text"
                value={contactInfo.chefName}
                onChange={(event) => onChange("chefName", event.target.value)}
                className="w-full border-none bg-transparent outline-none text-text-primary"
                placeholder="Enter chef name"
              />
            </div>
          </div>
        </div>

        {/* Phone */}
        <div>
          <label className="block mb-2 font-medium text-text-secondary">
            Phone Number
          </label>

          <div className="border border-surface-low rounded-xl px-4 py-4">
            <div className="flex items-center gap-3">
              <Phone size={18} className="text-text-secondary" />
              <input
                type="tel"
                value={contactInfo.phone}
                onChange={(event) => onChange("phone", event.target.value)}
                className="w-full border-none bg-transparent outline-none text-text-primary"
                placeholder="Enter phone number"
              />
            </div>
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

            <span>{contactInfo.phone}</span>
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block mb-2 font-medium text-text-secondary">
            Email
          </label>

          <div
            className="
            border border-surface-low
            rounded-xl
            px-4 py-4
            flex items-center gap-3
            w-fit
            "
          >
            <Mail
              size={18}
              className="text-text-secondary"
            />

            <span>{profile.email}</span>
          </div>
        </div>

      </div>
    </SectionCard>
  );
}