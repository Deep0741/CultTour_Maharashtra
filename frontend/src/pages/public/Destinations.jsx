import { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Import Link
import api from "../../services/api";

export default function Destinations() {
  const [destinations, setDestinations] = useState([]);

  useEffect(() => {
    api.get("/destinations")
      .then(res => setDestinations(res.data.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Explore Maharashtra</h1>
        <p className="text-gray-500 mb-10 text-lg">Discover the soul of the Sahyadris, from ancient forts to coastal escapes.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinations.map(dest => (
            <Link 
              to={`/destinations/${dest._id}`} // Link to the Details page
              key={dest._id} 
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={dest.images?.[0]?.url || "https://via.placeholder.com/400"}
                  alt={dest.name}
                  className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-orange-600 uppercase tracking-widest">
                  {dest.category}
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-2xl font-bold text-gray-800">{dest.name}</h2>
                  <span className="text-yellow-500 font-bold">★ {dest.rating}</span>
                </div>
                <p className="text-gray-600 line-clamp-3 text-sm leading-relaxed">
                  {dest.description}
                </p>
                <div className="mt-4 flex items-center text-orange-500 font-semibold text-sm">
                  View Details 
                  <span className="ml-2 group-hover:translate-x-2 transition-transform">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}