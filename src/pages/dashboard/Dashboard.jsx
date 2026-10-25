
import { useEffect, useState } from "react";

import Navbar from "../../components/Navbar";
import AssetTable from "../../components/AssetTable";
import AddAssetModal from "../../components/AddAssetModal";
import PortfolioChart from "../../components/PortfolioChart";

import assetService from "../../services/assetService";
import authService from "../../services/authService";

import { formatCurrency } from "../../utils/formatCurrency";

const assetTypes = [
    { value: "ALL", label: "All asset types" },
    { value: "STOCK", label: "Stocks" },
    { value: "CRYPTO", label: "Crypto" },
    { value: "GOLD", label: "Gold" },
    { value: "MUTUAL_FUND", label: "Mutual funds" },
    { value: "BANK", label: "Bank" },
    { value: "REAL_ESTATE", label: "Real estate" },
];

function MetricCard({ label, value, description }) {
    return (
        <div className="min-w-0 rounded-2xl border border-[#e6e8e2] bg-white p-5 transition duration-200 hover:border-[#cbd8cf] sm:p-6">
            <p className="text-sm font-medium text-[#78817c]">
                {label}
            </p>

            <p className="mt-3 break-words text-2xl font-semibold tracking-tight text-[#202b28] sm:text-3xl">
                {value}
            </p>

            {description && (
                <p className="mt-2 text-xs leading-5 text-[#89918c]">
                    {description}
                </p>
            )}
        </div>
    );
}

