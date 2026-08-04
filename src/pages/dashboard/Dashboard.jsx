import Navbar from "../../components/Navbar";
import SummaryCard from "../../components/SummaryCard";

function Dashboard() {

    return (

        <div className="min-h-screen bg-slate-100">

            <Navbar />

            <div className="max-w-7xl mx-auto px-6 py-8">

                <h2 className="text-3xl font-bold mb-8">
                    Welcome Back 👋
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                    <SummaryCard
                        title="Net Worth"
                        value="₹0"
                    />

                    <SummaryCard
                        title="Assets"
                        value="0"
                    />

                    <SummaryCard
                        title="Investment"
                        value="₹0"
                    />

                    <SummaryCard
                        title="Asset Types"
                        value="0"
                    />

                </div>

            </div>

        </div>

    );

}

export default Dashboard;