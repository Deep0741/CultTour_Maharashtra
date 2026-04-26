import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { FiMapPin, FiCalendar, FiCheckCircle, FiExternalLink, FiStar, FiX } from 'react-icons/fi';

export default function TouristDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Review state
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewBooking, setReviewBooking] = useState(null);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewHover, setReviewHover] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewedBookings, setReviewedBookings] = useState(new Set());

  useEffect(() => {
    if (!user?._id) return;
    api.get(`/bookings/user/${user._id}`)
      .then((res) => setBookings(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [user]);

  // Check which bookings already have reviews
  useEffect(() => {
    if (!user?._id) return;
    api.get(`/reviews?reviewType=guide`)
      .then(res => {
        const myReviews = (res.data.data || []).filter(r => {
          const reviewUserId = typeof r.user === 'object' ? r.user._id : r.user;
          return reviewUserId === user._id;
        });
        const reviewed = new Set(
          myReviews
            .filter(r => r.booking)
            .map(r => typeof r.booking === 'object' ? r.booking._id : r.booking)
        );
        setReviewedBookings(reviewed);
      })
      .catch(err => console.error("Review fetch error:", err));
  }, [user]);

  const handlePayment = async (booking) => {
    try {
      const { data } = await api.post("/payment/create-order", {
        bookingId: booking._id,
        amount: booking.amount,
      });
      const options = {
        key: "rzp_test_Sgvei3dA2INUG5",
        amount: data.order.amount,
        currency: "INR",
        order_id: data.order.id,
        name: "CulTour Maharashtra",
        description: "Guide Booking",
        handler: async function (response) {
          await api.post("/payment/verify", { bookingId: booking._id });
          alert("Payment successful ✅");
          window.location.reload();
        },
        modal: { ondismiss: () => alert("Payment cancelled ❌") },
        prefill: { name: localStorage.getItem("userName"), email: localStorage.getItem("userEmail") },
        theme: { color: "#f97316" },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert("Payment failed");
    }
  };

  const handleEndTour = async (bookingId) => {
    if (!window.confirm("Are you sure you want to end this tour?")) return;
    try {
      await api.post("/bookings/end-tour", { bookingId });
      const res = await api.get(`/bookings/user/${user._id}`);
      setBookings(res.data);
      // Find the booking that just ended and open review modal
      const endedBooking = res.data.find(b => b._id === bookingId);
      if (endedBooking) {
        setReviewBooking(endedBooking);
        setShowReviewModal(true);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to end tour");
    }
  };

  const openReviewModal = (booking) => {
    setReviewBooking(booking);
    setReviewRating(0);
    setReviewHover(0);
    setReviewComment("");
    setShowReviewModal(true);
  };

  const submitReview = async () => {
    if (!reviewRating) { alert("Please select a rating"); return; }
    if (!reviewComment.trim()) { alert("Please write a comment"); return; }

    setReviewSubmitting(true);
    try {
      await api.post("/reviews", {
        reviewType: "guide",
        guide: reviewBooking.guide?._id || reviewBooking.guide,
        booking: reviewBooking._id,
        rating: reviewRating,
        comment: reviewComment,
      });
      setShowReviewModal(false);
      setReviewedBookings(prev => new Set([...prev, reviewBooking._id]));
      alert("Review submitted! Thank you 🎉");
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || err.message || "";
      // Handle duplicate review (MongoDB duplicate key error)
      if (msg.includes("already exists") || msg.includes("duplicate") || msg.includes("E11000")) {
        setShowReviewModal(false);
        setReviewedBookings(prev => new Set([...prev, reviewBooking._id]));
        alert("You've already reviewed this guide for this booking ✅");
      } else {
        alert(msg || "Failed to submit review");
      }
    } finally {
      setReviewSubmitting(false);
    }
  };

  const statusConfig = {
    pending: { color: "bg-amber-100 text-amber-700", label: "Pending" },
    accepted: { color: "bg-emerald-100 text-emerald-700", label: "Accepted" },
    rejected: { color: "bg-red-100 text-red-700", label: "Rejected" },
    completed: { color: "bg-accent-100 text-accent-700", label: "Completed" },
  };

  const tourStatusConfig = {
    "not-started": { color: "bg-surface-100 text-surface-600", label: "Not Started" },
    "in-progress": { color: "bg-blue-100 text-blue-700", label: "In Progress 🔴" },
    "completed": { color: "bg-emerald-100 text-emerald-700", label: "Completed ✅" },
  };

  const stats = [
    { label: "Total Bookings", value: bookings.length, color: "from-primary-500 to-primary-600" },
    { label: "Active Tours", value: bookings.filter(b => b.tourStatus === "in-progress").length, color: "from-blue-500 to-blue-600" },
    { label: "Completed", value: bookings.filter(b => b.status === "completed").length, color: "from-emerald-500 to-emerald-600" },
  ];

  return (
    <div className="min-h-screen bg-mesh">
      <div className="max-w-6xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="mb-8 animate-slide-up">
          <h1 className="text-3xl font-bold text-surface-800">
            Welcome back, <span className="gradient-text">{user?.name || "Tourist"}</span> 👋
          </h1>
          <p className="text-surface-500 mt-1">Explore Maharashtra with a local guide.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {stats.map((stat, i) => (
            <div key={i} className="stat-card text-center animate-slide-up" style={{ animationDelay: `${i * 0.1}s` }}>
              <p className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                {stat.value}
              </p>
              <p className="text-surface-500 text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Bookings */}
        <div className="animate-slide-up stagger-3">
          <h2 className="text-xl font-bold text-surface-800 mb-4">My Bookings</h2>

          {loading ? (
            <div className="flex justify-center py-20"><div className="spinner" /></div>
          ) : bookings.length === 0 ? (
            <div className="card p-12 text-center border border-surface-100">
              <div className="text-5xl mb-4">🏔️</div>
              <p className="text-surface-500 mb-4">You haven't booked any tours yet.</p>
              <button onClick={() => navigate("/destinations")} className="btn-primary">
                Explore Destinations
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((b) => (
                <div key={b._id} className="card p-5 border border-surface-100 hover:shadow-premium-lg transition-all duration-300">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className={`badge ${b.tourType === 'food' ? 'bg-emerald-100 text-emerald-700' : 'bg-accent-100 text-accent-700'}`}>
                          {b.tourType === 'food' ? '🍴 Food Tour' : '🗺️ Destination Tour'}
                        </span>
                        <span className={`badge ${statusConfig[b.status]?.color}`}>
                          {statusConfig[b.status]?.label}
                        </span>
                        {b.status === "accepted" && (
                          <span className={`badge ${tourStatusConfig[b.tourStatus]?.color}`}>
                            {tourStatusConfig[b.tourStatus]?.label}
                          </span>
                        )}
                      </div>

                      <h3 className="text-lg font-bold text-surface-800">
                        {b.tourType === 'food'
                          ? (b.cuisine?.name || 'Food Tour')
                          : (b.destination?.name || '—')}
                      </h3>

                      <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-surface-500">
                        <span className="flex items-center gap-1">
                          <FiCalendar size={13} />
                          {b.date ? new Date(b.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                        </span>
                        <span>Guide: <strong className="text-surface-700">{b.guideName || b.guide?.user?.name || "—"}</strong></span>
                        <span className="font-semibold text-surface-700">₹{b.amount}</span>
                      </div>

                      {/* Meeting Point */}
                      {b.meetingPoint?.address && (
                        <div className="mt-3 bg-blue-50 border border-blue-200 rounded-xl p-3 text-sm">
                          <p className="font-semibold text-blue-700 mb-1 flex items-center gap-1">
                            <FiMapPin size={14} /> Meeting Point
                          </p>
                          <p className="text-blue-600">{b.meetingPoint.address}</p>
                          {b.meetingPoint.mapLink && (
                            <a
                              href={b.meetingPoint.mapLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-blue-600 hover:underline mt-1 text-xs font-medium"
                            >
                              <FiExternalLink size={12} /> Open in Google Maps
                            </a>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 md:items-end flex-shrink-0">
                      {b.status === "accepted" && b.paymentStatus !== "paid" && (
                        <button
                          onClick={() => handlePayment(b)}
                          className="btn-primary text-sm !py-2"
                        >
                          💳 Pay Now
                        </button>
                      )}
                      {b.paymentStatus === "paid" && (
                        <span className="badge badge-success">Paid ✅</span>
                      )}
                      {b.tourStatus === "in-progress" && (
                        <button
                          onClick={() => handleEndTour(b._id)}
                          className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:from-red-600 hover:to-red-700 transition-all shadow-md"
                        >
                          🏁 End Tour
                        </button>
                      )}

                      {/* Review button for completed tours */}
                      {b.status === "completed" && b.tourStatus === "completed" && !reviewedBookings.has(b._id) && (
                        <button
                          onClick={() => openReviewModal(b)}
                          className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:from-amber-600 hover:to-amber-700 transition-all shadow-md"
                        >
                          <FiStar size={14} /> Rate Guide
                        </button>
                      )}
                      {reviewedBookings.has(b._id) && (
                        <span className="badge bg-amber-100 text-amber-700">⭐ Reviewed</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ===== REVIEW MODAL ===== */}
      {showReviewModal && reviewBooking && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 animate-fade-in">
          <div className="bg-white rounded-2xl p-8 w-[480px] max-w-[95vw] shadow-premium-lg animate-scale-in">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-bold text-surface-800">Rate Your Guide</h2>
                <p className="text-sm text-surface-500 mt-1">How was your experience?</p>
              </div>
              <button
                onClick={() => setShowReviewModal(false)}
                className="p-2 rounded-lg hover:bg-surface-100 transition-colors text-surface-400"
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Guide info */}
            <div className="bg-surface-50 rounded-xl p-4 flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 text-white flex items-center justify-center text-lg font-bold">
                {(reviewBooking.guideName || reviewBooking.guide?.user?.name || 'G').charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-bold text-surface-800">{reviewBooking.guideName || reviewBooking.guide?.user?.name || "Guide"}</p>
                <p className="text-sm text-surface-400">
                  {reviewBooking.tourType === 'food' ? '🍴 Food Tour' : '🗺️ Destination Tour'} —{' '}
                  {reviewBooking.tourType === 'food'
                    ? (reviewBooking.cuisine?.name || '')
                    : (reviewBooking.destination?.name || '')}
                </p>
              </div>
            </div>

            {/* Star Rating */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-surface-700 mb-3">Your Rating</label>
              <div className="flex gap-2 justify-center">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    onClick={() => setReviewRating(star)}
                    onMouseEnter={() => setReviewHover(star)}
                    onMouseLeave={() => setReviewHover(0)}
                    className="transition-all duration-200 hover:scale-125"
                  >
                    <FiStar
                      size={36}
                      className={`transition-colors ${
                        star <= (reviewHover || reviewRating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-surface-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
              {reviewRating > 0 && (
                <p className="text-center text-sm text-surface-500 mt-2">
                  {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][reviewRating]}
                </p>
              )}
            </div>

            {/* Comment */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-surface-700 mb-2">Your Review</label>
              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                rows={4}
                placeholder="Share your experience with this guide..."
                className="input-field"
                maxLength={1000}
              />
              <p className="text-xs text-surface-400 mt-1 text-right">{reviewComment.length}/1000</p>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowReviewModal(false)}
                className="flex-1 btn-secondary"
              >
                Skip
              </button>
              <button
                onClick={submitReview}
                disabled={reviewSubmitting || !reviewRating}
                className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:from-amber-600 hover:to-amber-700 transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {reviewSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <><FiStar size={16} /> Submit Review</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}