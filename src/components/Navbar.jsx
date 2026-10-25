import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/", { replace: true });
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[#e6e8e2] bg-white/95 backdrop-blur">
      <div className="mx-auto flex min-h-[72px] max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-10">
        <button
          onClick={() => navigate("/dashboard")}
          className="group flex items-center gap-3 text-left"
          aria-label="AssetLedger dashboard"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#172b27] text-sm font-bold tracking-tight text-white transition group-hover:bg-[#29463d]">
            AL
          </span>

          <span>
            <span className="block text-lg font-semibold tracking-tight text-[#172b27]">
              AssetLedger
            </span>
            <span className="hidden text-xs tracking-wide text-[#78817c] sm:block">
              PERSONAL WEALTH
            </span>
          </span>
        </button>

        <div className="flex items-center gap-3 sm:gap-5">
          <span className="hidden text-sm text-[#78817c] md:block">
            Your portfolio
          </span>

          <span className="hidden h-7 w-px bg-[#e6e8e2] sm:block" />

          <button
            onClick={handleLogout}
            className="rounded-lg border border-[#dfe3dc] px-3 py-2 text-sm font-medium text-[#34433d] transition hover:border-[#172b27] hover:bg-[#f6f5f0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#52796f] sm:px-4"
          >
            Log out
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;