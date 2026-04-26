import { useEffect, useState } from "react";
import api from "../../services/api";
import { useParams, useNavigate } from "react-router-dom";
import { FiCheckCircle, FiArrowRight } from 'react-icons/fi';

export default function BookingConfirmation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    api.get(`/bookings/${id}`)
      .then(res => setBooking(res.data))
      .catch(err => console.log(err));
  }, [id]);

  const handlePayment = async () => {
    try {
      await api.post("/payment/verify", { bookingId: id });
      alert("Payment Successful (Mock)");
      const res = await api.get(`/bookings/${id}`);
      setBooking(res.data);
    } catch (err) {
      console.error(err);
      alert("Payment failed");
    }
  };

  if (!booking) return (
    <div className="min-h-screen flex items-center justify-center bg-mesh">
      <div className="spinner" />
    </div>
  );

  const statusConfig = {
    pending: { color: "text-amber-600", bg: "bg-amber-50" },
    accepted: { color: "text-blue-600", bg: "bg-blue-50" },
    completed: { color: "text-emerald-600", bg: "bg-emerald-50" },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-mesh px-4">
      <div className="card p-8 max-w-md w-full text-center border border-surface-100 animate-scale-in">
        <h2 className="text-2xl font-bold text-surface-800 mb-6">Booking Status</h2>

        <div className={`${statusConfig[booking.status]?.bg || 'bg-surface-50'} rounded-2xl p-4 mb-4`}>
          <p className={`text-lg font-bold ${statusConfig[booking.status]?.color || 'text-surface-700'}`}>
            {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1)}
          </p>
        </div>

        <p className="text-surface-600 mb-6">
          <span className="font-medium">Amount:</span> ₹{booking.amount}
        </p>

        {booking.status === "accepted" && (
          <button onClick={handlePayment}
            className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-3.5 rounded-xl font-semibold hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-md text-lg">
            💳 Pay Now
          </button>
        )}

        {booking.status === "completed" && (
          <div className="animate-scale-in">
            <FiCheckCircle className="text-emerald-500 mx-auto mb-3" size={48} />
            <p className="text-emerald-600 text-xl font-bold mb-6">Payment Successful 🎉</p>
            <button onClick={() => navigate("/tourist/dashboard")}
              className="w-full btn-primary !py-3.5 text-lg flex items-center justify-center gap-2">
              Go to Dashboard <FiArrowRight />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}