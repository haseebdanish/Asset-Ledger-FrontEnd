import { useEffect, useMemo, useState } from "react";

import Navbar from "../../components/Navbar";
import AssetTable from "../../components/AssetTable";
import AddAssetModal from "../../components/AddAssetModal";

import assetService from "../../services/assetService";
import { formatCurrency } from "../../utils/formatCurrency";
import { useCallback } from "react";
import Toast from "../../components/Toast";

const assetTypes = [
    { value: "ALL", label: "All categories" },
    { value: "STOCK", label: "Stocks" },
    { value: "MUTUAL_FUND", label: "Mutual Funds" },
    { value: "CRYPTO", label: "Crypto" },
    { value: "GOLD", label: "Gold" },
    { value: "BANK", label: "Bank" },
    { value: "REAL_ESTATE", label: "Real Estate" },
];

function MyAssets() {
    const [assets, setAssets] = useState([]);
    const [summary, setSummary] = useState(null);

    const [searchKeyword, setSearchKeyword] = useState("");
    const [selectedType, setSelectedType] = useState("ALL");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAsset, setEditingAsset] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [toast, setToast] = useState(null);

    const closeToast = useCallback(() => {
        setToast(null);
    }, []);

    const fetchAssets = async () => {
        const data = await assetService.getAssets();
        setAssets(data);
    };

    const fetchSummary = async () => {
        const data = await assetService.getSummary();
        setSummary(data);
    };

    const loadAssetsPage = async () => {
        try {
            setError("");
            await Promise.all([fetchAssets(), fetchSummary()]);
        } catch (err) {
            console.error("Failed to load assets:", err);
            setError(
                err.response?.data?.message ||
                "Unable to load your assets. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAssetsPage();
    }, []);

    const filteredAssets = useMemo(() => {
        return assets.filter((asset) => {
            const matchesSearch = asset.assetName
                ?.toLowerCase()
                .includes(searchKeyword.trim().toLowerCase());

            const matchesType =
                selectedType === "ALL" ||
                asset.assetType === selectedType;

            return matchesSearch && matchesType;
        });
    }, [assets, searchKeyword, selectedType]);

    const openAddModal = () => {
        setEditingAsset(null);
        setIsModalOpen(true);
    };

    const openEditModal = (asset) => {
        setEditingAsset(asset);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingAsset(null);
    };

    const handleAssetSaved = async () => {
        await loadAssetsPage();

        setToast({
            message: editingAsset
                ? "Asset updated successfully."
                : "Asset added successfully.",
            type: "success",
        });
    };

    const handleDelete = async (asset) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete "${asset.assetName}"? This action cannot be undone.`
        );

        if (!confirmed) return;

        try {
            await assetService.deleteAsset(asset.id);
            await loadAssetsPage();

            setToast({
                message: "Asset deleted successfully.",
                type: "success",
            });
        } catch (err) {
            console.error("Failed to delete asset:", err);
            console.error("Delete response:", err.response?.data);

            setError(
                err.response?.data?.message ||
                "Unable to delete this asset. Please try again."
            );
            setToast({
                message: "Unable to delete this asset.",
                type: "error",
            });
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#202329]">
                <div className="text-center">
                    <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-2 border-[#414751] border-t-[#315BDB]" />
                    <p className="text-sm text-[#A7ABB4]">
                        Loading your assets...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#202329] text-[#F1EFE8]">
            <Navbar />

            <Toast
                message={toast?.message}
                type={toast?.type}
                onClose={closeToast}
            />

            <main className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-10 lg:py-12">

                {/* Page heading */}
                <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                    <div>
                        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#A7ABB4]">
                            Portfolio management
                        </p>

                        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                            My Assets
                        </h1>

                        <p className="mt-2 text-sm text-[#A7ABB4]">
                            Manage and track all your investments in one place.
                        </p>
                    </div>

                    <button
                        onClick={openAddModal}
                        className="inline-flex items-center justify-center gap-2 bg-[#315BDB] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#274BC0]"
                    >
                        <span className="text-lg leading-none">+</span>
                        Add Asset
                    </button>
                </div>

                {/* Error message */}
                {error && (
                    <div
                        role="alert"
                        className="mb-6 border border-[#854C4C] bg-[#3A292C] px-4 py-3 text-sm text-[#EBA0A0]"
                    >
                        {error}
                    </div>
                )}

                {/* Overview cards */}
                <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="border border-[#414751] bg-[#2B3038] p-6">
                        <p className="text-sm text-[#A7ABB4]">
                            Total tracked assets
                        </p>

                        <p className="mt-3 text-3xl font-semibold tabular-nums">
                            {summary?.totalAssets ?? assets.length}
                        </p>

                        <p className="mt-2 text-xs text-[#A7ABB4]">
                            Across all asset categories
                        </p>
                    </div>

                    <div className="border border-[#414751] bg-[#2B3038] p-6">
                        <p className="text-sm text-[#A7ABB4]">
                            Total invested
                        </p>

                        <p className="mt-3 text-3xl font-semibold tabular-nums">
                            {formatCurrency(summary?.totalInvestment ?? 0)}
                        </p>

                        <p className="mt-2 text-xs text-[#A7ABB4]">
                            Combined investment amount
                        </p>
                    </div>
                </section>

                {/* Search and filters */}
                <section className="mb-5">
                    <div className="flex flex-col gap-3 sm:flex-row">
                        <div className="relative flex-1">
                            <input
                                type="text"
                                value={searchKeyword}
                                onChange={(e) => setSearchKeyword(e.target.value)}
                                placeholder="Search assets by name..."
                                className="w-full border border-[#414751] bg-[#2B3038] px-4 py-3 text-sm text-[#F1EFE8] placeholder:text-[#777E89] outline-none transition focus:border-[#315BDB]"
                            />
                        </div>

                        <select
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                            className="border border-[#414751] bg-[#2B3038] px-4 py-3 text-sm text-[#F1EFE8] outline-none transition focus:border-[#315BDB] sm:min-w-[190px]"
                        >
                            {assetTypes.map((type) => (
                                <option key={type.value} value={type.value}>
                                    {type.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </section>

                {/* Asset table */}
                <section>
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-semibold">
                                All assets
                            </h2>
                            <p className="mt-1 text-sm text-[#A7ABB4]">
                                Your complete asset list and investment details.
                            </p>
                        </div>

                        <span className="text-xs text-[#A7ABB4]">
                            {filteredAssets.length} results
                        </span>
                    </div>

                    <AssetTable
                        assets={filteredAssets}
                        onEdit={openEditModal}
                        onDelete={handleDelete}
                    />
                </section>
            </main>

            {/* Add / Edit modal */}
            <AddAssetModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onAssetAdded={handleAssetSaved}
                editingAsset={editingAsset}
            />
        </div>
    );
}

export default MyAssets;
