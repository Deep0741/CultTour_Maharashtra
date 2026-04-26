import { useEffect, useState } from "react";
import api from "../../services/api";
import { FiCheckCircle, FiXCircle, FiTrash2 } from 'react-icons/fi';

export default function PendingGuides() {
  const [pendingGuides, setPendingGuides] = useState([]);
  const [allGuides, setAllGuides] = useState([]);
  const [activeTab, setActiveTab] = useState("pending");
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [pendingRes, allRes] = await Promise.all([
        api.get("/admin/guides/pending"),
        api.get("/admin/guides"),
      ]);
      setPendingGuides(pendingRes.data.data || []);
      setAllGuides(allRes.data.data || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const approveGuide = async (id) => {
    try { await api.put(`/admin/guides/${id}/approve`, {}); fetchAll(); }
    catch { alert("Failed to approve guide."); }
  };

  const rejectGuide = async (id) => {
    try { await api.put(`/admin/guides/${id}/reject`, {}); fetchAll(); }
    catch { alert("Failed to reject guide."); }
  };

  const deleteGuide = async (id, name) => {
    if (!window.confirm(`Delete guide "${name}"?`)) return;
    try { await api.delete(`/admin/guides/${id}`); fetchAll(); }
    catch { alert("Failed to delete guide."); }
  };

  const statusConfig = {
    approved: "bg-emerald-100 text-emerald-700",
    rejected: "bg-red-100 text-red-700",
    pending: "bg-amber-100 text-amber-700",
  };

  const GuideTable = ({ guides }) => (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-surface-50 border-b border-surface-100">
          <tr className="text-left text-surface-500 text-xs uppercase tracking-wider">
            <th className="py-3.5 px-4">Guide</th>
            <th className="py-3.5 px-4">Email</th>
            <th className="py-3.5 px-4">Experience</th>
            <th className="py-3.5 px-4">Price/day</th>
            <th className="py-3.5 px-4">Status</th>
            <th className="py-3.5 px-4">License</th>
            <th className="py-3.5 px-4">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-100">
          {guides.length === 0 ? (
            <tr><td colSpan="7" className="text-center py-16 text-surface-500">No guides found.</td></tr>
          ) : (
            guides.map(guide => (
              <tr key={guide._id} className="hover:bg-surface-50 transition-colors">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 text-white flex items-center justify-center text-xs font-bold">
                      {guide.user?.name?.charAt(0)?.toUpperCase() || 'G'}
                    </div>
                    <span className="font-medium text-surface-800">{guide.user?.name || "—"}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-surface-500">{guide.user?.email || "—"}</td>
                <td className="py-3 px-4 text-surface-500">{guide.experience != null ? `${guide.experience} yrs` : "—"}</td>
                <td className="py-3 px-4 text-surface-600 font-medium">{guide.pricePerDay ? `₹${guide.pricePerDay}` : "—"}</td>
                <td className="py-3 px-4">
                  <span className={`badge ${statusConfig[guide.status] || 'bg-surface-100 text-surface-600'}`}>
                    {guide.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-surface-400 text-xs">{guide.licenseNumber || "—"}</td>
                <td className="py-3 px-4">
                  <div className="flex gap-1.5 flex-wrap">
                    {guide.status === "pending" && (
                      <>
                        <button onClick={() => approveGuide(guide._id)}
                          className="flex items-center gap-1 bg-emerald-500 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-600 transition text-xs font-medium">
                          <FiCheckCircle size={13} /> Approve
                        </button>
                        <button onClick={() => rejectGuide(guide._id)}
                          className="flex items-center gap-1 bg-amber-500 text-white px-3 py-1.5 rounded-lg hover:bg-amber-600 transition text-xs font-medium">
                          <FiXCircle size={13} /> Reject
                        </button>
                      </>
                    )}
                    {guide.status === "rejected" && (
                      <button onClick={() => approveGuide(guide._id)}
                        className="flex items-center gap-1 bg-emerald-500 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-600 transition text-xs font-medium">
                        <FiCheckCircle size={13} /> Approve
                      </button>
                    )}
                    <button onClick={() => deleteGuide(guide._id, guide.user?.name)}
                      className="flex items-center gap-1 text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg transition text-xs font-medium">
                      <FiTrash2 size={13} /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="min-h-screen bg-mesh">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-surface-800 mb-8 animate-slide-up">
          Manage <span className="gradient-text">Guides</span>
        </h1>

        <div className="flex gap-2 mb-6">
          {['pending', 'all'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 flex items-center gap-2 ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md'
                  : 'bg-white text-surface-600 hover:bg-surface-50 border border-surface-200'
              }`}
            >
              {tab === 'pending' ? 'Pending Approvals' : `All Guides (${allGuides.length})`}
              {tab === 'pending' && pendingGuides.length > 0 && (
                <span className={`text-xs rounded-full px-2 py-0.5 ${
                  activeTab === tab ? 'bg-white/20 text-white' : 'bg-red-500 text-white'
                }`}>
                  {pendingGuides.length}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="card border border-surface-100 overflow-hidden">
          {loading ? (
            <div className="flex justify-center py-16"><div className="spinner" /></div>
          ) : activeTab === "pending" ? (
            <GuideTable guides={pendingGuides} />
          ) : (
            <GuideTable guides={allGuides} />
          )}
        </div>
      </div>
    </div>
  );
}
