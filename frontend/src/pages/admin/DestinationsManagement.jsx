import { useEffect, useState } from "react";
import api from "../../services/api";

const CATEGORIES = [
  "fort",
  "heritage",
  "festival",
  "cuisine",
  "temple",
  "beach",
  "hill_station",
  "wildlife",
];

const emptyForm = {
  name: "",
  description: "",
  category: "heritage",
  image: "",
  location: {
    city: "",
    district: "",
    state: "Maharashtra",
    coordinates: {
      latitude: "",
      longitude: "",
    },
  },
};

export default function DestinationsManagement() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    setLoading(true);
    try {
      // Fetch all including inactive — for admin we pass no filter
      const res = await api.get("/destinations?limit=100");
      setDestinations(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch destinations:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInput = (e) => {
    const { name, value } = e.target;

    if (name === "city" || name === "district" || name === "state") {
      setForm((prev) => ({
        ...prev,
        location: { ...prev.location, [name]: value },
      }));
    } else if (name === "latitude" || name === "longitude") {
      setForm((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          coordinates: { ...prev.location.coordinates, [name]: value },
        },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const openAddForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  };

  const openEditForm = (dest) => {
    setForm({
      name: dest.name || "",
      description: dest.description || "",
      category: dest.category || "heritage",
      image: dest.image || dest.images?.[0]?.url || "",
      location: {
        city: dest.location?.city || "",
        district: dest.location?.district || "",
        state: dest.location?.state || "Maharashtra",
        coordinates: {
          latitude: dest.location?.coordinates?.latitude || "",
          longitude: dest.location?.coordinates?.longitude || "",
        },
      },
    });
    setEditingId(dest._id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async () => {
    if (!form.name || !form.description || !form.location.city || !form.location.district) {
      alert("Please fill in Name, Description, City, and District at minimum.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: form.name,
        description: form.description,
        category: form.category,
        image: form.image,
        location: {
          city: form.location.city,
          district: form.location.district,
          state: form.location.state || "Maharashtra",
          coordinates: {
            latitude: parseFloat(form.location.coordinates.latitude) || 18.5,
            longitude: parseFloat(form.location.coordinates.longitude) || 73.8,
          },
        },
      };

      if (editingId) {
        await api.put(`/destinations/${editingId}`, payload);
        alert("Destination updated successfully!");
      } else {
        await api.post("/destinations", payload);
        alert("Destination added successfully!");
      }

      setShowForm(false);
      setEditingId(null);
      setForm(emptyForm);
      fetchDestinations();
    } catch (err) {
      alert("Failed to save destination: " + (err.response?.data?.message || err.message));
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const deleteDestination = async (id, name) => {
    if (!window.confirm(`Delete destination "${name}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/destinations/${id}`);
      fetchDestinations();
    } catch (err) {
      alert("Failed to delete destination.");
      console.error(err);
    }
  };

  const filteredDestinations = destinations.filter((d) =>
    d.name?.toLowerCase().includes(search.toLowerCase()) ||
    d.location?.city?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-10">

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Manage Destinations</h1>
          <button
            onClick={openAddForm}
            className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition font-medium"
          >
            + Add Destination
          </button>
        </div>


        {/* ADD / EDIT FORM */}
        {showForm && (
          <div className="bg-white rounded-xl shadow p-6 mb-8 border-t-4 border-orange-500">
            <h2 className="text-xl font-semibold mb-6">
              {editingId ? "Edit Destination" : "Add New Destination"}
            </h2>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Destination Name *
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleInput}
                  placeholder="e.g. Ajanta Caves"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleInput}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.replace("_", " ").charAt(0).toUpperCase() +
                        cat.replace("_", " ").slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleInput}
                rows={3}
                placeholder="Describe the destination..."
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image URL
              </label>
              <input
                name="image"
                value={form.image}
                onChange={handleInput}
                placeholder="https://example.com/image.jpg"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              {form.image && (
                <img
                  src={form.image}
                  alt="preview"
                  className="mt-2 h-24 rounded object-cover"
                  onError={(e) => (e.target.style.display = "none")}
                />
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City *
                </label>
                <input
                  name="city"
                  value={form.location.city}
                  onChange={handleInput}
                  placeholder="e.g. Aurangabad"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  District *
                </label>
                <input
                  name="district"
                  value={form.location.district}
                  onChange={handleInput}
                  placeholder="e.g. Aurangabad"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Latitude
                </label>
                <input
                  name="latitude"
                  value={form.location.coordinates.latitude}
                  onChange={handleInput}
                  placeholder="e.g. 20.5519"
                  type="number"
                  step="0.0001"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Longitude
                </label>
                <input
                  name="longitude"
                  value={form.location.coordinates.longitude}
                  onChange={handleInput}
                  placeholder="e.g. 75.7033"
                  type="number"
                  step="0.0001"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="bg-orange-500 text-white px-8 py-2 rounded-lg hover:bg-orange-600 transition font-medium disabled:opacity-60"
              >
                {saving ? "Saving..." : editingId ? "Update Destination" : "Add Destination"}
              </button>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setForm(emptyForm);
                }}
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}


        {/* SEARCH */}
        <div className="mb-5">
          <input
            type="text"
            placeholder="Search destinations by name or city..."
            className="border border-gray-300 rounded-lg px-4 py-2 w-full md:w-96 focus:outline-none focus:ring-2 focus:ring-orange-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <span className="text-gray-500 text-sm ml-3">
            {filteredDestinations.length} destination{filteredDestinations.length !== 1 ? "s" : ""}
          </span>
        </div>


        {/* DESTINATIONS TABLE */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          {loading ? (
            <p className="p-10 text-center text-gray-500">Loading destinations...</p>
          ) : filteredDestinations.length === 0 ? (
            <p className="p-10 text-center text-gray-500">
              No destinations found. Add your first one!
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr className="text-left text-gray-600">
                    <th className="py-4 px-4">Image</th>
                    <th className="py-4 px-4">Name</th>
                    <th className="py-4 px-4">Category</th>
                    <th className="py-4 px-4">City</th>
                    <th className="py-4 px-4">District</th>
                    <th className="py-4 px-4">Rating</th>
                    <th className="py-4 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDestinations.map((dest) => (
                    <tr key={dest._id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <img
                          src={
                            dest.image ||
                            dest.images?.[0]?.url ||
                            "https://via.placeholder.com/80x50"
                          }
                          alt={dest.name}
                          className="h-12 w-16 object-cover rounded"
                          onError={(e) =>
                            (e.target.src = "https://via.placeholder.com/80x50")
                          }
                        />
                      </td>
                      <td className="py-3 px-4 font-medium">{dest.name}</td>
                      <td className="py-3 px-4">
                        <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs">
                          {dest.category?.replace("_", " ")}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-500">
                        {dest.location?.city || "—"}
                      </td>
                      <td className="py-3 px-4 text-gray-500">
                        {dest.location?.district || "—"}
                      </td>
                      <td className="py-3 px-4 text-yellow-600">
                        ⭐ {dest.rating?.toFixed(1) || "—"}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => openEditForm(dest)}
                            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition text-xs"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteDestination(dest._id, dest.name)}
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition text-xs"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
