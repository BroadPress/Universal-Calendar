import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import axios from "axios";

export default function AdminSignup() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [captchaToken, setCaptchaToken] = useState(null);
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();

        if (!captchaToken) {
            alert("Please verify the captcha");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        try {
            const res = await axios.post("http://localhost:5000/api/auth/signup", {
                name,
                email,
                password,
                captchaToken,
            });

            alert("Signup successful!");
            navigate("/login"); // ✅ Redirect to login after signup
        } catch (err) {
            console.error(err);
            alert("Signup failed. Please check your inputs or captcha.");
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <form
                onSubmit={handleSignup}
                className="bg-white p-8 rounded shadow-md w-96 space-y-4"
            >
                <h2 className="text-xl font-bold mb-4 text-center">Sign Up</h2>

                <input
                    type="text"
                    placeholder="Full Name"
                    className="w-full border p-2 rounded"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <input
                    type="email"
                    placeholder="Email"
                    className="w-full border p-2 rounded"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Password"
                    className="w-full border p-2 rounded"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Confirm Password"
                    className="w-full border p-2 rounded"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />

                <ReCAPTCHA
                    sitekey="6LdnifgrAAAAAJmQrnP_ml_k22LonLCy3LYYPvLo"
                    onChange={(token) => setCaptchaToken(token)}
                />

                <button
                    type="submit"
                    className="w-full bg-[#7b1515] text-white py-2 rounded hover:bg-[#a41c1c]"
                >
                    Sign Up
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
