import api from "../api/axios";

const assetService = {
    getAssets: async () => {
        const response = await api.get("/assets");
        return response.data;
    },

    getSummary: async () => {
        const response = await api.get("/assets/summary");
        return response.data;
    },

    getAnalytics: async () => {
        const response = await api.get("/assets/analytics");
        return response.data;
    },

    getAllocation: async () => {
        const response = await api.get("/assets/allocation");
        return response.data;
    },

    searchAssets: async (keyword) => {
        const response = await api.get("/assets/search", {
            params: { keyword },
        });
        return response.data;
    },

    getAssetsByType: async (assetType) => {
        const response = await api.get(`/assets/type/${assetType}`);
        return response.data;
    },

    addAsset: async (assetData) => {
        const response = await api.post("/assets", assetData);
        return response.data;
    },

    updateAsset: async (id, assetData) => {
        const response = await api.put(`/assets/${id}`, assetData);
        return response.data;
    },

    deleteAsset: async (id) => {
        const response = await api.delete(`/assets/${id}`);
        return response.data;
    },
};

export default assetService;
