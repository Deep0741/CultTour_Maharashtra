import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

export default function TouristDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 FETCH BOOKINGS
  useEffect(() => {
    if (!user?._id) return;

    api
      .get(`/bookings/user/${user._id}`)
      .then((res) => setBookings(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [user]);

  // 🔹 PAYMENT FUNCTION (RAZORPAY DEMO)
  const handlePayment = (booking) => {
    const options = {
      key: "rzp_test_1234567890",
      amount: booking.amount * 100,
      currency: "INR",
      name: "CulTour Maharashtra",
      description: "Guide Booking Payment",

      handler: async function (response) {
        console.log("Payment success:", response);

        try {
          await api.post("/payment/pay", {
            bookingId: booking._id,
          });

          alert("Payment successful ✅");
          window.location.reload();
        } catch (err) {
          console.error(err);
          alert("Payment update failed");
        }
      },

      modal: {
        ondismiss: function () {
          alert("Payment cancelled ❌");
        },
      },

      prefill: {
        name: localStorage.getItem("userName") || "User",
        email: localStorage.getItem("userEmail") || "test@gmail.com",
      },

      theme: {
        color: "#f97316",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-10">

        {/* HEADER */}
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.name || "Tourist"} 👋
        </h1>
        <p className="text-gray-500 mb-8">
          Explore Maharashtra with a local guide.
        </p>

        {/* BOOKINGS */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-semibold text-gray-800">
              My Bookings
            </h2>
          </div>

          {loading ? (
            <p className="p-6 text-gray-400">Loading bookings...</p>
          ) : bookings.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-500 mb-4">
                You haven't booked any tours yet.
              </p>
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

                <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                  <tr>
                    <th className="px-6 py-3 text-left">Destination</th>
                    <th className="px-6 py-3 text-left">Guide</th>
                    <th className="px-6 py-3 text-left">Date</th>
                    <th className="px-6 py-3 text-left">Amount</th>
                    <th className="px-6 py-3 text-left">Status</th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {bookings.map((b) => (
                    <tr key={b._id} className="hover:bg-gray-50 transition">

                      <td className="px-6 py-4 font-medium text-gray-800">
                        {b.destination?.name || "—"}
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {b.guideName || "—"}
                      </td>

                      <td className="px-6 py-4 text-gray-500">
                        {b.date
                          ? new Date(b.date).toLocaleDateString("en-IN")
                          : "—"}
                      </td>

                      <td className="px-6 py-4 font-semibold">
                        ₹{b.amount}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">

                          {/* STATUS */}
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              b.status === "accepted"
                                ? "bg-green-100 text-green-700"
                                : b.status === "rejected"
                                ? "bg-red-100 text-red-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {b.status}
                          </span>

                          {/* PAY BUTTON */}
                          {b.status === "accepted" &&
                            b.paymentStatus !== "paid" && (
                              <button
                                onClick={() => handlePayment(b)}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-xs"
                              >
                                Pay
                              </button>
                            )}

                          {/* PAID */}
                          {b.paymentStatus === "paid" && (
                            <span className="text-green-600 text-xs font-semibold">
                              Paid ✅
                            </span>
                          )}
                        </div>
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