"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import {
  Camera,
  ChevronDown,
  CloudUpload,
  Info,
  Lightbulb,
  Plus,
  Save,
  X,
} from "lucide-react";

const allergenOptions = [
  "Gluten Free",
  "Contains Nuts",
  "Vegetarian",
  "Dairy Free",
];

function FieldLabel({ children }) {
  return (
    <label className="mb-2 block text-sm font-semibold text-[#3b2d27]">
      {children}
    </label>
  );
}

function SecondaryPhotoSlot({ id, label, imageSrc, onFileSelect, onRemove }) {
  return (
    <div className="relative aspect-square min-h-24 w-full">
      <input
        id={id}
        type="file"
        accept="image/*"
        onChange={onFileSelect}
        className="hidden"
      />
      {imageSrc ? (
        <div className="group relative h-full w-full overflow-hidden rounded-xl border border-[#eee2dd]">
          <img
            src={imageSrc}
            alt={label}
            className="h-full w-full object-cover"
          />
          <button
            type="button"
            onClick={onRemove}
            className="absolute right-2 top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black/80"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <label
          htmlFor={id}
          aria-label={label}
          className="flex h-full w-full cursor-pointer items-center justify-center rounded-xl border border-dashed border-[#c78873] bg-[#fffdfb] text-[#964326] transition hover:bg-[#fff6f1]"
        >
          <span className="relative pointer-events-none">
            <Camera size={24} strokeWidth={1.8} />
            <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#964326] text-white">
              <Plus size={11} strokeWidth={2.4} />
            </span>
          </span>
        </label>
      )}
    </div>
  );
}

// Safe response parser — never throws on non-JSON bodies
async function parseResponse(response) {
  let raw = "";
  try {
    raw = await response.text();
  } catch {
    return {
      ok: false,
      status: response.status,
      data: null,
      errorMessage: `Could not read server response (status ${response.status})`,
    };
  }

  const trimmed = raw.trim();

  if (!trimmed) {
    return {
      ok: response.ok,
      status: response.status,
      data: {},
      errorMessage: response.ok
        ? null
        : `Server returned ${response.status} with no body`,
    };
  }

  if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
    try {
      const data = JSON.parse(trimmed);
      return {
        ok: response.ok,
        status: response.status,
        data,
        errorMessage: response.ok
          ? null
          : data?.message || `Request failed (${response.status})`,
      };
    } catch {
      return {
        ok: false,
        status: response.status,
        data: null,
        errorMessage: `Unexpected server response (${response.status})`,
      };
    }
  }

  const readable = trimmed
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 300);

  return {
    ok: false,
    status: response.status,
    data: null,
    errorMessage: readable || `Server error (${response.status})`,
  };
}

