"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProfileHeader from "@/components/chef/profile/ProfileHeader";
import BrandIdentitySection from "@/components/chef/profile/BrandIdentitySection";
import ContactSection from "@/components/chef/profile/ContactSection";
import ProfileFooter from "@/components/chef/profile/ProfileFooter";
import { profileService } from "@/services";

const profile = {
  name: "The Saffron Spoon",
  slogan: "Authentic flavors from our home to yours",
  bio: `With over 15 years of family tradition, The Saffron Spoon
specializes in authentic Levantine cuisine. Every dish is prepared daily
using locally sourced organic ingredients and time-honored recipes passed
down through generations.`,

  cuisine: "Middle Eastern",

  specialties: ["Organic", "Gluten-Free", "Levantine"],

  phone: "+971 50 123 4567",
  instagram: "@thesaffronspoon_ae",

  address: "Dubai Marina, Building 4, Unit 202",

  logo: "https://images.unsplash.com/photo-1504674900247-0877df9cc836",

  mapImage: "https://images.unsplash.com/photo-1524661135-423995f22d0b",
};

export default function KitchenProfilePage() {
  const router = useRouter();
  const [brandIdentity, setBrandIdentity] = useState({
    name: profile.name,
    slogan: profile.slogan,
    bio: profile.bio,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const sessionBrand =
      typeof window !== "undefined"
        ? window.sessionStorage.getItem("brandingResponse")
        : null;

    const parsedBrand = sessionBrand ? JSON.parse(sessionBrand) : null;

    if (parsedBrand) {
      setBrandIdentity({
        name: parsedBrand.kitchenName || profile.name,
        slogan: parsedBrand.slogan || profile.slogan,
        bio: parsedBrand.description || profile.bio,
      });
    }
  }, []);

  const handleChange = (field, value) => {
    setBrandIdentity((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveChanges = async () => {
    setSaving(true);
    setError("");

    try {
      await profileService.updateProfile({
        kitchenName: brandIdentity.name,
        slogan: brandIdentity.slogan,
        description: brandIdentity.bio,
      });

      router.push("/chef/dashboard");
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Unable to save changes. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDiscard = () => {
    setBrandIdentity({
      name: profile.name,
      slogan: profile.slogan,
      bio: profile.bio,
    });
  };

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-8 py-2">

        <ProfileHeader />

        <div className="space-y-8 mt-8">
          <BrandIdentitySection
            profile={profile}
            brandIdentity={brandIdentity}
            onChange={handleChange}
          />
          {/* <KitchenSettingsSection profile={profile} /> */}
          <ContactSection profile={profile} />
        </div>
      </div>

      <ProfileFooter
        onDiscard={handleDiscard}
        onSave={handleSaveChanges}
        saving={saving}
      />

      {error && (
        <div className="max-w-7xl mx-auto px-8 py-4 text-sm text-red-600">
          {error}
        </div>
      )}
    </div>
  );
}
