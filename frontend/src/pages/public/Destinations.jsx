import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

export default function Destinations() {

  const [destinations, setDestinations] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {

    api.get("/destinations")
      .then(res => setDestinations(res.data.data))
      .catch(err => console.log(err));

  }, []);

  const filteredDestinations = destinations.filter(dest =>
    dest.name.toLowerCase().includes(search.toLowerCase())
  );

  return (

    <div className="max-w-7xl mx-auto py-12 px-6">

      {/* PAGE HEADER */}
      <div className="mb-10 text-center">

        <h1 className="text-4xl font-bold text-gray-800">
          Explore Maharashtra
        </h1>

        <p className="text-gray-500 mt-2">
          Discover forts, culture, nature and hidden gems across Maharashtra
        </p>

      </div>


      {/* SEARCH BAR */}
      <div className="flex justify-center mb-10">

        <input
          type="text"
          placeholder="Search destinations..."
          className="w-full max-w-md border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

      </div>


      {/* DESTINATION GRID */}
      <div className="grid md:grid-cols-3 gap-8">

        {filteredDestinations.map(dest => (

          <div
            key={dest._id}
            className="bg-white rounded-lg shadow-md hover:shadow-xl transition overflow-hidden"
          >

            {/* IMAGE */}
            <img
              src={dest.image || "https://via.placeholder.com/500"}
              alt={dest.name}
              className="h-52 w-full object-cover"
            />

            {/* CARD CONTENT */}
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


              <Link
                to={`/destinations/${dest._id}`}
                className="inline-block bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 text-sm"
              >
                View Details
              </Link>

            </div>

          </div>

        ))}

      </div>


      {/* NO RESULTS */}
      {filteredDestinations.length === 0 && (

        <p className="text-center text-gray-500 mt-10">
          No destinations found.
        </p>

      )}

    </div>

  );

}