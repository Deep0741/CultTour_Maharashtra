import { Link } from 'react-router-dom';
import { FaMapMarkedAlt, FaUtensils, FaUsers, FaRobot } from 'react-icons/fa';
import { useEffect, useState } from "react";
import api from "../../services/api";

const Home = () => {
  const [destinations, setDestinations] = useState([]);

useEffect(() => {
  api.get("/destinations?limit=3&sort=rating")
    .then(res => {
      console.log("DESTINATIONS:", res.data);
      setDestinations(res.data.data);
    })
    .catch(err => console.log(err));
}, []);

// scroll popular destination 
useEffect(() => {
  const container = document.querySelector(".overflow-x-auto");

  const scrollInterval = setInterval(() => {
    if (container) {
      container.scrollLeft += 320;
      if (
        container.scrollLeft + container.clientWidth >=
        container.scrollWidth
      ) {
        container.scrollLeft = 0;
      }
    }
  }, 3000);

  return () => clearInterval(scrollInterval);
}, [destinations]);

  return (
    <div className="min-h-screen">

      {/* Hero Section */}
      <section
        className="relative text-white py-20 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1651431301792-39edddc3b1e9?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')"
        }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">
              Discover Maharashtra's Rich Heritage
            </h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Explore historic forts, vibrant festivals, and authentic Maharashtrian cuisine 
              with expert local guides
            </p>
            <div className="flex justify-center space-x-4">
              <Link to="/destinations" className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
                Explore Destinations
              </Link>
              <Link to="/guides" className="border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition">
                Find a Guide
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">What We Offer</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="card p-6 text-center">
              <FaMapMarkedAlt className="text-5xl text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Historic Destinations</h3>
              <p className="text-gray-600">
                Explore UNESCO sites, ancient forts, and cultural landmarks
              </p>
            </div>

            <div className="card p-6 text-center">
              <FaUtensils className="text-5xl text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Authentic Cuisine</h3>
              <p className="text-gray-600">
                Discover traditional dishes from Vada Pav to Puran Poli
              </p>
            </div>

            <div className="card p-6 text-center">
              <FaUsers className="text-5xl text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Expert Guides</h3>
              <p className="text-gray-600">
                Book verified local guides for personalized experiences
              </p>
            </div>

            <div className="card p-6 text-center">
              <FaRobot className="text-5xl text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">AI Assistant</h3>
              <p className="text-gray-600">
                Get instant recommendations and itinerary suggestions
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Popular Destinations</h2>
            <Link to="/destinations" className="text-primary-600 hover:text-primary-700 font-medium">
              View All →
            </Link>
          </div>

          <div className="overflow-x-auto no-scrollbar">
            <div className="flex gap-6 w-max">
              {destinations.map((item) => (
                <div
                  key={item._id}
                  className="min-w-[300px] bg-white shadow rounded-lg overflow-hidden"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-48 w-full object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2">{item.name}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                      {item.description}
                    </p>

                    <Link
                      to={`/destinations/${item._id}`}
                      className="text-primary-600 font-medium hover:underline"
                    >
                      Learn More →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-xl mb-8">
            Join thousands of travelers exploring Maharashtra's hidden gems
          </p>
          <Link to="/register" className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition inline-block">
            Get Started Today
          </Link>
        </div>
      </section>

    </div>
  );
};

export default Home;