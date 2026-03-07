export default function GuideLicense(){

return(

<div className="bg-gray-100 min-h-screen flex items-center justify-center">

<div className="bg-white p-8 rounded shadow w-96">

<h2 className="text-2xl font-bold mb-4">
Guide License Verification
</h2>

<input
placeholder="License Number"
className="w-full border p-2 mb-3"
/>

<select className="w-full border p-2 mb-3">
<option>MTDC</option>
<option>Government of India</option>
</select>

<input type="date" className="w-full border p-2 mb-3"/>

<input type="date" className="w-full border p-2 mb-3"/>

<button className="w-full bg-orange-600 text-white py-2 rounded">
Verify License
</button>

</div>

</div>

);

}