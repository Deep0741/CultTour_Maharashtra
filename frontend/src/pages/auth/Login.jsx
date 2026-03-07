import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

export default function Login() {

const { login } = useAuth();
const navigate = useNavigate();

const [formData,setFormData]=useState({
email:"",
password:""
});

const handleChange=(e)=>{
setFormData({...formData,[e.target.name]:e.target.value});
};

const handleSubmit = async (e) => {
e.preventDefault();

const result = await login(formData);

if (result.success) {

toast.success("Login successful");

const role = localStorage.getItem("userRole");

if (role === "admin") {
navigate("/admin/dashboard");
}
else if (role === "guide") {
navigate("/guide/dashboard");
}
else {
navigate("/tourist/dashboard");
}

}
else {
toast.error(result.message || "Login failed");
}

};

return(

<div className="min-h-screen flex items-center justify-center bg-gray-100">

<div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8">

<h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
Login to your account
</h2>

<form onSubmit={handleSubmit} className="space-y-4">

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
<div className="flex justify-end mb-4">

<a
href="/forgot-password"
className="text-sm text-orange-600 hover:underline"
>

Forgot Password?

</a>

</div>
</div>

<button
type="submit"
className="w-full bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 transition"
>
Login
</button>

</form>

<p className="text-center text-gray-500 mt-4">
Don't have an account?{" "}
<a href="/register" className="text-orange-600 font-medium">
Register
</a>
</p>

</div>

</div>

);

}