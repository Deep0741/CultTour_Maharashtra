import { useEffect, useState } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { FiMapPin, FiPlay, FiSend, FiCalendar, FiBell, FiCheckCircle } from 'react-icons/fi';

export default function GuideDashboard() {
  const { user } = useAuth();
  const [guideProfile, setGuideProfile] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [bio, setBio] = useState("");
  const [savingBio, setSavingBio] = useState(false);
  const [activeTab, setActiveTab] = useState("bookings");

  // Meeting point state per booking
  const [meetingPoints, setMeetingPoints] = useState({});

  useEffect(() => {
    if (!user) return;
    api.get("/guides/me")
      .then((res) => {
        const guide = res.data.data;
        setGuideProfile(guide);
        setBio(guide.bio || "");
        return api.get(`/bookings/guide/${guide._id}`);
      })
      .then((res) => setBookings(res.data || []))
      .catch((err) => console.error("Guide profile/bookings error:", err));
  }, [user]);

  useEffect(() => {
    if (!guideProfile?._id) return;
    api.get(`/bookings/notifications/guide/${guideProfile._id}`)
      .then((res) => setNotifications(res.data.data || []))
      .catch((err) => console.error("Notifications error:", err));
  }, [guideProfile]);

  const refreshBookings = async () => {
    const res = await api.get(`/bookings/guide/${guideProfile._id}`);
    setBookings(res.data || []);
  };

  const updateStatus = async (bookingId, status) => {
    try {
      await api.post("/bookings/update-status", { bookingId, status });
      await refreshBookings();
    } catch (err) {
      console.error(err);
      alert("Failed to update status.");
    }
  };

  const handleSetMeetingPoint = async (bookingId) => {
    const mp = meetingPoints[bookingId];
    if (!mp?.address) { alert("Please enter a meeting point address."); return; }
    try {
      await api.post("/bookings/set-meeting-point", {
        bookingId,
        address: mp.address,
        mapLink: mp.mapLink || "",
      });
      await refreshBookings();
      alert("Meeting point set!");
    } catch (err) {
      console.error(err);
      alert("Failed to set meeting point.");
    }
  };

  const handleStartTour = async (bookingId) => {
    try {
      await api.post("/bookings/start-tour", { bookingId });
      await refreshBookings();
    } catch (err) {
      console.error(err);
      alert("Failed to start tour.");
    }
  };

  const saveBio = async () => {
    setSavingBio(true);
    try {
      await api.put("/guides/me", { bio });
      alert("Profile updated!");
    } catch { alert("Failed to save profile."); }
    finally { setSavingBio(false); }
  };

  const stats = [
    { label: "Total Bookings", value: bookings.length, color: "from-primary-500 to-primary-600" },
    { label: "Accepted", value: bookings.filter(b => b.status === "accepted").length, color: "from-emerald-500 to-emerald-600" },
    { label: "Pending", value: bookings.filter(b => b.status === "pending").length, color: "from-amber-500 to-amber-600" },
    { label: "Active Tours", value: bookings.filter(b => b.tourStatus === "in-progress").length, color: "from-blue-500 to-blue-600" },
  ];

  const tabs = [
    { id: "bookings", label: "Booking Requests" },
    { id: "notifications", label: "Notifications", count: notifications.length },
    { id: "profile", label: "Profile" },
  ];

  return (
    <div className="min-h-screen bg-mesh">
      <div className="max-w-6xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="mb-8 animate-slide-up">
          <h1 className="text-3xl font-bold text-surface-800">
            Guide <span className="gradient-text">Dashboard</span>
          </h1>
          <p className="text-surface-500 mt-1">Welcome, {user?.name || "Guide"}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => (
            <div key={i} className="stat-card text-center animate-slide-up" style={{ animationDelay: `${i * 0.1}s` }}>
              <p className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                {stat.value}
              </p>
              <p className="text-surface-500 text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 whitespace-nowrap flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md'
                  : 'bg-white text-surface-600 hover:bg-surface-50 border border-surface-200'
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className={`text-xs rounded-full px-2 py-0.5 ${
                  activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-red-500 text-white'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* BOOKINGS TAB */}
        {activeTab === "bookings" && (
          <div className="space-y-4 animate-fade-in">
            {bookings.length === 0 ? (
              <div className="card p-12 text-center border border-surface-100">
                <div className="text-5xl mb-4">📋</div>
                <p className="text-surface-500">No booking requests yet.</p>
              </div>
            ) : (
              bookings.map((b) => (
                <div key={b._id} className="card p-5 border border-surface-100 hover:shadow-premium-lg transition-all duration-300">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex-1">
                      {/* Badges */}
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className={`badge ${b.tourType === 'food' ? 'bg-emerald-100 text-emerald-700' : 'bg-accent-100 text-accent-700'}`}>
                          {b.tourType === 'food' ? '🍴 Food Tour' : '🗺️ Destination Tour'}
                        </span>
                        <span className={`badge ${
                          b.status === 'accepted' ? 'bg-emerald-100 text-emerald-700' :
                          b.status === 'rejected' ? 'bg-red-100 text-red-700' :
                          b.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                          'bg-amber-100 text-amber-700'
                        }`}>
                          {b.status?.charAt(0).toUpperCase() + b.status?.slice(1)}
                        </span>
                        {b.tourStatus === "in-progress" && (
                          <span className="badge bg-blue-100 text-blue-700">🔴 Tour Active</span>
                        )}
                        {b.tourStatus === "completed" && (
                          <span className="badge bg-emerald-100 text-emerald-700">✅ Tour Done</span>
                        )}
                      </div>

                      {/* Tourist Info */}
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                          {b.tourist?.name?.charAt(0)?.toUpperCase() || 'T'}
                        </div>
                        <div>
                          <p className="font-bold text-surface-800 flex items-center gap-2">
                            {b.tourist?.name || "Tourist"}
                            {(b.status === "accepted" || b.status === "completed") && b.tourist?.phone && (
                              <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full text-[10px] font-medium flex items-center gap-1">
                                📞 {b.tourist.phone}
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-surface-400">{b.tourist?.email || ""}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-surface-500">
                        <span className="flex items-center gap-1">
                          <FiMapPin size={13} />
                          {b.tourType === 'food'
                            ? (b.cuisine?.name || 'Food Tour')
                            : (b.destination?.name || '—')}
                        </span>
                        <span className="flex items-center gap-1">
                          <FiCalendar size={13} />
                          {b.date ? new Date(b.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                        </span>
                        <span className="font-semibold text-surface-700">₹{b.amount}</span>
                      </div>

                      {/* Meeting point display */}
                      {b.meetingPoint?.address && (
                        <div className="mt-3 bg-blue-50 border border-blue-200 rounded-xl p-3 text-sm">
                          <p className="font-semibold text-blue-700 flex items-center gap-1">
                            <FiMapPin size={14} /> Meeting Point Set
                          </p>
                          <p className="text-blue-600">{b.meetingPoint.address}</p>
                        </div>
                      )}

                      {/* Meeting Point Form (for accepted, no meeting point yet) */}
                      {b.status === "accepted" && !b.meetingPoint?.address && b.tourStatus === "not-started" && (
                        <div className="mt-4 bg-surface-50 border border-surface-200 rounded-xl p-4 space-y-3">
                          <p className="text-sm font-semibold text-surface-700 flex items-center gap-1">
                            <FiMapPin size={14} /> Set Meeting Point
                          </p>
                          <input
                            type="text"
                            placeholder="Enter meeting address (e.g. Gate of India, Mumbai)"
                            className="input-field text-sm"
                            value={meetingPoints[b._id]?.address || ""}
                            onChange={(e) => setMeetingPoints(prev => ({
                              ...prev,
                              [b._id]: { ...prev[b._id], address: e.target.value }
                            }))}
                          />
                          <input
                            type="text"
                            placeholder="Google Maps link (optional)"
                            className="input-field text-sm"
                            value={meetingPoints[b._id]?.mapLink || ""}
                            onChange={(e) => setMeetingPoints(prev => ({
                              ...prev,
                              [b._id]: { ...prev[b._id], mapLink: e.target.value }
                            }))}
                          />
                          <button
                            onClick={() => handleSetMeetingPoint(b._id)}
                            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:from-blue-600 hover:to-blue-700 transition-all shadow-md"
                          >
                            <FiSend size={14} /> Set Meeting Point
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 flex-shrink-0">
                      {b.status === "pending" && (
                        <>
                          <button
                            onClick={() => updateStatus(b._id, "accepted")}
                            className="flex items-center justify-center gap-1 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-md"
                          >
                            <FiCheckCircle size={14} /> Accept
                          </button>
                          <button
                            onClick={() => updateStatus(b._id, "rejected")}
                            className="flex items-center justify-center gap-1 bg-gradient-to-r from-red-500 to-red-600 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:from-red-600 hover:to-red-700 transition-all shadow-md"
                          >
                            ✕ Reject
                          </button>
                        </>
                      )}

                      {b.status === "accepted" && b.meetingPoint?.address && b.tourStatus === "not-started" && (
                        <button
                          onClick={() => handleStartTour(b._id)}
                          className="flex items-center justify-center gap-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:from-blue-600 hover:to-blue-700 transition-all shadow-md animate-pulse-glow"
                        >
                          <FiPlay size={14} /> Start Tour
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* NOTIFICATIONS TAB */}
        {activeTab === "notifications" && (
          <div className="card p-6 border border-surface-100 animate-fade-in">
            <h2 className="text-xl font-bold text-surface-800 mb-4 flex items-center gap-2">
              <FiBell className="text-primary-500" /> Notifications
            </h2>
            {notifications.length === 0 ? (
              <p className="text-surface-500 text-sm py-8 text-center">No notifications yet.</p>
            ) : (
              <div className="space-y-3">
                {notifications.map((n) => (
                  <div key={n._id} className="bg-surface-50 rounded-xl p-4 border border-surface-100 hover:shadow-md transition-all">
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white flex-shrink-0 ${
                        n.tourType === 'food' ? 'bg-emerald-500' : 'bg-accent-500'
                      }`}>
                        {n.tourType === 'food' ? '🍴' : '🗺️'}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-surface-800">{n.title}</p>
                        <p className="text-sm text-surface-500 mt-0.5">{n.message}</p>
                        {n.bookingId?.tourist?.name && (
                          <p className="text-sm text-primary-600 mt-1 font-medium">
                            {n.bookingId.tourist.name} → {n.bookingId.destination?.name || n.bookingId.cuisine?.name || 'Tour'}
                          </p>
                        )}
                        <p className="text-xs text-surface-400 mt-1">
                          {new Date(n.createdAt).toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* PROFILE TAB */}
        {activeTab === "profile" && (
          <div className="card p-6 border border-surface-100 animate-fade-in">
            <h2 className="text-xl font-bold text-surface-800 mb-4">Your Profile Bio</h2>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Describe your experience, specializations, and languages..."
              rows={4}
              className="input-field"
            />
            <button
              onClick={saveBio}
              disabled={savingBio}
              className="btn-primary mt-4"
            >
              {savingBio ? "Saving..." : "Save Profile"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
