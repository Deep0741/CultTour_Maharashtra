import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {

const navigate = useNavigate();

const [user,setUser] = useState({
name:"",
email:"",
role:""
});

useEffect(()=>{

const role = localStorage.getItem("userRole");
const name = localStorage.getItem("userName") || "User";
const email = localStorage.getItem("userEmail") || "user@email.com";

setUser({
name,
email,
role
});

},[]);

return(

<div className="bg-gray-100 min-h-screen">

<div className="max-w-5xl mx-auto px-4 py-10">

<h1 className="text-3xl font-bold mb-8">
My Profile
</h1>

<div className="bg-white shadow rounded-xl p-8">

<div className="flex items-center gap-6 mb-6">

<img
src="https://i.pravatar.cc/120"
alt="profile"
className="w-28 h-28 rounded-full object-cover"
/>

<div>

<h2 className="text-2xl font-semibold">
{user.name}
</h2>

<p className="text-gray-600">
{user.email}
</p>

<span className="inline-block mt-2 bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm capitalize">
{user.role}
</span>

</div>

</div>

<hr className="my-6"/>

<div className="grid md:grid-cols-2 gap-6">

<div className="bg-gray-50 p-5 rounded-lg">

<h3 className="font-semibold mb-2">
Account Details
</h3>

<p className="text-gray-600 text-sm">
Manage your personal information and preferences.
</p>

</div>

<div className="bg-gray-50 p-5 rounded-lg">

<h3 className="font-semibold mb-2">
Dashboard
</h3>

<p className="text-gray-600 text-sm mb-3">
Go to your dashboard to manage bookings and activities.
</p>

<button
onClick={()=>navigate(`/${user.role}/dashboard`)}
className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 transition"
>
Open Dashboard
</button>

</div>

</div>

</div>

</div>

</div>

);

};

export default Profile;