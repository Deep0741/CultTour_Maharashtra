import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../services/api"; // ✅ use this
import { useAuth } from "../../context/AuthContext";

export default function Guides() {

  const [guides, setGuides] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  // 🔹 FETCH GUIDES
  useEffect(() => {
    const fetchGuides = async () => {
      try {
        // ✅ use api instance (has token if needed)
        const res = await api.get("/guides"); 

        console.log("API RESPONSE:", res.data);

        // handle both formats safely
        setGuides(res.data.data || res.data);

      } catch (err) {
        console.error("GUIDE FETCH ERROR:", err.response?.data || err.message);
      }
    };

    fetchGuides();
  }, []);

  // 🔹 BOOKING FUNCTION
  const handleBooking = async (guide) => {
  const date = prompt("Enter booking date (YYYY-MM-DD)");

  if (!date) {
    alert("Please select a date");
    return;
  }

  const user = JSON.parse(localStorage.getItem("user"));
  const destinationId = localStorage.getItem("selectedDestination");

  if (!user?._id) {
    alert("User not logged in");
    return;
  }

  if (!destinationId) {
    alert("Please select a destination first");
    return;
  }

  try {
    await api.post("/bookings/create", {
      userId: user._id,
      guideId: guide._id,
      destinationId: destinationId, // ✅ REAL VALUE
      date: date,
      amount: guide.pricePerDay || 1000,
    });

    alert("Booking request sent!");
  } catch (err) {
    console.log("ERROR:", err.response?.data);
    alert(err.response?.data?.message || "Booking failed");
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
            className="bg-white shadow-md rounded-lg p-5 hover:shadow-lg transition"
          >

            <h2 className="text-xl font-semibold text-gray-800">
              {guide.name || "Guide"}
            </h2>

            <p className="text-gray-600 mt-2 text-sm">
              {guide.bio || "No description available"}
            </p>

            <p className="text-orange-600 font-bold mt-3">
              ₹{guide.pricePerDay}
            </p>

            {user && user.role !== "guide" && (
              <button onClick={() => handleBooking(guide._id)}>
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

    </div>
  );
}