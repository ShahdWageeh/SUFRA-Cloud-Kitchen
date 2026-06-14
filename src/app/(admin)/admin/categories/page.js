"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { adminCategoryService } from "@/services";
import { Loader } from "@/components/ui";
import {
  Plus,
  Pencil,
  Trash2,
  RefreshCw,
  ChevronDown,
  AlertTriangle,
  X,
  Camera,
  ToggleLeft,
  ToggleRight,
  UtensilsCrossed,
  CheckCircle,
  EyeOff,
} from "lucide-react";

const STATUS_CONFIG = {
  active: {
    label: "Active",
    badge: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    dot: "bg-emerald-500",
  },
  inactive: {
    label: "Inactive",
    badge: "bg-slate-100 text-slate-500 border border-slate-200",
    dot: "bg-slate-400",
  },
};

function extractCategories(response) {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  return [];
}

function getCategoryId(category) {
  return category?._id || category?.id || null;
}

function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function StatsCards({ categories, loading }) {
  const stats = useMemo(() => {
    const total = categories.length;
    const active = categories.filter((c) => c.status === "active").length;
    const inactive = categories.filter((c) => c.status === "inactive").length;
    return { total, active, inactive };
  }, [categories]);

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 h-28 animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col gap-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
          Total Categories
        </p>
        <p className="text-3xl font-bold text-slate-900 leading-none">
          {stats.total}
        </p>
        <div className="flex items-center gap-1.5">
          <UtensilsCrossed size={13} className="text-[#A55632]" />
          <span className="text-xs text-slate-500 font-medium">
            Meal browsing groups
          </span>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col gap-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
          Active
        </p>
        <p className="text-3xl font-bold text-emerald-600 leading-none">
          {stats.active}
        </p>
        <div className="flex items-center gap-1.5">
          <CheckCircle size={13} className="text-emerald-500" />
          <span className="text-xs text-emerald-600 font-medium">
            Visible to customers
          </span>
        </div>
      </div>

      <div className="col-span-2 lg:col-span-1 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col gap-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
          Inactive
        </p>
        <p className="text-3xl font-bold text-slate-600 leading-none">
          {stats.inactive}
        </p>
        <div className="flex items-center gap-1.5">
          <EyeOff size={13} className="text-slate-400" />
          <span className="text-xs text-slate-500 font-medium">
            Hidden from storefront
          </span>
        </div>
      </div>
    </div>
  );
}

