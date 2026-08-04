import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

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