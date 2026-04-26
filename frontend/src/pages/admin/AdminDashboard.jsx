import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { FiUsers, FiCompass, FiClock, FiMapPin, FiDollarSign, FiCalendar, FiBell, FiCoffee, FiMap } from 'react-icons/fi';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    users: 0, guides: 0, pendingGuides: 0, bookings: 0,
    destinations: 0, revenue: 0, destinationTours: 0, foodTours: 0, activeTours: 0,
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchAll(); }, []);

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
        destinationTours: data.destinationTours || 0,
        foodTours: data.foodTours || 0,
        activeTours: data.activeTours || 0,
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
    try { await api.delete("/admin/notifications"); setNotifications([]); }
    catch (err) { console.error(err); }
  };

  const statCards = [
    { label: "Tourists", value: stats.users, icon: <FiUsers size={20} />, color: "from-primary-500 to-primary-600" },
    { label: "Guides", value: stats.guides, icon: <FiCompass size={20} />, color: "from-emerald-500 to-emerald-600" },
    { label: "Pending Guides", value: stats.pendingGuides, icon: <FiClock size={20} />, color: "from-amber-500 to-amber-600" },
    { label: "Total Bookings", value: stats.bookings, icon: <FiCalendar size={20} />, color: "from-blue-500 to-blue-600" },
    { label: "Destinations", value: stats.destinations, icon: <FiMapPin size={20} />, color: "from-accent-500 to-accent-600" },
    { label: "Revenue", value: `₹${stats.revenue.toLocaleString("en-IN")}`, icon: <FiDollarSign size={20} />, color: "from-teal-500 to-teal-600" },
  ];

  const tourTypeCards = [
    { label: "Destination Tours", value: stats.destinationTours, icon: "🗺️", color: "from-accent-500 to-accent-600" },
    { label: "Food Tours", value: stats.foodTours, icon: "🍴", color: "from-emerald-500 to-emerald-600" },
    { label: "Active Tours", value: stats.activeTours, icon: "🔴", color: "from-blue-500 to-blue-600" },
  ];

  const adminActions = [
    { label: "Manage Users", desc: "View and manage tourists and users.", icon: "👤", color: "border-blue-500", onClick: () => navigate("/admin/users") },
    { label: "Manage Guides", desc: "Approve, reject, or remove guides.", icon: "🧭", color: "border-emerald-500", onClick: () => navigate("/admin/guides"), badge: stats.pendingGuides > 0 ? `⚠️ ${stats.pendingGuides} pending` : null },
    { label: "Manage Destinations", desc: "Add, edit, or delete destinations.", icon: "🗺️", color: "border-accent-500", onClick: () => navigate("/admin/destinations") },
  ];

  return (
    <div className="min-h-screen bg-mesh">
      <div className="max-w-7xl mx-auto px-4 py-10">

        <h1 className="text-3xl font-bold text-surface-800 mb-8 animate-slide-up">
          Admin <span className="gradient-text">Dashboard</span>
        </h1>

        {loading ? (
          <div className="flex justify-center py-20"><div className="spinner" /></div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
              {statCards.map((s, i) => (
                <div key={i} className="stat-card text-center animate-slide-up" style={{ animationDelay: `${i * 0.05}s` }}>
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} text-white flex items-center justify-center mx-auto mb-3`}>
                    {s.icon}
                  </div>
                  <p className="text-2xl font-bold text-surface-800">{s.value}</p>
                  <p className="text-surface-500 text-xs mt-1">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Tour Type Breakdown */}
            <div className="mb-8">
              <h2 className="text-lg font-bold text-surface-800 mb-4">Tour Type Overview</h2>
              <div className="grid grid-cols-3 gap-4">
                {tourTypeCards.map((tc, i) => (
                  <div key={i} className="card p-5 border border-surface-100 text-center">
                    <div className="text-3xl mb-2">{tc.icon}</div>
                    <p className={`text-2xl font-bold bg-gradient-to-r ${tc.color} bg-clip-text text-transparent`}>{tc.value}</p>
                    <p className="text-surface-500 text-sm mt-1">{tc.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Admin Actions */}
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              {adminActions.map((action, i) => (
                <div
                  key={i}
                  onClick={action.onClick}
                  className={`card p-6 border-l-4 ${action.color} border border-surface-100 cursor-pointer hover:-translate-y-1 transition-all duration-300`}
                >
                  <h3 className="font-bold text-lg mb-1">{action.icon} {action.label}</h3>
                  <p className="text-surface-500 text-sm">{action.desc}</p>
                  {action.badge && (
                    <p className="text-red-500 text-xs mt-2 font-medium">{action.badge}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Notifications */}
            <div className="card p-6 border border-surface-100 mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-surface-800 flex items-center gap-2">
                  <FiBell className="text-primary-500" /> Notifications
                </h2>
                {notifications.length > 0 && (
                  <button onClick={clearNotifications} className="text-sm text-red-500 hover:underline font-medium">
                    Clear All
                  </button>
                )}
              </div>
              {notifications.length === 0 ? (
                <p className="text-surface-500 text-sm py-4 text-center">No notifications.</p>
              ) : (
                <div className="space-y-2">
                  {notifications.slice(0, 5).map((n) => (
                    <div key={n._id} className="bg-surface-50 rounded-xl p-4 border border-surface-100">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`badge ${n.tourType === 'food' ? 'bg-emerald-100 text-emerald-700' : 'bg-accent-100 text-accent-700'} !text-[10px]`}>
                          {n.tourType === 'food' ? '🍴 Food' : '🗺️ Destination'}
                        </span>
                        <p className="font-semibold text-surface-800 text-sm">{n.title}</p>
                      </div>
                      <p className="text-sm text-surface-500">{n.message}</p>
                      <p className="text-xs text-surface-400 mt-1">{new Date(n.createdAt).toLocaleString("en-IN")}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Bookings */}
            <div className="card border border-surface-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-surface-100">
                <h2 className="text-xl font-bold text-surface-800">Recent Bookings</h2>
              </div>
              {recentBookings.length === 0 ? (
                <p className="text-surface-500 text-sm py-8 text-center">No bookings yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-surface-50">
                      <tr className="text-left text-surface-500 text-xs uppercase tracking-wider">
                        <th className="py-3 px-4">Tourist</th>
                        <th className="py-3 px-4">Tour</th>
                        <th className="py-3 px-4">Type</th>
                        <th className="py-3 px-4">Guide</th>
                        <th className="py-3 px-4">Date</th>
                        <th className="py-3 px-4">Amount</th>
                        <th className="py-3 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-100">
                      {recentBookings.map((b) => (
                        <tr key={b._id} className="hover:bg-surface-50 transition-colors">
                          <td className="py-3 px-4 font-medium text-surface-800">{b.tourist?.name || "—"}</td>
                          <td className="py-3 px-4 text-surface-600">
                            {b.tourType === 'food' ? (b.cuisine?.name || 'Food Tour') : (b.destination?.name || "—")}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`badge ${b.tourType === 'food' ? 'bg-emerald-100 text-emerald-700' : 'bg-accent-100 text-accent-700'} !text-[10px]`}>
                              {b.tourType === 'food' ? '🍴 Food' : '🗺️ Dest'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-surface-600">{b.guide?.user?.name || b.guideName || "—"}</td>
                          <td className="py-3 px-4 text-surface-500">
                            {b.date ? new Date(b.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "—"}
                          </td>
                          <td className="py-3 px-4 font-medium">₹{b.amount || 0}</td>
                          <td className="py-3 px-4">
                            <span className={`badge ${
                              b.status === 'accepted' ? 'bg-emerald-100 text-emerald-700' :
                              b.status === 'rejected' ? 'bg-red-100 text-red-700' :
                              b.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                              'bg-amber-100 text-amber-700'
                            } !text-[10px]`}>
                              {b.status?.charAt(0).toUpperCase() + b.status?.slice(1)}
                            </span>
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
