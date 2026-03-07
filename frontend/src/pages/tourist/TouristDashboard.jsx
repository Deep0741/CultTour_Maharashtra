export default function TouristDashboard(){

return(

<div className="bg-gray-100 min-h-screen">

<div className="max-w-6xl mx-auto px-4 py-10">

<h1 className="text-3xl font-bold mb-8">
Tourist Dashboard
</h1>


{/* SEARCH GUIDES CARD */}

<div className="bg-white p-6 rounded-xl shadow mb-8">

<h2 className="text-xl font-semibold mb-4">
Find a Guide
</h2>

<div className="flex flex-wrap gap-4">

<select className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500">

<option>Mumbai</option>
<option>Pune</option>
<option>Nashik</option>
<option>Aurangabad</option>

</select>

<select className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500">

<option>Heritage</option>
<option>Food Walk</option>
<option>Adventure</option>

</select>

<button className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition">

Search

</button>

</div>

</div>


{/* QUICK ACTIONS */}

<div className="grid md:grid-cols-3 gap-6">

<div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">

<h3 className="font-semibold mb-2">
My Bookings
</h3>

<p className="text-gray-600 text-sm">
View your upcoming guide bookings.
</p>

</div>

<div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">

<h3 className="font-semibold mb-2">
Explore Destinations
</h3>

<p className="text-gray-600 text-sm">
Discover amazing places in Maharashtra.
</p>

</div>

<div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">

<h3 className="font-semibold mb-2">
Food Experiences
</h3>

<p className="text-gray-600 text-sm">
Explore authentic Maharashtrian cuisines.
</p>

</div>

</div>

</div>

</div>

);

}