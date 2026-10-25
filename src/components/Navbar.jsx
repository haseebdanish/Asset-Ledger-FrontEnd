import { useNavigate } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/", { replace: true });
    };

    return (
        <nav className="bg-white border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

                <button
                    onClick={() => navigate("/dashboard")}
                    className="text-2xl font-bold text-blue-600"
                >
                    AssetLedger
                </button>

                <div className="flex items-center gap-4">
                    <span className="hidden sm:inline text-sm text-slate-500">
                        Portfolio Dashboard
                    </span>

                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition"
                    >
                        Logout
                    </button>
                </div>

            </div>
        </nav>
    );
}

export default Navbar;