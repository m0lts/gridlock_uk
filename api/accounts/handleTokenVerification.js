import jwt from 'jsonwebtoken';
const secret = process.env.JWT_SECRET;

export default async function handler(request, response) {
    const token = request.headers.authorization || '';

    try {
        if (!token) {
            return response.status(401).json({ message: 'No token provided' });
        }

        const actualToken = token.startsWith('Bearer ') ? token.slice(7) : token;

        const decoded = jwt.verify(actualToken, secret);
        return response.status(200).json({ message: 'Token is valid', user: decoded });

    } catch (error) {
        return response.status(403).json({ message: 'Token is invalid' });
    }
};