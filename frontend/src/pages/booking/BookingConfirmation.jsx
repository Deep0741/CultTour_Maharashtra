import { useEffect, useState } from "react";
import api from "../../services/api";
import { useParams, useNavigate } from "react-router-dom";

export default function BookingConfirmation() {
  const { id } = useParams(); // bookingId from URL
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);

  // ✅ FETCH BOOKING DETAILS
  useEffect(() => {
    api.get(`/api/v1/bookings/${id}`)
      .then(res => setBooking(res.data))
      .catch(err => console.log(err));
  }, [id]);

  // ✅ HANDLE PAYMENT
  const handlePayment = async () => {
    try {
      const handlePayment = async () => {
  try {
    await api.post("/api/v1/payment/verify", {
      bookingId: id
    });

    alert("Payment Successful (Mock)");

    // refresh booking state
    const res = await api.get(`/api/v1/bookings/${id}`);
    setBooking(res.data);

  } catch (err) {
    console.error(err);
    alert("Payment failed");
  }
};

    } catch (err) {
      console.error(err);
      alert("Payment failed");
    }
  };

  if (!booking) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow text-center w-96">

        <h2 className="text-2xl font-bold mb-4">
          Booking Status
        </h2>

        <p className={`mb-2 font-semibold ${
  booking.status === "PENDING" ? "text-gray-500" :
  booking.status === "ACCEPTED" ? "text-blue-500" :
  booking.status === "CONFIRMED" ? "text-green-600" :
  "text-black"
}`}>
  Status: {booking.status}
</p>
        <p className="mb-2"><b>Amount:</b> ₹{booking.amount}</p>

        {/* ✅ PAYMENT BUTTON */}
        {booking.status === "ACCEPTED" && (
          <button
            onClick={handlePayment}
            className="mt-6 bg-green-600 text-white px-6 py-3 rounded w-full"
          >
            Pay Now
          </button>
        )}

        {/* ✅ AFTER PAYMENT */}
        {booking.status === "CONFIRMED" && (
          <>
            <h2 className="text-green-600 text-xl mt-4">
              Payment Successful 🎉
            </h2>

            <button
              onClick={() => navigate("/tourist/dashboard")}
              className="mt-6 bg-orange-600 text-white px-6 py-3 rounded w-full"
            >
              Go to Dashboard
            </button>
          </>
        )}

      </div>
    </div>
  );
}