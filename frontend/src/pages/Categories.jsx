import { useCallback, useEffect, useState } from "react";
import { Check, FolderKanban, Pencil, Plus, Trash2, X } from "lucide-react";
import toast from "react-hot-toast";
import AppShell from "../components/AppShell";
import { PanelSkeleton } from "../components/ui/Skeleton";
import { createCategory, deleteCategory, getCategories, updateCategory } from "../api/categories";
import { formatDate } from "../utils/format";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const fetchCategories = useCallback(async () => {
    try {
      setInitialLoading(true);
      const res = await getCategories();
      setCategories(res?.data?.data || []);
    } catch (err) {
      console.error("FETCH CATEGORIES ERROR:", err);
      toast.error(err?.response?.data?.message || "Unable to load categories");
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
      await createCategory({ name: name.trim() });
      setName("");
      toast.success("Category added");
      await fetchCategories();
    } catch (err) {
      console.error("ADD CATEGORY ERROR:", err);
      toast.error(err?.response?.data?.message || "Unable to add category");
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
      await updateCategory(editingId, { name: editingName.trim() });
      setEditingId(null);
      setEditingName("");
      toast.success("Category updated");
      await fetchCategories();
    } catch (err) {
      console.error("UPDATE CATEGORY ERROR:", err);
      toast.error(err?.response?.data?.message || "Unable to update category");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Delete this category?")) return;

    try {
      await deleteCategory(id);
      toast.success("Category deleted");
      await fetchCategories();
    } catch (err) {
      console.error("DELETE CATEGORY ERROR:", err);
      toast.error(err?.response?.data?.message || "Unable to delete category");
    }
  };

  return (
    <AppShell>
      <div className="space-y-5">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
            Organization
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-3xl">
            Categories
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Keep spending groups tidy so reports stay useful.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-[360px_minmax(0,1fr)]">
          <form
            onSubmit={handleAddCategory}
            className="h-fit rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                <FolderKanban size={18} />
              </div>
              <div>
                <h2 className="text-base font-semibold text-slate-950 dark:text-white">
                  Add category
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Create a new spend group.
                </p>
              </div>
            </div>

            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Category name"
              className="mb-3 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:ring-slate-900"
            />
            <button
              type="submit"
              disabled={loading}
              className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
            >
              <Plus size={16} />
              {loading ? "Saving..." : "Add category"}
            </button>
          </form>

          {initialLoading ? (
            <PanelSkeleton rows={6} />
          ) : (
            <section className="min-w-0 rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-800">
                <h2 className="text-base font-semibold text-slate-950 dark:text-white">
                  Your categories
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {categories.length} categories available
                </p>
              </div>

              {categories.length === 0 ? (
                <div className="px-5 py-12 text-center text-sm text-slate-500 dark:text-slate-400">
                  No categories yet.
                </div>
              ) : (
                <div className="divide-y divide-slate-200 dark:divide-slate-800">
                  {categories.map((category) => (
                    <div
                      key={category.id}
                      className="flex flex-col gap-3 px-5 py-4 transition hover:bg-slate-50 dark:hover:bg-slate-950/60 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="min-w-0 flex-1">
                        {editingId === category.id ? (
                          <input
                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                            value={editingName}
                            onChange={(event) => setEditingName(event.target.value)}
                          />
                        ) : (
                          <p className="truncate font-medium text-slate-900 dark:text-slate-100">
                            {category.name}
                          </p>
                        )}
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                          Created {formatDate(category.created_at)}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {editingId === category.id ? (
                          <>
                            <button
                              type="button"
                              onClick={handleUpdateCategory}
                              disabled={loading}
                              className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-white transition hover:bg-emerald-700 disabled:opacity-60"
                              aria-label="Save category"
                            >
                              <Check size={15} />
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingId(null)}
                              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-800"
                              aria-label="Cancel edit"
                            >
                              <X size={15} />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => handleEditCategory(category)}
                              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-800"
                              aria-label="Edit category"
                            >
                              <Pencil size={15} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteCategory(category.id)}
                              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-rose-100 bg-rose-50 text-rose-700 transition hover:bg-rose-100 dark:border-rose-950 dark:bg-rose-950/40 dark:text-rose-300"
                              aria-label="Delete category"
                            >
                              <Trash2 size={15} />
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
