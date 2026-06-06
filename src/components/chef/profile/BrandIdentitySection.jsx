import SectionCard from "./SectionCard";
import { Palette } from "lucide-react";

export default function BrandIdentitySection({
  profile,
}) {
  return (
    <SectionCard>
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-orange-100 p-3 rounded-xl">
          <Palette className="text-primary" />
        </div>

        <h2 className="text-4xl font-bold">
          Brand Identity
        </h2>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">

        <div>
          <label className="block mb-3 text-text-secondary font-medium">
            Kitchen Logo / Avatar
          </label>

          <img
            src={profile.logo}
            alt=""
            className="
              w-full
              h-[260px]
              object-cover
              rounded-3xl
            "
          />

          <p className="text-center mt-3 text-sm text-text-secondary">
            Click to change image
          </p>
        </div>

        <div className="lg:col-span-2 space-y-6">

          <Field
            label="Kitchen Name"
            value={profile.name}
          />

          <Field
            label="Kitchen Slogan"
            value={profile.slogan}
          />

          <TextAreaField
            label="Brand Bio"
            value={profile.bio}
          />
        </div>
      </div>
    </SectionCard>
  );
}

function Field({ label, value }) {
  return (
    <div>
      <label className="block mb-2 font-medium text-text-secondary">
        {label}
      </label>

      <input
        value={value}
        readOnly
        className="
          w-full
          border
          border-surface-low
          rounded-xl
          px-4
          py-4
        "
      />
    </div>
  );
}

function TextAreaField({
  label,
  value,
}) {
  return (
    <div>
      <label className="block mb-2 font-medium text-text-secondary">
        {label}
      </label>

      <textarea
        value={value}
        readOnly
        rows={5}
        className="
          w-full
          border
          border-surface-low
          rounded-xl
          p-4
          resize-none
        "
      />
    </div>
  );
}