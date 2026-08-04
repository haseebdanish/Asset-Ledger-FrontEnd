import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {

    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <nav className="bg-white shadow-sm border-b">

            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

                <h1 className="text-2xl font-bold text-blue-600">
                    AssetLedger
                </h1>

                <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
                >
                    Logout
                </button>

            </div>

        </nav>
    );
}

export default Navbar;