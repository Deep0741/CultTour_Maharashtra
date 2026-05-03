import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiUser, FiMail, FiGrid } from 'react-icons/fi';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: "", email: "", role: "" });

  useEffect(() => {
    setUser({
      name: localStorage.getItem("userName") || "User",
      email: localStorage.getItem("userEmail") || "user@email.com",
      role: localStorage.getItem("userRole") || "",
    });
  }, []);

  const roleConfig = {
    admin: { color: "from-accent-500 to-accent-600", label: "Administrator" },
    guide: { color: "from-emerald-500 to-emerald-600", label: "Guide" },
    tourist: { color: "from-primary-500 to-primary-600", label: "Tourist" },
  };

  return (
    <div className="min-h-screen bg-mesh">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-surface-800 mb-8 animate-slide-up">
          My <span className="gradient-text">Profile</span>
        </h1>

        <div className="card border border-surface-100 overflow-hidden animate-slide-up stagger-1">
          {/* Header */}
          <div className={`bg-gradient-to-r ${roleConfig[user.role]?.color || 'from-primary-500 to-primary-600'} p-8 text-center relative`}>
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&size=128&background=ffffff&color=f97316&bold=true&font-size=0.4`}
              alt="profile"
              className="w-24 h-24 rounded-2xl object-cover mx-auto border-4 border-white/30 shadow-lg"
            />
            <h2 className="text-2xl font-bold text-white mt-4">{user.name}</h2>
            <p className="text-white/70 text-sm">{user.email}</p>
            <span className="inline-block mt-3 bg-white/20 backdrop-blur-sm text-white px-4 py-1 rounded-full text-sm font-medium border border-white/20">
              {roleConfig[user.role]?.label || user.role}
            </span>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-surface-50 rounded-xl p-6 border border-surface-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 text-white flex items-center justify-center">
                    <FiUser size={18} />
                  </div>
                  <h3 className="font-bold text-surface-800">Account Details</h3>
                </div>
                <p className="text-surface-500 text-sm">Manage your personal information and preferences.</p>
              </div>

              <div className="bg-surface-50 rounded-xl p-6 border border-surface-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-500 to-accent-600 text-white flex items-center justify-center">
                    <FiGrid size={18} />
                  </div>
                  <h3 className="font-bold text-surface-800">Dashboard</h3>
                </div>
                <p className="text-surface-500 text-sm mb-4">Go to your dashboard to manage bookings and activities.</p>
                <button onClick={() => navigate(`/${user.role}/dashboard`)} className="btn-primary text-sm">
                  Open Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;