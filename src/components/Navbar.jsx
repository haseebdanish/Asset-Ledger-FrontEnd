import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate("/", { replace: true });
    };

    return (
        <header className="sticky top-0 z-40 border-b border-[#414751] bg-[#202329]">
            <div className="mx-auto flex min-h-[76px] max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-10">

                {/* Brand */}
                <button
                    onClick={() => navigate("/dashboard")}
                    className="flex items-center gap-3 text-left"
                    aria-label="AssetLedger dashboard"
                >
                    <span className="flex h-10 w-10 items-center justify-center border border-[#52617f] bg-[#2B3038] text-sm font-bold tracking-tight text-[#F1EFE8]">
                        AL
                    </span>

                    <span>
                        <span className="block text-lg font-bold tracking-tight text-[#F1EFE8]">
                            AssetLedger
                        </span>
                        <span className="hidden text-[10px] font-medium tracking-[0.2em] text-[#A7ABB4] sm:block">
                            PERSONAL FINANCE
                        </span>
                    </span>
                </button>

                {/* Navigation */}
                <nav className="hidden items-center gap-8 md:flex">
                    <NavLink
                        to="/dashboard"
                        className={({ isActive }) =>
                            `border-b-2 py-2 text-sm font-medium transition ${
                                isActive
                                    ? "border-[#315BDB] text-[#F1EFE8]"
                                    : "border-transparent text-[#A7ABB4] hover:text-[#F1EFE8]"
                            }`
                        }
                    >
                        Dashboard
                    </NavLink>
                </nav>

                {/* Logout */}
                <button
                    onClick={handleLogout}
                    className="border border-[#414751] px-4 py-2 text-sm font-medium text-[#A7ABB4] transition hover:border-[#A7ABB4] hover:text-[#F1EFE8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#315BDB]"
                >
                    Log out
                </button>
            </div>
        </header>
    );
}

export default Navbar;
