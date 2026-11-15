import { useEffect, useState } from "react";

import Navbar from "../../components/Navbar";
import assetService from "../../services/assetService";
import { formatCurrency } from "../../utils/formatCurrency";

const categories = [
    {
        type: "STOCK",
        label: "Stocks",
        summaryField: "stockInvestment",
        color: "#7194F5",
    },
    {
        type: "MUTUAL_FUND",
        label: "Mutual Funds",
        summaryField: "mutualFundInvestment",
        color: "#6FB9AA",
    },
    {
        type: "CRYPTO",
        label: "Crypto",
        summaryField: "cryptoInvestment",
        color: "#B18AE8",
    },
    {
        type: "GOLD",
        label: "Gold",
        summaryField: "goldInvestment",
        color: "#D6B66D",
    },
    {
        type: "BANK",
        label: "Bank",
        summaryField: "bankInvestment",
        color: "#78A9C9",
    },
    {
        type: "REAL_ESTATE",
        label: "Real Estate",
        summaryField: "realEstateInvestment",
        color: "#D58E79",
    },
];

function Portfolio() {
    const [summary, setSummary] = useState(null);
    const [allocation, setAllocation] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadPortfolio = async () => {
        try {
            setLoading(true);
            setError("");

            const [summaryData, allocationData] = await Promise.all([
                assetService.getSummary(),
                assetService.getAllocation(),
            ]);

            setSummary(summaryData);
            setAllocation(allocationData);
        } catch (err) {
            console.error("Failed to load portfolio:", err);
            setError("Unable to load your portfolio. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPortfolio();
    }, []);

    const totalInvestment = Number(summary?.totalInvestment ?? 0);

    const activeCategories = categories.filter(
        (category) => Number(summary?.[category.summaryField] ?? 0) > 0
    );

    const getPercentage = (category) => {
        const allocationItem = allocation.find(
            (item) => item.assetType === category.type
        );

        if (allocationItem?.percentage != null) {
            return Number(allocationItem.percentage);
        }

        const investment = Number(
            summary?.[category.summaryField] ?? 0
        );

        return totalInvestment > 0
            ? (investment / totalInvestment) * 100
            : 0;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#202329]">
                <Navbar />

                <main className="flex min-h-[75vh] items-center justify-center px-4">
                    <div className="text-center">
                        <div className="mx-auto mb-5 h-9 w-9 animate-spin rounded-full border-[3px] border-[#414751] border-t-[#315BDB]" />

                        <h2 className="text-lg font-semibold text-[#F1EFE8]">
                            Preparing your portfolio
                        </h2>

                        <p className="mt-2 text-sm text-[#A7ABB4]">
                            Fetching your investment breakdown.
                        </p>
                    </div>
                </main>
            </div>
        );
    }

    if (error && !summary) {
        return (
            <div className="min-h-screen bg-[#202329]">
                <Navbar />

                <main className="flex min-h-[75vh] items-center justify-center px-4">
                    <div className="w-full max-w-md border border-[#414751] bg-[#2B3038] p-8 text-center">
                        <h2 className="text-xl font-semibold text-[#F1EFE8]">
                            Couldn't load your portfolio
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-[#A7ABB4]">
                            {error}
                        </p>

                        <button
                            onClick={loadPortfolio}
                            className="mt-6 bg-[#315BDB] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#274BC0]"
                        >
                            Try again
                        </button>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#202329]">
            <Navbar />

            <main className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 sm:py-10 lg:px-10">

                {/* Page heading */}
                <section className="mb-10">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8199E8]">
                        AssetLedger / Portfolio
                    </p>

                    <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[#F1EFE8] sm:text-4xl lg:text-5xl">
                        Your portfolio.
                    </h1>

                    <p className="mt-3 max-w-xl text-sm leading-6 text-[#A7ABB4] sm:text-base">
                        A closer look at where your money is invested
                        and how your portfolio is distributed.
                    </p>
                </section>

                {/* Error banner */}
                {error && (
                    <div
                        role="alert"
                        className="mb-6 border border-[#70464A] bg-[#392B30] px-4 py-3 text-sm text-[#E9A0A0]"
                    >
                        {error}
                    </div>
                )}

                {/* Portfolio overview */}
                <section className="grid grid-cols-1 gap-4 md:grid-cols-3">

                    <div className="border border-[#414751] bg-[#2B3038] p-6 sm:p-8 md:col-span-2">
                        <p className="text-sm font-medium text-[#A7ABB4]">
                            Total invested
                        </p>

                        <p className="mt-5 break-words text-3xl font-semibold tracking-tight text-[#F1EFE8] sm:text-4xl lg:text-5xl">
                            {formatCurrency(totalInvestment)}
                        </p>

                        <p className="mt-6 text-xs text-[#A7ABB4]">
                            Across all your tracked investment categories
                        </p>
                    </div>

                    <div className="flex flex-col justify-between border border-[#414751] bg-[#2B3038] p-6 sm:p-8">
                        <div>
                            <p className="text-sm font-medium text-[#A7ABB4]">
                                Total assets
                            </p>

                            <p className="mt-5 text-4xl font-semibold tracking-tight text-[#F1EFE8] sm:text-5xl">
                                {summary?.totalAssets ?? 0}
                            </p>
                        </div>

                        <p className="mt-6 border-t border-[#414751] pt-4 text-xs text-[#A7ABB4]">
                            Individual investments tracked
                        </p>
                    </div>
                </section>

                {/* Investment categories */}
                <section className="mt-12 sm:mt-16">
                    <div className="mb-6">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8199E8]">
                            Breakdown
                        </p>

                        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#F1EFE8] sm:text-3xl">
                            Investment categories
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-[#A7ABB4]">
                            See how much you have invested in each asset class.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {categories.map((category) => {
                            const investment = Number(
                                summary?.[category.summaryField] ?? 0
                            );

                            const percentage = getPercentage(category);

                            return (
                                <div
                                    key={category.type}
                                    className="border border-[#414751] bg-[#2B3038] p-5 transition hover:border-[#596373] sm:p-6"
                                >
                                    <div className="flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-3">
                                            <span
                                                className="h-3 w-3 rounded-sm"
                                                style={{
                                                    backgroundColor: category.color,
                                                }}
                                            />

                                            <h3 className="text-sm font-medium text-[#F1EFE8]">
                                                {category.label}
                                            </h3>
                                        </div>

                                        <span className="text-xs font-semibold tabular-nums text-[#A7ABB4]">
                                            {percentage.toLocaleString("en-IN", {
                                                maximumFractionDigits: 1,
                                            })}
                                            %
                                        </span>
                                    </div>

                                    <p className="mt-6 break-words text-2xl font-semibold tracking-tight text-[#F1EFE8]">
                                        {formatCurrency(investment)}
                                    </p>

                                    <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-[#414751]">
                                        <div
                                            className="h-full rounded-full transition-all duration-500"
                                            style={{
                                                width: `${Math.min(
                                                    Math.max(percentage, 0),
                                                    100
                                                )}%`,
                                                backgroundColor: category.color,
                                            }}
                                        />
                                    </div>

                                    <p className="mt-3 text-xs text-[#A7ABB4]">
                                        {investment > 0
                                            ? "Amount invested"
                                            : "No investments yet"}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Detailed allocation */}
                <section className="mt-12 sm:mt-16">
                    <div className="mb-6">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8199E8]">
                            Portfolio composition
                        </p>

                        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#F1EFE8] sm:text-3xl">
                            Allocation details
                        </h2>
                    </div>

                    <div className="overflow-hidden border border-[#414751] bg-[#2B3038]">
                        <div className="grid grid-cols-[minmax(0,1fr)_auto_auto] gap-4 border-b border-[#414751] px-5 py-4 text-xs font-medium text-[#A7ABB4] sm:px-6">
                            <span>Asset class</span>
                            <span className="text-right">Invested</span>
                            <span className="w-14 text-right sm:w-20">
                                Share
                            </span>
                        </div>

                        {activeCategories.length > 0 ? (
                            activeCategories.map((category) => {
                                const investment = Number(
                                    summary?.[category.summaryField] ?? 0
                                );

                                const percentage = getPercentage(category);

                                return (
                                    <div
                                        key={category.type}
                                        className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-4 border-b border-[#414751] px-5 py-5 last:border-b-0 sm:px-6"
                                    >
                                        <div className="flex min-w-0 items-center gap-3">
                                            <span
                                                className="h-3 w-3 shrink-0 rounded-sm"
                                                style={{
                                                    backgroundColor: category.color,
                                                }}
                                            />

                                            <span className="truncate text-sm font-medium text-[#F1EFE8]">
                                                {category.label}
                                            </span>
                                        </div>

                                        <span className="whitespace-nowrap text-right text-sm font-medium tabular-nums text-[#F1EFE8]">
                                            {formatCurrency(investment)}
                                        </span>

                                        <span className="w-14 text-right text-sm tabular-nums text-[#A7ABB4] sm:w-20">
                                            {percentage.toLocaleString("en-IN", {
                                                maximumFractionDigits: 1,
                                            })}
                                            %
                                        </span>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="px-5 py-12 text-center">
                                <p className="text-sm font-medium text-[#F1EFE8]">
                                    No investments to display
                                </p>

                                <p className="mt-2 text-sm text-[#A7ABB4]">
                                    Your allocation details will appear here
                                    once you add investments.
                                </p>
                            </div>
                        )}
                    </div>
                </section>

                {/* Footer */}
                <footer className="mt-16 border-t border-[#414751] py-6">
                    <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
                        <p className="text-xs font-semibold tracking-[0.15em] text-[#A7ABB4]">
                            ASSETLEDGER
                        </p>

                        <p className="text-xs text-[#777F8B]">
                            Your finances, in focus.
                        </p>
                    </div>
                </footer>

            </main>
        </div>
    );
}

export default Portfolio;
