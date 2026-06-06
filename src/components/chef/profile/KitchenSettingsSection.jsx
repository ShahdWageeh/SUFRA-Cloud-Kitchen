import SectionCard from "./SectionCard";
import { Settings, MapPin, Pencil } from "lucide-react";

export default function KitchenSettingsSection({
  profile,
}) {
  return (
    <SectionCard>

      <div className="flex items-center gap-4 mb-8">
        <div className="bg-cyan-100 p-3 rounded-xl">
          <Settings className="text-cyan-700" />
        </div>

        <h2 className="text-4xl font-bold">
          Kitchen Settings
        </h2>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">

        <div>
          <label className="block mb-2 text-text-secondary">
            Primary Cuisine
          </label>

          <select
            className="
              w-full
              border
              border-surface-low
              rounded-xl
              px-4
              py-4
            "
          >
            <option>
              {profile.cuisine}
            </option>
          </select>

          <div className="mt-10">
            <h3 className="font-medium mb-4">
              Operating Hours
            </h3>

            <div className="space-y-3 text-lg">
              <div className="flex justify-between">
                <span>Mon - Fri</span>
                <span>09:00 AM - 08:00 PM</span>
              </div>

              <div className="flex justify-between">
                <span>Sat - Sun</span>
                <span>11:00 AM - 10:00 PM</span>
              </div>
            </div>

            <button className="mt-4 text-primary flex gap-2 items-center">
              <Pencil size={18} />Edit Schedule
            </button>
          </div>
        </div>

        <div>
          <label className="block mb-2 text-text-secondary">
            Specialties
          </label>

          <div className="border border-surface-low rounded-xl p-4">
            <div className="flex flex-wrap gap-2">
              {profile.specialties.map(
                (item) => (
                  <span
                    key={item}
                    className="
                    bg-orange-100
                    text-primary
                    px-3
                    py-1
                    rounded-full
                    text-sm
                  "
                  >
                    {item}
                  </span>
                )
              )}
            </div>
          </div>

          <div className="mt-8">
            <label className="block mb-2 text-text-secondary">
              Pickup Location
            </label>

            <div
              className="
              border
              border-surface-low
              rounded-xl
              p-4
              flex items-center gap-3
            "
            >
              <MapPin />
              {profile.address}
            </div>

            <img
              src={profile.mapImage}
              alt=""
              className="
                mt-4
                h-[180px]
                w-full
                object-cover
                rounded-xl
              "
            />
          </div>
        </div>
      </div>
    </SectionCard>
  );
}