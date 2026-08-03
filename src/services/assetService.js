import api from "../api/axios";

const assetService = {

    getAssets: async (token) => {

        const response = await api.get("/assets", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    },

    getSummary: async (token) => {

        const response = await api.get("/assets/summary", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    },

    getAnalytics: async (token) => {

        const response = await api.get("/assets/analytics", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    },

    getAllocation: async (token) => {

        const response = await api.get("/assets/allocation", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    },

    searchAssets: async (token, keyword) => {

        const response = await api.get(
            `/assets/search?keyword=${keyword}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return response.data;
    },

    getAssetsByType: async (token, assetType) => {

        const response = await api.get(
            `/assets/type/${assetType}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return response.data;
    }

};

export default assetService;