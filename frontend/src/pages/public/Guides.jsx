import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { FiStar, FiCalendar, FiX, FiAward, FiChevronDown, FiChevronUp } from 'react-icons/fi';

export default function Guides() {
  const [guides, setGuides] = useState([]);
  const [topGuides, setTopGuides] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);

  // Reviews state
  const [guideReviews, setGuideReviews] = useState({});
  const [expandedReviews, setExpandedReviews] = useState(null);

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGuides = async () => {
      try {
        const [allRes, topRes] = await Promise.all([
          api.get("/guides"),
          api.get("/guides/top"),
        ]);
        setGuides(allRes.data.data || allRes.data);
        setTopGuides(topRes.data.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchGuides();
  }, []);

  const handleBooking = async () => {
    if (!bookingDate) { alert("Please select a date"); return; }

    setBookingLoading(true);
    const userData = JSON.parse(localStorage.getItem("user"));

    try {
      await api.post("/bookings/create", {
        userId: userData._id,
        guideId: selectedGuide._id,
        destinationId: localStorage.getItem("selectedDestination"),
        date: bookingDate,
        amount: selectedGuide.pricePerDay || 1000,
        tourType: "destination",
      });
      alert("Booking request sent!");
      setShowModal(false);
      setBookingDate("");
    } catch (err) {
      console.log(err.response?.data);
      alert("Booking failed");
    } finally {
      setBookingLoading(false);
    }
  };

  const toggleReviews = async (guideId) => {
    if (expandedReviews === guideId) {
      setExpandedReviews(null);
      return;
    }
    setExpandedReviews(guideId);
    if (!guideReviews[guideId]) {
      try {
        const res = await api.get(`/guides/${guideId}/reviews`);
        setGuideReviews(prev => ({ ...prev, [guideId]: res.data.data || [] }));
      } catch (err) {
        console.error(err);
      }
    }
  };

  const renderStars = (rating, size = 14) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map(star => (
          <FiStar
            key={star}
            size={size}
            className={`${star <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'text-surface-300'}`}
          />
        ))}
      </div>
    );
  };

  // Guide card component
  const GuideCard = ({ guide, isTop, rank }) => (
    <div className={`card p-6 border border-surface-100 hover:-translate-y-1 transition-all duration-500 ${isTop ? 'relative overflow-hidden' : ''}`}>
      {/* Top badge */}
      {isTop && rank <= 3 && (
        <div className={`absolute top-0 right-0 px-4 py-1.5 rounded-bl-xl text-xs font-bold text-white ${
          rank === 1 ? 'bg-gradient-to-r from-amber-500 to-amber-600' :
          rank === 2 ? 'bg-gradient-to-r from-surface-400 to-surface-500' :
          'bg-gradient-to-r from-amber-700 to-amber-800'
        }`}>
          {rank === 1 ? '🥇 #1' : rank === 2 ? '🥈 #2' : '🥉 #3'}
        </div>
      )}

      <div className="flex items-start gap-4 mb-4">
        <div className={`w-14 h-14 rounded-2xl ${
          isTop ? 'bg-gradient-to-br from-amber-500 to-amber-600' : 'bg-gradient-to-br from-accent-500 to-accent-600'
        } text-white flex items-center justify-center text-xl font-bold flex-shrink-0`}>
          {(guide.user?.name || guide.name || 'G').charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-bold text-surface-800 truncate">{guide.user?.name || guide.name}</h2>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            {renderStars(guide.rating || 0)}
            <span className="text-sm font-semibold text-amber-600">{(guide.rating || 0).toFixed(1)}</span>
            <span className="text-xs text-surface-400">({guide.totalReviews || 0} reviews)</span>
          </div>
          {guide.experience && (
            <p className="text-xs text-surface-400 mt-1">{guide.experience} yrs experience</p>
          )}
        </div>
      </div>

      <p className="text-sm text-surface-500 mb-4 line-clamp-2">
        {guide.bio || "Experienced local guide ready to show you Maharashtra's best."}
      </p>

      {guide.specializations && guide.specializations.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {guide.specializations.slice(0, 3).map((spec, j) => (
            <span key={j} className="badge bg-surface-100 text-surface-600 !text-[10px]">{spec}</span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-surface-100">
        <p className="text-primary-600 font-bold text-lg">
          ₹{guide.pricePerDay || 1000}<span className="text-surface-400 text-sm font-normal">/day</span>
        </p>
        <div className="flex gap-2">
          {(guide.totalReviews || 0) > 0 && (
            <button
              onClick={() => toggleReviews(guide._id)}
              className="flex items-center gap-1 text-xs text-surface-500 hover:text-primary-600 transition-colors px-2 py-1.5 rounded-lg hover:bg-surface-50"
            >
              Reviews
              {expandedReviews === guide._id ? <FiChevronUp size={12} /> : <FiChevronDown size={12} />}
            </button>
          )}
          {user && user.role !== "guide" && (
            <button
              onClick={() => { setSelectedGuide(guide); setShowModal(true); }}
              className="btn-primary !py-2 text-sm"
            >
              Book Now
            </button>
          )}
        </div>
      </div>

      {/* Expanded Reviews */}
      {expandedReviews === guide._id && (
        <div className="mt-4 pt-4 border-t border-surface-100 space-y-3 animate-slide-down">
          {guideReviews[guide._id]?.length > 0 ? (
            guideReviews[guide._id].map(review => (
              <div key={review._id} className="bg-surface-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-400 to-primary-500 text-white flex items-center justify-center text-xs font-bold">
                      {review.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <span className="text-sm font-semibold text-surface-700">{review.user?.name || "Tourist"}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {renderStars(review.rating, 12)}
                  </div>
                </div>
                <p className="text-sm text-surface-600">{review.comment}</p>
                <p className="text-xs text-surface-400 mt-2">
                  {new Date(review.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm text-surface-400 text-center py-2">Loading reviews...</p>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-mesh">
      {/* Header */}
      <section className="relative py-16 pb-20">
        <div className="absolute inset-0 bg-gradient-to-br from-accent-600 via-accent-500 to-primary-600" />
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3 animate-slide-up">
            Expert Local Guides
          </h1>
          <p className="text-white/70 text-lg max-w-xl mx-auto animate-slide-up stagger-1">
            Book verified guides for personalized heritage and food tours
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-10">

        {/* ===== TOP GUIDES SECTION ===== */}
        {topGuides.length > 0 && topGuides.some(g => (g.totalReviews || 0) > 0) && (
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-white flex items-center justify-center">
                <FiAward size={20} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-surface-800">Top Rated Guides</h2>
                <p className="text-surface-500 text-sm">Ranked by tourist reviews and ratings</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topGuides
                .filter(g => (g.totalReviews || 0) > 0)
                .slice(0, 3)
                .map((guide, i) => (
                  <GuideCard key={guide._id} guide={guide} isTop={true} rank={i + 1} />
                ))}
            </div>
          </div>
        )}

        {/* ===== ALL GUIDES ===== */}
        <div>
          <h2 className="text-2xl font-bold text-surface-800 mb-2">All Guides</h2>
          <p className="text-sm text-surface-400 mb-6">{guides.length} guide{guides.length !== 1 ? 's' : ''} available</p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guides.map((guide, i) => (
              <div key={guide._id} className="animate-fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
                <GuideCard guide={guide} isTop={false} />
              </div>
            ))}
          </div>

          {guides.length === 0 && (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🧭</div>
              <p className="text-surface-500 text-lg">No guides available.</p>
            </div>
          )}
        </div>
      </div>

      {/* Booking Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 animate-fade-in">
          <div className="bg-white rounded-2xl p-8 w-[420px] max-w-[95vw] shadow-premium-lg animate-scale-in">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-bold text-surface-800">
                  Book {selectedGuide?.user?.name || selectedGuide?.name}
                </h2>
                <p className="text-sm text-surface-400 mt-1">Select a date for your tour</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-lg hover:bg-surface-100 transition-colors text-surface-400"
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-surface-50 rounded-xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-500 to-accent-600 text-white flex items-center justify-center text-sm font-bold">
                  {(selectedGuide?.user?.name || selectedGuide?.name || 'G').charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-surface-800">{selectedGuide?.user?.name || selectedGuide?.name}</p>
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm text-primary-600 font-medium">₹{selectedGuide?.pricePerDay || 1000}/day</p>
                    {selectedGuide?.rating > 0 && (
                      <>
                        <span className="text-surface-300">·</span>
                        <span className="flex items-center gap-0.5 text-xs text-amber-600">
                          <FiStar size={11} className="fill-amber-400 text-amber-400" />
                          {selectedGuide.rating.toFixed(1)}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-surface-700 mb-2">
                  <FiCalendar className="inline mr-1" size={14} /> Tour Date
                </label>
                <input
                  type="date"
                  value={bookingDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="input-field"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBooking}
                  disabled={bookingLoading}
                  className="flex-1 btn-primary"
                >
                  {bookingLoading ? "Booking..." : "Confirm Booking"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}