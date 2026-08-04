import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import authService from "../../services/authService";
import { useAuth } from "../../context/AuthContext";


function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useAuth();

const navigate = useNavigate();

const handleLogin = async (e) => {
    e.preventDefault();

    try {

        const response = await authService.login({
            email,
            password,
        });

        login(response.token);

        navigate("/dashboard");

    } catch (error) {
        console.error(error);
    }
};

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">

            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

                <div className="text-center mb-8">

                    <h1 className="text-4xl font-bold text-blue-600">
                        AssetLedger
                    </h1>

                    <p className="text-slate-500 mt-2">
                        Track your wealth securely
                    </p>

                </div>

                <form onSubmit={handleLogin}
                    className="space-y-5">

                    <div>

                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Email
                        </label>

                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                    </div>

                    <div>

                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Password
                        </label>

                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-200"
                    >
                        Login
                    </button>

                </form>

                <p className="text-center text-slate-500 mt-6">

                    Don't have an account?

                    <Link
                        to="/register"
                        className="text-blue-600 font-medium ml-2 hover:underline"
                    >
                        Register
                    </Link>

                </p>

            </div>

        </div>
    );
}

export default Login;