function CategoryFormModal({ mode, category, onClose, onSuccess }) {
  const fileInputRef = useRef(null);
  const categoryId = getCategoryId(category);

  const [name, setName] = useState(category?.name || "");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(category?.image || "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const isEdit = mode === "edit";
  const fileInputId = isEdit
    ? `category-image-edit-${categoryId}`
    : "category-image-create";

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Category name is required.");
      return;
    }

    if (!isEdit && !imageFile) {
      setError("Category image is required.");
      return;
    }

    if (isEdit && !categoryId) {
      setError("Category id is missing. Please refresh and try again.");
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      if (imageFile) {
        formData.append("image", imageFile);
      }

      if (isEdit) {
        await adminCategoryService.updateCategory(categoryId, formData);
      } else {
        await adminCategoryService.createCategory(formData);
      }

      onSuccess();
      onClose();
    } catch (err) {
      setError(
        err.data?.message ||
          err.message ||
          `Failed to ${isEdit ? "update" : "create"} category.`,
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">
            {isEdit ? "Edit Category" : "Add Category"}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="flex gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              <AlertTriangle size={16} className="shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Category Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Italian, Desserts"
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#A55632]/30 focus:border-[#A55632]"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Category Image
              {!isEdit && <span className="text-red-500 ml-0.5">*</span>}
            </label>
            <input
              ref={fileInputRef}
              id={fileInputId}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            {imagePreview ? (
              <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-slate-200">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 transition"
                  aria-label="Remove image"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <label
                htmlFor={fileInputId}
                className="flex aspect-video w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 text-slate-500 hover:border-[#A55632] hover:bg-[#F0E8E2]/40 transition"
              >
                <Camera size={28} strokeWidth={1.5} className="text-[#A55632]" />
                <span className="text-xs font-medium">
                  {isEdit ? "Upload a new image" : "Click to upload image"}
                </span>
              </label>
            )}
            {isEdit && (
              <p className="text-xs text-slate-400 mt-1.5">
                Remove the current image to upload a new one. Saving without a
                new image keeps the existing one.
              </p>
            )}
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="flex-1 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ background: "#A55632" }}
            >
              {submitting ? (
                <Loader size={20} color="#fff" className="p-0" />
              ) : isEdit ? (
                "Save Changes"
              ) : (
                "Create Category"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DeleteConfirmModal({ category, onClose, onConfirm, deleting }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-sm bg-white rounded-2xl border border-slate-200 shadow-xl p-6">
        <div className="flex flex-col items-center text-center gap-3">
          <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center">
            <Trash2 size={22} className="text-rose-500" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Delete Category</h3>
          <p className="text-sm text-slate-500">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-slate-700">
              {category.name}
            </span>
            ? This action cannot be undone.
          </p>
        </div>
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            disabled={deleting}
            className="flex-1 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={deleting}
            className="flex-1 flex items-center justify-center rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-700 transition disabled:opacity-50"
          >
            {deleting ? <Loader size={20} color="#fff" className="p-0" /> : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CategoriesManagement() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [processingId, setProcessingId] = useState(null);

  const [formModal, setFormModal] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminCategoryService.getAllCategories();
      setCategories(extractCategories(response));
    } catch (err) {
      if (err.status === 401) {
        setError("Session expired. Please log out and sign in again as an admin.");
      } else if (err.status === 403) {
        setError("Access denied. This page requires an admin account.");
      } else {
        setError(err.message || "Failed to load categories.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const filteredCategories = useMemo(() => {
    if (statusFilter === "all") return categories;
    return categories.filter((c) => c.status === statusFilter);
  }, [categories, statusFilter]);

  const handleToggleStatus = async (category) => {
    const nextStatus = category.status === "active" ? "inactive" : "active";
    const categoryId = getCategoryId(category);
    setProcessingId(categoryId);
    try {
      await adminCategoryService.updateCategoryStatus(categoryId, nextStatus);
      setCategories((prev) =>
        prev.map((c) =>
          getCategoryId(c) === categoryId ? { ...c, status: nextStatus } : c,
        ),
      );
    } catch (err) {
      alert(err.data?.message || err.message || "Failed to update category status.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const categoryId = getCategoryId(deleteTarget);
      await adminCategoryService.deleteCategory(categoryId);
      setCategories((prev) =>
        prev.filter((c) => getCategoryId(c) !== categoryId),
      );
      setDeleteTarget(null);
    } catch (err) {
      alert(err.data?.message || err.message || "Failed to delete category.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Categories Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Create, edit, and control meal categories shown across the platform.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={loadCategories}
            disabled={loading}
            className="flex items-center gap-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg px-4 py-2 hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-50"
          >
            {loading ? (
              <Loader size={20} className="p-0" />
            ) : (
              <RefreshCw size={15} />
            )}
            Refresh
          </button>
          <button
            onClick={() => setFormModal({ mode: "create" })}
            className="flex items-center gap-2 text-sm font-semibold text-white rounded-lg px-4 py-2 transition-opacity hover:opacity-90 shadow-sm"
            style={{ background: "#A55632" }}
          >
            <Plus size={15} />
            Add Category
          </button>
        </div>
      </div>

      <StatsCards categories={categories} loading={loading} />

      <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="appearance-none text-sm text-slate-600 bg-white border border-slate-200 rounded-lg pl-3 pr-8 py-2 hover:border-slate-300 transition-colors shadow-sm cursor-pointer focus:outline-none"
          >
            <option value="all">Status: All Categories</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <ChevronDown
            size={14}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
        </div>

        {error && (
          <button
            onClick={loadCategories}
            className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors"
          >
            <Loader size={16} className="p-0" />
            Retry
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left">
            <thead>
              <tr className="border-b border-slate-100">
                {["Category", "Status", "Created", "Actions"].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3.5 text-[11px] font-semibold uppercase tracking-widest text-slate-400"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading &&
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(4)].map((__, j) => (
                      <td key={j} className="px-5 py-4">
                        <div className="h-4 bg-slate-100 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))}

              {!loading && error && (
                <tr>
                  <td colSpan={4} className="px-5 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <AlertTriangle size={28} className="text-rose-400" />
                      <p className="text-sm font-medium text-slate-600">
                        {error}
                      </p>
                      <button
                        onClick={loadCategories}
                        className="flex items-center gap-2 text-sm font-semibold text-white px-4 py-2 rounded-lg transition-opacity hover:opacity-90"
                        style={{ background: "#A55632" }}
                      >
                        <Loader size={20} color="#fff" className="p-0" />
                        Try again
                      </button>
                    </div>
                  </td>
                </tr>
              )}

              {!loading && !error && filteredCategories.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-5 py-16 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <UtensilsCrossed size={32} className="text-slate-300" />
                      <p className="text-sm font-medium text-slate-500">
                        No categories found
                      </p>
                      <p className="text-xs text-slate-400">
                        {statusFilter !== "all"
                          ? "Try adjusting your filter."
                          : "Create your first category to get started."}
                      </p>
                    </div>
                  </td>
                </tr>
              )}

              {!loading &&
                !error &&
                filteredCategories.map((category) => {
                  const sc =
                    STATUS_CONFIG[category.status] ?? STATUS_CONFIG.inactive;
                  const categoryId = getCategoryId(category);
                  const isProcessing = processingId === categoryId;

                  return (
                    <tr
                      key={categoryId}
                      className="hover:bg-slate-50/60 transition-colors"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 shrink-0">
                            {category.image ? (
                              <img
                                src={category.image}
                                alt={category.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center">
                                <UtensilsCrossed
                                  size={18}
                                  className="text-slate-300"
                                />
                              </div>
                            )}
                          </div>
                          <p className="text-sm font-semibold text-slate-800">
                            {category.name}
                          </p>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${sc.badge}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${sc.dot}`}
                          />
                          {sc.label}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-500">
                        {formatDate(category.createdAt)}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() =>
                              setFormModal({ mode: "edit", category })
                            }
                            disabled={isProcessing}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors disabled:opacity-40"
                            aria-label="Edit category"
                          >
                            <Pencil size={15} />
                          </button>

                          <button
                            onClick={() => handleToggleStatus(category)}
                            disabled={isProcessing}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-[#A55632] hover:bg-[#F0E8E2] transition-colors disabled:opacity-40"
                            aria-label={
                              category.status === "active"
                                ? "Deactivate category"
                                : "Activate category"
                            }
                            title={
                              category.status === "active"
                                ? "Set inactive"
                                : "Set active"
                            }
                          >
                            {category.status === "active" ? (
                              <ToggleRight size={15} className="text-emerald-500" />
                            ) : (
                              <ToggleLeft size={15} />
                            )}
                          </button>

                          <button
                            onClick={() => setDeleteTarget(category)}
                            disabled={isProcessing}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors disabled:opacity-40"
                            aria-label="Delete category"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>

        <div className="px-5 py-3.5 border-t border-slate-100">
          <div className="text-xs text-slate-400">
            {loading ? (
              <Loader size={14} className="p-0 justify-start" />
            ) : (
              `Showing ${filteredCategories.length} of ${categories.length} categories`
            )}
          </div>
        </div>
      </div>

      {formModal && (
        <CategoryFormModal
          mode={formModal.mode}
          category={formModal.category}
          onClose={() => setFormModal(null)}
          onSuccess={loadCategories}
        />
      )}

      {deleteTarget && (
        <DeleteConfirmModal
          category={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
          deleting={deleting}
        />
      )}
    </div>
  );
}
