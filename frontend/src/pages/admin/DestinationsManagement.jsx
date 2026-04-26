import { useEffect, useState } from "react";
import api from "../../services/api";
import { FiSearch, FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';

const CATEGORIES = ["fort", "heritage", "festival", "cuisine", "temple", "beach", "hill_station", "wildlife"];

const emptyForm = {
  name: "", description: "", category: "heritage", image: "",
  location: { city: "", district: "", state: "Maharashtra", coordinates: { latitude: "", longitude: "" } },
};

export default function DestinationsManagement() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => { fetchDestinations(); }, []);

  const fetchDestinations = async () => {
    setLoading(true);
    try { const res = await api.get("/destinations?limit=100"); setDestinations(res.data.data || []); }
    catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    if (["city", "district", "state"].includes(name)) {
      setForm(prev => ({ ...prev, location: { ...prev.location, [name]: value } }));
    } else if (["latitude", "longitude"].includes(name)) {
      setForm(prev => ({ ...prev, location: { ...prev.location, coordinates: { ...prev.location.coordinates, [name]: value } } }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const openAddForm = () => { setForm(emptyForm); setEditingId(null); setShowForm(true); };

  const openEditForm = (dest) => {
    setForm({
      name: dest.name || "", description: dest.description || "", category: dest.category || "heritage",
      image: dest.image || dest.images?.[0]?.url || "",
      location: {
        city: dest.location?.city || "", district: dest.location?.district || "", state: dest.location?.state || "Maharashtra",
        coordinates: { latitude: dest.location?.coordinates?.latitude || "", longitude: dest.location?.coordinates?.longitude || "" },
      },
    });
    setEditingId(dest._id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async () => {
    if (!form.name || !form.description || !form.location.city || !form.location.district) {
      alert("Please fill Name, Description, City, and District."); return;
    }
    setSaving(true);
    try {
      const payload = {
        name: form.name, description: form.description, category: form.category, image: form.image,
        location: { city: form.location.city, district: form.location.district, state: form.location.state || "Maharashtra",
          coordinates: { latitude: parseFloat(form.location.coordinates.latitude) || 18.5, longitude: parseFloat(form.location.coordinates.longitude) || 73.8 },
        },
      };
      if (editingId) { await api.put(`/destinations/${editingId}`, payload); alert("Updated!"); }
      else { await api.post("/destinations", payload); alert("Added!"); }
      setShowForm(false); setEditingId(null); setForm(emptyForm); fetchDestinations();
    } catch (err) { alert("Failed: " + (err.response?.data?.message || err.message)); }
    finally { setSaving(false); }
  };

  const deleteDestination = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    try { await api.delete(`/destinations/${id}`); fetchDestinations(); }
    catch { alert("Failed to delete."); }
  };

  const filtered = destinations.filter(d =>
    d.name?.toLowerCase().includes(search.toLowerCase()) || d.location?.city?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-mesh">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex justify-between items-center mb-8 animate-slide-up">
          <h1 className="text-3xl font-bold text-surface-800">
            Manage <span className="gradient-text">Destinations</span>
          </h1>
          <button onClick={openAddForm} className="btn-primary flex items-center gap-2">
            <FiPlus size={16} /> Add Destination
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="card p-8 mb-8 border-t-4 border-primary-500 border border-surface-100 animate-scale-in">
            <h2 className="text-xl font-bold mb-6">{editingId ? "Edit Destination" : "Add New Destination"}</h2>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-semibold text-surface-700 mb-2">Name *</label>
                <input name="name" value={form.name} onChange={handleInput} placeholder="e.g. Ajanta Caves" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-surface-700 mb-2">Category *</label>
                <select name="category" value={form.category} onChange={handleInput} className="input-field">
                  {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat.replace('_',' ').replace(/^\w/,c=>c.toUpperCase())}</option>)}
                </select>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-surface-700 mb-2">Description *</label>
              <textarea name="description" value={form.description} onChange={handleInput} rows={3} placeholder="Describe..." className="input-field" />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-surface-700 mb-2">Image URL</label>
              <input name="image" value={form.image} onChange={handleInput} placeholder="https://..." className="input-field" />
              {form.image && <img src={form.image} alt="preview" className="mt-2 h-24 rounded-xl object-cover" onError={e => e.target.style.display = 'none'} />}
            </div>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-semibold text-surface-700 mb-2">City *</label>
                <input name="city" value={form.location.city} onChange={handleInput} placeholder="e.g. Aurangabad" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-surface-700 mb-2">District *</label>
                <input name="district" value={form.location.district} onChange={handleInput} placeholder="e.g. Aurangabad" className="input-field" />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-semibold text-surface-700 mb-2">Latitude</label>
                <input name="latitude" value={form.location.coordinates.latitude} onChange={handleInput} placeholder="20.5519" type="number" step="0.0001" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-surface-700 mb-2">Longitude</label>
                <input name="longitude" value={form.location.coordinates.longitude} onChange={handleInput} placeholder="75.7033" type="number" step="0.0001" className="input-field" />
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={handleSubmit} disabled={saving} className="btn-primary">{saving ? "Saving..." : editingId ? "Update" : "Add Destination"}</button>
              <button onClick={() => { setShowForm(false); setEditingId(null); setForm(emptyForm); }} className="btn-secondary">Cancel</button>
            </div>
          </div>
        )}

        {/* Search */}
        <div className="flex items-center gap-3 mb-5">
          <div className="relative flex-1 max-w-sm">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400" size={16} />
            <input type="text" placeholder="Search destinations..." className="input-field !pl-11" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <span className="text-surface-400 text-sm">{filtered.length} destination{filtered.length !== 1 ? 's' : ''}</span>
        </div>

        {/* Table */}
        <div className="card border border-surface-100 overflow-hidden">
          {loading ? (
            <div className="flex justify-center py-16"><div className="spinner" /></div>
          ) : filtered.length === 0 ? (
            <p className="py-16 text-center text-surface-500">No destinations found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-surface-50 border-b border-surface-100">
                  <tr className="text-left text-surface-500 text-xs uppercase tracking-wider">
                    <th className="py-3.5 px-4">Image</th>
                    <th className="py-3.5 px-4">Name</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">City</th>
                    <th className="py-3.5 px-4">District</th>
                    <th className="py-3.5 px-4">Rating</th>
                    <th className="py-3.5 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-100">
                  {filtered.map(dest => (
                    <tr key={dest._id} className="hover:bg-surface-50 transition-colors">
                      <td className="py-3 px-4">
                        <img src={dest.image || dest.images?.[0]?.url || "https://via.placeholder.com/80x50"} alt={dest.name}
                          className="h-12 w-16 object-cover rounded-lg" onError={e => e.target.src = "https://via.placeholder.com/80x50"} />
                      </td>
                      <td className="py-3 px-4 font-medium text-surface-800">{dest.name}</td>
                      <td className="py-3 px-4"><span className="badge badge-primary">{dest.category?.replace("_", " ")}</span></td>
                      <td className="py-3 px-4 text-surface-500">{dest.location?.city || "—"}</td>
                      <td className="py-3 px-4 text-surface-500">{dest.location?.district || "—"}</td>
                      <td className="py-3 px-4 text-amber-600 font-medium">⭐ {dest.rating?.toFixed(1) || "—"}</td>
                      <td className="py-3 px-4">
                        <div className="flex gap-1.5">
                          <button onClick={() => openEditForm(dest)}
                            className="flex items-center gap-1 text-blue-500 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition text-xs font-medium">
                            <FiEdit2 size={13} /> Edit
                          </button>
                          <button onClick={() => deleteDestination(dest._id, dest.name)}
                            className="flex items-center gap-1 text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg transition text-xs font-medium">
                            <FiTrash2 size={13} /> Delete
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
