import { Routes, Route } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/dashboard/Dashboard";
import Portfolio from "./pages/portfolio/Portfolio";
import MyAssets from "./pages/assets/MyAssets";
import NotFound from "./pages/NotFound";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/portfolio"
                    element={
                        <ProtectedRoute>
                            <Portfolio />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/assets"
                    element={
                        <ProtectedRoute>
                            <MyAssets />
                        </ProtectedRoute>
                    }
                />

                <Route path="*" element={<NotFound />} />
            </Routes>

            <Analytics />
        </>
    );
}

export default App;
