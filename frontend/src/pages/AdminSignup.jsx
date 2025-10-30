import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import api from "../api/api"; // use the preconfigured Axios instance

export default function AdminSignup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [captchaToken, setCaptchaToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword } = formData;

    if (!name || !email || !password || !confirmPassword) {
      alert("Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    if (!captchaToken) {
      alert("Please verify the CAPTCHA.");
      return;
    }

    try {
      setLoading(true);

      // ✅ Use api instance instead of axios
      const res = await api.post("/auth/signup", { name, email, password, captchaToken });

      alert("Signup successful! Redirecting to login...");
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert(
        err.response?.data?.message || "Signup failed. Please check your inputs or CAPTCHA."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleSignup}
        className="bg-white p-8 rounded-2xl shadow-md w-96 space-y-4"
      >
        <h2 className="text-2xl font-bold text-center text-[#7b1515]">
          Create an Account
        </h2>

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#7b1515]"
          value={formData.name}
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#7b1515]"
          value={formData.email}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#7b1515]"
          value={formData.password}
          onChange={handleChange}
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#7b1515]"
          value={formData.confirmPassword}
          onChange={handleChange}
        />

        <div className="flex justify-center">
          <ReCAPTCHA
            sitekey="6LdnifgrAAAAAJmQrnP_ml_k22LonLCy3LYYPvLo"
            onChange={(token) => setCaptchaToken(token)}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#7b1515] text-white py-2 rounded hover:bg-[#a41c1c] transition duration-200 disabled:opacity-50"
        >
          {loading ? "Signing Up..." : "Sign Up"}
        </button>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-[#7b1515] cursor-pointer font-semibold hover:underline"
          >
            Login here
          </span>
        </p>
      </form>
    </div>
  );
}
