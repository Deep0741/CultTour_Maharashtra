import { useEffect, useState } from "react";
import api from "../../services/api";

export default function Guides() {
  const [guides, setGuides] = useState([]);

  useEffect(() => {
    api.get("/api/v1/guides")
      .then(res => setGuides(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Expert Guides</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {guides.map(guide => (
          <div key={guide.id} className="bg-white shadow rounded-lg p-4">
            <h2 className="text-xl font-semibold">{guide.name}</h2>
            <p className="text-gray-600 mt-2">{guide.bio}</p>
            <p className="text-orange-600 font-bold mt-2">
              ₹{guide.pricePerTour}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}