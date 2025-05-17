
export const setToken = (token) => {
    localStorage.setItem('token', token);
}

export const getToken = () => {
    return localStorage.getItem('token');
}

export const signout = () => {
    localStorage.removeItem('token')
    window.location.reload();
}