import { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import axios from "axios";

export default function AdminLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [captchaToken, setCaptchaToken] = useState(null);

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!captchaToken) {
            alert("Please verify the captcha");
            return;
        }

        try {
            const res = await axios.post("http://localhost:5000/api/auth/login", {
                email,
                password,
                captchaToken, // <- token from reCAPTCHA
            });

            alert("Login successful!");
        } catch (err) {
            console.error(err);
            alert("Invalid credentials or captcha failed");
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
                />

                <input
                    type="password"
                    placeholder="Password"
                    className="w-full border p-2 rounded"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <ReCAPTCHA
                    sitekey="6LdnifgrAAAAAJmQrnP_ml_k22LonLCy3LYYPvLo" // your frontend site key
                    onChange={(token) => setCaptchaToken(token)}
                />

                <button
                    type="submit"
                    className="w-full bg-[#7b1515] text-white py-2 rounded hover:bg-[#a41c1c]"
                >
                    Login
                </button>
            </form>
        </div>
    );
}
