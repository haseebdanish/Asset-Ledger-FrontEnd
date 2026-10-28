import api from "../api/axios";

const authService = {

login: async (credentials) => {
    const response = await api.post(
        "/auth/login",
        credentials,
        {
            headers: {
                "Content-Type": "application/json",
            },
        }
    );

    return response.data;
},


    register : async (userData) => {

    const response = await api.post(
        "/auth/register",
        userData
    );

    return response.data;
},

    getCurrentUser : async () => {

    const response = await api.get("/users/me", {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });

    return response.data;
}
}

export default authService;