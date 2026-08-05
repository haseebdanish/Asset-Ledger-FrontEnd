import Navbar from "../../components/Navbar";
import SummaryCard from "../../components/SummaryCard";
import { useEffect, useState } from "react";
import authService from "../../services/authService";
import assetService from "../../services/assetService";
import { formatCurrency } from "../../utils/formatCurrency";
import AssetTable from "../../components/AssetTable";

function Dashboard() {

    const [user, setUser] = useState(null);
    const [summary, setSummary] = useState(null);

    useEffect(() => {

        const fetchUser = async () => {

            try {

                const data = await authService.getCurrentUser();

                setUser(data);

            } catch (error) {

                console.error(error);

            }

        };

        fetchUser();

    }, []);

    useEffect(() => {

        const fetchSummary = async () => {

            try {

                const data = await assetService.getSummary();

                setSummary(data);

            } catch (error) {

                console.error(error);

            }

        };

        fetchSummary();

    }, []);

    return (

        <div className="min-h-screen bg-slate-100">

            <Navbar />

            <div className="max-w-7xl mx-auto px-6 py-8">

                <h2 className="text-3xl font-bold mb-8">
                    Welcome Back{user ? `, ${user.userName}` : ""} 👋
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                    <SummaryCard
                        title="Total Investment"
                        value={formatCurrency(summary?.totalInvestment)}
                    />

                    <SummaryCard
                        title="Total Assets"
                        value={summary?.totalAssets ?? 0}
                    />

                    <SummaryCard
                        title="Stocks"
                        value={formatCurrency(summary?.stockInvestment)}
                    />


                    <SummaryCard
                        title="Crypto"
                        value={formatCurrency(summary?.cryptoInvestment)}
                    />

                </div>
                <AssetTable />
            </div>

        </div>

    );

}

export default Dashboard;