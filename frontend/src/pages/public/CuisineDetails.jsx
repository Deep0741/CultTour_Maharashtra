import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function CuisineDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cuisine, setCuisine] = useState(null);

  useEffect(() => {
    api.get(`/cuisines/${id}`)
      .then((res) => setCuisine(res.data.data))
      .catch((err) => console.log(err));
  }, [id]);

  if (!cuisine) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Hero Section */}
      <div className="relative h-[500px]">
        <img
          src={cuisine.image || "https://via.placeholder.com/1200"}
          alt={cuisine.name}
          className="w-full h-full object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 bg-white/80 hover:bg-white px-5 py-2 rounded-full shadow-lg"
        >
          ← Back
        </button>

        {/* Title */}
        <div className="absolute bottom-10 left-10 text-white">
          <h1 className="text-5xl font-bold drop-shadow-lg">
            {cuisine.name}
          </h1>
          <p className="text-lg mt-2 text-gray-200">
            Authentic Maharashtrian Dish 🍽️
          </p>
        </div>

        {/* Book Food Tour Button */}
        <button
          onClick={() => navigate("/guides")}
          className="absolute bottom-10 right-10 bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-full text-white font-semibold shadow-lg transition"
        >
          Book Food Tour 🍴
        </button>
      </div>

      {/* Content Section */}
      <div className="max-w-6xl mx-auto px-4 py-12 grid md:grid-cols-2 gap-8">

        {/* Description */}
        <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition">
          <h2 className="text-2xl font-bold mb-4 text-orange-500">
            📖 Description
          </h2>
          <p className="text-gray-700 leading-relaxed text-lg">
            {cuisine.description}
          </p>
        </div>

        {/* Ingredients */}
        <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition">
          <h2 className="text-2xl font-bold mb-4 text-green-500">
            🥗 Ingredients
          </h2>
          <p className="text-gray-700 leading-relaxed text-lg">
            {cuisine.ingredients || "Ingredients information not available."}
          </p>
        </div>

        {/* History */}
        <div className="md:col-span-2 bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition">
          <h2 className="text-2xl font-bold mb-4 text-red-500">
            🏺 History / Origin
          </h2>
          <p className="text-gray-700 leading-relaxed text-lg">
            {cuisine.history || "History information not available."}
          </p>
        </div>

      </div>
    </div>
  );
}