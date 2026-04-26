import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FiLock, FiArrowRight } from 'react-icons/fi';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch(`http://localhost:5000/api/v1/auth/reset-password/${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password })
    });
    const data = await res.json();
    setLoading(false);

    if (data.success) {
      alert("Password updated successfully");
      navigate("/login");
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-mesh px-4">
      <div className="w-full max-w-md animate-slide-up">
        <Link to="/" className="inline-flex items-center gap-1.5 mb-8">
          <span className="text-2xl font-extrabold gradient-text">CulTour</span>
          <span className="text-lg font-semibold text-surface-500">Maharashtra</span>
        </Link>

        <div className="card p-8 border border-surface-100">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-500 to-accent-600 text-white flex items-center justify-center mx-auto mb-5">
            <FiLock size={24} />
          </div>
          <h2 className="text-2xl font-bold text-center text-surface-800 mb-2">Reset Password</h2>
          <p className="text-surface-500 text-center text-sm mb-6">
            Enter your new password below
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-surface-700 mb-2">New Password</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400" size={16} />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field !pl-11"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary !py-3.5 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Update Password <FiArrowRight size={16} /></>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}