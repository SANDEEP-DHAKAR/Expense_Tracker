import { useCallback, useEffect, useState } from "react";
import {
  Check,
  FolderKanban,
  Pencil,
  Plus,
  Trash2,
  X,
  Layers3,
} from "lucide-react";
import toast from "react-hot-toast";

import AppShell from "../components/AppShell";
import { PanelSkeleton } from "../components/ui/Skeleton";
import {
  PageHeader,
  controlClass,
  primaryButtonClass,
} from "../components/ui/Primitives";

import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../api/categories";

import { formatDate } from "../utils/format";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] =
    useState(true);

  const fetchCategories = useCallback(async () => {
    try {
      setInitialLoading(true);

      const res = await getCategories();

      setCategories(res?.data?.data || []);
    } catch (err) {
      console.error("FETCH CATEGORIES ERROR:", err);

      toast.error(
        err?.response?.data?.message ||
          "Unable to load categories"
      );
    } finally {
      setInitialLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleAddCategory = async (event) => {
    event.preventDefault();

    if (!name.trim()) {
      toast.error("Category name is required");
      return;
    }

    try {
      setLoading(true);

      await createCategory({
        name: name.trim(),
      });

      setName("");

      toast.success("Category added");

      await fetchCategories();
    } catch (err) {
      console.error("ADD CATEGORY ERROR:", err);

      toast.error(
        err?.response?.data?.message ||
          "Unable to add category"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEditCategory = (category) => {
    setEditingId(category.id);
    setEditingName(category.name);
  };

  const handleUpdateCategory = async () => {
    if (!editingName.trim() || !editingId) {
      toast.error("Category name is required");
      return;
    }

    try {
      setLoading(true);

      await updateCategory(editingId, {
        name: editingName.trim(),
      });

      setEditingId(null);
      setEditingName("");

      toast.success("Category updated");

      await fetchCategories();
    } catch (err) {
      console.error("UPDATE CATEGORY ERROR:", err);

      toast.error(
        err?.response?.data?.message ||
          "Unable to update category"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Delete this category?"))
      return;

    try {
      await deleteCategory(id);

      toast.success("Category deleted");

      await fetchCategories();
    } catch (err) {
      console.error("DELETE CATEGORY ERROR:", err);

      toast.error(
        err?.response?.data?.message ||
          "Unable to delete category"
      );
    }
  };

  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader
          eyebrow="Organization"
          title="Categories"
          description="Manage and organize your expense groups professionally."
        />

        <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">

          {/* ADD CATEGORY CARD */}
          <form
            onSubmit={handleAddCategory}
            className="h-fit overflow-hidden rounded-[28px] border border-violet-100/80 bg-gradient-to-br from-white via-violet-50/40 to-fuchsia-100/20 p-6 shadow-[0_20px_60px_rgba(139,92,246,0.12)] backdrop-blur-xl dark:border-violet-900/30 dark:from-slate-950 dark:via-slate-950 dark:to-violet-950/20"
          >
            <div className="mb-6 flex items-center gap-4">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-600 shadow-lg shadow-violet-500/30">
                <FolderKanban
                  size={26}
                  className="text-white"
                />
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Add Category
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Create spending groups easily.
                </p>
              </div>
            </div>

            <input
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              placeholder="Category name"
              className={`mb-4 h-12 w-full rounded-2xl border-violet-200/70 bg-white/80 px-4 shadow-sm backdrop-blur dark:border-violet-900/30 dark:bg-slate-900/70 ${controlClass}`}
            />

            <button
              type="submit"
              disabled={loading}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-500 to-fuchsia-600 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition hover:scale-[1.01] disabled:opacity-60"
            >
              <Plus size={17} />

              {loading
                ? "Saving..."
                : "Add Category"}
            </button>
          </form>

          {/* CATEGORY LIST */}
          {initialLoading ? (
            <PanelSkeleton rows={6} />
          ) : (
            <section className="overflow-hidden rounded-[28px] border border-violet-100/80 bg-gradient-to-br from-white via-violet-50/30 to-fuchsia-100/20 shadow-[0_20px_60px_rgba(139,92,246,0.10)] backdrop-blur-xl dark:border-violet-900/30 dark:from-slate-950 dark:via-slate-950 dark:to-violet-950/20">

              {/* HEADER */}
              <div className="border-b border-violet-100/70 px-6 py-5 dark:border-violet-900/20">
                <div className="flex items-center gap-4">

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/15 to-fuchsia-500/20 text-violet-700 dark:text-violet-300">
                    <Layers3 size={22} />
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                      Your Categories
                    </h2>

                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      {categories.length} categories available
                    </p>
                  </div>
                </div>
              </div>

              {/* EMPTY */}
              {categories.length === 0 ? (
                <div className="flex flex-col items-center justify-center px-5 py-16 text-center">

                  <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-500 to-fuchsia-600 shadow-xl shadow-violet-500/30">
                    <FolderKanban
                      size={34}
                      className="text-white"
                    />
                  </div>

                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    No categories yet
                  </h3>

                  <p className="mt-2 max-w-sm text-sm text-slate-500 dark:text-slate-400">
                    Create categories to organize your
                    expenses more professionally.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-violet-100/70 dark:divide-violet-900/20">

                  {categories.map((category) => (
                    <div
                      key={category.id}
                      className="flex flex-col gap-4 px-6 py-5 transition duration-200 hover:bg-violet-50/50 dark:hover:bg-violet-950/10 sm:flex-row sm:items-center sm:justify-between"
                    >

                      <div className="flex min-w-0 flex-1 items-center gap-4">

                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/15 to-fuchsia-500/20 text-violet-700 dark:text-violet-300">
                          <FolderKanban size={18} />
                        </div>

                        <div className="min-w-0 flex-1">
                          {editingId === category.id ? (
                            <input
                              className="w-full rounded-xl border border-violet-200 bg-white/80 px-4 py-2.5 text-sm outline-none transition focus:border-violet-400 dark:border-violet-900/30 dark:bg-slate-900/70 dark:text-white"
                              value={editingName}
                              onChange={(event) =>
                                setEditingName(
                                  event.target.value
                                )
                              }
                            />
                          ) : (
                            <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                              {category.name}
                            </p>
                          )}

                          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            Created{" "}
                            {formatDate(
                              category.created_at
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {editingId === category.id ? (
                          <>
                            <button
                              type="button"
                              onClick={
                                handleUpdateCategory
                              }
                              disabled={loading}
                              className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/20 transition hover:scale-105 disabled:opacity-60"
                              aria-label="Save category"
                            >
                              <Check size={16} />
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                setEditingId(null)
                              }
                              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                              aria-label="Cancel edit"
                            >
                              <X size={16} />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() =>
                                handleEditCategory(
                                  category
                                )
                              }
                              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-violet-200 bg-white text-violet-700 shadow-sm transition hover:scale-105 hover:bg-violet-50 dark:border-violet-900/30 dark:bg-slate-900 dark:text-violet-300"
                              aria-label="Edit category"
                            >
                              <Pencil size={16} />
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleDeleteCategory(
                                  category.id
                                )
                              }
                              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-rose-200 bg-rose-50 text-rose-700 shadow-sm transition hover:scale-105 hover:bg-rose-100 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-300"
                              aria-label="Delete category"
                            >
                              <Trash2 size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}
        </div>
      </div>
    </AppShell>
  );
}