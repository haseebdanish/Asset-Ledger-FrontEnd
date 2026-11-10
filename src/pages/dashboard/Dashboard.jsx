import { useEffect, useState } from "react";

import Navbar from "../../components/Navbar";
import PortfolioChart from "../../components/PortfolioChart";

import assetService from "../../services/assetService";
import authService from "../../services/authService";

import { formatCurrency } from "../../utils/formatCurrency";

function Dashboard() {
    const [user, setUser] = useState(null);
    const [summary, setSummary] = useState(null);
    const [allocation, setAllocation] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchUser = async () => {
        const data = await authService.getCurrentUser();
        setUser(data);
    };

    const fetchSummary = async () => {
        const data = await assetService.getSummary();
        setSummary(data);
    };

    const fetchAllocation = async () => {
        const data = await assetService.getAllocation();
        setAllocation(data);
    };

    const loadDashboard = async () => {
        try {
            setLoading(true);
            setError("");

            await Promise.all([
                fetchUser(),
                fetchSummary(),
                fetchAllocation(),
            ]);
        } catch (err) {
            console.error("Failed to load dashboard:", err);
            setError("Unable to load your portfolio. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDashboard();
    }, []);

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
                            Fetching your latest financial information.
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
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#493337] text-xl text-[#E47D7D]">
                            !
                        </div>

                        <h2 className="mt-5 text-xl font-semibold text-[#F1EFE8]">
                            We couldn't load your portfolio
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-[#A7ABB4]">
                            {error}
                        </p>

                        <button
                            onClick={loadDashboard}
                            className="mt-6 bg-[#315BDB] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#274BC0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#315BDB] focus-visible:ring-offset-2 focus-visible:ring-offset-[#2B3038]"
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
                        AssetLedger / Overview
                    </p>

                    <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[#F1EFE8] sm:text-4xl lg:text-5xl">
                        Good evening
                        {user?.userName ? `, ${user.userName}` : ""}.
                    </h1>

                    <p className="mt-3 max-w-xl text-sm leading-6 text-[#A7ABB4] sm:text-base">
                        Your financial picture, at a glance.
                        Here's an overview of your tracked investments.
                    </p>
                </section>

                {/* Error banner */}
                {error && (
                    <div
                        role="alert"
                        className="mb-6 flex items-center justify-between gap-4 border border-[#70464A] bg-[#392B30] px-4 py-3 text-sm text-[#E9A0A0]"
                    >
                        <p>{error}</p>

                        <button
                            onClick={() => setError("")}
                            aria-label="Dismiss error"
                            className="shrink-0 font-medium hover:text-white"
                        >
                            ✕
                        </button>
                    </div>
                )}

                {/* Portfolio summary */}
                <section aria-label="Portfolio summary">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

                        {/* Total invested */}
                        <div className="relative overflow-hidden border border-[#414751] bg-[#2B3038] p-6 sm:p-8 md:col-span-2">
                            <div className="pointer-events-none absolute -right-12 -top-16 h-64 w-64 rounded-full border border-[#8199E8]/10" />

                            <div className="pointer-events-none absolute -right-2 -top-8 h-44 w-44 rounded-full border border-[#8199E8]/10" />

                            <div className="relative">
                                <p className="text-sm font-medium text-[#A7ABB4]">
                                    Total invested
                                </p>

                                <p className="mt-5 break-words text-3xl font-semibold tracking-tight text-[#F1EFE8] sm:text-4xl lg:text-5xl">
                                    {formatCurrency(
                                        summary?.totalInvestment ?? 0
                                    )}
                                </p>

                                <div className="mt-8 flex items-center gap-3">
                                    <span className="flex h-8 w-8 items-center justify-center bg-[#315BDB]/20 text-[#8199E8]">
                                        ↗
                                    </span>

                                    <span className="text-xs text-[#A7ABB4]">
                                        Across your tracked investments
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Total assets */}
                        <div className="flex flex-col justify-between border border-[#414751] bg-[#2B3038] p-6 sm:p-8">
                            <div>
                                <p className="text-sm font-medium text-[#A7ABB4]">
                                    Total assets
                                </p>

                                <p className="mt-5 text-4xl font-semibold tracking-tight text-[#F1EFE8] sm:text-5xl">
                                    {summary?.totalAssets ?? 0}
                                </p>
                            </div>

                            <p className="mt-8 border-t border-[#414751] pt-4 text-xs text-[#A7ABB4]">
                                Individual investments tracked
                            </p>
                        </div>
                    </div>
                </section>

                {/* Portfolio allocation */}
                <section className="mt-12 sm:mt-16">
                    <div className="mb-6">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8199E8]">
                            Your investments
                        </p>

                        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#F1EFE8] sm:text-3xl">
                            Portfolio allocation
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-[#A7ABB4]">
                            Understand how your investments are distributed
                            across different asset classes.
                        </p>
                    </div>

                    <div className="border border-[#414751] bg-[#2B3038] p-4 sm:p-6 lg:p-8">
                        <PortfolioChart allocation={allocation} />
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

export default Dashboard;
