export const getToken = () => {
    return localStorage.getItem("token") || null;
}

export const getUserId = () => {
    return localStorage.getItem("userId") || null;
}