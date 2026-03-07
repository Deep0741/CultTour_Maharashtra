export default function GuideDashboard(){

return(

<div className="bg-gray-100 min-h-screen">

<div className="container mx-auto px-4 py-8">

<h1 className="text-3xl font-bold mb-8">
Guide Dashboard
</h1>

<div className="bg-white p-6 rounded shadow">

<h2 className="text-xl font-semibold mb-4">
Guide Profile
</h2>

<textarea
placeholder="Describe your experience"
className="w-full border p-3"
/>

<button className="bg-orange-600 text-white px-6 py-2 mt-4 rounded">
Save Profile
</button>

</div>

</div>

</div>

);

}