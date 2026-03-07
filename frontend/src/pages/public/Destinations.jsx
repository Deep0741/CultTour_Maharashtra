import { useEffect, useState } from "react";
import api from "../../services/api";

export default function Destinations() {
  const [destinations, setDestinations] = useState([]);

  useEffect(() => {
    api.get("/destinations")
      .then(res => setDestinations(res.data.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Destinations</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {destinations.map(dest => (
          <div key={dest.id} className="bg-white shadow rounded-lg p-4">
            <img
              src={dest.image || "https://via.placeholder.com/400"}
              alt={dest.name}
              className="h-40 w-full object-cover rounded"
            />
            <h2 className="text-xl font-semibold mt-3">{dest.name}</h2>
            <p className="text-gray-600 mt-2">{dest.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}