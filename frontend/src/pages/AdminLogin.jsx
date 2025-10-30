import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import api from "../api/api"; // ✅ Axios instance

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captchaToken, setCaptchaToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!captchaToken) {
      alert("Please verify the captcha");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post(
        "/auth/login",
        { email, password, captchaToken },
        { withCredentials: true }
      );

      if (res.data?.message === "Login successful") {
        alert("✅ Login successful!");
        navigate("/"); // redirect to protected Calendar page
      }
    } catch (err) {
      console.error("Login error:", err);
      alert(
        err.response?.data?.message ||
          "❌ Invalid credentials or CAPTCHA failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded shadow-md w-96 space-y-4"
      >
        <h2 className="text-xl font-bold mb-4 text-center">Login</h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <ReCAPTCHA
          sitekey="6LdnifgrAAAAAJmQrnP_ml_k22LonLCy3LYYPvLo"
          onChange={(token) => setCaptchaToken(token)}
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-[#7b1515] text-white py-2 rounded hover:bg-[#a41c1c] transition ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-[#7b1515] cursor-pointer font-semibold hover:underline"
          >
            Sign up here
          </span>
        </p>
      </form>
    </div>
  );
}
