
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import authService from "../../services/authService";
import { useAuth } from "../../context/AuthContext";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            const response = await authService.login({
                email,
                password,
            });

            login(response.token);
            navigate("/dashboard", { replace: true });
        } catch (err) {
            console.error("Login failed:", err);

            setError(
                err.response?.data?.message ||
                "Invalid email or password. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#f6f5f0] px-4 py-8">
            <div className="w-full max-w-md overflow-hidden rounded-2xl border border-[#e6e8e2] bg-white shadow-xl shadow-[#172b27]/5">
                <div className="px-6 py-9 sm:px-9">
                    <div className="mb-8 text-center">
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#172b27] text-sm font-bold text-white">
                            AL
                        </div>

                        <h1 className="text-3xl font-semibold tracking-tight text-[#172b27]">
                            AssetLedger
                        </h1>

                        <p className="mt-2 text-sm text-[#78817c]">
                            Your finances, in focus.
                        </p>
                    </div>

                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-[#27352f]">
                            Welcome back
                        </h2>

                        <p className="mt-1 text-sm text-[#78817c]">
                            Sign in to access your portfolio.
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div>
                            <label
                                htmlFor="login-email"
                                className="mb-2 block text-sm font-medium text-[#34433d]"
                            >
                                Email
                            </label>

                            <input
                                id="login-email"
                                type="email"
                                autoComplete="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={loading}
                                className="w-full rounded-xl border border-[#e2e5df] bg-[#fbfbf9] px-4 py-3 text-sm outline-none transition placeholder:text-[#a0a7a1] focus:border-[#52796f] focus:bg-white focus:ring-2 focus:ring-[#52796f]/15 disabled:opacity-60"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="login-password"
                                className="mb-2 block text-sm font-medium text-[#34433d]"
                            >
                                Password
                            </label>

                            <input
                                id="login-password"
                                type="password"
                                autoComplete="current-password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={loading}
                                className="w-full rounded-xl border border-[#e2e5df] bg-[#fbfbf9] px-4 py-3 text-sm outline-none transition placeholder:text-[#a0a7a1] focus:border-[#52796f] focus:bg-white focus:ring-2 focus:ring-[#52796f]/15 disabled:opacity-60"
                            />
                        </div>

                        {error && (
                            <div
                                role="alert"
                                aria-live="polite"
                                className="rounded-xl border border-[#efd2ca] bg-[#fff6f2] px-4 py-3 text-sm leading-5 text-[#914b3b]"
                            >
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="flex min-h-12 w-full items-center justify-center rounded-xl bg-[#172b27] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#29463d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#52796f] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? "Signing in..." : "Sign in"}
                        </button>
                    </form>

                    <p className="mt-7 text-center text-sm text-[#78817c]">
                        Don't have an account?
                        <Link
                            to="/register"
                            className="ml-1.5 font-semibold text-[#52796f] hover:text-[#172b27] hover:underline"
                        >
                            Create an account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;
