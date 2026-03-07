export default function AdminDashboard(){

return(

<div className="bg-gray-100 min-h-screen">

<div className="container mx-auto px-4 py-8">

<h1 className="text-3xl font-bold mb-8">
Admin Dashboard
</h1>

<div className="grid md:grid-cols-3 gap-6">

<div className="bg-white p-6 rounded shadow">
<h3>Total Commission</h3>
<p className="text-3xl font-bold text-orange-600">₹0</p>
</div>

<div className="bg-white p-6 rounded shadow">
<h3>Total Bookings</h3>
<p className="text-3xl font-bold text-orange-600">0</p>
</div>

<div className="bg-white p-6 rounded shadow">
<h3>Total Users</h3>
<p className="text-3xl font-bold text-orange-600">0</p>
</div>

</div>

</div>

</div>

);

}