import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

export default function TouristDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?._id) return;

    api
      .get(`/bookings/user/${user._id}`)
      .then((res) => setBookings(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [user]);

  const statusColor = (status) => {
    if (status === "accepted") return "bg-green-100 text-green-700";
    if (status === "rejected") return "bg-red-100 text-red-700";
    if (status === "completed") return "bg-blue-100 text-blue-700";
    return "bg-yellow-100 text-yellow-700";
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-10">

        {/* HEADER */}
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.name || "Tourist"} 👋
        </h1>
        <p className="text-gray-500 mb-8">Explore Maharashtra with a local guide.</p>


        {/* QUICK ACTIONS */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">

          <div
            onClick={() => navigate("/destinations")}
            className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition cursor-pointer border-l-4 border-orange-500"
          >
            <h3 className="font-semibold text-lg mb-1">🗺️ Explore Destinations</h3>
            <p className="text-gray-500 text-sm">
              Discover amazing places in Maharashtra.
            </p>
          </div>

          <div
            onClick={() => navigate("/guides")}
            className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition cursor-pointer border-l-4 border-green-500"
          >
            <h3 className="font-semibold text-lg mb-1">👤 Browse Guides</h3>
            <p className="text-gray-500 text-sm">
              Find experienced local guides.
            </p>
          </div>

          <div
            onClick={() => navigate("/cuisines")}
            className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition cursor-pointer border-l-4 border-yellow-500"
          >
            <h3 className="font-semibold text-lg mb-1">🍲 Food Experiences</h3>
            <p className="text-gray-500 text-sm">
              Explore authentic Maharashtrian cuisines.
            </p>
          </div>

        </div>


        {/* MY BOOKINGS */}
        <div className="bg-white p-6 rounded-xl shadow">

          <h2 className="text-xl font-semibold mb-5">My Bookings</h2>

          {loading ? (
            <p className="text-gray-400 text-sm">Loading bookings...</p>
          ) : bookings.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500 mb-4">You haven't booked any tours yet.</p>
              <button
                onClick={() => navigate("/destinations")}
                className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition"
              >
                Explore Destinations
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-gray-600">
                    <th className="py-3 pr-4">Destination</th>
                    <th className="py-3 pr-4">Guide</th>
                    <th className="py-3 pr-4">Date</th>
                    <th className="py-3 pr-4">Amount</th>
                    <th className="py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b._id} className="border-b hover:bg-gray-50">
                      <td className="py-3 pr-4 font-medium">
                        {b.destination?.name || "—"}
                      </td>
                      <td className="py-3 pr-4 text-gray-600">
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
                      <td className="py-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor(
                            b.status
                          )}`}
                        >
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

      </div>
    </div>
  );
}