export default function CreatePage() {
  const { token, logout } = useAuth();
  const router = useRouter();

  const [mealName, setMealName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [ingredientInput, setIngredientInput] = useState("");
  const [allergens, setAllergens] = useState({
    "Gluten Free": false,
    "Contains Nuts": false,
    Vegetarian: false,
    "Dairy Free": false,
  });

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [mainImage, setMainImage] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [secondaryImages, setSecondaryImages] = useState({
    slot1: { file: null, preview: null },
    slot2: { file: null, preview: null },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        const response = await fetch(`${baseUrl}/categories/active`);
        const parsed = await parseResponse(response);
        if (parsed.ok && parsed.data?.success) {
          setCategories(parsed.data.data || []);
          if (parsed.data.data?.length > 0) {
            setSelectedCategory(parsed.data.data[0]._id);
          }
        }
      } catch {
      }
    }
    fetchCategories();
  }, []);

  const handleMainImageChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setMainImage(file);
      setMainImagePreview(URL.createObjectURL(file));
    }
  };

  const removeMainImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setMainImage(null);
    setMainImagePreview(null);
    const el = document.getElementById("main-image-upload");
    if (el) el.value = "";
  };

  const handleSecondaryImageChange = (slot, event) => {
    const file = event.target.files?.[0];
    if (file) {
      setSecondaryImages((prev) => ({
        ...prev,
        [slot]: { file, preview: URL.createObjectURL(file) },
      }));
    }
  };

  const removeSecondaryImage = (slot) => {
    setSecondaryImages((prev) => ({
      ...prev,
      [slot]: { file: null, preview: null },
    }));
    const el = document.getElementById(
      slot === "slot1" ? "secondary-1" : "secondary-2",
    );
    if (el) el.value = "";
  };

  const addIngredient = (value) => {
    const clean = value.trim().replace(/,$/, "");
    if (!clean || ingredients.includes(clean)) return;
    setIngredients((prev) => [...prev, clean]);
    setIngredientInput("");
  };

  const removeIngredient = (ingredient) =>
    setIngredients((prev) => prev.filter((i) => i !== ingredient));

  const handleIngredientKeyDown = (event) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      addIngredient(ingredientInput);
    }
  };

  const toggleAllergen = (option) =>
    setAllergens((prev) => ({ ...prev, [option]: !prev[option] }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError(null);

    if (!token) {
      setFormError("Authentication session missing. Please log in again.");
      return;
    }

    if (
      !mealName.trim() ||
      !description.trim() ||
      !price ||
      !selectedCategory
    ) {
      setFormError("Please fill out all required fields.");
      return;
    }

    try {
      setIsSubmitting(true);
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const formData = new FormData();

      formData.append("name", mealName.trim());
      formData.append("description", description.trim());
      formData.append("price", parseFloat(price));

      // API expects JSON-stringified arrays for these fields
      formData.append("categories", JSON.stringify([selectedCategory]));
      formData.append("ingredients", JSON.stringify(ingredients));

      const activeAllergens = Object.keys(allergens).filter(
        (k) => allergens[k],
      );
      formData.append("allergens", JSON.stringify(activeAllergens));

      if (mainImage) formData.append("mealImages", mainImage);
      if (secondaryImages.slot1.file)
        formData.append("mealImages", secondaryImages.slot1.file);
      if (secondaryImages.slot2.file)
        formData.append("mealImages", secondaryImages.slot2.file);

      const response = await fetch(`${baseUrl}/meals`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const parsed = await parseResponse(response);

      if (parsed.status === 401) {
        logout();
        return;
      }

      if (parsed.ok && parsed.data?.success) {
        router.push("/chef/meals");
        return;
      }

      throw new Error(parsed.errorMessage || "Failed to create meal listing.");
    } catch (err) {
      setFormError(err.message || "Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeCategoryLabel =
    categories.find((c) => c._id === selectedCategory)?.name ||
    "Select Category";

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-6xl space-y-6 p-4">
      <header>
        <nav className="flex items-center gap-2 text-sm font-medium">
          <Link
            href="/chef/meals"
            className="text-[#96837b] hover:text-[#964326]"
          >
            Meal Listings
          </Link>
          <span className="text-[#c7b7b0]">&gt;</span>
          <span className="text-[#964326]">Add New Meal</span>
        </nav>
        <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-[#1f1511] md:text-[42px]">
          Create New Culinary Masterpiece
        </h1>
        <p className="mt-2 text-sm text-[#7e6a63] md:text-base">
          Fill in the details below to list your home-cooked meal on the
          marketplace.
        </p>
      </header>

      {formError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
          {formError}
        </div>
      )}

      {/* Photography */}
      <section className="rounded-2xl border border-[#eee2dd] bg-white p-5 shadow-sm md:p-7">
        <div className="grid gap-5 lg:grid-cols-[1.85fr_1fr]">
          <label
            htmlFor="main-image-upload"
            className="relative block aspect-[3/2] min-h-72 w-full overflow-hidden rounded-2xl border-2 border-dashed border-[#b96a4d] bg-[#fffdfb] cursor-pointer"
          >
            <input
              id="main-image-upload"
              type="file"
              accept="image/*"
              onChange={handleMainImageChange}
              className="hidden"
            />
            {mainImagePreview ? (
              <div className="relative h-full w-full">
                <img
                  src={mainImagePreview}
                  alt="Main Dish Preview"
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  onClick={removeMainImage}
                  className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black/80"
                >
                  <X size={18} />
                </button>
              </div>
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center px-6 text-center transition hover:bg-[#fff7f2]">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f7e9e2] text-[#964326]">
                  <CloudUpload size={30} strokeWidth={1.8} />
                </span>
                <span className="mt-5 text-base font-extrabold text-[#2a1f1a]">
                  Click to upload main photo
                </span>
                <span className="mt-2 text-sm text-[#8a766f]">
                  High quality 3:2 landscape recommended
                </span>
              </div>
            )}
          </label>

          <div className="flex flex-col gap-4">
            <div className="rounded-2xl border border-[#f0dfd5] bg-[#fff3e9] p-5">
              <div className="flex gap-3">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#964326] shadow-sm">
                  <Lightbulb size={18} strokeWidth={1.8} />
                </span>
                <p className="text-sm font-semibold leading-6 text-[#5f463b]">
                  Tip: Natural lighting makes food look more appetizing!
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <SecondaryPhotoSlot
                id="secondary-1"
                label="Upload secondary meal photo 1"
                imageSrc={secondaryImages.slot1.preview}
                onFileSelect={(e) => handleSecondaryImageChange("slot1", e)}
                onRemove={() => removeSecondaryImage("slot1")}
              />
              <SecondaryPhotoSlot
                id="secondary-2"
                label="Upload secondary meal photo 2"
                imageSrc={secondaryImages.slot2.preview}
                onFileSelect={(e) => handleSecondaryImageChange("slot2", e)}
                onRemove={() => removeSecondaryImage("slot2")}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Core Details */}
      <section className="rounded-2xl border border-[#eee2dd] bg-white p-5 shadow-sm md:p-7">
        <div className="grid gap-7 lg:grid-cols-2">
          <div>
            <FieldLabel>Meal Name *</FieldLabel>
            <input
              type="text"
              required
              value={mealName}
              onChange={(e) => setMealName(e.target.value)}
              placeholder="e.g. Traditional Saudi Kabsa"
              className="h-12 w-full rounded-xl border border-[#eaded8] bg-white px-4 text-sm text-[#2f221d] outline-none transition placeholder:text-[#b0a09a] focus:border-[#964326] focus:ring-4 focus:ring-[#964326]/10"
            />
            <div className="mt-5">
              <FieldLabel>Description *</FieldLabel>
              <textarea
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell the story behind this dish, its flavors, and special ingredients..."
                rows={6}
                className="min-h-40 w-full resize-none rounded-xl border border-[#eaded8] bg-white px-4 py-3 text-sm leading-6 text-[#2f221d] outline-none transition placeholder:text-[#b0a09a] focus:border-[#964326] focus:ring-4 focus:ring-[#964326]/10"
              />
            </div>
          </div>

          <div>
            <FieldLabel>Price (EGP) *</FieldLabel>
            <div className="flex h-12 overflow-hidden rounded-xl border border-[#eaded8] bg-white transition focus-within:border-[#964326] focus-within:ring-4 focus-within:ring-[#964326]/10">
              <span className="flex items-center border-r border-[#eaded8] bg-[#fbf6f3] px-4 text-sm font-extrabold text-[#964326]">
                EGP
              </span>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                className="min-w-0 flex-1 px-4 text-sm text-[#2f221d] outline-none placeholder:text-[#b0a09a]"
              />
            </div>

            <div className="mt-5 relative">
              <FieldLabel>Category *</FieldLabel>
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex h-12 w-full items-center justify-between rounded-xl border border-[#eaded8] bg-white px-4 text-left text-sm font-semibold text-[#2f221d] transition hover:bg-[#fffaf7] focus:border-[#964326] focus:outline-none focus:ring-4 focus:ring-[#964326]/10"
              >
                <span>{activeCategoryLabel}</span>
                <ChevronDown size={18} className="text-[#8b766f]" />
              </button>
              {dropdownOpen && (
                <div className="absolute left-0 z-20 mt-1 max-h-60 w-full overflow-y-auto rounded-xl border border-[#eaded8] bg-white shadow-lg py-1">
                  {categories.length === 0 ? (
                    <div className="px-4 py-2 text-sm text-gray-500">
                      No categories loaded.
                    </div>
                  ) : (
                    categories.map((cat) => (
                      <button
                        key={cat._id}
                        type="button"
                        onClick={() => {
                          setSelectedCategory(cat._id);
                          setDropdownOpen(false);
                        }}
                        className="block w-full px-4 py-2 text-left text-sm text-[#2f221d] hover:bg-[#fff6f1] hover:text-[#964326] font-medium"
                      >
                        {cat.name}
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            <div className="mt-5 flex items-start gap-3 rounded-xl border border-[#f0dfd5] bg-[#fff7ef] p-4 text-sm text-[#6f554a]">
              <Info
                size={17}
                className="mt-0.5 shrink-0 text-[#964326]"
                strokeWidth={2}
              />
              <p>
                Verify pricing guidelines correctly before publishing items to
                active delivery routes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Ingredients & Allergens */}
      <section className="rounded-2xl border border-[#eee2dd] bg-white p-5 shadow-sm md:p-7">
        <div className="grid gap-7 lg:grid-cols-2">
          <div>
            <FieldLabel>Ingredients (Separated by comma or Enter)</FieldLabel>
            <div className="flex min-h-12 flex-wrap items-center gap-2 rounded-xl border border-[#eaded8] bg-white px-3 py-2 transition focus-within:border-[#964326] focus-within:ring-4 focus-within:ring-[#964326]/10">
              {ingredients.map((ingredient) => (
                <span
                  key={ingredient}
                  className="inline-flex items-center gap-2 rounded-full border border-[#e4c9bd] bg-[#fff4ef] px-3 py-1.5 text-sm font-semibold text-[#5d4035]"
                >
                  {ingredient}
                  <button
                    type="button"
                    onClick={() => removeIngredient(ingredient)}
                    aria-label={`Remove ${ingredient}`}
                    className="text-[#9b6d5d] transition hover:text-[#964326]"
                  >
                    <X size={13} strokeWidth={2.4} />
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={ingredientInput}
                onChange={(e) => setIngredientInput(e.target.value)}
                onBlur={() => addIngredient(ingredientInput)}
                onKeyDown={handleIngredientKeyDown}
                placeholder="Add ingredient..."
                className="h-8 min-w-40 flex-1 bg-transparent text-sm text-[#2f221d] outline-none placeholder:text-[#b0a09a]"
              />
            </div>
          </div>

          <div>
            <FieldLabel>Dietary &amp; Allergens</FieldLabel>
            <div className="grid gap-3 sm:grid-cols-2">
              {allergenOptions.map((option) => (
                <label
                  key={option}
                  className="flex h-12 cursor-pointer items-center gap-3 rounded-xl border border-[#eaded8] bg-white px-4 text-sm font-medium text-[#3c302b] transition hover:border-[#c78873] hover:bg-[#fffaf7]"
                >
                  <input
                    type="checkbox"
                    checked={allergens[option]}
                    onChange={() => toggleAllergen(option)}
                    className="h-4 w-4 rounded border-[#cdb9b0] accent-[#964326]"
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="flex justify-end gap-4 pt-2">
        <Link
          href="/chef/meals"
          className="rounded-full px-5 py-3 text-sm font-semibold text-[#7e6a63] transition hover:bg-[#f4ece8] hover:text-[#2f221d]"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 rounded-full bg-[#964326] px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#7f3920] disabled:bg-[#c78873] disabled:cursor-not-allowed"
        >
          <Save size={17} strokeWidth={2} />
          {isSubmitting ? "Listing Meal..." : "List My Meal"}
        </button>
      </footer>
    </form>
  );
}
