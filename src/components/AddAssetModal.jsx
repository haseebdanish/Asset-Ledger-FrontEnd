import { useEffect, useState } from "react";
import assetService from "../services/assetService";

const assetTypes = [
    { value: "STOCK", label: "Stocks" },
    { value: "CRYPTO", label: "Cryptocurrency" },
    { value: "GOLD", label: "Gold" },
    { value: "MUTUAL_FUND", label: "Mutual funds" },
    { value: "BANK", label: "Bank" },
    { value: "REAL_ESTATE", label: "Real estate" },
];

const inputClass =
    "w-full border border-[#414751] bg-[#252A31] px-4 py-3 text-sm text-[#F1EFE8] outline-none transition placeholder:text-[#777F8B] focus:border-[#315BDB] focus:ring-2 focus:ring-[#315BDB]/20 disabled:cursor-not-allowed disabled:opacity-60";

const labelClass =
    "mb-2 block text-sm font-medium text-[#D9D9D3]";

function AddAssetModal({
    isOpen,
    onClose,
    onAssetAdded,
    editingAsset,
}) {
    const [assetName, setAssetName] = useState("");
    const [assetType, setAssetType] = useState("STOCK");
    const [quantity, setQuantity] = useState("");
    const [investedAmount, setInvestedAmount] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (editingAsset) {
            setAssetName(editingAsset.assetName ?? "");
            setAssetType(editingAsset.assetType ?? "STOCK");
            setQuantity(String(editingAsset.quantity ?? ""));
            setInvestedAmount(String(editingAsset.investedAmount ?? ""));
        } else {
            setAssetName("");
            setAssetType("STOCK");
            setQuantity("");
            setInvestedAmount("");
        }

        setError("");
    }, [editingAsset, isOpen]);

    useEffect(() => {
        if (!isOpen) return;

        const handleEscape = (event) => {
            if (event.key === "Escape" && !loading) {
                onClose();
            }
        };

        window.addEventListener("keydown", handleEscape);

        return () => {
            window.removeEventListener("keydown", handleEscape);
        };
    }, [isOpen, loading, onClose]);

    if (!isOpen) return null;

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (loading) return;

        const normalizedName = assetName.trim();
        const parsedQuantity = Number(quantity);
        const parsedInvestment = Number(investedAmount);

        if (!normalizedName) {
            setError("Please enter an asset name.");
            return;
        }

        if (!Number.isFinite(parsedQuantity) || parsedQuantity <= 0) {
            setError("Quantity must be greater than zero.");
            return;
        }

        if (!Number.isFinite(parsedInvestment) || parsedInvestment <= 0) {
            setError("Investment amount must be greater than zero.");
            return;
        }

        setError("");
        setLoading(true);

        try {
            const assetData = {
                assetName: normalizedName,
                assetType,
                quantity: parsedQuantity,
                investedAmount: parsedInvestment,
            };

            if (editingAsset) {
                await assetService.updateAsset(editingAsset.id, assetData);
            } else {
                await assetService.addAsset(assetData);
            }

            await onAssetAdded();
            onClose();
        } catch (err) {
            console.error("Failed to save asset:", err);

            setError(
                err.response?.data?.message ||
                "We couldn't save this asset. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/65 px-4 py-6 backdrop-blur-sm"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget && !loading) {
                    onClose();
                }
            }}
        >
            <section
                role="dialog"
                aria-modal="true"
                aria-labelledby="asset-modal-title"
                className="my-auto w-full max-w-lg overflow-hidden border border-[#526071] bg-[#2B3038] shadow-2xl shadow-black/30"
            >
                {/* Modal header */}
                <div className="border-b border-[#414751] px-5 py-5 sm:px-7 sm:py-6">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3.5">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-[#52617f] bg-[#343A44] text-[#91ACFA]">
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.7"
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                >
                                    <path
                                        d="M12 5v14M5 12h14"
                                        strokeLinecap="round"
                                    />
                                </svg>
                            </div>

                            <div>
                                <h2
                                    id="asset-modal-title"
                                    className="text-lg font-semibold tracking-tight text-[#F1EFE8] sm:text-xl"
                                >
                                    {editingAsset ? "Edit asset" : "Add a new asset"}
                                </h2>

                                <p className="mt-1 text-sm leading-5 text-[#A7ABB4]">
                                    {editingAsset
                                        ? "Update the details of your holding."
                                        : "Record an investment in your portfolio."}
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            aria-label="Close modal"
                            className="flex h-9 w-9 shrink-0 items-center justify-center text-[#A7ABB4] transition hover:bg-[#343A44] hover:text-[#F1EFE8] disabled:opacity-50"
                        >
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                className="h-5 w-5"
                                aria-hidden="true"
                            >
                                <path
                                    d="m6 6 12 12M18 6 6 18"
                                    strokeLinecap="round"
                                />
                            </svg>
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-5 px-5 py-6 sm:px-7">
                        {/* Asset name */}
                        <div>
                            <label htmlFor="asset-name" className={labelClass}>
                                Asset name
                            </label>

                            <input
                                id="asset-name"
                                type="text"
                                value={assetName}
                                onChange={(event) => setAssetName(event.target.value)}
                                placeholder="e.g. Apple, Bitcoin, HDFC Bank"
                                autoComplete="off"
                                maxLength={100}
                                required
                                disabled={loading}
                                className={inputClass}
                            />

                            <p className="mt-1.5 text-xs text-[#89919C]">
                                Enter the name you use to identify this investment.
                            </p>
                        </div>

                        {/* Asset type */}
                        <div>
                            <label htmlFor="asset-type" className={labelClass}>
                                Asset class
                            </label>

                            <div className="relative">
                                <select
                                    id="asset-type"
                                    value={assetType}
                                    onChange={(event) => setAssetType(event.target.value)}
                                    disabled={loading}
                                    className={`${inputClass} appearance-none pr-10`}
                                >
                                    {assetTypes.map((type) => (
                                        <option key={type.value} value={type.value}>
                                            {type.label}
                                        </option>
                                    ))}
                                </select>

                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A7ABB4]"
                                    aria-hidden="true"
                                >
                                    <path
                                        d="m7 10 5 5 5-5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </div>
                        </div>

                        {/* Quantity and investment */}
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                            <div>
                                <label htmlFor="asset-quantity" className={labelClass}>
                                    Quantity
                                </label>

                                <input
                                    id="asset-quantity"
                                    type="number"
                                    step="any"
                                    min="0"
                                    value={quantity}
                                    onChange={(event) => setQuantity(event.target.value)}
                                    placeholder="e.g. 10"
                                    required
                                    disabled={loading}
                                    className={inputClass}
                                />

                                <p className="mt-1.5 text-xs text-[#89919C]">
                                    Units owned
                                </p>
                            </div>

                            <div>
                                <label htmlFor="asset-investment" className={labelClass}>
                                    Invested amount
                                </label>

                                <div className="relative">
                                    <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-[#A7ABB4]">
                                        ₹
                                    </span>

                                    <input
                                        id="asset-investment"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={investedAmount}
                                        onChange={(event) => setInvestedAmount(event.target.value)}
                                        placeholder="50,000"
                                        required
                                        disabled={loading}
                                        className={`${inputClass} pl-8`}
                                    />
                                </div>

                                <p className="mt-1.5 text-xs text-[#89919C]">
                                    Total amount invested
                                </p>
                            </div>
                        </div>

                        {/* Error message */}
                        {error && (
                            <div
                                role="alert"
                                className="border border-[#70464A] bg-[#392B30] px-4 py-3"
                            >
                                <p className="text-sm leading-5 text-[#E9A0A0]">
                                    {error}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Footer actions */}
                    <div className="flex flex-col-reverse gap-3 border-t border-[#414751] bg-[#252A31] px-5 py-4 sm:flex-row sm:justify-end sm:px-7">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="min-h-11 border border-[#414751] px-5 py-2.5 text-sm font-medium text-[#A7ABB4] transition hover:bg-[#343A44] hover:text-[#F1EFE8] disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="inline-flex min-h-11 items-center justify-center gap-2 bg-[#315BDB] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#274BC0] focus-visible:ring-2 focus-visible:ring-[#8199E8] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading && (
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                            )}

                            {loading
                                ? "Saving..."
                                : editingAsset
                                  ? "Save changes"
                                  : "Add asset"}
                        </button>
                    </div>
                </form>
            </section>
        </div>
    );
}

export default AddAssetModal;
