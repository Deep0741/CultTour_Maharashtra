import { useEffect, useState } from "react";
<<<<<<< Updated upstream
=======
import { Link, useNavigate } from "react-router-dom";
>>>>>>> Stashed changes
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

export default function Destinations() {
  const [destinations, setDestinations] = useState([]);

<<<<<<< Updated upstream
=======
  const { user } = useAuth();        // ✅ FIX
  const navigate = useNavigate();    // ✅ FIX

>>>>>>> Stashed changes
  useEffect(() => {
    api.get("/destinations")
      .then(res => setDestinations(res.data.data))
      .catch(err => console.log(err));
  }, []);

  return (
<<<<<<< Updated upstream
    <div className="max-w-6xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Destinations</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {destinations.map(dest => (
          <div key={dest.id} className="bg-white shadow rounded-lg p-4">
=======
    <div className="max-w-7xl mx-auto py-12 px-6">

      {/* HEADER */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-gray-800">
          Explore Maharashtra
        </h1>

        <p className="text-gray-500 mt-2">
          Discover forts, culture, nature and hidden gems across Maharashtra
        </p>
      </div>

      {/* SEARCH */}
      <div className="flex justify-center mb-10">
        <input
          type="text"
          placeholder="Search destinations..."
          className="w-full max-w-md border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* GRID */}
      <div className="grid md:grid-cols-3 gap-8">

        {filteredDestinations.map(dest => (

          <div
            key={dest._id}
            className="bg-white rounded-lg shadow-md hover:shadow-xl transition overflow-hidden"
          >

            {/* IMAGE */}
>>>>>>> Stashed changes
            <img
              src={dest.image || "https://via.placeholder.com/400"}
              alt={dest.name}
              className="h-40 w-full object-cover rounded"
            />
<<<<<<< Updated upstream
            <h2 className="text-xl font-semibold mt-3">{dest.name}</h2>
            <p className="text-gray-600 mt-2">{dest.description}</p>
=======

            {/* CONTENT */}
            <div className="p-5">

              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold text-gray-800">
                  {dest.name}
                </h2>

                <span className="text-yellow-500 text-sm">
                  ⭐ {dest.rating || "4.5"}
                </span>
              </div>

              <p className="text-gray-500 text-sm mb-2">
                📍 {dest.location?.city}, {dest.location?.district}
              </p>

              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {dest.description}
              </p>

              {/* BUTTONS */}
              <div className="flex gap-2">

                <Link
                  to={`/destinations/${dest._id}`}
                  className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 text-sm"
                >
                  View Details
                </Link>

                {/* ✅ BOOK GUIDE BUTTON */}
                {user && user.role !== "guide" && (
                  <button
                    onClick={() => navigate("/guides")}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm"
                  >
                    Book Guide
                  </button>
                )}

              </div>

            </div>

>>>>>>> Stashed changes
          </div>
        ))}
      </div>
<<<<<<< Updated upstream
=======

      {/* NO RESULTS */}
      {filteredDestinations.length === 0 && (
        <p className="text-center text-gray-500 mt-10">
          No destinations found.
        </p>
      )}

>>>>>>> Stashed changes
    </div>
  );
}