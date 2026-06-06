import ProfileHeader from "@/components/chef/profile/ProfileHeader";
import BrandIdentitySection from "@/components/chef/profile/BrandIdentitySection";
import KitchenSettingsSection from "@/components/chef/profile/KitchenSettingsSection";
import ContactSection from "@/components/chef/profile/ContactSection";
import ProfileFooter from "@/components/chef/profile/ProfileFooter";

export default function KitchenProfilePage() {
  // TODO: replace with backend data

  const profile = {
    name: "The Saffron Spoon",
    slogan: "Authentic flavors from our home to yours",
    bio: `With over 15 years of family tradition, The Saffron Spoon
specializes in authentic Levantine cuisine. Every dish is prepared daily
using locally sourced organic ingredients and time-honored recipes passed
down through generations.`,

    cuisine: "Middle Eastern",

    specialties: [
      "Organic",
      "Gluten-Free",
      "Levantine"
    ],

    phone: "+971 50 123 4567",
    instagram: "@thesaffronspoon_ae",

    address: "Dubai Marina, Building 4, Unit 202",

    logo:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836",

    mapImage:
      "https://images.unsplash.com/photo-1524661135-423995f22d0b",
  };

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-8 py-2">

        <ProfileHeader />

        <div className="space-y-8 mt-8">
          <BrandIdentitySection profile={profile} />
          <KitchenSettingsSection profile={profile} />
          <ContactSection profile={profile} />
        </div>
      </div>

      <ProfileFooter />
    </div>
  );
}