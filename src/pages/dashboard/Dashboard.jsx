import { useEffect, useState } from "react";

import Navbar from "../../components/Navbar";
import SummaryCard from "../../components/SummaryCard";
import AssetTable from "../../components/AssetTable";
import AddAssetModal from "../../components/AddAssetModal";

import assetService from "../../services/assetService";
import authService from "../../services/authService";

import { formatCurrency } from "../../utils/formatCurrency";

function Dashboard() {

    const [user, setUser] = useState(null);

    const [summary, setSummary] = useState(null);

    const [assets, setAssets] = useState([]);

    const [searchKeyword, setSearchKeyword] = useState("");

    const [selectedType, setSelectedType] = useState("ALL");

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [editingAsset, setEditingAsset] = useState(null);


    // -----------------------------
    // Fetch Current User
    // -----------------------------

    const fetchUser = async () => {

        try {

            const data = await authService.getCurrentUser();

            setUser(data);

        } catch (error) {

            console.error("Failed to fetch user:", error);

        }

    };


    // -----------------------------
    // Fetch Portfolio Summary
    // -----------------------------

    const fetchSummary = async () => {

        try {

            const data = await assetService.getSummary();

            setSummary(data);

        } catch (error) {

            console.error("Failed to fetch summary:", error);

        }

    };


    // -----------------------------
    // Fetch Assets
    // -----------------------------

    const fetchAssets = async () => {

        try {

            let data;

            if (searchKeyword.trim() !== "") {

                data = await assetService.searchAssets(searchKeyword);

            } else if (selectedType !== "ALL") {

                data = await assetService.getAssetsByType(selectedType);

            } else {

                data = await assetService.getAssets();

            }

            setAssets(data);

        } catch (error) {

            console.error("Failed to fetch assets:", error);

        }

    };

    const handleDelete = async (asset) => {

        const confirmed = window.confirm(
            `Are you sure you want to delete ${asset.assetName}?`
        );

        if (!confirmed) {
            return;
        }

        try {

            await assetService.deleteAsset(asset.id);

            await fetchAssets();
            await fetchSummary();

        } catch (error) {

            console.error("Failed to delete asset:", error);

        }
    };


    // -----------------------------
    // Initial Dashboard Data
    // -----------------------------

    useEffect(() => {

        fetchUser();
        fetchSummary();

    }, []);


    // -----------------------------
    // Fetch Assets when
    // Search / Filter changes
    // -----------------------------

    useEffect(() => {

        fetchAssets();

    }, [searchKeyword, selectedType]);


    return (

        <div className="min-h-screen bg-slate-100">

            <Navbar />

            <div className="max-w-7xl mx-auto px-6 py-8">

                {/* Welcome */}

                <h2 className="text-3xl font-bold mb-8">

                    Welcome Back
                    {user ? `, ${user.userName}` : ""} 👋

                </h2>


                {/* Summary Cards */}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                    <SummaryCard
                        title="Total Investment"
                        value={formatCurrency(
                            summary?.totalInvestment
                        )}
                    />

                    <SummaryCard
                        title="Total Assets"
                        value={summary?.totalAssets ?? 0}
                    />

                    <SummaryCard
                        title="Stocks"
                        value={formatCurrency(
                            summary?.stockInvestment
                        )}
                    />

                    <SummaryCard
                        title="Crypto"
                        value={formatCurrency(
                            summary?.cryptoInvestment
                        )}
                    />

                </div>


                {/* Portfolio Toolbar */}

                <div className="mt-8 mb-4 flex flex-col md:flex-row justify-between gap-4">

                    {/* Search + Filter */}

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

                        </select>

                    </div>


                    {/* Add Asset Button */}

                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                    >
                        + Add Asset
                    </button>

                </div>


                {/* Asset Table */}

                <AssetTable
                    assets={assets}
                    onEdit={(asset) => setEditingAsset(asset)}
                    onDelete={handleDelete}
                />


                {/* Add Asset Modal */}

                <AddAssetModal
                    isOpen={isModalOpen || editingAsset !== null}
                    onClose={() => {
                        setIsModalOpen(false);
                        setEditingAsset(null);
                    }}
                    onAssetAdded={async () => {
                        await fetchAssets();
                        await fetchSummary();
                    }}
                    editingAsset={editingAsset}
                />

            </div>

        </div>

    );

}

export default Dashboard;