import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

export default function Guides() {

  const [guides, setGuides] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [bookingDate, setBookingDate] = useState("");

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGuides = async () => {
      try {
        const res = await api.get("/guides");
        setGuides(res.data.data || res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchGuides();
  }, []);

  const handleBooking = async () => {
    if (!bookingDate) {
      alert("Please select a date");
      return;
    }

    const userData = JSON.parse(localStorage.getItem("user"));

    try {
      await api.post("/bookings/create", {
        userId: userData._id,
        guideId: selectedGuide._id,
        destinationId: localStorage.getItem("selectedDestination"),
        date: bookingDate,
        amount: selectedGuide.pricePerDay || 1000,
      });

      alert("Booking request sent!");
      setShowModal(false);
      setBookingDate("");
    } catch (err) {
      console.log(err.response?.data);
      alert("Booking failed");
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">

      <h1 className="text-3xl font-bold mb-6">
        Expert Guides
      </h1>

      <div className="grid md:grid-cols-3 gap-6">

        {guides.map((guide) => (
          <div
            key={guide._id}
            className="bg-white rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition p-4"
          >

            <h2 className="text-lg font-bold text-gray-800">
              {guide.name}
            </h2>

            <p className="text-gray-500 text-sm mt-1">
              {guide.bio || "No description available"}
            </p>

            <p className="text-orange-500 font-semibold mt-2">
              ₹{guide.pricePerDay}/day
            </p>

            {user && user.role !== "guide" && (
              <button
                onClick={() => {
                  setSelectedGuide(guide);
                  setShowModal(true);
                }}
                className="w-full mt-3 bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition font-semibold"
              >
                Book Now
              </button>
            )}

          </div>
        ))}

      </div>

      {guides.length === 0 && (
        <p className="text-center text-gray-500 mt-10">
          No guides available.
        </p>
      )}

      {/* ✅ MODAL INSIDE RETURN */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          
          <div className="bg-white rounded-lg p-6 w-[350px] shadow-xl">
            
            <h2 className="text-xl font-semibold mb-4">
              Book {selectedGuide?.name}
            </h2>

            <input
              type="date"
              value={bookingDate}
              onChange={(e) => setBookingDate(e.target.value)}
              className="w-full border px-3 py-2 rounded mb-4"
            />

            <div className="flex justify-between">
              
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleBooking}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Confirm Booking
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}