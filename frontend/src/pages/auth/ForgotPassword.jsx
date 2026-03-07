import { useState } from "react";

export default function ForgotPassword() {

const [email,setEmail] = useState("");

const handleSubmit = async (e) => {

  e.preventDefault();

  const res = await fetch("http://localhost:5000/api/v1/auth/forgot-password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email })
  });

  const data = await res.json();

  if (data.success) {

    // automatically redirect user to reset password page
    window.location.href = data.resetLink;

  } else {

    alert(data.message);

  }

};

return(

<div className="min-h-screen flex items-center justify-center bg-gray-100">

<div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">

<h2 className="text-2xl font-bold mb-4 text-center">
Forgot Password
</h2>

<p className="text-gray-600 text-center mb-6">
Enter your email and we will send a reset link.
</p>

<form onSubmit={handleSubmit} className="space-y-4">

<div>

<label className="block text-gray-600 mb-1">
Email
</label>

<input
type="email"
placeholder="Enter your email"
value={email}
onChange={(e)=>setEmail(e.target.value)}
className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500"
required
/>

</div>

<button
type="submit"
className="w-full bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700"
>

Send Reset Link

</button>

</form>

</div>

</div>

);

}