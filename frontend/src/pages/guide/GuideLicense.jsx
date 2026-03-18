import { useState } from "react";
import axios from "axios";

export default function GuideLicense() {

  const [formData, setFormData] = useState({
    licenseNumber: "",
    authority: "MTDC",
    issueDate: "",
    expiryDate: ""
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {

    const token = localStorage.getItem("token");

await axios.post(
  "http://localhost:5000/api/v1/guides/verify",
  formData,
  {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
);

    console.log(res.data);

    setSubmitted(true);

  } catch (err) {

    console.error("Verification error:", err.response?.data || err.message);

    alert(err.response?.data?.message || "Verification failed");

  }
};

  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">

        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Guide License Verification
        </h2>


        {/* Verification Submitted Message */}

        {submitted && (

          <div className="bg-green-100 border border-green-300 text-green-700 p-4 rounded-lg mb-6">

            <p className="font-semibold">
              Verification Submitted
            </p>

            <p className="text-sm">
              Your license is under review by the admin.
              You will get access to the guide dashboard once approved.
            </p>

          </div>

        )}


        <form onSubmit={handleSubmit} className="space-y-5">

          {/* License Number */}

          <div>

            <label className="block text-sm font-medium text-gray-600 mb-1">
              License Number
            </label>

            <input
              type="text"
              name="licenseNumber"
              placeholder="Enter license number"
              value={formData.licenseNumber}
              onChange={handleChange}
              disabled={submitted}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none disabled:bg-gray-100"
            />

          </div>


          {/* Issuing Authority */}

          <div>

            <label className="block text-sm font-medium text-gray-600 mb-1">
              Issuing Authority
            </label>

            <select
              name="authority"
              value={formData.authority}
              onChange={handleChange}
              disabled={submitted}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none disabled:bg-gray-100"
            >

              <option>MTDC</option>
              <option>Government of India</option>

            </select>

          </div>


          {/* Issue Date */}

          <div>

            <label className="block text-sm font-medium text-gray-600 mb-1">
              Issue Date
            </label>

            <input
              type="date"
              name="issueDate"
              value={formData.issueDate}
              onChange={handleChange}
              disabled={submitted}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none disabled:bg-gray-100"
            />

          </div>


          {/* Expiry Date */}

          <div>

            <label className="block text-sm font-medium text-gray-600 mb-1">
              Expiry Date
            </label>

            <input
              type="date"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              disabled={submitted}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none disabled:bg-gray-100"
            />

          </div>


          {/* Submit Button */}

          <button
            type="submit"
            disabled={submitted}
            className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition disabled:bg-gray-400"
          >

            Verify License

          </button>

        </form>

      </div>

    </div>

  );

}