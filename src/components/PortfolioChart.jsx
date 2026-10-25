
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

import { formatCurrency } from "../utils/formatCurrency";

const allocationColors = {
    STOCK: "#52796f",
    CRYPTO: "#c5a56b",
    GOLD: "#d9bd68",
    MUTUAL_FUND: "#8187b7",
    BANK: "#6b9bb5",
    REAL_ESTATE: "#bc8b76",
};

const fallbackColors = [
    "#52796f",
    "#c5a56b",
    "#8187b7",
    "#6b9bb5",
    "#bc8b76",
    "#91a68e",
];

function formatAssetType(type = "") {
    return type
        .replaceAll("_", " ")
        .toLowerCase()
        .replace(/\b\w/g, (char) => char.toUpperCase());
}

function PortfolioChart({ allocation = [] }) {
    const chartData = allocation.filter(
        (item) => Number(item.investment) > 0
    );

    const totalInvestment = chartData.reduce(
        (total, item) => total + Number(item.investment),
        0
    );

    const getColor = (assetType, index) =>
        allocationColors[assetType] ??
        fallbackColors[index % fallbackColors.length];

    return (
        <div className="overflow-hidden rounded-2xl border border-[#e6e8e2] bg-white">
            {/* Section heading */}
            <div className="border-b border-[#e9ebe6] px-5 py-5 sm:px-6">
                <h3 className="text-base font-semibold tracking-tight text-[#172b27]">
                    Where your money is invested
                </h3>

                <p className="mt-1 text-sm text-[#78817c]">
                    A breakdown of your investments by asset class.
                </p>
            </div>

            {chartData.length > 0 ? (
                <div className="grid grid-cols-1 items-center gap-4 p-5 sm:p-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-8">
                    {/* Donut chart */}
                    <div className="relative mx-auto h-[270px] w-full max-w-[360px] sm:h-[310px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    dataKey="investment"
                                    nameKey="assetType"
                                    cx="50%"
                                    cy="50%"
                                    innerRadius="65%"
                                    outerRadius="83%"
                                    paddingAngle={chartData.length > 1 ? 3 : 0}
                                    stroke="none"
                                    cornerRadius={4}
                                    isAnimationActive={true}
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell
                                            key={entry.assetType}
                                            fill={getColor(
                                                entry.assetType,
                                                index
                                            )}
                                        />
                                    ))}
                                </Pie>


                                <Tooltip
                                    formatter={(value, name) => [
                                        formatCurrency(Number(value)),
                                        formatAssetType(String(name)),
                                    ]}
                                    contentStyle={{
                                        borderRadius: "12px",
                                        border: "1px solid #e6e8e2",
                                        boxShadow: "0 8px 24px rgba(23,43,39,0.08)",
                                        padding: "12px 16px",
                                        fontSize: "12px",
                                        minWidth: "190px",
                                        backgroundColor: "#ffffff",
                                    }}
                                    itemStyle={{
                                        color: "#34433d",
                                        fontWeight: 500,
                                        whiteSpace: "nowrap",
                                    }}
                                    labelStyle={{
                                        color: "#172b27",
                                        fontWeight: 600,
                                        marginBottom: "6px",
                                    }}
                                    wrapperStyle={{
                                        zIndex: 20,
                                        outline: "none",
                                    }}
                                />

                            </PieChart>
                        </ResponsiveContainer>

                        {/* Center total */}
                        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-xs font-medium text-[#78817c]">
                                Total invested
                            </span>

                            <span className="mt-2 max-w-[85%] break-words text-center text-xl font-semibold tracking-tight text-[#172b27] sm:text-2xl">
                                {formatCurrency(totalInvestment)}
                            </span>

                            <span className="mt-1 text-xs text-[#89918c]">
                                {chartData.length}{" "}
                                {chartData.length === 1
                                    ? "asset class"
                                    : "asset classes"}
                            </span>
                        </div>
                    </div>

                    {/* Allocation legend */}
                    <div className="min-w-0">
                        <div className="mb-4 hidden grid-cols-[minmax(0,1fr)_auto] gap-4 border-b border-[#eef0eb] pb-3 text-xs font-medium text-[#89918c] sm:grid">
                            <span>Asset class</span>
                            <span className="text-right">Allocation</span>
                        </div>

                        <div className="space-y-1">
                            {chartData.map((item, index) => {
                                const percentage =
                                    totalInvestment > 0
                                        ? (Number(item.investment) /
                                            totalInvestment) *
                                        100
                                        : 0;

                                return (
                                    <div
                                        key={item.assetType}
                                        className="rounded-xl px-3 py-3 transition hover:bg-[#fafbf8] sm:px-2"
                                    >
                                        <div className="flex items-center justify-between gap-3">
                                            <div className="flex min-w-0 items-center gap-3">
                                                <span
                                                    className="h-3 w-3 shrink-0 rounded-sm"
                                                    style={{
                                                        backgroundColor:
                                                            getColor(
                                                                item.assetType,
                                                                index
                                                            ),
                                                    }}
                                                />

                                                <span className="truncate text-sm font-medium text-[#34433d]">
                                                    {formatAssetType(
                                                        item.assetType
                                                    )}
                                                </span>
                                            </div>

                                            <span className="shrink-0 text-sm font-semibold tabular-nums text-[#27352f]">
                                                {percentage.toLocaleString(
                                                    "en-IN",
                                                    {
                                                        maximumFractionDigits: 1,
                                                    }
                                                )}
                                                %
                                            </span>
                                        </div>

                                        <div className="mt-2 flex items-center justify-between gap-3 pl-6">
                                            <span className="truncate text-xs text-[#89918c]">
                                                {formatCurrency(
                                                    Number(item.investment)
                                                )}
                                            </span>
                                        </div>

                                        <div className="ml-6 mt-2 h-1.5 overflow-hidden rounded-full bg-[#edf0ea]">
                                            <div
                                                className="h-full rounded-full transition-all duration-500"
                                                style={{
                                                    width: `${Math.min(
                                                        percentage,
                                                        100
                                                    )}%`,
                                                    backgroundColor: getColor(
                                                        item.assetType,
                                                        index
                                                    ),
                                                }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="px-5 py-14 text-center sm:px-6">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#edf2ed] text-[#52796f]">
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            className="h-6 w-6"
                            aria-hidden="true"
                        >
                            <circle cx="12" cy="12" r="9" />
                            <path
                                d="M12 3v9h9"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>

                    <h4 className="mt-4 text-sm font-semibold text-[#34433d]">
                        Your allocation will appear here
                    </h4>

                    <p className="mx-auto mt-1 max-w-sm text-sm leading-6 text-[#78817c]">
                        Add investments to see how your portfolio is
                        distributed across asset classes.
                    </p>
                </div>
            )}
        </div>
    );
}

export default PortfolioChart;
