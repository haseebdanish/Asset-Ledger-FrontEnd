import api from "../api/axios";

const assetService = {

    getAssets: async () => {

        const response = await api.get("/assets", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });

        return response.data;
    },

    getSummary: async () => {

        const response = await api.get("/assets/summary", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });

        return response.data;
    },

    getAnalytics: async () => {

        const response = await api.get("/assets/analytics", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });

        return response.data;
    },

    getAllocation: async () => {

        const response = await api.get("/assets/allocation", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });

        return response.data;
    },

    searchAssets: async (keyword) => {

        const response = await api.get(
            `/assets/search?keyword=${keyword}`,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            }
        );

        return response.data;
    },

    getAssetsByType: async (assetType) => {

        const response = await api.get(
            `/assets/type/${assetType}`,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            }
        );

        return response.data;
    },

    addAsset: async (assetData) => {

        const response = await api.post(
            "/assets",
            assetData,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            }
        );

        return response.data;
    },

};

export default assetService;