import { useEffect, useState } from "react";
import axios from "axios";

export default function PendingGuides(){

const [guides,setGuides] = useState([]);

const token = localStorage.getItem("token");

useEffect(()=>{
fetchPendingGuides();
},[]);

const fetchPendingGuides = async()=>{

try{

const res = await axios.get(
"http://localhost:5000/api/v1/admin/guides/pending",
{
headers:{
Authorization:`Bearer ${token}`
}
}
);

setGuides(res.data.data);

}catch(err){
console.error(err);
}

};


// Approve Guide
const approveGuide = async(id)=>{

try{

await axios.put(
`http://localhost:5000/api/v1/admin/guides/${id}/approve`,
{},
{
headers:{
Authorization:`Bearer ${token}`
}
}
);

fetchPendingGuides();

}catch(err){
console.error(err);
}

};


// Reject Guide
const rejectGuide = async(id)=>{

try{

await axios.put(
`http://localhost:5000/api/v1/admin/guides/${id}/reject`,
{},
{
headers:{
Authorization:`Bearer ${token}`
}
}
);

fetchPendingGuides();

}catch(err){
console.error(err);
}

};


return(

<div className="bg-gray-100 min-h-screen">

<div className="max-w-6xl mx-auto px-4 py-10">

<h1 className="text-3xl font-bold mb-8">
Pending Guide Approvals
</h1>

<div className="bg-white rounded-xl shadow p-6">

<table className="w-full text-sm">

<thead>

<tr className="border-b">

<th className="text-left py-2">Name</th>
<th className="text-left py-2">City</th>
<th className="text-left py-2">Experience</th>
<th className="text-left py-2">License</th>
<th className="text-left py-2">Action</th>

</tr>

</thead>

<tbody>

{guides.length === 0 ?(

<tr>
<td colSpan="5" className="text-center py-6 text-gray-500">
No pending guide approvals
</td>
</tr>

):(


guides.map((guide)=>{

return(

<tr key={guide._id} className="border-b">

<td className="py-3">
{guide.user?.name || "-"}
</td>

<td>
{guide.locations?.[0] || "-"}
</td>

<td>
{guide.experience ?? "-"}
</td>

<td>

<button
className="text-blue-600 underline"
onClick={()=>alert(`License Number: ${guide.licenseNumber || "N/A"}`)}
>
View
</button>

</td>

<td className="flex gap-2 py-3">

<button
onClick={()=>approveGuide(guide._id)}
className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
>
Approve
</button>

<button
onClick={()=>rejectGuide(guide._id)}
className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
>
Reject
</button>

</td>

</tr>

);

})

)}

</tbody>

</table>

</div>[]

</div>

</div>

);

}