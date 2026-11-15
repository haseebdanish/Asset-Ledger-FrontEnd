import { formatCurrency } from "../utils/formatCurrency";

const assetTypeStyles = {
    STOCK: "bg-[#7194F5]/15 text-[#91ACFA]",
    CRYPTO: "bg-[#B18AE8]/15 text-[#C6A8F0]",
    GOLD: "bg-[#D6B66D]/15 text-[#E5CB8F]",
    MUTUAL_FUND: "bg-[#6FB9AA]/15 text-[#8BCDBF]",
    BANK: "bg-[#78A9C9]/15 text-[#9BC3DC]",
    REAL_ESTATE: "bg-[#D58E79]/15 text-[#E5A895]",
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
        assetTypeStyles[type] ?? "bg-[#414751] text-[#A7ABB4]";

    const label =
        assetTypeLabels[type] ?? type?.replaceAll("_", " ");

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
        <div className="overflow-hidden border border-[#414751] bg-[#2B3038]">

            {/* Table heading */}
            <div className="border-b border-[#414751] px-5 py-5 sm:px-6">
                <h3 className="text-base font-semibold tracking-tight text-[#F1EFE8]">
                    Your holdings
                </h3>

                <p className="mt-1 text-sm text-[#A7ABB4]">
                    A detailed view of your tracked assets and investments.
                </p>
            </div>

            {assets.length === 0 ? (
                <div className="px-5 py-16 text-center sm:px-6">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-[#414751] bg-[#343A44] text-[#8199E8]">
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

                    <h4 className="mt-4 text-sm font-semibold text-[#F1EFE8]">
                        No assets found
                    </h4>

                    <p className="mx-auto mt-1 max-w-sm text-sm leading-6 text-[#A7ABB4]">
                        Your holdings will appear here when you add an asset
                        or adjust your search and filters.
                    </p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[760px] border-collapse text-left">
                        <thead>
                            <tr className="border-b border-[#414751] bg-[#252A31]">
                                <th
                                    scope="col"
                                    className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#A7ABB4]"
                                >
                                    Asset
                                </th>

                                <th
                                    scope="col"
                                    className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-[#A7ABB4]"
                                >
                                    Type
                                </th>

                                <th
                                    scope="col"
                                    className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-[#A7ABB4]"
                                >
                                    Quantity
                                </th>

                                <th
                                    scope="col"
                                    className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-[#A7ABB4]"
                                >
                                    Investment
                                </th>

                                <th
                                    scope="col"
                                    className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-[#A7ABB4]"
                                >
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-[#414751]">
                            {assets.map((asset) => (
                                <tr
                                    key={asset.id}
                                    className="transition-colors duration-150 hover:bg-[#343A44]"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#52617f] bg-[#343A44] text-sm font-semibold text-[#8199E8]">
                                                {asset.assetName
                                                    ?.trim()
                                                    ?.charAt(0)
                                                    ?.toUpperCase() ?? "A"}
                                            </div>

                                            <span className="max-w-[220px] truncate text-sm font-semibold text-[#F1EFE8]">
                                                {asset.assetName}
                                            </span>
                                        </div>
                                    </td>

                                    <td className="px-5 py-4">
                                        <AssetTypeBadge
                                            type={asset.assetType}
                                        />
                                    </td>

                                    <td className="px-5 py-4 text-right text-sm tabular-nums text-[#A7ABB4]">
                                        {asset.quantity}
                                    </td>

                                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-semibold tabular-nums text-[#F1EFE8]">
                                        {formatCurrency(asset.investedAmount)}
                                    </td>

                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => onEdit(asset)}
                                                aria-label={`Edit ${asset.assetName}`}
                                                className="px-3 py-2 text-xs font-semibold text-[#91ACFA] transition hover:bg-[#315BDB]/15 hover:text-[#B5C7FF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#315BDB]"
                                            >
                                                Edit
                                            </button>

                                            <button
                                                onClick={() => onDelete(asset)}
                                                aria-label={`Delete ${asset.assetName}`}
                                                className="px-3 py-2 text-xs font-semibold text-[#E47D7D] transition hover:bg-[#E47D7D]/10 hover:text-[#F2A1A1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E47D7D]"
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
                <div className="border-t border-[#414751] px-5 py-3.5 sm:px-6">
                    <p className="text-xs text-[#A7ABB4]">
                        Showing{" "}
                        <span className="font-semibold text-[#F1EFE8]">
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
