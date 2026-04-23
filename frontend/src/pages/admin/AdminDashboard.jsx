import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    users: 0,
    guides: 0,
    pendingGuides: 0,
    bookings: 0,
    destinations: 0,
    revenue: 0,
  });

  const [recentBookings, setRecentBookings] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [analyticsRes, bookingsRes, notifRes] = await Promise.all([
        api.get("/admin/analytics"),
        api.get("/admin/bookings"),
        api.get("/admin/notifications"),
      ]);

      const data = analyticsRes.data.data;
      setStats({
        users: data.users || 0,
        guides: data.guides || 0,
        pendingGuides: data.pendingGuides || 0,
        bookings: data.bookings || 0,
        destinations: data.destinations || 0,
        revenue: data.revenue || 0,
      });

      setRecentBookings(bookingsRes.data.data?.slice(0, 8) || []);
      setNotifications(notifRes.data.data || []);
    } catch (err) {
      console.error("Admin dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  const clearNotifications = async () => {
    try {
      await api.delete("/admin/notifications");
      setNotifications([]);
    } catch (err) {
      console.error(err);
    }
  };

  const statusColor = (status) => {
    if (status === "accepted") return "text-green-600";
    if (status === "rejected") return "text-red-500";
    if (status === "completed") return "text-blue-500";
    return "text-yellow-600";
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-10">

        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

        {loading ? (
          <p className="text-gray-500">Loading dashboard...</p>
        ) : (
          <>
            {/* STATS CARDS */}
            <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
              {[
                { label: "Tourists", value: stats.users, color: "text-orange-600" },
                { label: "Guides", value: stats.guides, color: "text-green-600" },
                { label: "Pending Guides", value: stats.pendingGuides, color: "text-yellow-600" },
                { label: "Bookings", value: stats.bookings, color: "text-blue-600" },
                { label: "Destinations", value: stats.destinations, color: "text-purple-600" },
                { label: "Revenue (₹)", value: stats.revenue.toLocaleString("en-IN"), color: "text-orange-600" },
              ].map((s) => (
                <div key={s.label} className="bg-white p-5 rounded-xl shadow text-center">
                  <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                  <p className="text-gray-500 text-xs mt-1">{s.label}</p>
                </div>
              ))}
            </div>


            {/* ADMIN ACTIONS */}
            <div className="grid md:grid-cols-3 gap-6 mb-10">
              <div
                onClick={() => navigate("/admin/users")}
                className="bg-white p-6 rounded-xl shadow cursor-pointer hover:shadow-lg transition border-l-4 border-blue-500"
              >
                <h3 className="font-semibold text-lg mb-1">👤 Manage Users</h3>
                <p className="text-gray-500 text-sm">
                  View and delete tourists and users.
                </p>
              </div>

              <div
                onClick={() => navigate("/admin/guides")}
                className="bg-white p-6 rounded-xl shadow cursor-pointer hover:shadow-lg transition border-l-4 border-green-500"
              >
                <h3 className="font-semibold text-lg mb-1">🧭 Manage Guides</h3>
                <p className="text-gray-500 text-sm">
                  Approve, reject, or remove guides.
                </p>
                {stats.pendingGuides > 0 && (
                  <p className="text-red-500 text-xs mt-2 font-medium">
                    ⚠️ {stats.pendingGuides} pending approval
                  </p>
                )}
              </div>

              <div
                onClick={() => navigate("/admin/destinations")}
                className="bg-white p-6 rounded-xl shadow cursor-pointer hover:shadow-lg transition border-l-4 border-purple-500"
              >
                <h3 className="font-semibold text-lg mb-1">🗺️ Manage Destinations</h3>
                <p className="text-gray-500 text-sm">
                  Add, edit, or delete destinations.
                </p>
              </div>
            </div>


            {/* NOTIFICATIONS */}
            <div className="bg-white p-6 rounded-xl shadow mb-10">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Notifications</h2>
                {notifications.length > 0 && (
                  <button
                    onClick={clearNotifications}
                    className="text-sm text-red-500 hover:underline"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {notifications.length === 0 ? (
                <p className="text-gray-500 text-sm">No notifications.</p>
              ) : (
                notifications.map((n) => (
                  <div key={n._id} className="border-b py-3 last:border-0">
                    <p className="font-medium text-gray-800">{n.title}</p>
                    <p className="text-sm text-gray-500">{n.message}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(n.createdAt).toLocaleString("en-IN")}
                    </p>
                  </div>
                ))
              )}
            </div>


            {/* RECENT BOOKINGS */}
            <div className="bg-white p-6 rounded-xl shadow">
              <h2 className="text-xl font-semibold mb-4">Recent Bookings</h2>

              {recentBookings.length === 0 ? (
                <p className="text-gray-500 text-sm">No bookings yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-left text-gray-600">
                        <th className="py-3 pr-4">Tourist</th>
                        <th className="py-3 pr-4">Destination</th>
                        <th className="py-3 pr-4">Guide</th>
                        <th className="py-3 pr-4">Date</th>
                        <th className="py-3 pr-4">Amount</th>
                        <th className="py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentBookings.map((b) => (
                        <tr key={b._id} className="border-b hover:bg-gray-50">
                          <td className="py-3 pr-4">{b.tourist?.name || "—"}</td>
                          <td className="py-3 pr-4">{b.destination?.name || "—"}</td>
                          <td className="py-3 pr-4">
                            {b.guide?.user?.name || b.guide?.name || "—"}
                          </td>
                          <td className="py-3 pr-4 text-gray-500">
                            {b.date
                              ? new Date(b.date).toLocaleDateString("en-IN", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })
                              : "—"}
                          </td>
                          <td className="py-3 pr-4">₹{b.amount || 0}</td>
                          <td className={`py-3 font-medium ${statusColor(b.status)}`}>
                            {b.status?.charAt(0).toUpperCase() + b.status?.slice(1)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

      </div>
    </div>
  );
}
