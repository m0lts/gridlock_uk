// Function to save JWT token securely in an HTTP-only cookie
export const saveTokenToCookie = (token) => {
    document.cookie = `jwtToken=${token}; path=/`;
};

// Function to retrieve JWT token from cookies
export const getTokenFromCookie = () => {
    const cookieString = document.cookie;
    const cookies = cookieString.split('; ').reduce((acc, cookie) => {
        const [name, value] = cookie.split('=');
        acc[name] = value;
        return acc;
    }, {});
    return cookies.jwtToken || '';
};

// Function to remove JWT token from cookie on logout
export const removeTokenFromCookie = () => {
    document.cookie = 'jwtToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT';
};