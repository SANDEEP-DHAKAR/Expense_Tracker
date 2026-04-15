import { useEffect, useState } from "react";
import { createCategory, deleteCategory, getCategories, updateCategory } from "../api/categories";
import MobileNavbar from "../components/MobileNavbar";
import MobileNavbar from "../components/MobileNavbar";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await getCategories();
      setCategories(res?.data?.data || []);
    } catch (err) {
      console.error("FETCH CATEGORIES ERROR:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async () => {
    if (!name.trim()) return;
    try {
      setLoading(true);
      await createCategory({ name: name.trim() });
      setName("");
      await fetchCategories();
    } catch (err) {
      console.error("ADD CATEGORY ERROR:", err);
      alert("Unable to add category");
    } finally {
      setLoading(false);
    }
  };

  const handleEditCategory = (category) => {
    setEditingId(category.id);
    setEditingName(category.name);
  };

  const handleUpdateCategory = async () => {
    if (!editingName.trim() || !editingId) return;
    try {
      setLoading(true);
      await updateCategory(editingId, { name: editingName.trim() });
      setEditingId(null);
      setEditingName("");
      await fetchCategories();
    } catch (err) {
      console.error("UPDATE CATEGORY ERROR:", err);
      alert("Unable to update category");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    try {
      await deleteCategory(id);
      await fetchCategories();
    } catch (err) {
      console.error("DELETE CATEGORY ERROR:", err);
      alert("Unable to delete category");
    }
  };

  return (
    <div className="ml-0 xl:ml-64 w-full p-4 sm:p-6 bg-gray-100 dark:bg-slate-950 min-h-screen">
      <MobileNavbar />
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Categories</h1>
          <p className="text-gray-500 dark:text-slate-400 mt-1">Manage your spending categories.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-5 rounded-xl shadow dark:bg-slate-800">
          <h2 className="text-xl font-semibold mb-4">Add Category</h2>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Category name"
            className="w-full rounded-xl border-gray-300 p-3 mb-4 bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100"
          />
          <button
            onClick={handleAddCategory}
            disabled={loading}
            className={`w-full rounded-xl px-4 py-3 text-white ${loading ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700"}`}
          >
            {loading ? "Saving..." : "Add Category"}
          </button>
        </div>

        <div className="lg:col-span-2 bg-white p-5 rounded-xl shadow dark:bg-slate-800">
          <h2 className="text-xl font-semibold mb-4">Your Categories</h2>

          {categories.length === 0 ? (
            <p className="text-gray-500 dark:text-slate-400">No categories yet.</p>
          ) : (
            <div className="space-y-3">
              {categories.map((category) => (
                <div key={category.id} className="flex flex-col md:flex-row justify-between gap-3 rounded-2xl border border-gray-200 p-4 dark:border-slate-700 dark:bg-slate-900">
                  <div className="flex-1">
                    {editingId === category.id ? (
                      <input
                        className="w-full rounded-xl border-gray-300 p-2 bg-white text-slate-900 dark:bg-slate-800 dark:text-slate-100"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                      />
                    ) : (
                      <p className="font-medium text-slate-900 dark:text-slate-100">{category.name}</p>
                    )}
                    <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Created {new Date(category.created_at).toLocaleDateString()}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    {editingId === category.id ? (
                      <>
                        <button
                          onClick={handleUpdateCategory}
                          className="rounded-xl bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="rounded-xl bg-gray-300 px-4 py-2 text-slate-700 hover:bg-gray-400"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEditCategory(category)}
                          className="rounded-xl bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(category.id)}
                          className="rounded-xl bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
