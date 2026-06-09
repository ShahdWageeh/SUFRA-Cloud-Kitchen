"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import {
  Camera,
  ChevronDown,
  CloudUpload,
  Info,
  Lightbulb,
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
          </span>
        </label>
      )}
    </div>
  );
}

export default function EditPage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const mealId = params.mealId;

  const { token, logout } = useAuth();
  const router = useRouter();

  // Core Form State
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

  // Category Configuration
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Image Handles
  const [mainImage, setMainImage] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [secondaryImages, setSecondaryImages] = useState({
    slot1: { file: null, preview: null, isExisting: false },
    slot2: { file: null, preview: null, isExisting: false },
  });

  // UI Processing States
  const [pageLoading, setPageLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  // Load category types and individual meal data on mount
  useEffect(() => {
    async function loadMealAndCategories() {
      try {
        setPageLoading(true);
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

        const catRes = await fetch(`${baseUrl}/categories`);
        const catResult = await catRes.json();
        let currentCategories = [];
        if (catRes.ok && catResult.success) {
          setCategories(catResult.data || []);
          currentCategories = catResult.data || [];
        }

        const mealRes = await fetch(`${baseUrl}/meals/${mealId}`);
        const mealResult = await mealRes.json();

        if (mealRes.ok && mealResult.success) {
          const meal = mealResult.data;

          setMealName(meal.name || "");
          setDescription(meal.description || "");
          setPrice(meal.price || "");
          setIngredients(meal.ingredients || []);

          // Map category object ID cleanly
          if (meal.category) {
            setSelectedCategory(meal.category._id || meal.category);
          } else if (currentCategories.length > 0) {
            setSelectedCategory(currentCategories[0]._id);
          }

          // Map existing allergen checkboxes
          if (meal.allergens) {
            setAllergens({
              "Gluten Free": meal.allergens.includes("Gluten Free"),
              "Contains Nuts": meal.allergens.includes("Contains Nuts"),
              Vegetarian: meal.allergens.includes("Vegetarian"),
              "Dairy Free": meal.allergens.includes("Dairy Free"),
            });
          }

          const serverImages = meal.mealImages || [];
          if (serverImages[0]) {
            setMainImagePreview(serverImages[0]);
          }
          if (serverImages[1]) {
            setSecondaryImages((prev) => ({
              ...prev,
              slot1: { file: null, preview: serverImages[1], isExisting: true },
            }));
          }
          if (serverImages[2]) {
            setSecondaryImages((prev) => ({
              ...prev,
              slot2: { file: null, preview: serverImages[2], isExisting: true },
            }));
          }
        } else {
          throw new Error(
            mealResult.message ||
              "Could not retrieve the requested meal details.",
          );
        }
      } catch (err) {
        console.error("Initialization Failed:", err);
        setFormError(err.message);
      } finally {
        setPageLoading(false);
      }
    }

    if (mealId) loadMealAndCategories();
  }, [mealId]);

  // Image Processing Helpers
  const handleMainImageChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setMainImage(file);
      setMainImagePreview(URL.createObjectURL(file));
    }
  };

  const removeMainImage = (e) => {
    e.preventDefault();
    setMainImage(null);
    setMainImagePreview(null);
  };

  const handleSecondaryImageChange = (slot, event) => {
    const file = event.target.files?.[0];
    if (file) {
      setSecondaryImages((prev) => ({
        ...prev,
        [slot]: { file, preview: URL.createObjectURL(file), isExisting: false },
      }));
    }
  };

  const removeSecondaryImage = (slot) => {
    setSecondaryImages((prev) => ({
      ...prev,
      [slot]: { file: null, preview: null, isExisting: false },
    }));
  };

  // Ingredient Helpers
  const addIngredient = (value) => {
    const clean = value.trim().replace(/,$/, "");
    if (!clean || ingredients.includes(clean)) return;
    setIngredients((prev) => [...prev, clean]);
    setIngredientInput("");
  };

  const removeIngredient = (target) => {
    setIngredients((prev) => prev.filter((i) => i !== target));
  };

  // Submit modifications via PUT endpoint
  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError(null);

    if (!token) {
      setFormError("Session validation failed. Please log in.");
      return;
    }

    try {
      setIsSubmitting(true);
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const formData = new FormData();

      formData.append("name", mealName.trim());
      formData.append("description", description.trim());
      formData.append("price", parseFloat(price));
      formData.append("category", selectedCategory);

      ingredients.forEach((ing) => formData.append("ingredients", ing));

      Object.keys(allergens)
        .filter((key) => allergens[key])
        .forEach((all) => formData.append("allergens", all));

      if (mainImage) {
        formData.append("mealImages", mainImage);
      } else if (mainImagePreview) {
        formData.append("existingImages", mainImagePreview);
      }

      if (secondaryImages.slot1.file) {
        formData.append("mealImages", secondaryImages.slot1.file);
      } else if (
        secondaryImages.slot1.preview &&
        secondaryImages.slot1.isExisting
      ) {
        formData.append("existingImages", secondaryImages.slot1.preview);
      }

      if (secondaryImages.slot2.file) {
        formData.append("mealImages", secondaryImages.slot2.file);
      } else if (
        secondaryImages.slot2.preview &&
        secondaryImages.slot2.isExisting
      ) {
        formData.append("existingImages", secondaryImages.slot2.preview);
      }

      const response = await fetch(`${baseUrl}/meals/${mealId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (response.status === 401) {
        logout();
        return;
      }

      if (response.ok && result.success) {
        router.push("/chef/meals");
      } else {
        throw new Error(result.message || "Failed to save menu changes.");
      }
    } catch (err) {
      console.error("Form transmission failed:", err);
      setFormError(err.message || "Network exception encountered.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeCategoryLabel =
    categories.find((c) => c._id === selectedCategory)?.name ||
    "Select Category";

  if (pageLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-lg font-medium text-[#7A6560] animate-pulse">
          Loading recipe configurations...
        </p>
      </div>
    );
  }

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
          <span className="text-[#964326]">Modify Menu Item</span>
        </nav>
        <h1 className="mt-4 text-3xl font-extrabold text-[#1f1511] md:text-[42px]">
          Edit Your Recipe
        </h1>
      </header>

      {formError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
          {formError}
        </div>
      )}

      {/* Visual Media Section */}
      <section className="rounded-2xl border border-[#eee2dd] bg-white p-5 shadow-sm md:p-7">
        <div className="grid gap-5 lg:grid-cols-[1.85fr_1fr]">
          <label
            htmlFor="edit-main-upload"
            className="relative block aspect-[3/2] min-h-72 w-full overflow-hidden rounded-2xl border-2 border-dashed border-[#b96a4d] bg-[#fffdfb] cursor-pointer"
          >
            <input
              id="edit-main-upload"
              type="file"
              accept="image/*"
              onChange={handleMainImageChange}
              className="hidden"
            />
            {mainImagePreview ? (
              <div className="relative h-full w-full">
                <img
                  src={mainImagePreview}
                  alt="Main dish display"
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  onClick={removeMainImage}
                  className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white"
                >
                  <X size={18} />
                </button>
              </div>
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center text-[#8a766f]">
                <CloudUpload size={30} />
                <span className="mt-2 font-bold">Replace Main Photo</span>
              </div>
            )}
          </label>

          <div className="flex flex-col gap-4">
            <div className="rounded-2xl border border-[#f0dfd5] bg-[#fff3e9] p-5 flex gap-3 text-sm font-semibold text-[#5f463b]">
              <Lightbulb className="text-[#964326]" />
              Natural lighting makes your food look most appealing!
            </div>
            <div className="grid grid-cols-2 gap-4">
              <SecondaryPhotoSlot
                id="sec-1"
                label="Slot 1"
                imageSrc={secondaryImages.slot1.preview}
                onFileSelect={(e) => handleSecondaryImageChange("slot1", e)}
                onRemove={() => removeSecondaryImage("slot1")}
              />
              <SecondaryPhotoSlot
                id="sec-2"
                label="Slot 2"
                imageSrc={secondaryImages.slot2.preview}
                onFileSelect={(e) => handleSecondaryImageChange("slot2", e)}
                onRemove={() => removeSecondaryImage("slot2")}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Core Meta Details Card */}
      <section className="rounded-2xl border border-[#eee2dd] bg-white p-5 shadow-sm md:p-7">
        <div className="grid gap-7 lg:grid-cols-2">
          <div>
            <FieldLabel>Meal Name *</FieldLabel>
            <input
              type="text"
              required
              value={mealName}
              onChange={(e) => setMealName(e.target.value)}
              className="h-12 w-full rounded-xl border border-[#eaded8] px-4 text-sm outline-none focus:border-[#964326]"
            />
            <div className="mt-5">
              <FieldLabel>Description *</FieldLabel>
              <textarea
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
                className="w-full rounded-xl border border-[#eaded8] p-4 text-sm outline-none focus:border-[#964326] resize-none"
              />
            </div>
          </div>

          <div>
            <FieldLabel>Price (EGP) *</FieldLabel>
            <div className="flex h-12 rounded-xl border border-[#eaded8] overflow-hidden focus-within:border-[#964326]">
              <span className="flex items-center bg-[#fbf6f3] px-4 text-sm font-extrabold text-[#964326] border-r border-[#eaded8]">
                EGP
              </span>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="flex-1 px-4 text-sm outline-none"
              />
            </div>

            <div className="mt-5 relative">
              <FieldLabel>Category *</FieldLabel>
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex h-12 w-full items-center justify-between rounded-xl border border-[#eaded8] bg-white px-4 text-sm font-semibold text-[#2f221d]"
              >
                <span>{activeCategoryLabel}</span>
                <ChevronDown size={18} />
              </button>
              {dropdownOpen && (
                <div className="absolute left-0 z-20 mt-1 max-h-60 w-full overflow-y-auto rounded-xl border border-[#eaded8] bg-white shadow-lg py-1">
                  {categories.map((cat) => (
                    <button
                      key={cat._id}
                      type="button"
                      onClick={() => {
                        setSelectedCategory(cat._id);
                        setDropdownOpen(false);
                      }}
                      className="block w-full px-4 py-2 text-left text-sm hover:bg-[#fff6f1] hover:text-[#964326] font-medium"
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="mt-5 flex gap-3 rounded-xl bg-[#fff7ef] p-4 text-sm text-[#6f554a] border border-[#f0dfd5]">
              <Info className="text-[#964326] shrink-0" />
              Updating parameters takes effect immediately on buyer dashboards.
            </div>
          </div>
        </div>
      </section>

      {/* Ingredients Section */}
      <section className="rounded-2xl border border-[#eee2dd] bg-white p-5 shadow-sm md:p-7">
        <div className="grid gap-7 lg:grid-cols-2">
          <div>
            <FieldLabel>Ingredients</FieldLabel>
            <div className="flex min-h-12 flex-wrap items-center gap-2 rounded-xl border border-[#eaded8] bg-white px-3 py-2 focus-within:border-[#964326]">
              {ingredients.map((ing) => (
                <span
                  key={ing}
                  className="inline-flex items-center gap-2 rounded-full bg-[#fff4ef] px-3 py-1.5 text-sm font-semibold text-[#5d4035] border border-[#e4c9bd]"
                >
                  {ing}
                  <button type="button" onClick={() => removeIngredient(ing)}>
                    <X size={13} />
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={ingredientInput}
                onChange={(e) => setIngredientInput(e.target.value)}
                onBlur={() => addIngredient(ingredientInput)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === ",") {
                    e.preventDefault();
                    addIngredient(ingredientInput);
                  }
                }}
                placeholder="Add item..."
                className="h-8 min-w-40 flex-1 bg-transparent text-sm outline-none"
              />
            </div>
          </div>

          <div>
            <FieldLabel>Dietary Specs</FieldLabel>
            <div className="grid gap-3 sm:grid-cols-2">
              {allergenOptions.map((option) => (
                <label
                  key={option}
                  className="flex h-12 cursor-pointer items-center gap-3 rounded-xl border border-[#eaded8] bg-white px-4 text-sm font-medium hover:bg-[#fffaf7]"
                >
                  <input
                    type="checkbox"
                    checked={allergens[option]}
                    onChange={() =>
                      setAllergens((p) => ({ ...p, [option]: !p[option] }))
                    }
                    className="accent-[#964326] h-4 w-4"
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Submission Actions Footer */}
      <footer className="flex justify-end gap-4 pt-2">
        <Link
          href="/chef/meals"
          className="rounded-full px-5 py-3 text-sm font-semibold text-[#7e6a63] hover:bg-[#f4ece8]"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 rounded-full bg-[#964326] px-6 py-3 text-sm font-bold text-white transition disabled:bg-[#c78873]"
        >
          <Save size={17} />
          {isSubmitting ? "Saving Changes..." : "Save Modifications"}
        </button>
      </footer>
    </form>
  );
}
