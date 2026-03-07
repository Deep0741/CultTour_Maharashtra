export default function BookingConfirmation(){

return(

<div className="bg-gray-100 min-h-screen flex items-center justify-center">

<div className="bg-white p-8 rounded shadow text-center">

<h2 className="text-3xl font-bold text-green-600">
Booking Confirmed
</h2>

<p className="mt-4">
Your tour has been successfully booked.
</p>

<button className="mt-6 bg-orange-600 text-white px-6 py-3 rounded">
Go to Dashboard
</button>

</div>

</div>

);

}