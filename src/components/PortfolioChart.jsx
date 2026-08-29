import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

import { formatCurrency } from "../utils/formatCurrency";

function PortfolioChart({ allocation }) {

    const chartData = allocation.filter(
        (item) => item.investment > 0
    );

    const formatAssetType = (type) => {

        return type
            .replace("_", " ")
            .toLowerCase()
            .replace(/\b\w/g, (char) => char.toUpperCase());

    };

    return (

        <div className="bg-white rounded-xl shadow mt-8 p-6">

            <h2 className="text-2xl font-semibold mb-6">
                Portfolio Allocation
            </h2>

            {chartData.length > 0 ? (

                <div className="w-full h-80">

                    <ResponsiveContainer
                        width="100%"
                        height="100%"
                    >

                        <PieChart>

                            <Pie
                                data={chartData}
                                dataKey="investment"
                                nameKey="assetType"
                                cx="50%"
                                cy="50%"
                                outerRadius={110}
                                label={({ assetType, percentage }) =>
                                    `${formatAssetType(assetType)} ${percentage}%`
                                }
                            >

                                {chartData.map((entry, index) => (

                                    <Cell
                                        key={`cell-${index}`}
                                    />

                                ))}

                            </Pie>

                            <Tooltip
                                formatter={(value, name) => [
                                    formatCurrency(value),
                                    formatAssetType(name),
                                ]}
                            />

                            <Legend
                                formatter={(value) =>
                                    formatAssetType(value)
                                }
                            />

                        </PieChart>

                    </ResponsiveContainer>

                </div>

            ) : (

                <div className="text-center py-12 text-slate-500">

                    No portfolio allocation data available.

                </div>

            )}

        </div>

    );

}

export default PortfolioChart;