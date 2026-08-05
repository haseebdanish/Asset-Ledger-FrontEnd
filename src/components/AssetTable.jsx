import { useEffect, useState } from "react";
import assetService from "../services/assetService";
import { formatCurrency } from "../utils/formatCurrency";

function AssetTable() {

    const [assets, setAssets] = useState([]);

    useEffect(() => {

        const fetchAssets = async () => {

            try {

                const data = await assetService.getAssets();

                setAssets(data);

            } catch (error) {

                console.error(error);

            }

        };

        fetchAssets();

    }, []);

    return (

        <div className="bg-white rounded-xl shadow mt-8 overflow-hidden">

            <div className="px-6 py-4 border-b">

                <h2 className="text-2xl font-semibold">
                    Portfolio
                </h2>

            </div>

            <table className="w-full">

                <thead className="bg-slate-100">

                <tr>

                    <th className="text-left px-6 py-3">Asset</th>

                    <th className="text-left px-6 py-3">Type</th>

                    <th className="text-left px-6 py-3">Quantity</th>

                    <th className="text-left px-6 py-3">Investment</th>

                </tr>

                </thead>

                <tbody>

                {
                    assets.map(asset => (

                        <tr
                            key={asset.id}
                            className="border-b hover:bg-slate-50"
                        >

                            <td className="px-6 py-4">
                                {asset.assetName}
                            </td>

                            <td className="px-6 py-4">
                                {asset.assetType}
                            </td>

                            <td className="px-6 py-4">
                                {asset.quantity}
                            </td>

                            <td className="px-6 py-4">
                                {formatCurrency(asset.investedAmount)}
                            </td>

                        </tr>

                    ))
                }

                </tbody>

            </table>

        </div>

    );

}

export default AssetTable;