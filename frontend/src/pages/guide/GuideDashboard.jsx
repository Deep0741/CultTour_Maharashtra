import { useEffect, useState } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

export default function GuideDashboard() {
  const { user } = useAuth();

  const [guideProfile, setGuideProfile] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [bio, setBio] = useState("");
  const [savingBio, setSavingBio] = useState(false);
  const [activeTab, setActiveTab] = useState("bookings");

  // Fetch guide profile to get the guide's _id (different from user._id)
  useEffect(() => {
    if (!user) return;

    api
      .get("/guides/me")
      .then((res) => {
        const guide = res.data.data;
        setGuideProfile(guide);
        setBio(guide.bio || "");

        // Fetch bookings using guide's _id
        return api.get(`/bookings/guide/${guide._id}`);
      })
      .then((res) => {
        setBookings(res.data || []);
      })
      .catch((err) => console.error("Guide profile/bookings error:", err));
  }, [user]);

  // Fetch notifications for this guide
  useEffect(() => {
    if (!guideProfile?._id) return;

    api
      .get(`/bookings/notifications/guide/${guideProfile._id}`)
      .then((res) => setNotifications(res.data.data || []))
      .catch((err) => console.error("Notifications error:", err));
  }, [guideProfile]);

  // Accept or Reject booking
  const updateStatus = async (bookingId, status) => {
    try {
      await api.post("/bookings/update-status", { bookingId, status });
      // Refresh bookings
      const res = await api.get(`/bookings/guide/${guideProfile._id}`);
      setBookings(res.data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to update status. Please try again.");
    }
  };

  // Save bio
  const saveBio = async () => {
    setSavingBio(true);
    try {
      await api.put("/guides/me", { bio });
      alert("Profile updated successfully!");
    } catch (err) {
      alert("Failed to save profile.");
    } finally {
      setSavingBio(false);
    }
  };

  const statusColor = (status) => {
    if (status === "accepted") return "bg-green-100 text-green-700";
    if (status === "rejected") return "bg-red-100 text-red-700";
    if (status === "completed") return "bg-blue-100 text-blue-700";
    return "bg-yellow-100 text-yellow-700";
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">

      {/* HEADER */}
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-1">Guide Dashboard</h1>
        <p className="text-gray-500 mb-8">Welcome, {user?.name || "Guide"}</p>

        {/* PROFILE CARD */}
        <div className="bg-white p-6 rounded-xl shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-3">Your Profile Bio</h2>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Describe your experience, specializations, and languages..."
            rows={3}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          <button
            onClick={saveBio}
            disabled={savingBio}
            className="bg-orange-500 text-white px-5 py-2 mt-3 rounded-lg hover:bg-orange-600 transition disabled:opacity-60"
          >
            {savingBio ? "Saving..." : "Save Profile"}
          </button>
        </div>

        {/* STATS ROW */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow p-5 text-center">
            <p className="text-3xl font-bold text-orange-500">{bookings.length}</p>
            <p className="text-gray-500 text-sm mt-1">Total Bookings</p>
          </div>
          <div className="bg-white rounded-xl shadow p-5 text-center">
            <p className="text-3xl font-bold text-green-500">
              {bookings.filter((b) => b.status === "accepted").length}
            </p>
            <p className="text-gray-500 text-sm mt-1">Accepted</p>
          </div>
          <div className="bg-white rounded-xl shadow p-5 text-center">
            <p className="text-3xl font-bold text-yellow-500">
              {bookings.filter((b) => b.status === "pending").length}
            </p>
            <p className="text-gray-500 text-sm mt-1">Pending</p>
          </div>
        </div>

        {/* TABS */}
        <div className="flex gap-3 mb-4">
          <button
            onClick={() => setActiveTab("bookings")}
            className={`px-5 py-2 rounded-lg font-medium transition ${
              activeTab === "bookings"
                ? "bg-orange-500 text-white"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            Booking Requests
          </button>
          <button
            onClick={() => setActiveTab("notifications")}
            className={`px-5 py-2 rounded-lg font-medium transition relative ${
              activeTab === "notifications"
                ? "bg-orange-500 text-white"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            Notifications
            {notifications.length > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                {notifications.length}
              </span>
            )}
          </button>
        </div>

        {/* BOOKINGS TAB */}
        {activeTab === "bookings" && (
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4">Booking Requests</h2>

            {bookings.length === 0 ? (
              <p className="text-gray-500 text-sm">No booking requests yet.</p>
            ) : (
              bookings.map((b) => (
                <div
                  key={b._id}
                  className="bg-gray-50 border rounded-lg p-4 mb-4 shadow-sm hover:shadow-md transition"
                >
                  <div className="flex justify-between items-start">

                    {/* LEFT - BOOKING DETAILS */}
                    <div>
                      <p className="text-lg font-semibold text-gray-800">
                        {b.tourist?.name || "Tourist"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {b.tourist?.email || ""}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        📍 Destination: <strong>{b.destination?.name || "—"}</strong>
                      </p>
                      <p className="text-sm text-gray-500">
                        📅 Date:{" "}
                        {b.date
                          ? new Date(b.date).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                          : "—"}
                      </p>
                      <p className="text-sm text-gray-500">💰 Amount: ₹{b.amount}</p>

                      {/* STATUS BADGE */}
                      <span
                        className={`text-xs px-3 py-1 rounded-full mt-2 inline-block font-medium ${statusColor(
                          b.status
                        )}`}
                      >
                        {b.status?.charAt(0).toUpperCase() + b.status?.slice(1)}
                      </span>
                    </div>

                    {/* RIGHT - ACTION BUTTONS (only for pending) */}
                    {b.status === "pending" && (
                      <div className="flex flex-col gap-2 ml-4">
                        <button
                          onClick={() => updateStatus(b._id, "accepted")}
                          className="bg-green-500 text-white px-5 py-2 rounded-lg hover:bg-green-600 transition text-sm"
                        >
                          ✅ Accept
                        </button>
                        <button
                          onClick={() => updateStatus(b._id, "rejected")}
                          className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600 transition text-sm"
                        >
                          ❌ Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* NOTIFICATIONS TAB */}
        {activeTab === "notifications" && (
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4">Notifications</h2>

            {notifications.length === 0 ? (
              <p className="text-gray-500 text-sm">No notifications yet.</p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n._id}
                  className="border-b py-4 last:border-b-0"
                >
                  <p className="font-semibold text-gray-800">{n.title}</p>
                  <p className="text-sm text-gray-500 mt-1">{n.message}</p>
                  {n.bookingId?.tourist?.name && (
                    <p className="text-sm text-orange-600 mt-1">
                      Tourist: {n.bookingId.tourist.name} →{" "}
                      {n.bookingId.destination?.name}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(n.createdAt).toLocaleString("en-IN")}
                  </p>
                </div>
              ))
            )}
          </div>
        )}

      </div>
    </div>
  );
}
