import { useEffect, useState } from "react";

const Profile = () => {

  const [role, setRole] = useState("");

  useEffect(() => {
    const userRole = localStorage.getItem("userRole");
    setRole(userRole);
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold">Profile Page</h1>
      <p>Your Role: {role}</p>
    </div>
  );
};

export default Profile;