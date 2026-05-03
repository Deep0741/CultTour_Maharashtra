import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { FiMapPin, FiStar, FiCalendar, FiUser, FiArrowLeft, FiCheckCircle, FiCompass, FiCamera } from 'react-icons/fi';
import { FaUtensils } from 'react-icons/fa';

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
    if (id) localStorage.setItem("selectedDestination", id);

    api.get(`/destinations/${id}`)
      .then((res) => setDestination(res.data.data))
      .catch((err) => console.log(err));

    api.get("/guides")
      .then((res) => setGuides(res.data.data || []))
      .catch((err) => console.log(err));
  }, [id]);

  const handleBook = async () => {
    if (!user) { navigate("/login"); return; }
    if (!selectedGuide) { alert("Please select a guide before booking."); return; }
    if (!bookingDate) { alert("Please select a tour date."); return; }

    setBooking(true);
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      await api.post("/bookings/create", {
        userId: userData._id,
        guideId: selectedGuide,
        destinationId: id,
        date: bookingDate,
        amount: 1000,
        tourType: "destination",
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setBookingSuccess(true);
    } catch (err) {
      console.error("FULL ERROR:", err);
      alert(err.response?.data?.message || "Booking failed");
    } finally {
      setBooking(false);
    }
  };

  if (!destination) return (
    <div className="min-h-screen flex items-center justify-center bg-mesh">
      <div className="spinner" />
    </div>
  );

  const experiences = [
    { icon: <FiCompass size={24} />, title: "Explore with Guides", desc: "Discover this place with experienced local guides.", color: "from-primary-500 to-primary-600" },
    { icon: <FaUtensils size={22} />, title: "Local Cuisine", desc: "Taste authentic local food around this destination.", color: "from-emerald-500 to-emerald-600" },
    { icon: <FiCamera size={24} />, title: "Photography Spots", desc: "Capture breathtaking landscapes and scenic views.", color: "from-accent-500 to-accent-600" },
  ];

  return (
    <div className="min-h-screen bg-mesh">
      {/* Hero Image */}
      <div className="relative h-[50vh] md:h-[60vh]">
        <img
          src={destination.image || destination.images?.[0]?.url || "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200"}
          alt={destination.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface-950/80 via-surface-900/30 to-transparent" />

        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 flex items-center gap-2 bg-white/90 backdrop-blur-sm hover:bg-white px-4 py-2 rounded-xl shadow-lg transition-all text-sm font-medium text-surface-700"
        >
          <FiArrowLeft size={16} /> Back
        </button>

        <div className="absolute bottom-8 left-6 md:left-10">
          {destination.category && (
            <span className="badge bg-white/90 backdrop-blur-sm text-surface-700 mb-3">
              {destination.category.replace('_', ' ')}
            </span>
          )}
          <h1 className="text-3xl md:text-5xl font-extrabold text-white drop-shadow-lg">{destination.name}</h1>
          <div className="flex items-center gap-4 mt-3">
            <span className="flex items-center gap-1 text-white/80 text-sm">
              <FiMapPin size={14} />
              {destination.location?.city}, {destination.location?.district}
            </span>
            <span className="flex items-center gap-1 text-amber-300 text-sm">
              <FiStar size={14} />
              {destination.rating?.toFixed(1) || "4.5"}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Description */}
        <div className="card p-8 mb-8 border border-surface-100">
          <h2 className="text-2xl font-bold text-surface-800 mb-4">About this Destination</h2>
          <p className="text-surface-600 leading-relaxed text-lg">{destination.description}</p>
        </div>

        {/* Location Info */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="card p-6 border border-surface-100">
            <h3 className="text-lg font-bold text-surface-800 mb-4 flex items-center gap-2">
              <FiMapPin className="text-primary-500" /> Location Information
            </h3>
            <div className="space-y-2 text-surface-600 text-sm">
              <p><span className="font-medium text-surface-700">City:</span> {destination.location?.city}</p>
              <p><span className="font-medium text-surface-700">District:</span> {destination.location?.district}</p>
              {destination.location?.coordinates?.latitude && (
                <>
                  <p><span className="font-medium text-surface-700">Latitude:</span> {destination.location.coordinates.latitude}</p>
                  <p><span className="font-medium text-surface-700">Longitude:</span> {destination.location.coordinates.longitude}</p>
                </>
              )}
            </div>
          </div>

          {/* Map */}
          {destination.location?.coordinates?.latitude && (
            <div className="card overflow-hidden border border-surface-100">
              <iframe
                title="destination-map"
                className="w-full h-full min-h-[250px]"
                src={`https://maps.google.com/maps?q=${destination.location.coordinates.latitude},${destination.location.coordinates.longitude}&z=14&output=embed`}
              />
            </div>
          )}
        </div>

        {/* Experience Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {experiences.map((exp, i) => (
            <div key={i} className="card p-6 text-center border border-surface-100 hover:-translate-y-1 transition-all duration-300">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${exp.color} text-white flex items-center justify-center mx-auto mb-4`}>
                {exp.icon}
              </div>
              <h3 className="text-base font-bold text-surface-800 mb-1">{exp.title}</h3>
              <p className="text-sm text-surface-500">{exp.desc}</p>
            </div>
          ))}
        </div>

        {/* Book a Guide */}
        {user && user.role === "tourist" && (
          <div className="card p-8 border-t-4 border-primary-500 border border-surface-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 text-white flex items-center justify-center">
                <FiUser size={20} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-surface-800">Book a Guide</h2>
                <p className="text-surface-500 text-sm">Select a guide, pick a date, and send a booking request.</p>
              </div>
            </div>

            {bookingSuccess ? (
              <div className="mt-6 bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center animate-scale-in">
                <FiCheckCircle className="text-emerald-500 mx-auto mb-3" size={40} />
                <p className="text-emerald-700 text-lg font-bold mb-2">Booking Request Sent!</p>
                <p className="text-surface-500 text-sm mb-5">Your guide will review and respond. Check your dashboard for updates.</p>
                <button onClick={() => navigate("/tourist/dashboard")} className="btn-primary">
                  Go to Dashboard
                </button>
              </div>
            ) : (
              <div className="mt-6 space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-surface-700 mb-2">Select a Guide</label>
                  <select
                    className="input-field"
                    value={selectedGuide}
                    onChange={(e) => setSelectedGuide(e.target.value)}
                  >
                    <option value="">-- Choose a guide --</option>
                    {guides.map((g) => (
                      <option key={g._id} value={g._id}>
                        {g.name} — ₹{g.pricePerTour || g.pricePerDay || 1000}/tour
                      </option>
                    ))}
                  </select>
                  {guides.length === 0 && (
                    <p className="text-xs text-surface-400 mt-1">No guides available right now.</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-surface-700 mb-2">
                    <FiCalendar className="inline mr-1" size={14} /> Tour Date
                  </label>
                  <input
                    type="date"
                    className="input-field"
                    value={bookingDate}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setBookingDate(e.target.value)}
                  />
                </div>

                <button
                  onClick={handleBook}
                  disabled={booking}
                  className="w-full btn-primary !py-3.5 text-lg"
                >
                  {booking ? "Sending Request..." : "Book This Guide"}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Login prompt */}
        {!user && (
          <div className="card p-8 text-center border border-primary-200 bg-primary-50/50">
            <p className="text-surface-600 mb-4">Please log in as a tourist to book a guide for this destination.</p>
            <button onClick={() => navigate("/login")} className="btn-primary">
              Login to Book
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
