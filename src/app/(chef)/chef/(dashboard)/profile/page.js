"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import ProfileHeader from "@/components/chef/profile/ProfileHeader";
import BrandIdentitySection from "@/components/chef/profile/BrandIdentitySection";
import ContactSection from "@/components/chef/profile/ContactSection";
import ProfileFooter from "@/components/chef/profile/ProfileFooter";
import { profileService } from "@/services";

export default function KitchenProfilePage() {
  const router = useRouter();
  const { user } = useAuth();
  console.log(user);
  const [profile, setProfile] = useState({});
  const [brandIdentity, setBrandIdentity] = useState({
    name: "",
    slogan: "",
    bio: "",
  });
  const [contactInfo, setContactInfo] = useState({
    chefName: "",
    phone: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProfile() {
      if (!user?._id) {
        setError("Unable to load profile data for the logged in user.");
        return;
      }

      try {
        const result = await profileService.getProfile(user._id);
        const chef = result.data;

        setProfile(chef);

        let draft = null;
        if (typeof window !== "undefined") {
          const rawDraft = window.sessionStorage.getItem("brandIdentityDraft");
          if (rawDraft) {
            try {
              draft = JSON.parse(rawDraft);
            } catch (err) {
              draft = null;
            }
          }
        }

        setBrandIdentity({
          name: draft?.name ?? chef.kitchenName ?? "",
          slogan: draft?.slogan ?? chef.slogan ?? "",
          bio: draft?.bio ?? chef.description ?? "",
        });
        setContactInfo({
          chefName: `${chef.firstName || ""} ${chef.lastName || ""}`.trim(),
          phone: chef.phone || "",
        });
      } catch (err) {
        setError(
          err?.response?.data?.message ||
            "Unable to load profile data. Please refresh the page.",
        );
      }
    }

    loadProfile();
  }, [user]);

  const handleBrandChange = (field, value) => {
    setBrandIdentity((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleContactChange = (field, value) => {
    setContactInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveChanges = async () => {
    setSaving(true);
    setError("");

    try {
      const fullName = contactInfo.chefName.trim();
      const [firstName, ...rest] = fullName.split(" ");
      const lastName = rest.join(" ");

      await profileService.updateProfile({
        kitchenName: brandIdentity.name,
        slogan: brandIdentity.slogan,
        description: brandIdentity.bio,
        firstName: firstName || "",
        lastName: lastName || "",
        phone: contactInfo.phone,
      });

      if (typeof window !== "undefined") {
        window.sessionStorage.removeItem("brandIdentityDraft");
      }

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
    if (typeof window !== "undefined") {
      window.sessionStorage.removeItem("brandIdentityDraft");
    }

    setBrandIdentity({
      name: profile.kitchenName || "",
      slogan: profile.slogan || "",
      bio: profile.description || "",
    });
    setContactInfo({
      chefName: `${profile.firstName || ""} ${profile.lastName || ""}`.trim(),
      phone: profile.phone || "",
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
            onChange={handleBrandChange}
          />
          {/* <KitchenSettingsSection profile={profile} /> */}
          <ContactSection
            profile={profile}
            contactInfo={contactInfo}
            onChange={handleContactChange}
          />
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
