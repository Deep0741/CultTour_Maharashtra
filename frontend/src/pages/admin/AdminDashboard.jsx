import { useEffect, useState } from "react";

export default function AdminDashboard(){

const [stats,setStats] = useState({
users:0,
bookings:0,
guides:0,
commission:0
});

useEffect(()=>{

// Later we will fetch real backend data
setStats({
users:12,
bookings:7,
guides:5,
commission:2500
});

},[]);

return(

<div className="bg-gray-100 min-h-screen">

<div className="max-w-7xl mx-auto px-4 py-10">

<h1 className="text-3xl font-bold mb-8">
Admin Dashboard
</h1>

{/* Stats Cards */}

<div className="grid md:grid-cols-4 gap-6 mb-10">

<div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">

<h3 className="text-gray-500">
Total Users
</h3>

<p className="text-3xl font-bold text-orange-600">
{stats.users}
</p>

</div>


<div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">

<h3 className="text-gray-500">
Total Guides
</h3>

<p className="text-3xl font-bold text-orange-600">
{stats.guides}
</p>

</div>


<div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">

<h3 className="text-gray-500">
Total Bookings
</h3>

<p className="text-3xl font-bold text-orange-600">
{stats.bookings}
</p>

</div>


<div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">

<h3 className="text-gray-500">
Total Commission
</h3>

<p className="text-3xl font-bold text-orange-600">
₹{stats.commission}
</p>

</div>

</div>

{/* Admin Actions */}

<div className="grid md:grid-cols-3 gap-6">

<div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition cursor-pointer">

<h3 className="font-semibold mb-2">
Manage Users
</h3>

<p className="text-gray-600 text-sm">
View and manage platform users.
</p>

</div>

<div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition cursor-pointer">

<h3 className="font-semibold mb-2">
Manage Guides
</h3>

<p className="text-gray-600 text-sm">
Approve or remove guides.
</p>

</div>

<div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition cursor-pointer">

<h3 className="font-semibold mb-2">
Manage Destinations
</h3>

<p className="text-gray-600 text-sm">
Add or update travel destinations.
</p>

</div>

</div>

</div>

</div>

);

}