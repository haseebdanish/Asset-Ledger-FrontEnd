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
    const [assets, setAssets] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [selectedType, setSelectedType] = useState("ALL");

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

    useEffect(() => {

        const fetchAssets = async () => {

            try {

                let data;

                if (searchKeyword.trim() !== "") {

                    data = await assetService.searchAssets(searchKeyword);

                } else if (selectedType !== "ALL") {

                    data = await assetService.getAssetsByType(selectedType);

                } else {

                    data = await assetService.getAssets();

                }

                setAssets(data);

            } catch (error) {

                console.error(error);

            }

        };

        fetchAssets();

    }, [searchKeyword, selectedType]);

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

                    <div className="mt-8 mb-4 flex justify-between items-center">

                        <input
                            type="text"
                            placeholder="🔍 Search assets..."
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                            className="w-80 px-4 py-2 border rounded-lg"
                        />

                        <select
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                            className="border rounded-lg px-4 py-2"
                        >

                            <option value="ALL">All</option>

                            <option value="STOCK">Stock</option>

                            <option value="CRYPTO">Crypto</option>

                            <option value="GOLD">Gold</option>

                            <option value="MUTUAL_FUND">Mutual Fund</option>

                        </select>

                    </div>

                </div>
                <AssetTable assets={assets} />
            </div>

        </div>

    );

}

export default Dashboard;