function Dashboard() {
    const [user, setUser] = useState(null);
    const [summary, setSummary] = useState(null);
    const [assets, setAssets] = useState([]);
    const [allocation, setAllocation] = useState([]);

    const [searchKeyword, setSearchKeyword] = useState("");
    const [selectedType, setSelectedType] = useState("ALL");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAsset, setEditingAsset] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchUser = async () => {
        const data = await authService.getCurrentUser();
        setUser(data);
    };

    const fetchSummary = async () => {
        const data = await assetService.getSummary();
        setSummary(data);
    };

    const fetchAllocation = async () => {
        const data = await assetService.getAllocation();
        setAllocation(data);
    };

    const fetchAssets = async () => {
        let data;

        if (searchKeyword.trim() !== "") {
            data = await assetService.searchAssets(searchKeyword);
        } else if (selectedType !== "ALL") {
            data = await assetService.getAssetsByType(selectedType);
        } else {
            data = await assetService.getAssets();
        }

        setAssets(data);
    };

    const loadDashboard = async () => {
        try {
            setLoading(true);
            setError("");

            await Promise.all([
                fetchUser(),
                fetchSummary(),
                fetchAllocation(),
                fetchAssets(),
            ]);
        } catch (err) {
            console.error("Failed to load dashboard:", err);
            setError("Unable to load your portfolio. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDashboard();
    }, []);

    useEffect(() => {
        if (loading) return;

        const updateAssets = async () => {
            try {
                setError("");
                await fetchAssets();
            } catch (err) {
                console.error("Failed to fetch assets:", err);
                setError("Unable to load your assets.");
            }
        };

        updateAssets();
    }, [searchKeyword, selectedType]);

    const refreshPortfolio = async () => {
        await Promise.all([
            fetchAssets(),
            fetchSummary(),
            fetchAllocation(),
        ]);
    };

    const handleDelete = async (asset) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete ${asset.assetName}?`
        );

        if (!confirmed) return;

        try {
            setError("");

            await assetService.deleteAsset(asset.id);
            await refreshPortfolio();
        } catch (err) {
            console.error("Failed to delete asset:", err);
            setError("Failed to delete asset. Please try again.");
        }
    };

    const openAddModal = () => {
        setEditingAsset(null);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingAsset(null);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f6f5f0]">
                <Navbar />

                <main className="mx-auto flex min-h-[75vh] max-w-[1440px] items-center justify-center px-6">
                    <div className="text-center">
                        <div className="mx-auto mb-5 h-9 w-9 animate-spin rounded-full border-[3px] border-[#dce5de] border-t-[#52796f]" />

                        <h2 className="text-lg font-semibold text-[#172b27]">
                            Preparing your portfolio
                        </h2>

                        <p className="mt-2 text-sm text-[#78817c]">
                            Fetching your latest asset information.
                        </p>
                    </div>
                </main>
            </div>
        );
    }

    if (error && !summary) {
        return (
            <div className="min-h-screen bg-[#f6f5f0]">
                <Navbar />

                <main className="mx-auto flex min-h-[75vh] max-w-[1440px] items-center justify-center px-4">
                    <div className="w-full max-w-md rounded-2xl border border-[#e6e8e2] bg-white p-8 text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#f8e9e5] text-xl text-[#9d4838]">
                            !
                        </div>

                        <h2 className="mt-5 text-xl font-semibold text-[#172b27]">
                            We couldn't load your portfolio
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-[#78817c]">
                            {error}
                        </p>

                        <button
                            onClick={loadDashboard}
                            className="mt-6 rounded-lg bg-[#172b27] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#29463d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#52796f] focus-visible:ring-offset-2"
                        >
                            Try again
                        </button>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f6f5f0]">
            <Navbar />

            <main className="mx-auto max-w-[1440px] px-4 py-7 sm:px-6 sm:py-9 lg:px-10 lg:py-10">
                {/* Page heading */}
                <section className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#52796f]">
                            Your financial overview
                        </p>

                        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#172b27] sm:text-4xl">
                            Portfolio overview
                        </h1>

                        <p className="mt-2 text-sm leading-6 text-[#78817c] sm:text-base">
                            {user?.userName
                                ? `Welcome back, ${user.userName}. Here's where your investments stand.`
                                : "A clear view of your investments, all in one place."}
                        </p>
                    </div>

                    <button
                        onClick={openAddModal}
                        className="inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-xl bg-[#172b27] px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-[#29463d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#52796f] focus-visible:ring-offset-2 sm:self-auto"
                    >
                        <span className="text-lg leading-none">+</span>
                        Add an asset
                    </button>
                </section>

                {/* Error banner */}
                {error && (
                    <div
                        role="alert"
                        className="mb-6 flex items-start justify-between gap-4 rounded-xl border border-[#efd2ca] bg-[#fff6f2] px-4 py-3 text-sm text-[#914b3b]"
                    >
                        <p>{error}</p>

                        <button
                            onClick={() => setError("")}
                            aria-label="Dismiss error"
                            className="shrink-0 font-medium hover:text-[#692d22]"
                        >
                            ✕
                        </button>
                    </div>
                )}

                {/* Portfolio overview */}
                <section aria-label="Portfolio summary">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        {/* Primary metric */}
                        <div className="relative overflow-hidden rounded-2xl bg-[#172b27] p-6 text-white sm:col-span-2 sm:p-7">
                            <div className="pointer-events-none absolute -right-10 -top-14 h-48 w-48 rounded-full border border-white/[0.08]" />
                            <div className="pointer-events-none absolute -right-2 -top-6 h-32 w-32 rounded-full border border-white/[0.08]" />

                            <div className="relative">
                                <p className="text-sm font-medium text-[#c3d2ca]">
                                    Total invested
                                </p>

                                <p className="mt-4 break-words text-3xl font-semibold tracking-tight sm:text-4xl lg:text-[2.65rem]">
                                    {formatCurrency(
                                        summary?.totalInvestment ?? 0
                                    )}
                                </p>

                                <div className="mt-7 flex items-center gap-2">
                                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-[#d9e7de]">
                                        ↗
                                    </span>

                                    <span className="text-xs text-[#c3d2ca]">
                                        Across your tracked investments
                                    </span>
                                </div>
                            </div>
                        </div>

                        <MetricCard
                            label="Total assets"
                            value={summary?.totalAssets ?? 0}
                            description="Assets in your portfolio"
                        />

                        <MetricCard
                            label="Stock investments"
                            value={formatCurrency(
                                summary?.stockInvestment ?? 0
                            )}
                            description="Total invested in stocks"
                        />
                    </div>

                    {/* Secondary metric */}
                    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <MetricCard
                            label="Crypto investments"
                            value={formatCurrency(
                                summary?.cryptoInvestment ?? 0
                            )}
                            description="Total invested in crypto"
                        />

                        <div className="flex items-center justify-between gap-4 rounded-2xl border border-[#e6e8e2] bg-white px-5 py-5 sm:px-6">
                            <div>
                                <p className="text-sm font-medium text-[#78817c]">
                                    Portfolio coverage
                                </p>

                                <p className="mt-2 text-sm leading-6 text-[#34433d]">
                                    {assetTypes.length - 1} supported asset classes
                                </p>
                            </div>

                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#eaf0eb] text-[#365c4e]">
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    className="h-5 w-5"
                                    stroke="currentColor"
                                    strokeWidth="1.7"
                                    aria-hidden="true"
                                >
                                    <path
                                        d="M4 19V5m0 14h16M8 15v-4m4 4V7m4 8v-6"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Allocation */}
                <section className="mt-10 sm:mt-12">
                    <div className="mb-5">
                        <h2 className="text-xl font-semibold tracking-tight text-[#172b27]">
                            Asset allocation
                        </h2>

                        <p className="mt-1 text-sm text-[#78817c]">
                            See how your investments are distributed.
                        </p>
                    </div>

                    <PortfolioChart allocation={allocation} />
                </section>

                {/* Asset management */}
                <section className="mt-10 sm:mt-12">
                    <div className="mb-5">
                        <h2 className="text-xl font-semibold tracking-tight text-[#172b27]">
                            Your assets
                        </h2>

                        <p className="mt-1 text-sm text-[#78817c]">
                            Search, review, and manage your investments.
                        </p>
                    </div>

                    <div className="mb-5 rounded-2xl border border-[#e6e8e2] bg-white p-4 sm:p-5">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                            <div className="relative min-w-0 flex-1">
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#89918c]"
                                    aria-hidden="true"
                                >
                                    <circle cx="10.8" cy="10.8" r="6.8" />
                                    <path
                                        d="m16 16 4 4"
                                        strokeLinecap="round"
                                    />
                                </svg>

                                <input
                                    type="text"
                                    aria-label="Search assets"
                                    placeholder="Search by asset name..."
                                    value={searchKeyword}
                                    onChange={(e) =>
                                        setSearchKeyword(e.target.value)
                                    }
                                    className="min-h-11 w-full rounded-xl border border-[#e2e5df] bg-[#fbfbf9] py-2.5 pl-10 pr-4 text-sm text-[#202b28] outline-none transition placeholder:text-[#9ba29d] focus:border-[#52796f] focus:bg-white focus:ring-2 focus:ring-[#52796f]/15"
                                />
                            </div>

                            <div className="sm:w-56">
                                <select
                                    aria-label="Filter by asset type"
                                    value={selectedType}
                                    onChange={(e) =>
                                        setSelectedType(e.target.value)
                                    }
                                    className="min-h-11 w-full rounded-xl border border-[#e2e5df] bg-[#fbfbf9] px-3.5 py-2.5 text-sm text-[#34433d] outline-none transition focus:border-[#52796f] focus:ring-2 focus:ring-[#52796f]/15"
                                >
                                    {assetTypes.map((type) => (
                                        <option
                                            key={type.value}
                                            value={type.value}
                                        >
                                            {type.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#eef0eb] pt-4">
                            <p className="text-xs text-[#78817c]">
                                Showing{" "}
                                <span className="font-semibold text-[#34433d]">
                                    {assets.length}
                                </span>{" "}
                                {assets.length === 1 ? "asset" : "assets"}
                            </p>

                            {(searchKeyword || selectedType !== "ALL") && (
                                <button
                                    onClick={() => {
                                        setSearchKeyword("");
                                        setSelectedType("ALL");
                                    }}
                                    className="text-xs font-semibold text-[#52796f] transition hover:text-[#172b27]"
                                >
                                    Clear filters
                                </button>
                            )}
                        </div>
                    </div>

                    <AssetTable
                        assets={assets}
                        onEdit={(asset) => {
                            setEditingAsset(asset);
                            setIsModalOpen(false);
                        }}
                        onDelete={handleDelete}
                    />
                </section>

                {/* Add / edit modal */}
                <AddAssetModal
                    isOpen={isModalOpen || editingAsset !== null}
                    onClose={closeModal}
                    onAssetAdded={refreshPortfolio}
                    editingAsset={editingAsset}
                />

                <footer className="mt-12 border-t border-[#e3e6df] py-6 text-center">
                    <p className="text-xs tracking-wide text-[#89918c]">
                        ASSETLEDGER · YOUR FINANCES, IN FOCUS
                    </p>
                </footer>
            </main>
        </div>
    );
}

export default Dashboard;
