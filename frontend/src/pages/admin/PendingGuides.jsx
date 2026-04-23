import { useEffect, useState } from "react";
import api from "../../services/api";

export default function PendingGuides() {
  const [pendingGuides, setPendingGuides] = useState([]);
  const [allGuides, setAllGuides] = useState([]);
  const [activeTab, setActiveTab] = useState("pending");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [pendingRes, allRes] = await Promise.all([
        api.get("/admin/guides/pending"),
        api.get("/admin/guides"),
      ]);
      setPendingGuides(pendingRes.data.data || []);
      setAllGuides(allRes.data.data || []);
    } catch (err) {
      console.error("Failed to fetch guides:", err);
    } finally {
      setLoading(false);
    }
  };

  const approveGuide = async (id) => {
    try {
      await api.put(`/admin/guides/${id}/approve`, {});
      fetchAll();
    } catch (err) {
      alert("Failed to approve guide.");
      console.error(err);
    }
  };

  const rejectGuide = async (id) => {
    try {
      await api.put(`/admin/guides/${id}/reject`, {});
      fetchAll();
    } catch (err) {
      alert("Failed to reject guide.");
      console.error(err);
    }
  };

  const deleteGuide = async (id, name) => {
    if (!window.confirm(`Delete guide "${name}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/admin/guides/${id}`);
      fetchAll();
    } catch (err) {
      alert("Failed to delete guide.");
      console.error(err);
    }
  };

  const statusColor = (status) => {
    if (status === "approved") return "bg-green-100 text-green-700";
    if (status === "rejected") return "bg-red-100 text-red-700";
    return "bg-yellow-100 text-yellow-700";
  };

  const GuideTable = ({ guides, showActions }) => (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b">
          <tr className="text-left text-gray-600">
            <th className="py-4 px-4">Name</th>
            <th className="py-4 px-4">Email</th>
            <th className="py-4 px-4">Experience</th>
            <th className="py-4 px-4">Price/day</th>
            <th className="py-4 px-4">Status</th>
            <th className="py-4 px-4">License No.</th>
            <th className="py-4 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {guides.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center py-10 text-gray-500">
                No guides found.
              </td>
            </tr>
          ) : (
            guides.map((guide) => (
              <tr key={guide._id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4 font-medium">
                  {guide.user?.name || "—"}
                </td>
                <td className="py-3 px-4 text-gray-500">
                  {guide.user?.email || "—"}
                </td>
                <td className="py-3 px-4 text-gray-500">
                  {guide.experience != null ? `${guide.experience} yrs` : "—"}
                </td>
                <td className="py-3 px-4 text-gray-500">
                  {guide.pricePerDay ? `₹${guide.pricePerDay}` : "—"}
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor(
                      guide.status
                    )}`}
                  >
                    {guide.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-gray-500">
                  {guide.licenseNumber || "—"}
                </td>
                <td className="py-3 px-4">
                  <div className="flex gap-2 flex-wrap">
                    {guide.status === "pending" && (
                      <>
                        <button
                          onClick={() => approveGuide(guide._id)}
                          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition text-xs"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => rejectGuide(guide._id)}
                          className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition text-xs"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {guide.status === "rejected" && (
                      <button
                        onClick={() => approveGuide(guide._id)}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition text-xs"
                      >
                        Approve
                      </button>
                    )}
                    <button
                      onClick={() => deleteGuide(guide._id, guide.user?.name)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition text-xs"
                    >
                      Delete
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
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-10">

        <h1 className="text-3xl font-bold mb-8">Manage Guides</h1>

        {/* TABS */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setActiveTab("pending")}
            className={`px-5 py-2 rounded-lg font-medium transition ${
              activeTab === "pending"
                ? "bg-orange-500 text-white"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            Pending Approvals
            {pendingGuides.length > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                {pendingGuides.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("all")}
            className={`px-5 py-2 rounded-lg font-medium transition ${
              activeTab === "all"
                ? "bg-orange-500 text-white"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            All Guides ({allGuides.length})
          </button>
        </div>

        {/* CONTENT */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          {loading ? (
            <p className="p-10 text-center text-gray-500">Loading guides...</p>
          ) : activeTab === "pending" ? (
            <GuideTable guides={pendingGuides} showActions />
          ) : (
            <GuideTable guides={allGuides} showActions />
          )}
        </div>

      </div>
    </div>
  );
}
