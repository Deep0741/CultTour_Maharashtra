import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { FiMail, FiLock, FiArrowRight } from 'react-icons/fi';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await login(formData);
    setLoading(false);

    if (result.success) {
      toast.success("Login successful");
      const role = localStorage.getItem("userRole");
      if (role === "admin") navigate("/admin/dashboard");
      else if (role === "guide") navigate("/guide/dashboard");
      else navigate("/tourist/dashboard");
    } else {
      toast.error(result.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left — Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1651431301792-39edddc3b1e9?q=80&w=1332&auto=format&fit=crop"
          alt="Maharashtra Heritage"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/90 to-accent-600/80" />
        <div className="absolute inset-0 flex flex-col justify-end p-12">
          <h2 className="text-4xl font-extrabold text-white mb-3">Welcome Back</h2>
          <p className="text-white/70 text-lg max-w-md">
            Continue exploring Maharashtra's rich cultural heritage with expert local guides.
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

          <h1 className="text-3xl font-bold text-surface-800 mb-2">Sign In</h1>
          <p className="text-surface-500 mb-8">Enter your credentials to access your account</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-surface-700 mb-2">Email</label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400" size={16} />
                <input
                  type="email"
                  name="email"
                  required
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="input-field !pl-11"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-surface-700 mb-2">Password</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400" size={16} />
                <input
                  type="password"
                  name="password"
                  required
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="input-field !pl-11"
                />
              </div>
              <div className="flex justify-end mt-2">
                <Link to="/forgot-password" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                  Forgot Password?
                </Link>
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
                <>Sign In <FiArrowRight size={16} /></>
              )}
            </button>
          </form>

          <p className="text-center text-surface-500 mt-8">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary-600 font-semibold hover:text-primary-700">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}