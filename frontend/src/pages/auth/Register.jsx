import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

export default function Register(){

const { register } = useAuth();
const navigate = useNavigate();

const [formData,setFormData]=useState({
name:"",
email:"",
password:"",
role:"tourist"
});

const handleChange=(e)=>{
setFormData({...formData,[e.target.name]:e.target.value});
};

const handleSubmit=async(e)=>{
e.preventDefault();

const result = await register(formData);

if(result.success){
toast.success("Registration successful");
navigate("/login");
}else{
toast.error(result.message || "Registration failed");
}

};

return(

<div className="min-h-screen flex items-center justify-center bg-gray-100">

<div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8">

<h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
Create an Account
</h2>

<form onSubmit={handleSubmit} className="space-y-4">

<div>
<label className="block text-gray-600 mb-1">Name</label>
<input
type="text"
name="name"
required
onChange={handleChange}
className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
/>
</div>

<div>
<label className="block text-gray-600 mb-1">Email</label>
<input
type="email"
name="email"
required
onChange={handleChange}
className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
/>
</div>

<div>
<label className="block text-gray-600 mb-1">Password</label>
<input
type="password"
name="password"
required
onChange={handleChange}
className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
/>
</div>

<div>
<label className="block text-gray-600 mb-2 font-medium">
Register as
</label>

<div className="flex gap-4">

<label className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-lg cursor-pointer hover:border-orange-500">
<input
type="radio"
name="role"
value="tourist"
defaultChecked
onChange={handleChange}
className="accent-orange-600"
/>
Tourist
</label>

<label className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-lg cursor-pointer hover:border-orange-500">
<input
type="radio"
name="role"
value="guide"
onChange={handleChange}
className="accent-orange-600"
/>
Guide
</label>

</div>
</div>

<button
type="submit"
className="w-full bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 transition"
>
Register
</button>

</form>

<p className="text-center text-gray-500 mt-4">
Already have an account?{" "}
<a href="/login" className="text-orange-600 font-medium">
Login
</a>
</p>

</div>

</div>

);

}