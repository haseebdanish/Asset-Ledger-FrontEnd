
import { formatCurrency } from "../utils/formatCurrency";

const assetTypeStyles = {
    STOCK: "bg-[#e8efe9] text-[#365c4e]",
    CRYPTO: "bg-[#f5eddf] text-[#8a6831]",
    GOLD: "bg-[#f6efd9] text-[#896d24]",
    MUTUAL_FUND: "bg-[#e9eaf7] text-[#535b94]",
    BANK: "bg-[#e5eff6] text-[#376781]",
    REAL_ESTATE: "bg-[#f2e7e1] text-[#8a5844]",
};

const assetTypeLabels = {
    STOCK: "Stocks",
    CRYPTO: "Crypto",
    GOLD: "Gold",
    MUTUAL_FUND: "Mutual fund",
    BANK: "Bank",
    REAL_ESTATE: "Real estate",
};

function AssetTypeBadge({ type }) {
    const styles =
        assetTypeStyles[type] ?? "bg-[#f0f1ed] text-[#5d665f]";

    const label = assetTypeLabels[type] ?? type?.replaceAll("_", " ");

    return (
        <span
            className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium ${styles}`}
        >
            {label}
        </span>
    );
}

function AssetTable({ assets, onEdit, onDelete }) {
    return (
        <div className="overflow-hidden rounded-2xl border border-[#e6e8e2] bg-white">
            {/* Table heading */}
            <div className="flex flex-col gap-1 border-b border-[#e9ebe6] px-5 py-5 sm:px-6">
                <h3 className="text-base font-semibold tracking-tight text-[#172b27]">
                    Portfolio holdings
                </h3>

                <p className="text-sm text-[#78817c]">
                    A breakdown of your tracked assets and investments.
                </p>
            </div>

            {assets.length === 0 ? (
                <div className="px-5 py-16 text-center sm:px-6">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#edf2ed] text-[#52796f]">
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            className="h-6 w-6"
                            aria-hidden="true"
                        >
                            <rect
                                x="3.5"
                                y="4.5"
                                width="17"
                                height="15"
                                rx="2"
                            />
                            <path
                                d="M8 9h8M8 13h5"
                                strokeLinecap="round"
                            />
                        </svg>
                    </div>

                    <h4 className="mt-4 text-sm font-semibold text-[#34433d]">
                        No assets found
                    </h4>

                    <p className="mx-auto mt-1 max-w-sm text-sm leading-6 text-[#78817c]">
                        Your holdings will appear here when you add an asset
                        or adjust your search and filters.
                    </p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[720px] border-collapse text-left">
                        <thead>
                            <tr className="border-b border-[#e9ebe6] bg-[#fafaf7]">
                                <th
                                    scope="col"
                                    className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-[#78817c]"
                                >
                                    Asset
                                </th>

                                <th
                                    scope="col"
                                    className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-[#78817c]"
                                >
                                    Type
                                </th>

                                <th
                                    scope="col"
                                    className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-[#78817c]"
                                >
                                    Quantity
                                </th>

                                <th
                                    scope="col"
                                    className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-[#78817c]"
                                >
                                    Investment
                                </th>

                                <th
                                    scope="col"
                                    className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-[#78817c]"
                                >
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-[#eef0eb]">
                            {assets.map((asset) => (
                                <tr
                                    key={asset.id}
                                    className="transition-colors duration-150 hover:bg-[#fafbf8]"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#edf2ed] text-sm font-semibold text-[#365c4e]">
                                                {asset.assetName
                                                    ?.trim()
                                                    ?.charAt(0)
                                                    ?.toUpperCase() ?? "A"}
                                            </div>

                                            <span className="max-w-[220px] truncate text-sm font-semibold text-[#27352f]">
                                                {asset.assetName}
                                            </span>
                                        </div>
                                    </td>

                                    <td className="px-5 py-4">
                                        <AssetTypeBadge
                                            type={asset.assetType}
                                        />
                                    </td>

                                    <td className="px-5 py-4 text-right text-sm tabular-nums text-[#56615a]">
                                        {asset.quantity}
                                    </td>

                                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-semibold tabular-nums text-[#27352f]">
                                        {formatCurrency(asset.investedAmount)}
                                    </td>

                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => onEdit(asset)}
                                                aria-label={`Edit ${asset.assetName}`}
                                                className="rounded-lg px-3 py-2 text-xs font-semibold text-[#52796f] transition hover:bg-[#edf2ed] hover:text-[#172b27] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#52796f]"
                                            >
                                                Edit
                                            </button>

                                            <button
                                                onClick={() => onDelete(asset)}
                                                aria-label={`Delete ${asset.assetName}`}
                                                className="rounded-lg px-3 py-2 text-xs font-semibold text-[#a45d4d] transition hover:bg-[#fff0eb] hover:text-[#813d30] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c47b69]"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Table footer */}
            {assets.length > 0 && (
                <div className="border-t border-[#e9ebe6] bg-[#fdfdfb] px-5 py-3.5 sm:px-6">
                    <p className="text-xs text-[#78817c]">
                        Showing{" "}
                        <span className="font-semibold text-[#34433d]">
                            {assets.length}
                        </span>{" "}
                        {assets.length === 1 ? "holding" : "holdings"}
                    </p>
                </div>
            )}
        </div>
    );
}

export default AssetTable;
