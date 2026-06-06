"use client";

import { useState } from "react";
import Link from "next/link";
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

const initialIngredients = ["Basmati Rice", "Saffron"];
const categoryOptions = [
  "Main Dish",
  "Appetizer",
  "Dessert",
  "Soup & Salad",
  "Bakery",
  "Beverage",
];

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

export default function CreatePage() {
  const [mealName, setMealName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Main Dish");
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [ingredients, setIngredients] = useState(initialIngredients);
  const [ingredientInput, setIngredientInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Kept for UI selection state
  const [allergens, setAllergens] = useState({
    "Gluten Free": false,
    "Contains Nuts": false,
    Vegetarian: false,
    "Dairy Free": false,
  });

  // Image Upload States
  const [mainImage, setMainImage] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [secondaryImages, setSecondaryImages] = useState({
    slot1: { file: null, preview: null },
    slot2: { file: null, preview: null },
  });

  // Image Event Handlers
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
    const inputElement = document.getElementById("main-image-upload");
    if (inputElement) inputElement.value = "";
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
    const inputElement = document.getElementById(
      slot === "slot1" ? "secondary-1" : "secondary-2",
    );
    if (inputElement) inputElement.value = "";
  };

  // Ingredient Handling Logic
  const addIngredient = (value) => {
    const nextIngredient = value.trim().replace(/,$/, "");
    if (!nextIngredient || ingredients.includes(nextIngredient)) return;
    setIngredients((currentIngredients) => [
      ...currentIngredients,
      nextIngredient,
    ]);
    setIngredientInput("");
  };

  const removeIngredient = (ingredient) => {
    setIngredients((currentIngredients) =>
      currentIngredients.filter((item) => item !== ingredient),
    );
  };

  const handleIngredientKeyDown = (event) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      addIngredient(ingredientInput);
    }
  };

  const toggleAllergen = (option) => {
    setAllergens((currentAllergens) => ({
      ...currentAllergens,
      [option]: !currentAllergens[option],
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validations based on backend constraints
    if (!mealName.trim()) {
      alert("Meal name is required");
      return;
    }

    if (!description.trim()) {
      alert("Description is required");
      return;
    }

    if (!price) {
      alert("Price is required");
      return;
    }

    if (!mainImage) {
      alert("Please upload at least a main meal image");
      return;
    }

    try {
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append("name", mealName.trim());
      formData.append("description", description.trim());
      formData.append("price", price);
      formData.append("category", category);

      // Pass ingredients array as a valid backend JSON Array string
      if (ingredients.length > 0) {
        formData.append("ingredients", JSON.stringify(ingredients));
      }

      // Append primary image matching key parameter 'mealImages'
      formData.append("mealImages", mainImage);

      // Append optional structural secondary images into array payload parameter
      if (secondaryImages.slot1.file) {
        formData.append("mealImages", secondaryImages.slot1.file);
      }
      if (secondaryImages.slot2.file) {
        formData.append("mealImages", secondaryImages.slot2.file);
      }

      // Retrieve secure authentication bearer token from localStorage
      const token = localStorage.getItem("token");

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/meals`, {
        method: "POST",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to create meal");
      }

      alert("Meal created successfully!");
    } catch (error) {
      console.error(error);
      alert(error.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-6xl space-y-6 p-4">
      <header>
        <nav className="flex items-center gap-2 text-sm font-medium">
          <span className="text-[#96837b]">Meal Listings</span>
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

      {/* Section 1: Photography Card */}
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

      {/* Section 2: Core Details Card */}
      <section className="rounded-2xl border border-[#eee2dd] bg-white p-5 shadow-sm md:p-7">
        <div className="grid gap-7 lg:grid-cols-2">
          <div>
            <FieldLabel>Meal Name</FieldLabel>
            <input
              type="text"
              value={mealName}
              onChange={(event) => setMealName(event.target.value)}
              placeholder="e.g. Traditional Saudi Kabsa"
              className="h-12 w-full rounded-xl border border-[#eaded8] bg-white px-4 text-sm text-[#2f221d] outline-none transition placeholder:text-[#b0a09a] focus:border-[#964326] focus:ring-4 focus:ring-[#964326]/10"
            />

            <div className="mt-5">
              <FieldLabel>Description</FieldLabel>
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Tell the story behind this dish, its flavors, and special ingredients..."
                rows={6}
                className="min-h-40 w-full resize-none rounded-xl border border-[#eaded8] bg-white px-4 py-3 text-sm leading-6 text-[#2f221d] outline-none transition placeholder:text-[#b0a09a] focus:border-[#964326] focus:ring-4 focus:ring-[#964326]/10"
              />
            </div>
          </div>

          <div>
            <FieldLabel>Price (EGP)</FieldLabel>
            <div className="flex h-12 overflow-hidden rounded-xl border border-[#eaded8] bg-white transition focus-within:border-[#964326] focus-within:ring-4 focus-within:ring-[#964326]/10">
              <span className="flex items-center border-r border-[#eaded8] bg-[#fbf6f3] px-4 text-sm font-extrabold text-[#964326]">
                EGP
              </span>

              <input
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                placeholder="0.00"
                className="min-w-0 flex-1 px-4 text-sm text-[#2f221d] outline-none placeholder:text-[#b0a09a]"
              />
            </div>

            {/* Custom Enhanced Dropdown Field */}
            <div className="mt-5">
              <FieldLabel>Category</FieldLabel>
              <div className="relative">
                <button
                  type="button"
                  onClick={() =>
                    setIsCategoryDropdownOpen(!isCategoryDropdownOpen)
                  }
                  aria-expanded={isCategoryDropdownOpen}
                  className={`flex h-12 w-full items-center justify-between rounded-xl border bg-white px-4 text-left text-sm font-semibold text-[#2f221d] transition-all duration-200 outline-none hover:bg-[#fffaf7] ${
                    isCategoryDropdownOpen
                      ? "border-[#964326] ring-4 ring-[#964326]/10"
                      : "border-[#eaded8]"
                  }`}
                >
                  <span>{category}</span>
                  <ChevronDown
                    size={18}
                    className={`text-[#8b766f] transition-transform duration-200 ${
                      isCategoryDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isCategoryDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setIsCategoryDropdownOpen(false)}
                    />
                    <ul className="absolute left-0 right-0 top-[calc(100%+4px)] z-20 max-h-60 overflow-y-auto rounded-xl border border-[#eee2dd] bg-white py-1.5 shadow-lg animate-in fade-in slide-in-from-top-2 duration-150">
                      {categoryOptions.map((option) => (
                        <li key={option}>
                          <button
                            type="button"
                            onClick={() => {
                              setCategory(option);
                              setIsCategoryDropdownOpen(false);
                            }}
                            className={`flex h-10 w-full items-center px-4 text-left text-sm font-medium transition-colors ${
                              category === option
                                ? "bg-[#fff4ef] font-semibold text-[#964326]"
                                : "text-[#3c302b] hover:bg-[#fffaf7] hover:text-[#964326]"
                            }`}
                          >
                            {option}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </div>

            <div className="mt-5 flex items-start gap-3 rounded-xl border border-[#f0dfd5] bg-[#fff7ef] p-4 text-sm text-[#6f554a]">
              <Info
                size={17}
                className="mt-0.5 shrink-0 text-[#964326]"
                strokeWidth={2}
              />
              <p>Average price for this category is 45-65 EGP</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Ingredients & Allergens Card */}
      <section className="rounded-2xl border border-[#eee2dd] bg-white p-5 shadow-sm md:p-7">
        <div className="grid gap-7 lg:grid-cols-2">
          <div>
            <FieldLabel>Ingredients (Separated by comma)</FieldLabel>
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
                onChange={(event) => setIngredientInput(event.target.value)}
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

      {/* Actions Footer */}
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
          className="inline-flex items-center gap-2 rounded-full bg-[#964326] px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#7f3920] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Save size={17} strokeWidth={2} />
          {isSubmitting ? "Creating Meal..." : "List My Meal"}
        </button>
      </footer>
    </form>
  );
}
