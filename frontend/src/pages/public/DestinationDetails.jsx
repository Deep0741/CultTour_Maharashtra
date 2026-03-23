import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";

export default function DestinationDetails() {

  const { id } = useParams();
  const [destination, setDestination] = useState(null);

  useEffect(() => {

    api.get(`/destinations/${id}`)
      .then(res => setDestination(res.data.data))
      .catch(err => console.log(err));

  }, [id]);

  if (!destination) {
    return (
      <div className="p-10 text-center text-gray-600">
        Loading destination...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">

      {/* HERO IMAGE */}
      <img
        src={destination.image || "https://via.placeholder.com/900"}
        alt={destination.name}
        className="w-full h-[420px] object-cover rounded-lg mb-8 shadow"
      />

      {/* TITLE + LOCATION */}
      <h1 className="text-4xl font-bold mb-2">
        {destination.name}
      </h1>

      <p className="text-gray-600 mb-2">
        📍 {destination.location?.city}, {destination.location?.district}
      </p>

      <p className="text-yellow-500 text-lg mb-6">
        ⭐ {destination.rating || "4.5"}
      </p>

      {/* DESCRIPTION */}
      <div className="bg-white shadow rounded-lg p-6 mb-8">

        <h2 className="text-2xl font-semibold mb-3">
          About this Destination
        </h2>

        <p className="text-gray-700 leading-relaxed">
          {destination.description}
        </p>

      </div>


      {/* LOCATION INFO */}
      <div className="bg-gray-100 p-6 rounded-lg mb-8">

        <h2 className="text-xl font-semibold mb-4">
          Location Information
        </h2>

        <p className="text-gray-700">
          City: {destination.location?.city}
        </p>

        <p className="text-gray-700">
          District: {destination.location?.district}
        </p>

        <p className="text-gray-700">
          Latitude: {destination.location?.coordinates?.latitude}
        </p>

        <p className="text-gray-700">
          Longitude: {destination.location?.coordinates?.longitude}
        </p>

      </div>


      {/* GOOGLE MAP */}
      {destination.location?.coordinates && (

        <div className="mb-10">

          <h2 className="text-2xl font-semibold mb-4">
            Location on Map
          </h2>

          <iframe
            title="destination-map"
            className="w-full h-[350px] rounded-lg"
            src={`https://maps.google.com/maps?q=${destination.location.coordinates.latitude},${destination.location.coordinates.longitude}&z=14&output=embed`}
          />

        </div>

      )}


      {/* EXPERIENCE SECTION */}
      <div className="grid md:grid-cols-3 gap-6">

        <div className="bg-white shadow rounded-lg p-5 text-center">

          <h3 className="text-lg font-semibold mb-2">
            🧭 Explore with Guides
          </h3>

          <p className="text-gray-500 text-sm">
            Discover this place with experienced local guides.
          </p>

        </div>


        <div className="bg-white shadow rounded-lg p-5 text-center">

          <h3 className="text-lg font-semibold mb-2">
            🍲 Local Cuisine
          </h3>

          <p className="text-gray-500 text-sm">
            Taste authentic local food around this destination.
          </p>

        </div>


        <div className="bg-white shadow rounded-lg p-5 text-center">

          <h3 className="text-lg font-semibold mb-2">
            📸 Photography Spots
          </h3>

          <p className="text-gray-500 text-sm">
            Capture breathtaking landscapes and scenic views.
          </p>

        </div>

      </div>

    </div>
  );
}