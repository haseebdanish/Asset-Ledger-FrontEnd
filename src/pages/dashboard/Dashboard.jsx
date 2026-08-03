import { useEffect } from "react";

function Dashboard() {

    useEffect(() => {
        console.log("Dashboard loaded");
    }, []);

    return (
        <h1 className="text-4xl">
            Dashboard
        </h1>
    );
}

export default Dashboard;