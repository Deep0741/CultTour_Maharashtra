import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { FiSearch, FiMapPin, FiStar, FiArrowRight } from 'react-icons/fi';

export default function Destinations() {
  const [destinations, setDestinations] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/destinations")
      .then(res => setDestinations(res.data.data))
      .catch(err => console.log(err));
  }, []);

  const categories = ['All', 'fort', 'heritage', 'festival', 'cuisine', 'temple', 'beach', 'hill_station', 'wildlife'];

  const filteredDestinations = destinations.filter((dest) => {
    const matchSearch = dest.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = !category || category === 'All' ? true : dest.category === category;
    return matchSearch && matchCategory;
  });

  return (
    <div className="min-h-screen bg-mesh">

      {/* Header */}
      <section className="relative py-16 pb-20">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-500 to-accent-600" />
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3 animate-slide-up">
            Explore Maharashtra
          </h1>
          <p className="text-white/70 text-lg max-w-xl mx-auto animate-slide-up stagger-1">
            Discover forts, culture, nature and hidden gems across the land
          </p>

          {/* Search */}
          <div className="max-w-lg mx-auto mt-8 animate-slide-up stagger-2">
            <div className="relative">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400" size={20} />
              <input
                type="text"
                placeholder="Search destinations..."
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/95 backdrop-blur-sm border-0 shadow-lg focus:ring-2 focus:ring-white/50 outline-none text-surface-700 placeholder:text-surface-400"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Category Filters */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 bg-white/80 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-lg border border-surface-100">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat === 'All' ? '' : cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 border ${
                (cat === 'All' && !category) || category === cat
                  ? 'bg-primary-500 text-white border-primary-500 shadow-md'
                  : 'bg-white text-surface-600 border-surface-200 hover:border-primary-300 hover:text-primary-600'
              }`}
            >
              {cat === 'All' ? '✨ All' : cat.replace('_', ' ').replace(/^\w/, c => c.toUpperCase())}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <p className="text-sm text-surface-400 mb-6">{filteredDestinations.length} destination{filteredDestinations.length !== 1 ? 's' : ''} found</p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDestinations.map((dest, i) => (
            <div
              key={dest._id}
              className="group card overflow-hidden border border-surface-100 hover:-translate-y-1 animate-fade-in"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={dest.image || "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800"}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                {dest.category && (
                  <span className="absolute top-3 left-3 badge bg-white/90 backdrop-blur-sm text-surface-700 !text-xs">
                    {dest.category.replace('_', ' ')}
                  </span>
                )}
                <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1">
                  <FiStar className="text-amber-500" size={13} />
                  <span className="text-xs font-semibold">{dest.rating?.toFixed(1) || "4.5"}</span>
                </div>
              </div>

              <div className="p-5">
                <h2 className="text-lg font-bold text-surface-800 mb-1 group-hover:text-primary-600 transition-colors">
                  {dest.name}
                </h2>
                <p className="flex items-center gap-1 text-sm text-surface-400 mb-3">
                  <FiMapPin size={13} />
                  {dest.location?.city}, {dest.location?.district}
                </p>
                <p className="text-sm text-surface-500 mb-4 line-clamp-2">
                  {dest.description}
                </p>

                <div className="flex gap-2">
                  <Link
                    to={`/destinations/${dest._id}`}
                    className="flex-1 flex items-center justify-center gap-1.5 btn-primary !py-2 text-sm"
                  >
                    View Details <FiArrowRight size={14} />
                  </Link>
                  {user && user.role !== "guide" && (
                    <button
                      onClick={() => navigate(`/destinations/${dest._id}`)}
                      className="btn-outline !py-2 text-sm !px-4"
                    >
                      Book
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredDestinations.length === 0 && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🏔️</div>
            <p className="text-surface-500 text-lg">No destinations found.</p>
            <p className="text-surface-400 text-sm mt-1">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}