import { useLocation, Link } from "react-router-dom";

export default function BookingConfirmation() {
  const location = useLocation();
  const booking = location.state?.booking;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-10">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-xl w-full">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-green-600 mb-2">
            Booking Confirmed 🎉
          </h1>
          <p className="text-gray-600 mb-6">
            Your booking has been successfully placed.
          </p>
        </div>

        {booking ? (
          <div className="bg-gray-100 rounded-xl p-5 space-y-3 mb-6">
            <div className="flex justify-between">
              <span className="font-semibold">Booking ID:</span>
              <span>{booking._id}</span>
            </div>

            <div className="flex justify-between">
              <span className="font-semibold">Destination:</span>
              <span>{booking.destinationName}</span>
            </div>

            <div className="flex justify-between">
              <span className="font-semibold">Guide:</span>
              <span>{booking.guideName}</span>
            </div>

            <div className="flex justify-between">
              <span className="font-semibold">Date:</span>
              <span>{booking.date}</span>
            </div>

            <div className="flex justify-between">
              <span className="font-semibold">Status:</span>
              <span className="text-green-600 font-semibold">Confirmed</span>
            </div>
          </div>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-yellow-700">
            No booking details found.
          </div>
        )}

        <div className="flex gap-4 justify-center">
          <Link
            to="/tourist/dashboard"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition"
          >
            Go to Dashboard
          </Link>

          <Link
            to="/destinations"
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-medium transition"
          >
            Explore More
          </Link>
        </div>
      </div>
    </div>
  );
}