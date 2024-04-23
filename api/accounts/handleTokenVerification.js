import jwt from 'jsonwebtoken';
const secret = process.env.JWT_SECRET;

export default function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const cookies = req.headers.cookie;
    let jwtToken = '';
    if (cookies) {
        cookies.split(';').forEach(cookie => {
            const parts = cookie.split('=');
            if (parts[0].trim() === 'jwtToken') {
                jwtToken = parts[1];
            }
        });
    }

    try {
        if (!jwtToken) {
            return res.status(201).json({ message: 'User not logged in' });
        }

        const decoded = jwt.verify(jwtToken, secret);
        return res.status(200).json({ user: decoded });
    } catch (error) {
        return res.status(403).json({ message: 'Token is invalid' });
    }
}