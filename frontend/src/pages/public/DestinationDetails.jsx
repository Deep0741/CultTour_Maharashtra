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

  if (!destination) return <div className="p-10">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <img
        src={destination.image}
        alt={destination.name}
        className="w-full h-[400px] object-cover rounded-lg mb-6"
      />

      <h1 className="text-4xl font-bold mb-4">
        {destination.name}
      </h1>

      <p className="text-gray-600 mb-2">
        📍 {destination.location?.city}, {destination.location?.district}
      </p>

      <p className="text-yellow-500 mb-4">
        ⭐ {destination.rating}
      </p>

      <p className="text-blue-600 mb-2">
         Latitude: {destination.location?.coordinates?.latitude}
        <br />
          Longitude: {destination.location?.coordinates?.longitude}
      </p>
      <p className="text-lg text-gray-700 leading-relaxed">
        {destination.description}
      </p>
    </div>
  );
}