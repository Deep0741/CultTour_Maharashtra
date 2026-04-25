import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

export default function Cuisines() {
  const [cuisines, setCuisines] = useState([]);

  useEffect(() => {
    api.get("/cuisines")
      .then(res => setCuisines(res.data.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div className="min-h-screen">

      {/* Header */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">
            Authentic Maharashtrian Cuisine
          </h1>
          <p className="text-gray-600">
            Discover traditional dishes from across Maharashtra.
          </p>
        </div>
      </section>

      {/* Cards */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {cuisines.map((item) => (
          <Link to={`/cuisine/${item._id}`} key={item._id}>
            <div
              className="group bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl hover:-translate-y-2 transition duration-300"
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={item.image || "https://via.placeholder.com/400"}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white text-xl font-bold">
                  {item.name}
                </div>
              </div>

              <div className="p-6">
                <p className="text-gray-600 line-clamp-2">
                  {item.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

    </div>
  );
}