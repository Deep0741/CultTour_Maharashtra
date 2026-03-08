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

  if (!destination) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  return (
    <div className="bg-white">
      {/* Hero Image Section */}
      <div className="relative h-[60vh] w-full">
        <img
          src={destination.images?.[0]?.url}
          alt={destination.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex items-end">
          <div className="max-w-7xl mx-auto w-full px-6 pb-12">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">{destination.name}</h1>
            <p className="text-white/90 text-xl flex items-center">
              📍 {destination.location?.city}, {destination.location?.district}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-12 px-6 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <section className="mb-10">
            <h2 className="text-3xl font-bold mb-4 text-gray-800">About the Destination</h2>
            <p className="text-lg text-gray-600 leading-relaxed italic border-l-4 border-orange-500 pl-4 mb-6">
              {destination.description}
            </p>
            <h3 className="text-2xl font-bold mb-4">Historical Significance</h3>
            <p className="text-gray-700 leading-relaxed">{destination.history || "History details coming soon..."}</p>
          </section>

          {/* Local Cuisines Section */}
          <section>
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Must-Try Local Flavors 🍲</h2>
            <div className="grid grid-cols-2 gap-4">
              {destination.localCuisines?.map(food => (
                <div key={food._id} className="flex items-center p-4 border rounded-xl hover:bg-orange-50 transition-colors">
                  <img src={food.images?.[0]} className="w-16 h-16 rounded-full object-cover mr-4" />
                  <span className="font-semibold text-gray-800">{food.name}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar Info */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 p-8 rounded-3xl sticky top-10 border border-gray-100">
            <h3 className="text-xl font-bold mb-6">Plan Your Visit</h3>
            
            <div className="space-y-6">
              <div>
                <p className="text-sm text-gray-500 uppercase font-bold tracking-widest">Best Time</p>
                <p className="text-gray-800 font-medium">{destination.bestTimeToVisit || "Year Round"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 uppercase font-bold tracking-widest">Entry Fee</p>
                <p className="text-gray-800 font-medium">₹{destination.entryFee?.indian} (Indian) / ₹{destination.entryFee?.foreign} (Foreign)</p>
              </div>
              <button className="w-full bg-orange-600 text-white py-4 rounded-xl font-bold hover:bg-orange-700 transition-colors shadow-lg shadow-orange-200">
                Book a Local Guide
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}