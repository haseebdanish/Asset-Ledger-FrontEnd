
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
    "w-full rounded-xl border border-[#e2e5df] bg-[#fbfbf9] px-4 py-3 text-sm text-[#27352f] outline-none transition placeholder:text-[#a0a7a1] focus:border-[#52796f] focus:bg-white focus:ring-2 focus:ring-[#52796f]/15 disabled:cursor-not-allowed disabled:opacity-60";

const labelClass =
    "mb-2 block text-sm font-medium text-[#34433d]";

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
            setInvestedAmount(
                String(editingAsset.investedAmount ?? "")
            );
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

        if (
            !Number.isFinite(parsedInvestment) ||
            parsedInvestment <= 0
        ) {
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
                await assetService.updateAsset(
                    editingAsset.id,
                    assetData
                );
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
            className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#14221e]/50 px-4 py-6 backdrop-blur-[3px]"
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
                className="my-auto w-full max-w-lg overflow-hidden rounded-2xl border border-white/60 bg-white shadow-2xl shadow-[#172b27]/15"
            >
                {/* Modal header */}
                <div className="border-b border-[#e9ebe6] px-5 py-5 sm:px-7 sm:py-6">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3.5">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#eaf0eb] text-[#365c4e]">
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
                                    className="text-lg font-semibold tracking-tight text-[#172b27] sm:text-xl"
                                >
                                    {editingAsset
                                        ? "Edit asset"
                                        : "Add a new asset"}
                                </h2>

                                <p className="mt-1 text-sm leading-5 text-[#78817c]">
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
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[#78817c] transition hover:bg-[#f2f3ef] hover:text-[#172b27] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#52796f] disabled:opacity-50"
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
                            <label
                                htmlFor="asset-name"
                                className={labelClass}
                            >
                                Asset name
                            </label>

                            <input
                                id="asset-name"
                                type="text"
                                value={assetName}
                                onChange={(event) =>
                                    setAssetName(event.target.value)
                                }
                                placeholder="e.g. Apple, Bitcoin, HDFC Bank"
                                autoComplete="off"
                                maxLength={100}
                                required
                                disabled={loading}
                                className={inputClass}
                            />

                            <p className="mt-1.5 text-xs text-[#89918c]">
                                Enter the name you use to identify this investment.
                            </p>
                        </div>

                        {/* Asset type */}
                        <div>
                            <label
                                htmlFor="asset-type"
                                className={labelClass}
                            >
                                Asset class
                            </label>

                            <div className="relative">
                                <select
                                    id="asset-type"
                                    value={assetType}
                                    onChange={(event) =>
                                        setAssetType(event.target.value)
                                    }
                                    disabled={loading}
                                    className={`${inputClass} appearance-none pr-10`}
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

                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#78817c]"
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
                                <label
                                    htmlFor="asset-quantity"
                                    className={labelClass}
                                >
                                    Quantity
                                </label>

                                <input
                                    id="asset-quantity"
                                    type="number"
                                    step="any"
                                    min="0"
                                    value={quantity}
                                    onChange={(event) =>
                                        setQuantity(event.target.value)
                                    }
                                    placeholder="e.g. 10"
                                    required
                                    disabled={loading}
                                    className={inputClass}
                                />

                                <p className="mt-1.5 text-xs text-[#89918c]">
                                    Units owned
                                </p>
                            </div>

                            <div>
                                <label
                                    htmlFor="asset-investment"
                                    className={labelClass}
                                >
                                    Invested amount
                                </label>

                                <div className="relative">
                                    <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-[#78817c]">
                                        ₹
                                    </span>

                                    <input
                                        id="asset-investment"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={investedAmount}
                                        onChange={(event) =>
                                            setInvestedAmount(
                                                event.target.value
                                            )
                                        }
                                        placeholder="50,000"
                                        required
                                        disabled={loading}
                                        className={`${inputClass} pl-8`}
                                    />
                                </div>

                                <p className="mt-1.5 text-xs text-[#89918c]">
                                    Total amount invested
                                </p>
                            </div>
                        </div>

                        {/* Error message */}
                        {error && (
                            <div
                                role="alert"
                                className="flex items-start gap-3 rounded-xl border border-[#efd2ca] bg-[#fff6f2] px-4 py-3"
                            >
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    className="mt-0.5 h-4 w-4 shrink-0 text-[#a45d4d]"
                                    aria-hidden="true"
                                >
                                    <circle cx="12" cy="12" r="9" />
                                    <path
                                        d="M12 8v4m0 4h.01"
                                        strokeLinecap="round"
                                    />
                                </svg>

                                <p className="text-sm leading-5 text-[#914b3b]">
                                    {error}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Footer actions */}
                    <div className="flex flex-col-reverse gap-3 border-t border-[#e9ebe6] bg-[#fdfdfb] px-5 py-4 sm:flex-row sm:justify-end sm:px-7">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="min-h-11 rounded-xl border border-[#dfe3dc] px-5 py-2.5 text-sm font-medium text-[#34433d] transition hover:bg-[#f2f3ef] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#52796f] disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#172b27] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#29463d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#52796f] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
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
