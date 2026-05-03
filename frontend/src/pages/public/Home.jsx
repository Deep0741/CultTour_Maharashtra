import { Link } from 'react-router-dom';
import { useEffect, useState } from "react";
import api from "../../services/api";
import { FiMapPin, FiStar, FiArrowRight, FiCompass, FiCoffee, FiUsers, FiMessageCircle } from 'react-icons/fi';

const Home = () => {
  const [destinations, setDestinations] = useState([]);

  useEffect(() => {
    api.get("/destinations?limit=6&sort=rating")
      .then(res => setDestinations(res.data.data))
      .catch(err => console.log(err));
  }, []);

  const features = [
    {
      icon: <FiCompass size={28} />,
      title: "Historic Destinations",
      desc: "Explore UNESCO sites, ancient forts, and cultural landmarks across Maharashtra.",
      color: "from-primary-500 to-primary-600",
    },
    {
      icon: <FiCoffee size={28} />,
      title: "Authentic Cuisine",
      desc: "Discover traditional dishes from Vada Pav to Puran Poli with food tours.",
      color: "from-emerald-500 to-emerald-600",
    },
    {
      icon: <FiUsers size={28} />,
      title: "Expert Guides",
      desc: "Book verified local guides for personalized cultural experiences.",
      color: "from-accent-500 to-accent-600",
    },
    {
      icon: <FiMessageCircle size={28} />,
      title: "AI Assistant",
      desc: "Get instant recommendations and itinerary suggestions powered by AI.",
      color: "from-teal-500 to-teal-600",
    },
  ];

  const stats = [
    { value: "500+", label: "Destinations" },
    { value: "200+", label: "Expert Guides" },
    { value: "10K+", label: "Happy Tourists" },
    { value: "4.8", label: "Avg Rating" },
  ];

  return (
    <div className="min-h-screen">

      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1651431301792-39edddc3b1e9?q=80&w=1332&auto=format&fit=crop')"
          }}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-surface-950/90 via-surface-900/70 to-surface-900/50" />

        {/* Floating Decorative Elements */}
        <div className="absolute top-20 right-20 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 left-10 w-56 h-56 bg-accent-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full px-4 py-1.5 text-sm text-white/80 mb-6 animate-fade-in">
              <span className="w-2 h-2 bg-primary-400 rounded-full animate-pulse" />
              Explore Maharashtra's Heritage
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.1] mb-6 animate-slide-up">
              Discover the
              <span className="block bg-gradient-to-r from-primary-400 to-primary-300 bg-clip-text text-transparent">
                Soul of Maharashtra
              </span>
            </h1>

            <p className="text-lg md:text-xl text-white/70 mb-8 max-w-xl leading-relaxed animate-slide-up stagger-2">
              Explore historic forts, vibrant festivals, and authentic Maharashtrian cuisine with expert local guides who bring history alive.
            </p>

            <div className="flex flex-wrap gap-4 animate-slide-up stagger-3">
              <Link to="/destinations" className="btn-primary !px-8 !py-3.5 text-base">
                Explore Destinations
                <FiArrowRight className="inline ml-2" />
              </Link>
              <Link to="/guides" className="btn-glass !px-8 !py-3.5 text-base">
                Find a Guide
              </Link>
            </div>

            {/* Stats Bar */}
            <div className="flex flex-wrap gap-8 mt-12 animate-fade-in stagger-4">
              {stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <p className="text-2xl md:text-3xl font-bold text-white">{stat.value}</p>
                  <p className="text-xs text-white/50 mt-1 uppercase tracking-wider">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURES SECTION ===== */}
      <section className="py-20 bg-mesh">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="section-title">What We <span className="gradient-text">Offer</span></h2>
            <p className="section-subtitle mx-auto">
              Everything you need for an unforgettable Maharashtra experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <div
                key={i}
                className="group card p-7 text-center hover:-translate-y-2 transition-all duration-500 border border-surface-100"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} text-white flex items-center justify-center mx-auto mb-5 group-hover:scale-110 group-hover:shadow-lg transition-all duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-surface-800 mb-2">{feature.title}</h3>
                <p className="text-sm text-surface-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== POPULAR DESTINATIONS ===== */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="section-title">Popular <span className="gradient-text">Destinations</span></h2>
              <p className="section-subtitle">Hand-picked places that define Maharashtra</p>
            </div>
            <Link to="/destinations" className="hidden md:flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold transition-colors group">
              View All
              <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.slice(0, 6).map((item, i) => (
              <Link
                to={`/destinations/${item._id}`}
                key={item._id}
                className="group card overflow-hidden border border-surface-100 hover:-translate-y-1"
              >
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={item.image || 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800'}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  {item.category && (
                    <span className="absolute top-3 left-3 badge bg-white/90 backdrop-blur-sm text-surface-700 !text-xs">
                      {item.category.replace('_', ' ')}
                    </span>
                  )}
                  <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1">
                    <FiStar className="text-amber-500" size={13} />
                    <span className="text-xs font-semibold text-surface-700">{item.rating?.toFixed(1) || '4.5'}</span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-surface-800 mb-1 group-hover:text-primary-600 transition-colors">{item.name}</h3>
                  {item.location && (
                    <p className="flex items-center gap-1 text-sm text-surface-400 mb-2">
                      <FiMapPin size={13} />
                      {item.location.city}, {item.location.district}
                    </p>
                  )}
                  <p className="text-sm text-surface-500 line-clamp-2">{item.description}</p>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8 md:hidden">
            <Link to="/destinations" className="btn-outline">
              View All Destinations
            </Link>
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-500 to-accent-600" />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />

        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-5">
            Ready to Start Your Journey?
          </h2>
          <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
            Join thousands of travelers discovering Maharashtra's hidden gems with expert local guides.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 bg-white text-primary-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-surface-50 hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            Get Started Today
            <FiArrowRight />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;