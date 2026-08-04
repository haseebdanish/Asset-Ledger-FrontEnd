function SummaryCard({ title, value }) {

    return (

        <div className="bg-white rounded-xl shadow p-6">

            <h3 className="text-slate-500 text-sm">
                {title}
            </h3>

            <p className="text-3xl font-bold mt-2">
                {value}
            </p>

        </div>

    );

}

export default SummaryCard;