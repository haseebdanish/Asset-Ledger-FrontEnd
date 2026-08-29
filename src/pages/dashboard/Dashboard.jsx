import { useEffect, useState } from "react";

import Navbar from "../../components/Navbar";
import SummaryCard from "../../components/SummaryCard";
import AssetTable from "../../components/AssetTable";
import AddAssetModal from "../../components/AddAssetModal";
import PortfolioChart from "../../components/PortfolioChart";

import assetService from "../../services/assetService";
import authService from "../../services/authService";

import { formatCurrency } from "../../utils/formatCurrency";

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


    // --------------------------------
    // Fetch Current User
    // --------------------------------

    const fetchUser = async () => {

        const data = await authService.getCurrentUser();

        setUser(data);

    };


    // --------------------------------
    // Fetch Portfolio Summary
    // --------------------------------

    const fetchSummary = async () => {

        const data = await assetService.getSummary();

        setSummary(data);

    };


    // --------------------------------
    // Fetch Portfolio Allocation
    // --------------------------------

    const fetchAllocation = async () => {

        const data = await assetService.getAllocation();

        setAllocation(data);

    };


    // --------------------------------
    // Fetch Assets
    // --------------------------------

    const fetchAssets = async () => {

        let data;

        if (searchKeyword.trim() !== "") {

            data = await assetService.searchAssets(
                searchKeyword
            );

        } else if (selectedType !== "ALL") {

            data = await assetService.getAssetsByType(
                selectedType
            );

        } else {

            data = await assetService.getAssets();

        }

        setAssets(data);

    };


    // --------------------------------
    // Load Dashboard
    // --------------------------------

    const loadDashboard = async () => {

        try {

            setLoading(true);
            setError("");

            await Promise.all([
                fetchUser(),
                fetchSummary(),
                fetchAllocation(),
                fetchAssets()
            ]);

        } catch (error) {

            console.error(
                "Failed to load dashboard:",
                error
            );

            setError(
                "Unable to load your portfolio. Please try again."
            );

        } finally {

            setLoading(false);

        }

    };


    // --------------------------------
    // Initial Dashboard Load
    // --------------------------------

    useEffect(() => {

        loadDashboard();

    }, []);


    // --------------------------------
    // Search / Filter
    // --------------------------------

    useEffect(() => {

        // Don't fetch again while the initial
        // dashboard is loading.

        if (loading) {
            return;
        }

        const updateAssets = async () => {

            try {

                setError("");

                await fetchAssets();

            } catch (error) {

                console.error(
                    "Failed to fetch assets:",
                    error
                );

                setError(
                    "Unable to load your assets."
                );

            }

        };

        updateAssets();

    }, [searchKeyword, selectedType]);


    // --------------------------------
    // Delete Asset
    // --------------------------------

    const handleDelete = async (asset) => {

        const confirmed = window.confirm(
            `Are you sure you want to delete ${asset.assetName}?`
        );

        if (!confirmed) {
            return;
        }

        try {

            setError("");

            await assetService.deleteAsset(asset.id);

            await fetchAssets();
            await fetchSummary();
            await fetchAllocation();

        } catch (error) {

            console.error(
                "Failed to delete asset:",
                error
            );

            setError(
                "Failed to delete asset. Please try again."
            );

        }

    };


    // --------------------------------
    // Loading State
    // --------------------------------

    if (loading) {

        return (

            <div className="min-h-screen bg-slate-100">

                <Navbar />

                <div className="flex items-center justify-center min-h-[80vh]">

                    <div className="text-center">

                        <div className="text-2xl font-semibold text-slate-700">
                            Loading portfolio...
                        </div>

                        <p className="text-slate-500 mt-2">
                            Please wait a moment.
                        </p>

                    </div>

                </div>

            </div>

        );

    }


    // --------------------------------
    // Error State
    // --------------------------------

    if (error && !summary) {

        return (

            <div className="min-h-screen bg-slate-100">

                <Navbar />

                <div className="flex items-center justify-center min-h-[80vh] px-4">

                    <div className="bg-white rounded-xl shadow p-8 text-center max-w-md">

                        <h2 className="text-2xl font-bold text-slate-800">
                            Something went wrong
                        </h2>

                        <p className="text-slate-500 mt-3">
                            {error}
                        </p>

                        <button
                            onClick={loadDashboard}
                            className="mt-6 bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                        >
                            Try Again
                        </button>

                    </div>

                </div>

            </div>

        );

    }


    return (

        <div className="min-h-screen bg-slate-100">

            <Navbar />

            <div className="max-w-7xl mx-auto px-6 py-8">

                {/* Welcome */}

                <h2 className="text-3xl font-bold mb-8">

                    Welcome Back
                    {user ? `, ${user.userName}` : ""} 👋

                </h2>


                {/* Error Banner */}

                {error && (

                    <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex justify-between items-center">

                        <span>
                            {error}
                        </span>

                        <button
                            onClick={() => setError("")}
                            className="font-semibold hover:text-red-900"
                        >
                            ✕
                        </button>

                    </div>

                )}


                {/* Summary Cards */}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                    <SummaryCard
                        title="Total Investment"
                        value={formatCurrency(
                            summary?.totalInvestment ?? 0
                        )}
                    />

                    <SummaryCard
                        title="Total Assets"
                        value={summary?.totalAssets ?? 0}
                    />

                    <SummaryCard
                        title="Stocks"
                        value={formatCurrency(
                            summary?.stockInvestment ?? 0
                        )}
                    />

                    <SummaryCard
                        title="Crypto"
                        value={formatCurrency(
                            summary?.cryptoInvestment ?? 0
                        )}
                    />

                </div>


                {/* Portfolio Chart */}

                <PortfolioChart
                    allocation={allocation}
                />


                {/* Portfolio Toolbar */}

                <div className="mt-8 mb-4 flex flex-col md:flex-row justify-between gap-4">

                    <div className="flex flex-col sm:flex-row gap-4">

                        <input
                            type="text"
                            placeholder="🔍 Search assets..."
                            value={searchKeyword}
                            onChange={(e) =>
                                setSearchKeyword(e.target.value)
                            }
                            className="w-full sm:w-80 px-4 py-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />


                        <select
                            value={selectedType}
                            onChange={(e) =>
                                setSelectedType(e.target.value)
                            }
                            className="px-4 py-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >

                            <option value="ALL">
                                All
                            </option>

                            <option value="STOCK">
                                Stock
                            </option>

                            <option value="CRYPTO">
                                Crypto
                            </option>

                            <option value="GOLD">
                                Gold
                            </option>

                            <option value="MUTUAL_FUND">
                                Mutual Fund
                            </option>

                            <option value="BANK">
                                Bank
                            </option>

                            <option value="REAL_ESTATE">
                                Real Estate
                            </option>

                        </select>

                    </div>


                    {/* Add Asset */}

                    <button
                        onClick={() => {
                            setEditingAsset(null);
                            setIsModalOpen(true);
                        }}
                        className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                    >
                        + Add Asset
                    </button>

                </div>


                {/* Asset Table */}

                <AssetTable
                    assets={assets}
                    onEdit={(asset) => {
                        setEditingAsset(asset);
                        setIsModalOpen(false);
                    }}
                    onDelete={handleDelete}
                />


                {/* Add / Edit Modal */}

                <AddAssetModal
                    isOpen={
                        isModalOpen ||
                        editingAsset !== null
                    }
                    onClose={() => {

                        setIsModalOpen(false);
                        setEditingAsset(null);

                    }}
                    onAssetAdded={async () => {

                        await fetchAssets();
                        await fetchSummary();
                        await fetchAllocation();

                    }}
                    editingAsset={editingAsset}
                />

            </div>

        </div>

    );

}

export default Dashboard;