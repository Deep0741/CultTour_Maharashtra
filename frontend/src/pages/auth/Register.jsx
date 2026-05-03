import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { FiUser, FiMail, FiLock, FiArrowRight, FiMapPin, FiCompass, FiShield, FiPhone } from 'react-icons/fi';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", password: "", role: "tourist"
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await register(formData);
    setLoading(false);

    if (result.success) {
      toast.success("Registration successful");
      localStorage.setItem("userRole", formData.role);
      if (formData.role === "guide") {
        localStorage.setItem("isVerified", "false");
        navigate("/login");
      } else if (formData.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/tourist/dashboard");
      }
    } else {
      toast.error(result.message || "Registration failed");
    }
  };

  const roles = [
    { value: "tourist", label: "Tourist", icon: <FiMapPin size={20} />, desc: "Explore & book tours", color: "from-primary-500 to-primary-600" },
    { value: "guide", label: "Guide", icon: <FiCompass size={20} />, desc: "Lead tours & earn", color: "from-emerald-500 to-emerald-600" },
    { value: "admin", label: "Admin", icon: <FiShield size={20} />, desc: "Manage the platform", color: "from-accent-500 to-accent-600" },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left — Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=1400&auto=format&fit=crop"
          alt="Maharashtra"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-accent-600/90 to-primary-600/80" />
        <div className="absolute inset-0 flex flex-col justify-end p-12">
          <h2 className="text-4xl font-extrabold text-white mb-3">Join CulTour</h2>
          <p className="text-white/70 text-lg max-w-md">
            Create your account and start exploring Maharashtra's incredible heritage, cuisine, and culture.
          </p>
        </div>
      </div>

      {/* Right — Form */}
      <div className="flex-1 flex items-center justify-center bg-mesh px-6 py-12">
        <div className="w-full max-w-md animate-slide-up">
          <Link to="/" className="inline-flex items-center gap-1.5 mb-8">
            <span className="text-2xl font-extrabold gradient-text">CulTour</span>
            <span className="text-lg font-semibold text-surface-500">Maharashtra</span>
          </Link>

          <h1 className="text-3xl font-bold text-surface-800 mb-2">Create Account</h1>
          <p className="text-surface-500 mb-8">Choose your role and get started</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-semibold text-surface-700 mb-3">I want to join as</label>
              <div className="grid grid-cols-3 gap-3">
                {roles.map(role => (
                  <button
                    key={role.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, role: role.value })}
                    className={`p-3 rounded-xl border-2 text-center transition-all duration-300 ${
                      formData.role === role.value
                        ? 'border-primary-500 bg-primary-50 shadow-md'
                        : 'border-surface-200 hover:border-surface-300 bg-white'
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${role.color} text-white flex items-center justify-center mx-auto mb-2`}>
                      {role.icon}
                    </div>
                    <p className="text-sm font-semibold text-surface-800">{role.label}</p>
                    <p className="text-[10px] text-surface-400 mt-0.5">{role.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-surface-700 mb-2">Full Name</label>
              <div className="relative">
                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400" size={16} />
                <input type="text" name="name" required onChange={handleChange} placeholder="Your name" className="input-field !pl-11" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-surface-700 mb-2">Email</label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400" size={16} />
                <input type="email" name="email" required onChange={handleChange} placeholder="you@example.com" className="input-field !pl-11" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-surface-700 mb-2">Phone Number</label>
              <div className="relative">
                <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400" size={16} />
                <input type="tel" name="phone" required pattern="[0-9]{10}" title="Please enter a valid 10-digit phone number" onChange={handleChange} placeholder="9876543210" className="input-field !pl-11" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-surface-700 mb-2">Password</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400" size={16} />
                <input type="password" name="password" required onChange={handleChange} placeholder="••••••••" className="input-field !pl-11" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary !py-3.5 text-base flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Create Account <FiArrowRight size={16} /></>
              )}
            </button>
          </form>

          <p className="text-center text-surface-500 mt-8">
            Already have an account?{" "}
            <Link to="/login" className="text-primary-600 font-semibold hover:text-primary-700">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}