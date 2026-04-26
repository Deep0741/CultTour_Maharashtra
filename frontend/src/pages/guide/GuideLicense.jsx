import { useState } from "react";
import axios from "axios";
import { FiCheckCircle } from 'react-icons/fi';

export default function GuideLicense() {
  const [formData, setFormData] = useState({
    licenseNumber: "", authority: "MTDC", issueDate: "", expiryDate: ""
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/v1/guides/verify", formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSubmitted(true);
    } catch (err) {
      console.error("Verification error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-mesh px-4">
      <div className="w-full max-w-md animate-slide-up">
        <div className="card p-8 border border-surface-100">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white flex items-center justify-center mx-auto mb-5 text-2xl">
            🧭
          </div>
          <h2 className="text-2xl font-bold text-center text-surface-800 mb-2">Guide License Verification</h2>
          <p className="text-surface-500 text-center text-sm mb-6">Submit your license for admin review</p>

          {submitted && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 mb-6 text-center animate-scale-in">
              <FiCheckCircle className="text-emerald-500 mx-auto mb-3" size={36} />
              <p className="font-bold text-emerald-700">Verification Submitted!</p>
              <p className="text-sm text-surface-500 mt-1">Your license is under review. You'll get dashboard access once approved.</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-surface-700 mb-2">License Number</label>
              <input type="text" name="licenseNumber" placeholder="Enter license number" value={formData.licenseNumber} onChange={handleChange}
                disabled={submitted} required className="input-field disabled:bg-surface-100 disabled:text-surface-400" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-surface-700 mb-2">Issuing Authority</label>
              <select name="authority" value={formData.authority} onChange={handleChange} disabled={submitted}
                className="input-field disabled:bg-surface-100">
                <option>MTDC</option>
                <option>Government of India</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-surface-700 mb-2">Issue Date</label>
                <input type="date" name="issueDate" value={formData.issueDate} onChange={handleChange}
                  disabled={submitted} required className="input-field disabled:bg-surface-100" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-surface-700 mb-2">Expiry Date</label>
                <input type="date" name="expiryDate" value={formData.expiryDate} onChange={handleChange}
                  disabled={submitted} required className="input-field disabled:bg-surface-100" />
              </div>
            </div>

            <button type="submit" disabled={submitted || loading}
              className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-3 rounded-xl font-semibold hover:from-emerald-600 hover:to-emerald-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : "Submit for Verification"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}