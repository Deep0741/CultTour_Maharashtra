const AdminDashboard = () => {

 return (
   <div className="p-10">

     <h1 className="text-3xl font-bold">
       Admin Dashboard
     </h1>

     <div className="grid grid-cols-3 gap-6 mt-8">

       <div className="card">
         Manage Destinations
       </div>

       <div className="card">
         Manage Guides
       </div>

       <div className="card">
         Manage Users
       </div>

     </div>

   </div>
 )

}

export default AdminDashboard