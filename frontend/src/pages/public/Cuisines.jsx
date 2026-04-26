import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { FiSearch } from 'react-icons/fi';

export default function Cuisines() {
  const [cuisines, setCuisines] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api.get("/cuisines")
      .then(res => setCuisines(res.data.data))
      .catch(err => console.log(err));
  }, []);

  const filtered = cuisines.filter(c =>
    c.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-mesh">
      {/* Header */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-500 to-emerald-600" />
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3 animate-slide-up">
            Authentic Maharashtrian Cuisine
          </h1>
          <p className="text-white/70 text-lg max-w-xl mx-auto animate-slide-up stagger-1">
            Discover traditional dishes and book food tours with local experts
          </p>
          <div className="max-w-lg mx-auto mt-8 animate-slide-up stagger-2">
            <div className="relative">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400" size={20} />
              <input
                type="text"
                placeholder="Search cuisines..."
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/95 backdrop-blur-sm border-0 shadow-lg focus:ring-2 focus:ring-white/50 outline-none text-surface-700 placeholder:text-surface-400"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Cards */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item, i) => (
            <Link to={`/cuisine/${item._id}`} key={item._id}>
              <div
                className="group card overflow-hidden border border-surface-100 hover:-translate-y-2 transition-all duration-500 animate-fade-in"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={item.image || "https://images.unsplash.com/photo-1567337710282-00832b415979?w=800"}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <h3 className="text-xl font-bold text-white drop-shadow-lg">{item.name}</h3>
                    {item.region && (
                      <span className="text-xs text-white/70 mt-1 block">{item.region}</span>
                    )}
                  </div>
                  {item.type && (
                    <span className={`absolute top-3 right-3 badge ${
                      item.type === 'veg' ? 'bg-emerald-500/90 text-white' :
                      item.type === 'non-veg' ? 'bg-red-500/90 text-white' :
                      'bg-teal-500/90 text-white'
                    }`}>
                      {item.type}
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <p className="text-surface-500 text-sm line-clamp-2 mb-3">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-primary-600 font-semibold text-sm group-hover:underline">
                      View Details →
                    </span>
                    {item.averagePrice && (
                      <span className="text-surface-400 text-sm">₹{item.averagePrice}</span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🍽️</div>
            <p className="text-surface-500 text-lg">No cuisines found.</p>
          </div>
        )}
      </div>
    </div>
  );
}