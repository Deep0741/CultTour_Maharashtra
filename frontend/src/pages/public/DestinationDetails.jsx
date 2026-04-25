import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

export default function DestinationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [destination, setDestination] = useState(null);
  const [guides, setGuides] = useState([]);
  const [selectedGuide, setSelectedGuide] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [booking, setBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
  if (id) {
    localStorage.setItem("selectedDestination", id); // ✅ ADD THIS LINE
  }

  api
    .get(`/destinations/${id}`)
    .then((res) => setDestination(res.data.data))
    .catch((err) => console.log(err));

  api
    .get("/guides")
    .then((res) => setGuides(res.data.data || []))
    .catch((err) => console.log(err));
}, [id]);

  const handleBook = async () => {
  if (!user) {
    navigate("/login");
    return;
  }

  if (!selectedGuide) {
    alert("Please select a guide before booking.");
    return;
  }

  if (!bookingDate) {
    alert("Please select a tour date.");
    return;
  }

  setBooking(true);

  try {
  const user = JSON.parse(localStorage.getItem("user"));

  await api.post(
    "/bookings/create",
    {
      userId: user._id,          // ✅ REQUIRED
      guideId: selectedGuide,    // ✅ REQUIRED
      destinationId: id,         // ✅ REQUIRED
      date: bookingDate,         // ✅ matches backend
      amount: 1000,              // ✅ optional
    },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );

  setBookingSuccess(true);

} catch (err) {
  console.error("FULL ERROR:", err);
  console.log("RESPONSE:", err.response);
  console.log("DATA:", err.response?.data);
  alert(err.response?.data?.message || "Booking failed");
} finally {
  setBooking(false);
}
};

  if (!destination) return <div className="p-10">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <img
        src={destination.image || destination.images?.[0]?.url || "https://via.placeholder.com/900x420"}
        alt={destination.name}
        className="w-full h-[400px] object-cover rounded-lg mb-6"
      />

      {/* TITLE + LOCATION */}
      <h1 className="text-4xl font-bold mb-2">{destination.name}</h1>
      <p className="text-gray-600 mb-2">
        📍 {destination.location?.city}, {destination.location?.district}
      </p>
      <p className="text-yellow-500 text-lg mb-6">
        ⭐ {destination.rating || "4.5"}
      </p>

      {/* DESCRIPTION */}
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-3">About this Destination</h2>
        <p className="text-gray-700 leading-relaxed">{destination.description}</p>
      </div>

      {/* LOCATION INFO */}
      <div className="bg-gray-100 p-6 rounded-lg mb-8">
        <h2 className="text-xl font-semibold mb-4">Location Information</h2>
        <p className="text-gray-700">City: {destination.location?.city}</p>
        <p className="text-gray-700">District: {destination.location?.district}</p>
        {destination.location?.coordinates?.latitude && (
          <>
            <p className="text-gray-700">
              Latitude: {destination.location.coordinates.latitude}
            </p>
            <p className="text-gray-700">
              Longitude: {destination.location.coordinates.longitude}
            </p>
          </>
        )}
      </div>

      {/* GOOGLE MAP */}
      {destination.location?.coordinates?.latitude && (
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Location on Map</h2>
          <iframe
            title="destination-map"
            className="w-full h-[350px] rounded-lg"
            src={`https://maps.google.com/maps?q=${destination.location.coordinates.latitude},${destination.location.coordinates.longitude}&z=14&output=embed`}
          />
        </div>
      )}

      {/* EXPERIENCE CARDS */}
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white shadow rounded-lg p-5 text-center">
          <h3 className="text-lg font-semibold mb-2">🧭 Explore with Guides</h3>
          <p className="text-gray-500 text-sm">
            Discover this place with experienced local guides.
          </p>
        </div>
        <div className="bg-white shadow rounded-lg p-5 text-center">
          <h3 className="text-lg font-semibold mb-2">🍲 Local Cuisine</h3>
          <p className="text-gray-500 text-sm">
            Taste authentic local food around this destination.
          </p>
        </div>
        <div className="bg-white shadow rounded-lg p-5 text-center">
          <h3 className="text-lg font-semibold mb-2">📸 Photography Spots</h3>
          <p className="text-gray-500 text-sm">
            Capture breathtaking landscapes and scenic views.
          </p>
        </div>
      </div>


      {/* ===== BOOK A GUIDE SECTION ===== */}
      {user && user.role === "tourist" && (
        <div className="bg-white shadow-lg rounded-xl p-8 border-t-4 border-orange-500">
          <h2 className="text-2xl font-bold mb-2">Book a Guide for This Destination</h2>
          <p className="text-gray-500 text-sm mb-6">
            Select a guide, pick a date, and send a booking request. The guide will accept or reject it.
          </p>

          {bookingSuccess ? (
            <div className="bg-green-50 border border-green-300 rounded-lg p-6 text-center">
              <p className="text-green-700 text-lg font-semibold mb-2">
                ✅ Booking Request Sent!
              </p>
              <p className="text-gray-600 text-sm mb-4">
                Your guide will review and accept or reject your request. Check your dashboard for updates.
              </p>
              <button
                onClick={() => navigate("/tourist/dashboard")}
                className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition"
              >
                Go to My Dashboard
              </button>
            </div>
          ) : (
            <>
              {/* GUIDE SELECT */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select a Guide
                </label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  value={selectedGuide}
                  onChange={(e) => setSelectedGuide(e.target.value)}
                >
                  <option value="">-- Choose a guide --</option>
                  {guides.map((g) => (
                    <option key={g._id} value={g._id}>
                      {g.name} — ₹{g.pricePerTour || 1000}/tour
                    </option>
                  ))}
                </select>
                {guides.length === 0 && (
                  <p className="text-xs text-gray-400 mt-1">
                    No guides available right now.
                  </p>
                )}
              </div>

              {/* DATE PICK */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Tour Date
                </label>
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  value={bookingDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setBookingDate(e.target.value)}
                />
              </div>

              {/* BOOK BUTTON */}
              <button
                onClick={handleBook}
                disabled={booking}
                className="w-full bg-orange-500 text-white py-3 rounded-lg text-lg font-semibold hover:bg-orange-600 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {booking ? "Sending Request..." : "Book This Guide"}
              </button>
            </>
          )}
        </div>
      )}

      

      {/* Prompt login if not logged in */}
      {!user && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 text-center">
          <p className="text-gray-700 mb-3">
            Please log in as a tourist to book a guide for this destination.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition"
          >
            Login to Book
          </button>
        </div>
      )}

    </div>
  );
}
