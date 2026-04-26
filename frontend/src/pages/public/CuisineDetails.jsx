import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { FiArrowLeft, FiCalendar, FiUser, FiCheckCircle } from 'react-icons/fi';

export default function CuisineDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cuisine, setCuisine] = useState(null);

  // Food tour booking state
  const [guides, setGuides] = useState([]);
  const [selectedGuide, setSelectedGuide] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    api.get(`/cuisines/${id}`)
      .then((res) => setCuisine(res.data.data))
      .catch((err) => console.log(err));

    api.get("/guides")
      .then((res) => setGuides(res.data.data || []))
      .catch((err) => console.log(err));
  }, [id]);

  const handleFoodTourBooking = async () => {
    if (!user) { navigate("/login"); return; }
    if (!selectedGuide) { alert("Please select a guide."); return; }
    if (!bookingDate) { alert("Please select a date."); return; }

    setBookingLoading(true);
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      await api.post("/bookings/create", {
        userId: userData._id,
        guideId: selectedGuide,
        cuisineId: id,
        date: bookingDate,
        amount: 800,
        tourType: "food",
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setBookingSuccess(true);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Booking failed");
    } finally {
      setBookingLoading(false);
    }
  };

  if (!cuisine) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-mesh">
        <div className="spinner" />
      </div>
    );
  }

  const sections = [
    { emoji: "📖", title: "Description", content: cuisine.description, color: "from-primary-500 to-primary-600" },
    { emoji: "🥗", title: "Ingredients", content: cuisine.ingredients || "Ingredients information not available.", color: "from-emerald-500 to-emerald-600" },
  ];

  return (
    <div className="min-h-screen bg-mesh">
      {/* Hero */}
      <div className="relative h-[50vh] md:h-[55vh]">
        <img
          src={cuisine.image || "https://images.unsplash.com/photo-1567337710282-00832b415979?w=1200"}
          alt={cuisine.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface-950/80 via-surface-900/40 to-transparent" />

        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 flex items-center gap-2 bg-white/90 backdrop-blur-sm hover:bg-white px-4 py-2 rounded-xl shadow-lg transition-all text-sm font-medium text-surface-700"
        >
          <FiArrowLeft size={16} /> Back
        </button>

        <div className="absolute bottom-8 left-6 md:left-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg mb-2">{cuisine.name}</h1>
          <p className="text-white/70 text-lg">Authentic Maharashtrian Dish 🍽️</p>
          <div className="flex gap-2 mt-3">
            {cuisine.type && (
              <span className={`badge ${
                cuisine.type === 'veg' ? 'bg-emerald-500/90 text-white' :
                cuisine.type === 'non-veg' ? 'bg-red-500/90 text-white' :
                'bg-teal-500/90 text-white'
              }`}>
                {cuisine.type}
              </span>
            )}
            {cuisine.spiceLevel && (
              <span className="badge bg-amber-500/90 text-white">
                🌶️ {cuisine.spiceLevel.replace('_', ' ')}
              </span>
            )}
            {cuisine.averagePrice && (
              <span className="badge bg-white/90 text-surface-700">
                ₹{cuisine.averagePrice}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {sections.map((sec, i) => (
            <div key={i} className="card p-8 border border-surface-100 hover:shadow-premium-lg transition-all duration-300">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="text-2xl">{sec.emoji}</span>
                <span className="gradient-text">{sec.title}</span>
              </h2>
              <p className="text-surface-600 leading-relaxed">
                {Array.isArray(sec.content) ? sec.content.join(', ') : sec.content}
              </p>
            </div>
          ))}
        </div>

        {/* History */}
        {(cuisine.history || cuisine.origin) && (
          <div className="card p-8 border border-surface-100 mb-8">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="text-2xl">🏺</span>
              <span className="gradient-text">History / Origin</span>
            </h2>
            <p className="text-surface-600 leading-relaxed">{cuisine.history || cuisine.origin}</p>
          </div>
        )}

        {/* ===== FOOD TOUR BOOKING ===== */}
        {user && user.role === "tourist" && (
          <div className="card p-8 border-t-4 border-emerald-500 border border-surface-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white flex items-center justify-center">
                🍴
              </div>
              <div>
                <h2 className="text-2xl font-bold text-surface-800">Book a Food Tour</h2>
                <p className="text-surface-500 text-sm">Experience this cuisine with a local food guide</p>
              </div>
            </div>

            {bookingSuccess ? (
              <div className="mt-6 bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center animate-scale-in">
                <FiCheckCircle className="text-emerald-500 mx-auto mb-3" size={40} />
                <p className="text-emerald-700 text-lg font-bold mb-2">Food Tour Booked!</p>
                <p className="text-surface-500 text-sm mb-5">Your guide will review and respond. Check your dashboard.</p>
                <button onClick={() => navigate("/tourist/dashboard")} className="btn-primary">
                  Go to Dashboard
                </button>
              </div>
            ) : (
              <div className="mt-6 space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-surface-700 mb-2">
                    <FiUser className="inline mr-1" size={14} /> Select a Guide
                  </label>
                  <select
                    className="input-field"
                    value={selectedGuide}
                    onChange={(e) => setSelectedGuide(e.target.value)}
                  >
                    <option value="">-- Choose a food guide --</option>
                    {guides.map((g) => (
                      <option key={g._id} value={g._id}>
                        {g.name} — ₹{g.pricePerDay || 800}/tour
                      </option>
                    ))}
                  </select>
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
                  onClick={handleFoodTourBooking}
                  disabled={bookingLoading}
                  className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 py-3.5 rounded-xl font-semibold hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 text-lg"
                >
                  {bookingLoading ? "Sending Request..." : "Book Food Tour 🍴"}
                </button>
              </div>
            )}
          </div>
        )}

        {!user && (
          <div className="card p-8 text-center border border-primary-200 bg-primary-50/50">
            <p className="text-surface-600 mb-4">Log in as a tourist to book a food tour for this cuisine.</p>
            <button onClick={() => navigate("/login")} className="btn-primary">
              Login to Book
            </button>
          </div>
        )}
      </div>
    </div>
  );
}