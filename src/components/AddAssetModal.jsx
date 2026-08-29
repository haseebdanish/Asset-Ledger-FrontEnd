import { useEffect, useState } from "react";
import assetService from "../services/assetService";

function AddAssetModal({
    isOpen,
    onClose,
    onAssetAdded,
    editingAsset
}) {

    const [assetName, setAssetName] = useState("");
    const [assetType, setAssetType] = useState("STOCK");
    const [quantity, setQuantity] = useState("");
    const [investedAmount, setInvestedAmount] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");


    // --------------------------------
    // Populate form when editing
    // --------------------------------

    useEffect(() => {

        if (editingAsset) {

            setAssetName(editingAsset.assetName);
            setAssetType(editingAsset.assetType);
            setQuantity(editingAsset.quantity);
            setInvestedAmount(editingAsset.investedAmount);

        } else {

            setAssetName("");
            setAssetType("STOCK");
            setQuantity("");
            setInvestedAmount("");

        }

        setError("");

    }, [editingAsset, isOpen]);


    if (!isOpen) {
        return null;
    }


    // --------------------------------
    // Handle Submit
    // --------------------------------

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setLoading(true);

        try {

            const assetData = {
                assetName,
                assetType,
                quantity: Number(quantity),
                investedAmount: Number(investedAmount),
            };


            // EDIT
            if (editingAsset) {

                await assetService.updateAsset(
                    editingAsset.id,
                    assetData
                );

            }

            // ADD
            else {

                await assetService.addAsset(assetData);

            }


            // Refresh Dashboard data
            await onAssetAdded();


            // Reset form
            setAssetName("");
            setAssetType("STOCK");
            setQuantity("");
            setInvestedAmount("");


            // Close modal
            onClose();

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to save asset."
            );

        } finally {

            setLoading(false);

        }

    };


    return (

        <div className="fixed inset-0 z-50 bg-black/40 flex justify-center items-center px-4">

            <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">

                {/* Header */}

                <div className="flex justify-between items-center mb-6">

                    <h2 className="text-2xl font-bold">

                        {editingAsset
                            ? "Edit Asset"
                            : "Add Asset"
                        }

                    </h2>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="text-slate-400 hover:text-slate-600 text-xl"
                    >
                        ✕
                    </button>

                </div>


                <form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                >

                    {/* Asset Name */}

                    <div>

                        <label className="block mb-2 font-medium">
                            Asset Name
                        </label>

                        <input
                            type="text"
                            value={assetName}
                            onChange={(e) =>
                                setAssetName(e.target.value)
                            }
                            placeholder="e.g. Apple"
                            required
                            className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                    </div>


                    {/* Asset Type */}

                    <div>

                        <label className="block mb-2 font-medium">
                            Asset Type
                        </label>

                        <select
                            value={assetType}
                            onChange={(e) =>
                                setAssetType(e.target.value)
                            }
                            className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >

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


                    {/* Quantity */}

                    <div>

                        <label className="block mb-2 font-medium">
                            Quantity
                        </label>

                        <input
                            type="number"
                            step="any"
                            min="0"
                            value={quantity}
                            onChange={(e) =>
                                setQuantity(e.target.value)
                            }
                            placeholder="e.g. 10"
                            required
                            className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                    </div>


                    {/* Invested Amount */}

                    <div>

                        <label className="block mb-2 font-medium">
                            Invested Amount
                        </label>

                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={investedAmount}
                            onChange={(e) =>
                                setInvestedAmount(e.target.value)
                            }
                            placeholder="e.g. 50000"
                            required
                            className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                    </div>


                    {/* Error */}

                    {error && (

                        <p className="text-red-600 text-sm">
                            {error}
                        </p>

                    )}


                    {/* Buttons */}

                    <div className="flex justify-end gap-3 pt-4">

                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="px-4 py-2 border rounded-lg hover:bg-slate-50 disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                        >

                            {loading
                                ? "Saving..."
                                : editingAsset
                                    ? "Save Changes"
                                    : "Add Asset"
                            }

                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

}

export default AddAssetModal;