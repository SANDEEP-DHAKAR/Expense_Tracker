import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Check,
  FolderKanban,
  FolderPlus,
  Layers3,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  Sparkles,
  Tag,
  Trash2,
  X,
  ReceiptText,
} from "lucide-react";
import toast from "react-hot-toast";

import AppShell from "../components/AppShell";
import { PanelSkeleton } from "../components/ui/Skeleton";
import { PageHeader, controlClass } from "../components/ui/Primitives";

import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../api/categories";

import { formatCurrency, formatDate } from "../utils/format";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [search, setSearch] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 8;

  const fetchCategories = useCallback(async () => {
    try {
      setInitialLoading(true);
      const res = await getCategories();
      setCategories(res?.data?.data || []);
    } catch (err) {
      console.error("FETCH CATEGORIES ERROR:", err);
      toast.error(
        err?.response?.data?.message || "Unable to load categories"
      );
    } finally {
      setInitialLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Reset pagination on search change
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

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
      toast.success("Category added successfully");
      await fetchCategories();
    } catch (err) {
      console.error("ADD CATEGORY ERROR:", err);
      toast.error(
        err?.response?.data?.message || "Unable to add category"
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
      toast.success("Category updated successfully");
      await fetchCategories();
    } catch (err) {
      console.error("UPDATE CATEGORY ERROR:", err);
      toast.error(
        err?.response?.data?.message || "Unable to update category"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (
      !window.confirm(
        "Delete this category? Transactions using it will become uncategorized."
      )
    ) {
      return;
    }

    try {
      await deleteCategory(id);
      toast.success("Category deleted");
      await fetchCategories();
    } catch (err) {
      console.error("DELETE CATEGORY ERROR:", err);
      toast.error(
        err?.response?.data?.message || "Unable to delete category"
      );
    }
  };

  // Filter categories by search query
  const filteredCategories = useMemo(() => {
    if (!search.trim()) return categories;
    return categories.filter((cat) =>
      cat.name.toLowerCase().includes(search.trim().toLowerCase())
    );
  }, [categories, search]);

  // Total transactions across filtered categories
  const totalTransactions = useMemo(() => {
    return filteredCategories.reduce(
      (sum, cat) => sum + Number(cat.expense_count || 0),
      0
    );
  }, [filteredCategories]);

  // Pagination
  const totalPages = Math.max(
    Math.ceil(filteredCategories.length / itemsPerPage),
    1
  );

  const paginatedCategories = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredCategories.slice(start, start + itemsPerPage);
  }, [filteredCategories, currentPage]);

  return (
    <AppShell>
      {/* PREMIUM BACKGROUND GLOWS */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[-120px] top-[-120px] h-[320px] w-[320px] rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute bottom-[-150px] right-[-120px] h-[320px] w-[320px] rounded-full bg-green-400/10 blur-3xl" />
        <div className="absolute left-1/2 top-1/3 h-[240px] w-[240px] -translate-x-1/2 rounded-full bg-lime-400/5 blur-3xl" />
      </div>

      <div className="relative z-10 space-y-6">
        {/* HEADER */}
        <PageHeader
          eyebrow="Organization"
          title="Categories"
          description="Manage, search, and organize your spending categories with a clean and professional experience."
        />

        {/* CONTENT GRID */}
        <div className="grid items-start gap-6 xl:grid-cols-[380px_minmax(0,1fr)] 2xl:grid-cols-[420px_minmax(0,1fr)]">
          {/* ADD CATEGORY CARD (LEFT) */}
          <form
            onSubmit={handleAddCategory}
            className="group relative overflow-hidden rounded-[30px] border border-emerald-200/40 bg-white/80 p-6 shadow-2xl shadow-emerald-500/5 backdrop-blur-xl transition-all duration-500 hover:shadow-emerald-500/10 dark:border-slate-800 dark:bg-slate-900/80"
          >
            {/* Background Glows */}
            <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-lime-400/10 blur-3xl" />

            {/* Header */}
            <div className="relative z-10 mb-6 flex items-start justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200/50 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:border-emerald-900/30 dark:bg-emerald-950/30 dark:text-emerald-300">
                  <Sparkles size={12} />
                  New Group
                </div>

                <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Add Category
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Create spending groups easily
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-green-700 text-white shadow-lg shadow-emerald-500/30">
                <FolderPlus size={22} />
              </div>
            </div>

            {/* Form Fields */}
            <div className="relative z-10 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Category Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Groceries, Entertainment, Fuel..."
                  className={`h-12 w-full rounded-2xl border-emerald-200/70 bg-white/90 px-4 text-sm shadow-sm backdrop-blur dark:border-emerald-900/30 dark:bg-slate-900/80 ${controlClass}`}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 px-5 text-sm font-bold text-white shadow-xl shadow-emerald-500/20 transition-all duration-300 hover:scale-[1.01] hover:shadow-emerald-500/30 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Plus size={18} />
                {loading ? "Adding Category..." : "Add Category"}
              </button>
            </div>
          </form>

          {/* CATEGORIES TABLE & CARD (RIGHT) */}
          <div className="min-w-0">
            {initialLoading ? (
              <div className="overflow-hidden rounded-[30px] border border-emerald-100/70 bg-white/70 p-6 shadow-[0_20px_80px_rgba(16,185,129,0.08)] backdrop-blur-2xl dark:border-emerald-900/30 dark:bg-slate-950/70">
                <PanelSkeleton rows={8} />
              </div>
            ) : (
              <section className="overflow-hidden rounded-[30px] border border-emerald-100/70 bg-white/80 shadow-[0_20px_80px_rgba(16,185,129,0.08)] backdrop-blur-2xl dark:border-emerald-900/30 dark:bg-slate-950/70">
                {/* Header */}
                <div className="border-b border-emerald-100/60 bg-gradient-to-r from-emerald-50/80 via-emerald-50/40 to-transparent p-5 sm:p-6 dark:border-emerald-900/20 dark:from-emerald-950/20">
                  <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                    {/* Title */}
                    <div className="flex items-center gap-3.5">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-green-700 text-white shadow-lg shadow-emerald-500/30">
                        <Layers3 size={24} />
                      </div>

                      <div>
                        <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
                          Category List
                        </h2>
                        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
                          {filteredCategories.length}{" "}
                          {filteredCategories.length === 1
                            ? "category"
                            : "categories"}
                          {" • "}
                          <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                            {totalTransactions} total transactions
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* Search Filter */}
                    <div className="flex items-center gap-2.5">
                      <div className="relative min-w-[170px] flex-1 sm:w-64 sm:flex-none">
                        <Search
                          size={16}
                          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500"
                        />
                        <input
                          type="text"
                          value={search}
                          placeholder="Search categories..."
                          onChange={(e) => setSearch(e.target.value)}
                          className={`h-10 w-full rounded-2xl border-emerald-200/70 bg-white/90 pl-9 pr-3 text-xs shadow-sm backdrop-blur dark:border-emerald-900/30 dark:bg-slate-900/80 sm:text-sm ${controlClass}`}
                        />
                      </div>

                      {search && (
                        <button
                          type="button"
                          onClick={() => setSearch("")}
                          className="inline-flex h-10 items-center gap-1.5 rounded-2xl border border-rose-200/80 bg-rose-50/90 px-3 text-xs font-semibold text-rose-700 shadow-sm transition hover:bg-rose-100 dark:border-rose-900/40 dark:bg-rose-950/40 dark:text-rose-300 sm:text-sm"
                        >
                          <RotateCcw size={13} />
                          Reset
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Content */}
                {filteredCategories.length === 0 ? (
                  <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-500/15 to-green-600/15 text-emerald-600 shadow-lg shadow-emerald-500/10 dark:text-emerald-400">
                      <FolderKanban size={32} />
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      {search
                        ? "No matching categories"
                        : "No categories yet"}
                    </h3>

                    <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">
                      {search
                        ? "Try searching for a different category name."
                        : "Create categories to organize your expenses properly."}
                    </p>

                    {search && (
                      <button
                        type="button"
                        onClick={() => setSearch("")}
                        className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700"
                      >
                        <RotateCcw size={13} />
                        Clear search
                      </button>
                    )}
                  </div>
                ) : (
                  <>
                    {/* DESKTOP TABLE VIEW */}
                    <div className="hidden md:block overflow-x-auto">
                      <table className="w-full text-left">
                        <thead className="border-b border-emerald-100/60 bg-emerald-50/50 text-xs font-bold uppercase tracking-[0.14em] text-emerald-800 dark:border-emerald-900/20 dark:bg-emerald-950/20 dark:text-emerald-300">
                          <tr>
                            <th className="px-6 py-4">Category</th>
                            <th className="px-6 py-4">Usage</th>
                            <th className="px-6 py-4">Total Spent</th>
                            <th className="px-6 py-4">Created Date</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                          </tr>
                        </thead>

                        <tbody className="divide-y divide-emerald-100/60 dark:divide-emerald-900/20">
                          {paginatedCategories.map((category) => {
                            const isEditing = editingId === category.id;

                            if (isEditing) {
                              return (
                                <tr
                                  key={category.id}
                                  className="bg-emerald-50/40 dark:bg-emerald-950/30"
                                >
                                  {/* EDIT CATEGORY NAME */}
                                  <td className="px-6 py-4" colSpan={3}>
                                    <input
                                      type="text"
                                      value={editingName}
                                      onChange={(e) =>
                                        setEditingName(e.target.value)
                                      }
                                      placeholder="Category name"
                                      className={`w-full max-w-sm rounded-xl border-emerald-300 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:border-emerald-800 dark:bg-slate-900 ${controlClass}`}
                                    />
                                  </td>

                                  {/* CREATED DATE */}
                                  <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                                    {formatDate(category.created_at)}
                                  </td>

                                  {/* EDIT ACTIONS */}
                                  <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                      <button
                                        type="button"
                                        disabled={loading}
                                        onClick={handleUpdateCategory}
                                        title="Save changes"
                                        className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-md shadow-emerald-500/20 transition hover:scale-105 disabled:opacity-60"
                                      >
                                        <Check size={16} />
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() => setEditingId(null)}
                                        title="Cancel"
                                        className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                                      >
                                        <X size={16} />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            }

                            return (
                              <tr
                                key={category.id}
                                className="group transition-colors duration-150 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/10"
                              >
                                {/* CATEGORY */}
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-3.5">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/15 to-green-600/15 text-emerald-700 dark:text-emerald-300">
                                      <Tag size={18} />
                                    </div>

                                    <div className="min-w-0">
                                      <p className="font-bold text-slate-900 dark:text-white">
                                        {category.name}
                                      </p>
                                    </div>
                                  </div>
                                </td>

                                {/* USAGE */}
                                <td className="px-6 py-4">
                                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/60 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:border-emerald-900/30 dark:bg-emerald-950/40 dark:text-emerald-300">
                                    <ReceiptText size={12} />
                                    {category.expense_count || 0}{" "}
                                    {Number(category.expense_count) === 1
                                      ? "expense"
                                      : "expenses"}
                                  </span>
                                </td>

                                {/* TOTAL SPENT */}
                                <td className="px-6 py-4 font-semibold text-slate-800 dark:text-slate-200">
                                  {formatCurrency(category.total_spent || 0)}
                                </td>

                                {/* CREATED DATE */}
                                <td className="px-6 py-4 text-sm font-medium text-slate-500 dark:text-slate-400">
                                  {formatDate(category.created_at)}
                                </td>

                                {/* ACTIONS */}
                                <td className="px-6 py-4 text-right">
                                  <div className="flex justify-end gap-2">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleEditCategory(category)
                                      }
                                      title="Edit category"
                                      className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-200/80 bg-white text-emerald-700 shadow-sm transition hover:scale-105 hover:bg-emerald-50 dark:border-emerald-900/30 dark:bg-slate-900 dark:text-emerald-300"
                                    >
                                      <Pencil size={15} />
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleDeleteCategory(category.id)
                                      }
                                      title="Delete category"
                                      className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-rose-200 bg-rose-50 text-rose-700 shadow-sm transition hover:scale-105 hover:bg-rose-100 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-300"
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

                    {/* MOBILE CARD VIEW */}
                    <div className="space-y-3 p-4 md:hidden">
                      {paginatedCategories.map((category) => {
                        const isEditing = editingId === category.id;

                        if (isEditing) {
                          return (
                            <div
                              key={category.id}
                              className="space-y-3 rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4 dark:border-emerald-900/40 dark:bg-emerald-950/30"
                            >
                              <div>
                                <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                                  Category Name
                                </label>
                                <input
                                  type="text"
                                  value={editingName}
                                  onChange={(e) =>
                                    setEditingName(e.target.value)
                                  }
                                  className={`w-full rounded-xl bg-white px-3 py-2 text-sm dark:bg-slate-900 ${controlClass}`}
                                />
                              </div>

                              <div className="flex justify-end gap-2 pt-1">
                                <button
                                  type="button"
                                  onClick={() => setEditingId(null)}
                                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                                >
                                  Cancel
                                </button>
                                <button
                                  type="button"
                                  disabled={loading}
                                  onClick={handleUpdateCategory}
                                  className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-60"
                                >
                                  Save
                                </button>
                              </div>
                            </div>
                          );
                        }

                        return (
                          <div
                            key={category.id}
                            className="rounded-2xl border border-emerald-100/80 bg-white/90 p-4 shadow-sm transition dark:border-emerald-900/30 dark:bg-slate-900/80"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex min-w-0 items-start gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
                                  <Tag size={18} />
                                </div>
                                <div className="min-w-0">
                                  <h4 className="font-bold text-slate-900 dark:text-white">
                                    {category.name}
                                  </h4>
                                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                                    <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                                      {category.expense_count || 0} expenses
                                    </span>
                                    <span>•</span>
                                    <span>{formatDate(category.created_at)}</span>
                                  </div>
                                </div>
                              </div>

                              <div className="shrink-0 text-right">
                                <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                                  {formatCurrency(category.total_spent || 0)}
                                </span>
                              </div>
                            </div>

                            <div className="mt-3 flex items-center justify-end gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
                              <button
                                type="button"
                                onClick={() =>
                                  handleEditCategory(category)
                                }
                                className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 dark:border-emerald-900/40 dark:bg-slate-900 dark:text-emerald-300"
                              >
                                <Pencil size={13} />
                                Edit
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  handleDeleteCategory(category.id)
                                }
                                className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100 dark:border-rose-900/40 dark:bg-rose-950/40 dark:text-rose-300"
                              >
                                <Trash2 size={13} />
                                Delete
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}

                {/* PAGINATION */}
                {filteredCategories.length > itemsPerPage && (
                  <div className="flex flex-col items-center justify-between gap-3 border-t border-emerald-100/60 p-5 sm:flex-row dark:border-emerald-900/20">
                    <span className="text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
                      Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                      {Math.min(
                        currentPage * itemsPerPage,
                        filteredCategories.length
                      )}{" "}
                      of {filteredCategories.length} categories
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={currentPage === 1}
                        onClick={() =>
                          setCurrentPage((page) => Math.max(page - 1, 1))
                        }
                        className="rounded-xl border border-emerald-200 bg-white px-4 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-emerald-900/30 dark:bg-slate-900 dark:text-emerald-300 sm:text-sm"
                      >
                        Previous
                      </button>

                      <span className="px-2 text-xs font-medium text-slate-600 dark:text-slate-300 sm:text-sm">
                        Page {currentPage} of {totalPages}
                      </span>

                      <button
                        type="button"
                        disabled={currentPage === totalPages}
                        onClick={() =>
                          setCurrentPage((page) =>
                            Math.min(page + 1, totalPages)
                          )
                        }
                        className="rounded-xl bg-gradient-to-r from-emerald-500 to-green-700 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-emerald-500/20 transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-40 sm:text-sm"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </section>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}