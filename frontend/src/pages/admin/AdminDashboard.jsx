import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AdminDashboard(){

const navigate = useNavigate();

const [stats,setStats] = useState({
users:0,
guides:0,
bookings:0,
commission:0
});

const [pendingGuides,setPendingGuides] = useState([]);
const [recentBookings,setRecentBookings] = useState([]);
const [notifications,setNotifications] = useState([]);

const token = localStorage.getItem("token");

useEffect(()=>{
fetchAnalytics();
fetchPendingGuides();
fetchRecentBookings();
fetchNotifications();
},[]);


// Fetch analytics
const fetchAnalytics = async () => {

try{

const res = await axios.get(
"http://localhost:5000/api/v1/admin/analytics",
{
headers:{
Authorization:`Bearer ${token}`
}
}
);

const data = res.data.data;

const users = data.userStats?.find(u => u._id === "tourist")?.count || 0;
const guides = data.userStats?.find(u => u._id === "guide")?.count || 0;

setStats({
users,
guides,
bookings: data.revenue?.totalBookings || 0,
commission: data.revenue?.totalRevenue || 0
});

}catch(err){
console.error(err);
}

};


// Fetch pending guides
const fetchPendingGuides = async () =>{

try{

const res = await axios.get(
"http://localhost:5000/api/v1/admin/guides/pending",
{
headers:{
Authorization:`Bearer ${token}`
}
}
);

setPendingGuides(res.data.data);

}catch(err){
console.error(err);
}

};


// Fetch notifications
const fetchNotifications = async()=>{

try{

const res = await axios.get(
"http://localhost:5000/api/v1/admin/notifications",
{
headers:{
Authorization:`Bearer ${token}`
}
}
);

setNotifications(res.data.data);

}catch(err){
console.error(err);
}

};


// Fetch recent bookings
const fetchRecentBookings = async ()=>{

try{

const res = await axios.get(
"http://localhost:5000/api/v1/admin/bookings",
{
headers:{
Authorization:`Bearer ${token}`
}
}
);

setRecentBookings(res.data.data.slice(0,5));

}catch(err){
console.error(err);
}

};

const clearNotifications = async ()=>{

try{

const token = localStorage.getItem("token");

await axios.delete(
"http://localhost:5000/api/v1/admin/notifications",
{
headers:{
Authorization:`Bearer ${token}`
}
}
);

setNotifications([]);

}catch(err){
console.error(err);
}

};


return(

<div className="bg-gray-100 min-h-screen">

<div className="max-w-7xl mx-auto px-4 py-10">

<h1 className="text-3xl font-bold mb-8">
Admin Dashboard
</h1>



{/* Stats Cards */}

<div className="grid md:grid-cols-4 gap-6 mb-10">

<div className="bg-white p-6 rounded-xl shadow">
<h3 className="text-gray-500">Total Users</h3>
<p className="text-3xl font-bold text-orange-600">
{stats.users}
</p>
</div>


<div className="bg-white p-6 rounded-xl shadow">
<h3 className="text-gray-500">Total Guides</h3>
<p className="text-3xl font-bold text-orange-600">
{stats.guides}
</p>
</div>


<div className="bg-white p-6 rounded-xl shadow">
<h3 className="text-gray-500">Total Bookings</h3>
<p className="text-3xl font-bold text-orange-600">
{stats.bookings}
</p>
</div>


<div className="bg-white p-6 rounded-xl shadow">
<h3 className="text-gray-500">Total Commission</h3>
<p className="text-3xl font-bold text-orange-600">
₹{stats.commission}
</p>
</div>

</div>



{/* Admin Notifications */}

<div className="bg-white p-6 rounded-xl shadow mb-10">

<h2 className="text-xl font-semibold mb-4">
Admin Notifications
</h2>

{notifications.length === 0 ? (

<p className="text-gray-500 text-sm">
No new notifications
</p>

) : (

notifications.map((n)=>(
<div key={n._id} className="border-b py-3">

<p className="font-medium text-gray-800">
{n.title}
</p>

<p className="text-sm text-gray-500">
{n.message}
</p>

</div>
))

)}

</div>



{/* Admin Controls */}

<div className="grid md:grid-cols-3 gap-6 mb-10">

<div
onClick={()=>navigate("/admin/users")}
className="bg-white p-6 rounded-xl shadow cursor-pointer hover:shadow-lg"
>

<h3 className="font-semibold mb-2">Manage Users</h3>

<p className="text-gray-600 text-sm">
View and manage platform users.
</p>

</div>



<div
onClick={()=>navigate("/admin/guides")}
className="bg-white p-6 rounded-xl shadow cursor-pointer hover:shadow-lg"
>

<h3 className="font-semibold mb-2">Manage Guides</h3>

<p className="text-gray-600 text-sm">
Approve or remove guides.
</p>

{pendingGuides.length>0 &&(

<p className="text-red-500 text-xs mt-2">
{pendingGuides.length} pending approvals
</p>

)}

</div>



<div
onClick={()=>navigate("/admin/destinations")}
className="bg-white p-6 rounded-xl shadow cursor-pointer hover:shadow-lg"
>

<h3 className="font-semibold mb-2">
Manage Destinations
</h3>

<p className="text-gray-600 text-sm">
Add or update travel destinations.
</p>

</div>

</div>



{/* Recent Bookings */}

<div className="bg-white p-6 rounded-xl shadow">

<h2 className="text-xl font-semibold mb-4">
Recent Bookings
</h2>

<table className="w-full text-sm">

<thead>

<tr className="border-b">

<th className="text-left py-2">Tourist</th>
<th className="text-left py-2">Destination</th>
<th className="text-left py-2">Amount</th>
<th className="text-left py-2">Status</th>

</tr>

</thead>

<tbody>

{recentBookings.map((b)=>(

<tr key={b._id} className="border-b">

<td className="py-2">
{b.tourist?.name}
</td>

<td>
{b.destination?.name}
</td>

<td>
₹{b.totalAmount}
</td>

<td>
{b.status}
</td>

</tr>

))}

</tbody>

</table>

</div>


</div>

</div>

);

}