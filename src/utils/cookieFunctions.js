// Function to save JWT token securely in an HTTP-only cookie
export const saveTokenToCookie = (token) => {
    document.cookie = `jwtToken=${token}; path=/; Secure; SameSite=Strict`;
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
    document.cookie = 'jwtToken=; path=/; Secure; SameSite=Strict; Expires=Thu, 01 Jan 1970 00:00:00 GMT';
};

// Function to decode JWT token
export const decodeToken = (token) => {
    try {
        const tokenParts = token.split('.');
        const encodedPayload = tokenParts[1];
        const decodedPayload = atob(encodedPayload);
        return JSON.parse(decodedPayload);
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
};